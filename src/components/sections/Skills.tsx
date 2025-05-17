"use client";

import React, { useState, useEffect } from "react";
import { skills } from "@/data/skills";

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

  // Calculate rotation for centering selected category's visible arc on horizontal axis
  let skillGroupRotation = 0;
  if (selectedCategory) {
    const selectedCat = categories.find((cat) => cat.name === selectedCategory);
    if (selectedCat) {
      const catMidAngle = (selectedCat.startAngle + selectedCat.endAngle) / 2;
      skillGroupRotation = 90 - catMidAngle;
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
    <>
      <style>{transitionStyles}</style>
      <section
        id="skills"
        className="relative min-h-screen section-padding overflow-hidden flex flex-col items-center justify-center scroll-mt-24"
        onClick={() => {
          if (selectedCategory) setSelectedCategory(null);
        }}
      >
        <div className="relative" style={{ width, height }}>
          {/* Curved category label outside the arc on hover only */}
          {!selectedCategory &&
            debouncedHoveredCategory &&
            (() => {
              const cat = categories.find(
                (c) => c.name === debouncedHoveredCategory
              );
              if (!cat) return null;
              const labelRadius = outerRadius + 40;
              const displayText = cat.name;
              // More conservative text wrapping for long names
              let shouldWrap = displayText.length > 18;
              let line1 = displayText;
              let line2 = "";
              if (shouldWrap) {
                const words = displayText.split(" ");
                if (words.length > 1) {
                  const midPoint = Math.floor(words.length / 2);
                  line1 = words.slice(0, midPoint).join(" ");
                  line2 = words.slice(midPoint).join(" ");
                } else if (displayText.length > 18) {
                  const midPoint = Math.ceil(displayText.length / 2);
                  line1 = displayText.substring(0, midPoint);
                  line2 = displayText.substring(midPoint);
                }
              }
              // More conservative arc sizing
              const arcSpan = Math.min(50 + cat.name.length * 1.5, 70);
              // Determine if we're in the bottom half of the circle (90° to 270°)
              const angle = cat.midAngle;
              const isBottomHalf = angle > 90 && angle < 270;
              let startAngle, endAngle, arcStart, arcEnd;
              if (isBottomHalf) {
                startAngle = angle + arcSpan / 2;
                endAngle = angle - arcSpan / 2;
                arcStart = startAngle;
                arcEnd = endAngle;
              } else {
                startAngle = angle - arcSpan / 2;
                endAngle = angle + arcSpan / 2;
                arcStart = startAngle;
                arcEnd = endAngle;
              }
              // Convert to radians
              const startRad = ((arcStart - 90) * Math.PI) / 180;
              const endRad = ((arcEnd - 90) * Math.PI) / 180;
              // SVG arc path for the label
              const x1 = centerX + labelRadius * Math.cos(startRad);
              const y1 = centerY + labelRadius * Math.sin(startRad);
              const x2 = centerX + labelRadius * Math.cos(endRad);
              const y2 = centerY + labelRadius * Math.sin(endRad);
              const largeArcFlag = arcSpan > 180 ? 1 : 0;
              const sweepFlag = isBottomHalf ? 0 : 1;
              const arcPath = `M ${x1} ${y1} A ${labelRadius} ${labelRadius} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`;
              // For second line, use a slightly larger radius and smaller line spacing
              const labelRadius2 = labelRadius + 16;
              const x1b = centerX + labelRadius2 * Math.cos(startRad);
              const y1b = centerY + labelRadius2 * Math.sin(startRad);
              const x2b = centerX + labelRadius2 * Math.cos(endRad);
              const y2b = centerY + labelRadius2 * Math.sin(endRad);
              const arcPath2 = `M ${x1b} ${y1b} A ${labelRadius2} ${labelRadius2} 0 ${largeArcFlag} ${sweepFlag} ${x2b} ${y2b}`;
              // Unique path ids
              const safeId = cat.name.replace(/[^a-zA-Z0-9_-]/g, "-");
              const pathId = `cat-label-arc-${safeId}`;
              const pathId2 = `cat-label-arc2-${safeId}`;
              // More sophisticated color handling
              const textColor = isBottomHalf
                ? darkenColor(cat.color, 0.9)
                : darkenColor(cat.color, 0.8);
              return (
                <svg
                  width={width}
                  height={height}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    pointerEvents: "none",
                    zIndex: 20,
                    overflow: "visible",
                  }}
                >
                  <defs>
                    {/* Arc paths for text */}
                    <path id={pathId} d={arcPath} fill="none" />
                    <path id={pathId2} d={arcPath2} fill="none" />
                  </defs>
                  {/* Subtle background arc for readability */}
                  <path
                    d={arcPath}
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    style={{ filter: "blur(1px)" }}
                  />
                  {/* First line of text */}
                  <text
                    fill={textColor}
                    fontWeight={500}
                    fontSize="0.85rem"
                    fontFamily="'Inter', 'SF Pro Text', 'Helvetica Neue', sans-serif"
                    letterSpacing="0.01em"
                    style={{
                      textShadow: "0 1px 1px rgba(0,0,0,0.05)",
                      WebkitFontSmoothing: "antialiased",
                      MozOsxFontSmoothing: "grayscale",
                    }}
                  >
                    <textPath
                      href={`#${pathId}`}
                      startOffset="50%"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                    >
                      {line1}
                    </textPath>
                  </text>
                  {/* Second line of text if needed */}
                  {line2 && (
                    <text
                      fill={textColor}
                      fontWeight={500}
                      fontSize="0.85rem"
                      fontFamily="'Inter', 'SF Pro Text', 'Helvetica Neue', sans-serif"
                      letterSpacing="0.01em"
                      style={{
                        textShadow: "0 1px 1px rgba(0,0,0,0.05)",
                        WebkitFontSmoothing: "antialiased",
                        MozOsxFontSmoothing: "grayscale",
                      }}
                    >
                      <textPath
                        href={`#${pathId2}`}
                        startOffset="50%"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                      >
                        {line2}
                      </textPath>
                    </text>
                  )}
                </svg>
              );
            })()}
          <svg width={width} height={height}>
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
                  // Arc radius just outside the skill segment
                  const labelRadius = skillsRadius + 40;
                  const displayText = skill.name;
                  // Text wrapping for long names
                  let shouldWrap = displayText.length > 18;
                  let line1 = displayText;
                  let line2 = "";
                  if (shouldWrap) {
                    const words = displayText.split(" ");
                    if (words.length > 1) {
                      const midPoint = Math.floor(words.length / 2);
                      line1 = words.slice(0, midPoint).join(" ");
                      line2 = words.slice(midPoint).join(" ");
                    } else if (displayText.length > 18) {
                      const midPoint = Math.ceil(displayText.length / 2);
                      line1 = displayText.substring(0, midPoint);
                      line2 = displayText.substring(midPoint);
                    }
                  }
                  // Arc sizing
                  const arcSpan = Math.min(50 + skill.name.length * 1.5, 70);
                  // Determine if we're in the bottom half of the circle (90° to 270°)
                  const angle = skill.midAngle;
                  const isBottomHalf = angle > 90 && angle < 270;
                  let startAngle, endAngle, arcStart, arcEnd;
                  if (isBottomHalf) {
                    startAngle = angle + arcSpan / 2;
                    endAngle = angle - arcSpan / 2;
                    arcStart = startAngle;
                    arcEnd = endAngle;
                  } else {
                    startAngle = angle - arcSpan / 2;
                    endAngle = angle + arcSpan / 2;
                    arcStart = startAngle;
                    arcEnd = endAngle;
                  }
                  // Convert to radians
                  const startRad = ((arcStart - 90) * Math.PI) / 180;
                  const endRad = ((arcEnd - 90) * Math.PI) / 180;
                  // SVG arc path for the label
                  const x1 = centerX + labelRadius * Math.cos(startRad);
                  const y1 = centerY + labelRadius * Math.sin(startRad);
                  const x2 = centerX + labelRadius * Math.cos(endRad);
                  const y2 = centerY + labelRadius * Math.sin(endRad);
                  const largeArcFlag = arcSpan > 180 ? 1 : 0;
                  const sweepFlag = isBottomHalf ? 0 : 1;
                  const arcPath = `M ${x1} ${y1} A ${labelRadius} ${labelRadius} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`;
                  // For second line, use a slightly larger radius and smaller line spacing
                  const labelRadius2 = labelRadius + 16;
                  const x1b = centerX + labelRadius2 * Math.cos(startRad);
                  const y1b = centerY + labelRadius2 * Math.sin(startRad);
                  const x2b = centerX + labelRadius2 * Math.cos(endRad);
                  const y2b = centerY + labelRadius2 * Math.sin(endRad);
                  const arcPath2 = `M ${x1b} ${y1b} A ${labelRadius2} ${labelRadius2} 0 ${largeArcFlag} ${sweepFlag} ${x2b} ${y2b}`;
                  // Unique path ids
                  const safeId = `skill-label-arc-hovered`;
                  const pathId = `${safeId}`;
                  const pathId2 = `${safeId}-2`;
                  // Color logic
                  const textColor = isBottomHalf
                    ? darkenColor(skill.color, 0.9)
                    : darkenColor(skill.color, 0.8);
                  return (
                    <g key={`skill-label-group-hovered`}>
                      <defs>
                        <path id={pathId} d={arcPath} fill="none" />
                        <path id={pathId2} d={arcPath2} fill="none" />
                      </defs>
                      {/* Subtle background arc for readability */}
                      <path
                        d={arcPath}
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        style={{ filter: "blur(1px)" }}
                      />
                      {/* First line of text */}
                      <text
                        fill={textColor}
                        fontWeight={500}
                        fontSize="0.85rem"
                        fontFamily="'Inter', 'SF Pro Text', 'Helvetica Neue', sans-serif"
                        letterSpacing="0.01em"
                        style={{
                          textShadow: "0 1px 1px rgba(0,0,0,0.05)",
                          WebkitFontSmoothing: "antialiased",
                          MozOsxFontSmoothing: "grayscale",
                          pointerEvents: "none",
                        }}
                      >
                        <textPath
                          href={`#${pathId}`}
                          startOffset="50%"
                          textAnchor="middle"
                          alignmentBaseline="middle"
                        >
                          {line1}
                        </textPath>
                      </text>
                      {/* Second line of text if needed */}
                      {line2 && (
                        <text
                          fill={textColor}
                          fontWeight={500}
                          fontSize="0.85rem"
                          fontFamily="'Inter', 'SF Pro Text', 'Helvetica Neue', sans-serif"
                          letterSpacing="0.01em"
                          style={{
                            textShadow: "0 1px 1px rgba(0,0,0,0.05)",
                            WebkitFontSmoothing: "antialiased",
                            MozOsxFontSmoothing: "grayscale",
                            pointerEvents: "none",
                          }}
                        >
                          <textPath
                            href={`#${pathId2}`}
                            startOffset="50%"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                          >
                            {line2}
                          </textPath>
                        </text>
                      )}
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
        </div>
      </section>
    </>
  );
};

export { Skills };
