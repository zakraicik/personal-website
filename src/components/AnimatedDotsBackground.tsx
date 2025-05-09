"use client";

import { motion } from "framer-motion";

export function AnimatedDotsBackground({
  count = 20,
  color = "bg-cyber-purple/20",
  className = "",
}: {
  count?: number;
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={`fixed inset-0 z-0 overflow-hidden pointer-events-none ${className}`}
    >
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 ${color} rounded-full`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}
