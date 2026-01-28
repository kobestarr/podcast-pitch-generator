# Setting Up API Keys

## Quick Setup

To generate pitches, you need to set up your Anthropic API key.

### Step 1: Create `.env.local` file

In the project root directory, create a file named `.env.local`:

```bash
cd /Users/kobestarr/Downloads/podcast-pitch-generator
touch .env.local
```

### Step 2: Add your API key

Open `.env.local` and add:

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key_here
AI_PROVIDER=anthropic
```

### Step 3: Get your Anthropic API key

1. Go to https://console.anthropic.com/
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it into `.env.local`

### Step 4: Restart the dev server

After adding the API key, restart your Next.js dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Full Environment Variables

For reference, here's the complete `.env.local` template:

```bash
# AI Provider (Anthropic Claude) - REQUIRED for pitch generation
ANTHROPIC_API_KEY=your_claude_api_key_here

# AI Provider Selection
AI_PROVIDER=anthropic

# Optional: OpenAI (fallback)
OPENAI_API_KEY=your_openai_api_key_here

# GHL (Go High Level) API - Required for Slice 5
GHL_API_KEY=your_ghl_api_key_here
GHL_LOCATION_ID=your_location_id_here

# Analytics (Optional)
NEXT_PUBLIC_META_PIXEL_ID=your_pixel_id
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=your_linkedin_id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Troubleshooting

### Error: "AI service not configured"

**Cause:** Missing `ANTHROPIC_API_KEY` in `.env.local`

**Solution:**
1. Check that `.env.local` exists in the project root
2. Verify the file contains `ANTHROPIC_API_KEY=sk-ant-...`
3. Restart the dev server after adding the key
4. Make sure there are no spaces around the `=` sign

### Error: "Invalid API key"

**Cause:** The API key is incorrect or expired

**Solution:**
1. Verify the key in Anthropic console
2. Generate a new key if needed
3. Update `.env.local` and restart server

### Still not working?

1. Check the server console for error messages
2. Verify `.env.local` is in `.gitignore` (it should be)
3. Make sure you're using `.env.local` not `.env`
4. Restart the dev server completely

---

*Note: `.env.local` is gitignored and won't be committed to the repository.*
