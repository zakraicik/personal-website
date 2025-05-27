"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { useSectionVisibility } from "../context/SectionVisibilityContext";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Timeline", href: "#timeline" },
  { name: "Skills", href: "#skills" },
];

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      } else if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    },
    [activeSection, isTransitioning, isMobileMenuOpen, navigateToSection]
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
    setIsMobileMenuOpen(false);
  };

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

      if (Math.abs(diffY) > 50 && diffX < 100) {
        const currentIndex = navItems.findIndex(
          (item) => item.href.substring(1) === activeSection
        );

        if (diffY > 0 && currentIndex < navItems.length - 1) {
          const nextSection = navItems[currentIndex + 1].href.substring(1);
          navigateToSection(nextSection);
        } else if (diffY < 0 && currentIndex > 0) {
          const prevSection = navItems[currentIndex - 1].href.substring(1);
          navigateToSection(prevSection);
        }
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeSection, isTransitioning, navigateToSection]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        !(event.target as Element).closest(".mobile-nav-container")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const sections = navItems.map((item) => item.href.substring(1));

    if (hash && sections.includes(hash)) {
      setVisibleSection(hash);
    } else {
      setVisibleSection("home");
      window.history.replaceState(null, "", "#home");
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [handleKeyDown, handleWheel, setVisibleSection]);

  return (
    <>
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden md:block">
        <div className="flex flex-col items-start space-y-4">
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

      <div className="md:hidden mobile-nav-container">
        <div className="fixed top-4 left-4 z-[60]">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            disabled={isTransitioning}
            className={`p-3 rounded-full bg-black/20 backdrop-blur-lg border border-white/20 transition-all duration-300 hover:bg-black/30 ${
              isTransitioning ? "opacity-50" : ""
            } ${isMobileMenuOpen ? "bg-black/40" : ""}`}
            aria-label="Toggle menu"
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? (
                <HiX size={20} className="text-white" />
              ) : (
                <HiMenu size={20} className="text-white" />
              )}
            </motion.div>
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[51]"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="fixed left-0 top-0 h-full w-72 bg-black/90 backdrop-blur-xl border-r border-white/10 shadow-2xl z-[52]"
            >
              <div className="pt-20 pb-6">
                {navItems.map((item, index) => {
                  const section = item.href.substring(1);
                  const isActive = activeSection === section;

                  return (
                    <motion.button
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.1,
                      }}
                      onClick={() => handleNavClick(item.href)}
                      disabled={isTransitioning}
                      className={`w-full flex items-center px-6 py-4 text-left transition-all duration-300 group ${
                        isTransitioning ? "opacity-50" : ""
                      } ${
                        isActive
                          ? "text-cyber-blue bg-cyber-blue/10 border-r-2 border-cyber-blue"
                          : "text-white/90 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <motion.div
                        className={`w-3 h-3 rounded-full mr-4 transition-all duration-300 ${
                          isActive
                            ? "bg-cyber-blue shadow-cyber-blue/40 shadow-md"
                            : "bg-white/40 group-hover:bg-cyan-400/70"
                        }`}
                        animate={{
                          scale: isActive ? 1.2 : 1,
                          boxShadow: isActive
                            ? "0 0 8px rgba(0, 191, 255, 0.4)"
                            : "none",
                        }}
                        whileHover={{ scale: isTransitioning ? 1 : 1.3 }}
                      />
                      <span className="text-base font-medium font-cyber">
                        {item.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
