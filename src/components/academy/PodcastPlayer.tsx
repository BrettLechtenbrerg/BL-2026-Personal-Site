"use client";

//==============================================================================
// Academy — podcast card: two hosts across a mic, big play button, sound bars
// that animate while playing, scrubber + time. Wraps a hidden <audio>.
//==============================================================================

import { useEffect, useRef, useState } from "react";
import { Mic, Pause, Play, RotateCcw, RotateCw } from "lucide-react";

const BARS = [0.35, 0.7, 1, 0.55, 0.85, 0.45, 0.9, 0.6, 1, 0.5, 0.8, 0.4];

function fmt(sec: number): string {
  if (!Number.isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PodcastPlayer({ label, src }: { label: string; src: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    const onTime = () => setTime(a.currentTime);
    const onMeta = () => setDuration(a.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("durationchange", onMeta);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onPause);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("durationchange", onMeta);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onPause);
    };
  }, []);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) void a.play();
    else a.pause();
  };
  const skip = (delta: number) => {
    const a = audio.current;
    if (a) a.currentTime = Math.max(0, Math.min(a.duration || 0, a.currentTime + delta));
  };

  const pct = duration ? (time / duration) * 100 : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cranberry/40 bg-gradient-to-br from-[#2a0a12] via-black to-[#1a1206] p-6 shadow-[0_0_40px_-10px_var(--cranberry)]">
      {/* Ambient glow */}
      <span aria-hidden className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cranberry/30 blur-3xl" />
      <span aria-hidden className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />

      <div className="relative">
        <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
          <Mic size={12} /> Podcast Overview
        </div>
        <p className="mb-5 font-heading text-base font-bold text-white sm:text-lg">{label}</p>

        {/* Studio scene: host — mic + sound bars — host */}
        <div className="mb-5 flex items-center justify-center gap-4 sm:gap-8">
          <Host side="left" talking={playing} />
          <div className="flex flex-col items-center gap-3">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all ${
                playing ? "border-gold bg-gold/20 shadow-[0_0_30px_-4px_var(--gold)]" : "border-white/20 bg-black/40"
              }`}
            >
              <Mic size={24} className={playing ? "text-gold" : "text-white/60"} />
            </div>
            <div className="flex h-8 items-end gap-[3px]" aria-hidden>
              {BARS.map((h, i) => (
                <span
                  key={i}
                  className={`w-[3px] rounded-full bg-gradient-to-t from-cranberry-light to-gold ${
                    playing ? "motion-safe:animate-[podcast-bar_0.9s_ease-in-out_infinite]" : ""
                  }`}
                  style={{
                    height: playing ? undefined : `${h * 30}%`,
                    // @ts-expect-error custom property consumed by the keyframes
                    "--bar": `${h * 100}%`,
                    animationDelay: `${(i % 5) * 0.12}s`,
                  }}
                />
              ))}
            </div>
          </div>
          <Host side="right" talking={playing} />
        </div>

        {/* Transport */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => skip(-15)}
            aria-label="Back 15 seconds"
            className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
          >
            <RotateCcw size={20} />
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gold text-black shadow-[0_0_30px_-6px_var(--gold)] transition-transform hover:scale-105 hover:bg-gold-light"
          >
            {playing ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>
          <button
            type="button"
            onClick={() => skip(15)}
            aria-label="Forward 15 seconds"
            className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
          >
            <RotateCw size={20} />
          </button>

          <div className="ml-2 flex min-w-0 flex-1 items-center gap-3">
            <span className="w-10 text-right text-xs tabular-nums text-white/60">{fmt(time)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={1}
              value={time}
              onChange={(e) => {
                if (audio.current) audio.current.currentTime = Number(e.target.value);
              }}
              aria-label="Seek"
              className="h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-white/15 accent-gold"
              style={{ background: `linear-gradient(to right, var(--gold) ${pct}%, rgba(255,255,255,0.15) ${pct}%)` }}
            />
            <span className="w-10 text-xs tabular-nums text-white/60">{fmt(duration)}</span>
          </div>
        </div>

        {!playing && time === 0 && (
          <p className="mt-3 text-center text-xs text-white/50">Press play — two hosts break down this lesson</p>
        )}
      </div>

      <audio ref={audio} preload="metadata" className="hidden">
        <source src={src} />
      </audio>
    </div>
  );
}

/** Stylised host bust: head + shoulders, headphones, faces the mic. */
function Host({ side, talking }: { side: "left" | "right"; talking: boolean }) {
  const flip = side === "right" ? "-scale-x-100" : "";
  return (
    <div className={`relative ${flip}`} aria-hidden>
      <svg width="72" height="80" viewBox="0 0 72 80" fill="none" className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
        {/* shoulders */}
        <path d="M6 80c0-16 12-26 30-26s30 10 30 26" fill={side === "left" ? "var(--cranberry)" : "#2b2b2b"} />
        {/* neck */}
        <rect x="29" y="40" width="14" height="14" rx="4" fill="#d9a880" />
        {/* head */}
        <ellipse cx="36" cy="30" rx="17" ry="19" fill="#e8b892" />
        {/* hair */}
        <path d="M19 26c0-12 8-18 17-18s17 6 17 18c-5-6-10-8-17-8s-12 2-17 8z" fill="#2a1a12" />
        {/* headphones */}
        <path d="M17 32c0-14 8-22 19-22s19 8 19 22" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" />
        <rect x="13" y="28" width="8" height="14" rx="3" fill="var(--gold)" />
        <rect x="51" y="28" width="8" height="14" rx="3" fill="var(--gold)" />
        {/* eye (profile-ish, toward mic) */}
        <circle cx="46" cy="30" r="1.8" fill="#2a1a12" />
        {/* mouth — opens while talking */}
        <ellipse cx="47" cy="38" rx="2.5" ry={talking ? 2.2 : 0.8} fill="#7a2a2a" className={talking ? "motion-safe:animate-pulse" : ""} />
      </svg>
    </div>
  );
}
