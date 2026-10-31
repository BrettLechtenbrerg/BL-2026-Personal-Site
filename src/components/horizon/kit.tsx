// Shared Horizon pieces for the inner pages (Group 1+, 30 Oct 2026). Styles: src/styles/horizon.css (.bl-h, Option A).
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
export const NewTab = () => <span className="sr-only"> (opens in a new tab)</span>;

// shift: on wide screens, slide the photo left by this much so its subject clears the copy (e.g. "22%").
// beside: on wide screens the photo sits on the far side of the copy instead of across the whole top (for smaller photos).
type Photo = { src: string; alt: string; w: number; h: number; pos?: string; shift?: string; beside?: boolean };

export function HorizonPage({ children }: { children: ReactNode }) {
  return <div className="bl-h bl-h-page bl-h-motion">{children}</div>;
}

// Page top. `lines` = the headline, one entry per line; wrap accent words in <em>.
// wide: a longer headline gets a wider copy column so it breaks into fewer, fuller lines.
// pre: lines between the headline and the lede (e.g. a book subtitle). aside: a figure beside the copy on wide screens
// (e.g. a book cover). small: a smaller headline for long titles (blog posts).
export function PageHero({ id, eyebrow, lines, pre, lede, photo, side = "left", wide, small, aside, children }: {
  id: string; eyebrow?: ReactNode; lines: ReactNode[]; pre?: ReactNode; lede?: ReactNode; photo: Photo; side?: "left" | "right";
  wide?: boolean; small?: boolean; aside?: ReactNode; children?: ReactNode;
}) {
  return (
    <section className={`hero ph${side === "right" ? " is-right" : ""}${photo.beside ? " photo-beside" : ""}${wide ? " is-wide" : ""}${small ? " is-small" : ""}${aside ? " has-aside" : ""}`} aria-labelledby={id}>
      <div className="hero-top">
        <div className="hero-media" data-hero-media>
          <Image data-hero-img src={photo.src} alt={photo.alt} width={photo.w} height={photo.h} sizes={photo.beside ? "(min-width: 1024px) 60vw, 100vw" : "100vw"} preload
            style={{ "--pos": photo.pos ?? "50% 35%", "--shift": photo.shift ?? "0%", "--ar": `${photo.w} / ${photo.h}` } as CSSProperties} />
          <div className="hero-dawn" data-dawn aria-hidden="true" />
          <div className="ph-grade" aria-hidden="true" />
        </div>
        <div className="rail ph-inner">
          <div className="ph-copy" data-hero-content>
            {eyebrow && <div className="eyebrow" data-hero-fade>{eyebrow}</div>}
            <div className="horizon" data-horizon aria-hidden="true" />
            <h1 id={id} className="display">
              {lines.map((l, i) => (
                <span key={i}>{i > 0 && " "}<span className="line"><span>{l}</span></span></span>
              ))}
            </h1>
            {pre && <div className="ph-pre" data-hero-fade>{pre}</div>}
            {lede && <p className="lede" data-hero-fade>{lede}</p>}
            {children && <div className="hero-ctas" data-hero-fade>{children}</div>}
          </div>
          {aside && <div className="ph-aside" data-hero-fade>{aside}</div>}
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

// Official client order (Sep 27 2026): business clients, then chambers, USA Martial Arts last.
export const clientLogos = [
  { name: "America First Credit Union", src: "/logos/america-first.png", w: 1240, h: 403, px: 46 },
  { name: "Packsize", src: "/logos/packsize.png", w: 1016, h: 208, px: 30 },
  { name: "Purple", src: "/logos/purple.jpg", w: 174, h: 174, px: 60, mul: true },
  { name: "Thumbtack", src: "/logos/thumbtack.png", w: 1698, h: 756, px: 46 },
  { name: "MemberSolutions", src: "/logos/membersolutions.jpg", w: 190, h: 192, px: 60, mul: true },
  { name: "American Express", src: "/logos/american-express.png", w: 512, h: 512, px: 62 },
  { name: "Delta", src: "/logos/delta.png", w: 3840, h: 2160, px: 50 },
  { name: "Murray Chamber", src: "/logos/murray-chamber.png", w: 204, h: 126, px: 54 },
  { name: "Park City Chamber", src: "/logos/park-city-chamber.png", w: 5126, h: 1344, px: 36 },
  { name: "Heber Valley Chamber", src: "/logos/heber-valley-chamber.png", w: 2109, h: 1381, px: 54 },
  { name: "USA Martial Arts", src: "/logos/usa-martial-arts.png", w: 124, h: 185, px: 62 },
];

// Client logo strip (white tiles on dark, scrolls; still with reduced motion). `hideMartialArts` for business pages.
export function LogoStrip({ id, hideMartialArts, children }: { id: string; hideMartialArts?: boolean; children?: ReactNode }) {
  const logos = hideMartialArts ? clientLogos.filter((l) => l.name !== "USA Martial Arts") : clientLogos;
  return (
    <section className="logos" aria-labelledby={id}>
      <p className="rail logos-k" id={id}>Trusted by Leading Organizations</p>
      <div className="rail">
        <div className="logo-viewport">
          <ul className="logo-track animate-scroll">
            {[...logos, ...logos].map((l, i) => {
              const dup = i >= logos.length;
              return (
                <li key={`${l.name}-${i}`} className="logo-tile" aria-hidden={dup || undefined} data-dup={dup || undefined}>
                  <Image className={l.mul ? "mul" : undefined} src={l.src} alt={dup ? "" : l.name} width={l.w} height={l.h} sizes="200px"
                    style={{ "--h": `${l.px}px` } as CSSProperties} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {children}
    </section>
  );
}

// YouTube video that loads from YouTube only when played (HorizonMotion swaps in the player; without JS the link opens YouTube).
export function VideoPoster({ id, title, poster, label, start, sizes = "(min-width: 1024px) 840px, 92vw" }: {
  id: string; title: string; poster: string; label?: ReactNode; start?: number; sizes?: string;
}) {
  return (
    <div>
      <div className="vplayer" data-yt={id} data-yt-title={title} data-yt-start={start}>
        <a className="vposter" href={`https://www.youtube.com/watch?v=${id}${start ? `&t=${start}s` : ""}`} {...ext} aria-label={`Play video: ${title} (plays from YouTube)`}>
          <Image src={poster} alt="" width={1280} height={720} sizes={sizes} />
          <span className="vplay" aria-hidden="true" />
        </a>
      </div>
      {label}
    </div>
  );
}

// Numbers row: the real figure is in the page; motion only replays it from zero when it scrolls into view.
export function Stats({ items, className = "" }: {
  items: { value: number; suffix?: string; label: string; sublabel?: string; color?: string }[]; className?: string;
}) {
  return (
    <ul className={`stats ${className}`} data-stagger>
      {items.map((s) => (
        <li key={s.label}>
          <span className={`stat-v ${s.color ?? "t-gold"}`} data-count={s.value} data-suffix={s.suffix ?? ""}>
            {s.value.toLocaleString("en-US")}{s.suffix}
          </span>
          <span className="stat-l">{s.label}</span>
          {s.sublabel && <span className="stat-s">{s.sublabel}</span>}
        </li>
      ))}
    </ul>
  );
}

// A real cover shown as a 3D book (CSS 3D, no generated art): the front is the published cover; the spine is the real
// spine from the print cover file when we have it (public/horizon/books/*-spine.jpg), otherwise a plain spine in the
// cover's own edge colour. depth = spine width / cover width (Master's Edge 0.093, Powerful AI 0.054).
export function Book3D({ src, alt, w, h, spine, spineColor = "#d9d4cc", depth = 0.07, sizes, preload, className = "" }: {
  src: string; alt: string; w: number; h: number; spine?: string; spineColor?: string; depth?: number; sizes: string;
  preload?: boolean; className?: string;
}) {
  return (
    <div className={`book3d ${className}`} style={{ "--ar": `${w} / ${h}`, "--depth": depth } as CSSProperties}>
      <div className="b3-body">
        <span className="b3-front">
          <Image src={src} alt={alt} width={w} height={h} sizes={sizes} preload={preload} />
        </span>
        <span
          className="b3-spine"
          aria-hidden="true"
          style={spine ? { backgroundImage: `url(${spine})` } : { backgroundColor: spineColor }}
        />
        <span className="b3-pages" aria-hidden="true" />
        <span className="b3-back" aria-hidden="true" style={{ backgroundColor: spineColor }} />
      </div>
    </div>
  );
}
