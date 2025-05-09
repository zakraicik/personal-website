"use client";
import { useEffect } from "react";

export function ScrollToHashOnResize() {
  useEffect(() => {
    const handleResize = () => {
      if (window.location.hash) {
        const id = window.location.hash.replace("#", "");
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "auto" });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return null;
}
