'use client';

interface FormData {
  podcastName: string;
  hostName: string;
  guestName: string;
  episodeTopic: string;
  whyPodcast: string;
}

interface Props {
  formData: FormData;
  updateFormData: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AboutPodcast({ formData, updateFormData, onNext, onBack }: Props) {
  const isValid = formData.podcastName && formData.hostName && formData.guestName && 
                  formData.episodeTopic.length >= 10 && formData.whyPodcast.length >= 50;

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
            About the podcast
          </h2>
          <p className="text-gray-600">
            Tell us which show you want to be on.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Podcast Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Podcast name *
          </label>
          <input
            type="text"
            value={formData.podcastName}
            onChange={(e) => updateFormData('podcastName', e.target.value)}
            placeholder="SaaS Growth Podcast"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealflow-teal focus:border-transparent transition-all"
          />
        </div>

        {/* Host Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Host name *
          </label>
          <input
            type="text"
            value={formData.hostName}
            onChange={(e) => updateFormData('hostName', e.target.value)}
            placeholder="Mike Anderson"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealflow-teal focus:border-transparent transition-all"
          />
        </div>

        {/* Recent Guest */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            A guest you enjoyed listening to *
          </label>
          <input
            type="text"
            value={formData.guestName}
            onChange={(e) => updateFormData('guestName', e.target.value)}
            placeholder="Jason Lemkin"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealflow-teal focus:border-transparent transition-all"
          />
          <p className="text-sm text-gray-500 mt-1">
            Name a guest from a recent episode. This proves you actually listen.
          </p>
        </div>

        {/* Episode Topic */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What did they discuss? *
          </label>
          <input
            type="text"
            value={formData.episodeTopic}
            onChange={(e) => updateFormData('episodeTopic', e.target.value)}
            placeholder="How to hire your first VP of Sales"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealflow-teal focus:border-transparent transition-all"
          />
        </div>

        {/* Why This Podcast */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Why do you want to be on THIS podcast? *
          </label>
          <textarea
            value={formData.whyPodcast}
            onChange={(e) => updateFormData('whyPodcast', e.target.value)}
            placeholder="Love the tactical depth, no fluff. Your episodes on pricing strategies were game-changing for our team."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealflow-teal focus:border-transparent transition-all"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.whyPodcast.length}/280 characters
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
