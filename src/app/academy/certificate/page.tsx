"use client";

//==============================================================================
// Academy — printable certificate (only for certified members)
//==============================================================================

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Printer } from "lucide-react";
import { useAcademyUser } from "@/components/academy/useAcademyUser";

export default function CertificatePage() {
  const router = useRouter();
  const { user, loading } = useAcademyUser();
  const [certified, setCertified] = useState<boolean | null>(null);
  const [approvedDate, setApprovedDate] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/academy/certification")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!json?.certified) {
          router.replace("/academy/certification");
          return;
        }
        setCertified(true);
        setApprovedDate(json.project?.created_at ?? null);
      })
      .catch(() => router.replace("/academy/certification"));
  }, [router]);

  if (loading || !certified || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  const dateStr = new Date(approvedDate ?? Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl">
      <style jsx global>{`
        @media print {
          header,
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          #certificate {
            border-width: 8px !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      <div className="no-print mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Your Certificate</h1>
        <button
          onClick={() => window.print()}
          className="flex min-h-11 items-center gap-2 rounded-lg bg-cranberry px-5 py-2 font-heading font-bold text-white hover:bg-cranberry-dark"
        >
          <Printer size={18} /> Print / Save PDF
        </button>
      </div>

      <div
        id="certificate"
        className="relative rounded-lg border-[10px] border-[#D4AF37] bg-white px-8 py-12 text-center text-[#1A1A1A] shadow-[0_0_60px_rgba(212,175,55,0.3)] sm:px-16"
      >
        {/* Inner rule */}
        <div className="pointer-events-none absolute inset-3 border border-[#9B1B30]/40" />

        <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-[#9B1B30]">
          Master&apos;s Edge Academy
        </p>
        <h2 className="mt-4 font-heading text-4xl font-black text-[#1A1A1A]">
          Certificate of Mastery
        </h2>
        <p className="mt-6 text-sm uppercase tracking-widest text-[#4A4A4A]">
          This certifies that
        </p>
        <p className="mt-2 font-heading text-3xl font-bold text-[#9B1B30]">{user.name}</p>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-[#4A4A4A]">
          has completed all training modules, submitted an approved capstone project, and passed the
          final examination of the Master&apos;s Edge Business Program — earning the rank of
        </p>
        <p className="mt-4 font-heading text-2xl font-black tracking-wide text-[#1A1A1A]">
          ⬛ BLACK BELT — CERTIFIED MASTER&apos;S EDGE
        </p>

        {/* Gold seal */}
        <div className="mx-auto mt-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#E8C84A] via-[#D4AF37] to-[#B8982E] shadow-lg">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#B8982E] text-3xl">
            🥋
          </div>
        </div>

        <div className="mt-8 flex items-end justify-between px-4 text-left">
          <div>
            <p className="border-t border-[#1A1A1A] pt-1 font-heading text-sm font-bold">
              Brett Lechtenberg
            </p>
            <p className="text-xs text-[#4A4A4A]">Founder, Master&apos;s Edge · 8th-Degree Black Belt</p>
          </div>
          <div className="text-right">
            <p className="border-t border-[#1A1A1A] pt-1 font-heading text-sm font-bold">{dateStr}</p>
            <p className="text-xs text-[#4A4A4A]">Date of Certification</p>
          </div>
        </div>
      </div>
    </div>
  );
}
