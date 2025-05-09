"use client";

import { motion } from "framer-motion";
import { HiArrowUp, HiArrowDown } from "react-icons/hi";
import { useScrollLock } from "@/hooks/useScrollLock";

export function About() {
  const { scrollToSection } = useScrollLock();

  return (
    <section
      id="about"
      className="relative min-h-screen section-padding overflow-hidden flex items-center justify-center scroll-mt-24"
      style={{ minHeight: "100vh" }}
    >
      {/* Vertically centered content */}
      <div className="w-full max-w-4xl z-10 px-8 sm:px-12 space-y-8">
        <motion.p
          className="text-base sm:text-lg md:text-xl text-cyber-light/90 font-medium"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          I'm a passionate developer with a strong foundation in web development
          and a keen eye for creating{" "}
          <span className="gradient-text font-semibold">
            intuitive, dynamic user experiences
          </span>
          .
        </motion.p>
        <motion.p
          className="text-base sm:text-lg md:text-xl text-cyber-light/90 font-medium"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          With expertise in{" "}
          <span className="gradient-text font-semibold">
            modern web technologies
          </span>
          , I specialize in building{" "}
          <span className="gradient-text font-semibold">
            responsive, performant applications
          </span>{" "}
          that solve real-world problems.
        </motion.p>
      </div>
    </section>
  );
}
