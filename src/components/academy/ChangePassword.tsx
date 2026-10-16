"use client";

//==============================================================================
// Academy — Profile: change your password (16 Oct 2026).
// Needs the current password, except for 30 minutes after signing in with an
// emailed link ("Forgot your password?"); the server decides, this only shows
// or hides the field. API: /api/academy/password.
//==============================================================================

import { useEffect, useState } from "react";
import { Check, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";

const input =
  "w-full rounded-lg border border-academy-fg/15 bg-academy-bg/30 px-4 py-3 text-base text-academy-fg outline-none focus:border-academy-accent";
const label = "mb-1 block text-xs font-semibold uppercase tracking-wide text-academy-fg/60";
// Readable in both themes (red-300 alone is too faint on the light theme).
const errorText = "text-sm text-red-300 [.academy-light_&]:text-red-700";

export default function ChangePassword({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const [canSkipCurrent, setCanSkipCurrent] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch("/api/academy/password")
      .then((r) => (r.ok ? r.json() : { canSkipCurrent: false }))
      .then((j) => {
        if (!cancelled) setCanSkipCurrent(Boolean(j.canSkipCurrent));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (next.length < 8) return setError("Your new password must be at least 8 characters.");
    if (next !== confirm) return setError("The two new passwords don't match.");
    setSaving(true);
    try {
      const res = await fetch("/api/academy/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(canSkipCurrent ? { newPassword: next } : { currentPassword: current, newPassword: next }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not change your password. Please try again.");
      setDone(true);
      setOpen(false);
      setCanSkipCurrent(false);
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change your password. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section aria-labelledby="change-password" className="mb-4 rounded-2xl border border-academy-fg/10 bg-academy-fg/5 p-6 backdrop-blur-md">
      <h2 id="change-password" className="flex items-center gap-2 font-heading text-lg font-bold text-academy-accent">
        <KeyRound size={18} aria-hidden /> Password
      </h2>

      {done && (
        <p role="status" className="mt-2 flex items-center gap-2 text-sm font-semibold">
          <Check size={16} className="text-academy-accent" aria-hidden /> Your password is changed. Use it next time you log in.
        </p>
      )}

      {!open ? (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setDone(false);
          }}
          className="mt-3 flex min-h-11 items-center gap-2 rounded-lg border border-academy-fg/15 px-5 py-2 text-academy-fg/80 hover:bg-academy-fg/10 hover:text-academy-fg"
        >
          Change password
        </button>
      ) : (
        <form onSubmit={submit} className="mt-3 space-y-4">
          {/* Lets password managers save the new password under the right account. */}
          <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />

          {canSkipCurrent ? (
            <p className="rounded-lg border border-academy-accent/40 bg-academy-accent/10 px-4 py-3 text-sm">
              You signed in with an emailed link, so you can set a new password without your old one.
            </p>
          ) : (
            <div>
              <label htmlFor="pw-current" className={label}>
                Current password
              </label>
              <input
                id="pw-current"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                required
                maxLength={100}
                className={input}
              />
              <p className="mt-1 text-sm text-academy-fg/70">
                Forgot it? Log out, choose &ldquo;Forgot your password?&rdquo; on the login page, open the emailed link, then
                come back here within 30 minutes. You won&apos;t need the old one.
              </p>
            </div>
          )}

          <div>
            <label htmlFor="pw-new" className={label}>
              New password <span className="font-normal normal-case">(at least 8 characters)</span>
            </label>
            <input
              id="pw-new"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              required
              minLength={8}
              maxLength={100}
              className={input}
            />
          </div>
          <div>
            <label htmlFor="pw-confirm" className={label}>
              New password again
            </label>
            <input
              id="pw-confirm"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
              maxLength={100}
              className={input}
            />
          </div>

          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-pressed={show}
            className="flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm text-academy-fg/75 hover:text-academy-fg"
          >
            {show ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />} {show ? "Hide passwords" : "Show passwords"}
          </button>

          {error && (
            <p role="alert" className={errorText}>
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex min-h-11 items-center gap-2 rounded-lg bg-academy-primary px-5 py-2 font-heading font-bold text-academy-fg hover:bg-academy-primary-dark disabled:opacity-60"
            >
              {saving && <Loader2 size={16} className="animate-spin" aria-hidden />} {saving ? "Saving…" : "Save new password"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setError(null);
              }}
              className="flex min-h-11 items-center rounded-lg px-4 text-academy-fg/75 hover:bg-academy-fg/10 hover:text-academy-fg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
