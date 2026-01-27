'use client';

interface FormData {
  name: string;
  title: string;
  expertise: string;
  credibility: string;
  podcastName: string;
  hostName: string;
  guestName: string;
  episodeTopic: string;
  whyPodcast: string;
  topic1: string;
  topic2: string;
  topic3: string;
  uniqueAngle: string;
  socialPlatform: string;
  followers: string;
}

interface Props {
  formData: FormData;
  score: number;
}

function getScoreColor(score: number): string {
  if (score <= 40) return 'text-red-500 bg-red-100';
  if (score <= 70) return 'text-yellow-600 bg-yellow-100';
  return 'text-green-600 bg-green-100';
}

function getScoreLabel(score: number): string {
  if (score <= 40) return 'Weak pitch';
  if (score <= 70) return 'Getting there';
  if (score <= 90) return 'Strong pitch';
  return 'Excellent pitch';
}

function getScoreBarColor(score: number): string {
  if (score <= 40) return 'bg-red-500';
  if (score <= 70) return 'bg-yellow-500';
  return 'bg-green-500';
}

export function PitchScore({ formData, score }: Props) {
  const colorClass = getScoreColor(score);
  const label = getScoreLabel(score);
  const barColor = getScoreBarColor(score);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
          {score}%
        </div>
        <span className="text-sm font-medium text-gray-700">
          Pitch Strength: {label}
        </span>
      </div>

      <div className="flex gap-2 text-xs">
        {formData.name && <span className="text-green-600">✓ Name</span>}
        {formData.guestName && <span className="text-green-600">✓ Guest</span>}
        {formData.topic1 && <span className="text-green-600">✓ Topics</span>}
        {formData.credibility.length >= 20 && <span className="text-green-600">✓ Credibility</span>}
        
        {!formData.name && <span className="text-red-400">✗ Name</span>}
        {!formData.guestName && <span className="text-yellow-600">⚠ Guest</span>}
        {!formData.whyPodcast && <span className="text-red-400">✗ Why this podcast?</span>}
      </div>

      {/* Progress bar */}
      <div className="hidden md:block flex-1 mx-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${barColor} transition-all duration-300`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
}
