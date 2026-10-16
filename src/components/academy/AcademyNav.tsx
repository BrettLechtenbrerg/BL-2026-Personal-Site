"use client";

//==============================================================================
// Academy — top navigation. Shows member links only when a session exists.
//==============================================================================
// Layout (GIFT CONNECT, 4–16 Oct 2026, measured 320–1536px in English and
// Spanish): name + right-hand group on the first row, member links on the
// second; link names from 1024px (icons below, names in tooltips). Right-hand
// group: Back to main site · Surveys (768px+, when the site has surveys) ·
// English/Español (when offered) · light/dark. Site-owned extra links come
// from components/academy/SiteNav.ts.
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
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import BackToMainSite from "./BackToMainSite";
import LanguageToggle, { useSpanish } from "./LanguageToggle";
import Image from "next/image";
import { academyConfig } from "@/content/academy.config";
import { cap } from "@/lib/academy-config";
import type { PartnerProgramSummary } from "@/lib/academy-partner-programs";
import { surveysEnabled } from "@/lib/surveys";
import { extraNavLinks } from "@/components/academy/SiteNav";

/** A site-owned top-menu link (components/academy/SiteNav.ts). */
export interface ExtraNavLink {
  href: string;
  label: string;
  /** Hand-set Spanish label when the Español switch is on (else Google translates it). */
  labelEs?: string;
  icon: LucideIcon;
  /** Other paths that light this link up, e.g. ["/academy/programs/"]. */
  activePrefixes?: string[];
}

interface NavLink extends ExtraNavLink {
  belowMdOnly?: boolean;
}

const links: NavLink[] = [
  { href: "/academy/dashboard", label: "Dashboard", icon: LayoutDashboard },
  // Nav label may differ from the prose plural, which also builds sentences like
  // "All habits passed"; renaming only this link leaves that copy correct.
  { href: "/academy/modules", label: academyConfig.vocab.modulesNav || cap(academyConfig.vocab.modules), icon: GraduationCap },
  ...extraNavLinks,
  // Surveys: phones/small tablets only here (icon row). From 768px it sits in the header's right-hand
  // group between "Back to main site" and Español (GIFT CONNECT, 16 Oct 2026); on phones that group has no room.
  ...(surveysEnabled ? [{ href: "/academy/surveys", label: "Surveys", labelEs: "Encuestas", icon: ClipboardList, belowMdOnly: true }] : []),
  { href: "/academy/community", label: "Community", icon: Users },
  { href: "/academy/events", label: "Events", icon: CalendarDays },
  // Hand-set: Google's "Tabla de clasificación" is too long for one row.
  { href: "/academy/leaderboard", label: "Leaderboard", labelEs: "Clasificación", icon: Trophy },
  { href: "/academy/members", label: "Members", icon: Contact },
  { href: "/academy/profile", label: "Profile", icon: UserCircle },
];

// Hand-set Spanish academy name (profile academy.nameEs), e.g. when Google's is too long for the phone header.
const SPANISH_NAME = academyConfig.academy.nameEs;

export interface NavCourse {
  id: string;
  title: string;
  emoji: string;
}

export default function AcademyNav({ courses, programs = [] }: { courses: NavCourse[]; programs?: PartnerProgramSummary[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const spanish = useSpanish();
  const [authed, setAuthed] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasPrograms = programs.length > 0;
  const programsClaimed = extraNavLinks.some((l) => l.activePrefixes?.some((p) => "/academy/programs/".startsWith(p) || p.startsWith("/academy/programs/")));

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
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-4 py-3">
        <Link href={authed ? "/academy/dashboard" : "/academy"} className="flex min-w-0 items-center gap-2">
          {academyConfig.academy.logo ? (
            <Image src={academyConfig.academy.logo} alt="" width={28} height={28} className="h-7 w-7" />
          ) : (
            <span className="text-xl">{academyConfig.academy.icon}</span>
          )}
          {/* Wraps below 1024px so it never runs under the "Main site" button (the Spanish name is longer). */}
          <span
            translate={spanish && SPANISH_NAME ? "no" : undefined}
            lang={spanish && SPANISH_NAME ? "es" : undefined}
            className="min-w-0 hyphens-auto font-heading text-sm font-bold leading-tight tracking-wide text-academy-accent sm:text-base lg:whitespace-nowrap"
          >
            {(spanish && SPANISH_NAME ? SPANISH_NAME : academyConfig.academy.name).toUpperCase()}
          </span>
        </Link>
        <div className="contents">
          {authed && (
            /* One row in both languages: icons only below 1024px (names in tooltips), names from 1024px
               with tight padding (8 items need ~930px; 1024px gives 992px). Surveys is in this row only
               below 768px; above that it sits in the header's right-hand group. */
            <nav aria-label={academyConfig.academy.name} className="order-3 col-span-2 flex flex-wrap items-center gap-1 lg:gap-0.5">
              {links.map(({ href, label: englishLabel, labelEs, icon: Icon, belowMdOnly, activePrefixes }) => {
                const handSet = spanish && !!labelEs;
                const label = handSet ? labelEs! : englishLabel;
                const active =
                  pathname?.startsWith(href) ||
                  !!activePrefixes?.some((p) => pathname?.startsWith(p)) ||
                  // Partner program libraries count as the modules page unless a site link claims them.
                  (href === "/academy/modules" && !programsClaimed && programs.some((p) => pathname === `/academy/programs/${p.slug}`));
                const className = `${belowMdOnly ? "md:hidden " : ""}flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm transition-colors sm:px-3 lg:px-2 ${
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
                        <span className="hidden whitespace-nowrap lg:inline">{label}</span>
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
                  <Link key={href} href={href} title={label} translate={handSet ? "no" : undefined} className={className}>
                    <Icon size={18} />
                    <span className="hidden whitespace-nowrap lg:inline">{label}</span>
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
          <div className="flex items-center gap-2 justify-self-end sm:gap-3">
            <BackToMainSite variant="header" />
            {/* Member surveys (GIFT CONNECT, 16 Oct 2026: between "Back to main site" and Español). Members
                only, from 768px (below that it is in the icon row: here it squeezed the site name to 8 lines
                in Spanish). Outlined like the language switch, primary colour when open. The survey team
                reaches Preview / Share and Results from My Surveys. */}
            {authed && surveysEnabled && (
              <Link
                href="/academy/surveys"
                title={spanish ? "Encuestas" : "Surveys"}
                translate={spanish ? "no" : undefined}
                aria-current={pathname?.startsWith("/academy/surveys") ? "page" : undefined}
                className={`hidden min-h-11 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-3 text-sm font-semibold transition-colors md:inline-flex ${
                  pathname?.startsWith("/academy/surveys")
                    ? "border-academy-primary bg-academy-primary text-academy-fg"
                    : "border-academy-fg/20 text-academy-fg hover:bg-academy-fg/10"
                }`}
              >
                <ClipboardList size={18} aria-hidden="true" />
                <span>{spanish ? "Encuestas" : "Surveys"}</span>
              </Link>
            )}
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
