# Custom Domain Setup Guide

## Overview

This guide shows you how to deploy the Podcast Pitch Generator to your own domain (e.g., `pitches.yourdomain.com` or `yourdomain.com/pitches`).

---

## Option 1: Subdomain (Recommended)

**Example**: `pitches.yourdomain.com` or `podcast-pitch.yourdomain.com`

### Step 1: Deploy to Vercel

1. Follow the main deployment guide (`VERCEL_DEPLOYMENT.md`)
2. Deploy your project (you'll get a `*.vercel.app` URL initially)

### Step 2: Add Custom Domain in Vercel

1. Go to your **Vercel Project** → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your subdomain: `pitches.yourdomain.com`
4. Click **"Add"**

### Step 3: Configure DNS

Vercel will show you DNS instructions. You need to add a **CNAME record**:

**In your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):**

1. Go to DNS Management
2. Add a new **CNAME** record:
   - **Name/Host**: `pitches` (or `podcast-pitch`, etc.)
   - **Value/Target**: `cname.vercel-dns.com`
   - **TTL**: `3600` (or default)

**Example DNS Record:**
```
Type: CNAME
Name: pitches
Value: cname.vercel-dns.com
TTL: 3600
```

### Step 4: Wait for Propagation

- DNS changes can take 5 minutes to 48 hours (usually 5-30 minutes)
- Vercel will automatically detect when DNS is configured
- SSL certificate is automatically provisioned (free, automatic)

### Step 5: Verify

Once DNS propagates:
- Visit `https://pitches.yourdomain.com`
- SSL certificate will be active automatically
- Your app should be live!

---

## Option 2: Root Domain

**Example**: `yourdomain.com` (instead of subdomain)

### Step 1: Add Domain in Vercel

1. Go to **Settings** → **Domains**
2. Add: `yourdomain.com` and `www.yourdomain.com`

### Step 2: Configure DNS

Vercel will provide **A records** to add:

**Add these A records:**
```
Type: A
Name: @ (or root)
Value: 76.76.21.21
TTL: 3600

Type: A
Name: @ (or root)
Value: 76.223.126.88
TTL: 3600
```

**Add CNAME for www:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Note**: Vercel will show you the exact IP addresses to use - they may change.

### Step 3: Wait & Verify

Same as subdomain - wait for DNS propagation and verify.

---

## Option 3: Subdirectory Path

**Example**: `yourdomain.com/pitches` or `yourdomain.com/podcast-pitch`

This requires a **reverse proxy** setup. Options:

### A. Using Vercel + Rewrites (If main site is also on Vercel)

1. Deploy pitch generator as a separate Vercel project
2. In your main site's `vercel.json`, add:

```json
{
  "rewrites": [
    {
      "source": "/pitches/:path*",
      "destination": "https://pitches.yourdomain.com/:path*"
    }
  ]
}
```

### B. Using Cloudflare Workers (Recommended for separate hosting)

1. Deploy pitch generator to Vercel (get the URL)
2. Create a Cloudflare Worker to proxy requests
3. Route `/pitches/*` to your Vercel deployment

### C. Using Nginx/Apache Reverse Proxy

If you have a VPS/server:
1. Deploy pitch generator to Vercel
2. Configure Nginx to proxy `/pitches/*` to Vercel URL

---

## DNS Providers Guide

### Cloudflare

1. Go to **DNS** → **Records**
2. Click **"Add record"**
3. Select **CNAME**
4. Name: `pitches`
5. Target: `cname.vercel-dns.com`
6. Proxy status: **DNS only** (gray cloud) or **Proxied** (orange cloud)
7. Click **Save**

### GoDaddy

1. Go to **DNS Management**
2. Click **"Add"**
3. Type: **CNAME**
4. Host: `pitches`
5. Points to: `cname.vercel-dns.com`
6. TTL: `1 Hour`
7. Click **"Save"**

### Namecheap

1. Go to **Domain List** → **Manage**
2. Go to **Advanced DNS** tab
3. Click **"Add New Record"**
4. Type: **CNAME Record**
5. Host: `pitches`
6. Value: `cname.vercel-dns.com`
7. TTL: `Automatic`
8. Click **Save**

