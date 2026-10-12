# Hostinger + Vercel Deployment Guide for dealflow.media

## Overview

This guide shows you how to deploy the Podcast Pitch Generator to a subdomain on `dealflow.media` using Hostinger DNS and Vercel hosting.

**Recommended Setup**: `pitches.dealflow.media` or `podcast-pitch.dealflow.media`

---

## Step 1: Deploy to Vercel

1. Go to https://vercel.com and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `kobestarr/podcast-pitch-generator`
4. Click **"Import"**

### Add Environment Variables

Go to **Project Settings** → **Environment Variables** and add all required keys (see `VERCEL_DEPLOYMENT.md` for full list).

### Deploy

Click **"Deploy"** and wait for build to complete (~2-3 minutes).

You'll get a URL like: `podcast-pitch-generator-xxxxx.vercel.app`

---

## Step 2: Add Custom Domain in Vercel

1. In your Vercel project, go to **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your subdomain: `pitches.dealflow.media` (or `podcast-pitch.dealflow.media`)
4. Click **"Add"**

Vercel will show you DNS instructions. You'll see something like:
```
Type: CNAME
Name: pitches
Value: cname.vercel-dns.com
```

**Keep this page open** - you'll need it for the next step.

---

## Step 3: Configure DNS in Hostinger

### Access Hostinger DNS

1. Log in to **Hostinger** (https://hpanel.hostinger.com)
2. Go to **Domains** → **dealflow.media**
3. Click **"Manage"** or **"DNS / Name Servers"**
4. Look for **"DNS Zone Editor"** or **"DNS Records"**

### Add CNAME Record

1. Click **"Add Record"** or **"Add New Record"**
2. Select **CNAME** as the record type
3. Fill in:
   - **Name/Host**: `pitches` (or `podcast-pitch` - whatever you chose)
   - **Points to/Target**: `cname.vercel-dns.com`
   - **TTL**: `3600` (or leave as default)

4. Click **"Save"** or **"Add Record"**

**Example DNS Record:**
```
Type: CNAME
Name: pitches
Points to: cname.vercel-dns.com
TTL: 3600
```

### Verify DNS Record

After adding, you should see the CNAME record in your DNS list:
```
pitches    CNAME    cname.vercel-dns.com    3600
```

---

## Step 4: Wait for DNS Propagation

- DNS changes typically take **5-30 minutes** to propagate
- Can take up to 48 hours in rare cases (usually much faster)

### Check Propagation Status

**Option 1: Vercel Dashboard**
- Go to **Settings** → **Domains**
- Vercel will show status: "Valid Configuration" when DNS is ready

**Option 2: Online Tools**
- Visit https://dnschecker.org
- Enter: `pitches.dealflow.media`
- Select **CNAME** record type
- Check if it shows `cname.vercel-dns.com`

**Option 3: Command Line**
```bash
dig pitches.dealflow.media CNAME
# or
nslookup pitches.dealflow.media
```

---

## Step 5: Verify Deployment

Once DNS propagates:

1. Visit `https://pitches.dealflow.media`
2. SSL certificate will be **automatically active** (Vercel handles this)
3. Your app should be live!

### Test Everything

- ✅ Form submission works
- ✅ Pitch generation works
- ✅ Email verification works
- ✅ All API routes function
- ✅ SSL certificate is active (padlock icon)

---

## Hostinger-Specific Notes

### If You Can't Find DNS Settings

**Option A: DNS Zone Editor**
- Look for **"DNS Zone Editor"** in Hostinger panel
- This is where you manage DNS records

**Option B: Advanced DNS**
- Some Hostinger plans have **"Advanced DNS"** section
- Go to **Domains** → **Advanced DNS**

**Option C: Contact Support**
- If DNS management isn't visible, you might need to:
  - Enable DNS management in your plan
  - Contact Hostinger support to enable it

### If Hostinger Uses Different Interface

Hostinger's interface may vary. Look for:
- **"DNS Records"**
- **"DNS Management"**
- **"Zone Editor"**
- **"DNS Zone"**

The key is finding where you can add **CNAME** records.

---

## Alternative: Using Cloudflare (If Hostinger DNS is Limited)

If Hostinger's DNS management is limited, you can use Cloudflare:

1. **Sign up for Cloudflare** (free): https://cloudflare.com
2. **Add your domain** `dealflow.media` to Cloudflare
3. **Change nameservers** in Hostinger to Cloudflare's nameservers
4. **Manage DNS in Cloudflare** (much better interface)
5. **Add CNAME record** in Cloudflare:
   - Name: `pitches`
   - Target: `cname.vercel-dns.com`
   - Proxy: **DNS only** (gray cloud) or **Proxied** (orange cloud)

---

## Troubleshooting

### Domain Shows "Not Configured" in Vercel

1. **Double-check CNAME record** in Hostinger
2. **Verify it points to** `cname.vercel-dns.com` (exact match)
3. **Wait longer** - DNS can take time
4. **Check Vercel dashboard** for any error messages

### DNS Not Propagating

1. **Verify CNAME is correct** in Hostinger
2. **Check TTL** - lower TTL (300-600) can help
3. **Clear DNS cache**:
   - Mac: `sudo dscacheutil -flushcache`
   - Windows: `ipconfig /flushdns`
   - Or restart your router

### SSL Certificate Not Working

- **Wait 5-10 minutes** after DNS propagates
- Vercel automatically provisions SSL (can take a few minutes)
- Ensure you're using `https://` not `http://`
- Check Vercel dashboard for SSL status

### Can't Access DNS in Hostinger

- **Check your plan** - some plans may have DNS management disabled
- **Contact Hostinger support** to enable DNS management
- **Consider Cloudflare** as alternative (free, better DNS management)

---

## Recommended Subdomain Names

Choose one that fits your brand:

- ✅ `pitches.dealflow.media` (short, clear)
- ✅ `podcast-pitch.dealflow.media` (descriptive)
- ✅ `pitchgen.dealflow.media` (short)
- ✅ `guest-pitch.dealflow.media` (descriptive)
- ✅ `pitch.dealflow.media` (very short)

**My recommendation**: `pitches.dealflow.media` - short, clear, professional.

---

## Complete Setup Checklist

- [ ] Deploy to Vercel
- [ ] Add all environment variables
- [ ] Add domain `pitches.dealflow.media` in Vercel
- [ ] Log in to Hostinger
- [ ] Navigate to DNS management for `dealflow.media`
- [ ] Add CNAME record: `pitches` → `cname.vercel-dns.com`
- [ ] Wait 5-30 minutes for DNS propagation
- [ ] Verify DNS propagation (dnschecker.org)
- [ ] Visit `https://pitches.dealflow.media`
- [ ] Test all functionality
- [ ] Verify SSL certificate is active

---

## Quick Reference

**Domain**: `pitches.dealflow.media`  
**DNS Provider**: Hostinger  
**Hosting**: Vercel  
**DNS Record Type**: CNAME  
**DNS Record Value**: `cname.vercel-dns.com`  
**SSL**: Automatic (via Vercel)

---

## Next Steps After Deployment

1. **Test thoroughly** - run through all user flows
2. **Update any hardcoded URLs** if needed
3. **Share the URL** with your team
4. **Monitor performance** in Vercel dashboard
5. **Set up monitoring/alerts** if needed

---

## Support Resources

- **Hostinger Support**: https://www.hostinger.com/contact
- **Vercel Docs**: https://vercel.com/docs
- **DNS Checker**: https://dnschecker.org
- **Vercel Status**: https://vercel-status.com

---

*Last updated: January 29, 2026*
