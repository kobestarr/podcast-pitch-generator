# Vercel Deployment Guide

## Overview

This guide will help you deploy the Podcast Pitch Generator to Vercel. Vercel is perfect for Next.js applications and provides:
- Automatic deployments from Git
- Environment variable management
- Serverless API routes
- Global CDN
- Free SSL certificates

---

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com (free tier is fine)
2. **GitHub Repository**: Your code should be pushed to GitHub (already done ✅)
3. **API Keys Ready**: Have all your API keys ready to add as environment variables

---

## Step-by-Step Deployment

### Step 1: Connect Your Repository

1. Go to https://vercel.com and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `kobestarr/podcast-pitch-generator`
4. Click **"Import"**

### Step 2: Configure Project Settings

Vercel should auto-detect Next.js. Verify these settings:

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

Click **"Deploy"** (we'll add environment variables next)

### Step 3: Add Environment Variables

**IMPORTANT**: Add these **before** the first deployment completes, or add them and redeploy.

Go to **Project Settings** → **Environment Variables** and add:

#### Required API Keys:

```
ANTHROPIC_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
GHL_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GHL_LOCATION_ID=HZxQ2NMMNDVGkqrpOeXru
```

#### Public Environment Variables (for client-side):

```
NEXT_PUBLIC_META_PIXEL_ID=425162551517396
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=...
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-NQLMF2W0KJ
```

**Settings for each variable:**
- ✅ **Production** (check this)
- ✅ **Preview** (check this - for PR previews)
- ✅ **Development** (optional - if you want to test locally)

### Step 4: Deploy

1. After adding environment variables, go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment (or wait for auto-deploy)
3. Wait for build to complete (~2-3 minutes)

### Step 5: Verify Deployment

1. Visit your deployment URL (e.g., `podcast-pitch-generator.vercel.app`)
2. Test the full flow:
   - Fill out the form
   - Generate pitches
   - Verify email
   - Check analytics tracking

---

## Environment Variables Reference

### Server-Side Only (Private):

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | https://console.anthropic.com |
| `OPENAI_API_KEY` | OpenAI GPT-4 API key | https://platform.openai.com/api-keys |
| `RESEND_API_KEY` | Resend email service API key | https://resend.com/api-keys |
| `GHL_API_KEY` | Go High Level JWT token | GHL → Settings → Integrations → Private Integration Token |
| `GHL_LOCATION_ID` | GHL Location ID | Part of JWT token or GHL settings |

### Client-Side (Public):

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID | Facebook Events Manager |
| `NEXT_PUBLIC_LINKEDIN_PARTNER_ID` | LinkedIn Partner ID | LinkedIn Campaign Manager |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics ID | Google Analytics |

---

## Post-Deployment Checklist

- [ ] Test form submission
- [ ] Test pitch generation
- [ ] Test email verification flow
- [ ] Verify Resend emails are sending
- [ ] Check GHL contact creation
- [ ] Test analytics tracking (Meta Pixel, LinkedIn, GA)
- [ ] Test on mobile devices
- [ ] Check console for errors
- [ ] Verify all API routes work

---

## Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Add your custom domain (e.g., `pitches.yourdomain.com`)
3. Follow DNS instructions (add CNAME record)
4. Vercel will auto-configure SSL

---

## Monitoring & Logs

### View Logs:
- **Deployments** → Click on deployment → **Logs** tab
- **Functions** → View serverless function logs

### Monitor:
- **Analytics** → View page views, performance
- **Speed Insights** → Core Web Vitals

---

## Troubleshooting

### Build Fails:
- Check **Deployments** → **Logs** for errors
- Verify all environment variables are set
- Check `package.json` dependencies

### API Routes Not Working:
- Verify server-side env vars are set (not just `NEXT_PUBLIC_*`)
- Check function logs in Vercel dashboard
- Ensure API routes are in `src/app/api/` directory

### Environment Variables Not Working:
- Make sure you **redeployed** after adding env vars
- Check variable names match exactly (case-sensitive)
- Verify they're enabled for **Production** environment

### Email Verification Issues:
- Check Resend API key is correct
- Verify Resend domain is verified
- Check function logs for email send errors

---

## Next Steps After Deployment

1. **Set up monitoring**: Enable Vercel Analytics
2. **Configure alerts**: Set up error notifications
3. **Test thoroughly**: Run through all user flows
4. **Share URL**: Get feedback from test users
5. **Monitor performance**: Check Core Web Vitals

---

## Useful Vercel Features

- **Preview Deployments**: Every PR gets a preview URL
- **Rollback**: Instantly rollback to previous deployment
- **Edge Functions**: For low-latency API routes
- **Image Optimization**: Automatic Next.js Image optimization
- **Analytics**: Built-in web analytics

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Vercel Status**: https://vercel-status.com

---

*Last updated: January 29, 2026*
