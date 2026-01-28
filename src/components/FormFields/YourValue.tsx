'use client';

interface FormData {
  topic1: string;
  topic2: string;
  topic3: string;
  uniqueAngle: string;
  audienceBenefit: string;
}

interface Props {
  formData: FormData;
  updateFormData: (field: string, value: string | string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const topicExamples = [
  'Why most SaaS companies get pricing wrong',
  'How to hire your first VP of Sales',
  'Building a $10M ARR business without VC funding',
  'The psychology of customer retention',
  'Scaling from $1M to $10M ARR',
  'Why product-led growth beats sales-led growth',
  'The hidden costs of raising VC funding',
  'How to build a content engine that drives revenue',
];

const uniqueAngleExamples = [
  "I've seen the same pricing mistakes at 3 different SaaS companies. Here's what actually works...",
  'After analyzing 500+ SaaS companies, I found the one metric that predicts success.',
  "I bootstrapped to $10M ARR without a sales team. Here's how product-led growth changed everything.",
  "Most founders think they need VC funding. I built 3 companies without it. Here's why...",
];

const audienceBenefitExamples = [
  'Early-stage SaaS founders figuring out their growth motion, typically $500K-$5M ARR',
  'B2B founders who are struggling with pricing and want to maximize revenue',
  'First-time founders who are considering raising VC funding',
  'SaaS founders who want to build a product-led growth engine',
  'Marketing leaders who are building content engines that drive revenue',
];

export function YourValue({ formData, updateFormData, onNext, onBack }: Props) {
  const isValid = formData.topic1 && formData.uniqueAngle.length >= 30;

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
            What value can you offer?
          </h2>
          <p className="text-gray-600">
            Your talking points and unique perspective.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Topic Ideas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What could you talk about? (at least 1 required) *
          </label>
          <div className="space-y-3">
            <input
              id="topic1-input"
              type="text"
              value={formData.topic1}
              onChange={(e) => updateFormData('topic1', e.target.value)}
              placeholder="Topic 1 - e.g., Why most SaaS companies get pricing wrong"
              aria-required="true"
              aria-invalid={!formData.topic1}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealflow-teal focus:border-transparent transition-all"
            />
            <input
              id="topic2-input"
              type="text"
              value={formData.topic2}
              onChange={(e) => updateFormData('topic2', e.target.value)}
              placeholder="Topic 2 (optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealflow-teal focus:border-transparent transition-all"
            />
            <input
              id="topic3-input"
              type="text"
              value={formData.topic3}
              onChange={(e) => updateFormData('topic3', e.target.value)}
              placeholder="Topic 3 (optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealflow-teal focus:border-transparent transition-all"
            />
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-xs font-medium text-gray-600">Examples:</p>
            <div className="flex flex-wrap gap-2">
              {topicExamples.map((example, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (!formData.topic1) {
                      updateFormData('topic1', example);
                    } else if (!formData.topic2) {
                      updateFormData('topic2', example);
                    } else if (!formData.topic3) {
                      updateFormData('topic3', example);
                    }
                  }}
                  className="text-xs text-gray-600 hover:text-dealflow-teal px-2 py-1 rounded hover:bg-gray-50 transition-colors border border-gray-200 hover:border-dealflow-teal"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Unique Angle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What makes YOUR perspective different? *
          </label>
          <textarea
            id="unique-angle-textarea"
            value={formData.uniqueAngle}
            onChange={(e) => {
              if (e.target.value.length <= 500) {
                updateFormData('uniqueAngle', e.target.value);
              }
            }}
            placeholder="I've seen the same pricing mistakes at 3 different SaaS companies. Here's what actually works..."
            rows={4}
            maxLength={500}
            aria-required="true"
            aria-invalid={formData.uniqueAngle.length < 30}
            aria-describedby="unique-angle-helper"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealflow-teal focus:border-transparent transition-all"
          />
          <p id="unique-angle-helper" className="text-sm text-gray-500 mt-1">
            {formData.uniqueAngle.length}/500 characters (minimum 30)
          </p>
          <div className="mt-2 space-y-1">
            <p className="text-xs font-medium text-gray-600">Examples:</p>
            {uniqueAngleExamples.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => updateFormData('uniqueAngle', example)}
                className="block w-full text-left text-xs text-gray-600 hover:text-dealflow-teal px-2 py-1 rounded hover:bg-gray-50 transition-colors"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>

        {/* Audience Benefit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Who in their audience would benefit most? (optional)
          </label>
          <textarea
            value={formData.audienceBenefit}
            onChange={(e) => updateFormData('audienceBenefit', e.target.value)}
            placeholder="Early-stage SaaS founders figuring out their growth motion, typically $500K-$5M ARR"
            rows={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealflow-teal focus:border-transparent transition-all"
          />
          <div className="mt-2 space-y-1">
            <p className="text-xs font-medium text-gray-600">Examples:</p>
            {audienceBenefitExamples.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => updateFormData('audienceBenefit', example)}
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
          Generate My Pitches
        </button>
      </div>
    </div>
  );
}
