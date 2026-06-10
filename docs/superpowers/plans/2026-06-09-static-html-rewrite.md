# Static HTML Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the React SPA with a single static `index.html`, self-hosted fonts, and ~30 lines of vanilla JS to lift the PageSpeed score from 38 to 90+.

**Architecture:** One `index.html` at the repo root with all CSS inlined in a `<style>` block, all SVG icons inlined in the HTML, and fonts served from `assets/fonts/`. The only JS is a small inline `<script>` for scroll-reveal and Calendly lazy-loading. No build step, no framework.

**Tech Stack:** Vanilla HTML/CSS/JS. Node 18+ (only for the one-time font download script). Azure Static Web Apps for hosting.

---

## File Map

| Action | Path |
|--------|------|
| Create | `index.html` (replaces `dist/index.html` and `src/`) |
| Create | `assets/fonts/anton-regular.woff2` |
| Create | `assets/fonts/oswald-regular.woff2` |
| Create | `assets/fonts/oswald-medium.woff2` |
| Create | `assets/fonts/oswald-semibold.woff2` |
| Create | `assets/fonts/oswald-bold.woff2` |
| Create | `assets/fonts/barlow-regular.woff2` |
| Create | `assets/fonts/barlow-medium.woff2` |
| Create | `assets/fonts/barlow-semibold.woff2` |
| Create | `assets/fonts/barlow-bold.woff2` |
| Modify | `staticwebapp.config.json` |
| Delete | `src/`, `dist/`, `node_modules/`, `package.json`, `package-lock.json`, `vite.config.js` |
| Delete | `assets/coach.jpg`, `assets/coach-opt.jpg`, `assets/hhs-boys-girls-110.jpg`, `assets/24_HHS_BoysLAX_Ring.png`, `assets/sam-sideline.jpg` |

---

## Task 1: Download self-hosted fonts

**Files:**
- Create: `assets/fonts/` directory with 9 `.woff2` files

- [ ] **Step 1: Create the fonts directory**

```bash
mkdir -p /Users/jaredhaagen/Sites/sam-anderson-lacrosse/assets/fonts
```

- [ ] **Step 2: Run the font download script**

Run this from the repo root. It uses Node's built-in `fetch` and `fs` (requires Node 18+) — no npm install needed.

```bash
cd /Users/jaredhaagen/Sites/sam-anderson-lacrosse
node --input-type=module << 'SCRIPT'
import { writeFileSync, mkdirSync } from 'fs';

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const DIR = 'assets/fonts';

const FONTS = [
  { family: 'Anton',  weight: 400, name: 'anton-regular'   },
  { family: 'Oswald', weight: 400, name: 'oswald-regular'  },
  { family: 'Oswald', weight: 500, name: 'oswald-medium'   },
  { family: 'Oswald', weight: 600, name: 'oswald-semibold' },
  { family: 'Oswald', weight: 700, name: 'oswald-bold'     },
  { family: 'Barlow', weight: 400, name: 'barlow-regular'  },
  { family: 'Barlow', weight: 500, name: 'barlow-medium'   },
  { family: 'Barlow', weight: 600, name: 'barlow-semibold' },
  { family: 'Barlow', weight: 700, name: 'barlow-bold'     },
];

const apiUrl = 'https://fonts.googleapis.com/css2?family=Anton:wght@400&family=Oswald:wght@400;500;600;700&family=Barlow:wght@400;500;600;700&display=swap';
const css = await fetch(apiUrl, { headers: { 'User-Agent': UA } }).then(r => r.text());

const blocks = css.match(/@font-face \{[^}]+\}/g) || [];
const seen = new Map();
for (const block of blocks) {
  const fam = (block.match(/font-family: '([^']+)'/) || [])[1];
  const wt  = (block.match(/font-weight: (\d+)/)     || [])[1];
  const url = (block.match(/url\(([^)]+)\)/)          || [])[1];
  if (fam && wt && url) seen.set(`${fam}-${wt}`, url); // last = latin subset
}

mkdirSync(DIR, { recursive: true });
for (const { family, weight, name } of FONTS) {
  const url = seen.get(`${family}-${weight}`);
  if (!url) { console.error(`MISSING: ${family} ${weight}`); continue; }
  const buf = await fetch(url).then(r => r.arrayBuffer());
  writeFileSync(`${DIR}/${name}.woff2`, Buffer.from(buf));
  console.log(`✓ ${name}.woff2`);
}
console.log('Done.');
SCRIPT
```

