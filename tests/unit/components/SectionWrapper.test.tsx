import React from "react";
import { render, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { SectionWrapper } from "@/components/SectionWrapper";
import {
  SectionVisibilityProvider,
  useSectionVisibility,
} from "@/context/SectionVisibilityContext";

function SectionController({ section }: { section: string }) {
  const { setVisibleSection } = useSectionVisibility();

  useEffect(() => {
    setVisibleSection(section);
  }, [section, setVisibleSection]);

  return null;
}

function renderWrappedSection(id: string, activeSection: string) {
  return render(
    <SectionVisibilityProvider>
      <SectionController section={activeSection} />
      <SectionWrapper id={id}>
        <div>Section Content</div>
      </SectionWrapper>
    </SectionVisibilityProvider>
  );
}

describe("SectionWrapper", () => {
  it("renders active section at translateY(0%) with active styling", async () => {
    window.history.replaceState(null, "", "#about");
    const { container } = renderWrappedSection("about", "about");

    await waitFor(() => {
      const section = container.querySelector("#about");
      expect(section).toHaveClass("opacity-100", "z-10");
      expect(section).toHaveStyle({ transform: "translateY(0%)" });
    });
  });

  it("renders adjacent inactive section offset by one viewport", async () => {
    window.history.replaceState(null, "", "#home");
    const { container } = renderWrappedSection("about", "home");

    await waitFor(() => {
      const section = container.querySelector("#about");
      expect(section).toHaveClass("opacity-60", "z-[5]");
      expect(section).toHaveStyle({ transform: "translateY(100%)" });
    });
  });

  it("falls back to home when section state is unknown", async () => {
    window.history.replaceState(null, "", "#unknown");
    const { container } = renderWrappedSection("about", "unknown");

    await waitFor(() => {
      const section = container.querySelector("#about");
      expect(section).toHaveClass("opacity-60", "z-[5]");
      expect(section).toHaveStyle({ transform: "translateY(100%)" });
    });
  });
});
