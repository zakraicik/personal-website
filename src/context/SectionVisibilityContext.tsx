"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface SectionVisibilityContextType {
  visibleSection: string | null;
  setVisibleSection: (section: string | null) => void;
}

const SectionVisibilityContext = createContext<
  SectionVisibilityContextType | undefined
>(undefined);

export function SectionVisibilityProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [visibleSection, setVisibleSection] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setVisibleSection(hash);
      } else {
        setVisibleSection("home");
        window.history.replaceState(null, "", "#home");
      }
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <SectionVisibilityContext.Provider
      value={{ visibleSection, setVisibleSection }}
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
