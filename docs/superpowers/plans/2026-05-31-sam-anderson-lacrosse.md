# Sam Anderson Lacrosse Lessons — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the completed prototype from `~/Downloads/sam anderson/` into a production Vite + React project at `~/Sites/sam-anderson-lacrosse/`, then push to a new GitHub repo.

**Architecture:** Single-page static React app. All content is in `src/data.js`. Components map 1:1 to the prototype JSX files. No routing, no backend. Styles ported unchanged from the prototype's `styles.css`.

**Tech Stack:** React 18, Vite 6, `@vitejs/plugin-react`. Azure Static Web Apps hosting. Google Fonts + Calendly via CDN in `index.html`.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `package.json` | Create | Vite + React deps |
| `vite.config.js` | Create | Plugin config |
| `index.html` | Create | Root HTML, CDN fonts/Calendly |
| `staticwebapp.config.json` | Create | Azure SPA routing |
| `src/main.jsx` | Create | ReactDOM entry point |
| `src/App.jsx` | Create | Root component, assembles sections |
| `src/styles.css` | Create | Full brand CSS (direct port) |
| `src/data.js` | Create | COACH, DATES, Icon, logo helpers, useReveal |
| `src/components/TopBar.jsx` | Create | Sticky nav bar |
| `src/components/Hero.jsx` | Create | Stadium hero (only variant) |
| `src/components/Creds.jsx` | Create | Credential strip below hero |
| `src/components/AboutCoach.jsx` | Create | Coach bio + focus areas card |
| `src/components/About.jsx` | Create | Personal note, dark navy section |
| `src/components/Booking.jsx` | Create | Calendly embed or placeholder |
| `src/components/Contact.jsx` | Create | Email CTA, info rows |
| `src/components/Footer.jsx` | Create | Logo lockup + copyright |
| `public/assets/` | Copy | coach.jpg, homestead-logo.png, revolt-logo.webp, uploads/ |

---

## Task 1: Scaffold project

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `staticwebapp.config.json`
- Create: `src/` (directory structure)

