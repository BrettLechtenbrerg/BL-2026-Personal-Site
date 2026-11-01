// Unit tests for src/lib/budget.ts:  node --test --experimental-strip-types scripts/budget-unit-test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  matchLine, hoursFor, entryHours, summarizeMonth, parseDollars, parseHours, addMonths, splitDescription, runningTotals,
  daysInMonth, paceStatus, type EntryRow,
} from '../src/lib/budget.ts';

test('the planned words find the right line', () => {
  const cases: [string, string | null][] = [
    ['Group', 'group_coaching'], ['Cohort', 'group_coaching'], ['Group Coaching', 'group_coaching'],
    ['Coaching', 'individual_coaching'], ['Individual', 'individual_coaching'], ['Personal Coaching', 'individual_coaching'],
    ['1:1', 'individual_coaching'], ['Business Coaching', 'individual_coaching'], ['Peak Performance Coaching', 'individual_coaching'],
    ['Consulting', 'company_consulting'], ['Company', 'company_consulting'], ['Retainer', 'company_consulting'],
    ['Advisory', 'company_consulting'], ['AI Advisory', 'company_consulting'],
    ['Hourly', 'hourly_consulting'], ['Hour', 'hourly_consulting'], ['Hours', 'hourly_consulting'], ['Hourly Consulting', 'hourly_consulting'],
    ['Color Belt', 'not_counted'], ['Pre Test', 'not_counted'], ['ABC', 'not_counted'], ['CHS Reunion', 'not_counted'],
    ['Book', 'other_income'], ['Business Mastery', 'other_income'], ['Academy', 'other_income'],
    ['', null], ['xyz', null], ['Payment', null],
  ];
  for (const [text, key] of cases) assert.equal(matchLine(text).key, key, text);
});

test('typos and capitals are forgiven', () => {
  assert.equal(matchLine('group coachng').key, 'group_coaching');
  assert.equal(matchLine('COACHING').key, 'individual_coaching');
  assert.equal(matchLine('Consultng').key, 'company_consulting');
  assert.equal(matchLine('Retaner').key, 'company_consulting');
  assert.equal(matchLine('Peak Perfomance Coaching').key, 'individual_coaching');
});

test('real BL Stripe names (last 13 months) and Payment Link products', () => {
  assert.equal(matchLine('Business Coaching').key, 'individual_coaching');
  assert.equal(matchLine('Color Belt Promotion').key, 'not_counted');
  assert.equal(matchLine('Black Belt Pre Test').key, 'not_counted');
  assert.equal(matchLine('CHS Reunion Ticket - Class of 1986').key, 'not_counted');
  assert.equal(matchLine("The Master's Edge Academy — Module 1").key, 'other_income');
  assert.equal(matchLine('Business Mastery Course').key, 'other_income');
  assert.equal(matchLine('Peak Performance Coaching - 3 months').key, 'individual_coaching');
  assert.equal(matchLine('Group Coaching Program (January cohort)').key, 'group_coaching');
});

test('consulting that mentions hours is hourly; "line - item" keeps the item', () => {
  assert.deepEqual(matchLine('Consulting - 2 hours'), { key: 'hourly_consulting', item: '2 hours' });
  assert.equal(matchLine('3 hours consulting').key, 'hourly_consulting');
  assert.deepEqual(matchLine('Retainer - Acme Co'), { key: 'company_consulting', item: 'Acme Co' });
  assert.deepEqual(splitDescription('Coaching: Jane Smith'), { head: 'Coaching', item: 'Jane Smith' });
  assert.equal(matchLine('1:1 with Sam').key, 'individual_coaching');
});

test('hours = amount ÷ $500', () => {
  assert.equal(hoursFor(100000), 2);
  assert.equal(hoursFor(75000), 1.5);
  assert.equal(hoursFor(12500), 0.25);
  assert.equal(hoursFor(-50000), -1);
  assert.equal(parseHours('1.5'), 1.5);
  assert.equal(parseHours('0'), null);
  assert.equal(parseHours('abc'), null);
  assert.equal(parseHours('2.555'), null);
});

