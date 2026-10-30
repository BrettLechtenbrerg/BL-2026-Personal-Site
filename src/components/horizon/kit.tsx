// Shared Horizon pieces for the inner pages (Group 1+, 30 Oct 2026). Styles: src/styles/horizon.css (.bl-h, Option A).
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
export const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>;

// shift: on wide screens, slide the photo left by this much so its subject clears the copy (e.g. "22%").
type Photo = { src: string; alt: string; w: number; h: number; pos?: string; shift?: string };

export function HorizonPage({ children }: { children: ReactNode }) {
  return <div className="bl-h bl-h-page bl-h-motion">{children}</div>;
}

// Page top. `lines` = the headline, one entry per line; wrap accent words in <em>.
export function PageHero({ id, eyebrow, lines, lede, photo, side = "left", children }: {
  id: string; eyebrow: ReactNode; lines: ReactNode[]; lede?: ReactNode; photo: Photo; side?: "left" | "right"; children?: ReactNode;
}) {
  return (
    <section className={`hero ph${side === "right" ? " is-right" : ""}`} aria-labelledby={id}>
      <div className="hero-top">
        <div className="hero-media" data-hero-media>
          <Image data-hero-img src={photo.src} alt={photo.alt} width={photo.w} height={photo.h} sizes="100vw" preload
            style={{ "--pos": photo.pos ?? "50% 35%", "--shift": photo.shift ?? "0%" } as CSSProperties} />
          <div className="hero-dawn" data-dawn aria-hidden="true" />
          <div className="ph-grade" aria-hidden="true" />
        </div>
        <div className="rail ph-inner">
          <div className="ph-copy" data-hero-content>
            <p className="eyebrow" data-hero-fade>{eyebrow}</p>
            <div className="horizon" data-horizon aria-hidden="true" />
            <h1 id={id} className="display">
              {lines.map((l, i) => (
                <span key={i}>{i > 0 && " "}<span className="line"><span>{l}</span></span></span>
              ))}
            </h1>
            {lede && <p className="lede" data-hero-fade>{lede}</p>}
            {children && <div className="hero-ctas" data-hero-fade>{children}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}

// A button: external links open in a new tab (and say so to screen readers); internal links use next/link.
export function Btn({ href, external, variant = "cran", size, arrow, children }: {
  href: string; external?: boolean; variant?: "cran" | "gold" | "glass" | "ink"; size?: "lg"; arrow?: boolean; children: ReactNode;
}) {
  const cls = `btn btn-${variant}${size ? ` btn-${size}` : ""}`;
  const inner = <>{children}{arrow && <ArrowRight className="ico arrow" aria-hidden="true" />}</>;
  return external
    ? <a className={cls} href={href} {...ext}>{inner}<NewTab /></a>
    : <Link className={cls} href={href}>{inner}</Link>;
}

// Closing band: the page's photo behind a glass panel (same build as the home page's final call to action).
export function FinalCta({ id, title, text, photo, children }: {
  id: string; title: ReactNode; text?: ReactNode; photo: Omit<Photo, "alt">; children: ReactNode;
}) {
  return (
    <section className="final" aria-labelledby={id}>
      <div className="final-media" aria-hidden="true">
        <Image data-drift src={photo.src} alt="" width={photo.w} height={photo.h} sizes="100vw" style={{ objectPosition: photo.pos ?? "50% 40%" }} />
      </div>
      <div className="rail">
        <div className="final-panel glass" data-rise>
          <h2 id={id} className="display-2">{title}</h2>
          {text && <p className="body-lg">{text}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
