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
    signal: AbortSignal.timeout(10_000),
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

/** Two transactional emails per new account; never called for login or recovery.
 * Business notices use this brand's Reply-To inbox, never the member's input.
 * Delivery failures are isolated so one failed email cannot suppress the other.
 */
export async function sendEnrollmentEmails(to: string, memberName: string): Promise<void> {
  const { academy, email, site } = academyConfig;
  // Use the brand profile, not a request host or a user-supplied redirect.
  const origin = new URL(site.url);
  if (origin.protocol !== "https:" || origin.username || origin.password) {
    console.error(`[academy-enrollment:${academyConfig.slug}] invalid site origin`);
    return;
  }
  const loginUrl = new URL("/academy", origin).href;
  const membersUrl = new URL("/academy/members", origin).href;
  const firstName = memberName.trim().split(/\s+/)[0] || "there";
  const welcome: AcademyEmail = {
    to,
    subject: `Welcome to ${academy.name}`,
    text: `Hi ${firstName},\n\nWelcome to ${academy.name}! Your account has been created.\n\n${academy.copy.dashboardMotto}\n\nGet started: ${loginUrl}\nSign in with the email and password you used to enroll, then choose your first ${academyConfig.vocab.module}.\n\nForgot your password? On that same sign-in page, choose "Email me a sign-in link" and enter your registered email.\n\nNeed help, or didn't create this account? Reply to this email.\n\n— ${academy.kicker}`,
    html: `<html lang="en"><body style="margin:0;padding:24px;font-family:Arial,sans-serif;color:#1a1a1a;background:#f5f5f5"><main style="max-width:520px;margin:auto;background:#fff;padding:28px;border-radius:12px">
<p>${escapeHtml(academy.kicker)}</p><h1>Welcome to ${escapeHtml(academy.name)}</h1>
<p>Hi ${escapeHtml(firstName)}, your account has been created.</p><p>${escapeHtml(academy.copy.dashboardMotto)}</p>
<p><a href="${escapeHtml(loginUrl)}" style="display:inline-block;padding:14px 20px;background:#1a1a1a;color:#fff;border-radius:8px">Open ${escapeHtml(academy.name)}</a></p>
<p>Sign in with the email and password you used to enroll, then choose your first ${escapeHtml(academyConfig.vocab.module)}.</p>
<p>Forgot your password? On that same sign-in page, choose <strong>Email me a sign-in link</strong> and enter your registered email.</p>
<p>Need help, or didn't create this account? Reply to this email.</p><p>— ${escapeHtml(academy.kicker)}</p>
</main></body></html>`,
  };
  const notice: AcademyEmail = {
    to: email.replyTo,
    subject: `New enrollment in ${academy.name}`,
    text: `${memberName} just enrolled in ${academy.name}.\n\nName: ${memberName}\nEmail: ${to}\n\nView academy members (sign-in required): ${membersUrl}\n\nThis confirms account creation, not payment or email verification. The member's welcome email is sent separately.`,
    html: `<html lang="en"><body style="font-family:Arial,sans-serif;color:#1a1a1a"><h1>New enrollment in ${escapeHtml(academy.name)}</h1>
<p>${escapeHtml(memberName)} just enrolled.</p><p><strong>Name:</strong> ${escapeHtml(memberName)}<br><strong>Email:</strong> ${escapeHtml(to)}</p>
<p><a href="${escapeHtml(membersUrl)}">View academy members (sign-in required)</a></p>
<p>This confirms account creation, not payment or email verification. The member's welcome email is sent separately.</p></body></html>`,
  };
  await Promise.all(([ ["welcome", welcome], ["business-notice", notice] ] as const).map(async ([kind, mail]) => {
    try {
      const result = await sendAcademyEmail(mail);
      if (!result.ok) console.error(`[academy-enrollment:${academyConfig.slug}] ${kind} not sent`);
    } catch {
      // Do not log provider responses, member addresses, or message bodies.
      console.error(`[academy-enrollment:${academyConfig.slug}] ${kind} delivery failed`);
    }
  }));
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}
