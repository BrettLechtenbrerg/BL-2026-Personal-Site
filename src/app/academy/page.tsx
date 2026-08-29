"use client";

//==============================================================================
// Academy — login / signup screen (enrollment code gates signup)
//==============================================================================

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, KeyRound } from "lucide-react";

const AVATARS = ["🥋", "🦅", "🐯", "🐉", "🦁", "⚡", "🔥", "🏔️", "🌟", "🥷", "🛡️", "⚔️"];

export default function AcademyLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [checking, setChecking] = useState(true);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already signed in? Straight to the dashboard.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/academy/auth")
      .then((res) => {
        if (!cancelled && res.ok) router.replace("/academy/dashboard");
        else if (!cancelled) setChecking(false);
      })
      .catch(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/academy/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "signup"
            ? { action: "signup", code, name, email, password, avatar }
            : { action: "login", email, password }
        ),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      router.replace("/academy/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-base text-white placeholder-white/40 outline-none transition-colors focus:border-gold";

  return (
    <div className="mx-auto max-w-md pt-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-[0_0_60px_rgba(155,27,48,0.25)] backdrop-blur-md"
      >
        <div className="mb-6 text-center">
          <div className="mb-2 text-4xl">🥋</div>
          <h1 className="font-heading text-2xl font-bold text-white">
            Master&apos;s Edge <span className="text-gold">Academy</span>
          </h1>
          <p className="mt-1 text-sm text-white/60">
            {mode === "login" ? "Welcome back. Step onto the mat." : "Enroll with your access code."}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-black/40 p-1">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={`min-h-11 rounded-md text-sm font-semibold transition-colors ${
                mode === m ? "bg-cranberry text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {m === "login" ? "Log In" : "Enroll"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enrollment code"
                  required
                  className={`${inputClass} pl-9`}
                />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                minLength={2}
                maxLength={80}
                className={inputClass}
              />
            </>
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className={inputClass}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "Create a password (8+ characters)" : "Password"}
              required
              minLength={mode === "signup" ? 8 : 1}
              maxLength={100}
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-white/50 hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {mode === "signup" && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">
                Pick your avatar
              </p>
              <div className="grid grid-cols-6 gap-2">
                {AVATARS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAvatar(a)}
                    className={`flex h-11 w-11 items-center justify-center rounded-lg text-xl transition-all ${
                      avatar === a
                        ? "bg-gold/20 ring-2 ring-gold"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                    aria-label={`Avatar ${a}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-lg border border-cranberry/40 bg-cranberry/15 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-cranberry font-heading font-bold text-white transition-colors hover:bg-cranberry-dark disabled:opacity-60"
          >
            {submitting && <Loader2 size={18} className="animate-spin" />}
            {mode === "login" ? "Enter the Academy" : "Begin Training"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
