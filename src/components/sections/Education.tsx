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
      className="relative min-h-screen section-padding overflow-hidden grid grid-rows-[auto,1fr,auto] scroll-mt-24"
      style={{ minHeight: "100vh", gridTemplateRows: "auto 1fr auto" }}
    >
      {/* Main Content - centered */}
      <div
        className="w-full max-w-6xl mx-auto z-10 px-8 sm:px-12 pl-64 flex items-center justify-center"
        style={{ gridRow: 2 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <div className="space-y-8">
            {education.map((edu, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <motion.div
                  key={edu.degree}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-cyber-dark/30 backdrop-blur-sm rounded-lg border border-cyber-blue/20 shadow-lg relative"
                >
                  <button
                    onClick={() => toggleEducation(index)}
                    className="w-full p-6 flex items-center justify-between focus:outline-none hover:bg-gradient-to-r hover:from-cyber-purple/10 hover:via-cyber-blue/10 hover:to-cyber-pink/10 transition-all duration-300 cursor-pointer group"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-cyber-dark/50 rounded-lg border border-cyber-blue/20 group-hover:border-cyber-purple/40 transition-colors duration-300">
                        <HiAcademicCap className="text-cyber-blue group-hover:text-cyber-purple transition-colors duration-300 text-xl" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-semibold text-cyber-light">
                          {edu.degree}
                        </h3>
                        <p className="text-cyber-light/80">{edu.school}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-cyber-blue">
                        {edu.period}
                      </span>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <HiChevronDown className="text-cyber-blue" />
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
                              className="flex items-center gap-2 text-cyber-light/80"
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
