"use client";

// Interactive pieces of the Books page: the free-eBook button (opens the existing lead form) and the USA Today carousel.
import { useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
// The sign-up box is loaded only once someone presses the free-eBook button (it is ~70 KB of code that competed with
// the page-top photo on slow phones; Brett OK'd the speed-up, 31 Oct 2026).
const EbookModal = dynamic(() => import("@/components/ui/EbookModal").then((m) => m.EbookModal), { ssr: false });

export function FreeBookButton({ className, children }: { className?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [wanted, setWanted] = useState(false);
  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => { setWanted(true); setOpen(true); }}
        onPointerEnter={() => setWanted(true)}
        onFocus={() => setWanted(true)}
      >
        {children}
      </button>
      {wanted && <EbookModal isOpen={open} onClose={() => setOpen(false)} />}
    </>
  );
}

export type PressImage = { src: string; alt: string };

// Advances every 4 seconds; pauses while the mouse is over it or a control has focus, and never moves on its own
// for visitors who ask for reduced motion.
export function PressCarousel({ images }: { images: PressImage[] }) {
  const [current, setCurrent] = useState(0);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const paused = hover || focus;
  const n = images.length;

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setCurrent((c) => (c + 1) % n), 4000);
    return () => window.clearInterval(t);
  }, [paused, n]);

  return (
    <div
      className="press"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocus(false); }}
    >
      <div className="press-card">
        <div className="press-frame">
          <Image key={current} className="press-img" src={images[current].src} alt={images[current].alt} fill sizes="(min-width: 1024px) 896px, 92vw" />
          <button type="button" className="press-arrow is-prev" onClick={() => setCurrent((c) => (c - 1 + n) % n)} aria-label="Previous image">
            <ChevronLeft aria-hidden="true" />
          </button>
          <button type="button" className="press-arrow is-next" onClick={() => setCurrent((c) => (c + 1) % n)} aria-label="Next image">
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
        <div className="press-foot">
          <p className="press-cap" aria-live="polite">{images[current].alt}</p>
          <div className="press-dots">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                className={i === current ? "is-on" : undefined}
                onClick={() => setCurrent(i)}
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === current ? "true" : undefined}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="press-count">{current + 1} / {n}</p>
    </div>
  );
}
