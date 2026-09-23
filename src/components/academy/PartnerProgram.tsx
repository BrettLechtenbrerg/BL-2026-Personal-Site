"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Play, Search } from "lucide-react";
import { isYouTubeId, partnerThumbSrc, DEFAULT_BRAND_COLOR, type PartnerProgram as Program, type PartnerVideo } from "@/lib/academy-partner-programs";

// The site's global `:focus-visible` rule is unlayered, so it outranks every Tailwind
// focus utility. It reads --focus-ring, so the Academy ring follows the theme ink and
// stays above the 3:1 WCAG 2.2 AA non-text contrast floor in both themes. The ring is
// drawn 2px OUTSIDE each control, so it must contrast with the page, not the control.
const ring = { "--focus-ring": "var(--academy-fg)" } as React.CSSProperties;
const control = "min-h-11 w-full rounded-lg border border-academy-fg/50 bg-academy-bg px-3 py-2 text-academy-fg";
const action = "inline-flex min-h-11 items-center rounded-lg border border-academy-fg/50 px-4 py-2 font-semibold hover:bg-academy-fg/10";
const languageName = (code: string) => code === "en" ? "English" : code === "es" ? "Spanish" : code;

export default function PartnerProgram({ program }: { program: Program }) {
  const [selected, setSelected] = useState(program.videos[0]);
  const [playing, setPlaying] = useState(false);
  const [retry, setRetry] = useState(0);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("");
  const playerHeading = useRef<HTMLHeadingElement>(null);
  const brand = program.brandColor ?? DEFAULT_BRAND_COLOR;
  const topics = [...new Set(program.videos.flatMap(v => v.categories))].sort();
  const languages = [...new Set(program.videos.map(v => v.language))];
  const matches = program.videos.filter(v => (!topic || v.categories.includes(topic)) &&
    (!language || v.language === language) &&
    `${v.title} ${v.categories.join(" ")} ${v.version ?? ""}`.toLowerCase().includes(query.trim().toLowerCase()));
  const reset = () => { setQuery(""); setTopic(""); setLanguage(""); };
  const thumb = (v: PartnerVideo) => program.thumbs && partnerThumbSrc(program.thumbs, v.youtubeId);
  const meta = (v: PartnerVideo) => `${languageName(v.language)}${v.version ? ` · ${v.version}` : ""} · ${v.categories.join(", ")}`;
  const choose = (v: PartnerVideo) => { setPlaying(false); setSelected(v); setRetry(0); playerHeading.current?.focus(); };
  // Unfiltered, the library reads as chapters instead of one long column. Built by walking
  // the matches once and bucketing each under its first topic, so the rendered total always
  // equals the reported count -- a video with no categories lands in "More videos" rather
  // than disappearing while the status line still counts it.
  const filtering = Boolean(query.trim() || topic || language);
  const OTHER = "More videos";
  const buckets = new Map<string, typeof matches>();
  for (const v of matches) {
    const key = v.categories[0] || OTHER;
    const list = buckets.get(key);
    if (list) list.push(v); else buckets.set(key, [v]);
  }
  const rank = (name: string) => name === "Introduction" ? 0 : name === OTHER ? 2 : 1;
  const groups: [string, typeof matches][] = filtering
    ? [["", matches]]
    : [...buckets.entries()].sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b));

  return (
    <div className="[overflow-wrap:anywhere]" style={ring}>
      <Link href="/academy/modules" className="inline-flex min-h-11 items-center text-academy-accent underline underline-offset-4">All programs</Link>
      {/* Matches the Six Loving Habits course banner: cover art, bottom-anchored scrim,
          title and credit bottom-left, count pill bottom-right, same radius and border. */}
      <header className="relative mt-3 overflow-hidden rounded-2xl border border-academy-fg/10 bg-gradient-to-br from-academy-primary-dark via-academy-bg to-academy-bg">
        {program.image && <Image src={program.image.src} alt="" width={program.image.width} height={program.image.height} sizes="100vw" priority className="absolute inset-0 h-full w-full object-cover" />}
        {/* Tall top padding exists to reveal the cover art above the scrim; without an
            image it would be dead space, so it only applies when there is one. */}
        <div className={`relative flex flex-col gap-5 bg-gradient-to-t from-academy-bg via-academy-bg/95 to-academy-bg/25 p-5 sm:flex-row sm:items-end sm:justify-between ${program.image ? "pt-32 sm:pt-44" : ""}`}>
          <div className="min-w-0">
            <span className="mb-5 inline-block max-w-full rounded-lg px-3 py-2" style={{ backgroundColor: brand }}>
              <Image src={program.logo} alt="" width={512} height={150} className="h-auto w-44 max-w-full" unoptimized />
            </span>
            <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{program.title}</h1>
            <p className="mt-3 text-base font-semibold leading-relaxed text-academy-accent">Created by {program.creators.join(" and ")}</p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-academy-fg/80">{program.partnerCredit}</p>
          </div>
          <span className="shrink-0 self-start rounded-full border border-academy-fg/15 bg-academy-bg px-4 py-2 text-sm font-semibold text-academy-accent sm:self-auto">{program.videos.length} videos</span>
        </div>
        {/* The ribbon artwork has transparent gaps, so it needs its own opaque backing;
            without one the cover photo shows through the cut-outs. */}
        {program.ribbon && <span className="relative block bg-academy-bg"><Image src={program.ribbon.src} alt="" width={program.ribbon.width} height={program.ribbon.height} className="h-10 w-full object-cover" /></span>}
      </header>
      <p className="my-6 max-w-3xl">{program.description} Choose what connects with your family. There are no quizzes or completion requirements in this video library.</p>

      <section aria-labelledby="selected-video-heading" className="rounded-2xl border border-academy-fg/30 p-4 sm:p-6">
        <h2 id="selected-video-heading" ref={playerHeading} tabIndex={-1} className="scroll-mt-48 font-heading text-2xl font-bold">{selected.title}</h2>
        <p className="mt-2">{languageName(selected.language)}{selected.version ? ` · ${selected.version}` : ""}</p>
        <p id="playback-privacy" className="mt-3 mb-4">Playing connects to YouTube, which receives device and connection information. No YouTube player loads until you choose Play.</p>
        {playing && isYouTubeId(selected.youtubeId) ? (
          <iframe
            key={`${selected.youtubeId}-${retry}`}
            src={`https://www.youtube-nocookie.com/embed/${selected.youtubeId}?autoplay=1&cc_load_policy=1`}
            title={`${selected.title} (${languageName(selected.language)}) | ${program.title}`}
            className="aspect-video min-h-[200px] w-full rounded-lg border-0 bg-black"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button type="button" aria-describedby="playback-privacy" onClick={() => setPlaying(true)} className="group relative flex aspect-video min-h-[200px] w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-xl px-4 py-8 text-white" style={{ backgroundColor: brand }}>
            {/* The stored poster frame, so the panel shows this parent rather than an empty block. */}
            {thumb(selected) && <Image src={thumb(selected)!} alt="" width={program.thumbs!.width} height={program.thumbs!.height} className="absolute inset-0 h-full w-full object-cover" unoptimized />}
            {/* Light scrim keeps the parent visible. Contrast for the disc and label must not
                depend on how bright a given poster frame is, so each carries its own backing. */}
            <span aria-hidden="true" className="absolute inset-0" style={{ background: `linear-gradient(to top, ${brand}E6 0%, ${brand}73 55%, ${brand}4D 100%)` }} />
            <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white transition-colors group-hover:bg-white/90" style={{ color: brand, boxShadow: `0 0 0 2px ${brand}, 0 6px 18px rgba(0,0,0,.4)` }}><Play size={26} fill="currentColor" aria-hidden="true" /></span>
            <span className="relative z-10 rounded-full px-4 py-1.5 font-heading text-lg font-semibold" style={{ backgroundColor: brand }}>Play video</span>
            {program.ribbon && <Image src={program.ribbon.src} alt="" width={program.ribbon.width} height={program.ribbon.height} className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 w-full object-cover" />}
          </button>
        )}
        {playing && <div className="mt-3 flex flex-wrap gap-3">
          <button type="button" className={action} onClick={() => setPlaying(false)}>Stop video</button>
          <button type="button" className={action} onClick={() => setRetry(n => n + 1)}>Retry video</button>
        </div>}
        <p className="mt-4 text-sm">If playback is blocked or unavailable, try the original source. Caption and fullscreen controls are provided by YouTube; caption availability varies by video.</p>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
          <a className="inline-flex min-h-11 items-center text-academy-accent underline underline-offset-4" href={selected.sourceUrl}>Original partner page</a>
          <a className="inline-flex min-h-11 items-center text-academy-accent underline underline-offset-4" href={`https://www.youtube.com/watch?v=${selected.youtubeId}`}>Watch on YouTube</a>
        </div>
      </section>

      <section aria-labelledby="browse-heading" className="mt-10">
        <h2 id="browse-heading" className="font-heading text-2xl font-bold">Browse the videos</h2>
        <noscript><p>Use the original-source links below to watch without JavaScript.</p></noscript>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="block">Search titles and topics
            <span className="relative mt-2 block">
              <Search size={18} aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2" />
              <input type="search" maxLength={160} value={query} onChange={e => setQuery(e.target.value)} className={`${control} ps-10`} />
            </span>
          </label>
          <div>
            <label htmlFor="partner-topic" className="block">Topic</label>
            <span className="relative mt-2 block">
              <select id="partner-topic" value={topic} onChange={e => setTopic(e.target.value)} className={`${control} appearance-none pe-10`}>
                <option value="">All topics</option>{topics.map(t => <option key={t}>{t}</option>)}
              </select>
              <ChevronDown aria-hidden="true" size={18} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2" />
            </span>
          </div>
          <div>
            <label htmlFor="partner-language" className="block">Language</label>
            <span className="relative mt-2 block">
              <select id="partner-language" value={language} onChange={e => setLanguage(e.target.value)} className={`${control} appearance-none pe-10`}>
                <option value="">All languages</option>{languages.map(l => <option key={l} value={l}>{languageName(l)}</option>)}
              </select>
              <ChevronDown aria-hidden="true" size={18} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2" />
            </span>
          </div>
        </div>
        <p role="status" className="my-4">{matches.length} of {program.videos.length} videos</p>
        {!matches.length && <div className="rounded-lg border border-academy-fg/30 p-5"><p className="mb-3">No videos match your filters.</p><button type="button" onClick={reset} className={action}>Reset filters</button></div>}
        {groups.map(([name, list], groupIndex) => (
          <section key={name || "results"} aria-labelledby={name ? `topic-${groupIndex}` : undefined} className="mt-8 first:mt-6">
            {name && <h3 id={`topic-${groupIndex}`} className="mb-4 flex items-baseline gap-3 font-heading text-lg font-semibold">
              {name}<span className="text-sm font-normal text-academy-fg/70">{list.length} {list.length === 1 ? "video" : "videos"}</span>
            </h3>}
            <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((v, i) => {
                const current = selected.youtubeId === v.youtubeId;
                const src = thumb(v);
                return (
                  <li key={v.youtubeId} className="min-w-0">
                    {/* The whole card is the control, so the target is the poster, not a small button. */}
                    <button type="button" aria-pressed={current} onClick={() => choose(v)} className="group block w-full text-start">
                      <span className={`relative block overflow-hidden rounded-xl border-2 ${current ? "border-academy-accent" : "border-transparent"}`}>
                        {src
                          ? <Image src={src} alt="" width={program.thumbs!.width} height={program.thumbs!.height} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" loading={groupIndex === 0 && i < 3 ? "eager" : "lazy"} className="aspect-video w-full object-cover" unoptimized />
                          : <span className="block aspect-video w-full" style={{ backgroundColor: brand }} />}
                        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white" style={{ color: brand }}><Play size={20} fill="currentColor" /></span>
                        </span>
                        {current && <span className="absolute start-2 top-2 rounded-full bg-academy-accent px-3 py-1 text-xs font-semibold text-academy-bg">Now playing</span>}
                      </span>
                      <span className="mt-3 block font-heading text-base font-semibold leading-snug group-hover:underline">{v.title}</span>
                      <span className="mt-1 block text-sm text-academy-fg/80">{meta(v)}</span>
                    </button>
                    <a href={v.sourceUrl} className="inline-flex min-h-11 items-center text-sm text-academy-accent underline underline-offset-4">Original source<span className="sr-only">: {v.title}</span></a>
                    {v.version && <a href={`https://www.youtube.com/watch?v=${v.youtubeId}`} className="ms-4 inline-flex min-h-11 items-center text-sm text-academy-accent underline underline-offset-4">Spanish video on YouTube</a>}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </section>
      <section aria-labelledby="partner-app-heading" className="mt-10 border-t border-academy-fg/30 pt-8">
        <h2 id="partner-app-heading" className="font-heading text-2xl font-bold">Take the conversation with you</h2>
        <p className="mt-3 max-w-3xl">{program.appDescription}</p>
        <div className="mt-3 flex flex-wrap gap-x-6">
          {program.appUrl && <a href={program.appUrl} className="inline-flex min-h-11 items-center text-academy-accent underline underline-offset-4">View the iPhone app</a>}
          <a href={program.website} className="inline-flex min-h-11 items-center text-academy-accent underline underline-offset-4">Official website / other devices</a>
        </div>
        <p className="mt-4 text-sm">The program and original videos belong to their respective creators. These resources are not a substitute for medical advice.</p>
      </section>
    </div>
  );
}
