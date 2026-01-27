import { NextRequest, NextResponse } from 'next/server';
import { generatePitches, formatFollowers, PitchInputs } from '@/lib/ai';

// Rate limiting (simple in-memory for demo, use Redis for production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // 5 generations per day
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours

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

// Input validation
function validateInputs(body: any): { valid: boolean; errors: string[]; data?: PitchInputs } {
  const errors: string[] = [];
  
  // Required fields
  const required = ['name', 'title', 'expertise', 'credibility', 'podcastName', 'hostName', 'guestName', 'episodeTopic', 'whyPodcast', 'topic1', 'uniqueAngle'];
  
  for (const field of required) {
    if (!body[field] || (typeof body[field] === 'string' && !body[field].trim())) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Build inputs with defaults
  const inputs: PitchInputs = {
    name: body.name.trim(),
    title: body.title.trim(),
    expertise: body.expertise.trim(),
    credibility: body.credibility.trim(),
    podcastName: body.podcastName.trim(),
    hostName: body.hostName.trim(),
    guestName: body.guestName.trim(),
    episodeTopic: body.episodeTopic.trim(),
    whyPodcast: body.whyPodcast.trim(),
    socialPlatform: body.socialPlatform?.trim() || '',
    roundedFollowers: '',
    topic1: body.topic1.trim(),
    topic2: body.topic2?.trim() || '',
    topic3: body.topic3?.trim() || '',
    uniqueAngle: body.uniqueAngle.trim(),
    audienceBenefit: body.audienceBenefit?.trim() || '',
  };

  // Calculate rounded followers if provided
  if (body.followers && !isNaN(parseInt(body.followers))) {
    const followers = parseInt(body.followers);
    inputs.roundedFollowers = formatFollowers(followers);
  }

  return { valid: true, errors: [], data: inputs };
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limit
    const rateLimit = checkRateLimit(ip);
    
    // Add rate limit headers
    const headers = {
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
    const body = await request.json();
    const validation = validateInputs(body);

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400, headers }
      );
    }

    // Generate pitches
    const startTime = Date.now();
    const pitches = await generatePitches(validation.data!);
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

  } catch (error) {
    console.error('Pitch generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate pitches. Please try again.',
        message: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
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
