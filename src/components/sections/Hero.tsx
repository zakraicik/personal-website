"use client";

import { motion } from "framer-motion";
import { HiArrowDown } from "react-icons/hi";

export function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center section-padding relative overflow-hidden"
    >
      <div className="cyber-grid" />
      <div className="container-padding mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.h1
              className="heading-1 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span>Hi, I'm </span>
              <span className="gradient-text">Zak Raicik</span>
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-cyber-light/80 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              A passionate developer crafting beautiful and functional web
              experiences
            </motion.p>
          </div>

          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <a
              href="#portfolio"
              className="glass-button bg-transparent border border-cyber-purple/50 hover:border-cyber-purple"
            >
              <span>View My Work</span>
            </a>
            <a
              href="#contact"
              className="glass-button bg-transparent border border-cyber-purple/50 hover:border-cyber-purple"
            >
              <span>Contact Me</span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Move the arrow here, outside the main content container */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <HiArrowDown className="text-cyber-blue text-2xl" />
      </motion.div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyber-purple/20 rounded-full"
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
    </section>
  );
}
