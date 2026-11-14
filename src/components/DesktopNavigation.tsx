"use client";

import { useEffect, useRef } from "react";
import { useSectionVisibility } from "@/context/SectionVisibilityContext";
import { DEFAULT_SECTION_ID, NAV_ITEMS } from "@/data/navigation";
import { canScrollWithinSection, isInteractiveTarget } from "./navigationEvents";

export function DesktopNavigation() {
  const { visibleSection, navigateToSection, isTransitioning } = useSectionVisibility();
  const lastWheelTime = useRef(0);
  const activeSection = visibleSection || DEFAULT_SECTION_ID;

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const navigateBy = (direction: number) => {
      const index = NAV_ITEMS.findIndex(item => item.id === activeSection);
      const next = NAV_ITEMS[index + direction];
      if (next) navigateToSection(next.id);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      const arrow = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key);
      const editing = event.target instanceof Element && Boolean(event.target.closest(
        "input, textarea, select, [contenteditable]:not([contenteditable='false']), dialog[open]"
      ));
      if (!desktop.matches || event.defaultPrevented || event.altKey || event.ctrlKey ||
        event.metaKey || isTransitioning || editing || document.querySelector("dialog[open]") ||
        (!arrow && isInteractiveTarget(event.target))) return;
      const direction = ["ArrowDown", "ArrowRight", "PageDown", " "].includes(event.key)
        ? (event.shiftKey && event.key === " " ? -1 : 1)
        : ["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key) ? -1 : 0;
      if (direction && !canScrollWithinSection(event.target, direction)) {
        event.preventDefault();
        navigateBy(direction);
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        navigateToSection(event.key === "Home" ? DEFAULT_SECTION_ID : NAV_ITEMS[NAV_ITEMS.length - 1].id);
      }
    };
    const handleWheel = (event: WheelEvent) => {
      if (!desktop.matches || event.defaultPrevented || event.ctrlKey ||
        document.querySelector("dialog[open]") ||
        Math.abs(event.deltaY) < 10 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const now = Date.now();
      const quietTime = now - lastWheelTime.current;
      lastWheelTime.current = now;
      if (canScrollWithinSection(event.target, event.deltaY)) return;
      event.preventDefault();
      // Continuous trackpad momentum belongs to the same gesture, even after the transition ends.
      if (isTransitioning || quietTime < 180) return;
      navigateBy(event.deltaY > 0 ? 1 : -1);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [activeSection, isTransitioning, navigateToSection]);

  return (
    <aside className="desktop-rail">
      <a className="wordmark" href="#home" aria-label="Zak Raicik, home" onClick={event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault(); navigateToSection("home");
      }}>zak<span>.</span></a>
      <nav aria-label="Main navigation" className="desktop-nav">
        {NAV_ITEMS.map((item, index) => (
          <a key={item.id} href={item.href} aria-current={activeSection === item.id ? "page" : undefined}
            onClick={event => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault(); navigateToSection(item.id);
            }}>
            <span className="nav-number" aria-hidden="true">0{index + 1}</span>
            <span>{item.name}</span><span className="nav-indicator" aria-hidden="true" />
          </a>
        ))}
      </nav>
      <div className="rail-note"><span className="status-dot" />Building at Evoke<span className="rail-caption">San Diego, CA</span><span className="nav-hint" aria-hidden="true"><kbd>↑</kbd><kbd>↓</kbd> to explore</span></div>
    </aside>
  );
}
