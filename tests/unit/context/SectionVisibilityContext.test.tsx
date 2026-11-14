import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import {
  SectionVisibilityProvider,
  useSectionVisibility,
} from "@/context/SectionVisibilityContext";

function ContextProbe() {
  const { visibleSection, navigateToSection } = useSectionVisibility();
  return <><div data-testid="section">{visibleSection ?? "null"}</div><button onClick={() => navigateToSection("timeline")}>View work</button></>;
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

  it("normalizes invalid hashes after initialization", () => {
    window.history.replaceState(null, "", "#about");
    render(<SectionVisibilityProvider><ContextProbe /></SectionVisibilityProvider>);
    act(() => {
      window.history.replaceState(null, "", "#not-a-section");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(screen.getByTestId("section")).toHaveTextContent("home");
    expect(window.location.hash).toBe("#home");
  });

  it("preserves navigation history and synchronizes back/forward changes", () => {
    window.history.replaceState(null, "", "#home");
    const push = vi.spyOn(window.history, "pushState");
    render(<SectionVisibilityProvider><ContextProbe /></SectionVisibilityProvider>);
    fireEvent.click(screen.getByRole("button", { name: "View work" }));
    expect(push).toHaveBeenCalledWith(null, "", "#timeline");
    expect(screen.getByTestId("section")).toHaveTextContent("timeline");
    act(() => {
      window.history.replaceState(null, "", "#home");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect(screen.getByTestId("section")).toHaveTextContent("home");
  });
});
