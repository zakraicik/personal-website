"use client";

import { motion } from "framer-motion";
import { useSectionVisibility } from "@/context/SectionVisibilityContext";

export function Hero() {
  const { setVisibleSection } = useSectionVisibility();

  const handleNavigate = (section: string) => {
    setVisibleSection(section);
    window.history.replaceState(null, "", `#${section}`);
  };

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center section-padding relative overflow-hidden"
    >
      <div className="cyber-grid pointer-events-none w-full h-full left-0 top-0 absolute overflow-x-hidden" />

      <div className="px-4 md:px-6 w-full max-w-full mx-auto flex-1 flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl"
        >
          <div className="space-y-6 sm:space-y-8 text-center">
            <div className="space-y-3 sm:space-y-4">
              <motion.h1
                className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-6 text-white/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span>Hi, I&apos;m </span>
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
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <button
                onClick={() => handleNavigate("portfolio")}
                className="glass-button flex-1 text-center bg-transparent border border-cyber-purple/50 hover:border-cyber-purple hover:bg-transparent text-sm sm:text-lg py-2 px-4 cursor-pointer transition-all duration-300"
              >
                <span>View My Work</span>
              </button>
              <button
                onClick={() => handleNavigate("contact")}
                className="glass-button flex-1 text-center bg-transparent border border-cyber-purple/50 hover:border-cyber-purple hover:bg-transparent text-sm sm:text-lg py-2 px-4 cursor-pointer transition-all duration-300"
              >
                <span>Contact Me</span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
