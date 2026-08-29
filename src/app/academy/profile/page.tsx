"use client";

//==============================================================================
// Academy — profile: edit name/avatar, badge case, log out
//==============================================================================

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Award, Loader2, LogOut, Save } from "lucide-react";
import { useAcademyUser } from "@/components/academy/useAcademyUser";
import { badgeBySlug, beltFor } from "@/content/academy/badges";

const AVATARS = ["🥋", "🦅", "🐯", "🐉", "🦁", "⚡", "🔥", "🏔️", "🌟", "🥷", "🛡️", "⚔️"];

export default function ProfilePage() {
  const router = useRouter();
  const { user, badges, loading } = useAcademyUser();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatar(user.avatar);
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  const certified = badges.includes("certified-masters-edge");
  const belt = beltFor(user.xp, certified);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/academy/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, avatar }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not save.");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await fetch("/api/academy/auth", { method: "DELETE" });
    router.replace("/academy");
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 font-heading text-3xl font-bold">Your Profile</h1>

      <div className="mb-4 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <span className="text-5xl">{avatar}</span>
        <div>
          <p className="font-heading text-xl font-bold">{name || user.name}</p>
          <p className="text-sm text-white/60">{user.email}</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-gold">
            <span
              className="inline-block h-2 w-6 rounded-full"
              style={{ backgroundColor: belt.color }}
            />
            {belt.name} · {user.xp.toLocaleString()} XP
          </p>
        </div>
      </div>

      <form
        onSubmit={save}
        className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
      >
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/50">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          minLength={2}
          maxLength={80}
          required
          className="mb-4 w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-base text-white outline-none focus:border-gold"
        />

        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">Avatar</p>
        <div className="mb-4 grid grid-cols-6 gap-2">
          {AVATARS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAvatar(a)}
              className={`flex h-11 w-11 items-center justify-center rounded-lg text-xl transition-all ${
                avatar === a ? "bg-gold/20 ring-2 ring-gold" : "bg-white/5 hover:bg-white/10"
              }`}
              aria-label={`Avatar ${a}`}
            >
              {a}
            </button>
          ))}
        </div>

        {error && <p className="mb-3 text-sm text-red-300">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="flex min-h-11 items-center gap-2 rounded-lg bg-cranberry px-5 py-2 font-heading font-bold text-white hover:bg-cranberry-dark disabled:opacity-60"
        >
          <Save size={16} /> {saved ? "Saved ✓" : saving ? "Saving…" : "Save Changes"}
        </button>
      </form>

      {/* Badge case */}
      <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-bold text-gold">
          <Award size={18} /> Badge Case
        </h2>
        {badges.length === 0 ? (
          <p className="text-sm text-white/50">Your first badge is waiting in Module 1.</p>
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

      <button
        onClick={logout}
        className="flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-5 py-2 text-white/70 hover:bg-white/10 hover:text-white"
      >
        <LogOut size={16} /> Log Out
      </button>
    </div>
  );
}
