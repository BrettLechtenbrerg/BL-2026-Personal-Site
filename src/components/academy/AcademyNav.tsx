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

const links = [
  { href: "/academy/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/academy/modules", label: "Modules", icon: GraduationCap },
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

export default function AcademyNav({ courses }: { courses: NavCourse[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the course dropdown on outside click or Escape (menu links close it on click).
  useEffect(() => {
    if (!coursesOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setCoursesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCoursesOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [coursesOpen]);

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

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
        <Link href={authed ? "/academy/dashboard" : "/academy"} className="flex items-center gap-2">
          <span className="text-xl">🥋</span>
          <span className="font-heading text-sm font-bold tracking-wide text-gold sm:text-base">
            MASTER&apos;S EDGE ACADEMY
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {authed && (
            <nav className="flex items-center gap-1">
              {links.map(({ href, label, icon: Icon }) => {
                const active = pathname?.startsWith(href);
                const className = `flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm transition-colors sm:px-3 ${
                  active
                    ? "bg-cranberry text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`;
                if (href === "/academy/modules") {
                  return (
                    <div key={href} ref={menuRef} className="relative">
                      <button
                        type="button"
                        title={label}
                        aria-haspopup="menu"
                        aria-expanded={coursesOpen}
                        onClick={() => setCoursesOpen((o) => !o)}
                        className={className}
                      >
                        <Icon size={18} />
                        <span className="hidden md:inline">{label}</span>
                        <ChevronDown
                          size={14}
                          className={`transition-transform ${coursesOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {coursesOpen && (
                        <div
                          role="menu"
                          onClick={() => setCoursesOpen(false)}
                          className="absolute left-0 top-full z-50 mt-1 w-72 overflow-hidden rounded-xl border border-white/10 bg-black/95 py-1 shadow-xl backdrop-blur-md"
                        >
                          <Link
                            role="menuitem"
                            href="/academy/modules"
                            className="block px-4 py-2.5 text-sm font-semibold text-gold hover:bg-white/10"
                          >
                            All courses
                          </Link>
                          {courses.map((c) => (
                            <Link
                              key={c.id}
                              role="menuitem"
                              href={`/academy/modules#${c.id}`}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                            >
                              <span>{c.emoji}</span>
                              <span>{c.title}</span>
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
                    <span className="hidden md:inline">{label}</span>
                  </Link>
                );
              })}
              <button
                onClick={logout}
                title="Log out"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-lg px-2 py-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                <LogOut size={18} />
              </button>
            </nav>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
