//==============================================================================
// POWER HUB — Budget & Sales API (hub session only)
//==============================================================================
// GET  ?month=YYYY-MM → month setup, estimates, entries, settings, plus every
//      check/transfer (any month) still waiting to show up in the bank
// POST { action, ... }:
//   sync          { force? }                                Stripe catch-up (read-only key)
//   add_entry     { source check|transfer|cash|other, paid_on, line_key,
//                   amount_cents? , hours? (hourly: amount = hours × $500 when
//                   no amount), quantity?, item?, payer?, reference?, note?,
//                   received? }
//   set_line      { id, line_key|null }                     any entry (Stripe too)
//   set_item      { id, item }
//   set_received  { id, received }                          checks / transfers
//   void          { id, reason? }                           hand-entered only; never deleted
//   save_month    { month, note?, goals[{ key, est_count, unit_price_cents }] }
//   set_reminders { on }
// Brett is the only user, so "who did it" is always Brett.
//==============================================================================

import { NextResponse } from 'next/server';
import { requireHubSession } from '@/lib/hub-session';
import { getServiceSupabase } from '@/lib/supabase-admin';
import {
  BUDGET_START, HOURLY_KEY, HOURLY_RATE_CENTS, LINE_BY_KEY, NEEDS_RECEIPT, OWNER, addMonths, denverDate, hoursFor, isDate,
  isMonth, monthOf, parseHours, type Source,
} from '@/lib/budget';
import { ENTRY_COLS, MissingTablesError, T, loadMonth } from '@/lib/budget-db';
import { STRIPE_READ_ENV, stripeReadClient, syncStripe, type SyncResult } from '@/lib/budget-stripe';

export const dynamic = 'force-dynamic';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SYNC_EVERY_MS = 2 * 60 * 1000;
const HAND_SOURCES: Source[] = ['check', 'transfer', 'cash', 'other'];
const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

function text(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim().replace(/\s+/g, ' ');
  return t ? t.slice(0, max) : null;
}
const int = (v: unknown, min: number, max: number) =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max ? v : null;
const lineKey = (v: unknown) => (typeof v === 'string' && LINE_BY_KEY[v] ? v : null);

function failure(e: unknown) {
  if (e instanceof MissingTablesError) {
    return bad('The budget tables are not set up yet (the database step has not been run).', 503);
  }
  console.error('[budget]', e);
  return bad('Something went wrong saving or loading the budget.', 500);
}
function dbError(r: { error: { message: string } | null }) {
  if (!r.error) return;
  throw /does not exist|schema cache/i.test(r.error.message) ? new MissingTablesError(r.error.message) : new Error(r.error.message);
}

export async function GET(request: Request) {
  const denied = await requireHubSession();
  if (denied) return denied;
  try {
    const today = denverDate();
    const q = new URL(request.url).searchParams.get('month');
    const month = isMonth(q) ? q : monthOf(today);
    const db = getServiceSupabase();
    const [m, settings, next, waiting] = await Promise.all([
      loadMonth(db, month),
      db.from(T.settings).select('key, value'),
      db.from(T.months).select('prepared_at').eq('month', addMonths(month, 1)).maybeSingle(),
      db.from(T.entries).select(ENTRY_COLS).in('source', NEEDS_RECEIPT).is('received_at', null).is('voided_at', null).order('paid_on').limit(200),
    ]);
    for (const r of [settings, next, waiting]) dbError(r);
    const setting = (k: string) => settings.data?.find((s) => s.key === k)?.value ?? null;
    return NextResponse.json({
      month, today, ...m,
      awaitingReceipt: waiting.data ?? [],
      nextMonthReady: Boolean(next.data?.prepared_at),
      sync: setting('stripe_sync') as SyncResult | null,
      remindersOn: setting('reminders_on') === true,
      stripeConnected: Boolean(process.env[STRIPE_READ_ENV]),
    });
  } catch (e) {
    return failure(e);
  }
}

