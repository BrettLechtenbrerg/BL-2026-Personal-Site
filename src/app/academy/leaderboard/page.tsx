"use client";

//==============================================================================
// Academy — leaderboard: 7-day / 30-day / all-time XP tabs + belt distribution
//==============================================================================

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Trophy } from "lucide-react";
import { useAcademyUser } from "@/components/academy/useAcademyUser";
import Avatar from "@/components/academy/Avatar";
import { beltFor, beltLevels } from "@/content/academy/badges";

interface Member {
  id: string;
  name: string;
  avatar: string;
  photoUrl: string | null;
  xp: number;
  xp7: number;
  xp30: number;
  certified: boolean;
}

type RankWindow = "xp7" | "xp30" | "xp";
const WINDOWS: { key: RankWindow; label: string }[] = [
  { key: "xp7", label: "7 days" },
  { key: "xp30", label: "30 days" },
  { key: "xp", label: "All time" },
];

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const { loading } = useAcademyUser();
  const [members, setMembers] = useState<Member[]>([]);
  const [meId, setMeId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [win, setWin] = useState<RankWindow>("xp30");

  useEffect(() => {
    fetch("/api/academy/leaderboard")
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

  if (loading || !ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  // Belt distribution across all members (like GHL's "Level N — X% of members").
  const beltCounts = beltLevels.map((b) => ({
    ...b,
    count: members.filter((m) => beltFor(m.xp, m.certified).name === b.name).length,
  }));
  const ranked = members
    .filter((m) => win === "xp" || m[win] > 0)
    .sort((a, b) => b[win] - a[win]);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 flex items-center gap-2 font-heading text-3xl font-bold">
        <Trophy className="text-gold" /> Leaderboard
      </h1>
      <p className="mb-6 text-white/60">Earn XP by completing lessons, passing quizzes, and showing up.</p>

      <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs sm:grid-cols-5">
        {beltCounts.map((b) => (
          <div key={b.name} className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-6 shrink-0 rounded-full" style={{ backgroundColor: b.color }} />
            <span className="truncate text-white/70">
              {b.name.replace(" Belt", "")}{" "}
              <span className="text-white/40">
                {members.length ? Math.round((b.count / members.length) * 100) : 0}%
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="mb-4 flex gap-1 rounded-lg bg-white/5 p-1">
        {WINDOWS.map((w) => (
          <button
            key={w.key}
            onClick={() => setWin(w.key)}
            className={`min-h-10 flex-1 rounded-md text-sm font-semibold transition-colors ${
              win === w.key ? "bg-cranberry text-white" : "text-white/60 hover:bg-white/10"
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>

      {ranked.length === 0 && (
        <p className="text-sm text-white/50">No XP earned in this window yet — be the first.</p>
      )}

      <div className="space-y-2">
        {ranked.map((m, i) => {
          const belt = beltFor(m.xp, m.certified);
          const isMe = m.id === meId;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.5) }}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 backdrop-blur-md ${
                isMe ? "border-gold/50 bg-gold/10" : "border-white/10 bg-white/5"
              }`}
            >
              <span className="w-8 text-center font-heading font-bold text-white/60">
                {MEDALS[i] ?? i + 1}
              </span>
              <Avatar emoji={m.avatar} photoUrl={m.photoUrl} size={40} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">
                  {m.name} {isMe && <span className="text-xs text-gold">(you)</span>}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-white/50">
                  <span
                    className="inline-block h-2 w-6 rounded-full"
                    style={{ backgroundColor: belt.color }}
                  />
                  {belt.name}
                  {m.certified && " · Certified 🏆"}
                </p>
              </div>
              <span className="font-heading font-bold text-gold">
                {win === "xp" ? "" : "+"}
                {m[win].toLocaleString()}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
