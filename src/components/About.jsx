import { HomesteadMark, RevoltMark } from '../data.jsx';

export default function About() {
  return (
    <section className="section section--navy" id="about">
      <div className="wrap about">
        <div className="about__photo reveal">
          <div className="frame">
            <picture>
              <source srcSet="/assets/coach.webp" type="image/webp" />
              <img src="/assets/coach-opt.jpg" alt="Coach Sam Anderson"
                   width="1800" height="2700" loading="lazy" />
            </picture>
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
