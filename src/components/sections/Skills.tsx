"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { skills } from "@/data/skills";
import { motion, AnimatePresence } from "framer-motion";
import { useSectionVisibility } from "@/context/SectionVisibilityContext";

interface Category {
  name: string;
  color: string;
  skillCount: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SkillItem {
  name: string;
  level: string;
  category: string;
  color: string;
}

// Brand gradient stops
const BRAND_GRADIENT = [
  "#8A2BE2", // purple
  "#00BFFF", // blue
  "#FF1493", // pink
];

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Custom hook for window size with debouncing
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
  });

  const debouncedSetSize = useCallback(
    debounce(() => {
      setWindowSize({
        width: window.innerWidth,
      });
    }, 100),
    []
  );

  useEffect(() => {
    function handleResize() {
      debouncedSetSize();
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [debouncedSetSize]);

  return windowSize;
}

// Simple color assignment - just cycle through brand colors
const getCategoryColor = (index: number): string => {
  return BRAND_GRADIENT[index % BRAND_GRADIENT.length];
};

// Custom hook to prevent hydration mismatch
function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

// Grid layout calculation
const calculateGridLayout = (
  categories: Array<{ name: string; skillCount: number; color: string }>,
  width: number,
  height: number,
  isMobile: boolean
): Category[] => {
  const numCategories = categories.length;

  // Calculate optimal grid dimensions - force 2 columns on mobile
  const cols = isMobile ? 2 : Math.ceil(Math.sqrt(numCategories));
  const rows = Math.ceil(numCategories / cols);

  // Calculate box dimensions with more spacing between boxes
  const gapSize = 8;
  const boxWidth = (width - (cols - 1) * gapSize) / cols;
  const boxHeight = (height - (rows - 1) * gapSize) / rows;

  const result: Category[] = [];

  categories.forEach((cat, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;

    const x = col * (boxWidth + gapSize);
    const y = row * (boxHeight + gapSize);

    result.push({
      name: cat.name,
      color: cat.color,
      skillCount: cat.skillCount,
      x: x,
      y: y,
      width: boxWidth,
      height: boxHeight,
    });
  });

  return result;
};

const Skills = () => {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isClient = useIsClient();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const { visibleSection } = useSectionVisibility();

  // Container dimensions - made smaller and more compact, taller on mobile for 2-column layout
  const containerWidth = isMobile ? Math.min(width * 0.9, 350) : 600;
  const containerHeight = isMobile ? 400 : 400;

  // Memoized category data
  const categoryData = useMemo(() => {
    const categoryList = Array.from(new Set(skills.map((s) => s.category)));
    return categoryList.map((catName) => ({
      name: catName,
      skillCount: skills.filter((s) => s.category === catName).length,
      color: "",
    }));
  }, []);

  // Memoized categories with colors
  const categoriesWithColors = useMemo(() => {
    return categoryData.map((cat, i) => ({
      ...cat,
      color: getCategoryColor(i),
    }));
  }, [categoryData]);

  // Memoized grid layout
  const categories = useMemo(
    () =>
      calculateGridLayout(
        categoriesWithColors,
        containerWidth,
        containerHeight,
        isMobile
      ),
    [categoriesWithColors, containerWidth, containerHeight, isMobile]
  );

  // Memoized skill items with colors
  const skillItems = useMemo(() => {
    return skills.map((skill) => ({
      ...skill,
      color:
        categoriesWithColors.find((cat) => cat.name === skill.category)
          ?.color || BRAND_GRADIENT[0],
    }));
  }, [categoriesWithColors]);

  // Memoized filtered skills for selected category
  const selectedCategorySkills = useMemo(() => {
    if (!selectedCategory) return [];
    return skillItems.filter((skill) => skill.category === selectedCategory);
  }, [skillItems, selectedCategory]);

  useEffect(() => {
    if (visibleSection === "skills") {
      setSelectedCategory(null);
      setHoveredCategory(null);
    }
  }, [visibleSection]);

  // Reset hover state when selectedCategory changes
  useEffect(() => {
    if (selectedCategory === null) {
      setHoveredCategory(null);
    }
  }, [selectedCategory]);

  // Show loading state during hydration
  if (!isClient) {
    return (
      <section
        id="skills"
        className="min-h-screen flex flex-col justify-center section-padding relative overflow-hidden"
      >
        <div className="px-4 md:px-6 w-full max-w-full mx-auto flex-1 flex items-center justify-center relative z-10">
          <div className="w-full max-w-6xl flex justify-center">
            <div className="animate-pulse">
              <div className="w-80 h-80 bg-gray-300/20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="skills"
      className="min-h-screen flex flex-col justify-center section-padding relative overflow-hidden"
    >
      <div className="cyber-grid pointer-events-none w-full h-full left-0 top-0 absolute overflow-x-hidden" />

      <div className="px-4 md:px-6 w-full max-w-full mx-auto flex-1 flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl flex justify-center relative"
        >
          {/* Skills Table View - Show when category is selected */}
          {selectedCategory && (
            <div
              className={`w-full h-full flex flex-col overflow-hidden ${
                !isMobile ? "max-w-2xl mx-auto" : ""
              }`}
            >
              {/* Header with back button */}
              <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Back
                </button>
              </div>

              {/* Scrollable Skills container - 2 column layout */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="grid grid-cols-2 gap-6 pb-8 w-full">
                  {/* Left Column */}
                  <div className="space-y-1">
                    {selectedCategorySkills
                      .slice(0, Math.ceil(selectedCategorySkills.length / 2))
                      .map((skill, index) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex items-center justify-between py-2 px-3 border-b border-white/10"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium text-sm truncate">
                              {skill.name}
                            </div>
                          </div>
                          <div className="text-xs text-white/70 ml-3 flex-shrink-0">
                            {skill.level}
                          </div>
                        </motion.div>
                      ))}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-1">
                    {selectedCategorySkills
                      .slice(Math.ceil(selectedCategorySkills.length / 2))
                      .map((skill, index) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay:
                              (Math.ceil(selectedCategorySkills.length / 2) +
                                index) *
                              0.05,
                          }}
                          className="flex items-center justify-between py-2 px-3 border-b border-white/10"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium text-sm truncate">
                              {skill.name}
                            </div>
                          </div>
                          <div className="text-xs text-white/70 ml-3 flex-shrink-0">
                            {skill.level}
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Treemap View - Show when no category is selected */}
          {!selectedCategory && (
            <div className="flex flex-col items-center">
              {/* Grid Container */}
              <div
                className="relative"
                style={{
                  width: containerWidth,
                  height: containerHeight,
                }}
              >
                {categories.map((cat) => {
                  const isHovered = hoveredCategory === cat.name;

                  return (
                    <div
                      key={cat.name}
                      className="absolute bg-cyber-dark/5 backdrop-blur-md border border-cyber-dark/10 shadow-lg rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-cyber-purple/10 hover:via-cyber-blue/10 hover:to-cyber-pink/10 hover:shadow-xl"
                      style={{
                        left: cat.x,
                        top: cat.y,
                        width: cat.width,
                        height: cat.height,
                      }}
                      onMouseEnter={() => setHoveredCategory(cat.name)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      onClick={() => setSelectedCategory(cat.name)}
                    >
                      <div className="h-full flex flex-col items-center justify-center p-2 text-center">
                        {/* Category Name */}
                        <div
                          className={`font-medium leading-tight transition-all duration-300 ${
                            isHovered ? "gradient-text" : "text-cyber-blue"
                          }`}
                          style={{
                            fontSize: isMobile ? "10px" : "12px",
                            lineHeight: "1.2",
                            textShadow: "0 1px 1px rgba(0,0,0,0.1)",
                            letterSpacing: "0.01em",
                            fontFamily:
                              "Inter, 'SF Pro Text', 'Helvetica Neue', sans-serif",
                          }}
                        >
                          {cat.name}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export { Skills };
