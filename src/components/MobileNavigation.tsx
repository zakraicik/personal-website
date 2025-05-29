"use client";

import { useState, useEffect, useCallback } from "react";
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

export function MobileNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { setVisibleSection, visibleSection } = useSectionVisibility();

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

  const handleNavClick = (href: string) => {
    const section = href.substring(1);
    navigateToSection(section);
    setIsMobileMenuOpen(false);
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    },
    [isMobileMenuOpen]
  );

  // Handle touch navigation only when menu is closed
  useEffect(() => {
    if (isMobileMenuOpen) return;

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

      // Only handle vertical swipes
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
  }, [activeSection, isTransitioning, isMobileMenuOpen, navigateToSection]);

  // Handle body scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [isMobileMenuOpen]);

  // Handle outside click
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
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="mobile-nav-container">
      {/* Menu Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        disabled={isTransitioning}
        className={`p-3 rounded-full backdrop-blur-fallback border border-white/20 transition-all duration-300 hover:bg-black/30 ${
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

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 backdrop-blur-fallback z-[90]"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Menu Panel */}
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
            className="fixed left-0 top-0 w-72 backdrop-blur-fallback border-r border-white/10 shadow-2xl z-[95] h-screen-safe"
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
                    <span className="text-base font-medium">{item.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
