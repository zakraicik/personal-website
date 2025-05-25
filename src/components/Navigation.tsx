"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { useSectionVisibility } from "../context/SectionVisibilityContext";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Timeline", href: "#timeline" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" },
];

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { setVisibleSection, visibleSection } = useSectionVisibility();
  const lastWheelTime = useRef(0);

  // Use visibleSection as the single source of truth for active section
  const activeSection = visibleSection || "home";

  // Handle keyboard navigation
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
          navigateToSection(nextSection, "down");
        }
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        if (currentIndex > 0) {
          const prevSection = navItems[currentIndex - 1].href.substring(1);
          navigateToSection(prevSection, "up");
        }
      } else if (event.key === "Home") {
        event.preventDefault();
        navigateToSection("home", "up");
      } else if (event.key === "End") {
        event.preventDefault();
        navigateToSection("contact", "down");
      }
    },
    [activeSection, isTransitioning]
  );

  // Handle wheel/scroll navigation with smooth scroll illusion
  const handleWheel = useCallback(
    (event: WheelEvent) => {
      const now = Date.now();
      const minDelta = 10; // Lower for Mac touchpads
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
          navigateToSection(nextSection, "down");
        } else if (event.deltaY < 0 && currentIndex > 0) {
          const prevSection = navItems[currentIndex - 1].href.substring(1);
          navigateToSection(prevSection, "up");
        }
      }
    },
    [activeSection, isTransitioning]
  );

  const navigateToSection = (
    section: string,
    direction: "up" | "down" = "down"
  ) => {
    if (section === activeSection || isTransitioning) return;

    setIsTransitioning(true);
    setVisibleSection(section);
    window.history.replaceState(null, "", `#${section}`);

    // Add a slight delay to simulate scroll momentum
    setTimeout(() => {
      setIsTransitioning(false);
    }, 700); // Match the transition duration
  };

  const handleNavClick = (href: string) => {
    const section = href.substring(1);
    const currentIndex = navItems.findIndex(
      (item) => item.href.substring(1) === activeSection
    );
    const targetIndex = navItems.findIndex(
      (item) => item.href.substring(1) === section
    );
    const direction = targetIndex > currentIndex ? "down" : "up";

    navigateToSection(section, direction);
    setIsMobileMenuOpen(false);
  };

  // Touch handling for mobile swipe
  useEffect(() => {
    let touchStartY = 0;
    let touchStartX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioning) return;

      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const diffY = touchStartY - touchEndY;
      const diffX = Math.abs(touchStartX - touchEndX);

      // Only trigger if it's a primarily vertical swipe
      if (Math.abs(diffY) > 50 && diffX < 100) {
        const currentIndex = navItems.findIndex(
          (item) => item.href.substring(1) === activeSection
        );

        if (diffY > 0 && currentIndex < navItems.length - 1) {
          // Swipe up (scroll down)
          const nextSection = navItems[currentIndex + 1].href.substring(1);
          navigateToSection(nextSection, "down");
        } else if (diffY < 0 && currentIndex > 0) {
          // Swipe down (scroll up)
          const prevSection = navItems[currentIndex - 1].href.substring(1);
          navigateToSection(prevSection, "up");
        }
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeSection, isTransitioning]);

  useEffect(() => {
    // Set initial section from URL hash
    const hash = window.location.hash.replace("#", "");
    const sections = navItems.map((item) => item.href.substring(1));

    if (hash && sections.includes(hash)) {
      setVisibleSection(hash);
    } else {
      setVisibleSection("home");
      window.history.replaceState(null, "", "#home");
    }

    // Add event listeners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [handleKeyDown, handleWheel, setVisibleSection]);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden md:block">
        <div className="flex flex-col items-start space-y-4">
          {navItems.map((item, index) => {
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
                    boxShadow: isActive
                      ? "0 0 8px rgba(0, 191, 255, 0.4)"
                      : "none",
                  }}
                />
                <span className="text-sm font-medium transition-all duration-300">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          disabled={isTransitioning}
          className={`p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 transition-all duration-300 hover:bg-white/20 ${
            isTransitioning ? "opacity-50" : ""
          }`}
          aria-label="Toggle menu"
        >
          <motion.div
            animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isMobileMenuOpen ? <HiX size={20} /> : <HiMenu size={20} />}
          </motion.div>
        </button>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute left-0 mt-2 w-56 rounded-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-white/20 shadow-xl overflow-hidden"
          >
            <div className="py-2">
              {navItems.map((item, index) => {
                const section = item.href.substring(1);
                const isActive = activeSection === section;

                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    disabled={isTransitioning}
                    className={`w-full flex items-center px-4 py-3 text-sm transition-all duration-200 ${
                      isTransitioning ? "opacity-50" : ""
                    } ${
                      isActive
                        ? "text-cyber-blue bg-cyber-blue/10"
                        : "text-gray-600 dark:text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <motion.div
                      className={`w-2 h-2 rounded-full mr-3 transition-colors duration-200 ${
                        isActive ? "bg-cyber-blue" : "bg-gray-400/50"
                      }`}
                      animate={{ scale: isActive ? 1.2 : 1 }}
                    />
                    <span className="flex-1 text-left">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
