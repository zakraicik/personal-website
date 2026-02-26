"use client";

import { ReactNode, useEffect, useState } from "react";
import { useSectionVisibility } from "../context/SectionVisibilityContext";
import { DEFAULT_SECTION_ID, SECTION_IDS } from "@/data/navigation";

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
}

export function SectionWrapper({ id, children }: SectionWrapperProps) {
  const { visibleSection } = useSectionVisibility();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    const isHome = id === DEFAULT_SECTION_ID;
    return (
      <section
        id={id}
        className="absolute inset-0 w-full h-full flex flex-col justify-center items-center"
        style={{
          transform: "translateY(0%)",
          opacity: isHome ? 1 : 0,
          zIndex: isHome ? 10 : 0,
        }}
      >
        <div className="w-full h-full flex flex-col justify-center items-center px-4 md:px-8 lg:px-16">
          {children}
        </div>
      </section>
    );
  }

  const candidateSection = visibleSection || DEFAULT_SECTION_ID;
  const currentVisibleSection = SECTION_IDS.includes(candidateSection)
    ? candidateSection
    : DEFAULT_SECTION_ID;
  const isVisible = currentVisibleSection === id;

  const sectionIndex = SECTION_IDS.indexOf(id);
  const visibleIndex = SECTION_IDS.indexOf(currentVisibleSection);

  // Use percentage instead of vh for more reliable cross-browser behavior
  const translatePercent = (sectionIndex - visibleIndex) * 100;

  return (
    <section
      id={id}
      className={`absolute inset-0 w-full h-full flex flex-col justify-center items-center transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 z-10"
          : Math.abs(sectionIndex - visibleIndex) === 1
          ? "opacity-60 z-[5]"
          : "opacity-0 z-0"
      }`}
      style={{
        transform: `translateY(${translatePercent}%)`,
        filter: isVisible ? "blur(0px)" : "blur(1px)",
      }}
    >
      <div className="w-full h-full flex flex-col justify-center items-center px-4 md:px-8 lg:px-16">
        {children}
      </div>
    </section>
  );
}
