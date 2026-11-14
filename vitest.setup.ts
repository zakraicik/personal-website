/// <reference types="vitest/globals" />
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => cleanup());
beforeEach(() => {
  Object.defineProperty(window, "innerWidth", { value: 1024, writable: true, configurable: true });
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn((query: string) => ({
    get matches() { return query.includes("min-width: 768px") && window.innerWidth >= 768; },
    media: query, onchange: null,
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
    addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(),
  })),
});

// jsdom does not implement the modal lifecycle; native focus trapping is checked in-browser.
HTMLDialogElement.prototype.showModal = function () { this.open = true; };
HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new Event("close")); };
