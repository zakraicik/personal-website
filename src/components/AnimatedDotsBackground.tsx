"use client";

import React from "react";
import { motion } from "framer-motion";
import { useMemo, useEffect, useState } from "react";

const generateBubblePositions = (count: number) => {
  const positions = [];

  const colors = [
    "#8A2BE2", // cyber-purple
    "#00BFFF", // cyber-blue
    "#FF1493", // cyber-pink
  ];

  for (let i = 0; i < count; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;

    const baseSize = 20 + Math.random() * 40; // 20-60px

    const moveX = (Math.random() - 0.5) * 30; // -15 to 15
    const moveY = (Math.random() - 0.5) * 30; // -15 to 15

    const moveDuration = 15 + Math.random() * 20; // 15-35 seconds
    const scaleDuration = 8 + Math.random() * 12; // 8-20 seconds

    const color = colors[Math.floor(Math.random() * colors.length)];

    const isLarge = Math.random() > 0.7;
    const size = isLarge ? baseSize * 1.5 : baseSize;

    positions.push({
      x,
      y,
      size,
      moveX,
      moveY,
      moveDuration,
      scaleDuration,
      color,
      isLarge,
      delay: Math.random() * 10,
    });
  }

  return positions;
};

export function AnimatedDotsBackground({
  count = 25,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") || "home";
      setActiveSection(hash);
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);

    window.addEventListener("popstate", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  const positions = useMemo(
    () => (isMounted ? generateBubblePositions(count) : []),
    [count, isMounted]
  );

  const sectionOrder = [
    "home",
    "about",
    "portfolio",
    "timeline",
    "skills",
    "contact",
  ];
  const sectionIndex = sectionOrder.indexOf(activeSection);
  const progressRatio = sectionIndex / (sectionOrder.length - 1); // 0 to 1

  const overlayOpacity = progressRatio * 0.6;

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-0 overflow-hidden pointer-events-none ${className}`}
    >
      <motion.div
        className="absolute inset-0 bg-black"
        animate={{ opacity: overlayOpacity }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ zIndex: 1 }}
      />

      {positions.map((bubble, i) => (
        <motion.div
          key={`bubble-${i}`}
          style={{
            position: "absolute",
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            borderRadius: "50%",
            backgroundColor: bubble.color,
            opacity: bubble.isLarge ? 0.02 : 0.015,
            filter: "blur(1px)",
            zIndex: 2,
          }}
          animate={{
            x: [0, bubble.moveX, -bubble.moveX, 0],
            y: [0, bubble.moveY, -bubble.moveY, 0],
            scale: [1, 1.1, 0.9, 1],
            opacity: bubble.isLarge
              ? [0.02, 0.03, 0.015, 0.02]
              : [0.015, 0.025, 0.01, 0.015],
          }}
          transition={{
            duration: bubble.moveDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: bubble.delay,
          }}
        />
      ))}

      {Array.from({ length: 15 }).map((_, i) => {
        const colors = ["#8A2BE2", "#00BFFF", "#FF1493"];
        const color = colors[i % colors.length];
        const size = 5 + Math.random() * 8;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = 20 + Math.random() * 30;

        return (
          <motion.div
            key={`micro-${i}`}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: 0.01,
              filter: "blur(1.5px)",
              zIndex: 2,
            }}
            animate={{
              x: [0, Math.random() * 20 - 10],
              y: [0, Math.random() * 20 - 10],
              scale: [1, 1.2, 1],
              opacity: [0.01, 0.02, 0.01],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        );
      })}

      {Array.from({ length: 3 }).map((_, i) => {
        const colors = ["#8A2BE2", "#00BFFF", "#FF1493"];
        const color = colors[i % colors.length];
        const size = 60 + Math.random() * 40;
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        return (
          <motion.div
            key={`accent-${i}`}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${color}08 0%, ${color}02 70%, transparent 100%)`,
              filter: "blur(3px)",
              zIndex: 2,
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 25 + Math.random() * 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 5,
            }}
          />
        );
      })}
    </div>
  );
}
