"use client";

import { motion } from "framer-motion";
import { useScrollLock } from "@/hooks/useScrollLock";

export function Hero() {
  const { scrollToSection } = useScrollLock();

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center section-padding relative overflow-hidden"
    >
      <div className="cyber-grid pointer-events-none w-full h-full left-0 top-0 absolute overflow-x-hidden" />

      <div className="container-padding w-full max-w-full sm:max-w-2xl mx-auto flex-1 flex items-center justify-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 sm:space-y-8"
        >
          <div className="space-y-3 sm:space-y-4">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-6 text-white/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span>Hi, I'm </span>
              <span className="gradient-text">Zak Raicik</span>
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg md:text-2xl lg:text-3xl text-white/80 mb-4 sm:mb-8 max-w-xs sm:max-w-2xl mx-auto px-2 sm:px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Data Scientist, Builder, Storyteller, Creator
            </motion.p>
          </div>

          <motion.div
            className="inline-flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <a
              href="#portfolio"
              className="glass-button w-auto text-center bg-transparent border border-cyber-purple/50 hover:border-cyber-purple hover:bg-transparent text-sm sm:text-lg py-2 px-4"
            >
              <span>View My Work</span>
            </a>
            <a
              href="#contact"
              className="glass-button w-auto text-center bg-transparent border border-cyber-purple/50 hover:border-cyber-purple hover:bg-transparent text-sm sm:text-lg py-2 px-4"
            >
              <span>Contact Me</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
