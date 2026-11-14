"use client";

import { useState } from "react";
import { HiArrowUpRight, HiAcademicCap, HiBriefcase, HiArrowRight, HiArrowPath, HiCircleStack, HiCpuChip, HiShieldCheck, HiCube, HiChartBar, HiChatBubbleLeftRight, HiCommandLine, HiCloud } from "react-icons/hi2";
import { SiPython, SiScikitlearn, SiGooglebigquery, SiGithubactions } from "react-icons/si";
import type { IconType } from "react-icons";
import { timelineData } from "@/data/timelineData";
import { ChoicePicker } from "@/components/ChoicePicker";

const entries = [...timelineData].sort((a, b) =>
  (b.endYear === "Present" ? Infinity : Number(b.endYear)) - (a.endYear === "Present" ? Infinity : Number(a.endYear)));
const toolIcons: Record<string, IconType> = {
  Python: SiPython, "scikit-learn": SiScikitlearn, dbt: HiCube,
  BigQuery: SiGooglebigquery, AWS: HiCloud, "GitHub Actions": SiGithubactions,
  Classification: HiCpuChip, "Anomaly detection": HiChartBar,
  "LM fine-tuning": HiChatBubbleLeftRight, "Agent evaluation": HiCommandLine,
};

export function TimelineSection() {
  const [selected, setSelected] = useState(0);
  const item = entries[selected];
  const selectEntry = (index: number) => setSelected(index);

  return (
    <div className="section-body bounded-section timeline-body">
      <div className="section-heading"><p className="eyebrow">02 / The journey</p><h2 id="timeline-heading">Always <span className="accent-text">building.</span></h2><p>Machine learning, financial systems, and the teams behind them.</p></div>
      <div className="compact-selector">
        <ChoicePicker label="Choose an experience" value={String(selected)} choices={entries.map((entry, index) => ({ value: String(index), label: `${entry.subtitle}: ${entry.title}` }))} onChange={value => selectEntry(Number(value))} />
      </div>
      <div className="timeline-workspace">
        <div className="experience-index" role="group" aria-label="Experience and education">
          {entries.map((entry, index) => <button key={entry.title} aria-pressed={selected === index} onClick={() => selectEntry(index)}>
            {entry.type === "education" ? <HiAcademicCap aria-hidden="true" /> : <HiBriefcase aria-hidden="true" />}
            <span><strong>{entry.subtitle}</strong><span>{entry.title}</span></span>
          </button>)}
        </div>
        <article className="experience-card" aria-live="polite" aria-atomic="true">
          <div className="experience-card-header">
            <span className="experience-date mono">{item.startMonth ? `${item.startMonth} ` : ""}{item.startYear} to {item.endMonth ? `${item.endMonth} ` : ""}{item.endYear}</span>
            <h3>{item.title}</h3>
            <p className="experience-company">{item.link ? <a href={item.link} target="_blank" rel="noopener noreferrer" aria-label={`${item.subtitle} (opens in a new tab)`}>{item.subtitle}<HiArrowUpRight aria-hidden="true" /></a> : item.subtitle}</p>
            {item.summary && <p className="experience-summary">{item.summary}</p>}
          </div>
          <ul className="experience-points" key={item.title}>{item.description.map(text => <li key={text}><span className="experience-point-marker" aria-hidden="true">↳</span><span>{text}</span></li>)}</ul>
          <div className="experience-extras">
            <div className="experience-flow" aria-label="The work at a glance">
              <div className="experience-flow-nodes">{item.flow.map((label, index) => {
                const Icon = [HiCircleStack, HiCpuChip, item.type === "education" ? HiAcademicCap : HiShieldCheck][index];
                return <div className="experience-flow-part" key={label}><div className="experience-flow-node"><Icon aria-hidden="true" /><span>{label}</span></div>{index < 2 && <HiArrowRight className="experience-flow-arrow" aria-hidden="true" />}</div>;
              })}</div>
              {item.loop && <div className="experience-loop"><HiArrowPath aria-hidden="true" /><span>{item.loop}</span></div>}
            </div>
            <div className="experience-toolbox"><span className="eyebrow">Tools & concepts</span><ul>{item.tools.map(tool => {
              const Icon = toolIcons[tool] || HiCube;
              return <li key={tool}><Icon aria-hidden="true" />{tool}</li>;
            })}</ul></div>
          </div>
        </article>
      </div>
    </div>
  );
}
