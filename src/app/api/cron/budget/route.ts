//==============================================================================
// CRON — BL Power Hub Budget daily job (Vercel Cron, 14:00 UTC; vercel.json)
//==============================================================================
// 1. Stripe catch-up (read-only key), so yesterday's payments are filed even
//    if Brett didn't open the Budget page.
// 2. On the 19th and 20th: "set up next month's budget" reminder email to
//    Brett (only when turned on in the Power Hub; see lib/budget-email.ts).
// Auth: `Authorization: [REDACTED] (Vercel Cron sends it). Unlike
// keepalive, this one fails closed (503) when CRON_SECRET is missing.
//==============================================================================

import { NextResponse } from 'next/server';
import { timingSafeStringEqual } from '@/lib/hub-session';
import { getServiceSupabase } from '@/lib/supabase-admin';
import { denverDate, monthOf } from '@/lib/budget';
import { monthSummary } from '@/lib/budget-db';
import { stripeReadClient, syncStripe } from '@/lib/budget-stripe';
import { runReminder } from '@/lib/budget-email';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: 'CRON_SECRET not configured.' }, { status: 503 });
  if (!timingSafeStringEqual(request.headers.get('authorization') || '', `Bearer ${secret}`)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  const db = getServiceSupabase();
  const out: Record<string, unknown> = {};
  const client = stripeReadClient();
  if (client) {
    const r = await syncStripe(db, client);
    out.stripe = { ok: r.ok, fetched: r.fetched, inserted: r.inserted, error: r.error, warnings: r.warnings };
  } else {
    out.stripe = 'not connected';
  }
  try {
    const today = denverDate();
    const { summary } = await monthSummary(db, monthOf(today), today);
    out.reminder = (await runReminder(db, summary)).status;
  } catch (e) {
    out.reminder = `error: ${e instanceof Error ? e.message : 'unknown'}`;
  }
  console.log('[cron/budget]', JSON.stringify(out));
  return NextResponse.json(out);
}
