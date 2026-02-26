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
