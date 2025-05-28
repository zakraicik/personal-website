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
import { useState, useRef, useEffect } from "react";
import { timelineData } from "@/data/timelineData";
import { useSectionVisibility } from "@/context/SectionVisibilityContext";

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

const sortedTimelineData = [...timelineData].sort((a, b) => {
  const parseYear = (year: string) =>
    year.toLowerCase() === "present" ? 9999 : parseInt(year);
  return parseYear(b.endYear) - parseYear(a.endYear);
});

// Define the TimelineItemData interface
interface TimelineItemData {
  title: string;
  subtitle: string;
  startYear: string;
  endYear: string;
  type: string;
  description: string | string[];
}

export function TimelineSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { visibleSection } = useSectionVisibility();
  const timelineContainerRef = useRef<HTMLDivElement | null>(null);
  const { width } = useWindowSize();
  const isClient = useIsClient();

  const isMobile = isClient && width < 768;

  useEffect(() => {
    if (visibleSection === "timeline") {
      setExpandedIndex(null);
      setHoveredIndex(null);
    }
  }, [visibleSection]);

  const toggleExpand = (index: number) => {
    setExpandedIndex((current) => (current === index ? null : index));
  };

  const renderExpandedCard = (item: TimelineItemData, index: number) => {
    const isHovered = hoveredIndex === index;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-transparent"
        onClick={() => setExpandedIndex(null)}
      >
        {/* Match the SectionWrapper padding */}
        <div className="px-3 xs:px-4 sm:px-6 md:px-14 lg:px-22 w-full max-w-4xl mx-auto">
          <motion.div
            key={`expanded-${item.title}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="glass-border bg-cyber-dark/5 backdrop-blur-md rounded-lg border border-cyber-dark/10 shadow-lg relative w-full max-w-[320px] xs:max-w-full mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setExpandedIndex(null)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="w-full p-3 xs:p-4 sm:p-6 flex flex-col items-start justify-between focus:outline-none hover:bg-gradient-to-r hover:from-cyber-purple/10 hover:via-cyber-blue/10 hover:to-cyber-pink/10 transition-all duration-300 cursor-pointer gap-2 xs:gap-3 sm:gap-0"
            >
              <div className="flex flex-col w-full min-w-0">
                <div className="flex items-center justify-between w-full gap-2 xs:gap-3 sm:gap-4 mb-1">
                  <h3
                    className={`font-medium text-xs xs:text-[13px] md:text-[16px] flex-shrink-0 transition-all duration-300 leading-tight ${
                      isHovered ? "gradient-text" : "text-white"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <span className="text-white/70 text-[10px] xs:text-[11px] md:text-[13px] flex-shrink-0">
                    {`${item.startYear} - ${item.endYear}`}
                  </span>
                </div>
                <p className="text-white/80 text-[10px] xs:text-[11px] md:text-[13px] text-left leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
            </button>

            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="overflow-hidden border-t border-cyber-blue/20"
            >
              <div className="p-3 xs:p-4 sm:p-4 space-y-0.5 xs:space-y-1">
                {Array.isArray(item.description) ? (
                  item.description.map((desc: string, i: number) => (
                    <div key={i}>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.2 + i * 0.1,
                        }}
                        className="text-white/80 text-[10px] xs:text-[11px] md:text-[13px] py-0.5 text-left leading-relaxed"
                      >
                        {desc}
                      </motion.div>
                      {i < item.description.length - 1 && (
                        <div className="w-full h-px bg-white/20 my-0.5 xs:my-1" />
                      )}
                    </div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="text-white/80 text-[10px] xs:text-[11px] md:text-[13px] py-0.5 text-left leading-relaxed"
                  >
                    {item.description}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderCollapsedCard = (item: TimelineItemData, index: number) => {
    const isHovered = hoveredIndex === index;

    return (
      <motion.div
        key={`${item.title}-${index}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={`glass-border bg-cyber-dark/5 backdrop-blur-md rounded-lg border border-cyber-dark/10 cursor-pointer hover:bg-gradient-to-r hover:from-cyber-purple/10 hover:via-cyber-blue/10 hover:to-cyber-pink/10 transition-all duration-300 p-3 xs:p-4 flex items-center ${
          isMobile
            ? "w-[calc(100vw-100px)] xs:w-[calc(100vw-120px)] max-w-[280px] xs:max-w-[320px]"
            : "max-w-full"
        }`}
        onClick={() => toggleExpand(index)}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {isMobile ? (
          <div className="flex flex-col w-full min-w-0">
            <div className="flex items-center justify-between w-full gap-2 xs:gap-3 mb-1">
              <h3
                className={`font-medium text-xs xs:text-[13px] md:text-[16px] flex-1 leading-tight transition-all duration-300 text-white`}
              >
                {item.title}
              </h3>
              <span className="text-white/70 text-[10px] xs:text-[11px] md:text-[13px] flex-shrink-0">
                {`${item.startYear} - ${item.endYear}`}
              </span>
            </div>
            <p className="text-white/80 text-[10px] xs:text-[11px] md:text-[13px] leading-relaxed">
              {item.subtitle}
            </p>
          </div>
        ) : (
          <div className="flex flex-col w-full min-w-0">
            <div
              className={`flex items-center justify-between w-full gap-4 ${
                index % 2 === 0 ? "" : "flex-row-reverse"
              }`}
            >
              <h3
                className={`font-medium text-xs xs:text-[13px] md:text-[16px] transition-all duration-300 leading-tight ${
                  !isMobile && isHovered ? "gradient-text" : "text-white"
                }`}
              >
                {item.title}
              </h3>
              <span className="text-white/70 text-[10px] xs:text-[11px] md:text-[13px] flex-shrink-0">
                {`${item.startYear} - ${item.endYear}`}
              </span>
            </div>
            <p
              className={`text-white/80 text-[10px] xs:text-[11px] md:text-[13px] mt-1 leading-relaxed ${
                index % 2 === 0 ? "text-left" : "text-right"
              }`}
            >
              {item.subtitle}
            </p>
          </div>
        )}
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
      id="timeline"
      className="relative overflow-hidden min-h-screen flex items-center"
    >
      <div className="cyber-grid pointer-events-none w-full h-full left-0 top-0 absolute overflow-x-hidden" />

      <div className="flex-1 flex items-center justify-center py-4 xs:py-6 sm:py-4">
        <div className="px-2 xs:px-4 md:px-6 w-full max-w-full mx-auto relative z-10">
          <motion.div
            ref={timelineContainerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mx-auto"
          >
            <AnimatePresence mode="wait">
              {expandedIndex !== null ? (
                // Expanded state: show only the expanded card, perfectly centered
                renderExpandedCard(
                  sortedTimelineData[expandedIndex] as TimelineItemData,
                  expandedIndex
                )
              ) : (
                // Collapsed state: show timeline
                <motion.div
                  key="collapsed-timeline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Timeline
                    position={isMobile ? "right" : "alternate"}
                    className="p-2 xs:p-4"
                    sx={{
                      ...(isMobile && {
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
                    {sortedTimelineData.map((item, index) => (
                      <TimelineItem key={index}>
                        <TimelineSeparator>
                          <TimelineConnector className="bg-cyber-blue/30" />
                          <TimelineDot
                            sx={{
                              backgroundColor: "transparent",
                              boxShadow: "none",
                              border: `2px solid ${
                                item.type === "education"
                                  ? "#FF1493"
                                  : "#8A2BE2"
                              }`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {item.type === "education" ? (
                              <span
                                style={
                                  {
                                    "--glow-color": "#FF1493",
                                  } as React.CSSProperties
                                }
                              >
                                <SchoolIcon
                                  style={{
                                    color: "#FF1493",
                                  }}
                                  className="techy-glow"
                                />
                              </span>
                            ) : (
                              <span
                                style={
                                  {
                                    "--glow-color": "#8A2BE2",
                                  } as React.CSSProperties
                                }
                              >
                                <WorkIcon
                                  style={{
                                    color: "#8A2BE2",
                                  }}
                                  className="techy-glow"
                                />
                              </span>
                            )}
                          </TimelineDot>
                          <TimelineConnector className="bg-cyber-blue/30" />
                        </TimelineSeparator>
                        <TimelineContent
                          sx={{
                            py: "12px",
                            px: isMobile ? 0 : 2,
                          }}
                        >
                          {renderCollapsedCard(item as TimelineItemData, index)}
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
