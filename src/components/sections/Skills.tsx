"use client";

import { motion } from "framer-motion";

const skills = [
  { name: "React", level: 90 },
  { name: "Next.js", level: 85 },
  { name: "TypeScript", level: 80 },
  { name: "Node.js", level: 75 },
  { name: "Tailwind CSS", level: 90 },
  { name: "GraphQL", level: 70 },
];

export function Skills() {
  return (
    <section
      id="skills"
      className="relative min-h-screen section-padding overflow-hidden flex items-center justify-center scroll-mt-24"
    >
      <div className="w-full max-w-6xl mx-auto z-10 px-8 sm:px-12 pl-64 flex items-center justify-center">
        <div className="flex flex-col justify-center items-center h-full w-full max-w-4xl mx-auto">
          <div className="space-y-4 sm:space-y-6 w-full">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex justify-between mb-1 sm:mb-2">
                  <span className="text-sm sm:text-base md:text-lg text-cyber-light/80">
                    {skill.name}
                  </span>
                  <span className="text-sm sm:text-base md:text-lg text-cyber-blue">
                    {skill.level}%
                  </span>
                </div>
                <div className="h-2 sm:h-3 bg-cyber-dark/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-cyber-gradient"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
