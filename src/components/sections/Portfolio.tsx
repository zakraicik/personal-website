"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HiExternalLink, HiChevronDown } from "react-icons/hi";

import { useState, useEffect, useRef } from "react";
import { useSectionVisibility } from "@/context/SectionVisibilityContext";
import { projects } from "@/data/projects";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

export function Portfolio() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { visibleSection } = useSectionVisibility();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { width } = useWindowSize();
  const isClient = useIsClient();

  const isMobile = isClient && width < 768;

  useEffect(() => {
    if (visibleSection === "portfolio") {
      setExpandedIndex(null);
      setHoveredIndex(null);
    }
  }, [visibleSection]);

  const toggleProject = (index: number) => {
    setExpandedIndex((current) => (current === index ? null : index));
  };

  const renderExpandedCard = (project: any, index: number) => {
    const isHovered = hoveredIndex === index;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-transparent"
        onClick={() => setExpandedIndex(null)}
      >
        {/* Match the SectionWrapper padding + Portfolio component padding */}
        <div className="px-6 md:px-14 lg:px-22 w-full max-w-4xl mx-auto">
          <motion.div
            key={`expanded-${project.title}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="glass-border bg-cyber-dark/5 backdrop-blur-md rounded-lg border border-cyber-dark/10 shadow-lg relative w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setExpandedIndex(null)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="w-full p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between focus:outline-none hover:bg-gradient-to-r hover:from-cyber-purple/10 hover:via-cyber-blue/10 hover:to-cyber-pink/10 transition-all duration-300 cursor-pointer group gap-3 sm:gap-0"
              aria-expanded={true}
            >
              <div className="flex flex-col w-full min-w-0">
                <div className="flex items-center justify-between w-full gap-3 sm:gap-4 mb-1">
                  <h3
                    className={`text-[13px] sm:text-[16px] font-medium tracking-[.01em] flex-shrink-0 transition-all duration-300 ${
                      isHovered ? "gradient-text" : "text-white"
                    }`}
                    style={{
                      fontFamily:
                        "Inter, 'SF Pro Text', 'Helvetica Neue', sans-serif",
                      textShadow: "0 1px 1px rgba(0,0,0,0.1)",
                    }}
                  >
                    {project.title}
                  </h3>

                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <a
                      href={project.link}
                      className="inline-flex items-center text-white hover:text-cyber-pink transition-colors text-[11px] sm:text-[15px] whitespace-nowrap"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-[11px] sm:text-base">View</span>{" "}
                      <HiExternalLink className="ml-1" />
                    </a>
                    <motion.div
                      animate={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <HiChevronDown className="text-cyber-blue text-xl" />
                    </motion.div>
                  </div>
                </div>

                <p className="text-white/80 text-[11px] sm:text-[13px] text-left break-words pr-24 sm:pr-28">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
                  {project.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 bg-transparent text-white/70 rounded-lg text-[11px] sm:text-xs border border-white/30 border-[1px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>

            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="overflow-hidden border-t border-cyber-blue/20"
            >
              <div className="p-4 space-y-1">
                {project.details &&
                  project.details.map((item: string, i: number) => (
                    <div key={i}>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.2 + i * 0.1,
                        }}
                        className="text-white/80 text-[11px] sm:text-[14px] py-0.5"
                      >
                        {item}
                      </motion.div>
                      {i < project.details.length - 1 && (
                        <div className="w-full h-px bg-white/20 my-1" />
                      )}
                    </div>
                  ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderCollapsedCard = (project: any, index: number) => {
    const isHovered = hoveredIndex === index;

    return (
      <motion.div
        key={project.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          delay: index * 0.1,
        }}
        className="glass-border bg-cyber-dark/5 backdrop-blur-md rounded-lg border border-cyber-dark/10 shadow-lg relative"
      >
        <button
          onClick={() => toggleProject(index)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="w-full p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between focus:outline-none hover:bg-gradient-to-r hover:from-cyber-purple/10 hover:via-cyber-blue/10 hover:to-cyber-pink/10 transition-all duration-300 cursor-pointer group gap-3 sm:gap-0"
          aria-expanded={false}
        >
          <div className="flex flex-col w-full min-w-0">
            <div className="flex items-center justify-between w-full gap-3 sm:gap-4 mb-1">
              <h3
                className={`text-[13px] sm:text-[16px] font-medium tracking-[.01em] flex-shrink-0 transition-all duration-300 ${
                  !isMobile && isHovered ? "gradient-text" : "text-white"
                }`}
                style={{
                  fontFamily:
                    "Inter, 'SF Pro Text', 'Helvetica Neue', sans-serif",
                  textShadow: "0 1px 1px rgba(0,0,0,0.1)",
                }}
              >
                {project.title}
              </h3>

              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <a
                  href={project.link}
                  className="inline-flex items-center text-white hover:text-cyber-pink transition-colors text-[11px] sm:text-[15px] whitespace-nowrap"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-[11px] sm:text-base">View</span>{" "}
                  <HiExternalLink className="ml-1" />
                </a>
                <motion.div
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <HiChevronDown className="text-cyber-blue text-xl" />
                </motion.div>
              </div>
            </div>

            <p className="text-white/80 text-[11px] sm:text-[13px] text-left break-words pr-24 sm:pr-28">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
              {project.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 bg-transparent text-white/70 rounded-lg text-[11px] sm:text-xs border border-white/30 border-[1px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </button>
      </motion.div>
    );
  };

  if (!isClient) {
    return (
      <div className="flex-1 flex items-center justify-center py-4">
        <div className="w-full max-w-4xl relative z-10">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300/20 rounded mb-4"></div>
            <div className="h-6 bg-gray-300/20 rounded mb-4"></div>
            <div className="h-6 bg-gray-300/20 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative overflow-hidden"
    >
      <div className="cyber-grid pointer-events-none w-full h-full left-0 top-0 absolute overflow-x-hidden" />

      <div className="flex-1 flex items-center justify-center py-4">
        <div className="px-2 sm:px-4 md:px-6 w-full max-w-full mx-auto relative z-10">
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mx-auto"
          >
            <AnimatePresence mode="wait">
              {expandedIndex !== null ? (
                // Expanded state: show only the expanded card, perfectly centered
                renderExpandedCard(projects[expandedIndex], expandedIndex)
              ) : (
                // Collapsed state: show all cards in a list
                <motion.div
                  key="collapsed-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 sm:space-y-8"
                >
                  {projects.map((project, index) =>
                    renderCollapsedCard(project, index)
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
