"use client";

//==============================================================================
// Academy — members directory: who's here, their tagline, belt, joined date
// and last-active. Filter tabs (All / Admins / Certified) + name search.
//==============================================================================

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Loader2, Search, Users } from "lucide-react";
import { useAcademyUser } from "@/components/academy/useAcademyUser";
import Avatar from "@/components/academy/Avatar";
import { beltFor } from "@/content/academy/badges";

interface Member {
  id: string;
  name: string;
  avatar: string;
  photoUrl: string | null;
  xp: number;
  admin: boolean;
  bio: string | null;
  lastSeenAt: string | null;
  joinedAt: string;
  certified: boolean;
}

type Filter = "all" | "admins" | "certified";

function ago(iso: string | null): string {
  if (!iso) return "not yet";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function MembersPage() {
  const { loading } = useAcademyUser();
  const [members, setMembers] = useState<Member[]>([]);
  const [meId, setMeId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/academy/members")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) {
          setMembers(json.members ?? []);
          setMeId(json.me ?? null);
        }
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return members.filter((m) => {
      if (filter === "admins" && !m.admin) return false;
      if (filter === "certified" && !m.certified) return false;
      return !needle || m.name.toLowerCase().includes(needle) || (m.bio ?? "").toLowerCase().includes(needle);
    });
  }, [members, filter, q]);

  if (loading || !ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "Members", count: members.length },
    { key: "admins", label: "Admins", count: members.filter((m) => m.admin).length },
    { key: "certified", label: "Certified", count: members.filter((m) => m.certified).length },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 flex items-center gap-2 font-heading text-3xl font-bold">
        <Users className="text-gold" /> Members
      </h1>
      <p className="mb-6 text-white/60">
        The people training alongside you. Add your tagline on your profile.
      </p>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`min-h-10 rounded-lg px-3 text-sm font-semibold transition-colors ${
              filter === t.key ? "bg-cranberry text-white" : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            {t.label} <span className="ml-1 opacity-70">{t.count}</span>
          </button>
        ))}
        <label className="relative ml-auto flex min-w-[200px] flex-1 items-center sm:flex-none">
          <Search size={16} className="pointer-events-none absolute left-3 text-white/40" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search members"
            aria-label="Search members"
            className="min-h-10 w-full rounded-lg border border-white/10 bg-black/30 pl-9 pr-3 text-sm text-white placeholder-white/40 outline-none focus:border-gold"
          />
        </label>
      </div>

      {shown.length === 0 && <p className="text-sm text-white/50">No members match.</p>}

      <div className="space-y-2">
        {shown.map((m, i) => {
          const belt = beltFor(m.xp, m.certified);
          const isMe = m.id === meId;
          return (
            <motion.article
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.4) }}
              className={`flex gap-4 rounded-xl border p-4 backdrop-blur-md ${
                isMe ? "border-gold/50 bg-gold/10" : "border-white/10 bg-white/5"
              }`}
            >
              <Avatar emoji={m.avatar} photoUrl={m.photoUrl} size={48} />
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 font-semibold">
                  {m.name}
                  {isMe && <span className="text-xs text-gold">(you)</span>}
                  {m.admin && (
                    <span className="rounded-full bg-cranberry/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      Admin
                    </span>
                  )}
                  {m.certified && <span title="Certified">🏆</span>}
                </p>
                {m.bio && <p className="mt-0.5 text-sm text-white/75">{m.bio}</p>}
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2 w-5 rounded-full"
                      style={{ backgroundColor: belt.color }}
                    />
                    {belt.name} · {m.xp.toLocaleString()} XP
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> Active {ago(m.lastSeenAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> Joined{" "}
                    {new Date(m.joinedAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
