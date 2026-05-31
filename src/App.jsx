import { useReveal } from './data.jsx';
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