- [ ] **Step 3: Verify 9 files were downloaded**

```bash
ls -lh /Users/jaredhaagen/Sites/sam-anderson-lacrosse/assets/fonts/
```

Expected: 9 `.woff2` files, each 10–50 KB. If any says "MISSING", the Google Fonts API URL changed — re-run with `console.log(css)` added to inspect the raw response.

- [ ] **Step 4: Commit fonts**

```bash
cd /Users/jaredhaagen/Sites/sam-anderson-lacrosse
git add assets/fonts/
git commit -m "feat: add self-hosted fonts (Anton, Oswald, Barlow)"
```

---

## Task 2: Update staticwebapp.config.json

**Files:**
- Modify: `staticwebapp.config.json`

- [ ] **Step 1: Replace the file with cache-header-aware config**

The current file has a single catch-all route. Replace it entirely with:

```json
{
  "mimeTypes": {
    ".woff2": "font/woff2"
  },
  "routes": [
    {
      "route": "/assets/fonts/*",
      "headers": { "Cache-Control": "public, max-age=31536000, immutable" }
    },
    {
      "route": "/assets/*.webp",
      "headers": { "Cache-Control": "public, max-age=31536000, immutable" }
    },
    {
      "route": "/",
      "headers": { "Cache-Control": "no-cache" }
    },
    { "route": "/*", "serve": "/index.html", "statusCode": 200 }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/jaredhaagen/Sites/sam-anderson-lacrosse
git add staticwebapp.config.json
git commit -m "feat: add cache headers for fonts and images"
```

---

## Task 3: Create index.html

**Files:**
- Create: `index.html` at repo root

This is the entire site in one file. Create it with the exact content below.

The CSS block is `src/styles.css` with these changes:
- **Remove** the Google Fonts `<link>` (handled by `<link rel="preload">` + @font-face below)
- **Add** @font-face rules (shown in the `<style>` block below)
- **Remove** these dead CSS sections from styles.css (not used anywhere in the HTML):
  - `.hero--split` and its `@media(max-width:900px)` block
  - `.hero--crest` and all `.hero--crest *` rules
  - `.sched`, `.daycard`, `.sched-note` block
  - `.form`, `.field`, `.field input`, `.field select`, `.field textarea`, `.field textarea`, `.field input:focus`, `.field select:focus`, `.field textarea:focus`, `.field select option`, `.form .actions`, `.form .fineprint`
  - `.toast`
  - `.contact` (the two-column grid layout — NOT `.contact-cta` which is used)
  - `@media(max-width:820px){ .contact{ ... } .form .grid2{ ... } }` (the contact/form media query — keep only the `.about` part of that media query)

- [ ] **Step 1: Create the file**

