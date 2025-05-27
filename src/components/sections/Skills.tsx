"use client";

import React, { useState, useEffect } from "react";
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
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

// Helper: interpolate between two hex colors
function interpolateColor(
  color1: string,
  color2: string,
  factor: number
): string {
  const c1 = color1.startsWith("#") ? color1.substring(1) : color1;
  const c2 = color2.startsWith("#") ? color2.substring(1) : color2;
  const r1 = parseInt(c1.substring(0, 2), 16);
  const g1 = parseInt(c1.substring(2, 4), 16);
  const b1 = parseInt(c1.substring(4, 6), 16);
  const r2 = parseInt(c2.substring(0, 2), 16);
  const g2 = parseInt(c2.substring(2, 4), 16);
  const b2 = parseInt(c2.substring(4, 6), 16);
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Generate a sequential gradient palette for N categories
function generateCategoryColors(n: number): string[] {
  if (n === 1) return [BRAND_GRADIENT[1]];
  const stops = BRAND_GRADIENT.length - 1;
  const colors: string[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    let stop = Math.floor(t * stops);
    if (stop >= stops) stop = stops - 1;
    const localT = stop === stops - 1 ? 1 : (t - stop / stops) * stops;
    colors.push(
      interpolateColor(BRAND_GRADIENT[stop], BRAND_GRADIENT[stop + 1], localT)
    );
  }
  return colors;
}

// Custom hook to prevent hydration mismatch
function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

// Simple equal-sized grid layout with mobile optimization
function calculateGridLayout(
  categories: Array<{ name: string; skillCount: number; color: string }>,
  width: number,
  height: number,
  isMobile: boolean
): Category[] {
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
}

const Skills = () => {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isClient = useIsClient();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [skillItems, setSkillItems] = useState<SkillItem[]>([]);

  const { visibleSection } = useSectionVisibility();

  // Container dimensions - made smaller and more compact, taller on mobile for 2-column layout
  const containerWidth = isMobile ? Math.min(width * 0.9, 350) : 600;
  const containerHeight = isMobile ? 400 : 400;

  useEffect(() => {
    if (visibleSection === "skills") {
      setSelectedCategory(null);
      setHoveredCategory(null);
    }
  }, [visibleSection]);

  // Reset hover state when selectedCategory changes (especially important for mobile)
  useEffect(() => {
    if (selectedCategory === null) {
      setHoveredCategory(null);
    }
  }, [selectedCategory]);

  // Initialize data
  useEffect(() => {
    // Get unique categories and their skill counts
    const categoryList = Array.from(new Set(skills.map((s) => s.category)));
    const categoryData = categoryList.map((catName) => ({
      name: catName,
      skillCount: skills.filter((s) => s.category === catName).length,
      color: "",
    }));

    // Generate colors
    const gradientColors = generateCategoryColors(categoryList.length);
    categoryData.forEach((cat, i) => {
      cat.color = gradientColors[i];
    });

    // Calculate treemap layout
    const gridCategories = calculateGridLayout(
      categoryData,
      containerWidth,
      containerHeight,
      isMobile
    );
    setCategories(gridCategories);

    // Prepare skill items with colors
    const skillsWithColors = skills.map((skill) => ({
      ...skill,
      color:
        categoryData.find((cat) => cat.name === skill.category)?.color ||
        BRAND_GRADIENT[0],
    }));
    setSkillItems(skillsWithColors);
  }, [containerWidth, containerHeight]);

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
      <style jsx>{`
        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 rgba(138, 43, 226, 0);
          }
          50% {
            transform: scale(1.015);
            box-shadow: 0 0 12px rgba(138, 43, 226, 0.15),
              0 0 24px rgba(0, 191, 255, 0.1);
          }
        }
        @keyframes breatheBlue {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 rgba(0, 191, 255, 0);
          }
          50% {
            transform: scale(1.015);
            box-shadow: 0 0 12px rgba(0, 191, 255, 0.15),
              0 0 24px rgba(255, 20, 147, 0.1);
          }
        }
        @keyframes breathePink {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 rgba(255, 20, 147, 0);
          }
          50% {
            transform: scale(1.015);
            box-shadow: 0 0 12px rgba(255, 20, 147, 0.15),
              0 0 24px rgba(138, 43, 226, 0.1);
          }
        }
      `}</style>
      <div className="cyber-grid pointer-events-none w-full h-full left-0 top-0 absolute overflow-x-hidden" />

      <div className="px-4 md:px-6 w-full max-w-full mx-auto flex-1 flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl flex justify-center relative"
        >
          {/* Skills Table View - Show when category is selected (both mobile and desktop) */}
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

              {/* Scrollable Skills container - single column table style */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="space-y-1 pb-8 w-full">
                  {skillItems
                    .filter((skill) => skill.category === selectedCategory)
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
              </div>
            </div>
          )}

          {/* Treemap View - Show when no category is selected */}
          {!selectedCategory && (
            <div className="flex flex-col items-center">
              {/* Grid Container - using portfolio styling */}
              <div
                className="relative"
                style={{
                  width: containerWidth,
                  height: containerHeight,
                }}
              >
                {categories.map((cat, i) => {
                  const isHovered = hoveredCategory === cat.name;

                  return (
                    <div
                      key={cat.name}
                      className="absolute bg-cyber-dark/5 backdrop-blur-md border border-cyber-dark/10 shadow-lg rounded-lg cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-cyber-purple/10 hover:via-cyber-blue/10 hover:to-cyber-pink/10"
                      style={{
                        left: cat.x,
                        top: cat.y,
                        width: cat.width,
                        height: cat.height,
                        transform: isHovered ? "scale(1.02)" : "scale(1)",
                        // Only apply breathing animation on desktop
                        animation: !isMobile
                          ? `${
                              i % 3 === 0
                                ? "breathe"
                                : i % 3 === 1
                                ? "breatheBlue"
                                : "breathePink"
                            } ${5 + i * 0.3}s ease-in-out infinite`
                          : "none",
                      }}
                      onMouseEnter={() => setHoveredCategory(cat.name)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      onClick={() => setSelectedCategory(cat.name)}
                    >
                      <div className="h-full flex flex-col items-center justify-center p-2 text-center">
                        {/* Category Name */}
                        <div
                          className={`font-medium leading-tight transition-all duration-300 ${
                            isHovered ? "gradient-text" : "text-white/90"
                          }`}
                          style={{
                            fontSize: isMobile ? "10px" : "12px",
                            lineHeight: "1.2",
                            textShadow: !isHovered
                              ? "0 1px 2px rgba(0,0,0,0.2)"
                              : "none",
                            letterSpacing: "0.01em",
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
