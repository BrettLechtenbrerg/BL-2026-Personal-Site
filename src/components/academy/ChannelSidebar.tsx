"use client";

//==============================================================================
// Academy — left sidebar shown on every member page (GHL-style): community
// channels + group About card. Renders nothing until the member is signed in
// (the stats call 401s on the login screen). Desktop only; the community page
// keeps its own horizontal chips for mobile.
//==============================================================================

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { channels } from "@/content/academy/channels";
import { academyConfig } from "@/content/academy.config";

interface Stats {
  counts: Record<string, number>;
  members: number;
  posts: number;
}

export default function ChannelSidebar() {
  return (
    <Suspense fallback={null}>
      <Sidebar />
    </Suspense>
  );
}

function Sidebar() {
  const pathname = usePathname();
  const params = useSearchParams();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/academy/community/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelled) setStats(json);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (!stats) return null;

  const onCommunity = pathname === "/academy/community";
  const activeSlug = onCommunity ? (params.get("channel") ?? "") : null;

  return (
    <aside className="hidden w-56 shrink-0 md:block">
      <nav className="sticky top-20 space-y-0.5">
        <ChannelLink href="/academy/community" label="All posts" emoji="🏠" activeNow={activeSlug === ""} />
        <div className="my-2 border-t border-academy-fg/10" />
        {channels.map((c) => (
          <ChannelLink
            key={c.slug}
            href={`/academy/community?channel=${c.slug}`}
            label={c.name}
            emoji={c.emoji}
            count={stats.counts[c.slug]}
            activeNow={activeSlug === c.slug}
          />
        ))}

        <div className="mt-4 rounded-xl border border-academy-fg/10 bg-academy-fg/5 p-4">
          <p className="font-heading font-bold">{academyConfig.academy.name}</p>
          <p className="mt-1 text-xs text-academy-fg/60">
            {academyConfig.academy.copy.sidebarBlurb}
          </p>
          <div className="mt-3 grid grid-cols-2 divide-x divide-academy-fg/10 text-center">
            <Link href="/academy/members" className="hover:text-academy-accent">
              <p className="font-heading text-lg font-bold">{stats.members}</p>
              <p className="text-[11px] text-academy-fg/50">Members</p>
            </Link>
            <div>
              <p className="font-heading text-lg font-bold">{stats.posts}</p>
              <p className="text-[11px] text-academy-fg/50">Posts</p>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}

function ChannelLink({
  href,
  label,
  emoji,
  count,
  activeNow,
}: {
  href: string;
  label: string;
  emoji: string;
  count?: number;
  activeNow: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={activeNow ? "page" : undefined}
      className={`flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 text-sm transition-colors ${
        activeNow ? "bg-academy-primary font-semibold text-academy-fg" : "text-academy-fg/75 hover:bg-academy-fg/10 hover:text-academy-fg"
      }`}
    >
      <span className="text-base">{emoji}</span>
      <span className="flex-1 truncate">{label}</span>
      {count ? <span className="text-xs text-academy-fg/50">{count}</span> : null}
    </Link>
  );
}
