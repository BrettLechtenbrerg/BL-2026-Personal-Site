"use client";

//==============================================================================
// Academy — one printable certificate (course or full top-rank credential)
//==============================================================================
// Same accent-and-primary frame for both tiers; the copy and seal differ.
// Course certificates are system-generated on completing every module in a
// course. The top-rank certificate is the Certifier-backed credential for
// the entire package (all courses + capstone + exam).
//==============================================================================

import { Printer } from "lucide-react";
import { academyConfig } from "@/content/academy.config";

const A = academyConfig;

export interface CertificateCardProps {
  id: string;
  tier: "course" | "masters-edge";
  memberName: string;
  /** Course title (course tier) — ignored for masters-edge. */
  title?: string;
  emoji?: string;
  dateIso: string;
  /** "hide" removes this card from the print layout so one certificate prints alone. */
  printState?: "show" | "hide";
  onPrint?: () => void;
}

export function formatCertDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function CertificateCard({
  id, tier, memberName, title, emoji, dateIso, printState = "show", onPrint,
}: CertificateCardProps) {
  const isFull = tier === "masters-edge";
  return (
    <section data-print={printState} className="print-certificate">
      {onPrint && (
        <div className="no-print mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold">
            {isFull ? A.ranks.top.badgeName : `${emoji ?? "📜"} ${title}`}
          </h2>
          <button
            onClick={onPrint}
            className="flex min-h-11 items-center gap-2 rounded-lg bg-academy-primary px-5 py-2 font-heading font-bold text-academy-fg hover:bg-academy-primary-dark"
          >
            <Printer size={18} /> Print / Save PDF
          </button>
        </div>
      )}

      <div
        id={id}
        className="academy-brand relative rounded-lg border-[10px] border-[var(--academy-accent-base)] bg-academy-fg px-8 py-12 text-center text-[var(--academy-ink)] shadow-[0_0_60px_rgb(var(--academy-accent-rgb)/0.3)] sm:px-16"
      >
        <div className="pointer-events-none absolute inset-3 border border-[rgb(var(--academy-primary-rgb)/0.4)]" />

        <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-[var(--academy-primary)]">
          {A.academy.name}
        </p>
        <h2 className="mt-4 font-heading text-4xl font-black text-[var(--academy-ink)]">
          {isFull ? "Certificate of Mastery" : "Certificate of Completion"}
        </h2>
        <p className="mt-6 text-sm uppercase tracking-widest text-[var(--academy-ink-muted)]">This certifies that</p>
        <p className="mt-2 font-heading text-3xl font-bold text-[var(--academy-primary)]">{memberName}</p>

        {isFull ? (
          <>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-[var(--academy-ink-muted)]">
              {A.certificate.topBody}
            </p>
            <p className="mt-4 font-heading text-2xl font-black tracking-wide text-[var(--academy-ink)]">
              {A.certificate.topLine}
            </p>
          </>
        ) : (
          <>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-[var(--academy-ink-muted)]">
              has completed every {A.vocab.module} and passed every assessment in the {A.vocab.course}
            </p>
            <p className="mt-4 font-heading text-2xl font-black tracking-wide text-[var(--academy-ink)]">
              {emoji ?? "📜"} {title}
            </p>
          </>
        )}

        <div className="mx-auto mt-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[var(--academy-accent-light-base)] via-[var(--academy-accent-base)] to-[var(--academy-accent-dark-base)] shadow-lg">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[var(--academy-accent-dark-base)] text-3xl">
            {isFull ? A.certificate.sealEmoji : emoji ?? "📜"}
          </div>
        </div>

        <div className="mt-8 flex items-end justify-between px-4 text-left">
          <div>
            <p className="border-t border-[var(--academy-ink)] pt-1 font-heading text-sm font-bold">{A.certificate.signer}</p>
            <p className="text-xs text-[var(--academy-ink-muted)]">{A.certificate.signerTitle}</p>
          </div>
          <div className="text-right">
            <p className="border-t border-[var(--academy-ink)] pt-1 font-heading text-sm font-bold">{formatCertDate(dateIso)}</p>
            <p className="text-xs text-[var(--academy-ink-muted)]">{isFull ? "Date of Certification" : "Date of Completion"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
