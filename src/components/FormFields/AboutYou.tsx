'use client';

interface FormData {
  name: string;
  title: string;
  expertise: string;
  credibility: string;
}

interface Props {
  formData: FormData;
  updateFormData: (field: string, value: string) => void;
  onNext: () => void;
}

const expertiseOptions = [
  'B2B SaaS',
  'B2C E-commerce',
  'AI / Machine Learning',
  'Sales / Revenue',
  'Marketing / Growth',
  'Product Management',
  'Founder / Entrepreneurship',
  'Finance / Funding',
  'Leadership / Management',
  'Other',
];

export function AboutYou({ formData, updateFormData, onNext }: Props) {
  const isValid = formData.name && formData.title && formData.expertise && formData.credibility.length >= 20;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-semibold text-dealflow-midnight mb-2">
        Tell us about yourself
      </h2>
      <p className="text-gray-600 mb-8">
        This helps us understand your credibility and expertise.
      </p>

      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            placeholder="Sarah Chen"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealflow-teal focus:border-transparent transition-all"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your title/role *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateFormData('title', e.target.value)}
            placeholder="CEO at GrowthLab"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealflow-teal focus:border-transparent transition-all"
          />
        </div>

        {/* Expertise */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your area of expertise *
          </label>
          <select
            value={formData.expertise}
            onChange={(e) => updateFormData('expertise', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealflow-teal focus:border-transparent transition-all bg-white"
          >
            <option value="">Select your expertise...</option>
            {expertiseOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Credibility */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your biggest credibility point *
          </label>
          <textarea
            value={formData.credibility}
            onChange={(e) => updateFormData('credibility', e.target.value)}
            placeholder="Your biggest achievement, company, or social proof. E.g., 'Scaled 3 SaaS companies from $1M to $10M ARR'"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealflow-teal focus:border-transparent transition-all"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.credibility.length}/500 characters
          </p>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
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
