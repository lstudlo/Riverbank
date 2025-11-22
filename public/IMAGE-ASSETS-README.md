# Image Assets - Setup Instructions

This folder contains SVG placeholder images for social sharing and favicons. For optimal SEO and compatibility, you should convert these to proper formats.

## Social Preview Image (Open Graph)

**Current:** `og-image.svg` (SVG placeholder)
**Recommended:** `og-image.png` (1200x630 pixels, PNG format)

### How to create:

1. **Option A: Use a design tool**
   - Open Figma, Canva, or Photoshop
   - Create a 1200x630px canvas
   - Design your social preview with:
     - "Riverbank" branding
     - Tagline: "Bottle a thought. Let it drift."
     - Visual elements (water, bottles, etc.)
   - Export as PNG

2. **Option B: Convert the SVG**
   - Use an online tool like [Pixelied](https://pixelied.com/convert/svg-to-png) or [CloudConvert](https://cloudconvert.com/svg-to-png)
   - Upload `og-image.svg`
   - Set dimensions to 1200x630
   - Download as `og-image.png`

3. **Option C: Use command line (if you have ImageMagick)**
   ```bash
   convert og-image.svg -resize 1200x630 og-image.png
   ```

**After creating og-image.png:**
- Place it in the `public/` folder
- The index.html already references `og-image.png`
- Test your preview at [Open Graph Debugger](https://www.opengraph.xyz/)

---

## Favicon Files

**Current:** `favicon.svg` (SVG placeholder)
**Recommended:** Multiple formats for broad compatibility

### Required favicon files:

1. **favicon.ico** (16x16, 32x32, 48x48 multi-size ICO)
2. **favicon-16x16.png** (16x16 PNG)
3. **favicon-32x32.png** (32x32 PNG)
4. **apple-touch-icon.png** (180x180 PNG for iOS devices)

### How to create favicons:

**Option A: Use a favicon generator (Easiest)**
1. Visit [RealFaviconGenerator](https://realfavicongenerator.net/)
2. Upload `favicon.svg` or create your own design
3. Generate all formats
4. Download and extract to `public/` folder

**Option B: Use Favicon.io**
1. Visit [Favicon.io](https://favicon.io/)
2. Use "PNG to ICO" or "Text to Icon"
3. Download the package
4. Replace files in `public/` folder

**Option C: Manual creation**
1. Design your icon in a graphics editor (32x32 base size)
2. Export as PNG at different sizes
3. Use an ICO converter for the .ico file

### Files to create:
```
public/
├── favicon.ico           # Legacy browsers
├── favicon-16x16.png     # Modern browsers (small)
├── favicon-32x32.png     # Modern browsers (standard)
├── apple-touch-icon.png  # iOS devices (180x180)
```

---

## Current Status

✅ SVG placeholders created
✅ Meta tags configured in index.html
⏳ PNG/ICO conversion needed for optimal compatibility

## Testing

After creating the proper image files:

1. **Test Open Graph preview:**
   - Facebook: [Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - Twitter: [Card Validator](https://cards-dev.twitter.com/validator)
   - LinkedIn: [Post Inspector](https://www.linkedin.com/post-inspector/)
   - Generic: [Open Graph](https://www.opengraph.xyz/)

2. **Test favicons:**
   - Clear browser cache
   - Visit https://riverbank.day
   - Check browser tab icon
   - Check bookmarks icon
   - Test on mobile (add to home screen)

---

## Design Recommendations

### Brand Colors (from current theme):
- Primary Blue: `#3B82F6`
- Dark Blue: `#1E3A8A`
- Light Blue: `#87CEEB`
- Accent: `#60A5FA`

### Visual Elements:
- Water/river waves
- Message bottle silhouette
- Clean, minimalist design
- High contrast for legibility

### Typography:
- Title: Bold, modern sans-serif
- Tagline: Serif or italic for elegance
- Keep text readable at small sizes

---

## Quick Commands

If you have the tools installed:

```bash
# Convert SVG to PNG (requires ImageMagick)
convert og-image.svg -resize 1200x630 og-image.png

# Create favicons (requires ImageMagick)
convert favicon.svg -resize 16x16 favicon-16x16.png
convert favicon.svg -resize 32x32 favicon-32x32.png
convert favicon.svg -resize 180x180 apple-touch-icon.png

# Create ICO from PNG (requires ImageMagick)
convert favicon-16x16.png favicon-32x32.png favicon.ico
```

---

## Notes

- The SVG files will work as placeholders but PNG/ICO are recommended for compatibility
- Social platforms cache images; use cache-busting or debugger tools to refresh
- Test images on multiple devices and platforms
- Ensure images load quickly (keep file size under 500KB for og-image)
