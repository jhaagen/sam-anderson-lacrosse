import { COACH, HomesteadMark, RevoltMark } from '../data.jsx';

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
