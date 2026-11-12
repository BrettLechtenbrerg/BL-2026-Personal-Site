"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Pause, Play } from "lucide-react";

// Muted background loop over a photo (the photo is the video's first frame, so the fade-in is seamless).
// Loads only on screens 768px+ with motion allowed and Data Saver off, and only once it comes near the screen;
// everyone else keeps the still photo. `id` links it to its HeroVideoToggle.
export function HeroVideo({ id, src, pos, shift }: { id: string; src: string; pos?: string; shift?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const allowed = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!allowed || saveData) return;
    // A page-top video waits out the hero's 2.8 s load animation on the photo before it takes over.
    const t0 = performance.now();
    let timer = 0;
    const onPlaying = () => { timer = window.setTimeout(() => setOn(true), Math.max(0, 2900 - (performance.now() - t0))); };
    v.addEventListener("playing", onPlaying, { once: true });
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      v.src = src;
      v.play().catch(() => {});
    }, { rootMargin: "300px 0px" });
    io.observe(v);
    return () => { io.disconnect(); window.clearTimeout(timer); v.removeEventListener("playing", onPlaying); v.pause(); };
  }, [src]);
  return (
    <video ref={ref} id={id} className={`ph-video${on ? " is-on" : ""}`} muted loop playsInline preload="none"
      aria-hidden="true" tabIndex={-1} style={{ "--pos": pos ?? "50% 35%", "--shift": shift ?? "0%" } as CSSProperties} />
  );
}

// Pause/play for a background loop: moving content longer than 5 s needs a way to stop it (WCAG 2.2.2).
// Shows only once its video is actually playing.
export function HeroVideoToggle({ target }: { target: string }) {
  const [shown, setShown] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const v = document.getElementById(target) as HTMLVideoElement | null;
    if (!v) return;
    const onPlaying = () => { setShown(true); setPaused(false); };
    const onPause = () => setPaused(true);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("pause", onPause);
    return () => { v.removeEventListener("playing", onPlaying); v.removeEventListener("pause", onPause); };
  }, [target]);
  if (!shown) return null;
  const toggle = () => {
    const v = document.getElementById(target) as HTMLVideoElement | null;
    if (!v) return;
    if (v.paused) v.play().catch(() => {}); else v.pause();
  };
  return (
    <button type="button" className="ph-video-toggle" onClick={toggle} aria-controls={target}
      aria-label={paused ? "Play background video" : "Pause background video"}>
      {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
    </button>
  );
}
