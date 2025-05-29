"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useSectionVisibility } from "../context/SectionVisibilityContext";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Timeline", href: "#timeline" },
  { name: "Skills", href: "#skills" },
];

export function DesktopNavigation() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { setVisibleSection, visibleSection } = useSectionVisibility();
  const lastWheelTime = useRef(0);

  const activeSection = visibleSection || "home";

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

      const currentIndex = navItems.findIndex(
        (item) => item.href.substring(1) === activeSection
      );

      if (
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        event.key === " "
      ) {
        event.preventDefault();
        if (currentIndex < navItems.length - 1) {
          const nextSection = navItems[currentIndex + 1].href.substring(1);
          navigateToSection(nextSection);
        }
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        if (currentIndex > 0) {
          const prevSection = navItems[currentIndex - 1].href.substring(1);
          navigateToSection(prevSection);
        }
      } else if (event.key === "Home") {
        event.preventDefault();
        navigateToSection("home");
      } else if (event.key === "End") {
        event.preventDefault();
        navigateToSection(navItems[navItems.length - 1].href.substring(1));
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

        const currentIndex = navItems.findIndex(
          (item) => item.href.substring(1) === activeSection
        );

        if (event.deltaY > 0 && currentIndex < navItems.length - 1) {
          const nextSection = navItems[currentIndex + 1].href.substring(1);
          navigateToSection(nextSection);
        } else if (event.deltaY < 0 && currentIndex > 0) {
          const prevSection = navItems[currentIndex - 1].href.substring(1);
          navigateToSection(prevSection);
        }
      }
    },
    [activeSection, isTransitioning, navigateToSection]
  );

  const handleNavClick = (href: string) => {
    const section = href.substring(1);
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
      {navItems.map((item) => {
        const section = item.href.substring(1);
        const isActive = activeSection === section;

        return (
          <button
            key={item.name}
            onClick={() => handleNavClick(item.href)}
            disabled={isTransitioning}
            className={`group relative flex items-center font-cyber px-4 py-3 rounded-lg transition-all duration-300 ${
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
