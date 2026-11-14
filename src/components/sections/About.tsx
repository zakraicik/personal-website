"use client";

import { useState } from "react";
import { profile } from "@/data/profile";

const topics = ["Right now", "How I work", "Before Evoke", "Off the clock"];

export function About() {
  const [topic, setTopic] = useState(0);
  return (
    <div className="section-body bounded-section about-body">
      <div className="section-heading"><p className="eyebrow">01 / Behind the models</p><h2 id="about-heading">Builder. Leader.<br /><span className="accent-text">Still learning.</span></h2></div>
      <div className="about-layout">
        <div className="about-main">
          <div className="about-topics" role="group" aria-label="About topics">{topics.map((label, index) => <button key={label} aria-pressed={topic === index} onClick={() => setTopic(index)}>{label}</button>)}</div>

          <div className="about-copy" aria-live="polite" aria-atomic="true">{profile.about.map((paragraph, index) =>
            <p key={paragraph} className={topic === index ? "is-visible" : ""} aria-hidden={topic !== index}>{paragraph}</p>
          )}</div>
          <div className="location-note"><span className="status-dot" />{profile.location}</div>
        </div>
        <div className="about-aside" aria-hidden="true"><span className="eyebrow">How I work</span><ol><li><span>01</span>Understand the problem.</li><li><span>02</span>Find the signal.</li><li><span>03</span>Build, learn, improve.</li></ol><span className="about-signoff">Stay curious. Get your hands dirty.</span></div>
      </div>
    </div>
  );
}
