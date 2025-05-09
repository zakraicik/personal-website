"use client";

import { motion } from "framer-motion";
import { HiExternalLink, HiArrowUp, HiArrowDown } from "react-icons/hi";
import { useScrollLock } from "@/hooks/useScrollLock";
import { AnimatedDotsBackground } from "../AnimatedDotsBackground";

const projects = [
  {
    title: "Project 1",
    description: "A brief description of the project and its key features.",
    tags: ["React", "Node.js", "MongoDB"],
    link: "#",
  },
  {
    title: "Project 2",
    description: "A brief description of the project and its key features.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    link: "#",
  },
  {
    title: "Project 3",
    description: "A brief description of the project and its key features.",
    tags: ["React", "GraphQL", "AWS"],
    link: "#",
  },
];

export function Portfolio() {
  const { scrollToSection } = useScrollLock();

  return (
    <section
      id="portfolio"
      className="relative min-h-screen section-padding overflow-hidden flex flex-col items-center justify-center"
    >
      <div className="cyber-grid" />
      {/* Main Content - centered */}
      <div
        className="container-padding mx-auto relative z-10 flex items-center justify-center w-full max-w-7xl"
        style={{ gridRow: 2 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          {/* Removed My Portfolio header */}
          <div className="w-full flex justify-center items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-2 auto-rows-fr gap-x-8 gap-y-10 w-full max-w-3xl max-h-[80vh]">
              {projects.slice(0, 4).map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="cyber-card group h-full flex flex-col"
                >
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-cyber-light">
                      {project.title}
                    </h3>
                    <p className="text-cyber-light/80 mb-4 flex-1">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-cyber-dark/50 text-cyber-blue rounded-full text-xs border border-cyber-blue/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a
                      href={project.link}
                      className="inline-flex items-center text-cyber-blue hover:text-cyber-pink transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Project <HiExternalLink className="ml-1" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
