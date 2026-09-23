import Image from "next/image";
import Link from "next/link";
import { DEFAULT_BRAND_COLOR, type PartnerProgramSummary } from "@/lib/academy-partner-programs";

export default function PartnerPrograms({ programs }: { programs: PartnerProgramSummary[] }) {
  if (!programs.length) return null;
  return (
    <section aria-labelledby="partner-programs-heading" className="mt-10 border-t border-academy-fg/20 pt-8" style={{ "--focus-ring": "var(--academy-fg)" } as React.CSSProperties}>
      <h2 id="partner-programs-heading" className="font-heading text-2xl font-bold">Partner video programs</h2>
      <p className="mt-2 mb-5">Optional viewing. These programs do not change your certificate requirements.</p>
      {/* Same anatomy as the course banner above it on this page: cover art, bottom-anchored
          scrim, title and copy bottom-left, action bottom-right, matching radius and border. */}
      {programs.map(p => (
        <article key={p.slug} className="relative mb-4 overflow-hidden rounded-2xl border border-academy-fg/10 bg-gradient-to-br from-academy-primary-dark via-academy-bg to-academy-bg">
          {/* Cover art is decorative: the title, credit, description and link carry the
              meaning, so it takes alt="" rather than repeating them to a screen reader. */}
          {p.image && <Image src={p.image.src} alt="" width={p.image.width} height={p.image.height} sizes="(min-width: 1024px) 60vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />}
          {/* The tall top padding exists to reveal the cover art above the scrim. Without an
              image it would just be dead space, so it only applies when there is one. */}
          <div className={`relative flex flex-col items-start gap-4 bg-gradient-to-t from-academy-bg via-academy-bg/90 to-academy-bg/20 p-5 sm:flex-row sm:items-end sm:justify-between ${p.image ? "pt-16 sm:pt-24" : ""}`}>
            <div className="min-w-0">
              <span className="mb-3 inline-block max-w-full rounded-lg px-2.5 py-1.5" style={{ backgroundColor: p.brandColor ?? DEFAULT_BRAND_COLOR }}>
                <Image src={p.logo} alt="" width={256} height={75} className="h-auto w-36 max-w-full" unoptimized />
              </span>
              <h3 className="font-heading text-2xl font-bold tracking-tight">{p.title}</h3>
              <p className="mt-1 text-sm font-semibold text-academy-accent">Created by {p.creators.join(" and ")}</p>
              <p className="mt-1 max-w-2xl text-sm text-academy-fg/70">{p.description}</p>
            </div>
            <Link href={`/academy/programs/${p.slug}`} className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-academy-fg/50 bg-academy-bg px-5 py-2 font-semibold text-academy-fg transition-colors hover:bg-academy-fg/10">Open video library</Link>
          </div>
        </article>
      ))}
    </section>
  );
}
