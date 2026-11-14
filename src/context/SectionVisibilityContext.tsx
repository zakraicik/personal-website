"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { DEFAULT_SECTION_ID, SECTION_IDS } from "@/data/navigation";

interface SectionVisibilityContextType {
  visibleSection: string | null;
  setVisibleSection: (section: string | null) => void;
  navigateToSection: (section: string) => void;
  isTransitioning: boolean;
}

const SectionVisibilityContext = createContext<
  SectionVisibilityContextType | undefined
>(undefined);

export function SectionVisibilityProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [visibleSection, setVisibleSection] = useState<string | null>(DEFAULT_SECTION_ID);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const transitionLocked = useRef(false);
  const focusNextSection = useRef(false);

  const navigateToSection = useCallback((section: string) => {
    if (!SECTION_IDS.includes(section) || transitionLocked.current || section === visibleSection) return;
    focusNextSection.current = true;
    setVisibleSection(section);
    window.history.pushState(null, "", `#${section}`);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      transitionLocked.current = true;
      setIsTransitioning(true);
      transitionTimer.current = setTimeout(() => {
        transitionLocked.current = false;
        setIsTransitioning(false);
      }, 260);
    }
  }, [visibleSection]);

  useEffect(() => {
    if (focusNextSection.current && visibleSection) {
      document.getElementById(visibleSection)?.focus({ preventScroll: true });
      focusNextSection.current = false;
    }
  }, [visibleSection]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const section = SECTION_IDS.includes(hash) ? hash : DEFAULT_SECTION_ID;
      setVisibleSection(section);
      if (section !== hash) {
        window.history.replaceState(null, "", `#${section}`);
      }
      clearTimeout(transitionTimer.current);
      transitionLocked.current = false;
      setIsTransitioning(false);
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
      clearTimeout(transitionTimer.current);
    };
  }, []);

  return (
    <SectionVisibilityContext.Provider
      value={{ visibleSection, setVisibleSection, navigateToSection, isTransitioning }}
    >
      {children}
    </SectionVisibilityContext.Provider>
  );
}

export function useSectionVisibility() {
  const context = useContext(SectionVisibilityContext);
  if (context === undefined) {
    throw new Error(
      "useSectionVisibility must be used within a SectionVisibilityProvider"
    );
  }
  return context;
}
