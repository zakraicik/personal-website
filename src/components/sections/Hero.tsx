"use client";

import { motion } from "framer-motion";
import { useScrollLock } from "@/hooks/useScrollLock";

export function Hero() {
  const { scrollToSection } = useScrollLock();

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-between section-padding relative overflow-hidden"
    >
      <div className="cyber-grid" />

      <div className="container-padding mx-auto flex-1 flex items-center justify-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span>Hi, I'm </span>
              <span className="gradient-text">Zak Raicik</span>
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-cyber-light/80 mb-8 max-w-2xl mx-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              A passionate developer crafting beautiful and functional web
              experiences
            </motion.p>
          </div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <a
              href="#portfolio"
              className="glass-button bg-transparent border border-cyber-purple/50 hover:border-cyber-purple text-base sm:text-lg py-2 px-6"
            >
              <span>View My Work</span>
            </a>
            <a
              href="#contact"
              className="glass-button bg-transparent border border-cyber-purple/50 hover:border-cyber-purple text-base sm:text-lg py-2 px-6"
            >
              <span>Contact Me</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
