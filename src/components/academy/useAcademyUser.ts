"use client";

//==============================================================================
// Academy — client session hook. Fetches the current member; redirects to the
// /academy login screen on 401. Every member-only page uses this.
//==============================================================================

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface AcademyUser {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  xp: number;
  role?: "member" | "admin";
  bio?: string;
}

export function useAcademyUser() {
  const router = useRouter();
  const [user, setUser] = useState<AcademyUser | null>(null);
  const [badges, setBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/academy/auth")
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) {
          router.replace("/academy");
          return;
        }
        const json = await res.json();
        setUser(json.user);
        setBadges(json.badges ?? []);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) router.replace("/academy");
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  return { user, badges, loading, setUser };
}
