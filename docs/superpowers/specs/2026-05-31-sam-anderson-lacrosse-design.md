# Sam Anderson Lacrosse Lessons — Site Design

**Date:** 2026-05-31  
**Repo:** sam-anderson-lacrosse  
**Stack:** Vite + React 18  
**Hosting:** Azure Static Web Apps

---

## Overview

Single-page marketing and booking site for Coach Sam Anderson's private lacrosse lessons (Summer 2026). The design prototype lives in `~/Downloads/sam anderson/` — all visual design, copy, and component logic is complete. This spec covers the port from prototype (CDN React + Babel) to a proper Vite + React project.

---

## Architecture

Static single-page application. No backend, no API routes. All content is hardcoded in `src/data.js`. Booking is handled via an embedded Calendly widget (URL added when ready); contact is email-only.

---

## Project Structure

```
sam-anderson-lacrosse/
├── public/
│   └── assets/                  # Static images (coach.jpg, logos, uploads/)
├── src/
│   ├── components/
│   │   ├── TopBar.jsx           # Nav bar with logos, email link, CTA button
│   │   ├── Hero.jsx             # Stadium hero layout (hardcoded; split/crest removed)
│   │   ├── Creds.jsx            # Homestead + Revolt credential strip
│   │   ├── AboutCoach.jsx       # Coach bio, focus areas, stats
│   │   ├── About.jsx            # Personal note from Sam, dark navy section
│   │   ├── Booking.jsx          # Calendly embed or placeholder
│   │   ├── Contact.jsx          # Email CTA, location, pricing note
│   │   └── Footer.jsx           # Logo lockup, copyright
│   ├── data.js                  # COACH config, DATES array, Icon component, logo helpers
│   ├── App.jsx                  # Root: assembles all sections, sets CSS custom props
│   ├── main.jsx                 # ReactDOM.createRoot entry point
│   └── styles.css               # Full brand CSS (ported unchanged from prototype)
├── index.html
├── vite.config.js
├── package.json
└── staticwebapp.config.json     # Azure SPA routing fallback
```

---

## Component Design

**`src/data.js`**  
Exports named constants instead of `window` globals:
- `COACH` — name, email, location, calendlyUrl
- `DATES` — array of summer session date objects
- `Icon` — inline SVG icon component
- `HomesteadMark`, `RevoltMark` — logo `<img>` helpers
- `useReveal` — IntersectionObserver scroll-reveal hook

**`src/App.jsx`**  
Assembles all sections. Sets `--accent` and `--accent-deep` CSS custom properties at the root div. No TweaksPanel — accent and hero variant are hardcoded:
- Hero: `stadium`
- Accent: `#F2C230` (gold)
- Lead palette: `blend`

**Components**  
Each component is a direct port of the corresponding section from the prototype, updated to import from `src/data.js` rather than reading from `window`.

---

## Styles

`src/styles.css` is ported unchanged from the prototype. Brand system:
- Navy `#0F161F` (Revolt), Royal Blue `#0057A7` (Homestead), Gold `#F2C230`
- Fonts: Anton (display), Oswald (headings), Barlow (body) via Google Fonts
- CSS custom properties for theming; scroll-reveal via `.reveal` / `.in` classes

---

## Booking (Calendly)

`Booking.jsx` checks `COACH.calendlyUrl`:
- If empty → shows a styled placeholder with an email-to-book CTA
- If set → initializes `Calendly.initInlineWidget` with the URL

Calendly script/CSS loaded via `<link>` and `<script>` tags in `index.html`. To go live: paste the Calendly link into `COACH.calendlyUrl` in `src/data.js`.

---

## Azure Deployment

`staticwebapp.config.json` configures a catch-all route fallback to `index.html` so Azure serves the SPA correctly:

```json
{
  "routes": [{ "route": "/*", "serve": "/index.html", "statusCode": 200 }],
  "navigationFallback": { "rewrite": "/index.html" }
}
```

GitHub repo `sam-anderson-lacrosse` will be connected to Azure Static Web Apps via the portal. No CI/CD config is added at this stage — Azure generates its own GitHub Actions workflow on connection.

---

## What's Removed from Prototype

- `TweaksPanel` and `tweaks-panel.jsx` — design-time tool, not for production
- `useTweaks` hook — no longer needed
- Multiple hero variants (split, crest) — stadium is the chosen layout
- CDN React, ReactDOM, Babel — replaced by npm packages + Vite build

---

## Out of Scope

- Multiple pages / routing
- Form submission / backend contact handling
- Analytics
- SEO beyond the existing `<meta>` description tag
