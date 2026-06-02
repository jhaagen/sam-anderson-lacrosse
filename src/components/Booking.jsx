import { COACH, Icon } from '../data.jsx';

export default function Booking() {
  const url = COACH.bookingUrl;

  return (
    <section className="section" id="book" style={{ background: "var(--cream)" }}>
      <div className="wrap">
        <div className="section__head center reveal">
          <span className="eyebrow" style={{ color: "var(--blue)" }}>Book Online</span>
          <h2>Reserve Your Lesson</h2>
          <p>Choose a date and time below, or email Sam directly and we'll set it up together.</p>
        </div>
        <div className="booking__pricing reveal">
          <Icon name="mail" size={18} />
          <span>Questions about pricing or packages? <a href={"mailto:" + COACH.email + "?subject=Lacrosse%20Lesson%20Pricing"}>Email Sam directly</a> — he'll get back to you personally.</span>
        </div>

        <div className="cal-shell reveal">
          {url ? (
            <iframe
              src={url + "?embed_type=Inline&hide_event_type_details=1&hide_gdpr_banner=1"}
              className="cal-embed"
              title="Book a Lacrosse Lesson"
              loading="lazy"
              style={{ width: "100%", height: "700px", border: "none" }}
            />
          ) : (
            <div className="cal-placeholder">
              <div className="pin"><Icon name="cal" size={28} /></div>
              <h3>Online Scheduler Coming Soon</h3>
              <p>
                The booking calendar will appear right here. In the meantime,
                the fastest way to reserve a session is to email Sam directly.
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
