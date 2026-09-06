//==============================================================================
// CRM — SMS adapter (PAUSED)
//==============================================================================
// Brett paused SMS until the rest of the system is built (Phase 6 wires
// Twilio). Keeping the signature stable so workflows and the hub compile now
// and light up later with no call-site changes.
//==============================================================================

import type { SendResult } from "./resend";

export const SMS_PAUSED = true;

export interface SendSmsArgs {
  to: string;
  body: string;
  hubMessageId: string;
}

export async function sendSms(args: SendSmsArgs): Promise<SendResult> {
  console.info("[sms] paused — not sent", { hubMessageId: args.hubMessageId });
  return { ok: false, error: "SMS is paused until Phase 6 (Twilio not wired)." };
}
