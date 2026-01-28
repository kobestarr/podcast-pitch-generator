'use client';

import { useState, useMemo, useEffect } from 'react';
import { AboutYou } from '@/components/FormFields/AboutYou';
import { AboutPodcast } from '@/components/FormFields/AboutPodcast';
import { Audience } from '@/components/FormFields/Audience';
import { YourValue } from '@/components/FormFields/YourValue';
import { PitchScore } from '@/components/PitchScore';
import { Results } from '@/components/Results';
import { calculatePitchScore, type FormData as ScoringFormData } from '@/lib/scoring';

type Step = 'about-you' | 'about-podcast' | 'audience' | 'your-value' | 'generating' | 'results';

interface FormData {
  firstName: string;
  lastName: string;
  title: string[];
  expertise: string;
  credibility: string;
  podcastName: string;
  hostName: string;
  guestName: string;
  episodeTopic: string;
  whyPodcast: string;
  socialPlatform: string;
  followers: string;
  topic1: string;
  topic2: string;
  topic3: string;
  uniqueAngle: string;
  audienceBenefit: string;
}

interface PitchResponse {
  success?: boolean;
  generationTimeMs?: number;
  pitches?: {
    pitch_1: { style: string; subject: string; body: string };
    pitch_2: { style: string; subject: string; body: string };
    pitch_3: { style: string; subject: string; body: string };
    followup_1: { timing: string; subject: string; body: string };
    followup_2: { timing: string; subject: string; body: string };
    followup_3: { timing: string; subject: string; body: string };
  };
  rateLimit?: { remaining: number };
  error?: string;
  errors?: string[];
  message?: string;
  score?: number;
  incompleteFields?: string[];
}

