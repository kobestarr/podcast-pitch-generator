import { NextRequest, NextResponse } from 'next/server';
import { generatePitches, formatFollowers, PitchInputs } from '@/lib/ai';
import { 
  SCORING_RULES, 
  calculatePitchScore, 
  getAllFieldStatuses,
  type FormData as ScoringFormData 
} from '@/lib/scoring';

// Rate limiting (simple in-memory for demo, use Redis for production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // 5 generations per day
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours

// Minimum score required to generate pitches (50% = 70 points out of 140)
const MIN_SCORE_PERCENTAGE = 50;

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    // New window
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT - 1, resetAt: now + RATE_LIMIT_WINDOW };
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT - record.count, resetAt: record.resetAt };
}

// Input validation using shared scoring library
function validateInputs(body: any): { 
  valid: boolean; 
  errors: string[]; 
  score?: number;
  incompleteFields?: string[];
  data?: PitchInputs;
  formData?: ScoringFormData;
} {
  const errors: string[] = [];
  
  // Build FormData object for scoring validation
  const formData: ScoringFormData = {
    firstName: body.firstName?.trim() || '',
    lastName: body.lastName?.trim() || '',
    title: Array.isArray(body.title) ? body.title.filter(Boolean) : [],
    expertise: body.expertise?.trim() || '',
    credibility: body.credibility?.trim() || '',
    podcastName: body.podcastName?.trim() || '',
    hostName: body.hostName?.trim() || '',
    guestName: body.guestName?.trim() || '',
    episodeTopic: body.episodeTopic?.trim() || '',
    whyPodcast: body.whyPodcast?.trim() || '',
    socialPlatform: body.socialPlatform?.trim() || '',
    followers: body.followers?.trim() || '',
    topic1: body.topic1?.trim() || '',
    topic2: body.topic2?.trim() || '',
    topic3: body.topic3?.trim() || '',
    uniqueAngle: body.uniqueAngle?.trim() || '',
    audienceBenefit: body.audienceBenefit?.trim() || '',
  };

  // Use shared scoring rules to validate required fields
  const requiredFields = SCORING_RULES.filter(rule => !rule.isOptional);
  const incompleteFields: string[] = [];

  for (const rule of requiredFields) {
    if (!rule.validate(formData)) {
      incompleteFields.push(rule.label);
      errors.push(`${rule.label} is required${rule.hint ? ` (${rule.hint})` : ''}`);
    }
  }

  // Calculate score
  const score = calculatePitchScore(formData);

  // Check minimum score requirement
  if (score < MIN_SCORE_PERCENTAGE) {
    errors.push(
      `Pitch strength is too low (${score}%). Please complete more fields to reach at least ${MIN_SCORE_PERCENTAGE}% before generating pitches.`
    );
  }

  if (errors.length > 0) {
    return { 
      valid: false, 
      errors, 
      score,
      incompleteFields 
    };
  }

  // Build PitchInputs with defaults
  // Combine firstName and lastName for AI generation
  const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(' ').trim();
  
  // Combine multiple titles for AI prompt (e.g., "CEO, Founder" or "CEO and Founder")
  const titlesCombined = formData.title.length > 0 
    ? formData.title.join(', ')
    : '';
  
  const inputs: PitchInputs = {
    name: fullName,
    title: titlesCombined,
    expertise: formData.expertise,
    credibility: formData.credibility,
    podcastName: formData.podcastName,
    hostName: formData.hostName,
    guestName: formData.guestName,
    episodeTopic: formData.episodeTopic,
    whyPodcast: formData.whyPodcast,
    socialPlatform: formData.socialPlatform,
    roundedFollowers: '',
    topic1: formData.topic1,
    topic2: formData.topic2,
    topic3: formData.topic3,
    uniqueAngle: formData.uniqueAngle,
    audienceBenefit: formData.audienceBenefit,
  };

  // Calculate rounded followers if provided
  if (formData.followers && !isNaN(parseInt(formData.followers))) {
    const followers = parseInt(formData.followers);
    inputs.roundedFollowers = formatFollowers(followers);
  }

  return { valid: true, errors: [], score, data: inputs, formData };
}

