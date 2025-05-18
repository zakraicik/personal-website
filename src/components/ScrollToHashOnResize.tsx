"use client";
import { useEffect } from "react";

export function ScrollToHashOnResize() {
  useEffect(() => {
    let isResizing = false;
    let resizeTimer: NodeJS.Timeout;

    const handleResize = () => {
      // Set a flag that we're in resize mode
      isResizing = true;
      clearTimeout(resizeTimer);

      // Apply a temporary class to the body to disable smooth scrolling
      document.body.classList.add("resizing");

      // After resize completes
      resizeTimer = setTimeout(() => {
        // Get current section from URL hash or find visible section
        const hash = window.location.hash || "";
        const currentSection = hash
          ? document.querySelector(hash)
          : document.querySelector("section[id]");

        if (currentSection) {
          // Scroll to current section with resize-specific behavior
          currentSection.scrollIntoView({ behavior: "auto" });

          // If it's not the Hero section, add some extra handling
          if (currentSection.id !== "home") {
            // Calculate correct scroll position for centered content
            const viewportHeight = window.innerHeight;
            const sectionRect = currentSection.getBoundingClientRect();

            // Adjust scroll to center content if needed
            if (sectionRect.height < viewportHeight) {
              const adjustment = (viewportHeight - sectionRect.height) / 2;
              window.scrollBy(0, -adjustment);
            }
          }
        }

        // Reset flags and classes
        document.body.classList.remove("resizing");
        isResizing = false;
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return null;
}
