//==============================================================================
// BL Power Hub — Budget Stripe catch-up (read-only)
//==============================================================================
// Pulls card payments and refunds from Brett's BL Stripe account into
// bl_budget_entries. Uses a RESTRICTED, READ-ONLY key (BL_STRIPE_READ_KEY):
// it can't charge, refund or change anything in Stripe. The full Academy key
// (STRIPE_SECRET_KEY) is never used here. Runs when the Budget page opens (at
// most every few minutes) and once a day from the cron. Idempotent: stripe_id
// is UNIQUE and inserts skip rows already there, so a line Brett picked is
// never overwritten. Ported from PMMA's lib/budget-stripe.ts + invoice lines.
//==============================================================================

import Stripe from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';
import { BUDGET_START, HOURLY_KEY, denverDate, hoursFor, matchLine } from './budget';
import { T } from './budget-db';

export const STRIPE_READ_ENV = 'BL_STRIPE_READ_KEY';
const LOOKBACK_MS = 3 * 86400000;
const MAX_ROWS = 2000;
// Midnight Nov 1 2026 in Denver (still MDT, UTC-6).
const START_MS = Date.parse(`${BUDGET_START}T06:00:00Z`);

export function stripeReadClient(): Stripe | null {
  const key = process.env[STRIPE_READ_ENV];
  if (!key) return null;
  return new Stripe(key, { maxNetworkRetries: 2, timeout: 20000 });
}

type Row = {
  paid_on: string; source: 'stripe'; amount_cents: number; quantity: number; hours: number | null;
  line_key: string | null; line_set_by: string | null; item: string | null;
  payer: string | null; stripe_id: string; stripe_charge_id: string;
  stripe_description: string | null; stripe_created_at: string; entered_by: string;
};

export interface SyncResult { ok: boolean; fetched: number; inserted: number; warnings: string[]; error?: string; at: string }

const cut = (s: string | null | undefined, n: number) => (s ? s.slice(0, n) : null);
const isPermission = (e: unknown) =>
  e instanceof Error && /permission|does not have access|restricted/i.test(e.message);

async function collect<X>(list: AsyncIterable<X>): Promise<X[]> {
  const out: X[] = [];
  for await (const x of list) { out.push(x); if (out.length >= MAX_ROWS) break; }
  return out;
}

/** Charges (with the expansions the key allows). */
async function listCharges(client: Stripe, gte: number, warnings: string[]): Promise<Stripe.Charge[]> {
  const tries: string[][] = [['data.customer', 'data.payment_intent'], ['data.payment_intent'], []];
  for (const expand of tries) {
    try {
      return await collect(client.charges.list({ created: { gte }, limit: 100, ...(expand.length ? { expand } : {}) }));
    } catch (e) {
      if (!isPermission(e) || !expand.length) throw e;
      warnings.push(`Stripe key can't read ${expand.join(' + ')}; continuing without it.`);
    }
  }
  return [];
}

type Product = { names: string; qty: number };
const describe = (items: { description?: string | null; quantity?: number | null }[]): Product => ({
  names: items.map((i) => `${i.description ?? 'item'}${(i.quantity ?? 1) > 1 ? ` × ${i.quantity}` : ''}`).join(', '),
  qty: items.reduce((n, i) => n + (i.quantity ?? 1), 0) || 1,
});

/** Payment Link / Checkout purchases and invoices: product names tell us what was bought. */
async function productNames(client: Stripe, charges: Stripe.Charge[], gte: number, warnings: string[]) {
  const products = new Map<string, Product>();
  const pending = charges.filter((c) => !matchLine(chargeDescription(c)).key && c.payment_intent);
  if (!pending.length) return products;
  try {
    const sessions = await collect(client.checkout.sessions.list({ created: { gte: gte - 86400 }, status: 'complete', limit: 100 }));
    const byPi = new Map(sessions.filter((s) => s.payment_intent).map((s) => [piId(s.payment_intent), s]));
    for (const c of pending) {
      const s = byPi.get(piId(c.payment_intent));
      if (s) products.set(c.id, describe(await collect(client.checkout.sessions.listLineItems(s.id, { limit: 20 }))));
    }
  } catch (e) {
    if (!isPermission(e)) throw e;
    warnings.push("Stripe key can't read Checkout Sessions; online purchases may need a category.");
  }
  const left = pending.filter((c) => !products.has(c.id));
  if (!left.length) return products;
  try {
    const payments = await collect(client.invoicePayments.list({ status: 'paid', created: { gte: gte - 30 * 86400 }, limit: 100 }));
    const byPi = new Map(payments.filter((p) => p.payment?.payment_intent).map((p) => [piId(p.payment.payment_intent ?? null), p]));
    for (const c of left) {
      const p = byPi.get(piId(c.payment_intent));
      const invoiceId = typeof p?.invoice === 'string' ? p.invoice : p?.invoice?.id;
      if (invoiceId) products.set(c.id, describe(await collect(client.invoices.listLineItems(invoiceId, { limit: 20 }))));
    }
  } catch (e) {
    if (!isPermission(e)) throw e;
    warnings.push("Stripe key can't read Invoices; invoice payments may need a category.");
  }
  return products;
}

