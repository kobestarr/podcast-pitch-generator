'use client';

import { useState, useEffect } from 'react';
import { 
  trackEmailVerificationStarted, 
  trackEmailVerified, 
  trackPitchDownloaded, 
  trackPitchCopied,
  trackCourseSignupClick
} from '@/lib/analytics';

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
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      
      // Track copy event
      if (id.startsWith('pitch-')) {
        const pitchNum = parseInt(id.split('-')[1]) as 1 | 2 | 3;
        trackPitchCopied(pitchNum);
      } else if (id.startsWith('followup-')) {
        const followupNum = parseInt(id.split('-')[1]);
        trackPitchCopied(followupNum + 10); // Use 10+ for follow-ups to differentiate
      }
      
      setToastMessage('Pitch copied to clipboard!');
      setShowToast(true);
      setTimeout(() => {
        setCopied(null);
        setShowToast(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setToastMessage('Failed to copy. Please try again.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const formatPitchBody = (body: string) => {
    return body.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={i} className="h-3" />;
      }
      return (
        <p key={i} className="mb-3 leading-relaxed text-gray-700">
          {trimmed}
        </p>
      );
    });
  };

  const downloadPitch = (pitch: { subject: string; body: string }, filename: string) => {
    const content = `Subject: ${pitch.subject}\n\n${pitch.body}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Track download
    trackPitchDownloaded(activePitch);
    
    setToastMessage('Download started!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const downloadAllPitches = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const content = `Podcast Pitch Generator - All Pitches\nGenerated: ${timestamp}\n\n${'='.repeat(50)}\n\n` +
      Object.entries(pitches)
        .filter(([key]) => key.startsWith('pitch_'))
        .map(([key, pitch]) => {
          const pitchNum = key.split('_')[1];
          const style = pitch.style || `Pitch ${pitchNum}`;
          return `${style.toUpperCase()}\n${'='.repeat(50)}\n\nSubject: ${pitch.subject}\n\n${pitch.body}\n\n${'='.repeat(50)}\n\n`;
        })
        .join('');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `podcast-pitches-all-${timestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Track download all
    trackPitchDownloaded(0);
    
    setToastMessage('All pitches downloaded!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const requestVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailError(null);

    // Track email verification started
    trackEmailVerificationStarted();

    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), action: 'request' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      // In development, show code in console for testing (if email fails)
      if (data.code && process.env.NODE_ENV === 'development') {
        console.log('Development mode - Verification code:', data.code);
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
      // Normalize the code: trim and ensure it's exactly 6 digits
      const normalizedCode = verificationCode.trim().replace(/\D/g, '');
      
      if (normalizedCode.length !== 6) {
        setCodeError('Please enter a 6-digit verification code');
        setCodeLoading(false);
        return;
      }

      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim(), 
          code: normalizedCode, 
          action: 'verify',
          formData: formData // Send all form data for GHL sync
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }

      if (data.verified) {
        setEmailVerified(true);
        setVerificationStep('verified');
        setShowEmailModal(false);
        onEmailSubmit();
        
        // Track email verification (primary conversion)
        trackEmailVerified();
        
        // Unlock pitches 2 and 3
        if (activePitch === 2 || activePitch === 3) {
          // Keep current selection
        } else {
          // User was viewing pitch 1, keep it
        }
      }
    } catch (err) {
      setCodeError(err instanceof Error ? err.message : 'Invalid code. Please try again.');
    } finally {
      setCodeLoading(false);
    }
  };

  const currentPitch = activePitch === 1 ? pitches.pitch_1 : activePitch === 2 ? pitches.pitch_2 : pitches.pitch_3;

  // Toast notification component
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out">
          <div className="bg-dealflow-midnight text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 transform transition-all duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
      {/* Email Gate Modal */}
      {showEmailModal && !emailVerified && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transition-transform duration-200 transform scale-100">
            <div className="p-8">
              {/* Close Button */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-heading font-bold text-dealflow-midnight">
                  Unlock All Pitch Versions
                </h3>
                <button
                  onClick={() => {
                    setShowEmailModal(false);
                    setEmailError(null);
                    setCodeError(null);
                    // Reset to pitch 1 if not verified
                    if (!emailVerified && (activePitch === 2 || activePitch === 3)) {
                      setActivePitch(1);
                    }
                  }}
                  className="text-dealflow-light-grey hover:text-dealflow-midnight transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Bonuses List */}
              <div className="mb-8">
                <p className="text-lg font-body text-dealflow-light-grey mb-5">Verify your email to unlock:</p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-dealflow-sky mt-0.5 text-xl">✅</span>
                    <span className="text-dealflow-midnight font-body">Access to <strong className="font-semibold">Social Proof</strong> pitch version</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-dealflow-sky mt-0.5 text-xl">✅</span>
                    <span className="text-dealflow-midnight font-body">Access to <strong className="font-semibold">Casual & Mobile</strong> pitch version</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-dealflow-sky mt-0.5 text-xl">✅</span>
                    <span className="text-dealflow-midnight font-body"><strong className="font-semibold">3 follow-up email templates</strong> (5-7 days, 10-14 days, 21 days)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-dealflow-sky mt-0.5 text-xl">✅</span>
                    <span className="text-dealflow-midnight font-body">
                      <strong className="font-semibold">FREE 7 day podcast guesting email course</strong>
                      {emailVerified && (
                        <span className="ml-2">
                          <a 
                            href="https://v.stripped.media/7-day-podcast-guesting-course-lp?utm_source=podcast-pitch-generator&utm_medium=email-verification&utm_campaign=7-day-course-signup&utm_content=modal-bonus"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-dealflow-sky hover:text-dealflow-midnight underline text-sm"
                          >
                            (Access course)
                          </a>
                        </span>
                      )}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-dealflow-sky mt-0.5 text-xl">✅</span>
                    <span className="text-dealflow-midnight font-body">Content Catalyst newsletter subscription (unsubscribe anytime)</span>
                  </li>
                </ul>
              </div>

              {/* Email Verification Form */}
              {verificationStep === 'email' && (
                <form onSubmit={requestVerificationCode}>
                  <div className="flex gap-3 mb-3">
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
                    <p className="text-red-500 text-sm mb-3">{emailError}</p>
                  )}
                </form>
              )}

              {verificationStep === 'code' && (
                <form onSubmit={verifyCode}>
                  <div className="mb-5">
                    <p className="text-base font-body text-dealflow-light-grey mb-4">
                      We sent a 6-digit code to <strong className="font-semibold text-dealflow-midnight">{email}</strong>. Enter it below:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
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
                        className="flex-1 px-5 py-4 border-2 border-dealflow-light-grey/50 rounded-xl focus:ring-2 focus:ring-dealflow-sky focus:border-dealflow-sky text-center text-2xl font-mono tracking-widest transition-all duration-200"
                      />
                      <button
                        type="submit"
                        disabled={codeLoading || verificationCode.length !== 6}
                        className="px-6 py-4 bg-gradient-to-r from-dealflow-sky to-dealflow-sky/90 text-white font-body font-semibold rounded-xl hover:from-dealflow-midnight hover:to-dealflow-sky transition-all duration-200 disabled:opacity-50 whitespace-nowrap shadow-lg hover:shadow-xl"
                      >
                        {codeLoading ? 'Verifying...' : 'Verify'}
                      </button>
                    </div>
                    {codeError && (
                      <div className="mt-3">
                        <p className="text-dealflow-muted-red text-sm font-body mb-2">{codeError}</p>
                        {(codeError.includes('No verification code found') || codeError.includes('expired')) && (
                          <button
                            type="button"
                            onClick={async () => {
                              setCodeError(null);
                              setVerificationCode('');
                              setEmailLoading(true);
                              try {
                                const response = await fetch('/api/verify-email', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ email, action: 'request' }),
                                });
                                const data = await response.json();
                                if (!response.ok) {
                                  setEmailError(data.error || 'Failed to send verification code');
                                } else {
                                  // Code sent successfully, stay on code step
                                }
                              } catch (err) {
                                setEmailError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
                              } finally {
                                setEmailLoading(false);
                              }
                            }}
                            className="text-sm font-body text-dealflow-sky hover:text-dealflow-midnight font-semibold transition-colors underline"
                          >
                            Request a new code →
                          </button>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setVerificationStep('email');
                          setCodeError(null);
                          setVerificationCode('');
                        }}
                        className="text-sm font-body text-dealflow-light-grey hover:text-dealflow-sky transition-colors"
                      >
                        ← Use a different email
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          setCodeError(null);
                          setVerificationCode('');
                          setEmailLoading(true);
                          try {
                            const response = await fetch('/api/verify-email', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ email, action: 'request' }),
                            });
                            const data = await response.json();
                            if (!response.ok) {
                              setCodeError(data.error || 'Failed to send verification code');
                            } else {
                              // Code sent successfully, stay on code step
                            }
                          } catch (err) {
                            setCodeError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
                          } finally {
                            setEmailLoading(false);
                          }
                        }}
                        className="text-sm font-body text-dealflow-light-grey hover:text-dealflow-sky transition-colors"
                      >
                        Resend code
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {verificationStep === 'verified' && (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-dealflow-warm-green/20 to-dealflow-sky/20 rounded-full mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-dealflow-warm-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-heading font-bold text-dealflow-midnight mb-3">
                    Email Verified! ✅
                  </h4>
                  <p className="text-lg font-body text-dealflow-light-grey mb-6">
                    You now have access to all pitches and follow-up templates.
                  </p>
                  <div className="mb-6">
                    <a 
                      href="https://v.stripped.media/7-day-podcast-guesting-course-lp?utm_source=podcast-pitch-generator&utm_medium=email-verification&utm_campaign=7-day-course-signup&utm_content=verified-success"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-dealflow-sky hover:text-dealflow-midnight underline font-body font-semibold"
                    >
                      Access your FREE 7 day podcast guesting email course →
                    </a>
                  </div>
                  <button
                    onClick={() => {
                      setShowEmailModal(false);
                      setActiveTab('pitches');
                      // Switch to the pitch they wanted to see
                      if (activePitch === 2 || activePitch === 3) {
                        // Already set, keep it
                      } else {
                        setActivePitch(2); // Default to Social Proof after verification
                      }
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-dealflow-sky to-dealflow-sky/90 text-white font-body font-bold rounded-xl hover:from-dealflow-midnight hover:to-dealflow-sky transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    View All Pitches →
                  </button>
                </div>
              )}

                  <p className="text-sm font-body text-dealflow-light-grey mt-6 text-center">
                We'll add you to our Content Catalyst newsletter. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Success Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-dealflow-sky/20 to-dealflow-orange/20 rounded-full shadow-lg">
            <svg className="w-6 h-6 text-dealflow-sky" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-dealflow-midnight">
            Your Pitches Are Ready! 🎉
          </h2>
        </div>
        <p className="text-base sm:text-lg font-body text-dealflow-light-grey ml-16">
          3 personalized variations, ready to copy and send to {formData.hostName}.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setActiveTab('pitches')}
          className={`px-6 py-3 rounded-xl font-body font-semibold text-base transition-all duration-200 ${
            activeTab === 'pitches' 
              ? 'bg-gradient-to-r from-dealflow-sky to-dealflow-sky/90 text-white shadow-lg' 
              : 'bg-white text-dealflow-light-grey hover:text-dealflow-sky border-2 border-dealflow-light-grey/30 hover:border-dealflow-sky/50'
          }`}
        >
          3 Pitches
        </button>
        <button
          onClick={() => setActiveTab('followups')}
          className={`px-6 py-3 rounded-xl font-body font-semibold text-base transition-all duration-200 ${
            activeTab === 'followups' 
              ? 'bg-gradient-to-r from-dealflow-sky to-dealflow-sky/90 text-white shadow-lg' 
              : 'bg-white text-dealflow-light-grey hover:text-dealflow-sky border-2 border-dealflow-light-grey/30 hover:border-dealflow-sky/50'
          }`}
        >
          Follow-ups
        </button>
      </div>

      {activeTab === 'pitches' ? (
        <div className="transition-opacity duration-300">
          {/* Pitch Selector - Only show pitch_1 initially, unlock others after verification */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Pitch 1 - Always available */}
            <button
              onClick={() => setActivePitch(1)}
              className={`flex-[0.75] py-2 px-3 rounded-lg font-body font-semibold text-sm transition-all duration-200 ${
                activePitch === 1
                  ? 'bg-gradient-to-r from-dealflow-midnight to-dealflow-sky text-white shadow-lg transform scale-105'
                  : 'bg-white text-dealflow-light-grey hover:text-dealflow-sky border-2 border-dealflow-light-grey/30 hover:border-dealflow-sky/50'
              }`}
            >
              Direct & Professional
            </button>
            
            {/* Pitch 2 & 3 - Gated behind email verification */}
            {emailVerified ? (
              <>
                <button
                  onClick={() => setActivePitch(2)}
                  className={`flex-[0.75] py-2 px-3 rounded-lg font-body font-semibold text-sm transition-all duration-200 ${
                    activePitch === 2
                      ? 'bg-gradient-to-r from-dealflow-midnight to-dealflow-sky text-white shadow-lg transform scale-105'
                      : 'bg-white text-dealflow-light-grey hover:text-dealflow-sky border-2 border-dealflow-light-grey/30 hover:border-dealflow-sky/50'
                  }`}
                >
                  See Social Proof version
                </button>
                <button
                  onClick={() => setActivePitch(3)}
                  className={`flex-[0.75] py-2 px-3 rounded-lg font-body font-semibold text-sm transition-all duration-200 ${
                    activePitch === 3
                      ? 'bg-gradient-to-r from-dealflow-midnight to-dealflow-sky text-white shadow-lg transform scale-105'
                      : 'bg-white text-dealflow-light-grey hover:text-dealflow-sky border-2 border-dealflow-light-grey/30 hover:border-dealflow-sky/50'
                  }`}
                >
                  See Casual and Mobile Version
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setShowEmailModal(true);
                    setActivePitch(2); // Set desired pitch for after verification
                  }}
                  className="flex-[0.75] py-2 px-3 rounded-lg font-body font-semibold text-sm bg-white text-dealflow-light-grey hover:text-dealflow-sky border-2 border-dealflow-light-grey/30 hover:border-dealflow-sky/50 transition-all relative animate-pulse-locked"
                  title="Verify your email to unlock"
                >
                  See Social Proof version
                  <span className="absolute top-1 right-1 text-xs animate-pulse">🔒</span>
                </button>
                <button
                  onClick={() => {
                    setShowEmailModal(true);
                    setActivePitch(3); // Set desired pitch for after verification
                  }}
                  className="flex-[0.75] py-2 px-3 rounded-lg font-body font-semibold text-sm bg-white text-dealflow-light-grey hover:text-dealflow-sky border-2 border-dealflow-light-grey/30 hover:border-dealflow-sky/50 transition-all relative animate-pulse-locked"
                  title="Verify your email to unlock"
                >
                  See Casual and Mobile Version
                  <span className="absolute top-1 right-1 text-xs animate-pulse">🔒</span>
                </button>
              </>
            )}
          </div>


          {/* Pitch Display - Only show pitch 1 initially, others require verification */}
          {activePitch === 1 || emailVerified ? (
            <div className="bg-white rounded-2xl shadow-xl border border-dealflow-light-grey/30 overflow-hidden transition-all duration-300">
              {/* Pitch Header */}
              <div className="bg-gradient-to-r from-dealflow-sky/10 to-dealflow-orange/10 px-6 sm:px-8 py-6 border-b border-dealflow-light-grey/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <span className="text-xs sm:text-sm font-body text-dealflow-light-grey uppercase tracking-wide">Subject</span>
                    <p className="font-heading font-bold text-dealflow-midnight text-xl sm:text-2xl mt-2">{currentPitch.subject}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        const timestamp = new Date().toISOString().split('T')[0];
                        const pitchNum = activePitch;
                        const style = currentPitch.style || `pitch-${pitchNum}`;
                        downloadPitch(currentPitch, `podcast-pitch-${style.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.txt`);
                      }}
                      className="px-4 sm:px-5 py-2.5 rounded-xl font-body font-semibold transition-all duration-200 bg-white text-dealflow-midnight border-2 border-dealflow-light-grey/30 hover:bg-dealflow-sky/10 hover:border-dealflow-sky flex items-center gap-2 shadow-sm hover:shadow-md"
                      title="Download pitch"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span className="hidden sm:inline">Download</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(`${currentPitch.subject}\n\n${currentPitch.body}`, `pitch-${activePitch}`)}
                      className={`px-4 sm:px-5 py-2.5 rounded-xl font-body font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md ${
                        copied === `pitch-${activePitch}`
                          ? 'bg-gradient-to-r from-dealflow-warm-green to-dealflow-warm-green/90 text-white'
                          : 'bg-gradient-to-r from-dealflow-sky to-dealflow-sky/90 text-white hover:from-dealflow-midnight hover:to-dealflow-sky'
                      }`}
                    >
                      {copied === `pitch-${activePitch}` ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="hidden sm:inline">Copied!</span>
                          <span className="sm:hidden">✓</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="hidden sm:inline">Copy Pitch</span>
                          <span className="sm:hidden">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Pitch Body */}
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="prose prose-sm sm:prose-base max-w-none">
                  <div className="text-dealflow-midnight leading-relaxed font-body text-base sm:text-lg">
                    {formatPitchBody(currentPitch.body)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border border-dealflow-light-grey/30 p-8 sm:p-10 lg:p-12">
              <div className="text-center mb-8">
                <div className="text-5xl mb-6">🔒</div>
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-dealflow-midnight mb-4">
                  Send us your email to unlock the other two pitches
                </h3>
                <p className="text-lg font-body text-dealflow-light-grey mb-6 leading-relaxed">
                  Enter your email below to see the Social Proof and Casual & Mobile pitch variations. In doing so, you will also receive:
                </p>
                <ul className="text-left max-w-md mx-auto mb-8 space-y-3 text-dealflow-midnight font-body">
                  <li className="flex items-start gap-3">
                    <span className="text-dealflow-sky mt-1 text-xl">✓</span>
                    <span>Access to <strong className="font-semibold">Social Proof</strong> pitch version</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-dealflow-sky mt-1 text-xl">✓</span>
                    <span>Access to <strong className="font-semibold">Casual & Mobile</strong> pitch version</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-dealflow-sky mt-1 text-xl">✓</span>
                    <span><strong className="font-semibold">3 follow-up email templates</strong> (5-7 days, 10-14 days, 21 days)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-dealflow-sky mt-1 text-xl">✓</span>
                    <span>
                      <strong className="font-semibold">FREE 7 day podcast guesting email course</strong>
                      {emailVerified && (
                        <span className="ml-2">
                          <a 
                            href="https://v.stripped.media/7-day-podcast-guesting-course-lp?utm_source=podcast-pitch-generator&utm_medium=email-verification&utm_campaign=7-day-course-signup&utm_content=locked-section-bonus"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-dealflow-sky hover:text-dealflow-midnight underline text-sm"
                          >
                            (Access course)
                          </a>
                        </span>
                      )}
                    </span>
                  </li>
                </ul>
                <p className="text-sm font-body text-dealflow-light-grey mb-8">
                  You will also join our email newsletter, <strong className="font-semibold text-dealflow-midnight">Content Catalyst</strong>. You can unsubscribe at any time.
                </p>
              </div>
              
              {/* Email Input Form */}
              {verificationStep === 'email' && (
                <form onSubmit={requestVerificationCode} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="flex-1 px-5 py-4 border-2 border-dealflow-light-grey/50 rounded-xl focus:ring-2 focus:ring-dealflow-sky focus:border-dealflow-sky transition-all duration-200 font-body text-dealflow-midnight placeholder:text-dealflow-light-grey"
                    />
                    <button
                      type="submit"
                      disabled={emailLoading}
                      className="px-6 py-4 bg-gradient-to-r from-dealflow-sky to-dealflow-sky/90 text-white font-body font-semibold rounded-xl hover:from-dealflow-midnight hover:to-dealflow-sky transition-all duration-200 disabled:opacity-50 whitespace-nowrap shadow-lg hover:shadow-xl"
                    >
                      {emailLoading ? 'Sending...' : 'Send Code'}
                    </button>
                  </div>
                  {emailError && (
                    <p className="text-dealflow-muted-red text-sm text-center mb-3 font-body">{emailError}</p>
                  )}
                </form>
              )}

              {verificationStep === 'code' && (
                <form onSubmit={verifyCode} className="max-w-md mx-auto">
                  <p className="text-base font-body text-dealflow-light-grey mb-5 text-center">
                    We sent a 6-digit code to <strong className="font-semibold text-dealflow-midnight">{email}</strong>. Enter it below:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
                      className="flex-1 px-5 py-4 border-2 border-dealflow-light-grey/50 rounded-xl focus:ring-2 focus:ring-dealflow-sky focus:border-dealflow-sky text-center text-2xl font-mono tracking-widest transition-all duration-200"
                    />
                    <button
                      type="submit"
                      disabled={codeLoading || verificationCode.length !== 6}
                      className="px-6 py-4 bg-gradient-to-r from-dealflow-sky to-dealflow-sky/90 text-white font-body font-semibold rounded-xl hover:from-dealflow-midnight hover:to-dealflow-sky transition-all duration-200 disabled:opacity-50 whitespace-nowrap shadow-lg hover:shadow-xl"
                    >
                      {codeLoading ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                  {codeError && (
                    <p className="text-dealflow-muted-red text-sm text-center mb-3 font-body">{codeError}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setVerificationStep('email');
                      setCodeError(null);
                      setVerificationCode('');
                    }}
                    className="text-sm font-body text-dealflow-light-grey hover:text-dealflow-sky text-center w-full mt-3 transition-colors"
                  >
                    ← Use a different email
                  </button>
                </form>
              )}

              {verificationStep === 'verified' && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-dealflow-warm-green/20 to-dealflow-sky/20 rounded-full mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-dealflow-warm-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-heading font-bold text-dealflow-midnight mb-3">
                    Email Verified! ✅
                  </h4>
                  <p className="text-lg font-body text-dealflow-light-grey mb-4">
                    You now have access to all pitches and follow-up templates.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Download All & CTA Section */}
          <div className="mt-6 sm:mt-8 space-y-4">
            {emailVerified && (
              <>
                {/* Course Signup CTA - Primary */}
                <div className="bg-gradient-to-r from-dealflow-midnight via-dealflow-sky to-dealflow-sky rounded-2xl p-8 sm:p-10 text-white shadow-xl">
                  <h3 className="text-2xl sm:text-3xl font-heading font-bold mb-3">
                    Want to Land More Podcast Appearances?
                  </h3>
                  <p className="mb-6 text-lg font-body opacity-95 leading-relaxed">
                    Get our free 7-day podcast guesting course. Learn how to pitch, get booked, and turn appearances into clients.
                  </p>
                  <a
                    href="https://v.stripped.media/7-day-podcast-guesting-course-lp?utm_source=podcast-pitch-generator&utm_medium=email-verification&utm_campaign=7-day-course-signup&utm_content=results-page"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={trackCourseSignupClick}
                    className="inline-block px-8 py-4 bg-white text-dealflow-midnight font-body font-bold rounded-xl hover:bg-dealflow-cream transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Start Free Course →
                  </a>
                </div>

                {/* Download All Pitches */}
                <div className="bg-white rounded-2xl shadow-lg border border-dealflow-light-grey/30 p-6 sm:p-8">
                  <button
                    onClick={downloadAllPitches}
                    className="w-full px-6 py-4 bg-gradient-to-r from-dealflow-light-grey/20 to-dealflow-light-grey/10 text-dealflow-midnight font-body font-semibold rounded-xl hover:from-dealflow-sky/10 hover:to-dealflow-orange/10 border-2 border-dealflow-light-grey/30 hover:border-dealflow-sky/50 transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download All Pitches
                  </button>
                </div>
              </>
            )}
            
            {/* Secondary CTA - Get Help */}
            <div className="p-6 sm:p-8 bg-gradient-to-br from-dealflow-cream to-white rounded-2xl border-2 border-dealflow-sky/20 shadow-lg animate-bounce-subtle">
              <h3 className="font-heading font-bold text-dealflow-midnight mb-3 text-xl sm:text-2xl">
                Writing pitches is the easy part.
              </h3>
              <p className="text-dealflow-midnight/80 mb-4 leading-relaxed font-body text-base sm:text-lg font-medium">
                Most founders send 10 pitches and give up. We send 50+ for you, handle responses, prep you, and get you booked.
              </p>
              <p className="text-dealflow-midnight mb-5 font-body font-semibold text-lg">
                Want us to do it for you? Book a free 15-minute no-obligation consult.
              </p>
              <a
                href="https://app.usemotion.com/meet/kobi-omenaka/Podcast-guest-outreach-generator"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-gradient-to-r from-dealflow-orange to-dealflow-orange/90 text-white font-body font-bold rounded-xl hover:from-dealflow-orange/90 hover:to-dealflow-orange transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 animate-pulsate"
              >
                Book Free Consult →
              </a>
            </div>
          </div>

          {/* Generate Another */}
          <button
            onClick={onGenerateAnother}
            className="w-full mt-6 py-4 px-6 text-dealflow-light-grey hover:text-dealflow-sky transition-all duration-200 rounded-xl hover:bg-dealflow-sky/5 font-body font-semibold border-2 border-transparent hover:border-dealflow-sky/30"
          >
            Generate another pitch for a different podcast →
          </button>
        </div>
      ) : (
        <div className="transition-opacity duration-300">
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
                <div key={idx} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <span className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide">Follow-up {idx + 1} · {followup.timing}</span>
                        <p className="font-semibold text-dealflow-midnight text-lg sm:text-xl mt-1">{followup.subject}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const timestamp = new Date().toISOString().split('T')[0];
                            downloadPitch(followup, `followup-${idx + 1}-${followup.timing.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.txt`);
                          }}
                          className="px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-white text-dealflow-midnight border border-gray-300 hover:bg-gray-50 hover:border-dealflow-teal flex items-center gap-2 text-sm"
                          title="Download follow-up"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span className="hidden sm:inline">Download</span>
                        </button>
                        <button
                          onClick={() => copyToClipboard(`${followup.subject}\n\n${followup.body}`, `followup-${idx + 1}`)}
                          className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm flex items-center gap-2 ${
                            copied === `followup-${idx + 1}`
                              ? 'bg-green-500 text-white shadow-md'
                              : 'bg-dealflow-teal text-white hover:bg-dealflow-midnight'
                          }`}
                        >
                          {copied === `followup-${idx + 1}` ? (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="hidden sm:inline">Copied!</span>
                              <span className="sm:hidden">✓</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <span className="hidden sm:inline">Copy</span>
                              <span className="sm:hidden">Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="prose prose-sm sm:prose-base max-w-none">
                      <div className="text-gray-700 leading-relaxed">
                        {formatPitchBody(followup.body)}
                      </div>
                    </div>
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
