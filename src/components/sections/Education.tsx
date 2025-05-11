"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HiAcademicCap, HiChevronDown } from "react-icons/hi";
import { useState } from "react";
import { useScrollLock } from "@/hooks/useScrollLock";

const education = [
  {
    degree: "Master of Computer Science",
    school: "University of Technology",
    period: "2017 - 2019",
    description: [
      "Specialized in Artificial Intelligence and Machine Learning",
      "Graduated with Distinction",
      "Published research paper on Neural Network Optimization",
    ],
  },
  {
    degree: "Bachelor of Science in Computer Science",
    school: "State University",
    period: "2013 - 2017",
    description: [
      "Dean's List for Academic Excellence",
      "Senior Project: Developed a Real-time Data Processing System",
      "Active member of the Computer Science Society",
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
                    className="w-full p-6 flex items-center justify-between focus:outline-none hover:bg-cyber-blue/5 transition-colors cursor-pointer"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-cyber-dark/50 rounded-lg border border-cyber-blue/20">
                        <HiAcademicCap className="text-cyber-blue text-xl" />
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
