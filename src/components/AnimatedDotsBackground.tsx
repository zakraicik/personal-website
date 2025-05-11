"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const generateFixedPositions = (count: number) => {
  const positions = [];
  for (let i = 0; i < count; i++) {
    // Use a deterministic way to generate positions
    const x = ((i * 7) % 100) + i * 0.1;
    const y = ((i * 13) % 100) + i * 0.1;
    positions.push({ x, y });
  }
  return positions;
};

export function AnimatedDotsBackground({
  count = 20,
  color = "bg-cyber-purple/20",
  className = "",
}: {
  count?: number;
  color?: string;
  className?: string;
}) {
  const positions = useMemo(() => generateFixedPositions(count), [count]);

  return (
    <div
      className={`fixed inset-0 z-0 overflow-hidden pointer-events-none ${className}`}
    >
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 ${color} rounded-full`}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
          }}
          animate={{
            y: [0, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + (i % 3),
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}
