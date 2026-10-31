"use client";

// Page behaviour for the "Horizon" design (home + inner pages, root .bl-h-motion) (port of the master's HorizonMotion, tag horizon-d-master): the
// click-to-play YouTube video, the golden path through the three pillars, count-ups and the scroll motion. Motion only runs when <html> has `motion-ok` (set before paint in src/app/layout.tsx; absent with
// reduced motion), so without it the page is complete and still.

import { useEffect } from "react";
import { animate, inView, scroll, stagger } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function HorizonMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".bl-h-motion");
    if (!root) return;
    (window as Window & { __blMotion?: boolean }).__blMotion = true;
    const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = root) => r.querySelector<T>(s);
    const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = root) => [...r.querySelectorAll<T>(s)];
    const cleanups: Array<() => void> = [];
    const on = (el: EventTarget, type: string, fn: EventListener) => { el.addEventListener(type, fn); cleanups.push(() => el.removeEventListener(type, fn)); };

    // YouTube: nothing loads from YouTube until Play (without JS the link opens YouTube).
    $$("[data-yt]").forEach((box) => {
      const link = $<HTMLAnchorElement>("a", box);
      if (!link) return;
      on(link, "click", (e) => {
        e.preventDefault();
        const f = document.createElement("iframe");
        f.src = `https://www.youtube-nocookie.com/embed/${box.dataset.yt}?autoplay=1&rel=0&playsinline=1${box.dataset.ytStart ? `&start=${box.dataset.ytStart}` : ""}`;
        f.title = box.dataset.ytTitle || "Video";
        f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        f.allowFullscreen = true;
        f.referrerPolicy = "strict-origin-when-cross-origin";
        f.className = "yt-frame";
        link.replaceWith(f);
        f.focus();
      });
    });

    // The golden path is built from the real positions of the three pillars (also without motion).
    const map = $("[data-map]");
    const path = $<SVGPathElement>("[data-path]");
    const ghost = $<SVGPathElement>("[data-ghost]");
    const nodes = $$("[data-node]");
    let pathLen = 0;
    let lastP = 0;
    let draw: (p: number) => void = () => {};
    const buildPath = () => {
      if (!map || !path || !ghost || nodes.length < 2) return;
      const box = map.getBoundingClientRect();
      const pts = nodes.map((n) => { const r = n.getBoundingClientRect(); return [r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top]; });
      const stopEls = nodes.map((n) => n.closest("[data-stop]")!.getBoundingClientRect());
      let d = `M ${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0] = pts[i - 1]; const [x1, y1] = pts[i];
        const gapTop = stopEls[i - 1].bottom - box.top;
        const gapBot = stopEls[i].top - box.top;
        const ym = (gapTop + gapBot) / 2;
        const h = Math.max(12, (gapBot - gapTop) * 0.4);
        d += ` L ${x0} ${ym - h} C ${x0} ${ym}, ${x1} ${ym}, ${x1} ${ym + h} L ${x1} ${y1}`;
      }
      path.setAttribute("d", d); ghost.setAttribute("d", d);
      pathLen = path.getTotalLength();
      path.style.strokeDasharray = `${pathLen}`;
    };
    buildPath();
    const onResize = () => { buildPath(); draw(lastP); };
    on(window, "resize", onResize);
    document.fonts?.ready.then(onResize);

    const motionOK = document.documentElement.classList.contains("motion-ok");
    if (!motionOK) {
      if (path) path.style.strokeDashoffset = "0";
      return () => cleanups.forEach((c) => c());
    }

    // Load: the dusk lifts, the horizon line draws, the headline rises.
    const anims = [
      animate("[data-dawn]", { opacity: [1, 0.15] }, { duration: 2.4, ease: [0.4, 0, 0.2, 1] }),
      animate("[data-hero-img]", { transform: ["scale(1.14)", "scale(1.02)"], filter: ["saturate(.5) contrast(1.04) brightness(.6)", "saturate(.95) contrast(1.04) brightness(1)"] }, { duration: 2.8, ease }),
      animate("[data-horizon]", { transform: ["scaleX(0)", "scaleX(1)"] }, { duration: 2.1, delay: 0.5, ease }),
      animate(".bl-h-motion .hero .line > span", { transform: ["translateY(105%)", "translateY(0%)"] }, { duration: 1.3, delay: stagger(0.14, { startDelay: 0.6 }), ease }),
      animate("[data-hero-fade]", { opacity: [0, 1], transform: ["translateY(14px)", "translateY(0px)"] }, { duration: 1, delay: stagger(0.12, { startDelay: 0.5 }), ease }),
    ];
    cleanups.push(() => anims.forEach((a) => a.stop()));
    $$("[data-pillar]").forEach((el, i) => cleanups.push(inView(el, () => { animate(el, { opacity: [0, 1], transform: ["translateY(24px)", "translateY(0px)"] }, { duration: 0.9, delay: 0.9 + i * 0.12, ease }); }, { amount: 0.3 })));

    // Hero scroll: the photo sinks, the copy drifts away.
    const himg = $("[data-hero-img]");
    const hcontent = $("[data-hero-content]");
    const horizon = $("[data-horizon]");
    const heroMedia = $("[data-hero-media]");
    let loaded = false;
    const loadTimer = window.setTimeout(() => { loaded = true; }, 2900);
    cleanups.push(() => window.clearTimeout(loadTimer));
    if (himg && hcontent && horizon && heroMedia) {
      cleanups.push(scroll((p: number) => {
        if (!loaded) return;
        himg.style.transform = `translate3d(0, ${p * 18}%, 0) scale(${1.02 + p * 0.08})`;
        hcontent.style.transform = `translate3d(0, ${p * -50}px, 0)`;
        hcontent.style.opacity = String(1 - clamp01((p - 0.35) / 0.4));
        horizon.style.opacity = String(0.9 * (1 - p));
      }, { target: heroMedia, offset: ["start start", "end start"] }));
    }

    // Rise-ins and staggered groups.
    $$("[data-rise]").forEach((el) => cleanups.push(inView(el, () => { animate(el, { opacity: [0, 1], transform: ["translateY(40px)", "translateY(0px)"] }, { duration: 1.1, ease }); }, { amount: 0.15 })));
    $$("[data-stagger]").forEach((g) => cleanups.push(inView(g, () => { animate([...g.children], { opacity: [0, 1], transform: ["translateY(28px)", "translateY(0px)"] }, { duration: 0.9, delay: stagger(0.08), ease }); }, { amount: 0.1 })));

    // Count-ups in Why Brett: the real figure is in the HTML; motion only replays it from zero.
    $$("[data-count]").forEach((el) => cleanups.push(inView(el, () => {
      const to = Number(el.dataset.count); const suffix = el.dataset.suffix ?? "";
      animate(0, to, { duration: 2, ease: [0.25, 0.1, 0.25, 1], onUpdate: (v) => { el.textContent = `${Math.round(v).toLocaleString("en-US")}${suffix}`; } });
    }, { amount: 0.6 })));

    // The Master's Edge: the path draws itself, lights each pillar, and the pinned photo follows.
    const stops = $$("[data-stop]");
    const bgs = $$("[data-jbg]");
    let bgIdx = 0;
    const setBg = (i: number) => { if (i === bgIdx) return; bgIdx = i; bgs.forEach((img, k) => img.classList.toggle("is-on", k === i)); };
    draw = (p: number) => {
      if (!pathLen || !map || !path) return;
      path.style.strokeDashoffset = String(pathLen * (1 - p));
      const mb = map.getBoundingClientRect();
      const reachedY = mb.top + mb.height * p;
      let lit = 0;
      stops.forEach((s, i) => { const lightOn = p > 0.001 && nodes[i].getBoundingClientRect().top <= reachedY + 4; s.classList.toggle("is-lit", lightOn); if (lightOn) lit = i; });
      setBg(lit);
    };
    if (map) cleanups.push(scroll((p: number) => { lastP = p; draw(p); }, { target: map, offset: ["start 75%", "end 55%"] }));

    // Background photos drift.
    $$("[data-drift]").forEach((img) => cleanups.push(scroll((p: number) => { img.style.transform = `translate3d(0, ${-p * 12}%, 0)`; }, { target: img.closest<HTMLElement>("section") ?? img, offset: ["start end", "end start"] })));

    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
