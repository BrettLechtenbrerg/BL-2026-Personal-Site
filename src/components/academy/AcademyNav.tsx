"use client";

//==============================================================================
// Academy — top navigation. Shows member links only when a session exists.
//==============================================================================

import { useEffect, useState } from "react";
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
} from "lucide-react";

const links = [
  { href: "/academy/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/academy/modules", label: "Modules", icon: GraduationCap },
  { href: "/academy/community", label: "Community", icon: Users },
  { href: "/academy/events", label: "Events", icon: CalendarDays },
  { href: "/academy/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/academy/members", label: "Members", icon: Contact },
  { href: "/academy/profile", label: "Profile", icon: UserCircle },
];

export default function AcademyNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

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
        {authed && (
          <nav className="flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  title={label}
                  className={`flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm transition-colors sm:px-3 ${
                    active
                      ? "bg-cranberry text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
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
      </div>
    </header>
  );
}
