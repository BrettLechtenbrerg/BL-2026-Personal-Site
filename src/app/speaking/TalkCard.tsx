"use client";

// One talk on the Speaking page: the title row is always visible; the full description opens on click.
// The flagship keynote starts open, so the four lanes read like a menu, not a manuscript.
import { useId, useState } from "react";
import { ChevronDown, Star } from "lucide-react";
import type { Talk } from "./page";

export function TalkCard({ talk }: { talk: Talk }) {
  const [expanded, setExpanded] = useState(!!talk.flagship);
  const panelId = useId();
  return (
    <li className={`talk${talk.flagship ? " is-flagship" : ""}${expanded ? " is-open" : ""}`}>
      {/* Heading wraps the button (accordion pattern), so each talk is still a heading for screen-reader navigation. */}
      <h3 className="talk-h">
      <button type="button" className="talk-head" aria-expanded={expanded} aria-controls={panelId} onClick={() => setExpanded((e) => !e)}>
        {talk.flagship && (
          <span className="talk-flag"><Star aria-hidden="true" />Flagship Keynote</span>
        )}
        <span className="talk-row">
          <span className="talk-titles">
            <span className="talk-title">{talk.title}</span>
            <span className="talk-sub">{talk.subtitle}</span>
            <span className="talk-dur"><b>Duration:</b> {talk.duration}</span>
          </span>
          <span className="talk-chev" aria-hidden="true"><ChevronDown /></span>
        </span>
        {!expanded && <span className="talk-more">See full description →</span>}
      </button>
      </h3>
      {expanded && (
        <div className="talk-body" id={panelId}>
          {talk.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          {talk.proof && <p className="talk-proof"><Star aria-hidden="true" />{talk.proof}</p>}
          <p className="talk-best"><b>Best for:</b> {talk.bestFor}</p>
          <p className="talk-leaves">Your audience leaves with:</p>
          <ul className="talk-list">
            {talk.leavesWith.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      )}
    </li>
  );
}
