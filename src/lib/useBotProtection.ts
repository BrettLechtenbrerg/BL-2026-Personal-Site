"use client";

import { useRef } from "react";

// ---------------------------------------------------------------------------
// Client companion to lib/bot-protection.ts (ported from the TSAI site).
//
// Gives a form the two fields the server expects:
//   - a hidden honeypot input (rendered via <input {...honeypotProps} />)
//   - a render timestamp, merged into the POST body via withBotFields(body)
//
// Real users never see or touch the honeypot. The timestamp is set when the
// form mounts, so an instant programmatic submit fails the server timing gate.
// ---------------------------------------------------------------------------

export const HONEYPOT_FIELD = "company_website";
export const TIMESTAMP_FIELD = "_ts";

export function useBotProtection() {
  // Captured once on first render = when the human started seeing the form.
  const renderedAt = useRef<number>(Date.now());

  // Spread onto a hidden <input>. Off-screen + aria-hidden + no tab stop so
  // assistive tech and humans skip it, while naive bots still fill it.
  const honeypotProps = {
    type: "text" as const,
    name: HONEYPOT_FIELD,
    tabIndex: -1,
    autoComplete: "off",
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
      [TIMESTAMP_FIELD]: renderedAt.current,
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