Write the following as `index.html` at the repo root (replace `/* STYLES */` with the modified `src/styles.css` content as described above — the @font-face block is shown explicitly):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Private Lacrosse Lessons Fort Wayne IN | Coach Sam Anderson</title>
  <meta name="description" content="Private lacrosse lessons in Fort Wayne, Indiana with Coach Sam Anderson — head coach of Homestead Lacrosse and director of Revolt Lacrosse. Youth through college-age players, all skill levels. Book your session today." />
  <link rel="canonical" href="https://fortwaynelacrosselessons.com/" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://fortwaynelacrosselessons.com/" />
  <meta property="og:title" content="Private Lacrosse Lessons Fort Wayne IN | Coach Sam Anderson" />
  <meta property="og:description" content="One-on-one lacrosse training in Fort Wayne, Indiana with Coach Sam Anderson. Youth through college-age players, all skill levels. Stick skills, shooting, defense, and lacrosse IQ." />
  <meta property="og:image" content="https://fortwaynelacrosselessons.com/assets/og-image.webp" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Coach Sam Anderson — Fort Wayne lacrosse instructor" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:site_name" content="Fort Wayne Lacrosse Lessons" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Private Lacrosse Lessons Fort Wayne IN | Coach Sam Anderson" />
  <meta name="twitter:description" content="One-on-one lacrosse training in Fort Wayne, Indiana. Youth through college-age players, all skill levels." />
  <meta name="twitter:image" content="https://fortwaynelacrosselessons.com/assets/og-image.webp" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Sam Anderson Private Lacrosse Lessons",
    "description": "Private one-on-one lacrosse lessons in Fort Wayne, Indiana for youth through college-age players. Training covers stick skills, shooting, dodging, defense, and lacrosse IQ.",
    "url": "https://fortwaynelacrosselessons.com",
    "email": "sam29anderson@yahoo.com",
    "image": "https://fortwaynelacrosselessons.com/assets/og-image.webp",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Homestead Soccer Fields",
      "addressLocality": "Fort Wayne",
      "addressRegion": "IN",
      "addressCountry": "US"
    },
    "areaServed": {
      "@type": "City",
      "name": "Fort Wayne",
      "containedInPlace": { "@type": "State", "name": "Indiana" }
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Lacrosse Lessons",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Private One-on-One Lacrosse Lesson",
            "description": "Individual session tailored to the athlete's skill level and goals"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Small Group Lacrosse Training",
            "description": "Small group sessions for youth through college-age players"
          }
        }
      ]
    },
    "provider": {
      "@type": "Person",
      "name": "Sam Anderson",
      "jobTitle": "Lacrosse Coach",
      "email": "sam29anderson@yahoo.com",
      "worksFor": [
        { "@type": "SportsOrganization", "name": "Homestead Lacrosse", "url": "https://homesteadlacrosse.com" },
        { "@type": "SportsOrganization", "name": "Revolt Lacrosse" }
      ]
    }
  }
  </script>

  <link rel="icon" href="data:," />
  <link rel="preload" as="image"
        href="/assets/coach.webp"
        imagesrcset="/assets/coach-sm.webp 900w, /assets/coach.webp 1800w"
        imagesizes="100vw"
        type="image/webp" fetchpriority="high" />
  <link rel="preload" as="font" href="/assets/fonts/anton-regular.woff2" type="font/woff2" crossorigin />
  <link rel="preload" as="font" href="/assets/fonts/oswald-semibold.woff2" type="font/woff2" crossorigin />

  <style>
    /* ── Self-hosted fonts ───────────────────────────────── */
    @font-face { font-family: 'Anton';  font-style: normal; font-weight: 400; font-display: swap; src: url('/assets/fonts/anton-regular.woff2')   format('woff2'); }
    @font-face { font-family: 'Oswald'; font-style: normal; font-weight: 400; font-display: swap; src: url('/assets/fonts/oswald-regular.woff2')  format('woff2'); }
    @font-face { font-family: 'Oswald'; font-style: normal; font-weight: 500; font-display: swap; src: url('/assets/fonts/oswald-medium.woff2')   format('woff2'); }
    @font-face { font-family: 'Oswald'; font-style: normal; font-weight: 600; font-display: swap; src: url('/assets/fonts/oswald-semibold.woff2') format('woff2'); }
    @font-face { font-family: 'Oswald'; font-style: normal; font-weight: 700; font-display: swap; src: url('/assets/fonts/oswald-bold.woff2')     format('woff2'); }
    @font-face { font-family: 'Barlow'; font-style: normal; font-weight: 400; font-display: swap; src: url('/assets/fonts/barlow-regular.woff2')  format('woff2'); }
    @font-face { font-family: 'Barlow'; font-style: normal; font-weight: 500; font-display: swap; src: url('/assets/fonts/barlow-medium.woff2')   format('woff2'); }
    @font-face { font-family: 'Barlow'; font-style: normal; font-weight: 600; font-display: swap; src: url('/assets/fonts/barlow-semibold.woff2') format('woff2'); }
    @font-face { font-family: 'Barlow'; font-style: normal; font-weight: 700; font-display: swap; src: url('/assets/fonts/barlow-bold.woff2')     format('woff2'); }

    /* ── Paste the full content of src/styles.css below,   ──
       ── OMITTING the dead sections listed in Task 3 desc. ── */
  </style>
