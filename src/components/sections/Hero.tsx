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
    <div className="w-full max-w-6xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 xs:space-y-6 sm:space-y-8"
      >
        {/* Heading section */}
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
            Data Scientist, Builder,{" "}
            <span className="whitespace-nowrap">Storyteller, Creator</span>
          </motion.p>
        </div>

        {/* CTA Button */}
        <motion.div
          className="flex flex-col sm:flex-row gap-2 xs:gap-3 sm:gap-4 justify-center items-center w-full max-w-[280px] xs:max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <button
            onClick={() => handleNavigate("portfolio")}
            className="hero-button"
          >
            <span>View My Work</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
