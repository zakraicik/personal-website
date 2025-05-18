"use client";

import { motion } from "framer-motion";

export function About() {
  return (
    <section
      id="about"
      className="min-h-screen flex flex-col justify-center section-padding relative overflow-hidden"
    >
      <div className="container-padding w-full max-w-full mx-auto flex-1 flex items-center justify-center relative z-10">
        <motion.div className="w-full max-w-4xl space-y-8 text-center sm:text-left">
          <motion.p
            className="text-base sm:text-lg md:text-xl text-white font-medium"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            I'm a passionate developer with a strong foundation in web
            development and a keen eye for creating{" "}
            <span className="gradient-text font-semibold">
              intuitive, dynamic user experiences
            </span>
            .
          </motion.p>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-white font-medium"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
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
        </motion.div>
      </div>
    </section>
  );
}
