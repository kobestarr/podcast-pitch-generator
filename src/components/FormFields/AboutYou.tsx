'use client';

interface FormData {
  firstName: string;
  lastName: string;
  title: string[];
  expertise: string;
  credibility: string;
}

interface Props {
  formData: FormData;
  updateFormData: (field: string, value: string | string[]) => void;
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

const titleOptions = [
  'Founder',
  'Co-Founder',
  'CEO',
  'CTO',
  'VP of Sales',
  'VP of Marketing',
  'VP of Product',
  'VP of Growth',
  'Head of Sales',
  'Head of Marketing',
  'Director of Sales',
  'Director of Marketing',
  'Director of Product',
  'CMO',
  'CFO',
  'COO',
  'Chief Revenue Officer',
];

const credibilityExamples = [
  'Scaled 3 SaaS companies from $1M to $10M ARR',
  'Built a $50M ARR business and sold it to Microsoft',
  'Grew LinkedIn following from 0 to 100K in 18 months',
  'Helped 500+ founders raise $50M+ in funding',
];

export function AboutYou({ formData, updateFormData, onNext }: Props) {
  const isValid = formData.firstName && formData.lastName && formData.title.length > 0 && formData.expertise && formData.credibility.length >= 20;

  const toggleTitle = (title: string) => {
    const currentTitles = formData.title || [];
    if (currentTitles.includes(title)) {
      updateFormData('title', currentTitles.filter(t => t !== title));
    } else {
      updateFormData('title', [...currentTitles, title]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-semibold text-dealflow-midnight mb-2">
        Tell us about yourself
      </h2>
      <p className="text-gray-600 mb-8">
        This helps us understand your credibility and expertise.
      </p>

      <div className="space-y-6">
        {/* First Name */}
        <div>
          <label 
            htmlFor="first-name-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            First name *
          </label>
          <input
            id="first-name-input"
            type="text"
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
            placeholder="Sarah"
            aria-required="true"
            aria-invalid={!formData.firstName}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-dealflow-teal focus:border-transparent transition-all ${
              !formData.firstName ? 'border-gray-300' : 'border-gray-300'
            }`}
          />
        </div>

        {/* Last Name */}
        <div>
          <label 
            htmlFor="last-name-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Last name *
          </label>
          <input
            id="last-name-input"
            type="text"
            value={formData.lastName}
            onChange={(e) => updateFormData('lastName', e.target.value)}
            placeholder="Chen"
            aria-required="true"
            aria-invalid={!formData.lastName}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-dealflow-teal focus:border-transparent transition-all ${
              !formData.lastName ? 'border-gray-300' : 'border-gray-300'
            }`}
          />
        </div>

        {/* Title - Multi-Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your title/role * (select all that apply)
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-3">
            {titleOptions.map(option => {
              const isSelected = (formData.title || []).includes(option);
              return (
                <label
                  key={option}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleTitle(option)}
                    className="w-4 h-4 text-dealflow-teal border-gray-300 rounded focus:ring-dealflow-teal"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              );
            })}
          </div>
          {(formData.title || []).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-gray-500">Selected:</span>
              {(formData.title || []).map(title => (
                <span
                  key={title}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-dealflow-teal/10 text-dealflow-teal rounded text-xs font-medium"
                >
                  {title}
                  <button
                    type="button"
                    onClick={() => toggleTitle(title)}
                    className="hover:text-dealflow-midnight"
                    aria-label={`Remove ${title}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          {(!formData.title || formData.title.length === 0) && (
            <p className="text-xs text-red-500 mt-1">Please select at least one title</p>
          )}
        </div>

        {/* Expertise */}
        <div>
          <label 
            htmlFor="expertise-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your area of expertise *
          </label>
          <select
            id="expertise-select"
            value={formData.expertise}
            onChange={(e) => updateFormData('expertise', e.target.value)}
            aria-required="true"
            aria-invalid={!formData.expertise}
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
          <label 
            htmlFor="credibility-textarea"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your biggest credibility point *
          </label>
          <textarea
            id="credibility-textarea"
            value={formData.credibility}
            onChange={(e) => {
              if (e.target.value.length <= 500) {
                updateFormData('credibility', e.target.value);
              }
            }}
            placeholder="Your biggest achievement, company, or social proof..."
            rows={3}
            maxLength={500}
            aria-required="true"
            aria-invalid={formData.credibility.length < 20}
            aria-describedby="credibility-helper"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealflow-teal focus:border-transparent transition-all"
          />
          <p id="credibility-helper" className="text-sm text-gray-500 mt-1">
            {formData.credibility.length}/500 characters (minimum 20)
          </p>
          <div className="mt-2 space-y-1">
            <p className="text-xs font-medium text-gray-600">Examples:</p>
            {credibilityExamples.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => updateFormData('credibility', example)}
                className="block w-full text-left text-xs text-gray-600 hover:text-dealflow-teal px-2 py-1 rounded hover:bg-gray-50 transition-colors"
              >
                "{example}"
              </button>
            ))}
          </div>
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