### Google Domains

1. Go to **DNS** section
2. Scroll to **Custom resource records**
3. Add:
   - Name: `pitches`
   - Type: `CNAME`
   - Data: `cname.vercel-dns.com`
4. Click **Add**

---

## Recommended Setup

**Best Practice**: Use a subdomain

✅ **Pros:**
- Easy to set up
- Clean separation
- Easy to move/change later
- SSL automatic
- No conflicts with main site

**Examples:**
- `pitches.yourdomain.com`
- `podcast-pitch.yourdomain.com`
- `pitchgen.yourdomain.com`
- `guest-pitch.yourdomain.com`

---

## SSL Certificate

✅ **Automatic with Vercel:**
- Vercel automatically provisions SSL certificates via Let's Encrypt
- Free, automatic renewal
- Works for both HTTP and HTTPS
- No configuration needed

---

## Testing Your Domain

### Check DNS Propagation:

1. **Online Tools:**
   - https://dnschecker.org
   - https://www.whatsmydns.net
   - Enter your domain and check CNAME record

2. **Command Line:**
   ```bash
   dig pitches.yourdomain.com CNAME
   # or
   nslookup pitches.yourdomain.com
   ```

### Verify SSL:

- Visit `https://pitches.yourdomain.com`
- Check for padlock icon in browser
- Test SSL: https://www.ssllabs.com/ssltest/

---

## Troubleshooting

### Domain Not Working?

1. **Check DNS propagation** (can take up to 48 hours)
2. **Verify CNAME record** is correct
3. **Check Vercel dashboard** - it will show domain status
4. **Clear DNS cache**: `sudo dscacheutil -flushcache` (Mac) or restart router

### SSL Not Working?

- Wait 5-10 minutes after DNS propagates
- Vercel automatically provisions SSL
- Check Vercel dashboard for SSL status
- Ensure you're using `https://` not `http://`

### Domain Shows "Not Configured"?

- Verify DNS records are correct
- Wait for DNS propagation
- Check Vercel dashboard for any errors
- Try removing and re-adding domain in Vercel

---

## Multiple Domains

You can add multiple domains to the same Vercel project:

1. **Settings** → **Domains** → **Add Domain**
2. Add: `pitches.yourdomain.com`
3. Add: `podcast-pitch.yourdomain.com`
4. Add: `pitches.anotherdomain.com`

All will point to the same deployment!

---

## Redirects

### Redirect www to non-www (or vice versa):

In Vercel project settings → **Domains**:
- Add both `pitches.yourdomain.com` and `www.pitches.yourdomain.com`
- Set one as primary
- Vercel will auto-redirect

### Redirect old domain to new:

In `vercel.json`:
```json
{
  "redirects": [
    {
      "source": "/old-path",
      "destination": "https://pitches.yourdomain.com",
      "permanent": true
    }
  ]
}
```

---

## Cost

✅ **Free with Vercel:**
- Custom domains: **Free**
- SSL certificates: **Free**
- DNS management: **Free** (handled by your registrar)
- Bandwidth: **Free** (generous limits on free tier)

**You only pay for:**
- Your domain registration (~$10-15/year)
- Optional: Vercel Pro if you need more features

---

## Next Steps

1. **Choose your domain structure** (subdomain recommended)
2. **Deploy to Vercel** (follow main deployment guide)
3. **Add domain in Vercel dashboard**
4. **Configure DNS** at your registrar
5. **Wait for propagation** (5-30 minutes usually)
6. **Test and verify** everything works

---

## Example: Complete Setup

**Goal**: Deploy to `pitches.stripped.media`

1. ✅ Deploy to Vercel → Get `podcast-pitch-generator.vercel.app`
2. ✅ Add domain in Vercel: `pitches.stripped.media`
3. ✅ Go to DNS provider (e.g., Cloudflare)
4. ✅ Add CNAME: `pitches` → `cname.vercel-dns.com`
5. ✅ Wait 5-10 minutes
6. ✅ Visit `https://pitches.stripped.media` → Live!

---

*Last updated: January 29, 2026*