</head>
<body data-lead="blend">

  <!-- ═══════════════════════════════════════════════════════
       TOP BAR
  ═══════════════════════════════════════════════════════ -->
  <div class="topbar">
    <div class="wrap topbar__in">
      <div class="marks">
        <img class="hs" src="/assets/homestead-logo.webp" alt="Homestead Lacrosse" width="160" height="40" />
        <span class="divider"></span>
        <img class="revolt" src="/assets/revolt-logo.webp" alt="Revolt Lacrosse" width="96" height="24" />
      </div>
      <span class="topbar__name">Sam Anderson · Lacrosse Lessons</span>
      <span class="spacer"></span>
      <a class="topbar__mail" href="mailto:sam29anderson@yahoo.com">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
        sam29anderson@yahoo.com
      </a>
      <a class="btn" href="#book">Book a Lesson</a>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════
       HERO
  ═══════════════════════════════════════════════════════ -->
  <header class="hero hero--stadium">
    <div class="hero__bg">
      <picture>
        <source srcset="/assets/coach-sm.webp 900w, /assets/coach.webp 1800w" type="image/webp" />
        <img src="/assets/coach.webp" alt="Coach Sam Anderson directing a lacrosse session"
             width="1800" height="2700" fetchpriority="high" />
      </picture>
    </div>
    <div class="hero__scrim"></div>
    <div class="hero__field"></div>
    <div class="hero__in">
      <div class="wrap">
        <div class="hero__col">
          <span class="hero__kicker eyebrow">
            <span class="dot"></span> Summer 2026 · Private Lessons
          </span>
          <h1>Private<br /><em>Lacrosse</em><br />Lessons</h1>
          <p class="hero__lead">
            Summer one&#8209;on&#8209;one training with Coach Sam Anderson — for youth through
            high&#8209;school boys of every skill level. Sharpen your stick skills, IQ, and
            confidence with the head coach of Homestead Lacrosse.
          </p>
          <div class="hero__cta">
            <a class="btn btn--lg" href="#book">
              Book a Lesson
              <span class="arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </span>
            </a>
            <a class="btn btn--lg btn--ghost" href="mailto:sam29anderson@yahoo.com">Email Sam</a>
          </div>
          <div class="hero__meta">
            <div class="mi"><span class="k">Who</span><span class="v">Youth–College Players</span></div>
            <div class="mi"><span class="k">Format</span><span class="v">1&#8209;on&#8209;1 &amp; Small Group</span></div>
            <div class="mi"><span class="k">Where</span><span class="v">Homestead Soccer Fields, Fort Wayne IN</span></div>
            <div class="mi">
              <span class="k">Pricing</span>
              <a class="v hero__pricing-link" href="mailto:sam29anderson@yahoo.com?subject=Lacrosse%20Lesson%20Pricing">
                Contact for pricing
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- ═══════════════════════════════════════════════════════
       CREDIBILITY STRIP
  ═══════════════════════════════════════════════════════ -->
  <section class="creds">
    <div class="wrap creds__in">
      <span class="label">Coached by</span>
      <div class="org">
        <img class="hs" src="/assets/homestead-logo.webp" alt="Homestead Lacrosse" width="160" height="64" />
        <span class="role"><b>Homestead Lacrosse</b><span>Head Coach</span></span>
      </div>
      <div class="vr"></div>
      <div class="org">
        <img class="rv" src="/assets/revolt-logo.webp" alt="Revolt Lacrosse" width="96" height="38" />
        <span class="role"><b>Revolt Lacrosse</b><span>Director</span></span>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════
       ABOUT COACH
  ═══════════════════════════════════════════════════════ -->
  <section class="section" id="about-coach" style="background: var(--cream)">
    <div class="wrap aboutc">

      <div class="aboutc__intro reveal">
        <span class="eyebrow" style="color: var(--blue)">About Coach Sam</span>
        <h2>Coaching With A Plan</h2>
        <p>
          Sam has spent nearly a decade around the game — a five&#8209;year collegiate defenseman
          turned full&#8209;time coach. Today he's Head Coach of Homestead Lacrosse and Director of
          Revolt Lacrosse, where his teams are built on fundamentals, competitiveness, and
          players who steadily get better.
        </p>
        <p>
          Every private session is tailored to one athlete and one set of goals. We start
          with an honest look at where you are, build a simple plan, and put in focused reps —
          whether you're brand new to the sport or chasing a varsity spot.
        </p>
        <div class="aboutc__stats">
          <div class="stat"><span class="n">8+</span><span class="l">Years Coaching</span></div>
          <div class="stat"><span class="n">100+</span><span class="l">Athletes Coached</span></div>
          <div class="stat"><span class="n">5</span><span class="l">Yrs College Player</span></div>
        </div>
      </div>

      <div class="focuscard reveal">
        <h3>What We'll Work On</h3>
        <div class="focuslist">

          <div class="focusrow">
            <span class="ic">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>
            </span>
            <span class="t"><b>Stick Skills &amp; Wall Ball</b><span>Cleaner catches, both hands, faster release.</span></span>
          </div>

          <div class="focusrow">
            <span class="ic">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>
            </span>
            <span class="t"><b>Shooting &amp; Dodging</b><span>Finish on the run and beat your defender 1v1.</span></span>
          </div>

          <div class="focusrow">
            <span class="ic">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v6c0 4-3 7-7 8-4-1-7-4-7-8V6l7-3z"/></svg>
            </span>
            <span class="t"><b>Defense &amp; Footwork</b><span>Approaches, breakdowns, and on-ball pressure.</span></span>
          </div>

          <div class="focusrow">
            <span class="ic">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
            </span>
            <span class="t"><b>Lacrosse IQ &amp; Vision</b><span>See the field, make the next read, play faster.</span></span>
          </div>

        </div>
        <a class="btn btn--blue" href="#book" style="margin-top: 26px">
          See Open Times
          <span class="arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </span>
        </a>
      </div>

    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════
       ABOUT (note from Sam)
  ═══════════════════════════════════════════════════════ -->
  <section class="section section--navy" id="about">
    <div class="wrap about">

      <div class="about__photo reveal">
        <div class="frame">
          <picture>
            <source srcset="/assets/sam-sideline-sm.webp 450w, /assets/sam-sideline.webp 900w" type="image/webp" />
            <img src="/assets/sam-sideline.webp"
                 alt="Coach Sam Anderson on the sideline in Homestead lacrosse coaching gear"
                 width="900" height="1350" loading="lazy" />
          </picture>
        </div>
        <span class="tag">Coach Sam</span>
      </div>

      <div class="about__body reveal">
        <span class="eyebrow">A Note From Sam</span>
        <h2>Let's Make This Summer Count</h2>
        <p>
          Hi everyone! I hope the start of your summer has been as relaxing and enjoyable
          as mine. I'm excited to offer private lacrosse lessons again this summer.
        </p>
        <p>
          Whether you're picking up a stick for the first time or fine&#8209;tuning your game for
          the next level, these one&#8209;on&#8209;one sessions are built around <em>your</em> goals —
          stick skills, shooting, dodging, defense, and lacrosse IQ. All ages and skill
          levels are welcome. I look forward to working with you!
        </p>
        <div class="about__creds">
          <div class="c">
            <img class="hs" src="/assets/homestead-logo.webp" alt="Homestead Lacrosse" width="160" height="56" />
            <span class="t"><b>Homestead Lacrosse</b><span>Head Coach</span></span>
          </div>
          <div class="c">
            <img class="rv" src="/assets/revolt-logo.webp" alt="Revolt Lacrosse" width="96" height="30" />
            <span class="t"><b>Revolt Lacrosse</b><span>Director</span></span>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════
       BOOKING
  ═══════════════════════════════════════════════════════ -->
  <section class="section" id="book" style="background: var(--cream)">
    <div class="wrap">

      <div class="section__head center reveal">
        <span class="eyebrow" style="color: var(--blue)">Book Online</span>
        <h2>Reserve Your Lesson</h2>
        <p>Choose a date and time below, or email Sam directly and we'll set it up together.</p>
      </div>

      <div class="booking__pricing reveal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
        <span>Questions about pricing or packages?
          <a href="mailto:sam29anderson@yahoo.com?subject=Lacrosse%20Lesson%20Pricing">Email Sam directly</a>
          — he'll get back to you personally.
        </span>
      </div>

      <div class="cal-shell reveal">
        <div id="cal-target" class="cal-placeholder">
          <div class="pin">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>
          </div>
          <h3>Loading Calendar&hellip;</h3>
          <p>Scroll here to load the booking calendar, or email Sam directly to schedule a session.</p>
          <a class="btn" href="mailto:sam29anderson@yahoo.com?subject=Lacrosse%20Lesson%20Booking">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
            Book by Email
          </a>
        </div>
      </div>

    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════
       CONTACT
  ═══════════════════════════════════════════════════════ -->
  <section class="section section--navy" id="contact">
    <div class="wrap contact-cta reveal">
      <span class="eyebrow">Get In Touch</span>
      <h2>Questions? Pricing?<br />Let's Talk.</h2>
      <p>
        Reach out anytime about scheduling, pricing, or anything else — I read and reply
        to every message personally. The quickest way to get started is a direct email.
      </p>
      <a class="big-mail" href="mailto:sam29anderson@yahoo.com?subject=Lacrosse%20Lesson%20Inquiry">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
        sam29anderson@yahoo.com
      </a>
      <div class="contact-cta__actions">
        <a class="btn btn--lg" href="mailto:sam29anderson@yahoo.com?subject=Lacrosse%20Lesson%20Inquiry">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
          Email Sam
        </a>
        <a class="btn btn--lg btn--ghost" href="#book">View Dates &amp; Book</a>
      </div>
      <div class="contact-cta__info">
        <div class="row">
          <span class="ic">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>
          </span>
          <div><div class="k">Scheduling</div><div class="v">Book online — pick any open time</div></div>
        </div>
        <div class="row">
          <span class="ic">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </span>
          <div><div class="k">Typical Location</div><div class="v">Homestead Soccer Fields, Fort Wayne IN (flexible)</div></div>
        </div>
        <div class="row">
          <span class="ic">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>
          </span>
          <div><div class="k">Pricing</div><div class="v">Contact for pricing &amp; packages</div></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════
       FOOTER
  ═══════════════════════════════════════════════════════ -->
  <footer class="footer">
    <div class="wrap footer__in">
      <div class="marks">
        <img class="hs" src="/assets/homestead-logo.webp" alt="Homestead Lacrosse" width="160" height="46" />
        <span class="divider"></span>
        <img class="rv" src="/assets/revolt-logo.webp" alt="Revolt Lacrosse" width="96" height="26" />
      </div>
      <div style="text-align: right">
        <a href="mailto:sam29anderson@yahoo.com">sam29anderson@yahoo.com</a>
        <small>&copy; 2026 Sam Anderson &middot; Private Lacrosse Lessons. Logos used with permission of Homestead &amp; Revolt Lacrosse.</small>
      </div>
    </div>
  </footer>

  <script>
    // Scroll reveal
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.14 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    // Calendly lazy-load — inject iframe only when booking section is near viewport
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
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify the file renders correctly**

