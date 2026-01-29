/**
 * Analytics Tracking Utility
 * Centralized tracking for Meta Pixel, LinkedIn Insight Tag, and Google Analytics
 */

// Type definitions
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    lintrk?: (action: string, params?: any) => void;
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Check if Meta Pixel is loaded
 */
function isMetaPixelLoaded(): boolean {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
}

/**
 * Check if LinkedIn Insight Tag is loaded
 */
function isLinkedInLoaded(): boolean {
  return typeof window !== 'undefined' && typeof window.lintrk === 'function';
}

/**
 * Check if Google Analytics is loaded
 */
function isGALoaded(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

/**
 * Track page view (automatic, but can be called manually)
 */
export function trackPageView() {
  try {
    if (isMetaPixelLoaded()) {
      window.fbq!('track', 'PageView');
    }
    if (isLinkedInLoaded()) {
      window.lintrk!('track', { conversion_id: 'page_view' });
    }
    if (isGALoaded()) {
      window.gtag!('event', 'page_view', {
        event_category: 'Podcast Pitch Generator',
      });
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

/**
 * Track when user starts the form
 */
export function trackFormStarted() {
  try {
    if (isMetaPixelLoaded()) {
      window.fbq!('trackCustom', 'FormStarted');
    }
    if (isLinkedInLoaded()) {
      window.lintrk!('track', { conversion_id: 'form_started' });
    }
    if (isGALoaded()) {
      window.gtag!('event', 'form_started', {
        event_category: 'Podcast Pitch Generator',
        event_label: 'Form Started',
      });
    }
  } catch (error) {
    console.error('Error tracking form started:', error);
  }
}

/**
 * Track when a form step is completed
 */
export function trackFormStepCompleted(step: string) {
  try {
    const stepNames: Record<string, string> = {
      'about-you': 'About You',
      'about-podcast': 'About Podcast',
      'audience': 'Audience',
      'your-value': 'Your Value',
    };
    const stepLabel = stepNames[step] || step;

    if (isMetaPixelLoaded()) {
      window.fbq!('trackCustom', 'FormStepCompleted', { step: stepLabel });
    }
    if (isLinkedInLoaded()) {
      window.lintrk!('track', { 
        conversion_id: 'form_step_completed',
        step: stepLabel,
      });
    }
    if (isGALoaded()) {
      window.gtag!('event', 'form_step_completed', {
        event_category: 'Podcast Pitch Generator',
        event_label: stepLabel,
      });
    }
  } catch (error) {
    console.error('Error tracking form step:', error);
  }
}

/**
 * Track when pitches are generated (secondary conversion)
 */
export function trackPitchGenerated(score: number) {
  try {
    if (isMetaPixelLoaded()) {
      window.fbq!('track', 'ViewContent', {
        content_name: 'Pitch Generated',
        content_category: 'Podcast Pitch',
        value: score,
        currency: 'USD',
      });
      window.fbq!('trackCustom', 'PitchGenerated', { score });
    }
    if (isLinkedInLoaded()) {
      window.lintrk!('track', { 
        conversion_id: 'pitch_generated',
        value: score,
      });
    }
    if (isGALoaded()) {
      window.gtag!('event', 'pitch_generated', {
        event_category: 'Podcast Pitch Generator',
        event_label: 'Pitch Generated',
        value: score,
      });
    }
  } catch (error) {
    console.error('Error tracking pitch generated:', error);
  }
}

/**
 * Track when user requests email verification code
 */
export function trackEmailVerificationStarted() {
  try {
    if (isMetaPixelLoaded()) {
      window.fbq!('trackCustom', 'EmailVerificationStarted');
    }
    if (isLinkedInLoaded()) {
      window.lintrk!('track', { conversion_id: 'email_verification_started' });
    }
    if (isGALoaded()) {
      window.gtag!('event', 'email_verification_started', {
        event_category: 'Podcast Pitch Generator',
        event_label: 'Email Verification Started',
      });
    }
  } catch (error) {
    console.error('Error tracking email verification started:', error);
  }
}

/**
 * Track when email is verified (primary conversion)
 */
export function trackEmailVerified() {
  try {
    if (isMetaPixelLoaded()) {
      window.fbq!('track', 'Lead');
      window.fbq!('track', 'CompleteRegistration');
      window.fbq!('trackCustom', 'EmailVerified');
    }
    if (isLinkedInLoaded()) {
      window.lintrk!('track', { 
        conversion_id: 'email_verified',
        value: 1.0,
      });
    }
    if (isGALoaded()) {
      window.gtag!('event', 'email_verified', {
        event_category: 'Podcast Pitch Generator',
        event_label: 'Email Verified',
        value: 1.0,
      });
      window.gtag!('event', 'conversion', {
        send_to: 'AW-EMAIL_VERIFIED', // Update with your conversion ID if needed
      });
    }
  } catch (error) {
    console.error('Error tracking email verified:', error);
  }
}

/**
 * Track when a pitch is downloaded
 */
export function trackPitchDownloaded(pitchNumber: number) {
  try {
    const pitchLabel = pitchNumber === 0 ? 'All Pitches' : `Pitch ${pitchNumber}`;

    if (isMetaPixelLoaded()) {
      window.fbq!('trackCustom', 'PitchDownloaded', { 
        pitch_number: pitchNumber,
        pitch_label: pitchLabel,
      });
    }
    if (isLinkedInLoaded()) {
      window.lintrk!('track', { 
        conversion_id: 'pitch_downloaded',
        pitch_number: pitchNumber,
      });
    }
    if (isGALoaded()) {
      window.gtag!('event', 'pitch_downloaded', {
        event_category: 'Podcast Pitch Generator',
        event_label: pitchLabel,
        value: pitchNumber,
      });
    }
  } catch (error) {
    console.error('Error tracking pitch downloaded:', error);
  }
}

/**
 * Track when a pitch is copied to clipboard
 */
export function trackPitchCopied(pitchNumber: number) {
  try {
    const pitchLabel = pitchNumber === 0 ? 'All Pitches' : `Pitch ${pitchNumber}`;

    if (isMetaPixelLoaded()) {
      window.fbq!('trackCustom', 'PitchCopied', { 
        pitch_number: pitchNumber,
        pitch_label: pitchLabel,
      });
    }
    if (isLinkedInLoaded()) {
      window.lintrk!('track', { 
        conversion_id: 'pitch_copied',
        pitch_number: pitchNumber,
      });
    }
    if (isGALoaded()) {
      window.gtag!('event', 'pitch_copied', {
        event_category: 'Podcast Pitch Generator',
        event_label: pitchLabel,
        value: pitchNumber,
      });
    }
  } catch (error) {
    console.error('Error tracking pitch copied:', error);
  }
}

/**
 * Track when user clicks course signup button
 */
export function trackCourseSignupClick() {
  try {
    if (isMetaPixelLoaded()) {
      window.fbq!('trackCustom', 'CourseSignupClick');
      window.fbq!('track', 'Lead', {
        content_name: '7-Day Podcast Guesting Course',
        content_category: 'Course Signup',
      });
    }
    if (isLinkedInLoaded()) {
      window.lintrk!('track', { 
        conversion_id: 'course_signup_click',
      });
    }
    if (isGALoaded()) {
      window.gtag!('event', 'course_signup_click', {
        event_category: 'Podcast Pitch Generator',
        event_label: '7-Day Course Signup',
      });
    }
  } catch (error) {
    console.error('Error tracking course signup click:', error);
  }
}
