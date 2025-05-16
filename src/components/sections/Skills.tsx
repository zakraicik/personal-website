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
  const outerRadius = 150;
  const skillsRadius = 100;
  const innerRadius = skillsRadius;

  // Gap between categories in degrees
  const CATEGORY_GAP_DEGREES = 10;
  // Gap between skills when category is selected
  const SKILL_GAP_DEGREES = 5;

  // State (no interactivity)
  const [categories, setCategories] = useState<Category[]>([]);
  const [skillSegments, setSkillSegments] = useState<SkillSegment[]>([]);
  const [dividers, setDividers] = useState<Divider[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const debouncedHoveredCategory = useDebounce(hoveredCategory, 50);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Calculate rotation for centering selected category's visible arc on horizontal axis
  let skillGroupRotation = 0;
  if (selectedCategory) {
    const selectedCat = categories.find((cat) => cat.name === selectedCategory);
    if (selectedCat) {
      const catSkills = skills.filter((s) => s.category === selectedCategory);
      const totalSkills = catSkills.length;
      const availableAngle = selectedCat.endAngle - selectedCat.startAngle;
      const totalGaps = totalSkills - 1;
      const totalGapAngle = totalGaps * SKILL_GAP_DEGREES;
      const totalSegmentsAngle = availableAngle - totalGapAngle;
      const startOffset = (availableAngle - totalSegmentsAngle) / 2;
      const visibleStart = selectedCat.startAngle + startOffset;
      const visibleEnd = visibleStart + totalSegmentsAngle + totalGapAngle;
      const visibleMid = (visibleStart + visibleEnd) / 2;
      // To align with horizontal, rotate by -visibleMid
      skillGroupRotation = 90 - visibleMid;
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

      // If category is selected, center the segments
      if (selectedCategory === cat.name) {
        const availableAngle = cat.endAngle - cat.startAngle;
        const totalGaps = totalSkills - 1;
        const totalGapAngle = totalGaps * SKILL_GAP_DEGREES;
        const totalSegmentsAngle = availableAngle - totalGapAngle;
        const startOffset = (availableAngle - totalSegmentsAngle) / 2;
        skillStartAngle = cat.startAngle + startOffset;
      }

      catSkills.forEach((skill, idx) => {
        // Calculate angle for this skill, including gap if category is selected
        const availableAngle = cat.endAngle - cat.startAngle;
        const totalGaps = selectedCategory === cat.name ? totalSkills - 1 : 0;
        const totalGapAngle = totalGaps * SKILL_GAP_DEGREES;
        const skillAngle = (availableAngle - totalGapAngle) / totalSkills;
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
          {/* Category label on hover */}
          {debouncedHoveredCategory && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translate(-50%, -60%)",
                zIndex: 10,
                background: "rgba(255,255,255,0.85)",
                borderRadius: 8,
                padding: "0.5rem 1.25rem",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#0A0A1F",
                boxShadow: "0 2px 8px 0 rgba(138, 43, 226, 0.08)",
                pointerEvents: "none",
              }}
            >
              {debouncedHoveredCategory}
            </div>
          )}
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
            >
              {skillSegments
                .filter(
                  (skill) =>
                    !selectedCategory || skill.category === selectedCategory
                )
                .map((skill, i) => {
                  // Pop out effect for skills in hovered category
                  let dx = 0,
                    dy = 0;
                  if (
                    debouncedHoveredCategory &&
                    skill.category === debouncedHoveredCategory
                  ) {
                    const cat = categories.find(
                      (c) => c.name === debouncedHoveredCategory
                    );
                    if (cat) {
                      const popDistance = 18;
                      const midAngleRad =
                        (((cat.startAngle + cat.endAngle) / 2 - 90) * Math.PI) /
                        180;
                      dx = Math.cos(midAngleRad) * popDistance;
                      dy = Math.sin(midAngleRad) * popDistance;
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
                      fill={`${skill.color}99`}
                      stroke={skill.color}
                      strokeWidth={1}
                      filter={"url(#shadow)"}
                      style={{
                        transition: "transform 0.25s cubic-bezier(.4,2,.6,1)",
                        transform: `translate(${dx}px, ${dy}px)`,
                      }}
                      onMouseEnter={handleEnter}
                      onMouseLeave={handleLeave}
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
