import React from "react";
import { render, screen } from "@testing-library/react";
import { SectionWrapper } from "@/components/SectionWrapper";
import { SectionVisibilityProvider } from "@/context/SectionVisibilityContext";

function renderSection(hash: string) {
  window.history.replaceState(null, "", hash);
  return render(<SectionVisibilityProvider><SectionWrapper id="about"><h2 id="about-heading">About</h2><button>Read more</button></SectionWrapper></SectionVisibilityProvider>);
}

describe("SectionWrapper", () => {
  it("exposes the active section as a named region", () => {
    const { container } = renderSection("#about");
    expect(screen.getByRole("region", { name: "About" })).toHaveStyle({ transform: "translateY(0px)" });
    expect(container.querySelector("section")).not.toHaveAttribute("inert");
  });

  it("hides inactive content from assistive technology and keyboard focus", () => {
    const { container } = renderSection("#home");
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("inert");
    expect(section).toHaveAttribute("aria-hidden", "true");
    expect(section).toHaveStyle({ transform: "translateY(12px)" });
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("falls back to home when the hash is invalid", () => {
    const { container } = renderSection("#unknown");
    expect(container.querySelector("section")).toHaveStyle({ transform: "translateY(12px)" });
    expect(window.location.hash).toBe("#home");
  });
});
