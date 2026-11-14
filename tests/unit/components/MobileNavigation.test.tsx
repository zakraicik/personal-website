import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MobileNavigation } from "@/components/MobileNavigation";
import { DesktopNavigation } from "@/components/DesktopNavigation";
import { SectionVisibilityProvider } from "@/context/SectionVisibilityContext";

function renderMobile() {
  window.innerWidth = 390;
  window.history.replaceState(null, "", "#home");
  return render(<SectionVisibilityProvider><DesktopNavigation /><MobileNavigation /></SectionVisibilityProvider>);
}

function swipe(target: HTMLElement, from = 250, to = 80) {
  fireEvent.touchStart(target, { touches: [{ clientX: 100, clientY: from }] });
  fireEvent.touchEnd(target, { changedTouches: [{ clientX: 100, clientY: to }] });
}

describe("MobileNavigation", () => {
  it("opens a named modal and closes after selecting a section", () => {
    renderMobile();
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const panel = screen.getByRole("dialog", { name: "Explore" });
    fireEvent.click(screen.getByRole("navigation", { name: "Mobile navigation" }).querySelector('a[href="#timeline"]')!);
    expect(window.location.hash).toBe("#timeline");
    expect(panel).not.toHaveAttribute("open");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on escape cancellation and backdrop clicks", () => {
    renderMobile();
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(toggle);
    fireEvent(screen.getByRole("dialog"), new Event("cancel", { cancelable: true }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    fireEvent.click(screen.getByRole("dialog"));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("leaves desktop wheel and keyboard shortcuts inactive on mobile", () => {
    renderMobile();
    fireEvent.wheel(window, { deltaY: 100 });
    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(window.location.hash).toBe("#home");
  });

  it("navigates on vertical swipes but leaves horizontal gestures alone", () => {
    renderMobile();
    fireEvent.touchStart(document.body, { touches: [{ clientX: 100, clientY: 200 }] });
    fireEvent.touchEnd(document.body, { changedTouches: [{ clientX: 300, clientY: 100 }] });
    expect(window.location.hash).toBe("#home");
    swipe(document.body);
    expect(window.location.hash).toBe("#about");
    swipe(document.body);
    expect(window.location.hash).toBe("#about");
  });

  it("does not turn scrolling or interacting with a control into section navigation", () => {
    renderMobile();
    const content = document.createElement("div");
    content.style.overflowY = "auto";
    Object.defineProperties(content, { scrollHeight: { value: 500 }, clientHeight: { value: 200 } });
    document.body.appendChild(content);
    swipe(content);
    expect(window.location.hash).toBe("#home");
    content.remove();
    swipe(screen.getByRole("button", { name: "Open navigation" }));
    expect(window.location.hash).toBe("#home");
  });

  it("does not switch sections while the menu is open", () => {
    renderMobile();
    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    swipe(document.body);
    expect(window.location.hash).toBe("#home");
  });

  it("leaves swipes alone while a content picker is open", () => {
    renderMobile();
    const picker = document.createElement("dialog");
    document.body.appendChild(picker);
    picker.showModal();
    swipe(document.body);
    expect(window.location.hash).toBe("#home");
    picker.remove();
  });
});
