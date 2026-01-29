'use client';

import { useState, useMemo, useEffect } from 'react';
import { AboutYou } from '@/components/FormFields/AboutYou';
import { AboutPodcast } from '@/components/FormFields/AboutPodcast';
import { Audience } from '@/components/FormFields/Audience';
import { YourValue } from '@/components/FormFields/YourValue';
import { PitchScore } from '@/components/PitchScore';
import { Results } from '@/components/Results';
import { calculatePitchScore, type FormData as ScoringFormData } from '@/lib/scoring';
import { 
  trackFormStarted, 
  trackFormStepCompleted, 
  trackPitchGenerated 
} from '@/lib/analytics';

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
  const [hasTrackedFormStart, setHasTrackedFormStart] = useState(false);
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
        <div className="relative inline-block">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-dealflow-sky/20 border-t-dealflow-sky border-r-dealflow-orange"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 bg-gradient-to-br from-dealflow-sky to-dealflow-orange rounded-full animate-pulse"></div>
          </div>
        </div>
        <h2 className="mt-8 text-3xl font-heading font-bold text-dealflow-midnight">
          Generating your pitches...
        </h2>
        <p className="mt-4 text-lg font-body font-semibold text-dealflow-sky">
          {loadingMessages[currentMessageIndex]}
        </p>
        <p className="mt-2 text-sm font-body text-dealflow-light-grey">This should take less than a minute</p>
      </div>
    );
  }

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate pitch score using shared scoring logic
  const score = useMemo(() => calculatePitchScore(formData), [formData]);

  // Track form started (when user first interacts)
  useEffect(() => {
    if (step === 'about-you' && !hasTrackedFormStart) {
      trackFormStarted();
      setHasTrackedFormStart(true);
    }
  }, [step, hasTrackedFormStart]);

  // Track form step completions
  useEffect(() => {
    if (step === 'about-podcast') {
      trackFormStepCompleted('about-you');
    } else if (step === 'audience') {
      trackFormStepCompleted('about-podcast');
    } else if (step === 'your-value') {
      trackFormStepCompleted('audience');
    } else if (step === 'generating') {
      trackFormStepCompleted('your-value');
    }
  }, [step]);

  // Track pitch generation when pitches are successfully generated
  useEffect(() => {
    if (pitches && step === 'results') {
      trackPitchGenerated(score);
    }
  }, [pitches, step, score]);

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
        // Scroll to top when results are shown
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <header className="bg-gradient-to-r from-dealflow-midnight to-dealflow-sky text-white py-8 shadow-lg">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold">
            Podcast Guest Pitch Generator
          </h1>
          <p className="mt-2 text-white/90 text-lg font-body">
            Write pitches that actually get replies
          </p>
        </div>
      </header>

      {/* Progress Bar and Pitch Score - Combined Sticky Container */}
      {step !== 'generating' && step !== 'results' && (
        <div className="bg-white border-b border-dealflow-light-grey/30 shadow-sm sticky top-0 z-20">
          {/* Progress Bar */}
          <div className="max-w-4xl mx-auto px-6 py-1.5 border-b border-dealflow-light-grey/20">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <span className={`text-xs font-body font-medium transition-colors duration-200 ${step === 'about-you' ? 'text-dealflow-sky font-semibold' : 'text-dealflow-light-grey'}`}>
                  1. About You
                </span>
                <span className={`text-xs font-body font-medium transition-colors duration-200 ${step === 'about-podcast' ? 'text-dealflow-sky font-semibold' : 'text-dealflow-light-grey'}`}>
                  2. Podcast
                </span>
                <span className={`text-xs font-body font-medium transition-colors duration-200 ${step === 'audience' ? 'text-dealflow-sky font-semibold' : 'text-dealflow-light-grey'}`}>
                  3. Audience
                </span>
                <span className={`text-xs font-body font-medium transition-colors duration-200 ${step === 'your-value' ? 'text-dealflow-sky font-semibold' : 'text-dealflow-light-grey'}`}>
                  4. Value
                </span>
              </div>
              <div className="flex-1 max-w-xs">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-dealflow-sky to-dealflow-orange transition-all duration-500 ease-out rounded-full"
                    style={{ 
                      width: step === 'about-you' ? '25%' : 
                             step === 'about-podcast' ? '50%' : 
                             step === 'audience' ? '75%' : '100%' 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Pitch Score */}
          <div className="max-w-4xl mx-auto px-6 py-1.5">
            <PitchScore formData={formData} score={score} />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto px-6 mt-6">
          <div className="bg-dealflow-muted-red/10 border-2 border-dealflow-muted-red/30 text-dealflow-muted-red px-6 py-4 rounded-xl shadow-md">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-body font-semibold text-lg">{error}</p>
                {error.includes('strength') && (
                  <p className="text-sm mt-2 text-dealflow-muted-red/80 font-body">
                    Check the pitch strength meter above to see which fields need completion.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {step === 'generating' && (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-dealflow-midnight mb-3">
              Writing a Podcast Guest Pitch That Actually Gets Replies
            </h2>
            <p className="text-xl font-body text-dealflow-light-grey">
              3 personalized pitches, ready to copy and send.
            </p>
          </div>
        )}
        
        {renderStep()}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-dealflow-midnight to-dealflow-sky text-white py-10 mt-16 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-body font-semibold text-lg">Built by DealFlow Media</p>
          <p className="mt-2 text-sm font-body text-white/80">© 2026 All rights reserved</p>
        </div>
      </footer>
    </main>
  );
}
