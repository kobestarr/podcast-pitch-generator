/**
 * Shared Scoring Configuration for Podcast Guest Pitch Generator
 *
 * This file defines all scoring rules, validation logic, and constants
 * in one place to ensure consistency across the application.
 *
 * PRD Reference: Section F5b - Live Pitch Score
 */

export interface FormData {
  firstName: string;
  lastName: string;
  title: string[];
  expertise: string;
  credibility: string;
  podcastName: string;
  hostName: string;
  guestName: string;
  episodeTopic: string;
  whyPodcast: string;
  socialPlatform: string;
  followers: string;
  topic1: string;
  topic2: string;
  topic3: string;
  uniqueAngle: string;
  audienceBenefit: string;
}

/**
 * Validation constants for character length requirements
 * These thresholds ensure quality input that generates better pitches
 */
export const VALIDATION_THRESHOLDS = {
  /** Minimum characters for credibility field (ensures substantive proof) */
  CREDIBILITY_MIN_LENGTH: 20,

  /** Minimum characters for episode topic (ensures specificity) */
  EPISODE_TOPIC_MIN_LENGTH: 10,

  /** Minimum characters for "why this podcast" (ensures thoughtful answer) */
  WHY_PODCAST_MIN_LENGTH: 50,

  /** Minimum characters for unique angle (ensures differentiation) */
  UNIQUE_ANGLE_MIN_LENGTH: 30,
} as const;

export type FieldKey = keyof FormData;

export interface ScoringRule {
  /** Field key in FormData */
  field: FieldKey;

  /** Display label for UI */
  label: string;

  /** Points awarded when validation passes */
  points: number;

  /** Validation function - returns true if field is complete */
  validate: (formData: FormData) => boolean;

  /** Whether this field is optional */
  isOptional: boolean;

  /** Whether this optional field is recommended for better pitches */
  isRecommended: boolean;

  /** Helper text explaining what makes this field valid */
  hint?: string;
}

/**
 * Complete scoring rules for all 16 fields
 * Total possible points: 145
 *
 * PRD Section: F2, F2b, F3 - Input Form Requirements
 */
export const SCORING_RULES: ScoringRule[] = [
  // ===== ABOUT YOU SECTION (40 points) =====
  {
    field: 'firstName',
    label: 'First Name',
    points: 5,
    validate: (data) => !!data.firstName.trim(),
    isOptional: false,
    isRecommended: false,
    hint: 'Your first name',
  },
  {
    field: 'lastName',
    label: 'Last Name',
    points: 5,
    validate: (data) => !!data.lastName.trim(),
    isOptional: false,
    isRecommended: false,
    hint: 'Your last name',
  },
  {
    field: 'title',
    label: 'Title/Role',
    points: 5,
    validate: (data) => Array.isArray(data.title) && data.title.length > 0,
    isOptional: false,
    isRecommended: false,
    hint: 'Your professional title(s)',
  },
  {
    field: 'expertise',
    label: 'Expertise',
    points: 10,
    validate: (data) => !!data.expertise.trim(),
    isOptional: false,
    isRecommended: false,
    hint: 'Your area of expertise',
  },
  {
    field: 'credibility',
    label: 'Credibility',
    points: 15,
    validate: (data) => data.credibility.trim().length > VALIDATION_THRESHOLDS.CREDIBILITY_MIN_LENGTH,
    isOptional: false,
    isRecommended: false,
    hint: `Your biggest achievement (at least ${VALIDATION_THRESHOLDS.CREDIBILITY_MIN_LENGTH} characters)`,
  },

  // ===== ABOUT PODCAST SECTION (65 points) =====
  {
    field: 'podcastName',
    label: 'Podcast Name',
    points: 5,
    validate: (data) => !!data.podcastName.trim(),
    isOptional: false,
    isRecommended: false,
    hint: 'Name of the podcast',
  },
  {
    field: 'hostName',
    label: 'Host Name',
    points: 5,
    validate: (data) => !!data.hostName.trim(),
    isOptional: false,
    isRecommended: false,
    hint: 'Name of the podcast host',
  },
  {
    field: 'guestName',
    label: 'Recent Guest',
    points: 15,
    validate: (data) => !!data.guestName.trim(),
    isOptional: false,
    isRecommended: false,
    hint: 'Name a guest from a recent episode',
  },
  {
    field: 'episodeTopic',
    label: 'Episode Topic',
    points: 10,
    validate: (data) => data.episodeTopic.trim().length > VALIDATION_THRESHOLDS.EPISODE_TOPIC_MIN_LENGTH,
    isOptional: false,
    isRecommended: false,
    hint: `What they discussed (at least ${VALIDATION_THRESHOLDS.EPISODE_TOPIC_MIN_LENGTH} characters)`,
  },
  {
    field: 'whyPodcast',
    label: 'Why This Podcast?',
    points: 20,
    validate: (data) => data.whyPodcast.trim().length > VALIDATION_THRESHOLDS.WHY_PODCAST_MIN_LENGTH,
    isOptional: false,
    isRecommended: false,
    hint: `Why you want to be on this show (at least ${VALIDATION_THRESHOLDS.WHY_PODCAST_MIN_LENGTH} characters)`,
  },

  // ===== YOUR VALUE SECTION (35 points) =====
  {
    field: 'topic1',
    label: 'Topic Idea 1',
    points: 10,
    validate: (data) => !!data.topic1.trim(),
    isOptional: false,
    isRecommended: false,
    hint: 'First topic you could discuss',
  },
  {
    field: 'topic2',
    label: 'Topic Idea 2',
    points: 5,
    validate: (data) => !!data.topic2.trim(),
    isOptional: true,
    isRecommended: true,
    hint: 'Second topic (bonus points)',
  },
  {
    field: 'topic3',
    label: 'Topic Idea 3',
    points: 5,
    validate: (data) => !!data.topic3.trim(),
    isOptional: true,
    isRecommended: true,
    hint: 'Third topic (bonus points)',
  },
  {
    field: 'uniqueAngle',
    label: 'Unique Angle',
    points: 15,
    validate: (data) => data.uniqueAngle.trim().length > VALIDATION_THRESHOLDS.UNIQUE_ANGLE_MIN_LENGTH,
    isOptional: false,
    isRecommended: false,
    hint: `What makes your perspective different (at least ${VALIDATION_THRESHOLDS.UNIQUE_ANGLE_MIN_LENGTH} characters)`,
  },

  // ===== AUDIENCE SECTION (15 points) =====
  {
    field: 'socialPlatform',
    label: 'Social Platform',
    points: 5,
    validate: (data) => !!data.socialPlatform.trim(),
    isOptional: false,
    isRecommended: false,
    hint: 'Your primary social platform',
  },
  {
    field: 'followers',
    label: 'Follower Count',
    points: 10,
    validate: (data) => !!data.followers.trim(),
    isOptional: false,
    isRecommended: false,
    hint: 'Your audience size',
  },
];

