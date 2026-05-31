import React from 'react';

export const COACH = {
  name: "Sam Anderson",
  email: "sam29anderson@yahoo.com",
  location: "Homestead Soccer Fields",
  calendlyUrl: "",
};

export const DATES = [
  { mon: "June", num: "8–10",  dow: "Mon–Wed" },
  { mon: "June", num: "17–19", dow: "Wed–Fri" },
  { mon: "June", num: "25–26", dow: "Thu–Fri" },
  { mon: "July", num: "6–10",  dow: "Mon–Fri" },
  { mon: "July", num: "17",    dow: "Friday"  },
  { mon: "July", num: "27–31", dow: "Mon–Fri" },
];

export function Icon({ name, size = 20, stroke = 2 }) {
  const p = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round",
  };
  const paths = {
    clock:   <React.Fragment><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></React.Fragment>,
    pin:     <React.Fragment><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></React.Fragment>,
    mail:    <React.Fragment><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></React.Fragment>,
    cal:     <React.Fragment><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></React.Fragment>,
    arrow:   <path d="M5 12h14M13 6l6 6-6 6"/>,
    check:   <path d="m4 12 5 5L20 6"/>,
    user:    <React.Fragment><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></React.Fragment>,
    target:  <React.Fragment><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></React.Fragment>,
    bolt:    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>,
    whistle: <React.Fragment><path d="M3 13a5 5 0 1 0 5-5h9l4 2-1 3h-6"/><circle cx="8" cy="13" r="1.5"/></React.Fragment>,
    shield:  <path d="M12 3l7 3v6c0 4-3 7-7 8-4-1-7-4-7-8V6l7-3z"/>,
    eye:     <React.Fragment><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></React.Fragment>,
  };
  return <svg {...p} aria-hidden="true">{paths[name]}</svg>;
}

export function HomesteadMark({ className = "" }) {
  return <img className={className} src="/assets/homestead-logo.png" alt="Homestead Lacrosse" />;
}

export function RevoltMark({ className = "" }) {
  return <img className={className} src="/assets/revolt-logo.webp" alt="Revolt Lacrosse" />;
}

export function useReveal() {
  React.useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(e => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.14 });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  });
}
