/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        cyber: {
          purple: "#8A2BE2",
          blue: "#00BFFF",
          pink: "#FF1493",
          dark: "#FFFFFF",
          light: "#0A0A1F",
        },
      },
      backgroundImage: {
        "cyber-gradient":
          "linear-gradient(135deg, #8A2BE2 0%, #00BFFF 50%, #FF1493 100%)",
        "cyber-grid":
          "linear-gradient(rgba(138, 43, 226, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(138, 43, 226, 0.1) 1px, transparent 1px)",
        "cyber-noise": 'url("/noise.png")',
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        glitch: "glitch 1s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glitch: {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" },
        },
      },
      fontFamily: {
        cyber: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
};
