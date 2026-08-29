"use client";

//==============================================================================
// Academy — member dashboard: progress ring, belt level, next-module CTA,
// badges, streak.
//==============================================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Award, Flame, Loader2 } from "lucide-react";
import { useAcademyUser } from "./useAcademyUser";
import { badgeBySlug, beltFor, nextBelt } from "@/content/academy/badges";

interface ProgressRow {
  module_slug: string;
  passed: boolean;
}

export default function Dashboard({
  modules,
}: {
  modules: { slug: string; order: number; title: string }[];
}) {
  const { user, loading } = useAcademyUser();
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [certUnlocked, setCertUnlocked] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/academy/progress")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) {
          setProgress(json.progress ?? []);
          setBadges(json.badges ?? []);
          setXp(json.xp ?? 0);
          setStreak(json.streak ?? 0);
          setCertUnlocked(json.certificationUnlocked ?? false);
        }
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  if (loading || !ready || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  const passedCount = modules.filter((m) =>
    progress.some((p) => p.module_slug === m.slug && p.passed)
  ).length;
  const pct = Math.round((passedCount / modules.length) * 100);
  const nextModule = modules.find(
    (m) => !progress.some((p) => p.module_slug === m.slug && p.passed)
  );
  const certified = badges.includes("certified-masters-edge");
  const belt = beltFor(xp, certified);
  const upcoming = certified ? null : nextBelt(xp);

  // SVG progress ring
  const R = 52;
  const CIRC = 2 * Math.PI * R;

  return (
    <div>
      <h1 className="mb-1 font-heading text-3xl font-bold">
        Welcome back, <span className="text-gold">{user.name.split(" ")[0]}</span> {user.avatar}
      </h1>
      <p className="mb-8 text-white/60">Keep training. Mastery is a practice.</p>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Progress ring */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
        >
          <svg width="128" height="128" viewBox="0 0 128 128" role="img" aria-label={`${pct}% complete`}>
            <circle cx="64" cy="64" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
            <motion.circle
              cx="64"
              cy="64"
              r={R}
              fill="none"
              stroke="#D4AF37"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              initial={{ strokeDashoffset: CIRC }}
              animate={{ strokeDashoffset: CIRC * (1 - pct / 100) }}
              transition={{ duration: 1, ease: "easeOut" }}
              transform="rotate(-90 64 64)"
            />
            <text x="64" y="70" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">
              {pct}%
            </text>
          </svg>
          <p className="mt-2 text-sm text-white/60">
            {passedCount}/{modules.length} modules passed
          </p>
        </motion.div>

        {/* Belt + XP */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
        >
          <div
            className="mb-3 h-4 w-24 rounded-full shadow-lg"
            style={{ backgroundColor: belt.color, boxShadow: `0 0 20px ${belt.color}66` }}
          />
          <p className="font-heading text-xl font-bold">{belt.name}</p>
          <p className="mt-1 text-sm text-gold">{xp.toLocaleString()} XP</p>
          {upcoming && (
            <p className="mt-2 text-xs text-white/50">
              {upcoming.minXp - xp} XP to {upcoming.name}
            </p>
          )}
        </motion.div>

        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
        >
          <Flame size={36} className={streak > 0 ? "text-gold" : "text-white/30"} />
          <p className="mt-2 font-heading text-2xl font-bold">{streak}</p>
          <p className="text-sm text-white/60">day streak</p>
        </motion.div>
      </div>

      {/* Next step CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
        className="mt-4 rounded-2xl border border-cranberry/40 bg-gradient-to-r from-cranberry/30 to-transparent p-6 backdrop-blur-md"
      >
        {nextModule ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">Up next</p>
            <h2 className="mt-1 font-heading text-xl font-bold">
              Module {nextModule.order}: {nextModule.title}
            </h2>
            <Link
              href={`/academy/modules/${nextModule.slug}`}
              className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg bg-cranberry px-5 py-2 font-heading font-bold text-white hover:bg-cranberry-dark"
            >
              Continue Training <ArrowRight size={18} />
            </Link>
          </>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">
              All modules passed
            </p>
            <h2 className="mt-1 font-heading text-xl font-bold">
              {certified ? "You are a Certified Master's Edge Black Belt 🏆" : "Certification awaits."}
            </h2>
            {certUnlocked && !certified && (
              <Link
                href="/academy/certification"
                className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg bg-gold px-5 py-2 font-heading font-bold text-black hover:bg-gold-dark"
              >
                Start Certification <ArrowRight size={18} />
              </Link>
            )}
            {certified && (
              <Link
                href="/academy/certificate"
                className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg bg-gold px-5 py-2 font-heading font-bold text-black hover:bg-gold-dark"
              >
                View Your Certificate <ArrowRight size={18} />
              </Link>
            )}
          </>
        )}
      </motion.div>

      {/* Badges */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-bold text-gold">
          <Award size={18} /> Badges
        </h2>
        {badges.length === 0 ? (
          <p className="text-sm text-white/50">No badges yet — complete your first module!</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {badges.map((slug) => {
              const b = badgeBySlug(slug);
              return (
                <div
                  key={slug}
                  title={b.description}
                  className="flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm"
                >
                  <span className="text-lg">{b.emoji}</span> {b.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
