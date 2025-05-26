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

// Custom hook for window size
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
    handleResize(); // Call once to set initial size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

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
  const expandedItemRef = useRef<HTMLDivElement | null>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (visibleSection === "timeline") {
      setExpandedIndex(null);
    }
  }, [visibleSection]);

  const toggleExpand = (index: number) => {
    setExpandedIndex((current) => (current === index ? null : index));
  };

  // Function to center an expanded card
  const centerExpandedCard = (index: number) => {
    const expandedItem = expandedItemRef.current;
    if (!expandedItem) return;

    const itemRect = expandedItem.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const itemCenter = itemRect.top + itemRect.height / 2;
    const scrollOffset = itemCenter - viewportCenter;

    window.scrollBy({
      top: scrollOffset,
      behavior: "smooth",
    });
  };

  // Function to re-center the timeline section
  const centerTimelineSection = () => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const sectionRect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculate the ideal position to center the section
    const sectionCenter = sectionRect.top + sectionRect.height / 2;
    const viewportCenter = viewportHeight / 2;
    const scrollAdjustment = sectionCenter - viewportCenter;

    // Only adjust if significantly off-center (threshold to avoid unnecessary micro-adjustments)
    if (Math.abs(scrollAdjustment) > 20) {
      window.scrollBy({
        top: scrollAdjustment,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    // Only apply centering on small screens
    if (width >= 768) {
      // Desktop behavior - original centering logic
      if (expandedIndex !== null) {
        const timer = setTimeout(() => {
          centerExpandedCard(expandedIndex);
        }, 450);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          centerTimelineSection();
        }, 450);
        return () => clearTimeout(timer);
      }
    } else {
      // Mobile behavior - same as portfolio
      if (expandedIndex !== null) {
        const timer = setTimeout(() => {
          centerExpandedCard(expandedIndex);
        }, 350);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          centerTimelineSection();
        }, 350);
        return () => clearTimeout(timer);
      }
    }
  }, [expandedIndex, width]);

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="min-h-screen flex flex-col justify-center section-padding relative overflow-hidden"
    >
      <div className="cyber-grid pointer-events-none w-full h-full left-0 top-0 absolute overflow-x-hidden" />

      <div className="px-4 md:px-6 w-full max-w-full mx-auto flex-1 flex items-center justify-center relative z-10">
        {/* Mobile expanded card overlay */}
        {width < 768 && expandedIndex !== null && (
          <motion.div
            ref={expandedItemRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
          >
            <motion.div
              className="bg-cyber-dark/5 backdrop-blur-md rounded-lg border border-cyber-dark/10 p-4 cursor-pointer hover:bg-gradient-to-r hover:from-cyber-purple/10 hover:via-cyber-blue/10 hover:to-cyber-pink/10 transition-all duration-300 w-[90vw] max-w-[400px]"
              onClick={() => toggleExpand(expandedIndex)}
              aria-expanded={true}
            >
              {/* Mobile layout - optimized font sizes */}
              <div className="flex items-start justify-between mb-2">
                <Typography
                  variant="subtitle1"
                  component="span"
                  className={`${
                    sortedTimelineData[expandedIndex].type === "education"
                      ? "text-cyber-blue"
                      : "text-cyber-purple"
                  } font-medium font-bold !text-[14px] flex-1 leading-tight`}
                >
                  {sortedTimelineData[expandedIndex].title}
                </Typography>
                <Typography className="text-white/70 !text-[11px] ml-3 flex-shrink-0">
                  {`${sortedTimelineData[expandedIndex].startYear} - ${sortedTimelineData[expandedIndex].endYear}`}
                </Typography>
              </div>
              <Typography className="text-white/80 !text-[11px] mb-3 leading-relaxed">
                {sortedTimelineData[expandedIndex].subtitle}
              </Typography>

              <motion.div
                key={`expand-${expandedIndex}`}
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  marginTop: 12,
                }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{ overflow: "hidden" }}
              >
                {Array.isArray(
                  sortedTimelineData[expandedIndex].description
                ) ? (
                  <div className="mt-3 space-y-2">
                    {sortedTimelineData[expandedIndex].description.map(
                      (desc, i) => (
                        <div key={i}>
                          <div className="text-white/70 text-[11px] py-1 text-left">
                            {desc}
                          </div>
                          {i <
                            sortedTimelineData[expandedIndex].description
                              .length -
                              1 && (
                            <div className="w-full h-px bg-white/20 my-1" />
                          )}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <Typography className="mt-3 text-white/70 !text-[11px] w-full text-left">
                    {sortedTimelineData[expandedIndex].description}
                  </Typography>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        <motion.div
          ref={timelineContainerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: width < 768 && expandedIndex !== null ? 0 : 1,
            y: 0,
          }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <Timeline
            position={width < 768 ? "right" : "alternate"}
            className="p-4"
            sx={{
              ...(width < 768 && {
                "& .MuiTimelineItem-root": {
                  "&:before": {
                    flex: 0,
                    padding: 0,
                  },
                },
                "& .MuiTimelineItem-root .MuiTimelineItem-content": {
                  paddingLeft: "32px",
                },
                "& .MuiTimelineSeparator-root": {
                  marginRight: "16px",
                },
                paddingLeft: "0px",
                display: "flex",
                justifyContent: "center",
              }),
            }}
          >
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
                  <TimelineContent
                    sx={{
                      py: "12px",
                      px: width < 768 ? 0 : 2,
                    }}
                  >
                    <motion.div
                      ref={(el) => {
                        itemRefs.current[index] = el;
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`bg-cyber-dark/5 backdrop-blur-md rounded-lg border border-cyber-dark/10 p-4 cursor-pointer hover:bg-gradient-to-r hover:from-cyber-purple/10 hover:via-cyber-blue/10 hover:to-cyber-pink/10 transition-all duration-300 ${
                        width < 768 ? "w-[calc(100vw-120px)] max-w-[300px]" : ""
                      }`}
                      onClick={() => toggleExpand(index)}
                      aria-expanded={isExpanded}
                    >
                      {width < 768 ? (
                        // Mobile layout - optimized font sizes
                        <>
                          <div className="flex items-start justify-between mb-2">
                            <Typography
                              variant="subtitle1"
                              component="span"
                              className={`${
                                item.type === "education"
                                  ? "text-cyber-blue"
                                  : "text-cyber-purple"
                              } font-medium font-bold !text-[14px] flex-1 leading-tight`}
                            >
                              {item.title}
                            </Typography>
                            <Typography className="text-white/70 !text-[11px] ml-3 flex-shrink-0">
                              {`${item.startYear} - ${item.endYear}`}
                            </Typography>
                          </div>
                          <Typography className="text-white/80 !text-[11px] mb-3 leading-relaxed">
                            {item.subtitle}
                          </Typography>
                        </>
                      ) : (
                        // Desktop layout - original
                        <>
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
                        </>
                      )}
                      <AnimatePresence mode="wait">
                        {isExpanded && width >= 768 && (
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
                              ease: [0.25, 0.46, 0.45, 0.94],
                            }}
                            style={{ overflow: "hidden" }}
                          >
                            {Array.isArray(item.description) ? (
                              <div className="mt-3 space-y-2">
                                {item.description.map((desc, i) => (
                                  <div key={i}>
                                    <div
                                      className={`text-white/70 py-1 ${
                                        index % 2 === 0
                                          ? "text-[12px] text-left"
                                          : "text-[12px] text-right"
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
                                className={`mt-3 text-white/70 w-full ${
                                  index % 2 === 0
                                    ? "!text-[12px] text-left"
                                    : "!text-[12px] text-right"
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
