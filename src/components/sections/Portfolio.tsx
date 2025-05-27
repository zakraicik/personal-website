"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HiExternalLink, HiChevronDown } from "react-icons/hi";

import { useState, useEffect, useRef } from "react";
import { useSectionVisibility } from "@/context/SectionVisibilityContext";
import { projects } from "@/data/projects";

export function Portfolio() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { visibleSection } = useSectionVisibility();
  const expandedCardRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (visibleSection === "portfolio") {
      setExpandedIndex(null);
      setHoveredIndex(null);
    }
  }, [visibleSection]);

  const toggleProject = (index: number) => {
    setExpandedIndex((current) => (current === index ? null : index));
  };

  const centerExpandedCard = () => {
    if (!expandedCardRef.current) return;

    const card = expandedCardRef.current;
    const cardRect = card.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const cardCenter = cardRect.top + cardRect.height / 2;
    const scrollOffset = cardCenter - viewportCenter;

    window.scrollBy({
      top: scrollOffset,
      behavior: "smooth",
    });
  };

  const centerPortfolioSection = () => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const sectionRect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const sectionCenter = sectionRect.top + sectionRect.height / 2;
    const viewportCenter = viewportHeight / 2;
    const scrollAdjustment = sectionCenter - viewportCenter;

    if (Math.abs(scrollAdjustment) > 20) {
      window.scrollBy({
        top: scrollAdjustment,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (window.innerWidth >= 640) return;

    if (expandedIndex !== null) {
      const timer = setTimeout(() => {
        centerExpandedCard();
      }, 350);

      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        centerPortfolioSection();
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [expandedIndex]);

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="min-h-screen flex flex-col justify-center section-padding relative overflow-hidden"
    >
      <div className="cyber-grid pointer-events-none w-full h-full left-0 top-0 absolute overflow-x-hidden" />

      <div className="px-2 sm:px-4 md:px-6 w-full max-w-full mx-auto flex-1 flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <div className="space-y-6 sm:space-y-8">
            {projects.map((project, index) => {
              const isExpanded = expandedIndex === index;
              const isHovered = hoveredIndex === index;
              const isHidden =
                expandedIndex !== null && expandedIndex !== index;

              return (
                <motion.div
                  key={project.title}
                  ref={isExpanded ? expandedCardRef : null}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: isHidden && window.innerWidth < 640 ? 0 : 1,
                    y: 0,
                    height: isHidden && window.innerWidth < 640 ? 0 : "auto",
                  }}
                  transition={{
                    duration: 0.3,
                    delay: isHidden ? 0 : index * 0.1,
                  }}
                  className={`bg-cyber-dark/5 backdrop-blur-md rounded-lg border border-cyber-dark/10 shadow-lg relative ${
                    isHidden && window.innerWidth < 640
                      ? "overflow-hidden mb-0"
                      : ""
                  }`}
                  style={{
                    marginBottom:
                      isHidden && window.innerWidth < 640 ? 0 : undefined,
                  }}
                >
                  <button
                    onClick={() => toggleProject(index)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="w-full p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between focus:outline-none hover:bg-gradient-to-r hover:from-cyber-purple/10 hover:via-cyber-blue/10 hover:to-cyber-pink/10 transition-all duration-300 cursor-pointer group gap-3 sm:gap-0"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex flex-col w-full min-w-0">
                      <div className="flex items-center justify-between w-full gap-3 sm:gap-4 mb-1">
                        <h3
                          className={`text-[16px] sm:text-[18px] font-medium tracking-[.01em] flex-shrink-0 transition-all duration-300 ${
                            isHovered ? "gradient-text" : "text-cyber-blue"
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
                            className="inline-flex items-center text-white hover:text-cyber-pink transition-colors text-base whitespace-nowrap"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="text-[15px] sm:text-base">
                              View
                            </span>{" "}
                            <HiExternalLink className="ml-1" />
                          </a>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <HiChevronDown className="text-cyber-blue text-xl" />
                          </motion.div>
                        </div>
                      </div>

                      <p className="text-white/80 text-[13px] sm:text-[14px] text-left break-words pr-24 sm:pr-28">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 bg-transparent text-white/70 rounded-lg text-xs border border-white/30 border-[1px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border-t border-cyber-blue/20"
                      >
                        <div className="p-6 space-y-2">
                          {project.details &&
                            project.details.map((item, i) => (
                              <div key={i}>
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: i * 0.1 }}
                                  className="text-white/80 text-[14px] py-1"
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
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