/**
 * Maximum possible score (sum of all field points)
 */
export const MAX_SCORE = SCORING_RULES.reduce((sum, rule) => sum + rule.points, 0);

/**
 * Score thresholds for color-coded feedback
 * PRD Section: F5b - Display rules
 */
export const SCORE_THRESHOLDS = {
  /** 0-40%: Red meter, "Weak pitch" */
  WEAK: 40,

  /** 41-70%: Yellow meter, "Getting there" */
  GETTING_THERE: 70,

  /** 71-90%: Green meter, "Strong pitch" */
  STRONG: 90,

  /** 91-100%: Green meter + sparkle, "Excellent pitch" */
  EXCELLENT: 91,
} as const;

/**
 * Calculate pitch score from form data
 * @param formData - Complete form data
 * @returns Score as percentage (0-100)
 */
export function calculatePitchScore(formData: FormData): number {
  let earnedPoints = 0;

  for (const rule of SCORING_RULES) {
    if (rule.validate(formData)) {
      earnedPoints += rule.points;
    }
  }

  // Convert to percentage (MAX_SCORE = 100%)
  const percentage = Math.round((earnedPoints / MAX_SCORE) * 100);

  // Ensure result is within 0-100 range
  return Math.max(0, Math.min(100, percentage));
}

/**
 * Get field status for a specific field
 * @param formData - Complete form data
 * @param field - Field key to check
 * @returns Validation result
 */
export function getFieldStatus(formData: FormData, field: FieldKey): {
  rule: ScoringRule;
  completed: boolean;
  earnedPoints: number;
} {
  const rule = SCORING_RULES.find(r => r.field === field);

  if (!rule) {
    throw new Error(`Unknown field: ${field}`);
  }

  const completed = rule.validate(formData);

  return {
    rule,
    completed,
    earnedPoints: completed ? rule.points : 0,
  };
}

/**
 * Get all field statuses for display
 * @param formData - Complete form data
 * @returns Array of field statuses
 */
export function getAllFieldStatuses(formData: FormData) {
  return SCORING_RULES.map(rule => ({
    field: rule.field,
    label: rule.label,
    points: rule.points,
    completed: rule.validate(formData),
    isOptional: rule.isOptional,
    isRecommended: rule.isRecommended,
    hint: rule.hint,
  }));
}

/**
 * Get score color class based on percentage
 * @param score - Score percentage (0-100)
 * @returns Tailwind CSS classes for color
 */
export function getScoreColor(score: number): string {
  if (score <= SCORE_THRESHOLDS.WEAK) {
    return 'text-red-500 bg-red-100';
  }
  if (score <= SCORE_THRESHOLDS.GETTING_THERE) {
    return 'text-yellow-600 bg-yellow-100';
  }
  return 'text-green-600 bg-green-100';
}

/**
 * Get score label based on percentage
 * @param score - Score percentage (0-100)
 * @returns User-friendly label
 */
export function getScoreLabel(score: number): string {
  if (score <= SCORE_THRESHOLDS.WEAK) return 'Weak pitch';
  if (score <= SCORE_THRESHOLDS.GETTING_THERE) return 'Getting there';
  if (score <= SCORE_THRESHOLDS.STRONG) return 'Strong pitch';
  return 'Excellent pitch';
}

/**
 * Get progress bar color based on percentage
 * @param score - Score percentage (0-100)
 * @returns Tailwind CSS class for progress bar
 */
export function getScoreBarColor(score: number): string {
  if (score <= SCORE_THRESHOLDS.WEAK) return 'bg-red-500';
  if (score <= SCORE_THRESHOLDS.GETTING_THERE) return 'bg-yellow-500';
  return 'bg-green-500';
}

/**
 * Check if score qualifies for sparkle effect
 * @param score - Score percentage (0-100)
 * @returns True if score >= 91%
 */
export function shouldShowSparkle(score: number): boolean {
  return score >= SCORE_THRESHOLDS.EXCELLENT;
}
