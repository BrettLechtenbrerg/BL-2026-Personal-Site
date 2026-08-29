"use client";

//==============================================================================
// Academy — leaderboard (XP ranking with belt levels)
//==============================================================================

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Trophy } from "lucide-react";
import { useAcademyUser } from "@/components/academy/useAcademyUser";
import { beltFor } from "@/content/academy/badges";

interface Member {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  certified: boolean;
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const { loading } = useAcademyUser();
  const [members, setMembers] = useState<Member[]>([]);
  const [meId, setMeId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

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

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 flex items-center gap-2 font-heading text-3xl font-bold">
        <Trophy className="text-gold" /> Leaderboard
      </h1>
      <p className="mb-8 text-white/60">Earn XP by completing lessons, passing quizzes, and showing up.</p>

      <div className="space-y-2">
        {members.map((m, i) => {
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
              <span className="text-2xl">{m.avatar}</span>
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
              <span className="font-heading font-bold text-gold">{m.xp.toLocaleString()}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
