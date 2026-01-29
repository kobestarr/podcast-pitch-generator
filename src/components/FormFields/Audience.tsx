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
    <div className="bg-white rounded-2xl shadow-lg border border-dealflow-light-grey/30 p-10 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="text-dealflow-light-grey hover:text-dealflow-sky mr-4 transition-colors duration-200 font-body font-semibold"
        >
          ← Back
        </button>
        <div>
          <h2 className="text-3xl font-heading font-bold text-dealflow-midnight">
            Your audience (optional)
          </h2>
          <p className="text-lg font-body text-dealflow-light-grey mt-1">
            Include your social proof for stronger pitches.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Social Platform */}
        <div>
          <label className="block text-base font-body font-semibold text-dealflow-midnight mb-3">
            Primary platform
          </label>
          <select
            id="social-platform-select"
            value={formData.socialPlatform}
            onChange={(e) => updateFormData('socialPlatform', e.target.value)}
            aria-required="true"
            aria-invalid={!formData.socialPlatform}
            className="w-full px-4 py-1 border-2 border-dealflow-light-grey/50 rounded-xl focus:ring-2 focus:ring-dealflow-sky focus:border-dealflow-sky transition-all duration-200 bg-white font-body text-sm text-dealflow-midnight"
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
            className="block text-base font-body font-semibold text-dealflow-midnight mb-2"
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
            className="w-full px-4 py-2 border-2 border-dealflow-light-grey/50 rounded-xl focus:ring-2 focus:ring-dealflow-sky focus:border-dealflow-sky transition-all duration-200 font-body text-dealflow-midnight placeholder:text-dealflow-light-grey"
          />
          
          {/* Live Preview */}
          {roundedDisplay && (
            <div className="mt-4 p-4 bg-gradient-to-r from-dealflow-sky/10 to-dealflow-orange/10 rounded-xl border border-dealflow-sky/20">
              <span className="text-sm font-body text-dealflow-midnight">Will display as: </span>
              <span className="font-body font-bold text-dealflow-sky">
                {roundedDisplay} followers
              </span>
            </div>
          )}
          
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-4 px-8 rounded-xl font-body font-semibold text-lg text-dealflow-midnight bg-dealflow-light-grey/20 hover:bg-dealflow-light-grey/30 transition-all duration-200 border-2 border-dealflow-light-grey/30"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`flex-1 py-4 px-8 rounded-xl font-body font-semibold text-lg text-white transition-all duration-200 shadow-lg ${
            isValid 
              ? 'bg-gradient-to-r from-dealflow-sky to-dealflow-sky/90 hover:from-dealflow-midnight hover:to-dealflow-sky hover:shadow-xl transform hover:-translate-y-0.5' 
              : 'bg-dealflow-light-grey cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
