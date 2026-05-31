import { Icon } from '../data.jsx';

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
