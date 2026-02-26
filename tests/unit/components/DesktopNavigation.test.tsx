import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { DesktopNavigation } from "@/components/DesktopNavigation";
import { SectionVisibilityProvider } from "@/context/SectionVisibilityContext";

function renderNavigation() {
  return render(
    <SectionVisibilityProvider>
      <DesktopNavigation />
    </SectionVisibilityProvider>
  );
}

describe("DesktopNavigation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("navigates with ArrowDown and respects transition lock", async () => {
    window.history.replaceState(null, "", "#home");

    renderNavigation();

    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(window.location.hash).toBe("#about");

    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(window.location.hash).toBe("#about");
  });

  it("ignores keyboard navigation when event target is an input", () => {
    window.history.replaceState(null, "", "#home");
    renderNavigation();

    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(window.location.hash).toBe("#home");

    input.remove();
  });

  it("navigates with wheel and throttles repeated wheel events", async () => {
    const dateNowSpy = vi.spyOn(Date, "now");
    dateNowSpy.mockReturnValueOnce(1000).mockReturnValueOnce(1100);
    window.history.replaceState(null, "", "#home");

    renderNavigation();

    fireEvent.wheel(window, { deltaY: 50 });
    expect(window.location.hash).toBe("#about");

    fireEvent.wheel(window, { deltaY: 50 });
    expect(window.location.hash).toBe("#about");

    await waitFor(() => {
      expect(window.location.hash).toBe("#about");
    });
  });
});
