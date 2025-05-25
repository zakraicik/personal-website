"use client";

import { ReactNode, useEffect, useState } from "react";
import { useSectionVisibility } from "../context/SectionVisibilityContext";

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
}

export function SectionWrapper({ id, children }: SectionWrapperProps) {
  const { visibleSection } = useSectionVisibility();
  const [isClient, setIsClient] = useState(false);

  // Only run on client to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    const isHome = id === "home";
    return (
      <section
        id={id}
        className="absolute inset-0 w-full h-screen flex flex-col justify-center"
        style={{
          transform: "translateY(0vh)",
          opacity: isHome ? 1 : 0,
          zIndex: isHome ? 10 : 0,
        }}
      >
        <div className="px-4 md:px-8 lg:px-16 py-16 h-full flex flex-col justify-center w-full">
          {children}
        </div>
      </section>
    );
  }

  // Client-side logic after hydration
  const currentVisibleSection = visibleSection || "home";
  const isVisible = currentVisibleSection === id;

  // Calculate vertical position based on section order
  const sectionOrder = [
    "home",
    "about",
    "portfolio",
    "timeline",
    "skills",
    "contact",
  ];

  const sectionIndex = sectionOrder.indexOf(id);
  const visibleIndex = sectionOrder.indexOf(currentVisibleSection);

  // Calculate transform based on current vs visible section
  const translateY = (sectionIndex - visibleIndex) * 100;

  return (
    <section
      id={id}
      className={`absolute inset-0 w-full h-screen flex flex-col justify-center transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 z-10"
          : Math.abs(sectionIndex - visibleIndex) === 1
          ? "opacity-60 z-[5]" // Adjacent sections are slightly visible
          : "opacity-0 z-0"
      }`}
      style={{
        transform: `translateY(${translateY}vh)`,
        filter: isVisible ? "blur(0px)" : "blur(1px)",
      }}
    >
      <div className="px-4 md:px-8 lg:px-16 py-16 h-full flex flex-col justify-center w-full">
        {children}
      </div>
    </section>
  );
}