export async function syncStripe(db: SupabaseClient, client: Stripe, now = new Date()): Promise<SyncResult> {
  const warnings: string[] = [];
  const at = now.toISOString();
  try {
    const { data: last, error: lastErr } = await db.from(T.entries).select('stripe_created_at')
      .eq('source', 'stripe').order('stripe_created_at', { ascending: false }).limit(1);
    if (lastErr) throw new Error(lastErr.message);
    const lastMs = last?.[0]?.stripe_created_at ? Date.parse(last[0].stripe_created_at) - LOOKBACK_MS : START_MS;
    const gte = Math.floor(Math.max(START_MS, lastMs) / 1000);

    const charges = (await listCharges(client, gte, warnings)).filter(
      (c) => c.status === 'succeeded' && c.paid && c.currency === 'usd'
    );
    const products = await productNames(client, charges, gte, warnings);

    const rows: Row[] = charges.map((c) => {
      const description = chargeDescription(c);
      let { key, item } = matchLine(description);
      let quantity = 1;
      const p = products.get(c.id);
      if (!key && p) {
        key = matchLine(p.names).key;
        item = p.names;
        quantity = Math.min(999, p.qty);
      }
      const customer = typeof c.customer === 'object' && c.customer && !('deleted' in c.customer && c.customer.deleted)
        ? (c.customer as Stripe.Customer).name : null;
      return {
        paid_on: denverDate(new Date(c.created * 1000)), source: 'stripe', amount_cents: c.amount, quantity,
        hours: key === HOURLY_KEY ? hoursFor(c.amount) : null,
        line_key: key, line_set_by: key ? 'auto' : null, item: cut(item, 200),
        payer: cut(c.billing_details?.name || customer || null, 120), stripe_id: c.id, stripe_charge_id: c.id,
        stripe_description: cut(description ?? p?.names, 500), stripe_created_at: new Date(c.created * 1000).toISOString(),
        entered_by: 'Stripe',
      };
    });

    let refunds: Stripe.Refund[] = [];
    try {
      refunds = (await collect(client.refunds.list({ created: { gte }, limit: 100 }))).filter(
        (r) => r.status === 'succeeded' && r.currency === 'usd' && r.amount > 0
      );
    } catch (e) {
      if (!isPermission(e)) throw e;
      warnings.push("Stripe key can't read refunds; refunds won't show.");
    }
    if (refunds.length) {
      const chargeIds = refunds.map((r) => (typeof r.charge === 'string' ? r.charge : r.charge?.id)).filter(Boolean) as string[];
      const { data: originals, error: oErr } = await db.from(T.entries).select('stripe_id, line_key, payer').in('stripe_id', chargeIds);
      if (oErr) throw new Error(oErr.message);
      const orig = new Map((originals ?? []).map((o) => [o.stripe_id, o]));
      for (const r of refunds) {
        const chargeId = (typeof r.charge === 'string' ? r.charge : r.charge?.id) ?? '';
        const o = orig.get(chargeId) ?? rows.find((x) => x.stripe_id === chargeId);
        const key = o?.line_key ?? null;
        rows.push({
          paid_on: denverDate(new Date(r.created * 1000)), source: 'stripe', amount_cents: -r.amount, quantity: 1,
          hours: key === HOURLY_KEY ? hoursFor(r.amount) : null,
          line_key: key, line_set_by: key ? 'auto' : null,
          item: 'Refund', payer: o?.payer ?? null, stripe_id: r.id, stripe_charge_id: chargeId,
          stripe_description: cut(r.reason ? `Refund (${r.reason})` : 'Refund', 500),
          stripe_created_at: new Date(r.created * 1000).toISOString(), entered_by: 'Stripe',
        });
      }
    }

    let inserted = 0;
    for (let i = 0; i < rows.length; i += 200) {
      const { data, error } = await db.from(T.entries)
        .upsert(rows.slice(i, i + 200), { onConflict: 'stripe_id', ignoreDuplicates: true })
        .select('id');
      if (error) throw new Error(error.message);
      inserted += data?.length ?? 0;
    }
    const result: SyncResult = { ok: true, fetched: charges.length + refunds.length, inserted, warnings, at };
    await saveSyncStatus(db, result);
    return result;
  } catch (e) {
    const result: SyncResult = { ok: false, fetched: 0, inserted: 0, warnings, error: e instanceof Error ? e.message.slice(0, 300) : 'Stripe sync failed', at };
    await saveSyncStatus(db, result).catch(() => {});
    return result;
  }
}

function piId(pi: string | Stripe.PaymentIntent | null | undefined): string {
  return typeof pi === 'string' ? pi : pi?.id ?? '';
}

function chargeDescription(c: Stripe.Charge): string | null {
  if (c.description) return c.description;
  const pi = c.payment_intent;
  return typeof pi === 'object' && pi ? pi.description : null;
}

async function saveSyncStatus(db: SupabaseClient, result: SyncResult) {
  await db.from(T.settings).upsert({ key: 'stripe_sync', value: result, updated_at: result.at }, { onConflict: 'key' });
}
