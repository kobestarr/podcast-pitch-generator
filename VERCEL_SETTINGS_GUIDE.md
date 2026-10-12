# Vercel Project Settings Guide

## Overview

When you import your project to Vercel, it shows configuration settings. **Good news:** Vercel auto-detects Next.js and sets these correctly! You usually don't need to change anything.

---

## Framework Preset

**What it is:** Tells Vercel what framework you're using

**What you see:** `Next.js` ✅ (with Next.js logo)

**What to do:** ✅ **Leave it as-is** - Vercel detected it correctly!

**Why:** Your project uses Next.js, and Vercel automatically detected it from your `package.json` file.

---

## Root Directory

**What it is:** Where your project files are located in the repository

**What you see:** `./` ✅ (this means "root of the repository")

**What to do:** ✅ **Leave it as-is** - This is correct!

**Why:** Your project files are at the root of your GitHub repo, so `./` is perfect.

**Only change if:** Your Next.js app is in a subfolder (like `apps/podcast-pitch-generator/`), then you'd set it to that folder path.

---

## Build and Output Settings

### Build Command

**What it is:** Command Vercel runs to build your app

**What you see:** 
- Suggested: `npm run build` or `next build`
- Toggle: **OFF** (greyed out)

**What to do:** ✅ **Leave toggle OFF** - Use the default!

**Why:** Your `package.json` already has `"build": "next build"`, so Vercel will use that automatically.

**Only turn ON if:** You need a custom build command (you don't).

---

### Output Directory

**What it is:** Where the built files go after building

**What you see:**
- Value: `Next.js default` (which is `.next`)
- Toggle: **OFF** (greyed out)

**What to do:** ✅ **Leave toggle OFF** - Use the default!

**Why:** Next.js automatically outputs to `.next` folder, and Vercel knows this.

**Only turn ON if:** You have a custom output directory (you don't).

---

### Install Command

**What it is:** Command to install dependencies

**What you see:**
- Suggested: `yarn install`, `pnpm install`, `npm install`, or `bun install`
- Toggle: **OFF** (greyed out)

**What to do:** ✅ **Leave toggle OFF** - Use the default!

**Why:** Vercel will detect you're using `npm` (from your `package-lock.json`) and run `npm install` automatically.

**Only turn ON if:** You want to force a specific package manager (usually not needed).

---

## Summary: What to Do

### ✅ DO THIS:

1. **Framework Preset:** Leave as `Next.js` ✅
2. **Root Directory:** Leave as `./` ✅
3. **Build Command:** Leave toggle OFF ✅
4. **Output Directory:** Leave toggle OFF ✅
5. **Install Command:** Leave toggle OFF ✅

**Then click "Deploy"** and move on to adding environment variables!

---

## Visual Guide: Your Settings Should Look Like

```
┌─────────────────────────────────────────┐
│ Framework Preset                       │
│ Next.js [N]                    [▼]     │ ← Leave as-is
├─────────────────────────────────────────┤
│ Root Directory                          │
│ ./                            [Edit]   │ ← Leave as-is
├─────────────────────────────────────────┤
│ Build and Output Settings        [▼]   │
│                                         │
│ Build Command                           │
│ Suggested: npm run build or next build │
│ [Toggle OFF] ← Leave OFF                │
│                                         │
│ Output Directory                        │
│ Next.js default                         │
│ [Toggle OFF] ← Leave OFF                │
│                                         │
│ Install Command                         │
│ Suggested: npm install, yarn install... │
│ [Toggle OFF] ← Leave OFF                │
└─────────────────────────────────────────┘
```

---

## When Would You Change These?

### Change Root Directory if:
- Your Next.js app is in a subfolder like `apps/my-app/`
- You have a monorepo structure
- **Your case:** No, leave it as `./`

### Change Build Command if:
- You need to run custom scripts before building
- You have a different build process
- **Your case:** No, `npm run build` is perfect

### Change Output Directory if:
- You're using a custom build setup
- You're exporting static files differently
- **Your case:** No, `.next` is correct

### Change Install Command if:
- You want to force `yarn` instead of `npm`
- You have custom install steps
- **Your case:** No, `npm install` is fine

---

## Common Mistakes to Avoid

❌ **Don't turn on the toggles** unless you have a specific reason  
❌ **Don't change Root Directory** if your files are at the repo root  
❌ **Don't override Build Command** unless you know what you're doing  
❌ **Don't worry about these settings** - Vercel's defaults are correct!

---

## What Actually Matters

The settings that **REALLY matter** for your deployment:

1. ✅ **Environment Variables** (the API keys we discussed)
2. ✅ **Domain Configuration** (for dealflow.media)
3. ✅ **Framework Preset** (already correct: Next.js)

Everything else can stay as default!

---

## Next Steps After Reviewing Settings

1. ✅ Verify Framework Preset = `Next.js`
2. ✅ Verify Root Directory = `./`
3. ✅ Leave all toggles OFF
4. ✅ Click **"Deploy"** button
5. ✅ Wait for build to complete
6. ✅ Then add Environment Variables (from the other guide)
7. ✅ Redeploy to apply environment variables

---

## Troubleshooting

### "Build Failed" Error?

- Check that Framework Preset is `Next.js`
- Verify Root Directory is correct
- Check build logs in Vercel dashboard

### "Cannot Find Module" Error?

- Usually means Root Directory is wrong
- Check if your files are actually at `./` or in a subfolder

### Build Takes Forever?

- Normal for first build (2-3 minutes)
- Subsequent builds are faster (cached)

---

## TL;DR

**Just click "Deploy" and move on!** 

Vercel auto-detected everything correctly. The only thing you need to configure is:
1. Environment Variables (after first deploy)
2. Custom Domain (after first deploy)

Everything else is already set up perfectly! 🎉

---

*Last updated: January 29, 2026*