const base = {
  quantity: 1, hours: null, line_set_by: null, item: null, payer: null, reference: null, note: null, received_at: null,
  stripe_id: null, stripe_description: null, stripe_created_at: null, entered_by: 'Brett',
  created_at: '2026-11-02T20:00:00Z', updated_at: '2026-11-02T20:00:00Z', voided_at: null, voided_by: null, void_reason: null,
};

test('month summary: calendar pace, goals, counts, refunds, voids, not counted, unfiled', () => {
  const entries: EntryRow[] = [
    { ...base, id: 'a', paid_on: '2026-11-02', source: 'check', amount_cents: 500000, line_key: 'company_consulting' },
    { ...base, id: 'b', paid_on: '2026-11-03', source: 'stripe', stripe_id: 'ch_test123', amount_cents: 200000, line_key: 'individual_coaching', received_at: null },
    { ...base, id: 'c', paid_on: '2026-11-05', source: 'transfer', amount_cents: 100000, line_key: 'hourly_consulting', hours: '2.00', received_at: '2026-11-06T15:00:00Z' },
    { ...base, id: 'd', paid_on: '2026-11-05', source: 'cash', amount_cents: 9999, line_key: 'other_income', voided_at: '2026-11-05T22:00:00Z', voided_by: 'Brett' },
    { ...base, id: 'e', paid_on: '2026-11-06', source: 'stripe', stripe_id: 'ch_test456', amount_cents: 2900, line_key: null },
    { ...base, id: 'f', paid_on: '2026-11-06', source: 'stripe', stripe_id: 'ch_test789', amount_cents: 8400, line_key: 'not_counted' },
    { ...base, id: 'g', paid_on: '2026-11-07', source: 'stripe', stripe_id: 're_test111', amount_cents: -50000, line_key: 'individual_coaching' },
    { ...base, id: 'h', paid_on: '2026-11-08', source: 'stripe', stripe_id: 'ch_test222', amount_cents: 75000, line_key: 'hourly_consulting' },
    { ...base, id: 'i', paid_on: '2026-10-31', source: 'cash', amount_cents: 1000, line_key: 'other_income' }, // other month
  ];
  const s = summarizeMonth({
    month: '2026-11', today: '2026-11-10', entries,
    goals: [
      { line_key: 'company_consulting', est_count: 2, unit_price_cents: 500000 },
      { line_key: 'hourly_consulting', est_count: 6, unit_price_cents: 50000 },
      { line_key: 'not_counted', est_count: 5, unit_price_cents: 10000 }, // never a goal
    ],
  });
  assert.equal(s.days.length, 30);
  assert.equal(s.elapsed, 10);
  assert.equal(s.goalCents, 1000000 + 300000);
  assert.equal(s.dailyTargetCents, 1300000 / 30);
  assert.equal(s.paceCents, (1300000 * 10) / 30);
  assert.equal(s.actualCents, 500000 + 200000 + 100000 - 50000 + 75000); // void, unfiled, not counted left out
  assert.equal(s.notCountedCents, 8400);
  assert.equal(s.unfiledCents, 2900);
  const hourly = s.lines.find((l) => l.key === 'hourly_consulting')!;
  assert.equal(hourly.actualCount, 3.5); // 2 stored + 1.5 worked out from $750
  assert.equal(s.lines.find((l) => l.key === 'individual_coaching')!.actualCount, 1); // refund isn't a client
  assert.equal(s.lines.find((l) => l.key === 'individual_coaching')!.actualCents, 150000);
  assert.deepEqual(s.clients.map((c) => [c.key, c.actual, c.est]), [
    ['group_coaching', 0, 0], ['individual_coaching', 1, 0], ['company_consulting', 1, 2], ['hourly_consulting', 3.5, 6],
  ]);
  assert.deepEqual(s.uncategorized.map((e) => e.id), ['e']);
  assert.deepEqual(s.awaitingReceipt.map((e) => e.id), ['a']); // check not yet in the bank; transfer received
  const d5 = s.dayRows.find((d) => d.date === '2026-11-05')!;
  assert.equal(d5.salesCents, 100000);
  assert.equal(d5.bySource.transfer, 100000);
  assert.equal(s.dayRows.find((d) => d.date === '2026-11-06')!.salesCents, 0);
  assert.equal(s.dayRows.find((d) => d.date === '2026-11-06')!.uncategorized, 1);
  assert.equal(s.weeks[0].label, '2026-10-26'); // Nov 1 2026 is a Sunday
  assert.equal(s.weeks[0].days.length, 1);
  assert.equal(s.weeks.reduce((n, w) => n + w.days.length, 0), 30);
});

