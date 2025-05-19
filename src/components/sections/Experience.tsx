"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  HiBriefcase,
  HiChevronDown,
  HiArrowUp,
  HiArrowDown,
} from "react-icons/hi";
import { useState } from "react";
import { useScrollLock } from "@/hooks/useScrollLock";
import { experiences } from "@/data/experience";

export function Experience() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { scrollToSection } = useScrollLock();

  const toggleExperience = (index: number) => {
    setExpandedIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      id="experience"
      className="min-h-screen flex flex-col justify-center section-padding relative overflow-hidden"
    >
      <div className="container-padding w-full max-w-full mx-auto flex-1 flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <div className="space-y-8">
            {experiences.map((exp, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <motion.div
                  key={exp.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-cyber-dark/5 backdrop-blur-md rounded-lg border border-cyber-dark/10 shadow-lg relative"
                >
                  <button
                    onClick={() => toggleExperience(index)}
                    className="w-full p-6 flex items-center justify-between focus:outline-none hover:bg-gradient-to-r hover:from-cyber-purple/10 hover:via-cyber-blue/10 hover:to-cyber-pink/10 transition-all duration-300 cursor-pointer group"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col w-full">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3
                            className="text-[18px] font-medium text-cyber-blue tracking-[.01em]"
                            style={{
                              fontFamily:
                                "Inter, 'SF Pro Text', 'Helvetica Neue', sans-serif",
                              textShadow: "0 1px 1px rgba(0,0,0,0.1)",
                            }}
                          >
                            {exp.title}
                          </h3>
                        </div>
                        <p className="text-white/80 text-[14px] max-w-xl line-clamp-2 mt-1">
                          {exp.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/80 text-[14px]">
                        {exp.period}
                      </span>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <HiChevronDown className="text-cyber-blue text-xl" />
                      </motion.div>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border-t border-cyber-blue/20"
                      >
                        <ul className="p-6 space-y-3">
                          {exp.description.map((item, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: i * 0.1 }}
                              className="flex items-center gap-2 text-white/80 text-[14px]"
                            >
                              <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full" />
                              {item}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
