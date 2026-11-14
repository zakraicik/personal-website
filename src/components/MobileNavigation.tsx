"use client";

import { useEffect, useRef, useState } from "react";
import { HiBars3BottomRight, HiXMark, HiArrowUpRight } from "react-icons/hi2";
import { useSectionVisibility } from "@/context/SectionVisibilityContext";
import { NAV_ITEMS } from "@/data/navigation";
import { canScrollWithinSection, isInteractiveTarget } from "./navigationEvents";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const { visibleSection, navigateToSection, isTransitioning } = useSectionVisibility();

  useEffect(() => {
    const panel = dialog.current;
    if (!panel) return;
    if (isOpen) panel.showModal();
    else if (panel.open) panel.close();
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => { if (desktop.matches) setIsOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) return;
    let start: { x: number; y: number; scrollable: boolean } | null = null;
    const handleStart = (event: TouchEvent) => {
      start = null;
      if (window.matchMedia("(min-width: 768px)").matches || event.touches.length !== 1 ||
        document.querySelector("dialog[open]") ||
        isInteractiveTarget(event.target)) return;
      start = {
        x: event.touches[0].clientX, y: event.touches[0].clientY,
        scrollable: canScrollWithinSection(event.target, 1) || canScrollWithinSection(event.target, -1),
      };
    };
    const handleEnd = (event: TouchEvent) => {
      const gesture = start;
      start = null;
      if (!gesture || isTransitioning || !event.changedTouches.length) return;
      const dy = gesture.y - event.changedTouches[0].clientY;
      const dx = Math.abs(gesture.x - event.changedTouches[0].clientX);
      if (gesture.scrollable || Math.abs(dy) < 70 || dx > Math.abs(dy) / 2) return;
      const index = NAV_ITEMS.findIndex(item => item.id === visibleSection);
      const next = NAV_ITEMS[index + (dy > 0 ? 1 : -1)];
      if (next) navigateToSection(next.id);
    };
    document.addEventListener("touchstart", handleStart, { passive: true });
    document.addEventListener("touchend", handleEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", handleStart);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isOpen, isTransitioning, visibleSection, navigateToSection]);

  return (
    <header className="mobile-header">
      <a href="#home" className="wordmark" aria-label="Zak Raicik, home" onClick={event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault(); navigateToSection("home");
      }}>zak<span>.</span></a>
      <span className="mobile-section-name">{NAV_ITEMS.find(item => item.id === visibleSection)?.name}</span>
      <button className="icon-button" aria-label="Open navigation" aria-expanded={isOpen}
        aria-controls="mobile-navigation" onClick={() => setIsOpen(true)}><HiBars3BottomRight /></button>
      <dialog ref={dialog} id="mobile-navigation" className="mobile-dialog"
        aria-labelledby="navigation-heading" onCancel={() => setIsOpen(false)}
        onClose={() => setIsOpen(false)} onClick={event => { if (event.target === event.currentTarget) setIsOpen(false); }}>
        <div className="mobile-panel">
          <div className="mobile-panel-header"><h2 id="navigation-heading">Explore</h2>
            <button className="icon-button" aria-label="Close navigation" onClick={() => setIsOpen(false)}><HiXMark /></button>
          </div>
          <nav aria-label="Mobile navigation">
            {NAV_ITEMS.map((item, index) => (
              <a key={item.id} href={item.href} aria-current={visibleSection === item.id ? "page" : undefined}
                onClick={event => { event.preventDefault(); navigateToSection(item.id); setIsOpen(false); }}>
                <span className="nav-number">0{index + 1}</span>{item.name}<HiArrowUpRight aria-hidden="true" />
              </a>
            ))}
          </nav>
          <p>Always curious. Always building.</p>
        </div>
      </dialog>
    </header>
  );
}
