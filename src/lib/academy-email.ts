//==============================================================================
// Academy — transactional email (magic links). Resend, one adapter per site.
//==============================================================================
// Env: RESEND_API_KEY (server-only). Optional ACADEMY_EMAIL_FROM overrides the
// profile's `email.from`. When the key is missing, sendAcademyEmail() returns
// { ok:false } and callers degrade gracefully (magic-link request still 200s
// so the form never reveals whether an address exists).
//==============================================================================

import { academyConfig } from "@/content/academy.config";

export interface AcademyEmail {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendAcademyEmail(mail: AcademyEmail): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY not set" };
  const from = process.env.ACADEMY_EMAIL_FROM || academyConfig.email.from;
  const replyTo = academyConfig.email.replyTo || undefined;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [mail.to], subject: mail.subject, html: mail.html, text: mail.text, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  if (!res.ok) return { ok: false, error: `resend ${res.status}: ${(await res.text()).slice(0, 200)}` };
  return { ok: true };
}

/** The magic-link email, in the brand's name. Plain and short — it's a login link. */
export function magicLinkEmail(to: string, url: string, firstName: string): AcademyEmail {
  const name = academyConfig.academy.name;
  const subject = `Your ${name} sign-in link`;
  const text = `Hi ${firstName},\n\nHere is your one-time sign-in link for ${name}:\n${url}\n\nIt works once and expires in 15 minutes. If you didn't ask for it, you can ignore this email.\n\n— ${academyConfig.academy.kicker}`;
  const html = `<!doctype html><html><body style="margin:0;padding:32px 16px;background:#f5f5f5;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1a1a1a">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center">
<table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;padding:32px" cellspacing="0" cellpadding="0"><tr><td>
<p style="margin:0 0 8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6b7280">${escapeHtml(academyConfig.academy.kicker)}</p>
<h1 style="margin:0 0 16px;font-size:22px">${escapeHtml(name)}</h1>
<p style="margin:0 0 20px;font-size:16px;line-height:1.5">Hi ${escapeHtml(firstName)}, here is your one-time sign-in link.</p>
<p style="margin:0 0 24px"><a href="${url}" style="display:inline-block;background:#1a1a1a;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:10px">Sign in to ${escapeHtml(name)}</a></p>
<p style="margin:0 0 8px;font-size:14px;color:#4a4a4a">It works once and expires in 15 minutes. If you didn't ask for it, ignore this email.</p>
<p style="margin:16px 0 0;font-size:12px;color:#6b7280;word-break:break-all">Or paste this into your browser:<br>${url}</p>
</td></tr></table></td></tr></table></body></html>`;
  return { to, subject, html, text };
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}
