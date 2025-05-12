"use client";

import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { skills, CATEGORY_COLORS } from "@/data/skills";

// This is a simplified test component to demonstrate the position calculation
const PieChartPositionTest = () => {
  const svgWidth = 500;
  const svgHeight = 500;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const radius = 150;
  const hoverRadius = 170; // Increased from 160 to 170 for more prominent hover effect
  const popupRadius = 220; // For label positions
  const labelDistance = 200; // Distance from center to labels
  // Instead of fixed popupCardRadius, we'll use an offset from the segment edge
  const popupOffset = 165; // Consistent offset from the edge of the segment
  const segmentPadding = 5; // Add padding between segments

  const categoryList = Array.from(new Set(skills.map((s) => s.category)));
  const categoryColorMap = Object.fromEntries(
    categoryList.map((cat, i) => [
      cat,
      CATEGORY_COLORS[i % CATEGORY_COLORS.length],
    ])
  );

  const chartData = categoryList.map((category) => ({
    name: category,
    value: skills.filter((s) => s.category === category).length,
    color: categoryColorMap[category],
  }));

  // Calculate the angles and positions for each slice in the pie chart
  const calculatePieData = () => {
    const total = chartData.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = 0;

    return chartData.map((item) => {
      const angle = (item.value / total) * 360;
      // Add padding by reducing the angle slightly
      const paddedAngle = Math.max(angle - segmentPadding, 1);
      const startAngle = currentAngle + segmentPadding / 2;
      currentAngle += angle;
      const endAngle = currentAngle - segmentPadding / 2;
      const midAngle = startAngle + paddedAngle / 2;

      // Calculate positions
      const polarToCartesian = (angle: number, useRadius: number) => {
        const angleInRadians = ((angle - 90) * Math.PI) / 180.0;
        return {
          x: centerX + useRadius * Math.cos(angleInRadians),
          y: centerY + useRadius * Math.sin(angleInRadians),
        };
      };

      const startPos = polarToCartesian(startAngle, radius);
      const endPos = polarToCartesian(endAngle, radius);
      const midPos = polarToCartesian(midAngle, radius);
      // Calculate hover positions with larger radius
      const hoverStartPos = polarToCartesian(startAngle, hoverRadius);
      const hoverEndPos = polarToCartesian(endAngle, hoverRadius);
      // Calculate popup position for always-visible label
      const popupPos = polarToCartesian(midAngle, popupRadius);
      // Calculate edge position (point on the outer edge of the segment)
      const edgePos = polarToCartesian(midAngle, hoverRadius);
      // Calculate consistent label positions
      const labelPos = polarToCartesian(midAngle, labelDistance);

      return {
        ...item,
        startAngle,
        endAngle,
        midAngle,
        startPos,
        endPos,
        midPos,
        hoverStartPos,
        hoverEndPos,
        popupPos,
        edgePos,
        labelPos,
      };
    });
  };

  const pieData = calculatePieData();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Function to create arc path with specified radius
  const createArcPath = (
    startAngle: number,
    endAngle: number,
    useRadius: number
  ) => {
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const startX = centerX + useRadius * Math.cos(startRad);
    const startY = centerY + useRadius * Math.sin(startRad);
    const endX = centerX + useRadius * Math.cos(endRad);
    const endY = centerY + useRadius * Math.sin(endRad);

    // Determine if arc is large or small
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    // Create the arc path
    return `M ${centerX} ${centerY} L ${startX} ${startY} A ${useRadius} ${useRadius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
  };

  // Function to calculate the popup position with consistent spacing
  const calculatePopupPosition = (index: number) => {
    if (index === null) return { x: 0, y: 0 };

    const pie = pieData[index];
    const midAngle = pie.midAngle;

    // Get the position on the edge of the segment
    const edgeX = pie.edgePos.x;
    const edgeY = pie.edgePos.y;

    // Calculate the direction vector from center to edge
    const dirX = edgeX - centerX;
    const dirY = edgeY - centerY;

    // Normalize the direction vector
    const length = Math.sqrt(dirX * dirX + dirY * dirY);
    const normDirX = dirX / length;
    const normDirY = dirY / length;

    // Calculate the position with consistent offset from the edge
    return {
      x: edgeX + normDirX * popupOffset,
      y: edgeY + normDirY * popupOffset,
    };
  };

  return (
    <section
      id="skills"
      className="relative min-h-screen section-padding overflow-hidden flex flex-col items-center justify-center scroll-mt-24"
    >
      <div className="cyber-grid" />
      <div className="relative" style={{ width: svgWidth, height: svgHeight }}>
        <svg width={svgWidth} height={svgHeight}>
          {/* SVG gradient fill and drop shadow filter */}
          <defs>
            <linearGradient id="glass-highlight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.70" />
              <stop offset="40%" stopColor="#fff" stopOpacity="0.25" />
              <stop offset="80%" stopColor="#fff" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.00" />
            </linearGradient>
            <filter
              id="cyber-shadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor="#00BFFF"
                floodOpacity="0.25"
              />
            </filter>
            <filter
              id="cyber-shadow-strong"
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

            {/* Create one radial gradient per category */}
            {pieData.map((pie, i) => (
              <radialGradient
                key={`gradient-${i}`}
                id={`segment-gradient-${i}`}
                cx={centerX}
                cy={centerY}
                r={radius}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop
                  offset="50%"
                  stopColor={activeIndex === i ? "#00BFFF" : "#00BFFF"}
                  stopOpacity="0.8"
                />
                <stop
                  offset="100%"
                  stopColor={activeIndex === i ? "#00BFFF" : "#00BFFF"}
                  stopOpacity="1"
                />
              </radialGradient>
            ))}
          </defs>

          {/* Draw the pie segments */}
          {pieData.map((pie, i) => {
            const isActive = activeIndex === i;
            const isHovered = hoveredIndex === i;
            const useRadius = isActive || isHovered ? hoverRadius : radius;

            return (
              <g key={i}>
                {/* Segment path */}
                <path
                  d={createArcPath(pie.startAngle, pie.endAngle, useRadius)}
                  fill={`url(#segment-gradient-${i})`}
                  stroke="#fff"
                  strokeWidth={isActive || isHovered ? 2 : 1}
                  opacity={
                    activeIndex === null || isActive || isHovered ? 1 : 0.3
                  }
                  onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.2s ease-out",
                    transformOrigin: "center",
                  }}
                  filter={
                    isActive || isHovered
                      ? "url(#cyber-shadow-strong)"
                      : "url(#cyber-shadow)"
                  }
                />

                {/* Glassy highlight overlay */}
                <path
                  d={createArcPath(pie.startAngle, pie.endAngle, useRadius)}
                  fill="url(#glass-highlight)"
                  pointerEvents="none"
                  style={{
                    transition: "all 0.2s ease-out",
                    transformOrigin: "center",
                  }}
                  opacity={0.3}
                />
              </g>
            );
          })}
        </svg>

        {/* Display popup cards with consistent spacing */}
        {(activeIndex !== null || hoveredIndex !== null) &&
          (() => {
            // Determine which index to use for the popup (active takes precedence)
            const displayIndex =
              activeIndex !== null ? activeIndex : hoveredIndex;
            // Calculate consistent popup position
            const popupPosition = calculatePopupPosition(displayIndex!);
            const minWidth = 150;

            return (
              <div
                className="absolute backdrop-blur-md rounded-lg p-3 z-20"
                style={{
                  left: popupPosition.x,
                  top: popupPosition.y,
                  transform: "translate(-50%, -50%)",
                  minWidth: `${minWidth}px`,
                  textAlign: "left",
                  transition:
                    "opacity 0.35s ease-out, backdrop-filter 0.35s ease-out, background-color 0.35s ease-out",
                  opacity: activeIndex !== null ? 1 : 0.9,
                  backdropFilter:
                    activeIndex !== null ? "blur(8px)" : "blur(4px)",
                  backgroundColor:
                    activeIndex !== null
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(255, 255, 255, 0.02)",
                  borderTop: `1px solid ${pieData[displayIndex!].color}20`,
                  borderLeft: `1px solid ${pieData[displayIndex!].color}15`,
                  boxShadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 15px ${
                    pieData[displayIndex!].color
                  }30`,
                }}
              >
                <ul className="space-y-1">
                  {skills
                    .filter((s) => s.category === pieData[displayIndex!].name)
                    .map((skill) => (
                      <li
                        key={skill.name}
                        className="flex items-center justify-between"
                      >
                        <span className="font-cyber text-xs text-cyber-light font-medium">
                          {skill.name}
                        </span>
                        <span className="ml-6 px-2 py-0.5 text-xs font-semibold rounded-full bg-cyber-blue/10 border border-cyber-blue text-cyber-blue">
                          {skill.level}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            );
          })()}
      </div>
    </section>
  );
};

export const Skills = PieChartPositionTest;
