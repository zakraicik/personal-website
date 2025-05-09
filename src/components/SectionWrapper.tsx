"use client";

import { ReactNode } from "react";
import { useSectionVisibility } from "../context/SectionVisibilityContext";

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
}

export function SectionWrapper({ id, children }: SectionWrapperProps) {
  const { visibleSection } = useSectionVisibility();
  const isVisible = !visibleSection || visibleSection === id;

  return (
    <section
      id={id}
      className={`min-h-screen transition-all duration-300 ${
        isVisible
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none"
      }`}
    >
      {children}
    </section>
  );
}
