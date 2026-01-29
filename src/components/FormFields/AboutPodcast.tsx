'use client';

import { useState } from 'react';

interface FormData {
  podcastName: string;
  hostName: string;
  guestName: string;
  episodeTopic: string;
  whyPodcast: string;
}

interface Props {
  formData: FormData;
  updateFormData: (field: string, value: string | string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const episodeTopicExamples = [
  'How to hire your first VP of Sales',
  'Why most SaaS companies get pricing wrong',
  'Building a $10M ARR business without VC funding',
  'The psychology of customer retention',
  'Scaling from $1M to $10M ARR',
];

const whyPodcastExamples = [
  'Love the tactical depth, no fluff. Your episodes on pricing strategies were game-changing for our team.',
  'Your interviews with bootstrapped founders resonate with our journey. Would love to share our story.',
  'The way you break down complex topics makes them actionable. I have a unique angle on [topic] that would fit perfectly.',
];

export function AboutPodcast({ formData, updateFormData, onNext, onBack }: Props) {
  const [clickedTopicExample, setClickedTopicExample] = useState<number | null>(null);
  const [clickedWhyExample, setClickedWhyExample] = useState<number | null>(null);
  const isValid = formData.podcastName && formData.hostName && formData.guestName && 
                  formData.episodeTopic.length >= 10 && formData.whyPodcast.length >= 50;

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
            About the podcast
          </h2>
          <p className="text-lg font-body text-dealflow-light-grey mt-1">
            Tell us which show you want to be on.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Podcast Name */}
        <div>
          <label 
            htmlFor="podcast-name-input"
            className="block text-base font-body font-semibold text-dealflow-midnight mb-2"
          >
            Podcast name *
          </label>
          <input
            id="podcast-name-input"
            type="text"
            value={formData.podcastName}
            onChange={(e) => updateFormData('podcastName', e.target.value)}
            placeholder="Flixwatcher Podcast"
            aria-required="true"
            aria-invalid={!formData.podcastName}
            className="w-full px-4 py-2 border-2 border-dealflow-light-grey/50 rounded-xl focus:ring-2 focus:ring-dealflow-sky focus:border-dealflow-sky transition-all duration-200 font-body text-dealflow-midnight placeholder:text-dealflow-light-grey"
          />
        </div>

        {/* Host Name */}
        <div>
          <label 
            htmlFor="host-name-input"
            className="block text-base font-body font-semibold text-dealflow-midnight mb-2"
          >
            Host first name *
          </label>
          <input
            id="host-name-input"
            type="text"
            value={formData.hostName}
            onChange={(e) => updateFormData('hostName', e.target.value)}
            placeholder="Mike"
            aria-required="true"
            aria-invalid={!formData.hostName}
            className="w-full px-4 py-2 border-2 border-dealflow-light-grey/50 rounded-xl focus:ring-2 focus:ring-dealflow-sky focus:border-dealflow-sky transition-all duration-200 font-body text-dealflow-midnight placeholder:text-dealflow-light-grey"
          />
        </div>

        {/* Recent Guest */}
        <div>
          <label 
            htmlFor="guest-name-input"
            className="block text-base font-body font-semibold text-dealflow-midnight mb-2"
          >
            A guest you enjoyed listening to *
          </label>
          <input
            id="guest-name-input"
            type="text"
            value={formData.guestName}
            onChange={(e) => updateFormData('guestName', e.target.value)}
            placeholder="Kobi Omenaka"
            aria-required="true"
            aria-invalid={!formData.guestName}
            aria-describedby="guest-name-helper"
            className="w-full px-4 py-2 border-2 border-dealflow-light-grey/50 rounded-xl focus:ring-2 focus:ring-dealflow-sky focus:border-dealflow-sky transition-all duration-200 font-body text-dealflow-midnight placeholder:text-dealflow-light-grey"
          />
          <p id="guest-name-helper" className="text-sm font-body text-dealflow-light-grey mt-2">
            Name a guest from a recent episode. This proves you actually listen.
          </p>
        </div>

        {/* Episode Topic */}
        <div>
          <label 
            htmlFor="episode-topic-input"
            className="block text-base font-body font-semibold text-dealflow-midnight mb-2"
          >
            What did they discuss? *
          </label>
          <input
            id="episode-topic-input"
            type="text"
            value={formData.episodeTopic}
            onChange={(e) => updateFormData('episodeTopic', e.target.value)}
            placeholder="How to hire your first VP of Sales"
            aria-required="true"
            aria-invalid={formData.episodeTopic.length < 10}
            className="w-full px-4 py-2 border-2 border-dealflow-light-grey/50 rounded-xl focus:ring-2 focus:ring-dealflow-sky focus:border-dealflow-sky transition-all duration-200 font-body text-dealflow-midnight placeholder:text-dealflow-light-grey"
          />
          <div className="mt-3">
            <p className="text-sm font-body font-semibold text-dealflow-midnight mb-2">Don't know what to write? Here are some examples. Click on the buttons to get started...</p>
            <div className="flex flex-wrap gap-2">
              {episodeTopicExamples.map((example, idx) => {
                const isClicked = clickedTopicExample === idx || formData.episodeTopic === example;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      updateFormData('episodeTopic', example);
                      setClickedTopicExample(idx);
                    }}
                    className={`text-sm font-body px-3 py-2 rounded-lg border transition-all duration-200 ${
                      isClicked
                        ? 'text-dealflow-sky bg-dealflow-sky/10 border-dealflow-sky/50 font-semibold'
                        : 'text-dealflow-light-grey hover:text-dealflow-sky border-dealflow-light-grey/30 hover:bg-dealflow-sky/10 hover:border-dealflow-sky/50'
                    }`}
                  >
                    "{example}"
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Why This Podcast */}
        <div>
          <label 
            htmlFor="why-podcast-textarea"
            className="block text-base font-body font-semibold text-dealflow-midnight mb-2"
          >
            Why do you want to be on THIS podcast? *
          </label>
          <textarea
            id="why-podcast-textarea"
            value={formData.whyPodcast}
            onChange={(e) => {
              if (e.target.value.length <= 280) {
                updateFormData('whyPodcast', e.target.value);
              }
            }}
            placeholder="Love the tactical depth, no fluff. Your episodes on pricing strategies were game-changing for our team."
            rows={3}
            maxLength={280}
            aria-required="true"
            aria-invalid={formData.whyPodcast.length < 50}
            aria-describedby="why-podcast-helper"
            className="w-full px-4 py-2 border-2 border-dealflow-light-grey/50 rounded-xl focus:ring-2 focus:ring-dealflow-sky focus:border-dealflow-sky transition-all duration-200 font-body text-dealflow-midnight placeholder:text-dealflow-light-grey resize-none"
          />
          <p id="why-podcast-helper" className="text-sm font-body text-dealflow-light-grey mt-2">
            {formData.whyPodcast.length}/280 characters (minimum 50)
          </p>
          <div className="mt-3">
            <p className="text-sm font-body font-semibold text-dealflow-midnight mb-2">Don't know what to write? Here are some examples. Click on the buttons to get started...</p>
            <div className="flex flex-wrap gap-2">
              {whyPodcastExamples.map((example, idx) => {
                const isClicked = clickedWhyExample === idx || formData.whyPodcast === example;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      updateFormData('whyPodcast', example);
                      setClickedWhyExample(idx);
                    }}
                    className={`text-sm font-body px-3 py-2 rounded-lg border transition-all duration-200 ${
                      isClicked
                        ? 'text-dealflow-sky bg-dealflow-sky/10 border-dealflow-sky/50 font-semibold'
                        : 'text-dealflow-light-grey hover:text-dealflow-sky border-dealflow-light-grey/30 hover:bg-dealflow-sky/10 hover:border-dealflow-sky/50'
                    }`}
                  >
                    "{example}"
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`w-full py-4 px-8 rounded-xl font-body font-semibold text-lg text-white transition-all duration-200 shadow-lg ${
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
