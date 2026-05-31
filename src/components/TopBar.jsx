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
