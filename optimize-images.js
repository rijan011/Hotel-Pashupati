// Image Optimization Helper
// This script provides guidance for optimizing the large images in the project

console.log(`
=== HOTEL PASHUPATI - IMAGE OPTIMIZATION GUIDE ===

Current Issues Found:
- 5.jpg is ~10MB (too large for web)
- Some images could be better compressed

Recommendations:
1. Compress 5.jpg to under 500KB using:
   - Online: TinyPNG.com, Squoosh.app
   - CLI: imagemin, sharp

2. Target file sizes:
   - Hero images: 200-400KB
   - Room photos: 100-200KB
   - Gallery images: 50-150KB

3. Export settings:
   - JPEG: Quality 80-85%
   - WebP: 70-80% (better compression)
   - Consider responsive images with srcset

4. Add modern formats:
   <picture>
     <source srcset="image.webp" type="image/webp">
     <img src="image.jpg" alt="...">
   </picture>

5. Lazy loading is already implemented ✓

Priority: Optimize 5.jpg first (10MB → <500KB)
This will significantly improve page load speed.
`);
