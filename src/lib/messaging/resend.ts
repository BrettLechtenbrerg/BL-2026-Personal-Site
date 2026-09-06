//==============================================================================
// CRM — Resend email adapter
//==============================================================================
// Free plan, single verified domain `auth.brettlechtenberg.com` (shared with
// Speaker's Edge auth mail; 100/day cap). Reply-To goes to Brett's Gmail so
// replies show up in Twenty via its Gmail sync (decision Sept 6, Phase 1).
//==============================================================================

import { Resend } from "resend";

const FROM = process.env.RESEND_FROM ?? "Brett Lechtenberg <brett@auth.brettlechtenberg.com>";

export interface SendEmailArgs {
  to: string;
  subject: string;
  html: string;
  /** Correlates Resend webhook events back to our hub_messages row. */
  hubMessageId: string;
  /** Adds List-Unsubscribe header + is required for marketing sends. */
  unsubscribeUrl?: string;
}

export interface SendResult {
  ok: boolean;
  providerMessageId?: string;
  error?: string;
}

let client: Resend | null = null;
function resend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return (client ??= new Resend(key));
}

export async function sendEmail(args: SendEmailArgs): Promise<SendResult> {
  const r = resend();
  if (!r) return { ok: false, error: "RESEND_API_KEY not set." };
  const replyTo = process.env.HUB_REPLY_TO_EMAIL;

  const headers: Record<string, string> = {};
  if (args.unsubscribeUrl) {
    headers["List-Unsubscribe"] = `<${args.unsubscribeUrl}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }

  const { data, error } = await r.emails.send({
    from: FROM,
    to: args.to,
    subject: args.subject,
    html: args.html,
    ...(replyTo ? { replyTo } : {}),
    headers,
    tags: [{ name: "hub_message_id", value: args.hubMessageId }],
  });
  if (error) return { ok: false, error: `${error.name}: ${error.message}` };
  return { ok: true, providerMessageId: data?.id };
}
