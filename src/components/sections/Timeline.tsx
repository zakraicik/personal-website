"use client";

import { motion, AnimatePresence } from "framer-motion";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import Typography from "@mui/material/Typography";
import { useState, useRef, useEffect } from "react";
import { timelineData } from "@/data/timelineData";
import { useSectionVisibility } from "@/context/SectionVisibilityContext";

// Sort by end year (most recent first)
const sortedTimelineData = [...timelineData].sort((a, b) => {
  const parseYear = (year: string) =>
    year.toLowerCase() === "present" ? 9999 : parseInt(year);
  return parseYear(b.endYear) - parseYear(a.endYear);
});

export function TimelineSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { visibleSection } = useSectionVisibility();
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineContainerRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (visibleSection === "timeline") {
      setExpandedIndex(null);
    }
  }, [visibleSection]);

  const toggleExpand = (index: number) => {
    setExpandedIndex((current) => (current === index ? null : index));
  };

  useEffect(() => {
    if (expandedIndex !== null && itemRefs.current[expandedIndex]) {
      // For expansion, wait a bit for the animation to start, then center
      const timer = setTimeout(() => {
        const expandedItem = itemRefs.current[expandedIndex];
        if (expandedItem) {
          const itemRect = expandedItem.getBoundingClientRect();
          const viewportCenter = window.innerHeight / 2;
          const itemCenter = itemRect.top + itemRect.height / 2;
          const scrollOffset = itemCenter - viewportCenter;

          window.scrollBy({
            top: scrollOffset,
            behavior: "smooth",
          });
        }
      }, 200); // Reduced delay to start centering sooner

      return () => clearTimeout(timer);
    } else if (expandedIndex === null) {
      // Handle collapse - center the timeline
      const timer = setTimeout(() => {
        if (sectionRef.current) {
          const section = sectionRef.current;
          const sectionRect = section.getBoundingClientRect();
          const viewportHeight = window.innerHeight;

          // Calculate where the section should be positioned to be centered
          const idealSectionTop = (viewportHeight - sectionRect.height) / 2;
          const currentSectionTop = sectionRect.top;
          const scrollAdjustment = currentSectionTop - idealSectionTop;

          // Only adjust if significantly off-center
          if (Math.abs(scrollAdjustment) > 15) {
            window.scrollBy({
              top: scrollAdjustment,
              behavior: "smooth",
            });
          }
        }
      }, 200); // Faster response for collapse too

      return () => clearTimeout(timer);
    }
  }, [expandedIndex]);

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="min-h-screen flex flex-col justify-center section-padding relative overflow-hidden"
    >
      <div className="cyber-grid pointer-events-none w-full h-full left-0 top-0 absolute overflow-x-hidden" />

      <div className="px-4 md:px-6 w-full max-w-full mx-auto flex-1 flex items-center justify-center relative z-10">
        <motion.div
          ref={timelineContainerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <Timeline position="alternate" className="p-4">
            {sortedTimelineData.map((item, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineConnector className="bg-cyber-blue/30" />
                    <TimelineDot
                      sx={{
                        backgroundColor:
                          item.type === "education" ? "#00BFFF" : "#8A2BE2",
                      }}
                    >
                      {item.type === "education" ? (
                        <SchoolIcon className="text-white" />
                      ) : (
                        <WorkIcon className="text-white" />
                      )}
                    </TimelineDot>
                    <TimelineConnector className="bg-cyber-blue/30" />
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: "12px", px: 2 }}>
                    <motion.div
                      ref={(el) => {
                        itemRefs.current[index] = el;
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-cyber-dark/5 backdrop-blur-md rounded-lg border border-cyber-dark/10 p-4 cursor-pointer hover:bg-gradient-to-r hover:from-cyber-purple/10 hover:via-cyber-blue/10 hover:to-cyber-pink/10 transition-all duration-300"
                      onClick={() => toggleExpand(index)}
                      aria-expanded={isExpanded}
                    >
                      <div
                        className={`flex items-center justify-between ${
                          index % 2 === 0 ? "" : "flex-row-reverse"
                        }`}
                      >
                        <Typography
                          variant="subtitle1"
                          component="span"
                          className={`${
                            item.type === "education"
                              ? "text-cyber-blue"
                              : "text-cyber-purple"
                          } font-medium font-bold !text-[16px]`}
                        >
                          {item.title}
                        </Typography>
                        <Typography className="text-white/70 !text-[12px] ml-4 mr-4">
                          {`${item.startYear} - ${item.endYear}`}
                        </Typography>
                      </div>
                      <Typography className="text-white/80 !text-[12px] mt-1 mb-3">
                        {item.subtitle}
                      </Typography>
                      <AnimatePresence mode="wait">
                        {isExpanded && (
                          <motion.div
                            key={`expand-${index}`}
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{
                              opacity: 1,
                              height: "auto",
                              marginTop: 12,
                            }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{
                              duration: 0.4,
                              ease: [0.25, 0.46, 0.45, 0.94], // More natural easing
                            }}
                            style={{ overflow: "hidden" }}
                          >
                            {Array.isArray(item.description) ? (
                              <div className="mt-3 space-y-2">
                                {item.description.map((desc, i) => (
                                  <div key={i}>
                                    <div
                                      className={`text-white/70 text-[12px] py-1 ${
                                        index % 2 === 0
                                          ? "text-left"
                                          : "text-right"
                                      }`}
                                    >
                                      {desc}
                                    </div>
                                    {i < item.description.length - 1 && (
                                      <div className="w-full h-px bg-white/20 my-1" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <Typography
                                className={`mt-3 text-white/70 !text-[12px] w-full ${
                                  index % 2 === 0 ? "text-left" : "text-right"
                                }`}
                              >
                                {item.description}
                              </Typography>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        </motion.div>
      </div>
    </section>
  );
}
