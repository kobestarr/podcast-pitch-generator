# How to Add a Favicon

## Quick Method (Easiest)

### Option 1: Add favicon.ico file

1. **Get or create a favicon:**
   - Size: 32x32 pixels or 16x16 pixels
   - Format: `.ico` file (or `.png` works too)
   - You can create one at: https://favicon.io or https://realfavicongenerator.net

2. **Place it in your app directory:**
   ```
   src/app/favicon.ico
   ```

3. **That's it!** Next.js will automatically detect it and use it.

---

## Option 2: Use PNG/SVG Favicon

If you have a PNG or SVG file:

1. **Rename it to `icon.png` or `icon.svg`**
2. **Place in:** `src/app/icon.png` or `src/app/icon.svg`
3. **Next.js will automatically use it**

---

## Option 3: Add via Metadata (More Control)

If you want to specify multiple favicon sizes or formats, add to `layout.tsx`:

```typescript
export const metadata = {
  // ... existing metadata
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};
```

---

## Recommended Sizes

- **favicon.ico**: 32x32 or 16x16 pixels
- **icon.png**: 32x32 pixels
- **apple-touch-icon.png**: 180x180 pixels (for iOS)

---

## Where to Get a Favicon

### Free Favicon Generators:
- **Favicon.io**: https://favicon.io (text/emoji to favicon)
- **RealFaviconGenerator**: https://realfavicongenerator.net (comprehensive)
- **Favicon Generator**: https://www.favicon-generator.org

### Create from Image:
- Upload your logo/image
- These tools will generate all sizes needed

---

## Quick Steps

1. **Create/download favicon** (32x32 or 16x16, .ico format)
2. **Save as:** `favicon.ico`
3. **Place in:** `src/app/favicon.ico`
4. **Commit and push:**
   ```bash
   git add src/app/favicon.ico
   git commit -m "Add favicon"
   git push origin main
   ```
5. **Wait for Vercel to deploy** (2-3 minutes)
6. **Check browser tab** - favicon should appear!

---

## Troubleshooting

### Favicon Not Showing?

1. **Clear browser cache** (Ctrl+Shift+Delete or Cmd+Shift+Delete)
2. **Hard refresh:** Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
3. **Check file name:** Must be exactly `favicon.ico` or `icon.png`
4. **Check location:** Must be in `src/app/` directory
5. **Wait for deployment:** Changes need to deploy first

### Still Not Working?

Add explicit favicon link in `layout.tsx` `<head>`:

```typescript
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" href="/icon.png" type="image/png" />
```

---

*Last updated: January 29, 2026*
