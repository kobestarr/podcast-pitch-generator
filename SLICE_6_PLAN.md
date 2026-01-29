# Slice 6: Retargeting + Analytics

## Overview

Slice 6 adds tracking and analytics to measure user behavior, track conversions, and enable retargeting campaigns. This includes Meta Pixel (Facebook) and LinkedIn Insight Tag integration for conversion tracking and audience building.

---

## What Will Happen in Slice 6

### 1. **Meta Pixel (Facebook) Integration**
- Track page views
- Track form submissions
- Track email verifications (conversion events)
- Track pitch generation (conversion events)
- Build custom audiences for retargeting

### 2. **LinkedIn Insight Tag Integration**
- Track page views
- Track conversions (email verification, pitch generation)
- Build retargeting audiences
- Measure campaign performance

### 3. **Event Tracking**
- Form step completions
- Pitch generation events
- Email verification events
- Download events (pitches, follow-ups)
- Copy events (pitches copied)

### 4. **Conversion Tracking**
- Primary conversion: Email verification
- Secondary conversion: Pitch generation
- Tertiary conversion: Pitch downloads

---

## Implementation Details

### Files to Create/Modify

1. **`src/app/layout.tsx`** (or existing layout)
   - Add Meta Pixel script
   - Add LinkedIn Insight Tag script
   - Initialize tracking on page load

2. **`src/lib/analytics.ts`** (NEW)
   - Meta Pixel event tracking functions
   - LinkedIn Insight Tag event tracking functions
   - Helper functions for common events

3. **`src/components/Results.tsx`**
   - Track pitch generation
   - Track email verification
   - Track downloads
   - Track copy events

4. **`src/app/page.tsx`**
   - Track form step completions
   - Track form submissions

5. **`.env.local` & `.env.example`**
   - Add `NEXT_PUBLIC_META_PIXEL_ID`
   - Add `NEXT_PUBLIC_LINKEDIN_PARTNER_ID`

---

## What I'll Need From You

### 1. **Meta Pixel ID (Facebook)**

**Where to Find It:**
1. Go to: https://business.facebook.com/events_manager2
2. Select your Facebook Business account
3. Go to **Data Sources** → **Pixels**
4. Click on your pixel (or create one if you don't have one)
5. Copy the **Pixel ID** (looks like: `123456789012345`)

**Format:** Just numbers (15-16 digits)  
**Example:** `123456789012345`

**What to Provide:** Just paste the Pixel ID number

---

### 2. **LinkedIn Insight Tag Partner ID**

**Where to Find It:**
1. Go to: https://www.linkedin.com/campaignmanager/
2. Click **Account Assets** → **Insight Tag**
3. If you don't have one, click **Create Insight Tag**
4. Copy the **Partner ID** (looks like: `1234567`)

**Format:** Just numbers (usually 7 digits)  
**Example:** `1234567`

**What to Provide:** Just paste the Partner ID number

---

### 3. **Optional: Google Analytics**

**If you want Google Analytics tracking:**
- Go to: https://analytics.google.com/
- Create a property (if you don't have one)
- Get your **Measurement ID** (looks like: `G-XXXXXXXXXX`)
- Provide: `G-XXXXXXXXXX`

**Note:** This is optional - we can add it if you want

---

## Event Tracking Plan

### Events We'll Track

1. **Page View** (automatic)
   - When user lands on the page

2. **Form Started**
   - When user begins filling out the form

3. **Form Step Completed**
   - Step 1: About You
   - Step 2: About Podcast
   - Step 3: Audience
   - Step 4: Your Value

4. **Pitch Generated** (Conversion)
   - When pitches are successfully generated
   - Value: Pitch strength score

5. **Email Verification Started**
   - When user requests verification code

6. **Email Verified** (Primary Conversion)
   - When user successfully verifies email
   - Value: 1.0 (conversion)

7. **Pitch Downloaded**
   - When user downloads a pitch
   - Value: Pitch number (1, 2, or 3)

8. **Pitch Copied**
   - When user copies a pitch to clipboard
   - Value: Pitch number

---

## Implementation Steps

1. **Get Pixel IDs from you**
2. **Add environment variables**
3. **Create analytics utility file**
4. **Add tracking scripts to layout**
5. **Add event tracking throughout app**
6. **Test tracking in browser dev tools**
7. **Verify events appear in Meta/LinkedIn dashboards**

---

## Testing

### How We'll Test

1. **Browser Dev Tools**
   - Check Network tab for pixel requests
   - Verify events are firing

2. **Meta Events Manager**
   - Check if events appear in real-time
   - Verify conversion tracking works

3. **LinkedIn Campaign Manager**
   - Check if events appear
   - Verify conversion tracking

4. **Test Flow**
   - Complete form → check events
   - Generate pitches → check conversion
   - Verify email → check conversion
   - Download pitch → check event

---

## Privacy Considerations

- ✅ No PII (Personally Identifiable Information) sent to pixels
- ✅ Only events and conversion values
- ✅ Compliant with GDPR/CCPA (no personal data in tracking)
- ✅ User consent handled by platform (Meta/LinkedIn)

---

## Timeline Estimate

- **Setup:** 30 minutes (once I have Pixel IDs)
- **Implementation:** 2-3 hours
- **Testing:** 1 hour
- **Total:** ~4 hours

---

## Ready to Start?

**Please provide:**

1. **Meta Pixel ID:** `_________________`
   - From: https://business.facebook.com/events_manager2
   - Format: 15-16 digit number

2. **LinkedIn Partner ID:** `_________________`
   - From: https://www.linkedin.com/campaignmanager/
   - Format: 7 digit number

3. **Optional - Google Analytics ID:** `_________________`
   - From: https://analytics.google.com/
   - Format: `G-XXXXXXXXXX`

Once you provide these, I'll implement Slice 6!

---

*Plan created: January 28, 2026*
