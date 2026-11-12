"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Pause, Play } from "lucide-react";

// Muted background loop over a PageHero photo (the photo is the video's first frame, so the fade-in is seamless).
// Loads only on screens 768px+ with motion allowed and Data Saver off; everyone else keeps the still photo.
export function HeroVideo({ src, pos, shift }: { src: string; pos?: string; shift?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const allowed = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!allowed || saveData) return;
    // Wait out the hero's 2.8 s load animation on the photo before the video takes over.
    const t0 = performance.now();
    let timer = 0;
    const onPlaying = () => { timer = window.setTimeout(() => setOn(true), Math.max(0, 2900 - (performance.now() - t0))); };
    v.addEventListener("playing", onPlaying, { once: true });
    v.src = src;
    v.play().catch(() => {});
    return () => { window.clearTimeout(timer); v.removeEventListener("playing", onPlaying); v.pause(); };
  }, [src]);
  return (
    <video ref={ref} data-hero-video className={`ph-video${on ? " is-on" : ""}`} muted loop playsInline preload="none"
      aria-hidden="true" tabIndex={-1} style={{ "--pos": pos ?? "50% 35%", "--shift": shift ?? "0%" } as CSSProperties} />
  );
}

// Pause/play for the background loop: moving content longer than 5 s needs a way to stop it (WCAG 2.2.2).
// Shows only once the video is actually playing.
export function HeroVideoToggle() {
  const [shown, setShown] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const v = document.querySelector<HTMLVideoElement>("[data-hero-video]");
    if (!v) return;
    const onPlaying = () => { setShown(true); setPaused(false); };
    const onPause = () => setPaused(true);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("pause", onPause);
    return () => { v.removeEventListener("playing", onPlaying); v.removeEventListener("pause", onPause); };
  }, []);
  if (!shown) return null;
  const toggle = () => {
    const v = document.querySelector<HTMLVideoElement>("[data-hero-video]");
    if (!v) return;
    if (v.paused) v.play().catch(() => {}); else v.pause();
  };
  return (
    <button type="button" className="ph-video-toggle" onClick={toggle} aria-label={paused ? "Play background video" : "Pause background video"}>
      {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
    </button>
  );
}
