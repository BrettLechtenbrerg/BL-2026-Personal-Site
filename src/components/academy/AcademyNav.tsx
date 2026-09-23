"use client";

//==============================================================================
// Academy — top navigation. Shows member links only when a session exists.
//==============================================================================

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  CalendarDays,
  Contact,
  Trophy,
  UserCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import { academyConfig } from "@/content/academy.config";
import { cap } from "@/lib/academy-config";
import type { PartnerProgramSummary } from "@/lib/academy-partner-programs";

const links = [
  { href: "/academy/dashboard", label: "Dashboard", icon: LayoutDashboard },
  // Nav label may differ from the prose plural, which also builds sentences like
  // "All habits passed"; renaming only this link leaves that copy correct.
  { href: "/academy/modules", label: academyConfig.vocab.modulesNav || cap(academyConfig.vocab.modules), icon: GraduationCap },
  { href: "/academy/community", label: "Community", icon: Users },
  { href: "/academy/events", label: "Events", icon: CalendarDays },
  { href: "/academy/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/academy/members", label: "Members", icon: Contact },
  { href: "/academy/profile", label: "Profile", icon: UserCircle },
];

export interface NavCourse {
  id: string;
  title: string;
  emoji: string;
}

export default function AcademyNav({ courses, programs = [] }: { courses: NavCourse[]; programs?: PartnerProgramSummary[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasPrograms = programs.length > 0;

  // Close the course dropdown on outside click or Escape (menu links close it on click).
  useEffect(() => {
    if (!coursesOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setCoursesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (hasPrograms && menuRef.current?.contains(document.activeElement)) {
        menuRef.current.querySelector("button")?.focus();
      }
      setCoursesOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [coursesOpen, hasPrograms]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/academy/auth")
      .then((res) => {
        if (!cancelled) setAuthed(res.ok);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const logout = async () => {
    await fetch("/api/academy/auth", { method: "DELETE" });
    setAuthed(false);
    router.replace("/academy");
  };

  // The host's global `:focus-visible` rule is unlayered, so it outranks Tailwind focus
  // utilities; it reads --focus-ring instead. The header is a dark surface in dark theme,
  // where the site's default ring drops to ~2.2:1, so follow the theme ink here.
  const headerRing = { "--focus-ring": "var(--academy-fg)" } as React.CSSProperties;

  return (
    <header className="sticky top-0 z-40 border-b border-academy-fg/10 bg-academy-bg/60 backdrop-blur-md" style={headerRing}>
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-4 py-3 xl:flex xl:justify-between">
        <Link href={authed ? "/academy/dashboard" : "/academy"} className="flex items-center gap-2">
          {academyConfig.academy.logo ? (
            <Image src={academyConfig.academy.logo} alt="" width={28} height={28} className="h-7 w-7" />
          ) : (
            <span className="text-xl">{academyConfig.academy.icon}</span>
          )}
          <span className="font-heading text-sm font-bold tracking-wide text-academy-accent sm:text-base">
            {academyConfig.academy.name.toUpperCase()}
          </span>
        </Link>
        <div className="contents xl:flex xl:items-center xl:gap-2">
          {authed && (
            <nav aria-label="Academy" className="order-3 col-span-2 flex flex-wrap items-center gap-1 xl:order-none xl:flex-nowrap">
              {links.map(({ href, label, icon: Icon }) => {
                const active = pathname?.startsWith(href) || (href === "/academy/modules" && programs.some(p => pathname === `/academy/programs/${p.slug}`));
                const className = `flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm transition-colors sm:px-3 ${
                  active
                    ? "bg-academy-primary text-academy-fg"
                    : "text-academy-fg/70 hover:bg-academy-fg/10 hover:text-academy-fg"
                }`;
                if (href === "/academy/modules") {
                  return (
                    <div key={href} ref={menuRef} className="relative"
                      onBlur={event => {
                        if (hasPrograms && !event.currentTarget.contains(event.relatedTarget)) setCoursesOpen(false);
                      }}>
                      <button
                        type="button"
                        title={label}
                        aria-haspopup={hasPrograms ? undefined : "menu"}
                        aria-expanded={coursesOpen}
                        onClick={() => setCoursesOpen((o) => !o)}
                        className={className}
                      >
                        <Icon size={18} />
                        <span className="hidden whitespace-nowrap md:inline">{label}</span>
                        <ChevronDown
                          size={14}
                          className={`transition-transform ${coursesOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {coursesOpen && (
                        <div
                          role={hasPrograms ? undefined : "menu"}
                          onClick={() => setCoursesOpen(false)}
                          className="absolute left-0 top-full z-50 mt-1 w-72 max-w-[calc(100vw-6rem)] overflow-hidden rounded-xl border border-academy-fg/10 bg-academy-bg/95 py-1 shadow-xl backdrop-blur-md"
                        >
                          <Link
                            role={hasPrograms ? undefined : "menuitem"}
                            href="/academy/modules"
                            className="block px-4 py-2.5 text-sm font-semibold text-academy-accent hover:bg-academy-fg/10"
                          >
                            All {academyConfig.vocab.courses}
                          </Link>
                          {courses.map((c) => (
                            <Link
                              key={c.id}
                              role={hasPrograms ? undefined : "menuitem"}
                              href={`/academy/modules#${c.id}`}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-academy-fg/80 hover:bg-academy-fg/10 hover:text-academy-fg"
                            >
                              <span>{c.emoji}</span>
                              <span>{c.title}</span>
                            </Link>
                          ))}
                          {programs.map(p => (
                            <Link key={p.slug} role={hasPrograms ? undefined : "menuitem"} href={`/academy/programs/${p.slug}`}
                              className="block px-4 py-2.5 text-sm text-academy-fg/80 hover:bg-academy-fg/10 hover:text-academy-fg">
                              {p.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link key={href} href={href} title={label} className={className}>
                    <Icon size={18} />
                    <span className="hidden whitespace-nowrap md:inline">{label}</span>
                  </Link>
                );
              })}
              <button
                onClick={logout}
                title="Log out"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-lg px-2 py-2 text-academy-fg/50 transition-colors hover:bg-academy-fg/10 hover:text-academy-fg"
              >
                <LogOut size={18} />
              </button>
            </nav>
          )}
          <div className="justify-self-end">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
