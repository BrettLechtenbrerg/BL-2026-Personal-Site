"use client";

// "Watch Brett's AI Assistant answer" inside an FAQ answer. Nothing loads until it is tapped; then a small vertical player
// opens under the button with captions on. The written answer stays on the page (people who read, and search engines).
import { useId, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import { clock, faqVideoSrc, type FaqVideo as Video } from "@/lib/faq-videos";

export function FaqVideo({ video, label = "Watch Brett's AI Assistant answer" }: { video: Video; label?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  const id = useId();

  const toggle = () => {
    if (open) { ref.current?.pause(); setOpen(false); return; }
    setOpen(true);
    requestAnimationFrame(() => ref.current?.play().catch(() => {}));
  };

  return (
    <div className="faqv">
      <button type="button" className="faqv-btn" aria-expanded={open} aria-controls={id} onClick={toggle}>
        <span className="faqv-ico" aria-hidden="true">{open ? <X /> : <Play />}</span>
        <span>{open ? "Close video" : label}</span>
        {!open && <span className="faqv-time">{clock(video.seconds)}</span>}
      </button>
      {open && (
        <figure className="faqv-fig" id={id}>
          <video
            ref={ref}
            src={faqVideoSrc(video.slug, "mp4")}
            poster={faqVideoSrc(video.slug, "jpg")}
            controls
            playsInline
            preload="metadata"
            aria-label={`${video.question} Answered by Brett's AI Assistant`}
          >
            <track kind="captions" src={faqVideoSrc(video.slug, "vtt")} srcLang="en" label="English" default />
          </video>
          <figcaption>Brett&apos;s AI Assistant: an AI version of Brett, speaking words Brett wrote and approved.</figcaption>
        </figure>
      )}
    </div>
  );
}

// Short line above an FAQ list, with the "Is this really Brett?" video that explains the AI Assistant.
export function FaqIntro({ video }: { video: Video }) {
  return (
    <div className="faq-intro" data-rise>
      <p>Prefer to listen? Each answer has a short video from Brett&apos;s AI Assistant.</p>
      <FaqVideo video={video} label="Is this really Brett?" />
    </div>
  );
}
