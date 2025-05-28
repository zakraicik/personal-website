"use client";

import { motion } from "framer-motion";

export function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden min-h-screen flex items-center"
    >
      <div className="px-6 sm:px-8 md:px-6 w-full max-w-full mx-auto flex-1 flex items-center justify-center relative z-10 py-8">
        <motion.div className="w-full max-w-4xl space-y-6 sm:space-y-8 text-center sm:text-left">
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-white font-medium leading-relaxed"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            I&apos;m a{" "}
            <span className="gradient-text font-semibold">data scientist</span>{" "}
            with a passion for learning and practical experience across the{" "}
            <span className="gradient-text font-semibold">
              full development stack
            </span>{" "}
            — yes, I actually built this website with Next.js (and only broke it
            twice!).
          </motion.p>
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-white font-medium leading-relaxed"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            My approach:{" "}
            <span className="gradient-text font-semibold">
              understand the problem deeply
            </span>
            , then build{" "}
            <span className="gradient-text font-semibold">
              data-driven solutions
            </span>{" "}
            that address real-world challenges effectively. I excel at{" "}
            <span className="gradient-text font-semibold">leading teams</span>{" "}
            and inspiring others to develop thorough problem understanding
            before selecting the optimal tools and architecture.
          </motion.p>
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-white font-medium leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            When I&apos;m not coding, I&apos;m enjoying life in{" "}
            <span className="gradient-text font-semibold">San Diego</span> with
            my wife and dog, secretly indulging in my guilty pleasure —{" "}
            <span className="gradient-text font-semibold">Cheetos</span>.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
