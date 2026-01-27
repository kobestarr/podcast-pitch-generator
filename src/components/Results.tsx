'use client';

import { useState } from 'react';

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

export function Results({ pitches, formData, emailSubmitted, onEmailSubmit, onGenerateAnother }: Props) {
  const [activeTab, setActiveTab] = useState<'pitches' | 'followups'>('pitches');
  const [activePitch, setActivePitch] = useState<1 | 2 | 3>(1);
  const [copied, setCopied] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailError(null);

    try {
      // TODO: Call GHL API to add contact
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      onEmailSubmit();
    } catch (err) {
      setEmailError('Something went wrong. Please try again.');
    } finally {
      setEmailLoading(false);
    }
  };

  const currentPitch = activePitch === 1 ? pitches.pitch_1 : activePitch === 2 ? pitches.pitch_2 : pitches.pitch_3;

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
          {/* Pitch Selector */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map(num => (
              <button
                key={num}
                onClick={() => setActivePitch(num as 1 | 2 | 3)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  activePitch === num
                    ? 'bg-dealflow-midnight text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {num === 1 && 'Direct & Professional'}
                {num === 2 && 'Social Proof'}
                {num === 3 && 'Casual & Mobile'}
              </button>
            ))}
          </div>

          {/* Pitch Display */}
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
          {/* Email Gate for Follow-ups */}
          {!emailSubmitted ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-dealflow-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-dealflow-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-dealflow-midnight mb-2">
                Unlock Your Follow-up Templates
              </h3>
              <p className="text-gray-600 mb-6">
                Enter your email to get all 3 follow-up templates + bonus PDF cheat sheet.
              </p>
              
              <form onSubmit={submitEmail} className="max-w-md mx-auto">
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
                    {emailLoading ? 'Sending...' : 'Unlock'}
                  </button>
                </div>
                {emailError && (
                  <p className="text-red-500 text-sm mt-2">{emailError}</p>
                )}
                <p className="text-xs text-gray-500 mt-3">
                  We'll also add you to our Content Catalyst newsletter. Unsubscribe anytime.
                </p>
              </form>
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
