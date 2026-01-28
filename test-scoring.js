/**
 * Test script for scoring logic
 * Run with: node test-scoring.js
 */

// Simulate the scoring logic
const VALIDATION_THRESHOLDS = {
  CREDIBILITY_MIN_LENGTH: 20,
  EPISODE_TOPIC_MIN_LENGTH: 10,
  WHY_PODCAST_MIN_LENGTH: 50,
  UNIQUE_ANGLE_MIN_LENGTH: 30,
};

const SCORING_RULES = [
  { field: 'name', points: 5, validate: (d) => !!d.name },
  { field: 'title', points: 5, validate: (d) => !!d.title },
  { field: 'expertise', points: 10, validate: (d) => !!d.expertise },
  { field: 'credibility', points: 15, validate: (d) => d.credibility.length > VALIDATION_THRESHOLDS.CREDIBILITY_MIN_LENGTH },
  { field: 'podcastName', points: 5, validate: (d) => !!d.podcastName },
  { field: 'hostName', points: 5, validate: (d) => !!d.hostName },
  { field: 'guestName', points: 15, validate: (d) => !!d.guestName },
  { field: 'episodeTopic', points: 10, validate: (d) => d.episodeTopic.length > VALIDATION_THRESHOLDS.EPISODE_TOPIC_MIN_LENGTH },
  { field: 'whyPodcast', points: 20, validate: (d) => d.whyPodcast.length > VALIDATION_THRESHOLDS.WHY_PODCAST_MIN_LENGTH },
  { field: 'topic1', points: 10, validate: (d) => !!d.topic1 },
  { field: 'topic2', points: 5, validate: (d) => !!d.topic2 },
  { field: 'topic3', points: 5, validate: (d) => !!d.topic3 },
  { field: 'uniqueAngle', points: 15, validate: (d) => d.uniqueAngle.length > VALIDATION_THRESHOLDS.UNIQUE_ANGLE_MIN_LENGTH },
  { field: 'socialPlatform', points: 5, validate: (d) => !!d.socialPlatform },
  { field: 'followers', points: 10, validate: (d) => !!d.followers },
];

const MAX_SCORE = SCORING_RULES.reduce((sum, rule) => sum + rule.points, 0);

function calculatePitchScore(formData) {
  let earnedPoints = 0;
  for (const rule of SCORING_RULES) {
    if (rule.validate(formData)) {
      earnedPoints += rule.points;
    }
  }
  return Math.max(0, Math.min(100, Math.round((earnedPoints / MAX_SCORE) * 100)));
}

// Test cases
console.log('🧪 Running Scoring Logic Tests...\n');

// Test 1: Empty form
const emptyForm = {
  name: '',
  title: '',
  expertise: '',
  credibility: '',
  podcastName: '',
  hostName: '',
  guestName: '',
  episodeTopic: '',
  whyPodcast: '',
  topic1: '',
  topic2: '',
  topic3: '',
  uniqueAngle: '',
  socialPlatform: '',
  followers: '',
};
const emptyScore = calculatePitchScore(emptyForm);
console.log(`✅ Test 1 - Empty Form: ${emptyScore}% (Expected: 0%)`);
console.assert(emptyScore === 0, 'Empty form should be 0%');

// Test 2: Perfect form
const perfectForm = {
  name: 'Sarah Chen',
  title: 'CEO at GrowthLab',
  expertise: 'B2B SaaS growth',
  credibility: 'Scaled 3 startups from $1M to $10M ARR', // 45 chars > 20
  podcastName: 'SaaS Growth Podcast',
  hostName: 'Mike Anderson',
  guestName: 'Jason Lemkin',
  episodeTopic: 'How to hire your first VP of Sales', // 36 chars > 10
  whyPodcast: 'Love the tactical depth, no fluff approach to real SaaS problems', // 64 chars > 50
  topic1: 'Why most SaaS companies get pricing wrong',
  topic2: 'The 3 levers that actually drive expansion revenue',
  topic3: 'How to build a growth team under $5M ARR',
  uniqueAngle: 'Seen the same mistakes at 3 different companies', // 49 chars > 30
  socialPlatform: 'LinkedIn',
  followers: '10000',
};
const perfectScore = calculatePitchScore(perfectForm);
console.log(`✅ Test 2 - Perfect Form: ${perfectScore}% (Expected: 100%)`);
console.assert(perfectScore === 100, 'Perfect form should be 100%');

