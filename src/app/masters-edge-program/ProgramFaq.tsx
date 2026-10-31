"use client";

// Common questions as an accordion. Answers stay in the page (search engines read them); a closed answer is
// collapsed and hidden from screen readers. Without JavaScript every answer shows (CSS: html:not(.js)) and stays readable:
// the "closed" state is only applied once the script runs.
import { useId, useState, useSyncExternalStore } from "react";
import { ChevronDown } from "lucide-react";

const noop = () => () => {};

export function ProgramFaq({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const base = useId();
  const live = useSyncExternalStore(noop, () => true, () => false);
  return (
    <div className="acc" data-stagger>
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={faq.q} className={`acc-item${isOpen ? " is-open" : ""}`}>
            <h3 className="acc-h">
              <button type="button" className="acc-btn" aria-expanded={isOpen} aria-controls={`${base}-${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                <span>{faq.q}</span>
                <ChevronDown className="acc-chev" aria-hidden="true" />
              </button>
            </h3>
            <div className="acc-panel" id={`${base}-${i}`} inert={live && !isOpen} aria-hidden={live && !isOpen ? true : undefined}>
              <div><p>{faq.a}</p></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
