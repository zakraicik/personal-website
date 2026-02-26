"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useSectionVisibility } from "../context/SectionVisibilityContext";
import { DEFAULT_SECTION_ID, NAV_ITEMS } from "@/data/navigation";

export function DesktopNavigation() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { setVisibleSection, visibleSection } = useSectionVisibility();
  const lastWheelTime = useRef(0);

  const activeSection = visibleSection || DEFAULT_SECTION_ID;

  const navigateToSection = useCallback(
    (section: string) => {
      if (section === activeSection || isTransitioning) return;

      setIsTransitioning(true);
      setVisibleSection(section);
      window.history.replaceState(null, "", `#${section}`);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 700);
    },
    [activeSection, isTransitioning, setVisibleSection]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.target && (event.target as HTMLElement).tagName === "INPUT")
        return;
      if (isTransitioning) return;

      const currentIndex = NAV_ITEMS.findIndex(
        (item) => item.id === activeSection
      );

      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        event.key === " "
      ) {
        event.preventDefault();
        if (currentIndex < NAV_ITEMS.length - 1) {
          const nextSection = NAV_ITEMS[currentIndex + 1].id;
          navigateToSection(nextSection);
        }
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        if (currentIndex > 0) {
          const prevSection = NAV_ITEMS[currentIndex - 1].id;
          navigateToSection(prevSection);
        }
      } else if (event.key === "Home") {
        event.preventDefault();
        navigateToSection(DEFAULT_SECTION_ID);
      } else if (event.key === "End") {
        event.preventDefault();
        navigateToSection(NAV_ITEMS[NAV_ITEMS.length - 1].id);
      }
    },
    [activeSection, isTransitioning, navigateToSection]
  );

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      const now = Date.now();
      const minDelta = 10;

      if (
        Math.abs(event.deltaY) >= minDelta &&
        now - lastWheelTime.current > 400 &&
        !isTransitioning
      ) {
        event.preventDefault();
        lastWheelTime.current = now;

        const currentIndex = NAV_ITEMS.findIndex(
          (item) => item.id === activeSection
        );

        if (event.deltaY > 0 && currentIndex < NAV_ITEMS.length - 1) {
          const nextSection = NAV_ITEMS[currentIndex + 1].id;
          navigateToSection(nextSection);
        } else if (event.deltaY < 0 && currentIndex > 0) {
          const prevSection = NAV_ITEMS[currentIndex - 1].id;
          navigateToSection(prevSection);
        }
      }
    },
    [activeSection, isTransitioning, navigateToSection]
  );

  const handleNavClick = (section: string) => {
    navigateToSection(section);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [handleKeyDown, handleWheel]);

  return (
    <nav className="flex flex-col items-start space-y-4">
      {NAV_ITEMS.map((item) => {
        const section = item.id;
        const isActive = activeSection === section;

        return (
          <button
            key={item.name}
            onClick={() => handleNavClick(item.id)}
            disabled={isTransitioning}
            className={`group relative flex items-center justify-start w-40 font-cyber px-4 py-3 rounded-lg transition-all duration-300 ${
              isTransitioning ? "opacity-50 cursor-not-allowed" : ""
            } ${
              isActive
                ? "text-cyber-blue bg-cyber-blue/10 scale-105"
                : "text-white/80 hover:text-cyber-blue hover:bg-cyber-blue/5 hover:scale-102"
            }`}
            aria-label={`Navigate to ${item.name} section`}
          >
            <motion.div
              className={`w-3 h-3 rounded-full mr-3 transition-all duration-300 ${
                isActive
                  ? "bg-cyber-blue shadow-cyber-blue/40 shadow-md"
                  : "bg-gray-400/60 group-hover:bg-cyan-400/70"
              }`}
              whileHover={{ scale: isTransitioning ? 1 : 1.2 }}
              animate={{
                scale: isActive ? 1.1 : 1,
                boxShadow: isActive ? "0 0 8px rgba(0, 191, 255, 0.4)" : "none",
              }}
            />
            <span className="text-sm font-medium transition-all duration-300">
              {item.name}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
