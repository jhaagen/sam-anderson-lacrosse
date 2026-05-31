import { HomesteadMark, RevoltMark } from '../data.jsx';

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
