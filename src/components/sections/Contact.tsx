"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiPaperAirplane,
} from "react-icons/hi";

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
    <section id="contact" className="section-padding relative overflow-hidden">
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
            <span className="glitch-text" data-text="Get in Touch">
              Get in Touch
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <motion.div
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="p-3 bg-cyber-dark/50 rounded-lg border border-cyber-blue/20">
                  <HiMail className="text-cyber-blue text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-cyber-light">Email</h3>
                  <p className="text-cyber-light/80">your.email@example.com</p>
                </div>
              </motion.div>
              <motion.div
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="p-3 bg-cyber-dark/50 rounded-lg border border-cyber-blue/20">
                  <HiPhone className="text-cyber-blue text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-cyber-light">Phone</h3>
                  <p className="text-cyber-light/80">+1 (555) 123-4567</p>
                </div>
              </motion.div>
              <motion.div
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="p-3 bg-cyber-dark/50 rounded-lg border border-cyber-blue/20">
                  <HiLocationMarker className="text-cyber-blue text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-cyber-light">Location</h3>
                  <p className="text-cyber-light/80">San Francisco, CA</p>
                </div>
              </motion.div>
            </div>
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1 text-cyber-light"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-cyber-dark/50 border border-cyber-blue/20 rounded-lg focus:ring-2 focus:ring-cyber-blue focus:border-transparent text-cyber-light placeholder-cyber-light/50"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1 text-cyber-light"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-cyber-dark/50 border border-cyber-blue/20 rounded-lg focus:ring-2 focus:ring-cyber-blue focus:border-transparent text-cyber-light placeholder-cyber-light/50"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-1 text-cyber-light"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-cyber-dark/50 border border-cyber-blue/20 rounded-lg focus:ring-2 focus:ring-cyber-blue focus:border-transparent text-cyber-light placeholder-cyber-light/50"
                  required
                />
              </div>
              <button
                type="submit"
                className="cyber-button w-full flex items-center justify-center space-x-2"
              >
                <span>Send Message</span>
                <HiPaperAirplane className="transform rotate-90" />
              </button>
            </motion.form>
          </div>
        </motion.div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyber-blue/20 rounded-full"
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
