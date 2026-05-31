import { COACH, Icon } from '../data.jsx';

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
