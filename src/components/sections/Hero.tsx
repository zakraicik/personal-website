"use client";

import { HiArrowUpRight, HiCommandLine, HiCpuChip, HiBolt } from "react-icons/hi2";
import { useSectionVisibility } from "@/context/SectionVisibilityContext";
import { profile } from "@/data/profile";
import { contactMethods } from "@/data/contact";

export function Hero() {
  const { navigateToSection } = useSectionVisibility();
  return (
    <div className="hero section-body">
      <div className="hero-main">
        <p className="eyebrow"><span className="status-dot" />{profile.name} / {profile.role}</p>
        <h1 id="home-heading">Always curious.<br /><span className="accent-text">Always building<span className="violet-text">.</span></span></h1>
        <p className="hero-description">{profile.introduction}</p>
        <div className="hero-actions">
          <a className="primary-button" href="#timeline" onClick={event => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault(); navigateToSection("timeline");
          }}>Explore my experience <HiArrowUpRight aria-hidden="true" /></a>
          <a className="text-link" href={contactMethods.find(method => method.label === "Email")?.link}>Say hello <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="signal-visual" aria-hidden="true">
        <div className="signal-topline"><span className="signal-sticker">HOW I’M WIRED</span><span className="mono">WORK / PLAY</span></div>
        <div className="signal-stage"><div className="signal-stage-icon"><HiCommandLine /></div><div><span className="signal-stage-label">THE START</span><strong>Follow the question.</strong><p>Across industries and disciplines</p></div></div>
        <div className="signal-connector"><span />↓<span /></div>
        <div className="signal-stage model-stage"><div className="signal-stage-icon"><HiCpuChip /></div><div><span className="signal-stage-label">THE CRAFT</span><strong>Make something useful.</strong><p>Machine learning, from idea to production</p></div></div>
        <div className="signal-connector"><span />↓<span /></div>
        <div className="signal-stage detection-stage"><div className="signal-stage-icon"><HiBolt /></div><div><span className="signal-stage-label">THE PEOPLE</span><strong>Lead. Build. Keep learning.</strong><p>Teams, code, and hard problems</p></div></div>
        <div className="signal-caption"><span className="status-dot" />A generalist’s curiosity. An engineer’s follow-through.</div>
      </div>
      <div className="hero-focus">{profile.focus.map(focus => <span key={focus}><span className="focus-cross" aria-hidden="true">+</span>{focus}</span>)}</div>
    </div>
  );
}
