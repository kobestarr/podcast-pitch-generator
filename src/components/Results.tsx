'use client';

import { useState, useEffect } from 'react';

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

interface Pitches {
  pitch_1: { style: string; subject: string; body: string };
  pitch_2: { style: string; subject: string; body: string };
  pitch_3: { style: string; subject: string; body: string };
  followup_1: { timing: string; subject: string; body: string };
  followup_2: { timing: string; subject: string; body: string };
  followup_3: { timing: string; subject: string; body: string };
}

interface Props {
  pitches: Pitches;
  formData: FormData;
  emailSubmitted: boolean;
  onEmailSubmit: () => void;
  onGenerateAnother: () => void;
}

type VerificationStep = 'email' | 'code' | 'verified';

export function Results({ pitches, formData, emailSubmitted, onEmailSubmit, onGenerateAnother }: Props) {
  const [activeTab, setActiveTab] = useState<'pitches' | 'followups'>('pitches');
  const [activePitch, setActivePitch] = useState<1 | 2 | 3>(1);
  const [copied, setCopied] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [verificationStep, setVerificationStep] = useState<VerificationStep>('email');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const requestVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailError(null);

    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action: 'request' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      // In development, show code in alert for testing
      if (data.code && process.env.NODE_ENV === 'development') {
        alert(`Development mode: Your verification code is ${data.code}`);
      }

      setVerificationStep('code');
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setEmailLoading(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeLoading(true);
    setCodeError(null);

    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode, action: 'verify' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }

      if (data.verified) {
        setEmailVerified(true);
        setVerificationStep('verified');
        onEmailSubmit();
      }
    } catch (err) {
      setCodeError(err instanceof Error ? err.message : 'Invalid code. Please try again.');
    } finally {
      setCodeLoading(false);
    }
  };

  // Only allow viewing pitch_1 if not verified, otherwise show selected pitch
  const canViewPitch = activePitch === 1 || emailVerified;
  const currentPitch = activePitch === 1 ? pitches.pitch_1 : activePitch === 2 ? pitches.pitch_2 : pitches.pitch_3;
  
  // If user tries to select locked pitch, default to pitch_1
  useEffect(() => {
    if (!emailVerified && (activePitch === 2 || activePitch === 3)) {
      setActivePitch(1);
    }
  }, [emailVerified, activePitch]);

  return (
    <div>
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-dealflow-midnight mb-2">
          Your Pitches Are Ready! 🎉
        </h2>
        <p className="text-gray-600">
          3 personalized variations, ready to copy and send to {formData.hostName}.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('pitches')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'pitches' 
              ? 'bg-dealflow-teal text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          3 Pitches
        </button>
        <button
          onClick={() => setActiveTab('followups')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'followups' 
              ? 'bg-dealflow-teal text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Follow-ups
        </button>
      </div>

      {activeTab === 'pitches' ? (
        <div>
          {/* Pitch Selector - Only show pitch_1 initially, unlock others after verification */}
          <div className="flex gap-2 mb-6">
            {/* Pitch 1 - Always available */}
            <button
              onClick={() => setActivePitch(1)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activePitch === 1
                  ? 'bg-dealflow-midnight text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Direct & Professional
            </button>
            
            {/* Pitch 2 & 3 - Gated behind email verification */}
            {emailVerified ? (
              <>
                <button
                  onClick={() => setActivePitch(2)}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    activePitch === 2
                      ? 'bg-dealflow-midnight text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Social Proof
                </button>
                <button
                  onClick={() => setActivePitch(3)}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    activePitch === 3
                      ? 'bg-dealflow-midnight text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Casual & Mobile
                </button>
              </>
            ) : (
              <>
                <button
                  disabled
                  className="flex-1 py-3 px-4 rounded-lg font-medium bg-gray-100 text-gray-400 cursor-not-allowed relative"
                  title="Verify your email to unlock"
                >
                  Social Proof
                  <span className="absolute top-1 right-1 text-xs">🔒</span>
                </button>
                <button
                  disabled
                  className="flex-1 py-3 px-4 rounded-lg font-medium bg-gray-100 text-gray-400 cursor-not-allowed relative"
                  title="Verify your email to unlock"
                >
                  Casual & Mobile
                  <span className="absolute top-1 right-1 text-xs">🔒</span>
                </button>
              </>
            )}
          </div>

          {/* Show verification gate if pitch 2 or 3 is selected but not verified */}
          {!emailVerified && (activePitch === 2 || activePitch === 3) && (
            <div className="mb-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 font-medium mb-2">
                🔒 Verify your email to unlock this pitch
              </p>
              <p className="text-sm text-yellow-700">
                Enter your email below to get access to the Social Proof and Casual & Mobile pitch variations.
              </p>
            </div>
          )}

          {/* Pitch Display - Only show pitch 1 initially, others require verification */}
          {activePitch === 1 || emailVerified ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Pitch Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500">Subject</span>
                    <p className="font-medium text-dealflow-midnight">{currentPitch.subject}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${currentPitch.subject}\n\n${currentPitch.body}`, `pitch-${activePitch}`)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      copied === `pitch-${activePitch}`
                        ? 'bg-green-500 text-white'
                        : 'bg-dealflow-teal text-white hover:bg-dealflow-midnight'
                    }`}
                  >
                    {copied === `pitch-${activePitch}` ? '✓ Copied!' : 'Copy Pitch'}
                  </button>
                </div>
              </div>

              {/* Pitch Body */}
              <div className="p-6">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700">
                    {currentPitch.body}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-dealflow-midnight mb-2">
                Verify your email to unlock this pitch
              </h3>
              <p className="text-gray-600 mb-4">
                Enter your email below to access the Social Proof and Casual & Mobile pitch variations.
              </p>
              <button
                onClick={() => setActiveTab('followups')}
                className="px-6 py-3 bg-dealflow-teal text-white font-semibold rounded-lg hover:bg-dealflow-midnight transition-all"
              >
                Verify Email →
              </button>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-8 p-6 bg-dealflow-cream rounded-xl border border-dealflow-teal/20">
            <h3 className="font-semibold text-dealflow-midnight mb-2">
              Writing pitches is the easy part.
            </h3>
            <p className="text-gray-600 mb-4">
              Most founders send 10 pitches and give up. We send 50+ for you, handle responses, prep you, and get you booked.
            </p>
            <a
              href="https://calendly.com/dealflow-media/podcast-guest-service"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-dealflow-orange text-white font-semibold rounded-lg hover:bg-orange-600 transition-all"
            >
              Want us to handle this for you? →
            </a>
          </div>

          {/* Generate Another */}
          <button
            onClick={onGenerateAnother}
            className="w-full mt-4 py-3 px-4 text-gray-600 hover:text-gray-800 transition-all"
          >
            Generate another pitch for a different podcast →
          </button>
        </div>
      ) : (
        <div>
          {/* Email Verification Gate for Follow-ups */}
          {!emailSubmitted ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-dealflow-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-dealflow-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              
              {verificationStep === 'email' && (
                <>
                  <h3 className="text-xl font-semibold text-dealflow-midnight mb-2">
                    Verify Your Email to Unlock
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Enter your email to get all 3 follow-up templates + bonus PDF cheat sheet. We'll send you a verification code.
                  </p>
                  
                  <form onSubmit={requestVerificationCode} className="max-w-md mx-auto">
                    <div className="flex gap-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealflow-teal focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={emailLoading}
                        className="px-6 py-3 bg-dealflow-teal text-white font-semibold rounded-lg hover:bg-dealflow-midnight transition-all disabled:opacity-50"
                      >
                        {emailLoading ? 'Sending...' : 'Send Code'}
                      </button>
                    </div>
                    {emailError && (
                      <p className="text-red-500 text-sm mt-2">{emailError}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-3">
                      We'll also add you to our Content Catalyst newsletter. Unsubscribe anytime.
                    </p>
                  </form>
                </>
              )}

              {verificationStep === 'code' && (
                <>
                  <h3 className="text-xl font-semibold text-dealflow-midnight mb-2">
                    Enter Verification Code
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We sent a 6-digit code to <strong>{email}</strong>. Enter it below to verify.
                  </p>
                  
                  <form onSubmit={verifyCode} className="max-w-md mx-auto">
                    <div className="flex gap-3 mb-4">
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setVerificationCode(value);
                        }}
                        placeholder="000000"
                        required
                        maxLength={6}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dealflow-teal focus:border-transparent text-center text-2xl font-mono tracking-widest"
                      />
                      <button
                        type="submit"
                        disabled={codeLoading || verificationCode.length !== 6}
                        className="px-6 py-3 bg-dealflow-teal text-white font-semibold rounded-lg hover:bg-dealflow-midnight transition-all disabled:opacity-50"
                      >
                        {codeLoading ? 'Verifying...' : 'Verify'}
                      </button>
                    </div>
                    {codeError && (
                      <p className="text-red-500 text-sm mb-2">{codeError}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setVerificationStep('email');
                        setCodeError(null);
                        setVerificationCode('');
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      ← Use a different email
                    </button>
                  </form>
                </>
              )}

              {verificationStep === 'verified' && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-dealflow-midnight mb-2">
                    Email Verified! ✅
                  </h3>
                  <p className="text-gray-600">
                    You now have access to all pitches and follow-up templates.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {[pitches.followup_1, pitches.followup_2, pitches.followup_3].map((followup, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-500">Follow-up {idx + 1} · {followup.timing}</span>
                        <p className="font-medium text-dealflow-midnight">{followup.subject}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(`${followup.subject}\n\n${followup.body}`, `followup-${idx + 1}`)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                          copied === `followup-${idx + 1}`
                            ? 'bg-green-500 text-white'
                            : 'bg-dealflow-teal text-white hover:bg-dealflow-midnight'
                        }`}
                      >
                        {copied === `followup-${idx + 1}` ? '✓' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm">
                      {followup.body}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