test('entry hours: stored, worked out, refunds negative', () => {
  assert.equal(entryHours({ ...base, id: 'x', paid_on: '2026-11-01', source: 'check', amount_cents: 100000, line_key: 'hourly_consulting' }), 2);
  assert.equal(entryHours({ ...base, id: 'x', paid_on: '2026-11-01', source: 'check', amount_cents: 100000, line_key: 'company_consulting' }), 0);
  assert.equal(entryHours({ ...base, id: 'x', paid_on: '2026-11-01', source: 'stripe', amount_cents: -50000, hours: 1, line_key: 'hourly_consulting' }), -1);
});

test('running total: date then time order, voids and not-counted left out, refunds subtract, unfiled shown but not added', () => {
  const rows = runningTotals([
    { ...base, id: 'b', paid_on: '2026-11-03', source: 'check', amount_cents: 300000, line_key: 'company_consulting', created_at: '2026-11-03T18:00:00Z' },
    { ...base, id: 'a', paid_on: '2026-11-02', source: 'stripe', stripe_id: 'ch_a', amount_cents: 200000, line_key: 'individual_coaching', created_at: '2026-11-04T05:00:00Z', stripe_created_at: '2026-11-02T23:00:00Z' },
    { ...base, id: 'v', paid_on: '2026-11-03', source: 'cash', amount_cents: 9999, line_key: 'other_income', voided_at: '2026-11-03T00:40:00Z', voided_by: 'Brett' },
    { ...base, id: 'n', paid_on: '2026-11-03', source: 'stripe', stripe_id: 'ch_n', amount_cents: 8400, line_key: 'not_counted', stripe_created_at: '2026-11-03T19:00:00Z' },
    { ...base, id: 'u', paid_on: '2026-11-04', source: 'stripe', stripe_id: 'ch_u', amount_cents: 2900, line_key: null, stripe_created_at: '2026-11-04T19:00:00Z' },
    { ...base, id: 'r', paid_on: '2026-11-05', source: 'stripe', stripe_id: 're_r', amount_cents: -50000, line_key: 'individual_coaching', stripe_created_at: '2026-11-05T02:00:00Z' },
  ]);
  assert.deepEqual(rows.map((r) => r.entry.id), ['a', 'b', 'u', 'r']);
  assert.deepEqual(rows.map((r) => r.runningCents), [200000, 500000, 500000, 450000]);
});

test('dollars, months, days, pace colours', () => {
  assert.equal(parseDollars('1,542'), 154200);
  assert.equal(parseDollars('$29.50'), 2950);
  assert.equal(parseDollars('29.505'), null);
  assert.equal(parseDollars('abc'), null);
  assert.equal(addMonths('2026-12', 1), '2027-01');
  assert.equal(addMonths('2026-01', -1), '2025-12');
  assert.equal(daysInMonth('2027-02').length, 28);
  assert.equal(daysInMonth('2028-02').length, 29);
  assert.equal(paceStatus(100, 100), 'good');
  assert.equal(paceStatus(90, 100), 'warn');
  assert.equal(paceStatus(50, 100), 'bad');
});