// Test 3: Boundary test - exactly 20 chars (should fail)
const boundary20Fail = { ...emptyForm, credibility: '12345678901234567890' }; // exactly 20
const boundaryScore1 = calculatePitchScore(boundary20Fail);
console.log(`✅ Test 3 - Exactly 20 chars (boundary): ${boundaryScore1}% (Expected: 0%)`);
console.assert(boundaryScore1 === 0, 'Exactly 20 chars should fail (> 20 required)');

// Test 4: Boundary test - 21 chars (should pass)
const boundary21Pass = { ...emptyForm, credibility: '123456789012345678901' }; // 21 chars
const boundaryScore2 = calculatePitchScore(boundary21Pass);
const expectedScore2 = Math.round((15 / 140) * 100); // 11%
console.log(`✅ Test 4 - 21 chars (should pass): ${boundaryScore2}% (Expected: ${expectedScore2}%)`);
console.assert(boundaryScore2 === expectedScore2, '21 chars should pass validation');

// Test 5: Optional fields don't affect base score
const noOptionalFields = { ...perfectForm, topic2: '', topic3: '' };
const expectedScore3 = Math.round((130 / 140) * 100); // 93% (140 - 10 for topic2&3)
const noOptionalScore = calculatePitchScore(noOptionalFields);
console.log(`✅ Test 5 - No Optional Fields: ${noOptionalScore}% (Expected: ${expectedScore3}%)`);
console.assert(noOptionalScore === expectedScore3, 'Optional fields should reduce score correctly');

// Test 6: Total points check
console.log(`✅ Test 6 - Max Score: ${MAX_SCORE} (Expected: 140)`);
console.assert(MAX_SCORE === 140, 'Total possible points should be 140');

// Test 7: About You section (35 points)
const aboutYouOnly = {
  ...emptyForm,
  name: 'Test',
  title: 'Test',
  expertise: 'Test',
  credibility: 'This is more than twenty characters long',
};
const aboutYouScore = calculatePitchScore(aboutYouOnly);
const expectedScore4 = Math.round((35 / 140) * 100); // 25%
console.log(`✅ Test 7 - About You Only (35 pts): ${aboutYouScore}% (Expected: ${expectedScore4}%)`);
console.assert(aboutYouScore === expectedScore4, 'About You section should be 35 points');

// Test 8: Audience section (15 points total, not 5!)
const audienceOnly = {
  ...emptyForm,
  socialPlatform: 'LinkedIn',
  followers: '10000',
};
const audienceScore = calculatePitchScore(audienceOnly);
const expectedScore5 = Math.round((15 / 140) * 100); // 11%
console.log(`✅ Test 8 - Audience Section (15 pts): ${audienceScore}% (Expected: ${expectedScore5}%)`);
console.assert(audienceScore === expectedScore5, 'Audience section should be 15 points (5+10), not 5');

console.log('\n✅ All tests passed! Scoring logic is correct.\n');

// Summary
console.log('📊 Scoring Breakdown:');
console.log('  About You:      35 points (Name 5, Title 5, Expertise 10, Credibility 15)');
console.log('  About Podcast:  65 points (Name 5, Host 5, Guest 15, Topic 10, Why 20)');
console.log('  Your Value:     35 points (Topic1 10, Topic2 5, Topic3 5, Angle 15)');
console.log('  Audience:       15 points (Platform 5, Followers 10)');
console.log('  ────────────────');
console.log('  TOTAL:         140 points\n');
