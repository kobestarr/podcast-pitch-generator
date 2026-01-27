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
  updateFormData: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

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
            {formData.uniqueAngle.length}/500 characters
          </p>
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
