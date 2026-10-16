"use client";

//==============================================================================
// Survey Preview — "Share" box for the survey team (GIFT CONNECT, 16 Oct 2026).
// Copy buttons for every survey link and a ready-to-send message for the team,
// plus Print / Save as PDF. Links are built from the address the page is open
// on, so they always point at this site. Nothing here reads survey answers.
//==============================================================================

import { useEffect, useState } from "react";
import { Check, Copy, Printer } from "lucide-react";
import { shareLinks, teamMessage } from "@/lib/survey-text";

const LINKS = shareLinks();

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers / blocked clipboard: fall back to a hidden textarea.
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

/** programCode: only sent to the team's page; codeNeeded: signup asks for one (profile signup.accessCodeEnv). */
export default function SurveyShareBox({ programCode, codeNeeded }: { programCode: string; codeNeeded: boolean }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Deferred a tick so no state is set synchronously inside the effect.
    const t = setTimeout(() => setOrigin(window.location.origin), 0);
    return () => clearTimeout(t);
  }, []);

  const copy = async (id: string, text: string, what: string) => {
    const ok = await copyText(text);
    setCopied(ok ? id : null);
    setStatus(ok ? `${what} copied.` : "Couldn't copy. Select the text and copy it yourself.");
    if (ok) setTimeout(() => setCopied((c) => (c === id ? null : c)), 2500);
  };

  const button =
    "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-academy-fg/15 px-3 py-2 text-sm font-semibold hover:bg-academy-fg/10";

  return (
    <section aria-labelledby="share-heading" className="no-print mt-6 rounded-2xl border border-academy-fg/10 bg-academy-fg/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="share-heading" className="font-heading text-xl font-bold">
            Share the surveys
          </h2>
          <p className="mt-1 text-sm text-academy-fg/75">Everyone needs to log in with their own account to open these links.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!origin}
            onClick={() => copy("message", teamMessage(origin, programCode, codeNeeded), "Message for the team")}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-academy-primary px-4 py-2 font-heading font-bold text-academy-fg hover:bg-academy-primary-dark disabled:opacity-60"
          >
            {copied === "message" ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
            {copied === "message" ? "Copied" : "Copy a message for the team"}
          </button>
          <button type="button" onClick={() => window.print()} className={button}>
            <Printer size={16} aria-hidden /> Print or save as PDF
          </button>
        </div>
      </div>

      <ul className="mt-4 divide-y divide-academy-fg/10">
        {LINKS.map((l) => {
          const url = origin ? `${origin}${l.path}` : l.path;
          return (
            <li key={l.path} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div className="min-w-0">
                <p className="font-semibold">{l.label}</p>
                <p className="text-sm text-academy-fg/70">{l.note}</p>
                <p className="break-all text-sm text-academy-fg/80" translate="no">
                  {url}
                </p>
              </div>
              <button
                type="button"
                disabled={!origin}
                onClick={() => copy(l.path, url, `${l.label} link`)}
                aria-label={`Copy link: ${l.label}`}
                className={`${button} disabled:opacity-60`}
              >
                {copied === l.path ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
                {copied === l.path ? "Copied" : "Copy link"}
              </button>
            </li>
          );
        })}
      </ul>
      <p aria-live="polite" className="sr-only">
        {status}
      </p>
    </section>
  );
}
