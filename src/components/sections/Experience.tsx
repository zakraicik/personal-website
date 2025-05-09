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

const experiences = [
  {
    title: "Senior Developer",
    company: "Tech Company",
    period: "2021 - Present",
    description: [
      "Led development of key features for enterprise applications",
      "Mentored junior developers and conducted code reviews",
      "Implemented CI/CD pipelines and improved deployment processes",
    ],
  },
  {
    title: "Full Stack Developer",
    company: "Startup Inc",
    period: "2019 - 2021",
    description: [
      "Developed and maintained multiple web applications",
      "Collaborated with design team to implement UI/UX improvements",
      "Optimized application performance and reduced load times",
    ],
  },
  {
    title: "Junior Developer",
    company: "Digital Agency",
    period: "2018 - 2019",
    description: [
      "Built responsive websites for various clients",
      "Worked with modern frontend frameworks and libraries",
      "Participated in agile development processes",
    ],
  },
];

export function Experience() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { scrollToSection } = useScrollLock();

  const toggleExperience = (index: number) => {
    setExpandedIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      id="experience"
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
          {/* Removed Experience header */}
          <div className="space-y-8">
            {experiences.map((exp, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <motion.div
                  key={exp.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="cyber-card"
                >
                  <button
                    onClick={() => toggleExperience(index)}
                    className="w-full p-6 flex items-center justify-between focus:outline-none"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-cyber-dark/50 rounded-lg border border-cyber-blue/20">
                        <HiBriefcase className="text-cyber-blue text-xl" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-semibold text-cyber-light">
                          {exp.title}
                        </h3>
                        <p className="text-cyber-light/80">{exp.company}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-cyber-blue">
                        {exp.period}
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
                          {exp.description.map((item, i) => (
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