export async function POST(request: NextRequest) {
  // Default headers for all responses
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limit
    const rateLimit = checkRateLimit(ip);
    
    // Add rate limit headers
    const headers = {
      ...defaultHeaders,
      'X-RateLimit-Limit': RATE_LIMIT.toString(),
      'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      'X-RateLimit-Reset': Math.ceil(rateLimit.resetAt / 1000).toString(),
    };

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again tomorrow.',
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
        },
        { status: 429, headers }
      );
    }

    // Parse and validate request body
    let body: any;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400, headers }
      );
    }

    const validation = validateInputs(body);

    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          errors: validation.errors,
          score: validation.score,
          incompleteFields: validation.incompleteFields,
          message: validation.score !== undefined 
            ? `Current pitch strength: ${validation.score}%. Please complete more fields to reach at least ${MIN_SCORE_PERCENTAGE}%.`
            : 'Please complete all required fields.'
        },
        { status: 400, headers: { ...defaultHeaders, ...headers } }
      );
    }

    // Check API key availability
    if (!process.env.ANTHROPIC_API_KEY && process.env.AI_PROVIDER !== 'openai') {
      console.error('Missing ANTHROPIC_API_KEY');
      return NextResponse.json(
        { 
          error: 'AI service not configured. Please set ANTHROPIC_API_KEY in your .env.local file.',
          message: process.env.NODE_ENV === 'development' 
            ? 'Create a .env.local file with: ANTHROPIC_API_KEY=your_key_here'
            : 'Please configure your API key.'
        },
        { status: 500, headers }
      );
    }

    // Generate pitches
    const startTime = Date.now();
    let pitches;
    try {
      pitches = await generatePitches(validation.data!);
    } catch (aiError: any) {
      console.error('AI generation error:', aiError);
      
      // Handle specific Anthropic API errors
      if (aiError?.status === 401) {
        return NextResponse.json(
          { error: 'AI service authentication failed. Please check API configuration.' },
          { status: 500, headers }
        );
      }
      
      if (aiError?.status === 429) {
        return NextResponse.json(
          { error: 'AI service rate limit exceeded. Please try again in a moment.' },
          { status: 503, headers }
        );
      }

      // Handle JSON parsing errors
      if (aiError?.message?.includes('JSON') || aiError?.message?.includes('parse')) {
        return NextResponse.json(
          { error: 'Failed to parse AI response. Please try again.' },
          { status: 500, headers }
        );
      }

      // Generic error
      return NextResponse.json(
        { 
          error: 'Failed to generate pitches. Please try again.',
          message: process.env.NODE_ENV === 'development' ? aiError?.message : undefined
        },
        { status: 500, headers }
      );
    }
    
    const generationTime = Date.now() - startTime;

    // Return successful response
    return NextResponse.json(
      {
        success: true,
        generationTimeMs: generationTime,
        rateLimit: {
          remaining: rateLimit.remaining,
          resetAt: new Date(rateLimit.resetAt).toISOString(),
        },
        pitches,
      },
      { status: 200, headers }
    );

  } catch (error: any) {
    console.error('Pitch generation error:', error);
    
    // Ensure we always return JSON, even for unexpected errors
    const errorHeaders = {
      'Content-Type': 'application/json',
    };

    // Handle network errors
    if (error?.message?.includes('fetch') || error?.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Network error. Please check your connection and try again.' },
        { status: 503, headers: errorHeaders }
      );
    }

    // Handle timeout errors
    if (error?.name === 'TimeoutError' || error?.code === 'ETIMEDOUT') {
      return NextResponse.json(
        { error: 'Request timed out. Please try again.' },
        { status: 504, headers: errorHeaders }
      );
    }

    // Handle validation errors that might have slipped through
    if (error?.message?.includes('validation') || error?.message?.includes('required')) {
      return NextResponse.json(
        { 
          error: 'Validation error',
          message: error.message,
        },
        { status: 400, headers: errorHeaders }
      );
    }
    
    // Generic error handler - always return JSON
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred. Please try again.',
        message: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500, headers: errorHeaders }
    );
  }
}

// Optional: GET endpoint for health checks
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    provider: process.env.AI_PROVIDER || 'anthropic',
    rateLimit: RATE_LIMIT,
  });
}
