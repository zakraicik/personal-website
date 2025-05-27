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
import { contactMethods } from "@/data/contact";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

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
      <div className="px-4 md:px-6 w-full max-w-full mx-auto flex-1 flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          {/* Contact Information List */}
          <div className="space-y-6">
            {contactMethods.map((method, idx) => {
              // Map icon string to component
              const icons: any = { HiMail, HiPhone };
              let IconComponent = icons[method.icon];
              // Special case for GitHub SVG
              if (method.icon === "GitHub") {
                IconComponent = () => (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.263.82-.582 0-.288-.012-1.243-.017-2.252-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.606-2.665-.304-5.466-1.334-5.466-5.933 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.404 1.02.005 2.04.137 3 .404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.625-5.475 5.922.43.37.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.699.825.58C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                );
              }

              return (
                <motion.div
                  key={method.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * idx }}
                  className="flex items-center gap-4 py-3"
                >
                  <div
                    className={`flex-shrink-0 ${
                      method.label === "Location"
                        ? "text-cyber-pink"
                        : method.label === "GitHub"
                        ? "text-cyber-green"
                        : method.label === "Phone"
                        ? "text-cyber-purple"
                        : "text-cyber-blue"
                    }`}
                  >
                    {IconComponent && <IconComponent />}
                  </div>

                  <div className="flex-1">
                    <div
                      className={`text-sm font-medium mb-1 ${
                        method.label === "Location"
                          ? "text-cyber-pink"
                          : method.label === "GitHub"
                          ? "text-cyber-green"
                          : method.label === "Phone"
                          ? "text-cyber-purple"
                          : "text-cyber-blue"
                      }`}
                    >
                      {method.label}
                    </div>

                    {method.link ? (
                      <a
                        href={method.link}
                        target={method.icon === "GitHub" ? "_blank" : undefined}
                        rel={
                          method.icon === "GitHub"
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="text-white/90 hover:text-white transition-colors duration-200 underline decoration-white/30 hover:decoration-white/60"
                      >
                        {method.value}
                        {method.icon === "GitHub" && (
                          <span className="ml-1 text-xs">↗</span>
                        )}
                      </a>
                    ) : (
                      <div className="text-white/90">{method.value}</div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
