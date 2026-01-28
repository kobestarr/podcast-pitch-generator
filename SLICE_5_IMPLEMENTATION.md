# Slice 5: GHL Integration + Resend Email Verification

## Overview
This slice implements email verification via Resend and syncs verified contacts to Go High Level (GHL) with all form data.

## Architecture Flow

```
User enters email → Resend sends verification code → User verifies code → GHL contact created
```

## Implementation Details

### 1. Resend Integration for Email Verification

**Purpose:** Send verification codes via email using Resend (better deliverability than GHL for transactional emails)

**Setup:**
- Add `RESEND_API_KEY` to `.env.local`
- Install Resend SDK: `npm install resend`

**Implementation:**
- Create email sending function in `src/app/api/verify-email/route.ts`
- Send professional verification code email
- Remove dev-only code return (currently returns code in response for testing)

**Email Template:**
- Subject: "Your Podcast Pitch Generator Verification Code"
- Body: Include 6-digit code, expiry time (10 minutes), clear instructions

### 2. GHL Contact Creation

**Purpose:** Sync verified contacts to GHL CRM with all form data

**Setup:**
- Requires `GHL_API_KEY` and `GHL_LOCATION_ID` (already in `.env.example`)
- GHL API endpoint: `POST https://services.leadconnectorhq.com/contacts/`
- Authentication: Bearer token in Authorization header

**Implementation Files:**

#### `src/lib/ghl.ts` (NEW FILE)
```typescript
// GHL API integration utility
// Function: createGHLContact(email, formData)
// Maps form fields to GHL contact structure
// Handles errors gracefully (log but don't block verification)
```

**GHL Contact Structure:**

**Required Fields:**
- `email`: Verified email address
- `firstName`: From formData.firstName
- `lastName`: From formData.lastName

**Custom Fields (map all form data):**
- `title`: Array of roles (e.g., ["Founder", "CEO"])
- `expertise`: formData.expertise
- `credibility`: formData.credibility
- `podcastName`: formData.podcastName
- `hostName`: formData.hostName
- `guestName`: formData.guestName
- `episodeTopic`: formData.episodeTopic
- `whyPodcast`: formData.whyPodcast
- `socialPlatform`: formData.socialPlatform
- `followers`: formData.followers
- `topic1`, `topic2`, `topic3`: formData.topic1, topic2, topic3
- `uniqueAngle`: formData.uniqueAngle
- `audienceBenefit`: formData.audienceBenefit

**Note:** GHL custom fields may need to be created in GHL dashboard first, or use tags/metadata fields.

### 3. Updated Files

#### `src/app/api/verify-email/route.ts`
**Changes:**
- Add `formData` parameter to verification request body
- After successful code verification (line 98), call `createGHLContact()`
- Don't fail verification if GHL sync fails (log error, return success)
- Integrate Resend for sending verification codes
- Remove dev-only code return

**Request Body Structure:**
```typescript
{
  email: string;
  action: 'request' | 'verify';
  code?: string; // for verify action
  formData?: FormData; // for verify action - all form fields
}
```

#### `src/components/Results.tsx`
**Changes:**
- Modify `verifyCode` function to include `formData` in request body
- Send complete form data when verifying code (line 108)
- Keep existing verification flow unchanged

**Updated verifyCode function:**
```typescript
body: JSON.stringify({ 
  email, 
  code: verificationCode, 
  action: 'verify',
  formData: formData // Add this
})
```

### 4. Environment Variables

**Add to `.env.local`:**
```bash
# Resend API (for verification emails)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# GHL API (already exists, ensure values are set)
GHL_API_KEY=your_ghl_api_key_here
GHL_LOCATION_ID=your_location_id_here
```

**Update `.env.example`:**
- Add `RESEND_API_KEY` entry

### 5. Error Handling Strategy

**Critical Principle:** GHL sync failures should NOT block email verification

**Implementation:**
- Wrap GHL call in try-catch
- Log errors for debugging
- Return verification success even if GHL fails
- Consider async/background processing for GHL (optional enhancement)

**Example:**
```typescript
// After successful code verification
try {
  await createGHLContact(email, formData);
} catch (error) {
  console.error('GHL sync failed:', error);
  // Continue - don't block verification
}

return NextResponse.json({
  success: true,
  verified: true,
  message: 'Email verified successfully',
});
```

### 6. GHL API Details

**Endpoint:** `POST https://services.leadconnectorhq.com/contacts/`

**Headers:**
```
Authorization: Bearer {GHL_API_KEY}
Content-Type: application/json
```

**Request Body Example:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "customField": {
    "title": ["Founder", "CEO"],
    "expertise": "...",
    "podcastName": "...",
    // ... all other fields
  }
}
```

**Response Codes:**
- 201: Contact created successfully
- 400: Bad Request
- 401: Unauthorized (invalid API key)
- 422: Unprocessable Entity

### 7. Testing Checklist

- [ ] Resend sends verification emails successfully
- [ ] Verification code works correctly
- [ ] GHL contact created with all form data
- [ ] GHL failure doesn't block verification
- [ ] All form fields appear correctly in GHL
- [ ] Error logging works for debugging
- [ ] Email template looks professional

### 8. Dependencies

**New npm packages:**
```bash
npm install resend
```

**Existing:**
- No additional packages needed for GHL (use fetch/axios)

### 9. Documentation Updates

**Files to update:**
- `README.md` - Add Resend + GHL setup instructions
- `SETUP_API_KEYS.md` - Add Resend API key setup
- Update Slice 5 description in roadmap docs

### 10. Future Enhancements (Optional)

- Retry logic for failed GHL syncs
- Background job queue for GHL sync (don't wait for API response)
- GHL webhook integration for contact updates
- Tag contacts in GHL based on form responses
- Add to GHL campaigns/sequences automatically

## Implementation Order

1. Install Resend SDK
2. Create `src/lib/ghl.ts` utility
3. Update `src/app/api/verify-email/route.ts`:
   - Add Resend email sending
   - Add GHL contact creation after verification
4. Update `src/components/Results.tsx` to send formData
5. Update environment variables and documentation
6. Test end-to-end flow

## Notes

- Keep verification flow simple and fast
- GHL sync can be slow - don't block user experience
- Consider making GHL sync async/background in future
- All form data should be preserved in GHL for future marketing/segmentation
