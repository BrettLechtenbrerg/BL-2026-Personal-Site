"use client";

//==============================================================================
// Academy — "Unlock course" → Stripe Checkout (promo codes accepted there)
//==============================================================================

import { useState } from "react";
import { Loader2, Lock } from "lucide-react";

export default function UnlockCourseButton({
  courseId,
  priceLabel,
  className = "",
}: {
  courseId: string;
  /** e.g. "$97" — omitted when Stripe couldn't be reached. */
  priceLabel?: string;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/academy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course: courseId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || typeof json.url !== "string") {
        throw new Error(json.error || "Could not start checkout.");
      }
      window.location.assign(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout.");
      setBusy(false);
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={checkout}
        disabled={busy}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-gold px-5 font-heading font-bold text-black hover:bg-gold/90 disabled:opacity-60"
      >
        {busy ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
        Unlock course{priceLabel ? ` · ${priceLabel}` : ""}
      </button>
      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
    </div>
  );
}