Serve the repo root with a local server and open in browser:

```bash
cd /Users/jaredhaagen/Sites/sam-anderson-lacrosse
npx --yes serve . -p 4000
```

Open `http://localhost:4000` in a browser. Check:
- TopBar: logos, email link, "Book a Lesson" button visible
- Hero: background photo loads, heading visible, CTAs work
- Creds strip: both logos visible
- AboutCoach: stats and focus card render correctly
- About: sideline photo loads, credential cards visible
- Booking: "Loading Calendar…" placeholder shows; scrolling to it triggers Calendly iframe
- Contact: email address shows as a link, info rows render
- Footer: logos and copyright text visible

If fonts haven't loaded yet (FOUC), that's expected until Task 1 is done or the browser caches them.

- [ ] **Step 3: Commit**

```bash
cd /Users/jaredhaagen/Sites/sam-anderson-lacrosse
git add index.html
git commit -m "feat: replace React SPA with static index.html"
```

---

## Task 4: Remove React toolchain and unused image assets

**Files:**
- Delete: `src/`, `dist/`, `node_modules/`, `package.json`, `package-lock.json`, `vite.config.js`
- Delete: `assets/coach.jpg`, `assets/coach-opt.jpg`, `assets/hhs-boys-girls-110.jpg`, `assets/24_HHS_BoysLAX_Ring.png`, `assets/sam-sideline.jpg`

