"use client";

//==============================================================================
// Academy — one printable certificate (course or full Master's Edge)
//==============================================================================
// Same gold-and-cranberry frame for both tiers; the copy and seal differ.
// Course certificates are system-generated on completing every module in a
// course. The Master's Edge certificate is the Certifier-backed credential for
// the entire package (all courses + capstone + exam).
//==============================================================================

import { Printer } from "lucide-react";

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
            {isFull ? "Certified Master's Edge" : `${emoji ?? "📜"} ${title}`}
          </h2>
          <button
            onClick={onPrint}
            className="flex min-h-11 items-center gap-2 rounded-lg bg-cranberry px-5 py-2 font-heading font-bold text-white hover:bg-cranberry-dark"
          >
            <Printer size={18} /> Print / Save PDF
          </button>
        </div>
      )}

      <div
        id={id}
        className="academy-brand relative rounded-lg border-[10px] border-[#D4AF37] bg-white px-8 py-12 text-center text-[#1A1A1A] shadow-[0_0_60px_rgba(212,175,55,0.3)] sm:px-16"
      >
        <div className="pointer-events-none absolute inset-3 border border-[#9B1B30]/40" />

        <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-[#9B1B30]">
          Master&apos;s Edge Academy
        </p>
        <h2 className="mt-4 font-heading text-4xl font-black text-[#1A1A1A]">
          {isFull ? "Certificate of Mastery" : "Certificate of Completion"}
        </h2>
        <p className="mt-6 text-sm uppercase tracking-widest text-[#4A4A4A]">This certifies that</p>
        <p className="mt-2 font-heading text-3xl font-bold text-[#9B1B30]">{memberName}</p>

        {isFull ? (
          <>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-[#4A4A4A]">
              has completed all training modules, submitted an approved capstone project, and passed
              the final examination of the Master&apos;s Edge Business Program — earning the rank of
            </p>
            <p className="mt-4 font-heading text-2xl font-black tracking-wide text-[#1A1A1A]">
              ⬛ BLACK BELT — CERTIFIED MASTER&apos;S EDGE
            </p>
          </>
        ) : (
          <>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-[#4A4A4A]">
              has completed every module and passed every assessment in the course
            </p>
            <p className="mt-4 font-heading text-2xl font-black tracking-wide text-[#1A1A1A]">
              {emoji ?? "📜"} {title}
            </p>
          </>
        )}

        <div className="mx-auto mt-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#E8C84A] via-[#D4AF37] to-[#B8982E] shadow-lg">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#B8982E] text-3xl">
            {isFull ? "🥋" : emoji ?? "📜"}
          </div>
        </div>

        <div className="mt-8 flex items-end justify-between px-4 text-left">
          <div>
            <p className="border-t border-[#1A1A1A] pt-1 font-heading text-sm font-bold">Brett Lechtenberg</p>
            <p className="text-xs text-[#4A4A4A]">Founder, Master&apos;s Edge · 8th-Degree Black Belt</p>
          </div>
          <div className="text-right">
            <p className="border-t border-[#1A1A1A] pt-1 font-heading text-sm font-bold">{formatCertDate(dateIso)}</p>
            <p className="text-xs text-[#4A4A4A]">{isFull ? "Date of Certification" : "Date of Completion"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
