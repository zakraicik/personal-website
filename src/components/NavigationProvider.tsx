"use client";

import { useEffect } from "react";
import { useSectionVisibility } from "../context/SectionVisibilityContext";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Timeline", href: "#timeline" },
  { name: "Skills", href: "#skills" },
];

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setVisibleSection } = useSectionVisibility();

  // Initialize navigation from URL hash
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const sections = navItems.map((item) => item.href.substring(1));

    if (hash && sections.includes(hash)) {
      setVisibleSection(hash);
    } else {
      setVisibleSection("home");
      window.history.replaceState(null, "", "#home");
    }
  }, [setVisibleSection]);

  return <>{children}</>;
}
