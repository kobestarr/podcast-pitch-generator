'use client';

import { useState } from 'react';

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
  const [clickedTopicExample, setClickedTopicExample] = useState<number | null>(null);
  const [clickedAngleExample, setClickedAngleExample] = useState<number | null>(null);
  const [clickedBenefitExample, setClickedBenefitExample] = useState<number | null>(null);
  const isValid = formData.topic1 && formData.uniqueAngle.length >= 30;

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
            What value can you offer?
          </h2>
          <p className="text-lg font-body text-dealflow-light-grey mt-1">
            Your talking points and unique perspective.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Topic Ideas */}
        <div>
          <label className="block text-base font-body font-semibold text-dealflow-midnight mb-2">
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
              className="w-full px-4 py-2 border-2 border-dealflow-light-grey/50 rounded-xl focus:ring-2 focus:ring-dealflow-sky focus:border-dealflow-sky transition-all duration-200 font-body text-dealflow-midnight placeholder:text-dealflow-light-grey"
            />
            <input
              id="topic2-input"
              type="text"
              value={formData.topic2}
              onChange={(e) => updateFormData('topic2', e.target.value)}
              placeholder="Topic 2 (optional)"
              className="w-full px-4 py-2 border-2 border-dealflow-light-grey/50 rounded-xl focus:ring-2 focus:ring-dealflow-sky focus:border-dealflow-sky transition-all duration-200 font-body text-dealflow-midnight placeholder:text-dealflow-light-grey"
            />
            <input
              id="topic3-input"
              type="text"
              value={formData.topic3}
              onChange={(e) => updateFormData('topic3', e.target.value)}
              placeholder="Topic 3 (optional)"
              className="w-full px-4 py-2 border-2 border-dealflow-light-grey/50 rounded-xl focus:ring-2 focus:ring-dealflow-sky focus:border-dealflow-sky transition-all duration-200 font-body text-dealflow-midnight placeholder:text-dealflow-light-grey"
            />
          </div>
          <div className="mt-3">
            <p className="text-sm font-body font-semibold text-dealflow-midnight mb-2">Don't know what to write? Here are some examples. Click on the buttons to get started...</p>
            <div className="flex flex-wrap gap-2">
              {topicExamples.map((example, idx) => {
                const isClicked = clickedTopicExample === idx || 
                                 formData.topic1 === example || 
                                 formData.topic2 === example || 
                                 formData.topic3 === example;
                return (
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
                      setClickedTopicExample(idx);
                    }}
                    className={`text-sm font-body px-3 py-2 rounded-lg border transition-all duration-200 ${
                      isClicked
                        ? 'text-dealflow-sky bg-dealflow-sky/10 border-dealflow-sky/50 font-semibold'
                        : 'text-dealflow-light-grey hover:text-dealflow-sky border-dealflow-light-grey/30 hover:bg-dealflow-sky/10 hover:border-dealflow-sky/50'
                    }`}
                  >
                    {example}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Unique Angle */}
        <div>
          <label className="block text-base font-body font-semibold text-dealflow-midnight mb-3">
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
            rows={3}
            maxLength={500}
            aria-required="true"
            aria-invalid={formData.uniqueAngle.length < 30}
            aria-describedby="unique-angle-helper"
            className="w-full px-4 py-2 border-2 border-dealflow-light-grey/50 rounded-xl focus:ring-2 focus:ring-dealflow-sky focus:border-dealflow-sky transition-all duration-200 font-body text-dealflow-midnight placeholder:text-dealflow-light-grey resize-none"
          />
          <p id="unique-angle-helper" className="text-sm font-body text-dealflow-light-grey mt-2">
            {formData.uniqueAngle.length}/500 characters (minimum 30)
          </p>
          <div className="mt-3">
            <p className="text-sm font-body font-semibold text-dealflow-midnight mb-2">Don't know what to write? Here are some examples. Click on the buttons to get started...</p>
            <div className="flex flex-wrap gap-2">
              {uniqueAngleExamples.map((example, idx) => {
                const isClicked = clickedAngleExample === idx || formData.uniqueAngle === example;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      updateFormData('uniqueAngle', example);
                      setClickedAngleExample(idx);
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

        {/* Audience Benefit */}
        <div>
          <label className="block text-base font-body font-semibold text-dealflow-midnight mb-3">
            Who in their audience would benefit most? (optional)
          </label>
          <textarea
            value={formData.audienceBenefit}
            onChange={(e) => updateFormData('audienceBenefit', e.target.value)}
            placeholder="Early-stage SaaS founders figuring out their growth motion, typically $500K-$5M ARR"
            rows={2}
            className="w-full px-4 py-1.5 border-2 border-dealflow-light-grey/50 rounded-xl focus:ring-2 focus:ring-dealflow-sky focus:border-dealflow-sky transition-all duration-200 font-body text-sm text-dealflow-midnight placeholder:text-dealflow-light-grey resize-none"
          />
          <div className="mt-3">
            <p className="text-sm font-body font-semibold text-dealflow-midnight mb-2">Don't know what to write? Here are some examples. Click on the buttons to get started...</p>
            <div className="flex flex-wrap gap-2">
              {audienceBenefitExamples.map((example, idx) => {
                const isClicked = clickedBenefitExample === idx || formData.audienceBenefit === example;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      updateFormData('audienceBenefit', example);
                      setClickedBenefitExample(idx);
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
          className={`w-full py-5 px-8 rounded-xl font-body font-bold text-xl text-white transition-all duration-200 shadow-lg ${
            isValid 
              ? 'bg-gradient-to-r from-dealflow-orange to-dealflow-sky hover:from-dealflow-sky hover:to-dealflow-orange hover:shadow-xl transform hover:-translate-y-0.5' 
              : 'bg-dealflow-light-grey cursor-not-allowed'
          }`}
        >
          Generate My Pitches
        </button>
      </div>
    </div>
  );
}
