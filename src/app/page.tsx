'use client';

import { useState, useMemo } from 'react';
import { AboutYou } from '@/components/FormFields/AboutYou';
import { AboutPodcast } from '@/components/FormFields/AboutPodcast';
import { Audience } from '@/components/FormFields/Audience';
import { YourValue } from '@/components/FormFields/YourValue';
import { PitchScore } from '@/components/PitchScore';
import { Results } from '@/components/Results';
import { calculatePitchScore, type FormData as ScoringFormData } from '@/lib/scoring';

type Step = 'about-you' | 'about-podcast' | 'audience' | 'your-value' | 'generating' | 'results';

interface FormData {
  name: string;
  title: string;
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
  success: boolean;
  generationTimeMs: number;
  pitches: {
    pitch_1: { style: string; subject: string; body: string };
    pitch_2: { style: string; subject: string; body: string };
    pitch_3: { style: string; subject: string; body: string };
    followup_1: { timing: string; subject: string; body: string };
    followup_2: { timing: string; subject: string; body: string };
    followup_3: { timing: string; subject: string; body: string };
  };
  rateLimit?: { remaining: number };
  error?: string;
}

export default function Home() {
  const [step, setStep] = useState<Step>('about-you');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    title: '',
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

  const updateFormData = (field: string, value: string) => {
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

      const data: PitchResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate pitches');
      }

      if (data.success && data.pitches) {
        setPitches(data.pitches);
        setGenerationTime(data.generationTimeMs);
        setStep('results');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStep('your-value');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
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
        return (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-dealflow-teal border-t-transparent"></div>
            <h2 className="mt-6 text-2xl font-semibold text-dealflow-midnight">
              Generating your pitches...
            </h2>
            <p className="mt-2 text-gray-600">This usually takes 3-5 seconds</p>
          </div>
        );
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
            <div className="flex items-center justify-between text-sm">
              <span className={step === 'about-you' ? 'text-dealflow-teal font-medium' : 'text-gray-400'}>
                1. About You
              </span>
              <span className={step === 'about-podcast' ? 'text-dealflow-teal font-medium' : 'text-gray-400'}>
                2. Podcast
              </span>
              <span className={step === 'audience' ? 'text-dealflow-teal font-medium' : 'text-gray-400'}>
                3. Audience
              </span>
              <span className={step === 'your-value' ? 'text-dealflow-teal font-medium' : 'text-gray-400'}>
                4. Value
              </span>
            </div>
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
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
            {error}
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
