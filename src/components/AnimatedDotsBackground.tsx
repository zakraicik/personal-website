"use client";

import React from "react";
import { motion } from "framer-motion";
import { useMemo, useEffect, useState } from "react";

// Generate grid-based positions with some randomization
const generateGridPositions = (count: number) => {
  const gridSize = Math.ceil(Math.sqrt(count));
  const positions = [];

  // Color palette from cyber theme
  const colors = [
    "cyber-purple", // #8A2BE2
    "cyber-blue", // #00BFFF
    "cyber-pink", // #FF1493
  ];

  for (let i = 0; i < count; i++) {
    // Create a more ordered grid pattern
    const gridX = i % gridSize;
    const gridY = Math.floor(i / gridSize);

    // Add slight randomization to grid positions
    const randomOffsetX = Math.sin(i * 0.5) * 5;
    const randomOffsetY = Math.cos(i * 0.5) * 5;

    const x = gridX * (100 / (gridSize - 1)) + randomOffsetX;
    const y = gridY * (100 / (gridSize - 1)) + randomOffsetY;

    // All shapes are circles with varying sizes
    const size = i % 7 === 0 ? "large" : i % 3 === 0 ? "medium" : "small";

    // Generate random movement distance and direction
    const moveX = Math.sin(i) * 15 - 7.5; // Between -7.5 and 7.5
    const moveY = Math.cos(i) * 15 - 7.5; // Between -7.5 and 7.5

    // Random scale amount for pulsing
    const scaleAmount = 0.9 + Math.random() * 0.8; // Between 0.9 and 1.7

    // Randomize animation durations
    const moveDuration = 7 + Math.random() * 8; // Between 7 and 15 seconds
    const scaleDuration = 4 + Math.random() * 4; // Between 4 and 8 seconds

    // Assign colors from the cyber theme
    const colorIndex = i % colors.length;
    const color = colors[colorIndex];

    positions.push({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
      moveX,
      moveY,
      size,
      scaleAmount,
      moveDuration,
      scaleDuration,
      color,
    });
  }

  return positions;
};

export function AnimatedDotsBackground({
  count = 150,
  defaultColor = "cyber-blue",
  className = "",
}: {
  count?: number;
  defaultColor?: string;
  className?: string;
}) {
  const positions = useMemo(() => generateGridPositions(count), [count]);
  const [windowWidth, setWindowWidth] = useState(0);

  // Update window width for responsive line rendering
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate connections between nearby points
  const connections = useMemo(() => {
    if (!windowWidth) return [];

    const lines = [];
    const proximityThreshold = 20;

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = Math.abs(positions[i].x - positions[j].x);
        const dy = Math.abs(positions[i].y - positions[j].y);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < proximityThreshold) {
          lines.push({
            x1: positions[i].x,
            y1: positions[i].y,
            x2: positions[j].x,
            y2: positions[j].y,
            opacity: (1 - distance / proximityThreshold) * 0.25,
            color1: positions[i].color,
            color2: positions[j].color,
          });
        }
      }
    }

    return lines;
  }, [positions, windowWidth]);

  const getShapeSize = (size: string) => {
    switch (size) {
      case "large":
        return "w-4 h-4";
      case "medium":
        return "w-3 h-3";
      default:
        return "w-2 h-2";
    }
  };

  const getShapeClass = (size: string, color: string) => {
    const sizeClass = getShapeSize(size);
    // All shapes are rounded (circles)
    return `absolute ${sizeClass} rounded-full bg-${color}/20`;
  };

  // Helper to get color value from theme color name
  const getColorValue = (colorName: string) => {
    switch (colorName) {
      case "cyber-purple":
        return "#8A2BE2";
      case "cyber-blue":
        return "#00BFFF";
      case "cyber-pink":
        return "#FF1493";
      default:
        return "#00BFFF";
    }
  };

  // Create SVG gradient definitions outside of the map
  const gradientDefs = connections.map((line, i) => {
    const gradientId = `line-gradient-${i}`;
    const color1 = getColorValue(line.color1);
    const color2 = getColorValue(line.color2);

    return (
      <linearGradient
        key={gradientId}
        id={gradientId}
        x1="0%"
        y1="0%"
        x2="100%"
        y2="0%"
      >
        <stop offset="0%" stopColor={color1} stopOpacity={line.opacity} />
        <stop offset="100%" stopColor={color2} stopOpacity={line.opacity} />
      </linearGradient>
    );
  });

  return (
    <div
      className={`fixed inset-0 z-0 overflow-hidden pointer-events-none ${className}`}
    >
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>{gradientDefs}</defs>

        {connections.map((line, i) => (
          <motion.path
            key={`line-${i}`}
            d={`M ${line.x1}% ${line.y1}% L ${line.x2}% ${line.y2}%`}
            stroke={`url(#line-gradient-${i})`}
            strokeWidth="0.75"
            initial={{ strokeOpacity: 0 }}
            animate={{ strokeOpacity: 1 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </svg>

      {/* Animated dots */}
      {positions.map((pos, i) => (
        <div
          key={i}
          style={{ position: "absolute", left: `${pos.x}%`, top: `${pos.y}%` }}
        >
          {/* Motion div for movement animation */}
          <motion.div
            animate={{
              x: [0, pos.moveX, pos.moveX / 2, -pos.moveX, -pos.moveX / 3, 0],
              y: [0, pos.moveY, -pos.moveY / 2, -pos.moveY, pos.moveY / 3, 0],
            }}
            transition={{
              duration: pos.moveDuration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: i * 0.02,
            }}
          >
            {/* Nested motion div for scale/opacity animation */}
            <motion.div
              className={getShapeClass(pos.size, pos.color)}
              animate={{
                scale: [1, pos.scaleAmount, 1.05, pos.scaleAmount * 0.9, 1],
                opacity: [0.15, 0.25, 0.15],
              }}
              transition={{
                duration: pos.scaleDuration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: i * 0.01,
              }}
            />
          </motion.div>
        </div>
      ))}

      {/* Large floating dots in the background */}
      {Array.from({ length: 20 }).map((_, i) => {
        const colors = ["cyber-purple", "cyber-blue", "cyber-pink"];
        const color = colors[i % colors.length];
        const colorValue = getColorValue(color);

        // Completely random positioning across screen
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;

        // Randomized movement amounts in both directions
        const moveXAmount = 20 + Math.random() * 40;
        const moveYAmount = 20 + Math.random() * 40;

        // Randomized sizes
        const size = 25 + Math.floor(Math.random() * 35);

        // Randomized animation durations
        const animationDuration = 15 + Math.random() * 20;

        // Random delay to stagger animations
        const delay = Math.random() * 5;

        return (
          <motion.div
            key={`large-dot-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${randomX}%`,
              top: `${randomY}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: colorValue,
              opacity: 0.05,
            }}
            animate={{
              x: [0, moveXAmount, -moveXAmount / 2, -moveXAmount, 0],
              y: [0, -moveYAmount / 2, moveYAmount, -moveYAmount / 2, 0],
              scale: [1, 1.15, 0.9, 1.05, 1],
              opacity: [0.03, 0.06, 0.04, 0.05, 0.03],
            }}
            transition={{
              duration: animationDuration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: delay,
            }}
          />
        );
      })}
    </div>
  );
}
