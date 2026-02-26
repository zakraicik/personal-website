"use client";

import React, { useState, useEffect, useMemo } from "react";
import { skills } from "@/data/skills";
import { motion } from "framer-motion";
import { useSectionVisibility } from "@/context/SectionVisibilityContext";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { useIsClient } from "@/hooks/useIsClient";

interface Category {
  name: string;
  color: string;
  skillCount: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

const BRAND_GRADIENT = [
  "#8A2BE2", // purple
  "#00BFFF", // blue
  "#FF1493", // pink
];

// Static data processing moved outside component
const getCategoryColor = (index: number): string => {
  return BRAND_GRADIENT[index % BRAND_GRADIENT.length];
};

// Pre-process categories and their colors
const categoryList = Array.from(new Set(skills.map((s) => s.category)));
const categoryData = categoryList.map((catName, i) => ({
  name: catName,
  skillCount: skills.filter((s) => s.category === catName).length,
  color: getCategoryColor(i),
}));

// Pre-process skills with their colors
const skillItems = skills.map((skill) => ({
  ...skill,
  color:
    categoryData.find((cat) => cat.name === skill.category)?.color ||
    BRAND_GRADIENT[0],
}));

const calculateGridLayout = (
  categories: Array<{ name: string; skillCount: number; color: string }>,
  width: number,
  height: number,
  isMobile: boolean,
  isVerySmall: boolean
): Category[] => {
  const numCategories = categories.length;
  const cols = isVerySmall
    ? 2
    : isMobile
    ? 2
    : Math.ceil(Math.sqrt(numCategories));
  const rows = Math.ceil(numCategories / cols);

  const gapSize = isVerySmall ? 6 : isMobile ? 8 : 8;
  const boxWidth = Math.floor((width - (cols - 1) * gapSize) / cols);
  const boxHeight = Math.floor((height - (rows - 1) * gapSize) / rows);

  return categories.map((cat, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;

    return {
      name: cat.name,
      color: cat.color,
      skillCount: cat.skillCount,
      x: col * (boxWidth + gapSize),
      y: row * (boxHeight + gapSize),
      width: boxWidth,
      height: boxHeight,
    };
  });
};

const Skills = () => {
  const width = useWindowWidth({ debounceMs: 150 });
  const isMobile = width < 768;
  const isVerySmall = width < 375;
  const isClient = useIsClient();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const { visibleSection } = useSectionVisibility();

  const containerWidth = isVerySmall
    ? Math.min(width * 0.85, 300)
    : isMobile
    ? Math.min(width * 0.9, 350)
    : 600;
  const containerHeight = isVerySmall ? 350 : isMobile ? 400 : 400;

  // Only calculate grid layout when dimensions change
  const categories = useMemo(
    () =>
      calculateGridLayout(
        categoryData,
        containerWidth,
        containerHeight,
        isMobile,
        isVerySmall
      ),
    [containerWidth, containerHeight, isMobile, isVerySmall]
  );

  const selectedCategorySkills = useMemo(() => {
    if (!selectedCategory) return [];
    return skillItems.filter((skill) => skill.category === selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    if (visibleSection === "skills") {
      setSelectedCategory(null);
      setHoveredCategory(null);
    }
  }, [visibleSection]);

  useEffect(() => {
    if (selectedCategory === null) {
      setHoveredCategory(null);
    }
  }, [selectedCategory]);

  if (!isClient) {
    return (
      <div className="w-full max-w-6xl mx-auto flex justify-center">
        <div className="animate-pulse">
          <div className="w-60 xs:w-80 h-60 xs:h-80 bg-gray-300/20 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full flex justify-center relative"
      >
        {selectedCategory && (
          <div
            className={`w-full h-full flex flex-col overflow-hidden max-w-[320px] xs:max-w-full sm:max-w-4xl ${
              !isMobile ? "mx-auto" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-4 xs:mb-6 flex-shrink-0">
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-1 xs:gap-2 text-white/70 hover:text-white transition-colors text-xs xs:text-sm min-h-[44px] px-2"
              >
                <svg
                  width={isVerySmall ? "16" : "20"}
                  height={isVerySmall ? "16" : "20"}
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

            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <div
                className={`grid ${
                  isVerySmall ? "grid-cols-1" : "grid-cols-2"
                } gap-3 xs:gap-4 sm:gap-6 pb-6 xs:pb-8 w-full`}
              >
                {isVerySmall ? (
                  // Single column for very small screens
                  <div className="space-y-1">
                    {selectedCategorySkills.map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-center justify-between py-2 px-2 xs:px-3 border-b border-white/10"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium text-xs xs:text-sm truncate">
                            {skill.name}
                          </div>
                        </div>
                        <div className="text-[10px] xs:text-xs text-white/70 ml-2 xs:ml-3 flex-shrink-0">
                          {skill.level}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  // Two columns for larger screens
                  <>
                    <div className="space-y-1">
                      {selectedCategorySkills
                        .slice(0, Math.ceil(selectedCategorySkills.length / 2))
                        .map((skill, index) => (
                          <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.05,
                            }}
                            className="flex items-center justify-between py-2 px-2 xs:px-3 border-b border-white/10"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium text-xs xs:text-sm truncate">
                                {skill.name}
                              </div>
                            </div>
                            <div className="text-[10px] xs:text-xs text-white/70 ml-2 xs:ml-3 flex-shrink-0">
                              {skill.level}
                            </div>
                          </motion.div>
                        ))}
                    </div>

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
                            className="flex items-center justify-between py-2 px-2 xs:px-3 border-b border-white/10"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium text-xs xs:text-sm truncate">
                                {skill.name}
                              </div>
                            </div>
                            <div className="text-[10px] xs:text-xs text-white/70 ml-2 xs:ml-3 flex-shrink-0">
                              {skill.level}
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {!selectedCategory && (
          <div className="flex flex-col items-center">
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
                    className="glass-border cyber-glow absolute bg-cyber-dark/5 backdrop-blur-md border border-cyber-dark/10 shadow-lg rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-cyber-purple/10 hover:via-cyber-blue/10 hover:to-cyber-pink/10 hover:shadow-xl"
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
                    <div className="h-full flex flex-col items-center justify-center p-1 xs:p-2 text-center">
                      {/* Category Name */}
                      <div
                        className={`font-medium leading-tight transition-all duration-300 ${
                          isHovered ? "gradient-text" : "text-white"
                        }`}
                        style={{
                          fontSize: isVerySmall
                            ? "8px"
                            : isMobile
                            ? "10px"
                            : "12px",
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
  );
};

export { Skills };
