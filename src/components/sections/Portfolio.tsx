"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { HiExternalLink } from "react-icons/hi";

const projects = [
  {
    title: "Project 1",
    description: "A brief description of the project and its key features.",
    image: "/placeholder-1.jpg",
    tags: ["React", "Node.js", "MongoDB"],
    link: "#",
  },
  {
    title: "Project 2",
    description: "A brief description of the project and its key features.",
    image: "/placeholder-2.jpg",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    link: "#",
  },
  {
    title: "Project 3",
    description: "A brief description of the project and its key features.",
    image: "/placeholder-3.jpg",
    tags: ["React", "GraphQL", "AWS"],
    link: "#",
  },
];

export function Portfolio() {
  return (
    <section
      id="portfolio"
      className="section-padding relative overflow-hidden"
    >
      <div className="cyber-grid" />
      <div className="container-padding mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="heading-2 text-center mb-12">
            <span className="glitch-text" data-text="My Portfolio">
              My Portfolio
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="cyber-card group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-cyber-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-cyber-light">
                    {project.title}
                  </h3>
                  <p className="text-cyber-light/80 mb-4">
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
        </motion.div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyber-pink/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </section>
  );
}
