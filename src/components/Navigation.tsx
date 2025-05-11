"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { useSectionVisibility } from "../context/SectionVisibilityContext";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Contact", href: "#contact" },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setVisibleSection } = useSectionVisibility();

  useEffect(() => {
    const sections = navItems.map((item) => item.href.substring(1));

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            setVisibleSection(section);
            break;
          }
        }
      }
    };

    // On mount, set active section based on hash
    const setActiveFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (sections.includes(hash)) {
        setActiveSection(hash);
        setVisibleSection(hash);
      }
    };

    setActiveFromHash();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("hashchange", setActiveFromHash);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", setActiveFromHash);
    };
  }, [setVisibleSection]);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden md:block  ">
        <div className="flex flex-col items-start space-y-6 ">
          {navItems.map((item) => {
            const section = item.href.substring(1);
            const isActive = activeSection === section;

            return (
              <a
                key={item.name}
                href={item.href}
                className={`group relative flex items-center font-cyber px-3 py-2 rounded-lg transition-colors duration-300
                  ${
                    isActive
                      ? "text-cyber-blue bg-cyber-blue/10"
                      : "text-cyber-light/70 hover:text-cyber-blue hover:bg-cyber-blue/5"
                  }
                `}
                aria-label={item.name}
              >
                <motion.div
                  className={`w-3 h-3 rounded-full mr-2 transition-colors duration-300
                    ${
                      isActive
                        ? "bg-cyber-blue shadow-cyber-blue/40 shadow-md"
                        : "bg-gray-400/50"
                    }
                  `}
                  whileHover={{ scale: 1.5 }}
                />
                <span className="text-sm font-medium transition-colors duration-300">
                  {item.name}
                </span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <HiX size={20} /> : <HiMenu size={20} />}
        </button>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute left-0 mt-2 w-48 rounded-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-white/20 shadow-lg"
          >
            <div className="py-2">
              {navItems.map((item) => {
                const section = item.href.substring(1);
                const isActive = activeSection === section;

                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-sm ${
                      isActive
                        ? "text-cyber-blue"
                        : "text-gray-600 dark:text-gray-300"
                    } hover:bg-white/10`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-3 ${
                        isActive ? "bg-cyber-blue" : "bg-gray-400/50"
                      }`}
                    />
                    {item.name}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
