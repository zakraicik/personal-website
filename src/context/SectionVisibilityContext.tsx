"use client";

import { createContext, useContext, useState, ReactNode } from "react";

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
