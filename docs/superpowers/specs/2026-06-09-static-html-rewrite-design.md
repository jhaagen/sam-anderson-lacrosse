# Design: Static HTML Rewrite for PageSpeed

**Date:** 2026-06-09
**Goal:** Fix PageSpeed score from 38 → 90+ by eliminating React runtime and switching to a single prerendered `index.html`.

---

## Problem

The site is a pure client-side React SPA. The browser receives a blank `<div id="root"></div>` and cannot paint anything until a 153KB JS bundle downloads, parses, and executes. PageSpeed's FCP/LCP are measured against that blank screen. React is overkill for a static brochure page with no real interactivity.

Secondary issues: Google Fonts external request, unused large images in `public/assets/` (2.6MB JPGs), Calendly iframe loading eagerly.

---

## Approach: Full Static HTML (Option C)

Delete React and the entire build toolchain. Rewrite as one `index.html` with all CSS inlined, SVG icons inlined, fonts self-hosted, and ~30 lines of vanilla JS.

---

## Architecture

### Output structure
```
sam-anderson-lacrosse/
├── index.html              ← single file, all content
├── assets/
│   ├── fonts/              ← self-hosted Anton, Oswald, Barlow
│   │   ├── anton-400.woff2
│   │   ├── oswald-400.woff2
│   │   ├── oswald-500.woff2
│   │   ├── oswald-600.woff2
│   │   ├── oswald-700.woff2
│   │   ├── barlow-400.woff2
│   │   ├── barlow-500.woff2
│   │   ├── barlow-600.woff2
│   │   └── barlow-700.woff2
│   ├── coach-sm.webp       ← hero image small (49KB)
│   ├── coach.webp          ← hero image large (164KB)
│   ├── sam-sideline-sm.webp
│   ├── sam-sideline.webp
│   ├── homestead-logo.webp
│   ├── revolt-logo.webp
│   └── og-image.webp
├── robots.txt
├── sitemap.xml
└── staticwebapp.config.json
```

### Deleted
- `src/` — all JSX components
- `package.json`, `package-lock.json`, `node_modules/`, `vite.config.js`
- `dist/` — no longer needed (root is now the deploy artifact)
- `assets/coach.jpg` (2.6MB, superseded by webp)
- `assets/coach-opt.jpg` (275KB, superseded by webp)
- `assets/hhs-boys-girls-110.jpg` (2.6MB, unused on page)
- `assets/24_HHS_BoysLAX_Ring.png` (494KB, unused on page)
- `assets/sam-sideline.jpg` (92KB, superseded by webp)

---

## index.html structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- meta, OG, JSON-LD (unchanged from current) -->
  <style>/* full CSS inlined — eliminates render-blocking stylesheet request */</style>
  <link rel="preload" as="font" href="/assets/fonts/anton-400.woff2" ...>
  <!-- preload critical fonts -->
  <link rel="preload" as="image" href="/assets/coach.webp" fetchpriority="high">
</head>
<body>
  <!-- TopBar -->
  <!-- Hero (with <picture> responsive image) -->
  <!-- Creds strip -->
  <!-- AboutCoach section -->
  <!-- About section -->
  <!-- Booking section (Calendly target div) -->
  <!-- Contact section -->
  <!-- Footer -->
  <script>/* reveal + Calendly lazy-load (~30 lines) */</script>
</body>
</html>
```

---

## CSS

All styles from `src/styles.css` are placed in a `<style>` block in `<head>`. No external stylesheet = no render-blocking request. The CSS is ~17KB minified.

Font-face declarations use `font-display: swap` and point to `/assets/fonts/*.woff2`.

---

## JavaScript (~30 lines, inline `<script>` at end of `<body>`)

**Scroll reveal:** IntersectionObserver watches `.reveal` elements, adds `.in` class when visible.

**Calendly lazy-load:** A second IntersectionObserver watches `#book`. When the section scrolls within 200px of the viewport, it dynamically creates and injects the Calendly `<iframe>`. This prevents Calendly from blocking initial page load entirely.

```js
// Scroll reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Calendly lazy-load
const calSection = document.getElementById('book');
const calIo = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    const f = document.createElement('iframe');
    f.src = 'https://calendly.com/sam29anderson/private-lessons?embed_type=Inline&hide_event_type_details=1&hide_gdpr_banner=1';
    f.style.cssText = 'width:100%;height:700px;border:none';
    f.title = 'Book a Lacrosse Lesson';
    document.getElementById('cal-target').replaceWith(f);
    calIo.disconnect();
  }
}, { rootMargin: '200px' });
calIo.observe(calSection);
```

---

## Fonts

Download from Google Fonts API (Latin subset, display=swap). Store as `.woff2` in `assets/fonts/`.

Families and weights needed:
- **Anton**: 400 only
- **Oswald**: 400, 500, 600, 700
- **Barlow**: 400, 500, 600, 700

Preload the two most critical (`anton-400.woff2`, `oswald-600.woff2`) in `<head>`.

---

## Cache Headers (staticwebapp.config.json)

Update `staticwebapp.config.json` to add per-route cache headers and the `woff2` MIME type:

```json
{
  "mimeTypes": {
    ".woff2": "font/woff2"
  },
  "routes": [
    {
      "route": "/",
      "headers": { "Cache-Control": "no-cache" }
    },
    {
      "route": "/assets/fonts/*",
      "headers": { "Cache-Control": "public, max-age=31536000, immutable" }
    },
    {
      "route": "/assets/*.webp",
      "headers": { "Cache-Control": "public, max-age=31536000, immutable" }
    }
  ]
}
```

---

## Deployment

Azure Static Web Apps serves from the repo root. With `index.html` at the root and no build step, deployment is: push to GitHub → Azure picks up `index.html` directly. The existing `staticwebapp.config.json` already handles routing; we update it with cache headers (see above) but no workflow changes are needed.

---

## Expected PageSpeed Impact

| Issue | Before | After |
|---|---|---|
| FCP blocked by JS | 153KB React bundle must load first | Paint happens immediately — HTML is the content |
| Render-blocking CSS | External stylesheet | Inlined — zero additional requests |
| Google Fonts | External connection + download | Self-hosted, preloaded |
| Calendly at load | Iframe starts loading on page load | Deferred until user scrolls near #book |
| Unused images | 3.1MB of unreferenced JPGs in assets | Deleted |

Expected score: **90–98** (from 38).
