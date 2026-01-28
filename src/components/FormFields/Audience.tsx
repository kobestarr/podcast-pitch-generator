'use client';

interface FormData {
  socialPlatform: string;
  followers: string;
}

interface Props {
  formData: FormData;
  updateFormData: (field: string, value: string | string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const platforms = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'X / Twitter' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'newsletter', label: 'Newsletter (subscribers)' },
];

function roundFollowers(count: number): number {
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

function formatFollowersDisplay(count: number): string {
  const rounded = roundFollowers(count);
  return rounded.toLocaleString();
}

export function Audience({ formData, updateFormData, onNext, onBack }: Props) {
  const isValid = formData.socialPlatform && formData.followers;

  // Live preview of rounded number
  const followersNum = parseInt(formData.followers) || 0;
  const roundedDisplay = followersNum > 0 ? formatFollowersDisplay(followersNum) : '';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 mr-4"
        >
          ← Back
        </button>
        <div>
          <h2 className="text-2xl font-semibold text-dealflow-midnight">
            Your audience (optional)
          </h2>
          <p className="text-gray-600">
            Include your social proof for stronger pitches.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Social Platform */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary platform
          </label>
          <select
            id="social-platform-select"
            value={formData.socialPlatform}
            onChange={(e) => updateFormData('socialPlatform', e.target.value)}
            aria-required="true"
            aria-invalid={!formData.socialPlatform}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealflow-teal focus:border-transparent transition-all bg-white"
          >
            <option value="">Select platform...</option>
            {platforms.map(platform => (
              <option key={platform.value} value={platform.value}>{platform.label}</option>
            ))}
          </select>
        </div>

        {/* Followers */}
        <div>
          <label 
            htmlFor="followers-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Approximate followers/subscribers
          </label>
          <input
            id="followers-input"
            type="number"
            value={formData.followers}
            onChange={(e) => updateFormData('followers', e.target.value)}
            placeholder="10000"
            min="0"
            aria-required="true"
            aria-invalid={!formData.followers}
            aria-describedby="followers-helper"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealflow-teal focus:border-transparent transition-all"
          />
          
          {/* Live Preview */}
          {roundedDisplay && (
            <div className="mt-3 p-3 bg-dealflow-cream rounded-lg">
              <span className="text-sm text-gray-600">Will display as: </span>
              <span className="font-semibold text-dealflow-teal">
                {roundedDisplay} followers
              </span>
            </div>
          )}
          
          <p id="followers-helper" className="text-sm text-gray-500 mt-2">
            Round to the nearest 50, 500, 5,000, or 25,000 automatically.
          </p>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-4 px-6 rounded-lg font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`flex-1 py-4 px-6 rounded-lg font-semibold text-white transition-all ${
            isValid 
              ? 'bg-dealflow-teal hover:bg-dealflow-midnight' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
