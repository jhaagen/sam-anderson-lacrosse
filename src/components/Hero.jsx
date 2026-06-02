import { COACH, Icon } from '../data.jsx';

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
      <div className="mi"><span className="k">Who</span><span className="v">Youth–College Players</span></div>
      <div className="mi"><span className="k">Format</span><span className="v">1‑on‑1 &amp; Small Group</span></div>
      <div className="mi"><span className="k">Where</span><span className="v">{COACH.location}</span></div>
      <div className="mi">
        <span className="k">Pricing</span>
        <a className="v hero__pricing-link" href={"mailto:" + COACH.email + "?subject=Lacrosse%20Lesson%20Pricing"}>
          Contact for pricing
        </a>
      </div>
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
        <picture>
          <source srcSet="/assets/coach-sm.webp 900w, /assets/coach.webp 1800w" type="image/webp" />
          <img src="/assets/coach-opt.jpg" alt="Coach Sam Anderson directing a session"
               width="1800" height="2700" fetchpriority="high" />
        </picture>
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
