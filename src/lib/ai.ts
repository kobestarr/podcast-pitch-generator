// AI Provider Abstraction Layer
// Easy swap between Anthropic Claude and OpenAI GPT-4

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

// Initialize clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const AI_PROVIDER = process.env.AI_PROVIDER || 'anthropic';

// Types
export interface PitchInputs {
  // About You
  name: string;
  title: string;
  expertise: string;
  credibility: string;
  // About Podcast
  podcastName: string;
  hostName: string;
  guestName: string;
  episodeTopic: string;
  whyPodcast: string;
  // Audience
  socialPlatform: string;
  roundedFollowers: string;
  // Your Value
  topic1: string;
  topic2: string;
  topic3: string;
  uniqueAngle: string;
  audienceBenefit: string;
}

export interface PitchOutputs {
  pitch_1: {
    style: string;
    subject: string;
    body: string;
  };
  pitch_2: {
    style: string;
    subject: string;
    body: string;
  };
  pitch_3: {
    style: string;
    subject: string;
    body: string;
  };
  followup_1: {
    timing: string;
    subject: string;
    body: string;
  };
  followup_2: {
    timing: string;
    subject: string;
    body: string;
  };
  followup_3: {
    timing: string;
    subject: string;
    body: string;
  };
}

// Follower rounding logic (used in both frontend and backend)
export function roundFollowers(count: number): number {
  if (count < 1000) {
    return Math.ceil(count / 50) * 50;
  } else if (count < 10000) {
    return Math.ceil(count / 500) * 500;
  } else if (count < 100000) {
    return Math.ceil(count / 5000) * 5000;
  } else {
    return Math.ceil(count / 25000) * 25000;
  }
}

export function formatFollowers(count: number): string {
  const rounded = roundFollowers(count);
  return rounded.toLocaleString(); // "10,000" not "10000"
}

// Build the prompt for the AI
function buildPrompt(inputs: PitchInputs): string {
  const socialProofLine = inputs.socialPlatform && inputs.roundedFollowers
    ? `I'll be sharing our conversation with my audience of ${inputs.roundedFollowers} on ${inputs.socialPlatform}.`
    : '';

  return `You are an expert podcast guest pitch writer. Your pitches sound like they come from a real listener who genuinely follows the show, NOT a mass outreach template.

ABOUT THE PERSON:
- Name: ${inputs.name}
- Title: ${inputs.title}
- Expertise: ${inputs.expertise}
- Credibility: ${inputs.credibility}
- Social platform: ${inputs.socialPlatform || 'Not provided'}
- Audience size: ${inputs.roundedFollowers || 'Not provided'}

ABOUT THE PODCAST:
- Podcast name: ${inputs.podcastName}
- Host name: ${inputs.hostName}
- Recent guest they enjoyed: ${inputs.guestName}
- Episode/topic they enjoyed: ${inputs.episodeTopic}
- Why they want to be on this show: ${inputs.whyPodcast}

WHAT THEY CAN OFFER:
- Topic ideas: ${inputs.topic1}${inputs.topic2 ? ', ' + inputs.topic2 : ''}${inputs.topic3 ? ', ' + inputs.topic3 : ''}
- Unique perspective: ${inputs.uniqueAngle}
- Audience benefit: ${inputs.audienceBenefit || 'Not provided'}

Generate 3 different pitch emails:

PITCH 1 - DIRECT & PROFESSIONAL
- Straightforward, confident, gets to the point
- Lead with credibility
- MUST reference ${inputs.podcastName} naturally in the body
- MUST include: "Your conversation with ${inputs.guestName} about ${inputs.episodeTopic}..." or similar
- Clear value proposition
- Sign off: Full name + title

PITCH 2 - SOCIAL PROOF & VALUE EXCHANGE
- Lead with what you bring: audience reach
- Include this line naturally: "${socialProofLine || "I'll be sharing our conversation with my audience."}"
- MUST reference ${inputs.podcastName} and ${inputs.guestName} naturally
- Position it as mutual value, not just asking for a favor
- Sign off: Full name + title

PITCH 3 - CASUAL & MOBILE
- Shorter, conversational, like texting a friend
- Still professional but relaxed tone
- MUST reference the show and ${inputs.guestName} to prove you listen
- No formal sign-off
- End with just first name
- Add "Sent from my iPhone" at the very end

FOLLOW-UP 1 (5-7 days later)
- Gentle nudge, assume they're busy
- Add one new piece of value or hook
- Short (under 75 words)

FOLLOW-UP 2 (10-14 days later)
- Reference a new episode or something timely
- Restate your value differently
- Still friendly, not desperate

FOLLOW-UP 3 (21 days later)
- "Closing the loop" tone
- Give them an easy out: "If timing isn't right, no worries"
- Leave door open for future

For each pitch and follow-up, provide:
- Subject line (under 50 characters, curiosity-driving, NO exclamation marks)
- Email body

CRITICAL RULES:
- Never sound desperate or salesy
- Don't use "I would love to" or "I was wondering if"
- Reference ${inputs.podcastName} in the email body, not just greeting
- Reference ${inputs.guestName} naturally to prove you actually listen
- No generic "I love your podcast" without specifics
- Be specific, not generic
- End with a soft CTA (not pushy)
- No exclamation marks in subject lines
- Pitch 3 MUST end with first name only + "Sent from my iPhone"

Respond with valid JSON in this exact format:
{
  "pitch_1": {
    "style": "Direct & Professional",
    "subject": "...",
    "body": "..."
  },
  "pitch_2": {
    "style": "Social Proof & Value Exchange",
    "subject": "...",
    "body": "..."
  },
  "pitch_3": {
    "style": "Casual & Mobile",
    "subject": "...",
    "body": "...\n\n${inputs.name}\n\nSent from my iPhone"
  },
  "followup_1": {
    "timing": "5-7 days",
    "subject": "...",
    "body": "..."
  },
  "followup_2": {
    "timing": "10-14 days",
    "subject": "...",
    "body": "..."
  },
  "followup_3": {
    "timing": "21 days",
    "subject": "...",
    "body": "..."
  }
}`;
}

// Generate with Anthropic Claude
async function generateWithClaude(inputs: PitchInputs): Promise<PitchOutputs> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: buildPrompt(inputs),
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  const text = content.text;
  
  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not extract JSON from Claude response');
  }

  return JSON.parse(jsonMatch[0]) as PitchOutputs;
}

// Generate with OpenAI GPT-4
async function generateWithGPT4(inputs: PitchInputs): Promise<PitchOutputs> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are an expert podcast guest pitch writer. Always respond with valid JSON only.',
      },
      {
        role: 'user',
        content: buildPrompt(inputs),
      },
    ],
    max_tokens: 4000,
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No content in OpenAI response');
  }

  // Extract JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not extract JSON from OpenAI response');
  }

  return JSON.parse(jsonMatch[0]) as PitchOutputs;
}

// Main generation function - uses configured provider
export async function generatePitches(inputs: PitchInputs): Promise<PitchOutputs> {
  if (AI_PROVIDER === 'anthropic') {
    return generateWithClaude(inputs);
  }
  return generateWithGPT4(inputs);
}

// Provider info for debugging
export function getProviderInfo(): { provider: string; model: string } {
  return {
    provider: AI_PROVIDER,
    model: AI_PROVIDER === 'anthropic' ? 'claude-sonnet-4-20250514' : 'gpt-4-turbo-preview',
  };
}
