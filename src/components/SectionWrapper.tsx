"use client";

import { ReactNode } from "react";
import { useSectionVisibility } from "@/context/SectionVisibilityContext";
import { DEFAULT_SECTION_ID, SECTION_IDS } from "@/data/navigation";

export function SectionWrapper({ id, children }: { id: string; children: ReactNode }) {
  const { visibleSection } = useSectionVisibility();
  const currentSection = visibleSection && SECTION_IDS.includes(visibleSection)
    ? visibleSection : DEFAULT_SECTION_ID;
  const isVisible = currentSection === id;
  const offset = SECTION_IDS.indexOf(id) - SECTION_IDS.indexOf(currentSection);

  return (
    <section id={id} aria-labelledby={`${id}-heading`} aria-hidden={!isVisible}
      inert={!isVisible} tabIndex={-1} data-section-scroll
      className={`site-section ${isVisible ? "is-active" : ""}`}
      style={{ transform: `translateY(${Math.sign(offset) * 12}px)` }}>
      <div className="section-content">{children}</div>
    </section>
  );
}
