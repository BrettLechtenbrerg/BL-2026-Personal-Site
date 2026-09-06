"use client";

//==============================================================================
// Academy — profile: photo, name/avatar/tagline, badge case, log out
//==============================================================================

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Award, Camera, Loader2, LogOut, Save, Trash2 } from "lucide-react";
import { useAcademyUser } from "@/components/academy/useAcademyUser";
import Avatar from "@/components/academy/Avatar";
import { badgeBySlug, beltFor } from "@/content/academy/badges";

const AVATARS = ["🥋", "🦅", "🐯", "🐉", "🦁", "⚡", "🔥", "🏔️", "🌟", "🥷", "🛡️", "⚔️"];
const PHOTO_PX = 256;

/** Centre-crop to a square and downsize in the browser so uploads stay tiny. */
async function squarePhoto(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  const side = Math.min(bmp.width, bmp.height);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = PHOTO_PX;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser can't process images.");
  ctx.drawImage(bmp, (bmp.width - side) / 2, (bmp.height - side) / 2, side, side, 0, 0, PHOTO_PX, PHOTO_PX);
  bmp.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not read that image."))), "image/jpeg", 0.85)
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, badges, loading } = useAcademyUser();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatar(user.avatar);
      setBio(user.bio ?? "");
      setPhotoUrl(user.photoUrl ?? null);
    }
  }, [user]);

  const uploadPhoto = async (file: File | undefined) => {
    if (!file) return;
    setPhotoBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", await squarePhoto(file), "avatar.jpg");
      const res = await fetch("/api/academy/profile/photo", { method: "POST", body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Upload failed.");
      setPhotoUrl(json.photoUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setPhotoBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const removePhoto = async () => {
    setPhotoBusy(true);
    setError(null);
    const res = await fetch("/api/academy/profile/photo", { method: "DELETE" });
    if (res.ok) setPhotoUrl(null);
    else setError("Could not remove photo.");
    setPhotoBusy(false);
  };

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
        body: JSON.stringify({ name, avatar, bio }),
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
        <div className="relative shrink-0">
          <Avatar emoji={avatar} photoUrl={photoUrl} size={80} />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={photoBusy}
            aria-label={photoUrl ? "Change photo" : "Add photo"}
            className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-cranberry text-white hover:bg-cranberry-dark disabled:opacity-50"
          >
            {photoBusy ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => uploadPhoto(e.target.files?.[0])}
          />
        </div>
        <div className="min-w-0">
          <p className="font-heading text-xl font-bold">{name || user.name}</p>
          <p className="text-sm text-white/60">{user.email}</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-gold">
            <span
              className="inline-block h-2 w-6 rounded-full"
              style={{ backgroundColor: belt.color }}
            />
            {belt.name} · {user.xp.toLocaleString()} XP
          </p>
          <p className="mt-2 flex flex-wrap gap-3 text-xs text-white/50">
            <button type="button" onClick={() => fileInput.current?.click()} disabled={photoBusy} className="hover:text-gold">
              {photoUrl ? "Change photo" : "Add a photo"}
            </button>
            {photoUrl && (
              <button type="button" onClick={removePhoto} disabled={photoBusy} className="flex items-center gap-1 hover:text-red-400">
                <Trash2 size={12} /> Remove
              </button>
            )}
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

        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/50">
          Tagline <span className="font-normal normal-case text-white/40">(shown in the members directory)</span>
        </label>
        <input
          type="text"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={140}
          placeholder="e.g. Dojo owner, Salt Lake City · building a second location"
          className="mb-4 w-full rounded-lg border border-white/15 bg-black/30 px-4 py-3 text-base text-white placeholder-white/40 outline-none focus:border-gold"
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
