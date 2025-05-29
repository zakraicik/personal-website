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

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    const isHome = id === "home";
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

  const currentVisibleSection = visibleSection || "home";
  const isVisible = currentVisibleSection === id;

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
