import { useEffect, useState, useCallback } from "react";

export const useScrollLock = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const sections = ["home", "about", "portfolio", "experience", "contact"];

  useEffect(() => {
    // Disable scroll on mount
    document.body.style.overflow = "hidden";

    // Set up intersection observer to track current section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sections.findIndex(
              (section) => section === entry.target.id
            );
            if (index !== -1) {
              setCurrentSection(index);
            }
          }
        });
      },
      {
        threshold: 0.5, // Section is considered visible when 50% is in view
      }
    );

    // Observe all sections
    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    // Cleanup
    return () => {
      document.body.style.overflow = "auto";
      observer.disconnect();
    };
  }, []);

  const scrollToSection = useCallback(
    (direction: "up" | "down") => {
      const newIndex =
        direction === "up"
          ? Math.max(0, currentSection - 1)
          : Math.min(sections.length - 1, currentSection + 1);

      const element = document.getElementById(sections[newIndex]);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    },
    [currentSection]
  );

  return { scrollToSection, currentSection };
};
