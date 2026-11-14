"use client";

import { useState } from "react";
import { HiArrowDown, HiCommandLine } from "react-icons/hi2";
import { skills } from "@/data/skills";
import { skillTrace } from "@/data/skillTrace";
import { Pagination } from "@/components/Pagination";
import { usePageCapacity } from "@/hooks/usePageCapacity";

export function Skills() {
  const [selected, setSelected] = useState(0);
  const [page, setPage] = useState(0);
  const { ref, capacity } = usePageCapacity(56, 4, 8);
  const step = skillTrace[selected];
  const tools = skills.filter(skill => step.categories.includes(skill.category));
  const pageSize = capacity * 2;
  const pages = Math.ceil(tools.length / pageSize);
  const currentPage = Math.min(page, pages - 1);

  const selectStep = (index: number) => { setSelected(index); setPage(0); };

  return (
    <div className="section-body bounded-section skills-body">
      <div className="section-heading"><p className="eyebrow">03 / An interactive skill trace</p><h2 id="skills-heading">One problem.<br /><span className="accent-text">Many tools.</span></h2><p>Follow the trace. Select a step to explore the skills behind it.</p></div>
      <div className="mobile-trace-controls" role="group" aria-label="Trace steps">
        <div>{skillTrace.map((item, index) => <button key={item.id} aria-label={`Step ${index + 1}: ${item.title}`} aria-pressed={selected === index} onClick={() => selectStep(index)}>{String(index + 1).padStart(2, "0")}</button>)}</div>
      </div>
      <div className="trace-workspace">
        <div className="trace-console">
          <div className="trace-console-header"><HiCommandLine aria-hidden="true" /><span>problem_to_production.trace</span><span className="trace-mode">explore</span></div>
          <div className="trace-steps" role="group" aria-label="Workflow steps">{skillTrace.map((item, index) => <button key={item.id} className={`trace-step ${selected === index ? "is-selected" : ""}`} aria-pressed={selected === index} onClick={() => selectStep(index)}>
            <span className="trace-step-number mono">{String(index + 1).padStart(2, "0")}</span>
            <span><strong>{item.call}<span className="trace-parens">()</span></strong><span>{item.title}</span></span>
            {index < skillTrace.length - 1 && <HiArrowDown className="trace-down" aria-hidden="true" />}
          </button>)}</div>
          <div className="trace-console-footer"><span className="mono">inspect any step</span><span className="mono">5 stages</span></div>
        </div>
        <div className="trace-detail">
          <div className="trace-detail-heading" aria-live="polite"><span className="eyebrow">STEP 0{selected + 1} / {step.call}()</span><h3>{step.title}</h3><p>{step.description}</p></div>
          <div className="tool-grid-space" ref={ref}>
            <ul className="tool-grid" key={step.id + currentPage}>{tools.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map(tool => <li key={tool.name}><span className="tool-marker" aria-hidden="true">↳</span>{tool.name}</li>)}</ul>
          </div>
          <div className="trace-output"><span className="mono">returns</span><span>{step.output}</span></div>
          <Pagination page={currentPage} pages={pages} onChange={setPage} item="tools" />
        </div>
      </div>
    </div>
  );
}
