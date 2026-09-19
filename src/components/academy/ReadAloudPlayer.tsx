"use client";

//==============================================================================
// Academy — "Read Aloud" audiobook card: the written lesson, narrated.
//==============================================================================
// Deliberately NOT the podcast look (dark studio, two hosts, sound bars).
// This is a book: warm parchment paper, an open-book illustration whose pages
// turn while playing, a gold reading ribbon as the scrubber, chapter count and
// a "Chapter N of M" read-out. Wraps a hidden <audio>.
//==============================================================================

import { useEffect, useRef, useState } from "react";
import { BookOpenText, Headphones, Pause, Play, RotateCcw, RotateCw } from "lucide-react";
import { academyConfig } from "@/content/academy.config";

function fmt(sec: number): string {
  if (!Number.isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ReadAloudPlayer({
  title,
  src,
  chapters,
}: {
  title: string;
  src: string;
  /** Section headings of the written lesson — shown as a chapter list. */
  chapters: string[];
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState(1);

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

  useEffect(() => {
    if (audio.current) audio.current.playbackRate = rate;
  }, [rate]);

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
  // Chapters are roughly even in the narration; good enough for a "where am I" read-out.
  const chapterIdx = chapters.length ? Math.min(chapters.length - 1, Math.floor((pct / 100) * chapters.length)) : 0;
  const remaining = duration ? duration - time : 0;

  return (
    <div className="academy-brand relative overflow-hidden rounded-2xl border border-[#c9a96a]/60 bg-[#f6efe0] text-[#2b2118] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]">
      {/* Paper texture: faint ruled lines + aged edge */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0 27px, rgba(120,90,40,0.12) 27px 28px)" }}
      />
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#d9c39a]/70 to-transparent" />
      <span aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(120,90,40,0.18)]" />

      <div className="relative grid gap-5 p-5 sm:grid-cols-[auto_1fr] sm:p-6">
        {/* Open book */}
        <div className="flex items-center justify-center sm:pr-2">
          <OpenBook turning={playing} />
        </div>

        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#8a5a1e]">
            <Headphones size={12} /> Audiobook · Read Aloud
          </div>
          <p className="font-heading text-lg font-bold leading-tight text-[#2b2118] sm:text-xl">{title}</p>
          <p className="mt-1 text-xs text-[#6b5638]">
            Narrated by {academyConfig.narration.narrator} · {chapters.length} chapters · {fmt(duration)}
          </p>

          {/* Reading ribbon (scrubber) */}
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-[11px] text-[#6b5638]">
              <span className="truncate">
                {chapters.length ? `Chapter ${chapterIdx + 1}: ${chapters[chapterIdx]}` : "Reading"}
              </span>
              <span className="ml-3 shrink-0 tabular-nums">{remaining > 0 ? `${fmt(remaining)} left` : fmt(duration)}</span>
            </div>
            <div className="relative h-3">
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
                className="absolute inset-0 h-3 w-full cursor-pointer appearance-none rounded-sm bg-[#e6d7b4]"
                style={{
                  background: `linear-gradient(to right, var(--academy-primary) ${pct}%, #e6d7b4 ${pct}%)`,
                }}
              />
              {/* ribbon tail */}
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-2 h-5 w-3 bg-[var(--academy-primary)] [clip-path:polygon(0_0,100%_0,100%_100%,50%_70%,0_100%)]"
                style={{ left: `calc(${pct}% - 6px)` }}
              />
            </div>
          </div>

          {/* Transport */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => skip(-30)}
              aria-label="Back 30 seconds"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c9a96a]/60 text-[#6b5638] hover:bg-[#e6d7b4]"
            >
              <RotateCcw size={18} />
            </button>
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause" : "Listen"}
              className="flex h-14 items-center gap-2 rounded-full bg-[var(--academy-primary)] px-6 font-heading font-bold text-academy-fg shadow-[0_8px_24px_-8px_var(--academy-primary)] transition-transform hover:scale-[1.03] hover:bg-[var(--academy-primary-dark)]"
            >
              {playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
              {playing ? "Pause" : time > 0 ? "Resume" : "Listen to the lesson"}
            </button>
            <button
              type="button"
              onClick={() => skip(30)}
              aria-label="Forward 30 seconds"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c9a96a]/60 text-[#6b5638] hover:bg-[#e6d7b4]"
            >
              <RotateCw size={18} />
            </button>
            <div className="ml-auto flex items-center gap-1 rounded-full border border-[#c9a96a]/60 p-0.5 text-xs">
              {[1, 1.25, 1.5].map((r) => (
                <button
                  key={String(r)}
                  type="button"
                  onClick={() => setRate(r)}
                  aria-pressed={rate === r}
                  className={`min-h-9 rounded-full px-3 font-semibold ${
                    rate === r ? "bg-[#2b2118] text-[#f6efe0]" : "text-[#6b5638] hover:bg-[#e6d7b4]"
                  }`}
                >
                  {r}×
                </button>
              ))}
            </div>
          </div>

          <p className="mt-3 flex items-center gap-1.5 text-xs text-[#6b5638]">
            <BookOpenText size={14} /> Follow along with the written lesson below.
          </p>
        </div>
      </div>

      <audio ref={audio} preload="metadata" className="hidden">
        <source src={src} />
      </audio>
    </div>
  );
}

/** Open book: two pages with text lines; a loose page flips while playing. */
function OpenBook({ turning }: { turning: boolean }) {
  return (
    <svg width="150" height="110" viewBox="0 0 150 110" fill="none" aria-hidden className="drop-shadow-[0_10px_18px_rgba(60,40,10,0.35)]">
      {/* cover */}
      <path d="M8 20c20-6 40-6 67 4 27-10 47-10 67-4v74c-20-6-40-6-67 4-27-10-47-10-67-4z" fill="var(--academy-primary-dark)" />
      {/* pages */}
      <path d="M14 26c18-5 36-5 61 4v66c-25-9-43-9-61-4z" fill="#fbf6ea" />
      <path d="M136 26c-18-5-36-5-61 4v66c25-9 43-9 61-4z" fill="#f3ebd8" />
      {/* spine shadow */}
      <path d="M75 30v66" stroke="#c9a96a" strokeWidth="2" />
      {/* text lines left */}
      {[40, 48, 56, 64, 72, 80].map((y) => (
        <path key={`l${y}`} d={`M22 ${y}h44`} stroke="#b9a37c" strokeWidth="2" strokeLinecap="round" />
      ))}
      {/* text lines right */}
      {[40, 48, 56, 64, 72, 80].map((y) => (
        <path key={`r${y}`} d={`M84 ${y}h44`} stroke="#b9a37c" strokeWidth="2" strokeLinecap="round" />
      ))}
      {/* turning page */}
      <path
        d="M75 30c18-6 34-6 58 2-6 24-10 44-10 66-24-8-40-8-48-4z"
        fill="#fffaf0"
        stroke="#d9c39a"
        strokeWidth="1"
        style={{ transformOrigin: "75px 63px" }}
        className={turning ? "motion-safe:animate-[page-turn_1.6s_ease-in-out_infinite]" : "opacity-0"}
      />
      {/* ribbon */}
      <path d="M75 20v52l-4 6 8 0-4-6" fill="var(--academy-accent-base)" />
    </svg>
  );
}