- [ ] **Step 1: Remove the React toolchain**

```bash
cd /Users/jaredhaagen/Sites/sam-anderson-lacrosse
rm -rf src dist node_modules
rm -f package.json package-lock.json vite.config.js
```

- [ ] **Step 2: Remove unused image files**

These files are not referenced in index.html — they're either superseded by webp versions or were never shown on page:

```bash
cd /Users/jaredhaagen/Sites/sam-anderson-lacrosse/assets
rm -f coach.jpg coach-opt.jpg hhs-boys-girls-110.jpg "24_HHS_BoysLAX_Ring.png" sam-sideline.jpg
```

- [ ] **Step 3: Verify assets/ still has everything needed**

```bash
ls /Users/jaredhaagen/Sites/sam-anderson-lacrosse/assets/
ls /Users/jaredhaagen/Sites/sam-anderson-lacrosse/assets/fonts/
```

Expected in `assets/`: `fonts/`, `coach-sm.webp`, `coach.webp`, `homestead-logo.webp`, `og-image.webp`, `revolt-logo.webp`, `sam-sideline-sm.webp`, `sam-sideline.webp`

Expected in `assets/fonts/`: 9 `.woff2` files

- [ ] **Step 4: Verify the site still serves correctly after cleanup**

```bash
cd /Users/jaredhaagen/Sites/sam-anderson-lacrosse
npx --yes serve . -p 4000
```

Open `http://localhost:4000` — all sections should still render correctly, fonts should load from `assets/fonts/`.

- [ ] **Step 5: Commit**

```bash
cd /Users/jaredhaagen/Sites/sam-anderson-lacrosse
git add -A
git commit -m "chore: remove React toolchain and unused image assets"
```

---

## Task 5: Push and verify PageSpeed

- [ ] **Step 1: Pull before pushing (existing pattern for this repo)**

```bash
cd /Users/jaredhaagen/Sites/sam-anderson-lacrosse
git pull --rebase
```

- [ ] **Step 2: Push to trigger Azure deployment**

```bash
git push
```

- [ ] **Step 3: Wait for Azure deployment (~2 min) then run PageSpeed**

Open https://pagespeed.web.dev/ and test `https://fortwaynelacrosselessons.com/`.

Expected: score 90+ on both Mobile and Desktop. Key metrics to check:
- **FCP** < 1.5s (was blocked by JS bundle before)
- **LCP** < 2.5s (hero image now loads immediately)
- **TBT** near 0 (no JS parsing blocking the main thread)

If score is still low, check the Opportunities/Diagnostics panel for the remaining issues and address them.
