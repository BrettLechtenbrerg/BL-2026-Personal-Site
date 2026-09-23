"use client";

import { useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// Client companion to lib/bot-protection.ts (ported from the TSAI site).
//
// Gives a form the two fields the server expects:
//   - a hidden honeypot input (rendered via <input {...honeypotProps} />)
//   - how long the form has been open, merged into the POST body via withBotFields(body)
//
// Real users never see or touch the honeypot. Time-on-form is measured on the
// device itself (start and end on the same clock), so a phone whose clock is
// off can't make a human look like a bot.
//
// Sep 23 2026: a GIFT CONNECT team member's signup was rejected as a bot. The
// honeypot used to be called "company_website", which phone/browser AutoFill
// can fill from the owner's contact card, and the old timing gate compared the
// device clock with the server clock. Keep the honeypot name meaningless to AutoFill.
// ---------------------------------------------------------------------------

export const HONEYPOT_FIELD = "hp_leave_blank";
export const ELAPSED_FIELD = "_elapsed_ms";

export function useBotProtection() {
  // Captured once on mount = when the human started seeing the form.
  // (Set in an effect, not during render, so the hook stays pure.)
  const renderedAt = useRef<number>(0);
  useEffect(() => {
    if (!renderedAt.current) renderedAt.current = Date.now();
  }, []);

  // Spread onto a hidden <input>. Off-screen + aria-hidden + no tab stop so
  // assistive tech and humans skip it, while naive bots still fill it.
  const honeypotProps = {
    type: "text" as const,
    name: HONEYPOT_FIELD,
    tabIndex: -1,
    autoComplete: "off",
    // Password managers (LastPass, 1Password) skip fields marked like this.
    "data-lpignore": "true",
    "data-1p-ignore": "true",
    "aria-hidden": true,
    style: {
      position: "absolute" as const,
      left: "-9999px",
      width: "1px",
      height: "1px",
      opacity: 0,
      pointerEvents: "none" as const,
    },
  };

  // Merge the anti-bot fields into whatever payload the form already sends.
  function withBotFields<T extends Record<string, unknown>>(body: T) {
    return {
      ...body,
      // 0 = not measured (effect hasn't run); the server skips the check then.
      [ELAPSED_FIELD]: renderedAt.current ? Date.now() - renderedAt.current : 0,
      // Honeypot is an uncontrolled input — empty for real users. We read its
      // live DOM value so a bot that auto-filled it gets caught server-side.
      [HONEYPOT_FIELD]: getHoneypotValue(),
    };
  }

  return { honeypotProps, withBotFields };
}

// Reads the honeypot input's current value straight from the DOM so we don't
// have to add controlled state for it in every form.
function getHoneypotValue(): string {
  if (typeof document === "undefined") return "";
  const el = document.querySelector<HTMLInputElement>(
    `input[name="${HONEYPOT_FIELD}"]`
  );
  return el?.value ?? "";
}
