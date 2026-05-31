import { useRef, useEffect } from 'react';
import { COACH, Icon } from '../data.jsx';

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
