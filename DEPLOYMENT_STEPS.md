# Complete Deployment Steps - In Order

## The Process (Step by Step)

### ✅ Step 1: Deploy to Vercel (Do This First)

1. Import project to Vercel
2. Review settings (leave everything as default)
3. Click **"Deploy"**
4. Wait for build to complete (~2-3 minutes)
5. You'll get a URL like: `podcast-pitch-generator-xxxxx.vercel.app`

**Status:** ✅ App is live on Vercel's domain

---

### ✅ Step 2: Add Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Add all 7 variables (from `COPY_PASTE_GUIDE.md`)
3. Go to **Deployments** → **Redeploy**
4. Wait for redeploy to complete

**Status:** ✅ App works with all API keys

---

### ✅ Step 3: Add Subdomain in Vercel (Do This Next)

1. In Vercel, go to **Settings** → **Domains**
2. Click **"Add Domain"**
3. Type: `pitches.dealflow.media` (or whatever subdomain you want)
4. Click **"Add"**

**What happens:** Vercel will show you DNS instructions:
```
Type: CNAME
Name: pitches
Value: cname.vercel-dns.com
```

**Status:** ⏳ Waiting for DNS configuration

---

### ✅ Step 4: Configure DNS in Hostinger

1. Log in to **Hostinger** (https://hpanel.hostinger.com)
2. Go to **Domains** → **dealflow.media** → **DNS Zone Editor**
3. Add **CNAME** record:
   - **Name:** `pitches`
   - **Points to:** `cname.vercel-dns.com`
   - **TTL:** `3600`
4. Click **Save**

**Status:** ⏳ DNS propagating (5-30 minutes)

---

### ✅ Step 5: Wait & Verify

1. Wait 5-30 minutes for DNS to propagate
2. Check status in Vercel dashboard (will show "Valid Configuration" when ready)
3. Visit `https://pitches.dealflow.media`
4. SSL certificate is automatic!

**Status:** ✅ Live on your domain!

---

## Quick Reference: Order of Operations

```
1. Deploy to Vercel
   ↓
2. Add Environment Variables
   ↓
3. Add Domain in Vercel (pitches.dealflow.media)
   ↓
4. Configure DNS in Hostinger (CNAME record)
   ↓
5. Wait for DNS propagation
   ↓
6. Done! Visit pitches.dealflow.media
```

---

## Important Notes

### Why This Order?

- **Deploy first:** Need a working app before adding domain
- **Add env vars:** App needs API keys to function
- **Add domain in Vercel:** Tells Vercel you want to use this domain
- **Configure DNS:** Tells the internet where to find your app
- **Wait:** DNS takes time to propagate worldwide

### Can I Do Steps 2-4 in Any Order?

- **Step 2 (env vars)** can be done anytime (but do it before testing)
- **Step 3 (add domain)** must be done before Step 4
- **Step 4 (DNS)** must be done after Step 3

**Recommended:** Do them in order for easiest troubleshooting.

---

## What Happens If You Skip Steps?

### Skip Step 2 (Environment Variables)?
- ❌ App deploys but won't work (no API keys)
- ✅ Fix: Add env vars and redeploy

### Skip Step 3 (Add Domain in Vercel)?
- ❌ DNS won't work (Vercel doesn't know about your domain)
- ✅ Fix: Add domain first, then configure DNS

### Skip Step 4 (DNS Configuration)?
- ❌ Domain won't resolve (internet doesn't know where to go)
- ✅ Fix: Add CNAME record in Hostinger

---

## After Everything Is Set Up

Once `pitches.dealflow.media` is working:

1. ✅ Test the full flow (form → pitches → email verification)
2. ✅ Check SSL certificate (should be automatic)
3. ✅ Test on mobile devices
4. ✅ Share with your team!

---

## Troubleshooting by Step

### Step 1 Failed (Deploy)?
- Check GitHub repo is connected
- Verify Next.js is detected
- Check build logs for errors

### Step 2 Failed (Environment Variables)?
- Verify all 7 variables are added
- Check spelling (case-sensitive)
- Redeploy after adding variables

### Step 3 Failed (Add Domain)?
- Domain might already be in use
- Check Vercel dashboard for errors
- Try a different subdomain name

### Step 4 Failed (DNS)?
- Verify CNAME record is correct
- Check Hostinger DNS settings are accessible
- Wait longer (can take up to 48 hours, usually 5-30 min)

### Step 5 Failed (Not Working)?
- Check DNS propagation: https://dnschecker.org
- Verify CNAME points to `cname.vercel-dns.com`
- Check Vercel dashboard shows "Valid Configuration"
- Clear browser cache

---

## Summary

**Yes, after deploying and adding environment variables, you move to setting up the subdomain!**

The order is:
1. Deploy ✅
2. Add env vars ✅
3. Add domain in Vercel ✅
4. Configure DNS in Hostinger ✅
5. Wait & verify ✅

---

*Last updated: January 29, 2026*