Working directory for all tasks: `~/Sites/sam-anderson-lacrosse`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "sam-anderson-lacrosse",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.3.5"
  }
}
```

- [ ] **Step 2: Create vite.config.js**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

- [ ] **Step 3: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sam Anderson · Private Lacrosse Lessons</title>
  <meta name="description" content="Private summer lacrosse lessons with Coach Sam Anderson — head coach of Homestead Lacrosse and director of Revolt Lacrosse. Youth through high-school boys, all skill levels." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@400;500;600;700&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
  <script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

- [ ] **Step 4: Create staticwebapp.config.json**

```json
{
  "routes": [
    { "route": "/*", "serve": "/index.html", "statusCode": 200 }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
```

- [ ] **Step 5: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 6: Commit scaffold**

```bash
git add package.json vite.config.js index.html staticwebapp.config.json package-lock.json
git commit -m "scaffold: Vite + React project"
```

---

## Task 2: Copy assets to public/

**Files:**
- Create: `public/assets/` (directory)
- Copy from `~/Downloads/sam anderson/assets/` and `~/Downloads/sam anderson/uploads/`

- [ ] **Step 1: Create public/assets and copy images**

```bash
mkdir -p public/assets
cp ~/Downloads/sam\ anderson/assets/coach.jpg public/assets/
cp ~/Downloads/sam\ anderson/assets/homestead-logo.png public/assets/
cp ~/Downloads/sam\ anderson/assets/revolt-logo.webp public/assets/
cp ~/Downloads/sam\ anderson/uploads/24_HHS_BoysLAX_Ring.png public/assets/
cp ~/Downloads/sam\ anderson/uploads/hhs-boys-girls-110.jpg public/assets/
cp ~/Downloads/sam\ anderson/uploads/logo+Header+good+1.webp public/assets/
```

- [ ] **Step 2: Verify files are present**

```bash
ls public/assets/
```

Expected: `coach.jpg  homestead-logo.png  revolt-logo.webp` plus the upload files.

- [ ] **Step 3: Commit assets**

```bash
git add public/
git commit -m "add: static assets to public/assets"
```

---

## Task 3: Create src/styles.css

**Files:**
- Create: `src/styles.css`

Port `styles.css` from the prototype unchanged. The only conceptual change: in Vite the file is imported by `main.jsx` rather than linked in HTML, but the content is identical.

- [ ] **Step 1: Create src/ directory and copy styles**

```bash
mkdir -p src/components
cp ~/Downloads/sam\ anderson/styles.css src/styles.css
```

- [ ] **Step 2: Verify copy**

```bash
wc -l src/styles.css
```

Expected: 430 lines (the full file).

- [ ] **Step 3: Commit**

```bash
git add src/styles.css
git commit -m "add: brand CSS (port from prototype)"
```

---

## Task 4: Create src/data.js

**Files:**
- Create: `src/data.js`

Converts the prototype's `window`-global approach to named ES module exports. Asset paths changed from relative (`assets/foo.png`) to absolute (`/assets/foo.png`) so Vite's public directory serves them correctly.

- [ ] **Step 1: Create src/data.js**

```js
import React from 'react';

export const COACH = {
  name: "Sam Anderson",
  email: "sam29anderson@yahoo.com",
  location: "Homestead Soccer Fields",
  calendlyUrl: "",
};

export const DATES = [
  { mon: "June", num: "8–10",  dow: "Mon–Wed" },
  { mon: "June", num: "17–19", dow: "Wed–Fri" },
  { mon: "June", num: "25–26", dow: "Thu–Fri" },
  { mon: "July", num: "6–10",  dow: "Mon–Fri" },
  { mon: "July", num: "17",    dow: "Friday"  },
  { mon: "July", num: "27–31", dow: "Mon–Fri" },
];

export function Icon({ name, size = 20, stroke = 2 }) {
  const p = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round",
  };
  const paths = {
    clock:   <React.Fragment><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></React.Fragment>,
    pin:     <React.Fragment><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></React.Fragment>,
    mail:    <React.Fragment><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></React.Fragment>,
    cal:     <React.Fragment><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></React.Fragment>,
    arrow:   <path d="M5 12h14M13 6l6 6-6 6"/>,
    check:   <path d="m4 12 5 5L20 6"/>,
    user:    <React.Fragment><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></React.Fragment>,
    target:  <React.Fragment><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></React.Fragment>,
    bolt:    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>,
    whistle: <React.Fragment><path d="M3 13a5 5 0 1 0 5-5h9l4 2-1 3h-6"/><circle cx="8" cy="13" r="1.5"/></React.Fragment>,
    shield:  <path d="M12 3l7 3v6c0 4-3 7-7 8-4-1-7-4-7-8V6l7-3z"/>,
    eye:     <React.Fragment><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></React.Fragment>,
  };
  return <svg {...p} aria-hidden="true">{paths[name]}</svg>;
}

export function HomesteadMark({ className = "" }) {
  return <img className={className} src="/assets/homestead-logo.png" alt="Homestead Lacrosse" />;
}

export function RevoltMark({ className = "" }) {
  return <img className={className} src="/assets/revolt-logo.webp" alt="Revolt Lacrosse" />;
}

export function useReveal() {
  React.useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(e => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.14 });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data.js
git commit -m "add: data.js — COACH, DATES, Icon, logos, useReveal"
```

---

## Task 5: Create TopBar component

**Files:**
- Create: `src/components/TopBar.jsx`

- [ ] **Step 1: Create src/components/TopBar.jsx**

```jsx
import { COACH, HomesteadMark, RevoltMark, Icon } from '../data.js';

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="wrap topbar__in">
        <div className="marks">
          <HomesteadMark />
          <span className="divider"></span>
          <RevoltMark className="revolt" />
        </div>
        <span className="topbar__name">{COACH.name} · Lacrosse Lessons</span>
        <span className="spacer"></span>
        <a className="topbar__mail" href={"mailto:" + COACH.email}>
          <Icon name="mail" size={18} /> {COACH.email}
        </a>
        <a className="btn" href="#book">Book a Lesson</a>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TopBar.jsx
git commit -m "add: TopBar component"
```

---

## Task 6: Create Hero component

**Files:**
- Create: `src/components/Hero.jsx`

Stadium variant only — split and crest variants from the prototype are not included.

- [ ] **Step 1: Create src/components/Hero.jsx**

```jsx
import { COACH, Icon } from '../data.js';

function HeroKicker() {
  return (
    <span className="hero__kicker eyebrow">
      <span className="dot"></span> Summer 2026 · Private Lessons
    </span>
  );
}

function HeroMeta() {
  return (
    <div className="hero__meta">
      <div className="mi"><span className="k">Who</span><span className="v">Youth – High School Boys</span></div>
      <div className="mi"><span className="k">Format</span><span className="v">1‑on‑1 &amp; Small Group</span></div>
      <div className="mi"><span className="k">Where</span><span className="v">{COACH.location}</span></div>
    </div>
  );
}

function HeroCTA() {
  return (
    <div className="hero__cta">
      <a className="btn btn--lg" href="#book">
        Book a Lesson <span className="arrow"><Icon name="arrow" size={18} /></span>
      </a>
      <a className="btn btn--lg btn--ghost" href={"mailto:" + COACH.email}>Email Sam</a>
    </div>
  );
}

export default function Hero() {
  return (
    <header className="hero hero--stadium">
      <div className="hero__bg">
        <img src="/assets/coach.jpg" alt="Coach Sam Anderson directing a session" />
      </div>
      <div className="hero__scrim"></div>
      <div className="hero__field"></div>
      <div className="hero__in">
        <div className="wrap">
          <div className="hero__col">
            <HeroKicker />
            <h1>Private<br /><em>Lacrosse</em><br />Lessons</h1>
            <p className="hero__lead">
              Summer one‑on‑one training with Coach Sam Anderson — for youth through
              high‑school boys of every skill level. Sharpen your stick skills, IQ, and
              confidence with the head coach of Homestead Lacrosse.
            </p>
            <HeroCTA />
            <HeroMeta />
          </div>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.jsx
git commit -m "add: Hero component (stadium variant)"
```

---

## Task 7: Create Creds and AboutCoach components

**Files:**
- Create: `src/components/Creds.jsx`
- Create: `src/components/AboutCoach.jsx`

- [ ] **Step 1: Create src/components/Creds.jsx**

```jsx
import { HomesteadMark, RevoltMark } from '../data.js';

export default function Creds() {
  return (
    <section className="creds">
      <div className="wrap creds__in">
        <span className="label">Coached by</span>
        <div className="org">
          <HomesteadMark className="hs" />
          <span className="role"><b>Homestead Lacrosse</b><span>Head Coach</span></span>
        </div>
        <div className="vr"></div>
        <div className="org">
          <RevoltMark className="rv" />
          <span className="role"><b>Revolt Lacrosse</b><span>Director</span></span>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create src/components/AboutCoach.jsx**

```jsx
import { Icon } from '../data.js';

const FOCUS = [
  { ic: "bolt",   t: "Stick Skills & Wall Ball", d: "Cleaner catches, both hands, faster release." },
  { ic: "target", t: "Shooting & Dodging",        d: "Finish on the run and beat your defender 1v1." },
  { ic: "shield", t: "Defense & Footwork",         d: "Approaches, breakdowns, and on-ball pressure." },
  { ic: "eye",    t: "Lacrosse IQ & Vision",       d: "See the field, make the next read, play faster." },
];

export default function AboutCoach() {
  return (
    <section className="section" id="about-coach" style={{ background: "var(--cream)" }}>
      <div className="wrap aboutc">
        <div className="aboutc__intro reveal">
          <span className="eyebrow" style={{ color: "var(--blue)" }}>About Coach Sam</span>
          <h2>Coaching With A Plan</h2>
          <p>
            Sam has spent nearly a decade around the game — a four‑year collegiate midfielder
            turned full‑time coach. Today he's Head Coach of Homestead Lacrosse and Director of
            Revolt Lacrosse, where his teams are built on fundamentals, competitiveness, and
            players who steadily get better.
          </p>
          <p>
            Every private session is tailored to one athlete and one set of goals. We start
            with an honest look at where you are, build a simple plan, and put in focused reps —
            whether you're brand new to the sport or chasing a varsity spot.
          </p>
          <div className="aboutc__stats">
            <div className="stat"><span className="n">8+</span><span className="l">Years Coaching</span></div>
            <div className="stat"><span className="n">100+</span><span className="l">Athletes Coached</span></div>
            <div className="stat"><span className="n">4</span><span className="l">Yrs College Player</span></div>
          </div>
        </div>

        <div className="focuscard reveal">
          <h3>What We'll Work On</h3>
          <div className="focuslist">
            {FOCUS.map((f, i) => (
              <div className="focusrow" key={i}>
                <span className="ic"><Icon name={f.ic} size={20} /></span>
                <span className="t"><b>{f.t}</b><span>{f.d}</span></span>
              </div>
            ))}
          </div>
          <a className="btn btn--blue" href="#book" style={{ marginTop: 26 }}>
            See Open Times <span className="arrow"><Icon name="arrow" size={16} /></span>
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Creds.jsx src/components/AboutCoach.jsx
git commit -m "add: Creds and AboutCoach components"
```

---

## Task 8: Create About component

**Files:**
- Create: `src/components/About.jsx`

- [ ] **Step 1: Create src/components/About.jsx**

```jsx
import { HomesteadMark, RevoltMark } from '../data.js';

export default function About() {
  return (
    <section className="section section--navy" id="about">
      <div className="wrap about">
        <div className="about__photo reveal">
          <div className="frame">
            <img src="/assets/coach.jpg" alt="Coach Sam Anderson" />
          </div>
          <span className="tag">Coach Sam</span>
        </div>
        <div className="about__body reveal">
          <span className="eyebrow">A Note From Sam</span>
          <h2>Let's Make This Summer Count</h2>
          <p>
            Hi everyone! I hope the start of your summer has been as relaxing and enjoyable
            as mine. I'm excited to offer private lacrosse lessons again this summer.
          </p>
          <p>
            Whether you're picking up a stick for the first time or fine‑tuning your game for
            the next level, these one‑on‑one sessions are built around <em>your</em> goals —
            stick skills, shooting, dodging, defense, and lacrosse IQ. All ages and skill
            levels are welcome. I look forward to working with you!
          </p>
          <div className="about__creds">
            <div className="c">
              <HomesteadMark className="hs" />
              <span className="t"><b>Homestead Lacrosse</b><span>Head Coach</span></span>
            </div>
            <div className="c">
              <RevoltMark className="rv" />
              <span className="t"><b>Revolt Lacrosse</b><span>Director</span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/About.jsx
git commit -m "add: About component"
```

---

## Task 9: Create Booking component

**Files:**
- Create: `src/components/Booking.jsx`

- [ ] **Step 1: Create src/components/Booking.jsx**

```jsx
import { useRef, useEffect } from 'react';
import { COACH, Icon } from '../data.js';

export default function Booking() {
  const ref = useRef(null);
  const url = COACH.calendlyUrl;

  useEffect(() => {
    if (!url || !ref.current) return;
    function init() {
      if (window.Calendly && ref.current) {
        ref.current.innerHTML = "";
        window.Calendly.initInlineWidget({ url, parentElement: ref.current });
      }
    }
    if (window.Calendly) {
      init();
    } else {
      const t = setInterval(() => {
        if (window.Calendly) { clearInterval(t); init(); }
      }, 250);
      return () => clearInterval(t);
    }
  }, [url]);

  return (
    <section className="section" id="book" style={{ background: "var(--cream)" }}>
      <div className="wrap">
        <div className="section__head center reveal">
          <span className="eyebrow" style={{ color: "var(--blue)" }}>Book Online</span>
          <h2>Reserve Your Lesson</h2>
          <p>Choose a date and time below, or email Sam directly and we'll set it up together.</p>
        </div>
        <div className="cal-shell reveal">
          {url ? (
            <div className="cal-embed" ref={ref}></div>
          ) : (
            <div className="cal-placeholder">
              <div className="pin"><Icon name="cal" size={28} /></div>
              <h3>Online Scheduler Coming Soon</h3>
              <p>
                Sam's Calendly booking calendar will appear right here. In the meantime,
                the fastest way to reserve a session is to email him directly.
              </p>
              <a className="btn" href={"mailto:" + COACH.email + "?subject=Lacrosse%20Lesson%20Booking"}>
                <Icon name="mail" size={18} /> Book by Email
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Booking.jsx
git commit -m "add: Booking component with Calendly placeholder"
```

---

## Task 10: Create Contact and Footer components

**Files:**
- Create: `src/components/Contact.jsx`
- Create: `src/components/Footer.jsx`

- [ ] **Step 1: Create src/components/Contact.jsx**

```jsx
import { COACH, Icon } from '../data.js';

export default function Contact() {
  return (
    <section className="section section--navy" id="contact">
      <div className="wrap contact-cta reveal">
        <span className="eyebrow">Get In Touch</span>
        <h2>Questions? Pricing?<br />Let's Talk.</h2>
        <p>
          Reach out anytime about scheduling, pricing, or anything else — I read and reply
          to every message personally. The quickest way to get started is a direct email.
        </p>
        <a className="big-mail" href={"mailto:" + COACH.email + "?subject=Lacrosse%20Lesson%20Inquiry"}>
          <Icon name="mail" size={26} /> {COACH.email}
        </a>
        <div className="contact-cta__actions">
          <a className="btn btn--lg" href={"mailto:" + COACH.email + "?subject=Lacrosse%20Lesson%20Inquiry"}>
            <Icon name="mail" size={18} /> Email Sam
          </a>
          <a className="btn btn--lg btn--ghost" href="#book">View Dates &amp; Book</a>
        </div>
        <div className="contact-cta__info">
          <div className="row">
            <span className="ic"><Icon name="cal" /></span>
            <div><div className="k">Scheduling</div><div className="v">Book online — pick any open time</div></div>
          </div>
          <div className="row">
            <span className="ic"><Icon name="pin" /></span>
            <div><div className="k">Typical Location</div><div className="v">{COACH.location} (flexible)</div></div>
          </div>
          <div className="row">
            <span className="ic"><Icon name="target" /></span>
            <div><div className="k">Pricing</div><div className="v">Contact for pricing &amp; packages</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create src/components/Footer.jsx**

```jsx
import { COACH, HomesteadMark, RevoltMark } from '../data.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__in">
        <div className="marks">
          <HomesteadMark className="hs" />
          <span className="divider"></span>
          <RevoltMark className="rv" />
        </div>
        <div style={{ textAlign: "right" }}>
          <a href={"mailto:" + COACH.email}>{COACH.email}</a>
          <small>© 2026 {COACH.name} · Private Lacrosse Lessons. Logos used with permission of Homestead &amp; Revolt Lacrosse.</small>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Contact.jsx src/components/Footer.jsx
git commit -m "add: Contact and Footer components"
```

---

## Task 11: Wire App.jsx and main.jsx, verify in browser

**Files:**
- Create: `src/App.jsx`
- Create: `src/main.jsx`

- [ ] **Step 1: Create src/App.jsx**

```jsx
import { useReveal } from './data.js';
import TopBar from './components/TopBar.jsx';
import Hero from './components/Hero.jsx';
import Creds from './components/Creds.jsx';
import AboutCoach from './components/AboutCoach.jsx';
import About from './components/About.jsx';
import Booking from './components/Booking.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

const rootStyle = {
  "--accent": "#F2C230",
  "--accent-deep": "color-mix(in srgb, #F2C230 70%, #000)",
};

export default function App() {
  useReveal();
  return (
    <div data-lead="blend" style={rootStyle}>
      <TopBar />
      <Hero />
      <Creds />
      <AboutCoach />
      <About />
      <Booking />
      <Contact />
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Create src/main.jsx**

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 3: Start dev server and verify**

```bash
npm run dev
```

Open `http://localhost:5173` in a browser. Verify:
- TopBar sticks to top with both logos
- Hero photo fills the background with text overlay
- Creds strip shows Homestead + Revolt logos
- AboutCoach shows bio text + focus areas card
- About shows photo + Sam's note on navy background
- Booking shows the placeholder (since `calendlyUrl` is empty)
- Contact shows email CTA on navy background
- Footer renders with logos + copyright
- Scroll-reveal animations fire as sections enter viewport

- [ ] **Step 4: Stop dev server (Ctrl+C), then commit**

```bash
git add src/App.jsx src/main.jsx
git commit -m "add: App.jsx and main.jsx — site wired and verified"
```

---

## Task 12: Create GitHub repo and push

- [ ] **Step 1: Create GitHub repo**

```bash
gh repo create sam-anderson-lacrosse --public --description "Private lacrosse lessons site for Coach Sam Anderson" --source=. --remote=origin
```

If `gh` is not authenticated, run `gh auth login` first.

Expected output: repo URL printed, remote `origin` added.

- [ ] **Step 2: Pull remote (establish tracking) then push**

```bash
git pull --rebase origin main --allow-unrelated-histories
git push -u origin main
```

- [ ] **Step 3: Verify on GitHub**

```bash
gh repo view sam-anderson-lacrosse --web
```

Expected: browser opens the repo with all commits visible.

---

## Post-implementation checklist

- [ ] Run `npm run build` and confirm `dist/` generates without errors
- [ ] Let Jared know the repo URL so he can connect it to Azure Static Web Apps via the portal
- [ ] When Sam provides a Calendly URL, paste it into `COACH.calendlyUrl` in `src/data.js` and push — the booking widget will activate automatically
