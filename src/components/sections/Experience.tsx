"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HiBriefcase, HiChevronDown } from "react-icons/hi";
import { useState } from "react";

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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex((currentIndex) => (currentIndex === idx ? null : idx));
  };

  return (
    <section
      id="experience"
      className="section-padding relative overflow-hidden"
    >
      <div className="cyber-grid" />
      <div className="container-padding mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="heading-2 text-center mb-12">
            <span className="glitch-text" data-text="Experience">
              Experience
            </span>
          </h2>
          <div className="space-y-8">
            {experiences.map((exp, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={exp.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="cyber-card group"
                >
                  <div
                    onClick={() => toggle(index)}
                    className="w-full text-left p-6 flex flex-col md:flex-row md:items-center md:justify-between focus:outline-none cursor-pointer transition-colors duration-200 hover:bg-cyber-dark/30"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        toggle(index);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-cyber-dark/50 rounded-lg border border-cyber-blue/20">
                        <HiBriefcase className="text-cyber-blue text-xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-cyber-light">
                          {exp.title}
                        </h3>
                        <p className="text-cyber-light/80">{exp.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 md:mt-0">
                      <span className="text-sm text-cyber-blue">
                        {exp.period}
                      </span>
                      <HiChevronDown
                        className={`ml-2 text-cyber-blue transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border-t border-cyber-blue/20"
                      >
                        <ul className="list-none space-y-2 text-cyber-light/80 px-6 py-4">
                          {exp.description.map((item, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: i * 0.1 }}
                              className="flex items-center space-x-2"
                            >
                              <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full" />
                              <span>{item}</span>
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

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyber-purple/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </section>
  );
}
