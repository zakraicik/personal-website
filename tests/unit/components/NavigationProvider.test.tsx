import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { NavigationProvider } from "@/components/NavigationProvider";
import {
  SectionVisibilityProvider,
  useSectionVisibility,
} from "@/context/SectionVisibilityContext";

function SectionProbe() {
  const { visibleSection } = useSectionVisibility();
  return <p>{visibleSection ?? "null"}</p>;
}

function renderWithProviders() {
  return render(
    <SectionVisibilityProvider>
      <NavigationProvider>
        <SectionProbe />
      </NavigationProvider>
    </SectionVisibilityProvider>
  );
}

describe("NavigationProvider", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows focus indicators for Tab navigation and clears them for arrows and clicks", () => {
    renderWithProviders();
    fireEvent.keyDown(window, { key: "Tab" });
    expect(document.documentElement).toHaveClass("keyboard-focus");
    fireEvent.keyDown(window, { key: "ArrowUp" });
    expect(document.documentElement).not.toHaveClass("keyboard-focus");
    fireEvent.keyDown(window, { key: "Tab" });
    fireEvent.pointerDown(window);
    expect(document.documentElement).not.toHaveClass("keyboard-focus");
  });

  it("keeps a valid section from the URL hash", async () => {
    window.history.replaceState(null, "", "#timeline");

    renderWithProviders();

    expect(await screen.findByText("timeline")).toBeInTheDocument();
  });

  it("falls back to home for unknown hashes", async () => {
    window.history.replaceState(null, "", "#unknown");
    const replaceSpy = vi.spyOn(window.history, "replaceState");

    renderWithProviders();

    expect(await screen.findByText("home")).toBeInTheDocument();
    expect(replaceSpy).toHaveBeenCalledWith(null, "", "#home");
  });

  it("falls back to home when hash is empty", async () => {
    window.history.replaceState(null, "", "#");
    const replaceSpy = vi.spyOn(window.history, "replaceState");

    renderWithProviders();

    expect(await screen.findByText("home")).toBeInTheDocument();
    expect(replaceSpy).toHaveBeenCalledWith(null, "", "#home");
  });
});
