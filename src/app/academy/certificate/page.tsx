"use client";

//==============================================================================
// Academy — your certificates
//==============================================================================
// Two tiers, one page:
//   • Course certificates — system-generated the moment every module in a
//     course is passed (one per course, printable).
//   • Master's Edge certificate — the Certifier-backed credential, only after
//     the entire package (all courses + capstone + exam).
// Members with nothing yet are pointed to the courses page.
//==============================================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Loader2 } from "lucide-react";
import { useAcademyUser } from "@/components/academy/useAcademyUser";
import CertificateCard from "@/components/academy/CertificateCard";

interface CourseCert {
  courseId: string;
  title: string;
  emoji: string;
  awardedAt: string;
}

export default function CertificatePage() {
  const { user, loading } = useAcademyUser();
  const [courseCerts, setCourseCerts] = useState<CourseCert[] | null>(null);
  const [certified, setCertified] = useState(false);
  const [approvedDate, setApprovedDate] = useState<string | null>(null);
  const [credentialUrl, setCredentialUrl] = useState<string | null>(null);
  const [printTarget, setPrintTarget] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/academy/progress").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/academy/certification").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([progress, cert]) => {
        setCourseCerts(progress?.courseCertificates ?? []);
        if (cert?.certified) {
          setCertified(true);
          setApprovedDate(cert.project?.created_at ?? null);
          setCredentialUrl(cert.credentialUrl ?? null);
        }
      })
      .catch(() => setCourseCerts([]));
  }, []);

  // Print one certificate: mark it, print, clear on afterprint.
  useEffect(() => {
    if (!printTarget) return;
    const done = () => setPrintTarget(null);
    window.addEventListener("afterprint", done);
    const t = setTimeout(() => window.print(), 50);
    return () => {
      clearTimeout(t);
      window.removeEventListener("afterprint", done);
    };
  }, [printTarget]);

  if (loading || !user || courseCerts === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  const nothingYet = courseCerts.length === 0 && !certified;

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
          .print-certificate[data-print="hide"] {
            display: none;
          }
          .print-certificate > div[id] {
            border-width: 8px !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      <div className="no-print mb-6">
        <h1 className="font-heading text-2xl font-bold">Your Certificates</h1>
        <p className="mt-1 text-sm text-white/60">
          Finish every module in a course to earn its certificate. Complete every course, the capstone
          and the final exam to earn the Certified Master&apos;s Edge credential.
        </p>
      </div>

      {nothingYet && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md">
          <p className="text-4xl">📜</p>
          <h2 className="mt-3 font-heading text-xl font-bold">No certificates yet</h2>
          <p className="mt-2 text-sm text-white/60">
            Your first one arrives the moment you pass the last module of any course.
          </p>
          <Link
            href="/academy/modules"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-cranberry px-5 py-2 font-heading font-bold text-white hover:bg-cranberry-dark"
          >
            Go to courses <ArrowRight size={18} />
          </Link>
        </div>
      )}

      {certified && (
        <div className="mb-10">
          <CertificateCard
            id="cert-masters-edge"
            tier="masters-edge"
            memberName={user.name}
            dateIso={approvedDate ?? new Date().toISOString()}
            printState={printTarget === null || printTarget === "cert-masters-edge" ? "show" : "hide"}
            onPrint={() => setPrintTarget("cert-masters-edge")}
          />
          {credentialUrl && (
            <a
              href={credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="no-print mt-4 flex min-h-12 items-center justify-center gap-2 rounded-lg border border-gold/40 bg-gold/10 px-5 font-heading font-bold text-gold hover:bg-gold/20"
            >
              <BadgeCheck size={20} /> View verified credential &amp; share to LinkedIn
            </a>
          )}
        </div>
      )}

      {courseCerts.length > 0 && (
        <div className="space-y-10">
          {certified && (
            <h2 className="no-print font-heading text-lg font-bold text-gold">Course certificates</h2>
          )}
          {courseCerts.map((c) => {
            const id = `cert-${c.courseId}`;
            return (
              <CertificateCard
                key={c.courseId}
                id={id}
                tier="course"
                memberName={user.name}
                title={c.title}
                emoji={c.emoji}
                dateIso={c.awardedAt}
                printState={printTarget === null || printTarget === id ? "show" : "hide"}
                onPrint={() => setPrintTarget(id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