export default function Home() {
  const [step, setStep] = useState<Step>('about-you');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    title: [],
    expertise: '',
    credibility: '',
    podcastName: '',
    hostName: '',
    guestName: '',
    episodeTopic: '',
    whyPodcast: '',
    socialPlatform: '',
    followers: '',
    topic1: '',
    topic2: '',
    topic3: '',
    uniqueAngle: '',
    audienceBenefit: '',
  });
  const [pitches, setPitches] = useState<PitchResponse['pitches'] | null>(null);
  const [generationTime, setGenerationTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // Loading messages component
  function GeneratingPitches() {
    const loadingMessages = [
      "Listening to some podcasts...",
      "Typing away...",
      "Reading show notes...",
      "Checking typos...",
      "Getting your sound check ready...",
      "Passing off podcast knowledge as my own...",
      "Crafting the perfect subject line...",
      "Making it sound human...",
      "Adding just the right amount of personality...",
      "Pretending I've listened to every episode...",
      "Finding the perfect angle...",
      "Writing like a real person, not an AI...",
    ];

    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2500); // Change message every 2.5 seconds

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-dealflow-teal border-t-transparent"></div>
        <h2 className="mt-6 text-2xl font-semibold text-dealflow-midnight">
          Generating your pitches...
        </h2>
        <p className="mt-4 text-gray-600 font-medium">
          {loadingMessages[currentMessageIndex]}
        </p>
        <p className="mt-2 text-sm text-gray-500">This should take less than a minute</p>
      </div>
    );
  }

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate pitch score using shared scoring logic
  const score = useMemo(() => calculatePitchScore(formData), [formData]);

  const generatePitches = async () => {
    setStep('generating');
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Check content-type before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Server returned an invalid response. Please try again.');
      }

      let data: PitchResponse;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Failed to parse server response. Please try again.');
      }

      if (!response.ok) {
        // Handle validation errors with score information
        if (response.status === 400 && data.errors) {
          const errorMessage = data.message || data.error || 'Please complete more fields';
          throw new Error(errorMessage);
        }
        throw new Error(data.error || 'Failed to generate pitches');
      }

      if (data.success && data.pitches) {
        setPitches(data.pitches);
        setGenerationTime(data.generationTimeMs ?? 0);
        setStep('results');
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      // Handle network errors
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      }
      setStep('your-value');
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      title: [],
      expertise: '',
      credibility: '',
      podcastName: '',
      hostName: '',
      guestName: '',
      episodeTopic: '',
      whyPodcast: '',
      socialPlatform: '',
      followers: '',
      topic1: '',
      topic2: '',
      topic3: '',
      uniqueAngle: '',
      audienceBenefit: '',
    });
    setPitches(null);
    setStep('about-you');
  };

  const renderStep = () => {
    switch (step) {
      case 'about-you':
        return (
          <AboutYou 
            formData={formData} 
            updateFormData={updateFormData}
            onNext={() => setStep('about-podcast')}
          />
        );
      case 'about-podcast':
        return (
          <AboutPodcast 
            formData={formData} 
            updateFormData={updateFormData}
            onNext={() => setStep('audience')}
            onBack={() => setStep('about-you')}
          />
        );
      case 'audience':
        return (
          <Audience 
            formData={formData} 
            updateFormData={updateFormData}
            onNext={() => setStep('your-value')}
            onBack={() => setStep('about-podcast')}
          />
        );
      case 'your-value':
        return (
          <YourValue 
            formData={formData} 
            updateFormData={updateFormData}
            onNext={generatePitches}
            onBack={() => setStep('audience')}
          />
        );
      case 'generating':
        return <GeneratingPitches />;
      case 'results':
        if (!pitches) return null;
        return (
          <Results 
            pitches={pitches}
            formData={formData}
            emailSubmitted={emailSubmitted}
            onEmailSubmit={() => setEmailSubmitted(true)}
            onGenerateAnother={resetForm}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-dealflow-cream">
      {/* Header */}
      <header className="bg-dealflow-midnight text-white py-6">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-xl font-semibold">
            Podcast Guest Pitch Generator
          </h1>
        </div>
      </header>

      {/* Progress Bar */}
      {step !== 'generating' && step !== 'results' && (
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="max-w-3xl mx-auto px-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                {step === 'about-you' && 'Step 1 of 4: About You'}
                {step === 'about-podcast' && 'Step 2 of 4: About the Podcast'}
                {step === 'audience' && 'Step 3 of 4: Your Audience'}
                {step === 'your-value' && 'Step 4 of 4: Your Value'}
              </span>
              <span className="text-sm text-gray-500">
                {step === 'about-you' && '1/4'}
                {step === 'about-podcast' && '2/4'}
                {step === 'audience' && '3/4'}
                {step === 'your-value' && '4/4'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className={step === 'about-you' ? 'text-dealflow-teal font-medium' : step === 'about-podcast' || step === 'audience' || step === 'your-value' ? 'text-gray-400' : 'text-gray-400'}>
                1. About You
              </span>
              <span className={step === 'about-podcast' ? 'text-dealflow-teal font-medium' : step === 'audience' || step === 'your-value' ? 'text-gray-400' : 'text-gray-400'}>
                2. Podcast
              </span>
              <span className={step === 'audience' ? 'text-dealflow-teal font-medium' : step === 'your-value' ? 'text-gray-400' : 'text-gray-400'}>
                3. Audience
              </span>
              <span className={step === 'your-value' ? 'text-dealflow-teal font-medium' : 'text-gray-400'}>
                4. Value
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-dealflow-teal transition-all duration-300"
                style={{ 
                  width: step === 'about-you' ? '25%' : 
                         step === 'about-podcast' ? '50%' : 
                         step === 'audience' ? '75%' : '100%' 
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Pitch Score - Show on all form steps */}
      {step !== 'generating' && step !== 'results' && (
        <div className="bg-white border-b border-gray-200 py-3">
          <div className="max-w-3xl mx-auto px-6">
            <PitchScore formData={formData} score={score} />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-3xl mx-auto px-6 mt-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">{error}</p>
                {error.includes('strength') && (
                  <p className="text-sm mt-2 text-red-600">
                    Check the pitch strength meter above to see which fields need completion.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {step === 'generating' && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-dealflow-midnight mb-2">
              Writing a Podcast Guest Pitch That Actually Gets Replies
            </h2>
            <p className="text-lg text-gray-600">
              3 personalized pitches, ready to copy and send.
            </p>
          </div>
        )}
        
        {renderStep()}
      </div>

      {/* Footer */}
      <footer className="bg-dealflow-midnight text-white py-8 mt-12">
        <div className="max-w-3xl mx-auto px-6 text-center text-sm text-gray-400">
          <p>Built by DealFlow Media</p>
          <p className="mt-1">© 2026 All rights reserved</p>
        </div>
      </footer>
    </main>
  );
}
