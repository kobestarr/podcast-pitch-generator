'use client';

import { useState } from 'react';

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
  const [clickedCredibilityExample, setClickedCredibilityExample] = useState<number | null>(null);
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
    <div className="bg-white rounded-2xl shadow-lg border border-dealflow-light-grey/30 p-10 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-3xl font-heading font-bold text-dealflow-midnight mb-2">
        Tell us about yourself
      </h2>
      <p className="text-lg font-body text-dealflow-light-grey mb-6">
        This helps us understand your credibility and expertise.
      </p>

      <div className="space-y-4">
        {/* First Name and Last Name - Side by Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label 
              htmlFor="first-name-input"
              className="block text-base font-body font-semibold text-dealflow-midnight mb-2"
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
              className="w-full px-4 py-2 border-2 border-dealflow-light-grey/50 rounded-xl focus:ring-2 focus:ring-dealflow-sky focus:border-dealflow-sky transition-all duration-200 font-body text-dealflow-midnight placeholder:text-dealflow-light-grey"
            />
          </div>

          <div>
            <label 
              htmlFor="last-name-input"
              className="block text-base font-body font-semibold text-dealflow-midnight mb-2"
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
              className="w-full px-4 py-2 border-2 border-dealflow-light-grey/50 rounded-xl focus:ring-2 focus:ring-dealflow-sky focus:border-dealflow-sky transition-all duration-200 font-body text-dealflow-midnight placeholder:text-dealflow-light-grey"
            />
          </div>
        </div>

        {/* Title - Multi-Select */}
        <div>
          <label className="block text-base font-body font-semibold text-dealflow-midnight mb-3">
            Your title/role * (select all that apply)
          </label>
          <div className="space-y-0.5 max-h-64 overflow-y-auto border-2 border-dealflow-light-grey/50 rounded-xl p-2 bg-dealflow-cream/50">
            {titleOptions.map(option => {
              const isSelected = (formData.title || []).includes(option);
              return (
                <label
                  key={option}
                  className="flex items-center gap-2 py-0.5 px-2 rounded hover:bg-white cursor-pointer transition-all duration-200"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleTitle(option)}
                    className="w-4 h-4 text-dealflow-sky border-2 border-dealflow-light-grey rounded focus:ring-1 focus:ring-dealflow-sky cursor-pointer"
                  />
                  <span className="text-sm font-body text-dealflow-midnight">{option}</span>
                </label>
              );
            })}
          </div>
          {(formData.title || []).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm font-body text-dealflow-light-grey">Selected:</span>
              {(formData.title || []).map(title => (
                <span
                  key={title}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-dealflow-sky/10 to-dealflow-orange/10 text-dealflow-sky rounded-lg text-sm font-body font-semibold border border-dealflow-sky/20"
                >
                  {title}
                  <button
                    type="button"
                    onClick={() => toggleTitle(title)}
                    className="hover:text-dealflow-orange transition-colors"
                    aria-label={`Remove ${title}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          {(!formData.title || formData.title.length === 0) && (
            <p className="text-sm font-body text-dealflow-muted-red mt-2">Please select at least one title</p>
          )}
        </div>

        {/* Expertise */}
        <div>
          <label 
            htmlFor="expertise-select"
            className="block text-base font-body font-semibold text-dealflow-midnight mb-2"
          >
            Your area of expertise *
          </label>
          <select
            id="expertise-select"
            value={formData.expertise}
            onChange={(e) => updateFormData('expertise', e.target.value)}
            aria-required="true"
            aria-invalid={!formData.expertise}
            className="w-full px-4 py-1 border-2 border-dealflow-light-grey/50 rounded-xl focus:ring-2 focus:ring-dealflow-sky focus:border-dealflow-sky transition-all duration-200 bg-white font-body text-sm text-dealflow-midnight"
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
            className="block text-base font-body font-semibold text-dealflow-midnight mb-2"
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
            rows={2}
            maxLength={500}
            aria-required="true"
            aria-invalid={formData.credibility.length < 20}
            aria-describedby="credibility-helper"
            className="w-full px-4 py-1.5 border-2 border-dealflow-light-grey/50 rounded-xl focus:ring-2 focus:ring-dealflow-sky focus:border-dealflow-sky transition-all duration-200 font-body text-sm text-dealflow-midnight placeholder:text-dealflow-light-grey resize-none"
          />
          <p id="credibility-helper" className="text-sm font-body text-dealflow-light-grey mt-2">
            {formData.credibility.length}/500 characters (minimum 20)
          </p>
          <div className="mt-3">
            <p className="text-sm font-body font-semibold text-dealflow-midnight mb-2">Don't know what to write? Here are some examples. Click on the buttons to get started...</p>
            <div className="flex flex-wrap gap-2">
              {credibilityExamples.map((example, idx) => {
                const isClicked = clickedCredibilityExample === idx || formData.credibility === example;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      updateFormData('credibility', example);
                      setClickedCredibilityExample(idx);
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
