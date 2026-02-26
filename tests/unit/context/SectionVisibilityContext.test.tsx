import React from "react";
import { render, screen, act } from "@testing-library/react";
import {
  SectionVisibilityProvider,
  useSectionVisibility,
} from "@/context/SectionVisibilityContext";

function ContextProbe() {
  const { visibleSection } = useSectionVisibility();
  return <div data-testid="section">{visibleSection ?? "null"}</div>;
}

describe("SectionVisibilityProvider", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("defaults to home and updates hash when URL has no section", async () => {
    window.history.replaceState(null, "", "/");
    const replaceSpy = vi.spyOn(window.history, "replaceState");

    render(
      <SectionVisibilityProvider>
        <ContextProbe />
      </SectionVisibilityProvider>
    );

    expect(await screen.findByText("home")).toBeInTheDocument();
    expect(replaceSpy).toHaveBeenCalledWith(null, "", "#home");
  });

  it("uses the current hash as the visible section", async () => {
    window.history.replaceState(null, "", "#about");

    render(
      <SectionVisibilityProvider>
        <ContextProbe />
      </SectionVisibilityProvider>
    );

    expect(await screen.findByText("about")).toBeInTheDocument();
  });

  it("syncs visible section when hash changes", async () => {
    window.history.replaceState(null, "", "#home");

    render(
      <SectionVisibilityProvider>
        <ContextProbe />
      </SectionVisibilityProvider>
    );

    expect(await screen.findByText("home")).toBeInTheDocument();

    act(() => {
      window.history.replaceState(null, "", "#skills");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    expect(await screen.findByText("skills")).toBeInTheDocument();
  });
});
