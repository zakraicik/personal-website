"use client";

import React, { useState, useEffect } from "react";
import { skills } from "@/data/skills";
import { motion } from "framer-motion";
import { useSectionVisibility } from "@/context/SectionVisibilityContext";

interface Category {
  name: string;
  color: string;
  startAngle: number;
  endAngle: number;
  midAngle: number;
  startRad: number;
  endRad: number;
  midRad: number;
  innerStart: { x: number; y: number };
  innerEnd: { x: number; y: number };
  outerStart: { x: number; y: number };
  outerEnd: { x: number; y: number };
  mid: { x: number; y: number };
}

interface SkillSegment {
  name: string;
  level: string;
  category: string;
  parentCategory: string;
  startAngle: number;
  endAngle: number;
  midAngle: number;
  startRad: number;
  endRad: number;
  midRad: number;
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  midPoint: { x: number; y: number };
  color: string;
}

interface Divider {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

// Brand gradient stops
const BRAND_GRADIENT = [
  "#8A2BE2", // purple
  "#00BFFF", // blue
  "#FF1493", // pink
];

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

// Helper: darken a hex color by a factor (0 = black, 1 = original)
function darkenColor(hex: string, factor: number = 0.7): string {
  const c = hex.startsWith("#") ? hex.substring(1) : hex;
  const r = Math.round(parseInt(c.substring(0, 2), 16) * factor);
  const g = Math.round(parseInt(c.substring(2, 4), 16) * factor);
  const b = Math.round(parseInt(c.substring(4, 6), 16) * factor);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Helper: lighten a hex color by a factor (0 = white, 1 = original)
function lightenColor(hex: string, factor: number = 0.7): string {
  const c = hex.startsWith("#") ? hex.substring(1) : hex;
  const r = Math.round(
    parseInt(c.substring(0, 2), 16) +
      (255 - parseInt(c.substring(0, 2), 16)) * (1 - factor)
  );
  const g = Math.round(
    parseInt(c.substring(2, 4), 16) +
      (255 - parseInt(c.substring(2, 4), 16)) * (1 - factor)
  );
  const b = Math.round(
    parseInt(c.substring(4, 6), 16) +
      (255 - parseInt(c.substring(4, 6), 16)) * (1 - factor)
  );
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
    if (stop >= stops) stop = stops - 1; // Clamp to valid range
    const localT = stop === stops - 1 ? 1 : (t - stop / stops) * stops;
    colors.push(
      interpolateColor(BRAND_GRADIENT[stop], BRAND_GRADIENT[stop + 1], localT)
    );
  }
  return colors;
}

// Add debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Add transition styles for SVG groups
const transitionStyles = `
.skills-animated {
  transition: transform 0.6s cubic-bezier(.4,1,.6,1);
}
.categories-animated, .dividers-animated {
  transition: opacity 0.4s cubic-bezier(.4,1,.6,1);
}
`;

const Skills = () => {
  // Chart dimensions
  const width = 500;
  const height = 500;
  const centerX = width / 2;
  const centerY = height / 2;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Zoom effect: if a category is selected, make the inner ring much larger
  const ZOOMED_SKILLS_RADIUS = 180;
  const ZOOMED_OUTER_RADIUS = 250;
  const skillsRadius = selectedCategory ? ZOOMED_SKILLS_RADIUS : 100;
  const outerRadius = selectedCategory ? ZOOMED_OUTER_RADIUS : 150;
  const innerRadius = skillsRadius;

  // Gap between categories in degrees
  const CATEGORY_GAP_DEGREES = 0;
  // Gap and angle per skill (thicker bars in zoomed-in mode)
  const SKILL_GAP_DEGREES = selectedCategory ? 2 : 5;

  // State (no interactivity)
  const [categories, setCategories] = useState<Category[]>([]);
  const [skillSegments, setSkillSegments] = useState<SkillSegment[]>([]);
  const [dividers, setDividers] = useState<Divider[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const debouncedHoveredCategory = useDebounce(hoveredCategory, 50);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const { visibleSection } = useSectionVisibility();

  useEffect(() => {
    if (visibleSection === "skills") {
      setSelectedCategory(null);
      setHoveredSkill(null);
      setHoveredCategory(null);
    }
  }, [visibleSection]);

  // Calculate rotation for centering selected category's visible arc on horizontal axis
  let skillGroupRotation = 0;
  if (selectedCategory) {
    const selectedCat = categories.find((cat) => cat.name === selectedCategory);
    if (selectedCat) {
      const catMidAngle = (selectedCat.startAngle + selectedCat.endAngle) / 2;

      skillGroupRotation = 0 - catMidAngle;
    }
  }

  // Initialize data
  useEffect(() => {
    // Get unique categories
    const categoryList = Array.from(new Set(skills.map((s) => s.category)));
    const numCategories = categoryList.length;
    const totalGap = CATEGORY_GAP_DEGREES * numCategories;
    const availableAngle = 360 - totalGap;

    // Generate sequential gradient colors for categories
    const gradientColors = generateCategoryColors(numCategories);
    const categoryColors: Record<string, string> = {};
    categoryList.forEach((cat, i) => {
      categoryColors[cat] = gradientColors[i];
    });

    // Calculate category data with gaps
    const total = skills.length;
    let startAngle = 0;

    const catData = categoryList.map((catName, idx) => {
      const catSkills = skills.filter((s) => s.category === catName);
      const angle = (catSkills.length / total) * availableAngle;
      const endAngle = startAngle + angle;
      const midAngle = startAngle + angle / 2;

      // Convert angles to radians
      const startRad = ((startAngle - 90) * Math.PI) / 180;
      const endRad = ((endAngle - 90) * Math.PI) / 180;
      const midRad = ((midAngle - 90) * Math.PI) / 180;

      // Calculate points
      const category: Category = {
        name: catName,
        color: categoryColors[catName],
        startAngle,
        endAngle,
        midAngle,
        startRad,
        endRad,
        midRad,
        innerStart: {
          x: centerX + innerRadius * Math.cos(startRad),
          y: centerY + innerRadius * Math.sin(startRad),
        },
        innerEnd: {
          x: centerX + innerRadius * Math.cos(endRad),
          y: centerY + innerRadius * Math.sin(endRad),
        },
        outerStart: {
          x: centerX + outerRadius * Math.cos(startRad),
          y: centerY + outerRadius * Math.sin(startRad),
        },
        outerEnd: {
          x: centerX + outerRadius * Math.cos(endRad),
          y: centerY + outerRadius * Math.sin(endRad),
        },
        mid: {
          x: centerX + ((innerRadius + outerRadius) / 2) * Math.cos(midRad),
          y: centerY + ((innerRadius + outerRadius) / 2) * Math.sin(midRad),
        },
      };

      startAngle = endAngle + CATEGORY_GAP_DEGREES; // Add gap after each category
      return category;
    });

    setCategories(catData);

    // Create divider lines
    const dividerLines = catData.flatMap((cat) => [
      {
        id: `divider-start-${cat.name}`,
        x1: centerX,
        y1: centerY,
        x2: cat.outerStart.x,
        y2: cat.outerStart.y,
        color: cat.color,
      },
      {
        id: `divider-end-${cat.name}`,
        x1: centerX,
        y1: centerY,
        x2: cat.outerEnd.x,
        y2: cat.outerEnd.y,
        color: cat.color,
      },
    ]);

    setDividers(dividerLines);

    // Calculate skill segments (no gap between skills)
    const skillData: SkillSegment[] = [];

    catData.forEach((cat) => {
      const catSkills = skills.filter((s) => s.category === cat.name);
      const totalSkills = catSkills.length;
      let skillStartAngle = cat.startAngle;

      // If category is selected, center the segments and use dynamic min angle
      let minSkillAngle = 0;
      if (selectedCategory === cat.name) {
        const span = totalSkills > 5 ? 180 : 90;
        const totalGaps = totalSkills - 1;
        const totalGapAngle = totalGaps * SKILL_GAP_DEGREES;
        minSkillAngle = (span - totalGapAngle) / totalSkills;
        // Center the arc on the original category's midpoint
        const catMidAngle = (cat.startAngle + cat.endAngle) / 2;
        skillStartAngle = catMidAngle - span / 2;
      }

      catSkills.forEach((skill, idx) => {
        const availableAngle = cat.endAngle - cat.startAngle;
        const totalGaps = selectedCategory === cat.name ? totalSkills - 1 : 0;
        const totalGapAngle = totalGaps * SKILL_GAP_DEGREES;
        const skillAngle =
          selectedCategory === cat.name
            ? minSkillAngle
            : (availableAngle - totalGapAngle) / totalSkills;
        const skillEndAngle = skillStartAngle + skillAngle;
        const skillMidAngle = skillStartAngle + skillAngle / 2;

        // Convert to radians
        const startRad = ((skillStartAngle - 90) * Math.PI) / 180;
        const endRad = ((skillEndAngle - 90) * Math.PI) / 180;
        const midRad = ((skillMidAngle - 90) * Math.PI) / 180;

        skillData.push({
          ...skill,
          parentCategory: cat.name,
          startAngle: skillStartAngle,
          endAngle: skillEndAngle,
          midAngle: skillMidAngle,
          startRad,
          endRad,
          midRad,
          startPoint: {
            x: centerX + skillsRadius * Math.cos(startRad),
            y: centerY + skillsRadius * Math.sin(startRad),
          },
          endPoint: {
            x: centerX + skillsRadius * Math.cos(endRad),
            y: centerY + skillsRadius * Math.sin(endRad),
          },
          midPoint: {
            x: centerX + (skillsRadius / 2) * Math.cos(midRad),
            y: centerY + (skillsRadius / 2) * Math.sin(midRad),
          },
          color: cat.color,
        });

        // Add gap after each skill if category is selected
        skillStartAngle =
          skillEndAngle +
          (selectedCategory === cat.name ? SKILL_GAP_DEGREES : 0);
      });
    });

    setSkillSegments(skillData);
  }, [selectedCategory]);

  // Create arc path for categories
  const createCategoryPath = (cat: Category) => {
    // Determine if arc is large or small
    const largeArc = cat.endAngle - cat.startAngle > 180 ? 1 : 0;

    return `
      M ${cat.innerStart.x} ${cat.innerStart.y}
      L ${cat.outerStart.x} ${cat.outerStart.y}
      A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${cat.outerEnd.x} ${cat.outerEnd.y}
      L ${cat.innerEnd.x} ${cat.innerEnd.y}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${cat.innerStart.x} ${cat.innerStart.y}
      Z
    `;
  };

  // Create arc path for skills
  const createSkillPath = (skill: SkillSegment) => {
    const largeArc = skill.endAngle - skill.startAngle > 180 ? 1 : 0;

    return `
      M ${centerX} ${centerY}
      L ${skill.startPoint.x} ${skill.startPoint.y}
      A ${skillsRadius} ${skillsRadius} 0 ${largeArc} 1 ${skill.endPoint.x} ${skill.endPoint.y}
      Z
    `;
  };

  return (
    <section
      id="skills"
      className="min-h-screen flex flex-col justify-center section-padding relative overflow-hidden"
    >
      <div className="px-4 md:px-6 w-full max-w-full mx-auto flex-1 flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl"
        >
          <style>{transitionStyles}</style>
          <svg
            width={width}
            height={height}
            viewBox={`-50 -50 ${width + 100} ${height + 100}`}
            className="mx-auto"
          >
            {/* Filters */}
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="3"
                  floodColor="#00BFFF"
                  floodOpacity="0.25"
                />
              </filter>
              <filter
                id="shadow-strong"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feDropShadow
                  dx="0"
                  dy="4"
                  stdDeviation="7"
                  floodColor="#00BFFF"
                  floodOpacity="0.5"
                />
              </filter>
              <filter
                id="glass-blur"
                x="-10%"
                y="-10%"
                width="120%"
                height="120%"
              >
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.7" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Add gradient definitions for each category */}
              {categories.map((cat, i) => {
                // Sanitize category name for SVG id
                const safeId = cat.name.replace(/[^a-zA-Z0-9_-]/g, "-");
                return (
                  <linearGradient
                    key={`gradient-${i}`}
                    id={`gradient-${safeId}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor={darkenColor(cat.color, 0.8)}
                      stopOpacity="0.9"
                    />
                    <stop
                      offset="60%"
                      stopColor={cat.color}
                      stopOpacity="0.7"
                    />
                    <stop
                      offset="100%"
                      stopColor={cat.color}
                      stopOpacity="0.5"
                    />
                  </linearGradient>
                );
              })}
            </defs>

            {/* Categories - outer ring */}
            <g
              className="categories categories-animated"
              style={{
                opacity: !selectedCategory ? 1 : 0,
                pointerEvents: !selectedCategory ? "auto" : "none",
              }}
            >
              {!selectedCategory &&
                categories.map((cat, i) => {
                  const darkColor = darkenColor(cat.color, 0.7);
                  // Pop out effect on hover
                  const isHovered = debouncedHoveredCategory === cat.name;
                  const popDistance = isHovered ? 18 : 0;
                  const midAngleRad =
                    (((cat.startAngle + cat.endAngle) / 2 - 90) * Math.PI) /
                    180;
                  const dx = Math.cos(midAngleRad) * popDistance;
                  const dy = Math.sin(midAngleRad) * popDistance;
                  return (
                    <path
                      key={`cat-${i}`}
                      d={createCategoryPath(cat)}
                      fill={`url(#gradient-${cat.name.replace(
                        /[^a-zA-Z0-9_-]/g,
                        "-"
                      )})`}
                      opacity={1}
                      filter="url(#glass-blur)"
                      stroke={cat.color}
                      strokeWidth={1}
                      style={{
                        cursor: "pointer",
                        transition: "transform 0.25s cubic-bezier(.4,2,.6,1)",
                        transform: `translate(${dx}px, ${dy}px)`,
                      }}
                      onMouseEnter={() => {
                        if (!selectedCategory) setHoveredCategory(cat.name);
                      }}
                      onMouseLeave={() => {
                        if (!selectedCategory) setHoveredCategory(null);
                      }}
                      onClick={() => {
                        setHoveredCategory(null);
                        setSelectedCategory(
                          selectedCategory === cat.name ? null : cat.name
                        );
                      }}
                    />
                  );
                })}
            </g>

            {/* Category Labels */}
            {!selectedCategory &&
              debouncedHoveredCategory &&
              (() => {
                const cat = categories.find(
                  (c) => c.name === debouncedHoveredCategory
                );
                if (!cat) return null;

                // Position the label further out from the segment
                const labelDistance = outerRadius + 60;

                // Calculate the position for the center of our label
                const labelRad = ((cat.midAngle - 90) * Math.PI) / 180;
                const labelX = centerX + labelDistance * Math.cos(labelRad);
                const labelY = centerY + labelDistance * Math.sin(labelRad);

                // Determine if the label should be flipped based on angle
                const isBottomHalf = cat.midAngle > 90 && cat.midAngle < 270;

                // Calculate dimensions for our grid
                const gridHeight = 60;
                const gridWidth = 130;
                const chipHeight = 22;
                const nameHeight = 16;
                const spacing = 15;

                // Dynamically size the chip based on the level text length
                const levelText = skillSegments.filter(
                  (s) => s.category === cat.name
                )[0].level;
                const chipWidth = Math.max(60, levelText.length * 8 + 10); // 8px per char + 10px padding

                // Translate and rotate to position the grid
                let transform = `translate(${labelX},${labelY})`;

                // Rotate to keep text horizontal
                const rotationAngle = isBottomHalf
                  ? cat.midAngle + 180
                  : cat.midAngle;
                transform += ` rotate(${rotationAngle})`;

                // Translate to center the grid
                transform += ` translate(${-gridWidth / 2},${-gridHeight / 2})`;

                // Colors
                const textColor = isBottomHalf
                  ? darkenColor(cat.color, 0.9)
                  : darkenColor(cat.color, 0.8);
                const chipBgColor = cat.color;
                const chipTextColor = "#fff";

                const chipText = `${
                  skillSegments.filter((s) => s.category === cat.name).length
                } skills`;

                return (
                  <g transform={transform} style={{ pointerEvents: "none" }}>
                    {/* Category name - top row */}
                    <text
                      x={gridWidth / 2}
                      y={nameHeight}
                      fontSize="14px"
                      fontWeight="500"
                      fill={textColor}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        fontFamily:
                          "'Inter', 'SF Pro Text', 'Helvetica Neue', sans-serif",
                        letterSpacing: "0.01em",
                        textShadow: "0 1px 1px rgba(0,0,0,0.1)",
                      }}
                    >
                      {cat.name}
                    </text>

                    {/* Skills count chip - bottom row */}
                    <rect
                      x={(gridWidth - chipWidth) / 2}
                      y={nameHeight + spacing}
                      width={chipWidth}
                      height={chipHeight}
                      rx="11"
                      ry="11"
                      fill={chipBgColor}
                      opacity="0.9"
                    />

                    <text
                      x={gridWidth / 2}
                      y={nameHeight + spacing + chipHeight / 2}
                      fontSize="12px"
                      fontWeight="600"
                      fill={chipTextColor}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        fontFamily:
                          "'Inter', 'SF Pro Text', 'Helvetica Neue', sans-serif",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {chipText}
                    </text>
                  </g>
                );
              })()}

            {/* Skills - inner pie */}
            <g
              className="skills skills-animated"
              transform={
                selectedCategory
                  ? `rotate(${skillGroupRotation}, ${centerX}, ${centerY})`
                  : undefined
              }
              style={{
                transition:
                  "transform 0.6s cubic-bezier(.4,1,.6,1), scale 0.6s cubic-bezier(.4,1,.6,1)",
              }}
            >
              {skillSegments
                .filter(
                  (skill) =>
                    !selectedCategory || skill.category === selectedCategory
                )
                .map((skill, i) => {
                  // Pop out effect for skills in hovered category or hovered skill
                  let dx = 0,
                    dy = 0;
                  // Standardize pop-out effect for both states
                  let isPop = false;
                  let popCategory = null;
                  if (
                    !selectedCategory &&
                    debouncedHoveredCategory &&
                    skill.category === debouncedHoveredCategory
                  ) {
                    isPop = true;
                    popCategory = categories.find(
                      (c) => c.name === debouncedHoveredCategory
                    );
                  } else if (selectedCategory && hoveredSkill === skill.name) {
                    isPop = true;
                    popCategory = categories.find(
                      (c) => c.name === selectedCategory
                    );
                  }
                  if (isPop && popCategory) {
                    const popDistance = 18;
                    // For selected state, use the skill's midAngle; for unselected, use category's midAngle
                    const angle = selectedCategory
                      ? skill.midAngle
                      : (popCategory.startAngle + popCategory.endAngle) / 2;
                    const midAngleRad = ((angle - 90) * Math.PI) / 180;
                    dx = Math.cos(midAngleRad) * popDistance;
                    dy = Math.sin(midAngleRad) * popDistance;
                  }
                  // Gradient fill for selected state
                  let fillColor = `${skill.color}99`;
                  if (selectedCategory && skill.category === selectedCategory) {
                    const cat = categories.find(
                      (c) => c.name === selectedCategory
                    );
                    if (cat) {
                      const catSkills = skillSegments.filter(
                        (s) => s.category === selectedCategory
                      );
                      const idx = catSkills.findIndex(
                        (s) => s.name === skill.name
                      );
                      const n = catSkills.length;
                      // Interpolate from light to dark
                      const baseColor = cat.color;
                      const light = lightenColor(baseColor, 0.7);
                      const dark = darkenColor(baseColor, 0.7);
                      const t = n > 1 ? idx / (n - 1) : 0;
                      fillColor = interpolateColor(light, dark, t) + "ee"; // subtle alpha
                    }
                  }
                  // Add hover handlers for inner segments
                  const handleEnter = () => {
                    if (!selectedCategory) setHoveredCategory(skill.category);
                  };
                  const handleLeave = () => {
                    if (!selectedCategory) setHoveredCategory(null);
                  };
                  return (
                    <path
                      key={`skill-${i}`}
                      d={createSkillPath(skill)}
                      fill={fillColor}
                      stroke={skill.color}
                      strokeWidth={1}
                      filter={"url(#shadow)"}
                      style={{
                        transition: "transform 0.25s cubic-bezier(.4,2,.6,1)",
                        transform: `translate(${dx}px, ${dy}px)`,
                      }}
                      onMouseEnter={() => {
                        if (!selectedCategory)
                          setHoveredCategory(skill.category);
                        if (selectedCategory) setHoveredSkill(skill.name);
                      }}
                      onMouseLeave={() => {
                        if (!selectedCategory) setHoveredCategory(null);
                        if (selectedCategory) setHoveredSkill(null);
                      }}
                      onClick={() => {
                        setHoveredCategory(null);
                        setSelectedCategory(
                          selectedCategory === skill.category
                            ? null
                            : skill.category
                        );
                      }}
                    />
                  );
                })}
              {/* Render skill label as SVG text along arc ONLY when a skill is hovered in selected state */}
              {selectedCategory &&
                hoveredSkill &&
                (() => {
                  const skill = skillSegments.find(
                    (s) =>
                      s.name === hoveredSkill && s.category === selectedCategory
                  );
                  const cat = categories.find(
                    (c) => c.name === selectedCategory
                  );
                  if (!skill || !cat) return null;

                  // Adjust angle to account for rotation
                  const adjustedAngle =
                    (skill.midAngle + skillGroupRotation) % 360;

                  // Add hover offset for the selected skill
                  const popDistance = 18;
                  const midAngleRad = ((skill.midAngle - 90) * Math.PI) / 180;
                  const hoverOffsetX = Math.cos(midAngleRad) * popDistance;
                  const hoverOffsetY = Math.sin(midAngleRad) * popDistance;

                  // Position the label further out from the segment
                  const labelDistance = skillsRadius + 40;

                  // Calculate the position for the center of our label
                  const labelRad = ((skill.midAngle - 90) * Math.PI) / 180;
                  const labelX =
                    centerX + labelDistance * Math.cos(labelRad) + hoverOffsetX;
                  const labelY =
                    centerY + labelDistance * Math.sin(labelRad) + hoverOffsetY;

                  // Determine if the label should be flipped based on adjusted angle
                  const isBottomHalf =
                    adjustedAngle > 90 && adjustedAngle < 270;

                  // Calculate dimensions for our grid
                  const gridHeight = 60;
                  const gridWidth = 130;
                  const chipHeight = 22;
                  const nameHeight = 16;
                  const spacing = 15;

                  // Dynamically size the chip based on the level text length
                  const levelText = skill.level;
                  const chipWidth = Math.max(60, levelText.length * 8 + 10); // 8px per char + 10px padding

                  // Translate and rotate to position the grid
                  let transform = `translate(${labelX},${labelY})`;

                  // Rotate to keep text horizontal
                  const rotationAngle = isBottomHalf
                    ? skill.midAngle + 180
                    : skill.midAngle;
                  transform += ` rotate(${rotationAngle})`;

                  // Translate to center the grid
                  transform += ` translate(${-gridWidth / 2},${
                    -gridHeight / 2
                  })`;

                  // Colors
                  const textColor = isBottomHalf
                    ? darkenColor(skill.color, 0.9)
                    : darkenColor(skill.color, 0.8);
                  const chipBgColor = skill.color;
                  const chipTextColor = "#fff";

                  return (
                    <g transform={transform} style={{ pointerEvents: "none" }}>
                      {/* Skill name - top row */}
                      <text
                        x={gridWidth / 2}
                        y={nameHeight}
                        fontSize="14px"
                        fontWeight="500"
                        fill={textColor}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{
                          fontFamily:
                            "'Inter', 'SF Pro Text', 'Helvetica Neue', sans-serif",
                          letterSpacing: "0.01em",
                          textShadow: "0 1px 1px rgba(0,0,0,0.1)",
                        }}
                      >
                        {skill.name}
                      </text>

                      {/* Level chip - bottom row with wider width */}
                      <rect
                        x={(gridWidth - chipWidth) / 2}
                        y={nameHeight + spacing}
                        width={chipWidth}
                        height={chipHeight}
                        rx="11"
                        ry="11"
                        fill={chipBgColor}
                        opacity="0.9"
                      />

                      <text
                        x={gridWidth / 2}
                        y={nameHeight + spacing + chipHeight / 2}
                        fontSize="12px"
                        fontWeight="600"
                        fill={chipTextColor}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{
                          fontFamily:
                            "'Inter', 'SF Pro Text', 'Helvetica Neue', sans-serif",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {skill.level}
                      </text>
                    </g>
                  );
                })()}
            </g>

            {/* Divider lines for outer ring */}
            <g
              className="dividers dividers-animated"
              style={{
                opacity: !selectedCategory ? 1 : 0,
                pointerEvents: !selectedCategory ? "auto" : "none",
              }}
            >
              {!selectedCategory &&
                categories.map((cat, i) => {
                  const isHovered = debouncedHoveredCategory === cat.name;
                  const popDistance = isHovered ? 18 : 0;
                  const midAngleRad =
                    (((cat.startAngle + cat.endAngle) / 2 - 90) * Math.PI) /
                    180;
                  const dx = Math.cos(midAngleRad) * popDistance;
                  const dy = Math.sin(midAngleRad) * popDistance;
                  return (
                    <g
                      key={`divider-${i}`}
                      style={{
                        transition: "transform 0.25s cubic-bezier(.4,2,.6,1)",
                        transform: `translate(${dx}px, ${dy}px)`,
                      }}
                    >
                      {/* Start divider */}
                      <line
                        x1={centerX}
                        y1={centerY}
                        x2={cat.outerStart.x}
                        y2={cat.outerStart.y}
                        stroke={cat.color}
                        strokeWidth={1}
                        strokeLinecap="round"
                      />
                      {/* End divider */}
                      <line
                        x1={centerX}
                        y1={centerY}
                        x2={cat.outerEnd.x}
                        y2={cat.outerEnd.y}
                        stroke={cat.color}
                        strokeWidth={1}
                        strokeLinecap="round"
                      />
                    </g>
                  );
                })}
            </g>
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export { Skills };
