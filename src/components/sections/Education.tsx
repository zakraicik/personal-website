"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HiAcademicCap, HiChevronDown } from "react-icons/hi";
import { useState } from "react";
import { useScrollLock } from "@/hooks/useScrollLock";

const education = [
  {
    degree: "Master of Computer Science",
    school: "University of Pennsylvania",
    period: "",
    description: [
      "Combined mathematical foundations with engineering principles to solve complex computing problems using Python, Java, and C",
      "Designed and maintained high-quality software utilizing data structures, algorithms, and object-oriented programming techniques",
      "Assessed and implemented modern techniques including blockchain development, natural language processing, and distributed computing",
      "Applied algorithmic thinking to model software systems through advanced concepts in data structures, graph theory, and computational analysis",
    ],
  },
  {
    degree: "Bachelor of Science in Finance",
    school: "Bentley University",
    period: "",
    description: [
      "Applied economic analysis to evaluate fiscal and monetary policies, international trade dynamics, and current economic challenges",
      "Developed financial valuation models using advanced Excel, VBA, and statistical functions for securities, capital budgeting, and risk assessment",
      "Executed trading simulations and portfolio management strategies in dedicated Trading Room environments",
      "Implemented digital transformation strategies to optimize business processes and enhance organizational efficiency through information systems",
    ],
  },
];

export function Education() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { scrollToSection } = useScrollLock();

  const toggleEducation = (index: number) => {
    setExpandedIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      id="education"
      className="min-h-screen flex flex-col justify-center section-padding relative overflow-hidden"
    >
      <div className="cyber-grid pointer-events-none w-full h-full left-0 top-0 absolute overflow-x-hidden" />

      <div className="container-padding w-full max-w-full mx-auto flex-1 flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <div className="space-y-8">
            {education.map((edu, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <motion.div
                  key={edu.degree}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-cyber-dark/5 backdrop-blur-md rounded-lg border border-cyber-dark/10 shadow-lg relative"
                >
                  <button
                    onClick={() => toggleEducation(index)}
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
                            {edu.degree}
                          </h3>
                        </div>
                        <p className="text-white/80 text-[14px] max-w-xl line-clamp-2 mt-1">
                          {edu.school}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="px-1.5 py-0.5 bg-transparent text-white/70 rounded-lg text-xs border border-white/30 border-[1px]">
                            {edu.period}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
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
                          {edu.description.map((item, i) => (
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
