"use client";

import { useEffect } from "react";
import { useSectionVisibility } from "../context/SectionVisibilityContext";
import { DEFAULT_SECTION_ID, SECTION_IDS } from "@/data/navigation";

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setVisibleSection } = useSectionVisibility();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") document.documentElement.classList.add("keyboard-focus");
      else if (event.key.startsWith("Arrow")) document.documentElement.classList.remove("keyboard-focus");
    };
    const handlePointerDown = () => document.documentElement.classList.remove("keyboard-focus");
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
      document.documentElement.classList.remove("keyboard-focus");
    };
  }, []);

  // Initialize navigation from URL hash
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");

    if (hash && SECTION_IDS.includes(hash)) {
      setVisibleSection(hash);
    } else {
      setVisibleSection(DEFAULT_SECTION_ID);
      window.history.replaceState(null, "", `#${DEFAULT_SECTION_ID}`);
    }
  }, [setVisibleSection]);

  return <>{children}</>;
}
