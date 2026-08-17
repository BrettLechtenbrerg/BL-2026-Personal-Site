"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

interface LiveClipProps {
  src: string;
  poster: string;
  /** Accessible label, e.g. "Brett speaking live at Juan Diego" */
  label: string;
  /** "vertical" (default, 9:16 phone footage) or "wide" (16:9 produced video) */
  aspect?: "vertical" | "wide";
  /** Poster caption under the play button */
  caption?: string;
  className?: string;
}

/**
 * Video clip in a premium dark frame — vertical (9:16) phone footage or
 * wide (16:9) produced video. Shows a poster + branded play button; plays
 * with sound and native controls once tapped.
 */
export function LiveClip({
  src,
  poster,
  label,
  aspect = "vertical",
  caption = "▶ Watch Brett live — with sound",
  className,
}: LiveClipProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    setPlaying(true);
    // Wait a tick so controls mount before playing
    requestAnimationFrame(() => videoRef.current?.play());
  };

  return (
    <div className={`group relative ${className ?? ""}`}>
      {/* Glow */}
      <div className="absolute -inset-2 bg-gradient-to-b from-cranberry via-gold to-cranberry rounded-[2rem] blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

      {/* Frame */}
      <div
        className={`relative ${
          aspect === "wide" ? "aspect-video rounded-2xl" : "aspect-[9/16] rounded-[1.75rem]"
        } overflow-hidden border-2 border-white/15 bg-black shadow-2xl`}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls={playing}
          playsInline
          preload="metadata"
          aria-label={label}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {!playing && (
          <button
            type="button"
            onClick={start}
            aria-label={`Play video: ${label}`}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-transparent to-black/20 cursor-pointer"
          >
            <span className="animate-ring-pulse flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cranberry to-cranberry-dark shadow-2xl shadow-cranberry/50 transition-transform duration-300 group-hover:scale-110">
              <Play className="w-9 h-9 text-white fill-white translate-x-0.5" />
            </span>
            <span className="absolute bottom-5 left-0 right-0 text-center text-white/90 text-sm font-semibold tracking-wide">
              {caption}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
