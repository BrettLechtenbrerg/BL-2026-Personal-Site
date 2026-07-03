"use client";

//==============================================================================
// Comms Hub — login
//==============================================================================
// Minimal login gate for the Comms Hub. POSTs to /api/hub/auth which sets the
// HMAC session cookie; on success we land on /hub/messaging. If a valid
// session already exists we skip the form entirely.
//==============================================================================

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, MessageSquare } from "lucide-react";

export default function HubLoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showUsername, setShowUsername] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already signed in? Straight to messaging.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/hub/auth")
      .then((res) => {
        if (!cancelled && res.ok) router.replace("/hub/messaging");
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
      const res = await fetch("/api/hub/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Login failed.");
      router.replace("/hub/messaging");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9B1B30] to-[#7A1526] mb-4">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Comms Hub</h1>
          <p className="text-sm text-gray-400 mt-1">
            Brett Lechtenberg — internal messaging
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-gray-900 border border-white/10 rounded-2xl p-6 space-y-4"
        >
          <div>
            <label className="text-xs text-gray-400">Username</label>
            <div className="relative mt-1">
              <input
                type={showUsername ? "text" : "password"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
                className="w-full px-3 py-2 pr-10 rounded-lg bg-gray-950 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]/60"
              />
              <button
                type="button"
                onClick={() => setShowUsername((v) => !v)}
                tabIndex={-1}
                aria-label={showUsername ? "Hide username" : "Show username"}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showUsername ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full px-3 py-2 pr-10 rounded-lg bg-gray-950 border border-white/10 text-sm text-white focus:outline-none focus:border-[#D4AF37]/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-900/50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !username || !password}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#9B1B30] text-white text-sm font-semibold hover:bg-[#7A1526] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
