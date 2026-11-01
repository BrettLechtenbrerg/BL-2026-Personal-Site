// BL Power Hub Budget — end-to-end test against a LOCAL `next dev` server.
//   node --experimental-strip-types scripts/budget-e2e.ts            full run, cleans up after itself
//   node --experimental-strip-types scripts/budget-e2e.ts --cleanup  remove leftovers of a failed run
//   node --experimental-strip-types scripts/budget-e2e.ts --demo     screenshot data for this month (then --cleanup)
// Uses the real Supabase from .env.local (shared project). Writes ONLY rows marked
// note = 'E2E TEST' (plus the far-future test month 2099-12) and deletes exactly
// those at the end, showing the count first. Never writes to Stripe, never sends email.
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { summarizeMonth } from '../src/lib/budget.ts';

for (const raw of fs.readFileSync('.env.local', 'utf8').split('\n')) {
  const line = raw.trim(); const eq = line.indexOf('=');
  if (!line || line.startsWith('#') || eq === -1) continue;
  const k = line.slice(0, eq).trim();
  if (!(k in process.env)) process.env[k] = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
}

const BASE = process.env.BUDGET_BASE || 'http://localhost:3123';
const NOTE = 'E2E TEST';
const TEST_MONTH = '2099-12';
let failures = 0;
const check = (ok: boolean, what: string) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${what}`); if (!ok) failures++; };

async function main() {
  if (!/^http:\/\/(localhost|127\.0\.0\.1)/.test(BASE)) throw new Error('Run against a local dev server only.');
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
  const cleanup = async () => {
    const e = await db.from('bl_budget_entries').select('id', { count: 'exact', head: true }).eq('note', NOTE).neq('source', 'stripe');
    const g = await db.from('bl_budget_goals').select('line_key', { count: 'exact', head: true }).eq('month', TEST_MONTH);
    const dmo = await db.from('bl_budget_months').select('month').eq('note', NOTE).neq('month', TEST_MONTH);
    console.log(`cleanup: ${e.count ?? 0} test payments, ${g.count ?? 0} test estimates, month ${TEST_MONTH}${dmo.data?.length ? `, demo set-up of ${dmo.data.map((r) => r.month).join(', ')} (+ its estimates)` : ''}`);
    const de = await db.from('bl_budget_entries').delete().eq('note', NOTE).neq('source', 'stripe').select('id');
    const dg = await db.from('bl_budget_goals').delete().eq('month', TEST_MONTH).select('line_key');
    const dm = await db.from('bl_budget_months').delete().eq('month', TEST_MONTH).select('month');
    // --demo may have set up the current month; only remove it if it still carries the test note.
    const demo = await db.from('bl_budget_months').select('month').eq('note', NOTE).neq('month', TEST_MONTH);
    if (demo.error) throw new Error(demo.error.message);
    let demoRows = 0;
    for (const { month } of demo.data ?? []) {
      const g = await db.from('bl_budget_goals').delete().eq('month', month).select('line_key');
      const m = await db.from('bl_budget_months').delete().eq('month', month).eq('note', NOTE).select('month');
      if (g.error || m.error) throw new Error((g.error ?? m.error)!.message);
      demoRows += (g.data?.length ?? 0) + (m.data?.length ?? 0);
    }
    for (const r of [de, dg, dm]) if (r.error) throw new Error(r.error.message);
    return (de.data?.length ?? 0) + (dg.data?.length ?? 0) + (dm.data?.length ?? 0) + demoRows;
  };
  if (process.argv.includes('--cleanup')) { console.log(`removed ${await cleanup()} rows`); return; }

  const login = await fetch(`${BASE}/api/hub/auth`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: process.env.HUB_USERNAME || 'bladmin', password: process.env.HUB_PASSWORD || 'bl-dev-2026' }) });
  const cookie = (login.headers.get('set-cookie') || '').split(';')[0];
  check(login.status === 200 && cookie.startsWith('bl_hub_session='), 'logged in to the local hub');
  const headers = { 'Content-Type': 'application/json', Cookie: cookie };
  const get = async (month = '') => { const r = await fetch(`${BASE}/api/hub/budget?month=${month}`, { headers }); return { status: r.status, data: await r.json() }; };
  const post = async (body: Record<string, unknown>) => {
    const r = await fetch(`${BASE}/api/hub/budget`, { method: 'POST', headers, body: JSON.stringify(body) });
    return { status: r.status, data: await r.json() };
  };

  if (process.argv.includes('--demo')) {
    // Screenshot data for the current month, all marked E2E TEST; remove with --cleanup.
    const { data: g } = await get();
    const m = g.month as string, t = g.today as string;
    if (g.config && g.config.note !== NOTE) throw new Error(`${m} is already set up for real; not touching it.`);
    const d = (n: number) => `${m}-${String(Math.min(n, Number(t.slice(8)))).padStart(2, '0')}`;
    await post({ action: 'save_month', month: m, note: NOTE, goals: [
      { key: 'group_coaching', est_count: 8, unit_price_cents: 50000 }, { key: 'individual_coaching', est_count: 4, unit_price_cents: 200000 },
      { key: 'company_consulting', est_count: 1, unit_price_cents: 500000 }, { key: 'hourly_consulting', est_count: 10, unit_price_cents: 50000 },
      { key: 'other_income', est_count: 10, unit_price_cents: 2500 },
    ] });
    for (const e of [
      { source: 'check', paid_on: d(1), amount_cents: 500000, line_key: 'company_consulting', payer: 'Acme Co (demo)', reference: '1042' },
      { source: 'transfer', paid_on: d(1), amount_cents: 200000, line_key: 'individual_coaching', payer: 'Jane Demo', received: true },
      { source: 'other', paid_on: d(1), hours: '2', line_key: 'hourly_consulting', payer: 'Demo LLC' },
      { source: 'cash', paid_on: d(1), amount_cents: 2500, line_key: 'other_income', item: 'Book' },
    ]) check((await post({ action: 'add_entry', note: NOTE, ...e })).status === 200, `demo ${e.source} saved`);
    return;
  }

  check((await fetch(`${BASE}/api/hub/budget`)).status === 401, 'API refuses requests without a login');
  const g0 = await get();
  check(g0.status === 200, `GET works (${g0.status} ${g0.data.error ?? ''})`);
  if (g0.status !== 200) throw new Error(g0.data.error);
  const today = g0.data.today as string;
  const month = g0.data.month as string;

  // Monthly setup (far-future test month)
  check((await post({ action: 'save_month', month: TEST_MONTH, goals: [{ key: 'nope', est_count: 1, unit_price_cents: 1 }] })).status === 400, 'unknown line in setup refused');
  const sm = await post({ action: 'save_month', month: TEST_MONTH, note: NOTE, goals: [
    { key: 'individual_coaching', est_count: 4, unit_price_cents: 200000 },
    { key: 'hourly_consulting', est_count: 10, unit_price_cents: 50000 },
    { key: 'not_counted', est_count: 5, unit_price_cents: 100 },
  ] });
  check(sm.status === 200, `month saved (${sm.data.error ?? 'ok'})`);
  const g1 = await get(TEST_MONTH);
  const goals = g1.data.goals as { line_key: string; est_count: number; unit_price_cents: number }[];
  check(goals.length === 2 && goals.some((x) => x.line_key === 'individual_coaching' && x.est_count === 4 && x.unit_price_cents === 200000), 'estimates read back (4 × $2,000; "not counted" never gets a goal)');

  // Bad entries
  const bad = async (body: Record<string, unknown>, what: string) => check((await post({ action: 'add_entry', note: NOTE, ...body })).status === 400, what);
  await bad({ source: 'check', paid_on: '2099-01-01', amount_cents: 100, line_key: 'other_income' }, 'future date refused');
  await bad({ source: 'check', paid_on: '2026-10-31', amount_cents: 100, line_key: 'other_income' }, 'date before Nov 1 2026 refused');
  await bad({ source: 'stripe', paid_on: today, amount_cents: 100, line_key: 'other_income' }, 'hand-entered Stripe rows refused');
  await bad({ source: 'check', paid_on: today, amount_cents: 100, line_key: 'nope' }, 'unknown income line refused');
  await bad({ source: 'check', paid_on: today, hours: 2, line_key: 'company_consulting' }, 'hours on a non-hourly line refused');
  await bad({ source: 'check', paid_on: today, amount_cents: -5, line_key: 'other_income' }, 'negative amount refused');

  // Good entries: a check, a bank transfer, 2 hours of hourly consulting
  const chk = await post({ action: 'add_entry', note: NOTE, source: 'check', paid_on: today, amount_cents: 500000, line_key: 'company_consulting', reference: '1234', payer: 'E2E Co' });
  check(chk.status === 200 && chk.data.entry?.reference === '1234' && chk.data.entry.received_at === null, 'check $5,000 Company Consulting saved, waiting for the bank');
  const tr = await post({ action: 'add_entry', note: NOTE, source: 'transfer', paid_on: today, amount_cents: 300000, line_key: 'individual_coaching', received: true });
  check(tr.status === 200 && Boolean(tr.data.entry?.received_at), 'bank transfer $3,000 Individual Coaching saved as received');
  const hr = await post({ action: 'add_entry', note: NOTE, source: 'other', paid_on: today, hours: '2', line_key: 'hourly_consulting' });
  check(hr.status === 200 && hr.data.entry?.amount_cents === 100000 && Number(hr.data.entry.hours) === 2, '2 hours of hourly consulting = $1,000');

  const g2 = await get(month);
  check((g2.data.awaitingReceipt as { id: string }[]).some((e) => e.id === chk.data.entry.id), 'the check shows under "not in the bank yet"');
  const s = summarizeMonth({ month, today, goals: g2.data.goals, entries: g2.data.entries });
  const line = (k: string) => s.lines.find((l) => l.key === k)!;
  check(line('company_consulting').actualCents >= 500000 && line('hourly_consulting').actualCount >= 2, 'totals include the new payments (Company Consulting, 2 hours)');

  // Fix a line, mark received, void
  const sl = await post({ action: 'set_line', id: tr.data.entry.id, line_key: 'group_coaching' });
  check(sl.status === 200 && sl.data.entry.line_key === 'group_coaching', 'income line changed');
  const rc = await post({ action: 'set_received', id: chk.data.entry.id, received: true });
  check(rc.status === 200 && Boolean(rc.data.entry.received_at), 'check marked "in the bank"');
  check((await post({ action: 'set_received', id: hr.data.entry.id, received: true })).status === 409, 'only checks and transfers can be marked received');
  const v = await post({ action: 'void', id: hr.data.entry.id, reason: NOTE });
  check(v.status === 200 && Boolean(v.data.entry.voided_at), 'hourly payment voided (kept on record)');
  check((await post({ action: 'void', id: hr.data.entry.id })).status === 409, 'cannot void twice');
  const g3 = await get(month);
  const s3 = summarizeMonth({ month, today, goals: g3.data.goals, entries: g3.data.entries });
  check(s3.lines.find((l) => l.key === 'hourly_consulting')!.actualCents === s.lines.find((l) => l.key === 'hourly_consulting')!.actualCents - 100000, 'voided payment no longer counts');

  check(typeof g3.data.remindersOn === 'boolean', `reminder setting readable (currently ${g3.data.remindersOn ? 'ON' : 'OFF'})`);
  const sync = await post({ action: 'sync' });
  check(sync.status === 200, `Stripe check answers (${sync.data.connected ? `connected, ok=${sync.data.ok}` : 'not connected'})`);

  const removed = await cleanup();
  check(removed === 3 + 2 + 1, `test rows removed (${removed})`);
  console.log(failures ? `\n${failures} FAILED` : '\nALL PASSED');
  process.exitCode = failures ? 1 : 0;
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exitCode = 1; });
