"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiPaperAirplane,
  HiArrowUp,
} from "react-icons/hi";
import { useScrollLock } from "@/hooks/useScrollLock";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { scrollToSection } = useScrollLock();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section
      id="contact"
      className="min-h-screen flex flex-col justify-center section-padding relative overflow-hidden"
    >
      <div className="container-padding w-full max-w-full mx-auto flex-1 flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email Card */}
            <div className="flex items-center gap-6 p-4 bg-transparent rounded-lg">
              <div className="p-3 bg-cyber-dark/50 rounded-lg border border-cyber-blue/20 flex-shrink-0">
                <HiMail className="text-cyber-blue text-2xl" />
              </div>
              <div>
                <h3 className="font-semibold text-cyber-light">Email</h3>
                <p className="text-cyber-light/80">your.email@example.com</p>
              </div>
            </div>
            {/* Phone Card */}
            <div className="flex items-center gap-6 p-4 bg-transparent rounded-lg">
              <div className="p-3 bg-cyber-dark/50 rounded-lg border border-cyber-blue/20 flex-shrink-0">
                <HiPhone className="text-cyber-blue text-2xl" />
              </div>
              <div>
                <h3 className="font-semibold text-cyber-light">Phone</h3>
                <p className="text-cyber-light/80">+1 (555) 123-4567</p>
              </div>
            </div>
            {/* Location Card */}
            <div className="flex items-center gap-6 p-4 bg-transparent rounded-lg">
              <div className="p-3 bg-cyber-dark/50 rounded-lg border border-cyber-blue/20 flex-shrink-0">
                <HiLocationMarker className="text-cyber-blue text-2xl" />
              </div>
              <div>
                <h3 className="font-semibold text-cyber-light">Location</h3>
                <p className="text-cyber-light/80">San Francisco, CA</p>
              </div>
            </div>
            {/* GitHub Card */}
            <div className="flex items-center gap-6 p-4 bg-transparent rounded-lg">
              <div className="p-3 bg-cyber-dark/50 rounded-lg border border-cyber-blue/20 flex-shrink-0">
                <svg
                  className="text-cyber-blue text-2xl"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.263.82-.582 0-.288-.012-1.243-.017-2.252-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.606-2.665-.304-5.466-1.334-5.466-5.933 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.404 1.02.005 2.04.137 3 .404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.625-5.475 5.922.43.37.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.699.825.58C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-cyber-light">GitHub</h3>
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyber-light/80 hover:text-cyber-blue underline"
                >
                  github.com/yourusername
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