export async function POST(request: Request) {
  const denied = await requireHubSession();
  if (denied) return denied;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
    if (!body || typeof body !== 'object') throw new Error();
  } catch {
    return bad('Invalid request.');
  }
  const db = getServiceSupabase();
  const today = denverDate();
  const now = new Date().toISOString();
  const validId = typeof body.id === 'string' && UUID_RE.test(body.id);
  try {
    switch (body.action) {
      case 'sync': {
        const client = stripeReadClient();
        if (!client) return NextResponse.json({ ok: false, connected: false, error: 'Stripe is not connected yet.' });
        if (!body.force) {
          const { data } = await db.from(T.settings).select('value').eq('key', 'stripe_sync').maybeSingle();
          const last = data?.value as SyncResult | undefined;
          if (last?.ok && Date.now() - Date.parse(last.at) < SYNC_EVERY_MS) return NextResponse.json({ ...last, skipped: true, connected: true });
        }
        return NextResponse.json({ ...(await syncStripe(db, client)), connected: true });
      }

      case 'add_entry': {
        const source = HAND_SOURCES.includes(body.source as Source) ? (body.source as Source) : null;
        if (!source) return bad('Choose check, bank transfer, cash or other.');
        if (!isDate(body.paid_on) || body.paid_on > today || body.paid_on < BUDGET_START) return bad('Pick a date from November 1, 2026 to today.');
        const key = lineKey(body.line_key);
        if (!key) return bad('Choose an income line.');
        let hours: number | null = null;
        if (body.hours !== undefined && body.hours !== null && body.hours !== '') {
          hours = parseHours(body.hours);
          if (hours === null) return bad('Hours must be a number like 2 or 1.5.');
          if (key !== HOURLY_KEY) return bad('Hours are only for Hourly Consulting.');
        }
        let amount = body.amount_cents === undefined || body.amount_cents === null ? null : int(body.amount_cents, 1, 100000000);
        if (amount === null && body.amount_cents !== undefined && body.amount_cents !== null) return bad('Enter an amount above $0.');
        if (amount === null && hours !== null) amount = Math.round(hours * HOURLY_RATE_CENTS);
        if (amount === null) return bad('Enter an amount above $0.');
        if (key === HOURLY_KEY && hours === null) hours = hoursFor(amount);
        const quantity = body.quantity === undefined ? 1 : int(body.quantity, 1, 999);
        if (quantity === null) return bad('How many must be 1–999.');
        const received = !NEEDS_RECEIPT.includes(source) || body.received === true;
        const { data, error } = await db.from(T.entries).insert({
          paid_on: body.paid_on, source, amount_cents: amount, quantity, hours, line_key: key, line_set_by: OWNER,
          item: text(body.item, 200), payer: text(body.payer, 120), reference: text(body.reference, 60),
          note: text(body.note, 300), received_at: received ? now : null, entered_by: OWNER,
        }).select(ENTRY_COLS).single();
        if (error) throw new Error(error.message);
        return NextResponse.json({ entry: data });
      }

      case 'set_line': {
        if (!validId) return bad('Unknown entry.');
        const key = body.line_key === null ? null : lineKey(body.line_key);
        if (key === null && body.line_key !== null) return bad('Choose an income line.');
        const { data: cur, error: curErr } = await db.from(T.entries).select('amount_cents, hours').eq('id', body.id).is('voided_at', null).maybeSingle();
        if (curErr) throw new Error(curErr.message);
        if (!cur) return bad('That entry was not found (or was voided).', 404);
        const patch: Record<string, unknown> = { line_key: key, line_set_by: key ? OWNER : null, updated_at: now };
        if (key === HOURLY_KEY && cur.hours === null) patch.hours = Math.abs(hoursFor(cur.amount_cents));
        const { data, error } = await db.from(T.entries).update(patch).eq('id', body.id).is('voided_at', null).select(ENTRY_COLS);
        if (error) throw new Error(error.message);
        if (!data?.length) return bad('That entry was not found (or was voided).', 404);
        return NextResponse.json({ entry: data[0] });
      }

      case 'set_item': {
        if (!validId) return bad('Unknown entry.');
        const { data, error } = await db.from(T.entries).update({ item: text(body.item, 200), updated_at: now })
          .eq('id', body.id).is('voided_at', null).select(ENTRY_COLS);
        if (error) throw new Error(error.message);
        if (!data?.length) return bad('That entry was not found (or was voided).', 404);
        return NextResponse.json({ entry: data[0] });
      }

      case 'set_received': {
        if (!validId) return bad('Unknown entry.');
        if (typeof body.received !== 'boolean') return bad('received must be true or false.');
        const { data, error } = await db.from(T.entries).update({ received_at: body.received ? now : null, updated_at: now })
          .eq('id', body.id).in('source', NEEDS_RECEIPT).is('voided_at', null).select(ENTRY_COLS);
        if (error) throw new Error(error.message);
        if (!data?.length) return bad('Only checks and bank transfers can be marked received.', 409);
        return NextResponse.json({ entry: data[0] });
      }

      case 'void': {
        if (!validId) return bad('Unknown entry.');
        const { data, error } = await db.from(T.entries)
          .update({ voided_at: now, voided_by: OWNER, void_reason: text(body.reason, 200), updated_at: now })
          .eq('id', body.id).in('source', HAND_SOURCES).is('voided_at', null).select(ENTRY_COLS);
        if (error) throw new Error(error.message);
        if (!data?.length) return bad('Only hand-entered payments can be voided (Stripe payments are refunded in Stripe).', 409);
        return NextResponse.json({ entry: data[0] });
      }

      case 'save_month': {
        const month = body.month;
        if (!isMonth(month) || month < monthOf(BUDGET_START)) return bad('Pick November 2026 or later.');
        const goals = Array.isArray(body.goals) ? body.goals : [];
        if (goals.length > 20) return bad('Too many lines.');
        const goalRows = [];
        for (const g of goals as Record<string, unknown>[]) {
          const key = lineKey(g?.key);
          const count = int(g?.est_count, 0, 9999);
          const price = int(g?.unit_price_cents, 0, 100000000);
          if (!key || count === null || price === null) return bad('Each estimate needs a number and a price.');
          if (!LINE_BY_KEY[key].counted) continue;
          goalRows.push({ month, line_key: key, est_count: count, unit_price_cents: price, updated_at: now });
        }
        const { error } = await db.from(T.months).upsert({
          month, note: text(body.note, 300), prepared_by: OWNER, prepared_at: now, updated_at: now,
        }, { onConflict: 'month' });
        if (error) throw new Error(error.message);
        if (goalRows.length) {
          const g = await db.from(T.goals).upsert(goalRows, { onConflict: 'month,line_key' });
          if (g.error) throw new Error(g.error.message);
        }
        return NextResponse.json({ ok: true });
      }

      case 'set_reminders': {
        if (typeof body.on !== 'boolean') return bad('on must be true or false.');
        const { error } = await db.from(T.settings).upsert({ key: 'reminders_on', value: body.on, updated_at: now }, { onConflict: 'key' });
        if (error) throw new Error(error.message);
        return NextResponse.json({ ok: true, on: body.on });
      }

      default:
        return bad('Unknown action.');
    }
  } catch (e) {
    return failure(e);
  }
}
