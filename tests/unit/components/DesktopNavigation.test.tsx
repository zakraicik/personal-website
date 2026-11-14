import React from "react";
import { render, waitFor, fireEvent, screen, act } from "@testing-library/react";
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

  it("leaves space and arrow keys on interactive controls alone", () => {
    window.history.replaceState(null, "", "#home");
    renderNavigation();
    fireEvent.keyDown(screen.getByRole("link", { name: /Timeline/ }), { key: " " });
    expect(window.location.hash).toBe("#home");
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    fireEvent.keyDown(textarea, { key: "ArrowDown" });
    expect(window.location.hash).toBe("#home");
    textarea.remove();
  });

  it("allows native scrolling until a new gesture at the content boundary", () => {
    let now = 1000;
    vi.spyOn(Date, "now").mockImplementation(() => now);
    window.history.replaceState(null, "", "#timeline");
    renderNavigation();
    const content = document.createElement("div");
    content.style.overflowY = "auto";
    Object.defineProperties(content, { scrollHeight: { value: 500 }, clientHeight: { value: 200 } });
    content.scrollTop = 50;
    document.body.appendChild(content);
    fireEvent.wheel(content, { deltaY: 80 });
    expect(window.location.hash).toBe("#timeline");
    content.scrollTop = 300;
    now += 200;
    fireEvent.wheel(content, { deltaY: 80 });
    expect(window.location.hash).toBe("#skills");
    content.remove();
  });

  it("allows browser zoom gestures without changing sections", () => {
    window.history.replaceState(null, "", "#home");
    renderNavigation();
    fireEvent.wheel(window, { deltaY: 100, ctrlKey: true });
    expect(window.location.hash).toBe("#home");
  });
  it("switches sections with all four arrows even while a navigation link has focus", () => {
    vi.useFakeTimers();
    window.history.replaceState(null, "", "#home");
    renderNavigation();
    const link = screen.getByRole("link", { name: /Timeline/ });
    fireEvent.keyDown(link, { key: "ArrowRight" });
    expect(window.location.hash).toBe("#about");
    act(() => vi.advanceTimersByTime(450));
    fireEvent.keyDown(link, { key: "ArrowDown" });
    expect(window.location.hash).toBe("#timeline");
    act(() => vi.advanceTimersByTime(450));
    fireEvent.keyDown(link, { key: "ArrowLeft" });
    expect(window.location.hash).toBe("#about");
    act(() => vi.advanceTimersByTime(450));
    fireEvent.keyDown(link, { key: "ArrowUp" });
    expect(window.location.hash).toBe("#home");
  });

  it("does not let trackpad momentum skip multiple sections", () => {
    vi.useFakeTimers();
    window.history.replaceState(null, "", "#home");
    renderNavigation();
    fireEvent.wheel(window, { deltaY: 50 });
    expect(window.location.hash).toBe("#about");
    for (let i = 0; i < 5; i++) {
      act(() => vi.advanceTimersByTime(150));
      fireEvent.wheel(window, { deltaY: 50 });
    }
    expect(window.location.hash).toBe("#about");
    act(() => vi.advanceTimersByTime(200));
    fireEvent.wheel(window, { deltaY: 50 });
    expect(window.location.hash).toBe("#timeline");
  });

});
