import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { Skills } from "@/components/sections/Skills";
import { TimelineSection } from "@/components/sections/Timeline";
import { About } from "@/components/sections/About";
import { SectionVisibilityProvider } from "@/context/SectionVisibilityContext";

function renderSkills() {
  window.history.replaceState(null, "", "#skills");
  return render(<SectionVisibilityProvider><Skills /></SectionVisibilityProvider>);
}

describe("Site content", () => {
  afterEach(() => vi.useRealTimers());

  it("explores workflow steps and paginates the skills behind them", () => {
    renderSkills();
    const steps = within(screen.getByRole("group", { name: "Workflow steps" }));
    fireEvent.click(steps.getByRole("button", { name: /fit_and_evaluate/ }));
    expect(screen.getByRole("heading", { name: "Choose and test the model" })).toBeInTheDocument();
    expect(screen.getByText("PyTorch")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next tools" }));
    expect(screen.getByText("TensorFlow")).toBeInTheDocument();
    fireEvent.click(steps.getByRole("button", { name: /deploy_and_improve/ }));
    expect(screen.getByRole("button", { name: "Previous tools" })).toBeDisabled();
  });

  it("lets visitors jump between trace steps directly", () => {
    renderSkills();
    const steps = within(screen.getByRole("group", { name: "Workflow steps" }));
    fireEvent.click(steps.getByRole("button", { name: /build_the_system/ }));
    expect(screen.getByRole("heading", { name: "Make it work end to end" })).toBeInTheDocument();
    fireEvent.click(steps.getByRole("button", { name: /understand_problem/ }));
    expect(screen.getByRole("heading", { name: "Frame the right problem" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Play trace/ })).not.toBeInTheDocument();
  });

  it("shows Evoke as current, preserves language-model breadth, and has the correct Gauntlet dates", () => {
    render(<TimelineSection />);
    expect(screen.getByRole("heading", { name: "Head of Machine Learning" })).toBeInTheDocument();
    expect(screen.getByText("Apr 2026 to Present")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Evoke Security/ })).toHaveAttribute("href", "https://www.evokesecurity.com/");
    expect(screen.getByText(/Build classifiers/)).toBeInTheDocument();
    expect(screen.getByText(/semi-autonomous detection catalog/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Next highlights/ })).not.toBeInTheDocument();
    fireEvent.click(within(screen.getByRole("group", { name: "Experience and education" })).getByRole("button", { name: /Gauntlet/ }));
    expect(screen.getByText("2025 to Mar 2026")).toBeInTheDocument();
  });

  it("switches About topics without expanding the page", () => {
    render(<About />);
    expect(screen.getByText(/I lead machine learning at Evoke/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Off the clock" }));
    expect(screen.getByText(/Cheetos/)).toBeInTheDocument();
    expect(screen.getByText(/I lead machine learning at Evoke/)).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText(/Cheetos/)).toHaveAttribute("aria-hidden", "false");
  });

  it("uses a branded modal picker for compact experience selection", () => {
    render(<TimelineSection />);
    fireEvent.click(screen.getByRole("button", { name: /Choose an experience:/ }));
    const picker = screen.getByRole("dialog", { name: "Choose an experience" });
    fireEvent.click(within(picker).getByRole("button", { name: /Gauntlet/ }));
    expect(picker).not.toHaveAttribute("open");
    expect(screen.getByRole("heading", { name: "Senior Data Scientist" })).toBeInTheDocument();
  });
});
