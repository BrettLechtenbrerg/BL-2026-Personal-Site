//==============================================================================
// BL Power Hub — "set up next month's budget" reminder emails (19th + 20th)
//==============================================================================
// Sent through Resend (same service as the Academy emails) to Brett only. Off
// until Brett turns them on at the bottom of the setup page
// (bl_budget_settings key 'reminders_on'). The 20th email is skipped when next
// month is already set up; bl_budget_reminder_log stops double sends.
//==============================================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import { addMonths, denverDate, money, monthName, monthOf, type MonthSummary } from './budget';
import { T } from './budget-db';

export const DEFAULT_REMINDER_TO = 'brett@brettlechtenberg.com';
const DEFAULT_FROM = 'BL Power Hub <budget@auth.brettlechtenberg.com>';
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.brettlechtenberg.com').replace(/\/$/, '');

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function buildReminder(targetMonth: string, day: 19 | 20, current: MonthSummary | null) {
  const name = monthName(targetMonth, false);
  const url = `${SITE}/hub/budget/setup?month=${targetMonth}`;
  const subject = `Reminder: set up the ${name} budget ${day === 19 ? 'tomorrow (the 20th)' : 'today (the 20th)'}`;
  const lead = day === 19
    ? `Hi Brett, tomorrow is the 20th, the day to set up next month's budget.`
    : `Hi Brett, today is the 20th, the day to set up next month's budget.`;
  const steps = `It takes about 5 minutes in the Power Hub: your estimate for each line as how many × price (e.g. 4 coaching clients × $2,000 = $8,000, or 10 hours × $500 = $5,000).`;
  const so = current
    ? `This month so far (${monthName(current.month, false)}): ${money(current.actualCents)} of ${money(current.goalCents)}` +
      current.clients.map((c) => ` · ${c.label.toLowerCase()} ${c.actual} of ${c.est}`).join('') + '.'
    : '';
  const text = `${lead}\n\n${steps}\n\nSet up ${name}: ${url}\n\n${so}\n\n— BL Power Hub`;
  const html =
    `<!doctype html><html><body style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1a1a1a;line-height:1.5">` +
    `<p>${esc(lead)}</p><p>${esc(steps)}</p>` +
    `<p><a href="${esc(url)}" style="display:inline-block;background:#9B1B30;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:700">Set up ${esc(name)} →</a></p>` +
    (so ? `<p style="color:#555">${esc(so)}</p>` : '') +
    `<p style="color:#888;font-size:13px">BL Power Hub · brettlechtenberg.com</p></body></html>`;
  return { subject, text, html, url };
}

export async function sendBudgetEmail(msg: { subject: string; text: string; html: string }): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: 'RESEND_API_KEY not set' };
  const to = (process.env.BUDGET_REMINDER_TO || DEFAULT_REMINDER_TO).split(',').map((s) => s.trim()).filter(Boolean);
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: AbortSignal.timeout(10_000),
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.BUDGET_EMAIL_FROM || DEFAULT_FROM, to, subject: msg.subject, text: msg.text, html: msg.html }),
    });
    if (!res.ok) return { ok: false, error: `resend ${res.status}: ${(await res.text()).slice(0, 200)}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'send failed' };
  }
}

/** Which reminder (if any) is due today, Denver time. */
export function reminderDue(today: string): { targetMonth: string; day: 19 | 20 } | null {
  const d = Number(today.slice(8, 10));
  if (d !== 19 && d !== 20) return null;
  return { targetMonth: addMonths(monthOf(today), 1), day: d as 19 | 20 };
}

export async function runReminder(db: SupabaseClient, current: MonthSummary | null, now = new Date()): Promise<{ status: string }> {
  const due = reminderDue(denverDate(now));
  if (!due) return { status: 'not a reminder day' };
  const { data: setting } = await db.from(T.settings).select('value').eq('key', 'reminders_on').maybeSingle();
  if (setting?.value !== true) return { status: 'reminders are off' };
  if (due.day === 20) {
    const { data: m } = await db.from(T.months).select('prepared_at').eq('month', due.targetMonth).maybeSingle();
    if (m?.prepared_at) return { status: `${due.targetMonth} already set up; 20th reminder skipped` };
  }
  // Claim first so a second cron run the same day can't send twice.
  const { data: claimed, error } = await db.from(T.reminders)
    .upsert({ target_month: due.targetMonth, reminder_day: due.day }, { onConflict: 'target_month,reminder_day', ignoreDuplicates: true })
    .select('target_month');
  if (error) return { status: `log error: ${error.message}` };
  if (!claimed?.length) return { status: 'already sent' };
  const sent = await sendBudgetEmail(buildReminder(due.targetMonth, due.day, current));
  if (!sent.ok) {
    // Release the claim so tomorrow's run (or a manual re-run) can try again.
    await db.from(T.reminders).delete().eq('target_month', due.targetMonth).eq('reminder_day', due.day);
    return { status: `send failed: ${sent.error}` };
  }
  return { status: `sent ${due.day}th reminder for ${due.targetMonth}` };
}
