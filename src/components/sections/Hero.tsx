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
      className="relative overflow-hidden min-h-screen flex items-center"
    >
      <div className="cyber-grid pointer-events-none w-full h-full left-0 top-0 absolute overflow-x-hidden" />

      <div className="px-3 xs:px-4 sm:px-6 md:px-6 w-full max-w-full mx-auto relative z-10 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl mx-auto"
        >
          <div className="space-y-4 xs:space-y-6 sm:space-y-8 text-center">
            <div className="space-y-2 xs:space-y-3 sm:space-y-4">
              <motion.h1
                className="text-2xl xs:text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-2 xs:mb-3 sm:mb-6 text-white/80 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span>Hi, I&apos;m </span>
                <span className="gradient-text">Zak Raicik</span>
              </motion.h1>
              <motion.p
                className="text-sm xs:text-base sm:text-lg md:text-2xl lg:text-3xl text-white/80 mb-3 xs:mb-4 sm:mb-8 max-w-[280px] xs:max-w-xs sm:max-w-2xl mx-auto px-1 xs:px-2 sm:px-4 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Data Scientist, Builder, Storyteller, Creator
              </motion.p>
            </div>
            <motion.div
              className="flex flex-col sm:flex-row gap-2 xs:gap-3 sm:gap-4 justify-center items-center w-full max-w-[280px] xs:max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <button
                onClick={() => handleNavigate("portfolio")}
                className="glass-button flex-1 text-center bg-transparent border border-cyber-purple/50 hover:border-cyber-purple hover:bg-transparent text-xs xs:text-sm sm:text-lg py-2 xs:py-2 sm:py-2 px-3 xs:px-4 sm:px-4 cursor-pointer transition-all duration-300 w-full min-h-[44px]"
              >
                <span>View My Work</span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
