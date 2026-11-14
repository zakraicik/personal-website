"use client";

import { useEffect, useId, useRef, useState } from "react";
import { HiChevronDown, HiXMark } from "react-icons/hi2";

export function ChoicePicker({ label, value, choices, onChange }: {
  label: string; value: string; choices: { value: string; label: string }[]; onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else if (dialog.current?.open) dialog.current.close();
  }, [open]);
  return <>
    <button className="choice-toggle" aria-label={`${label}: ${choices.find(choice => choice.value === value)?.label}`} aria-haspopup="dialog" aria-expanded={open} aria-controls={id} onClick={() => setOpen(true)}>{choices.find(choice => choice.value === value)?.label}<HiChevronDown aria-hidden="true" /></button>
    <dialog id={id} ref={dialog} className="choice-dialog" aria-labelledby={`${id}-label`} onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div className="choice-dialog-header"><h2 id={`${id}-label`}>{label}</h2><button className="icon-button" aria-label="Close picker" onClick={() => setOpen(false)}><HiXMark aria-hidden="true" /></button></div>
      <div className="choice-grid">{choices.map(choice => <button key={choice.value} aria-pressed={value === choice.value} onClick={() => { onChange(choice.value); setOpen(false); }}>{choice.label}</button>)}</div>
    </dialog>
  </>;
}
