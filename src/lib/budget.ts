//==============================================================================
// BL Power Hub — Budget & Sales: income lines, matching, calendar pace, totals
//==============================================================================
// Pure module (no server imports): used by the hub pages, the API, the daily
// cron and the unit tests (scripts/budget-unit-test.ts). Money is in integer
// cents everywhere. Ported from PMMA's lib/budget.ts (1 Nov 2026) and fitted to
// Brett's business: no MSI billing, no closed days, pace runs on calendar days.
// Docs: docs/BUDGET.md.
//==============================================================================

export type Section = 'Coaching' | 'Consulting' | 'Other' | 'Not counted';
export type Source = 'stripe' | 'check' | 'cash' | 'transfer' | 'other';

export interface BudgetLine {
  key: string;
  label: string;
  section: Section;
  /** Words in a Stripe description, product name or invoice line (first one is shown). */
  words: string[];
  /** Starting price for a new month's estimate (cents); 0 = Brett fills it in. */
  defaultPriceCents: number;
  /** false = kept on record, never added to totals (personal / PMMA money). */
  counted: boolean;
  /** What "how many" means on the setup screen and the Clients card. */
  unitLabel?: string;
}

export const HOURLY_RATE_CENTS = 50000;
export const HOURLY_KEY = 'hourly_consulting';
export const NOT_COUNTED_KEY = 'not_counted';

// Stable keys: renaming a key = data migration. Labels and words can change.
export const BUDGET_LINES: BudgetLine[] = [
  { key: 'group_coaching', label: 'Group Coaching', section: 'Coaching', counted: true, defaultPriceCents: 0, unitLabel: 'members',
    words: ['Group Coaching', 'group', 'cohort', 'group program', 'group coaching program', 'mastermind'] },
  { key: 'individual_coaching', label: 'Individual Coaching', section: 'Coaching', counted: true, defaultPriceCents: 0, unitLabel: 'clients',
    words: ['Individual Coaching', 'coaching', 'individual', 'personal coaching', '1:1', '1 on 1', 'one on one', 'private coaching',
      'business coaching', 'peak performance coaching', 'executive coaching', 'coaching session'] },
  { key: 'company_consulting', label: 'Company Consulting', section: 'Consulting', counted: true, defaultPriceCents: 0, unitLabel: 'engagements',
    words: ['Company Consulting', 'consulting', 'company', 'retainer', 'advisory', 'ai advisory', 'consulting retainer', 'monthly retainer'] },
  { key: HOURLY_KEY, label: 'Hourly Consulting ($500/hr)', section: 'Consulting', counted: true, defaultPriceCents: HOURLY_RATE_CENTS, unitLabel: 'hours',
    words: ['Hourly Consulting', 'hourly', 'hour', 'hours', 'per hour', 'consulting hours', 'consulting hour', 'hours consulting',
      'hour consulting', 'consulting hourly'] },
  { key: 'other_income', label: 'Other Income', section: 'Other', counted: true, defaultPriceCents: 0, unitLabel: 'sales',
    words: ['Other Income', 'other', 'book', 'books', 'ebook', 'academy', 'course', 'business mastery', 'masters edge',
      'speaking', 'keynote', 'workshop', 'training'] },
  { key: NOT_COUNTED_KEY, label: 'Not BL business (personal / PMMA)', section: 'Not counted', counted: false, defaultPriceCents: 0,
    words: ['Not BL', 'not bl business', 'color belt', 'colour belt', 'belt promotion', 'color belt promotion', 'pre test', 'pretest',
      'black belt pre test', 'black belt', 'abc', 'chs reunion', 'reunion', 'pmma', 'personal mastery', 'martial arts'] },
];

export const LINE_BY_KEY: Record<string, BudgetLine> = Object.fromEntries(BUDGET_LINES.map((c) => [c.key, c]));
export const SECTIONS: Section[] = ['Coaching', 'Consulting', 'Other', 'Not counted'];
export const SOURCES: Source[] = ['stripe', 'check', 'transfer', 'cash', 'other'];
export const SOURCE_LABEL: Record<Source, string> = {
  stripe: 'Stripe', check: 'Check', transfer: 'Bank transfer', cash: 'Cash', other: 'Other (Zelle, Venmo…)',
};
/** Money that has to show up in the bank before it's "received". */
export const NEEDS_RECEIPT: Source[] = ['check', 'transfer'];
/** First day the budget tracks; Stripe catch-up never reaches further back. */
export const BUDGET_START = '2026-11-01';
export const OWNER = 'Brett';
export const TZ = 'America/Denver';

//------------------------------------------------------------------------------
// Matching a description / product name / invoice line to an income line
//------------------------------------------------------------------------------

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/['’`]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function editDistance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

const ALIASES: { alias: string; key: string }[] = BUDGET_LINES.flatMap((c) =>
  c.words.map((w) => ({ alias: normalize(w), key: c.key }))
).sort((x, y) => y.alias.length - x.alias.length);

/** Split "Line - item" into its two parts (spaced dash, en/em dash or colon). */
export function splitDescription(text: string): { head: string; item: string | null } {
  const m = text.match(/^(.*?)\s*(?:\s[-–—]\s|[–—:])\s*(.+)$/);
  if (!m) return { head: text.trim(), item: null };
  return { head: m[1].trim(), item: m[2].trim() || null };
}

function rawMatch(text: string): { key: string | null; item: string | null } {
  // "1:1" would otherwise be split at the colon.
  const { head, item } = /^\s*1\s*:\s*1\b/.test(text) ? { head: text.trim(), item: null } : splitDescription(text);
  const h = normalize(head);
  const full = normalize(text);
  if (!h) return { key: null, item };
  const exact = ALIASES.find((a) => a.alias === h);
  if (exact) return { key: exact.key, item };
  let best: { key: string; d: number } | null = null;
  let tie = false;
  for (const a of ALIASES) {
    const allowed = a.alias.length <= 4 ? 0 : a.alias.length <= 8 ? 1 : 2;
    if (!allowed) continue;
    const d = editDistance(h, a.alias);
    if (d > allowed) continue;
    if (!best || d < best.d) { best = { key: a.key, d }; tie = false; }
    else if (d === best.d && a.key !== best.key) tie = true;
  }
  if (best && !tie) return { key: best.key, item };
  const padded = ` ${full} `;
  const inside = ALIASES.find((a) => a.alias.length >= 3 && padded.includes(` ${a.alias} `));
  if (inside) return { key: inside.key, item: item ?? null };
  return { key: null, item };
}

/**
 * Income line for a description. Exact word first, then a small typo
 * allowance, then (for longer texts such as product names) the longest known
 * word found inside it. Consulting that mentions hours is hourly.
 * null = goes to "Needs a category".
 */
export function matchLine(text: string | null | undefined): { key: string | null; item: string | null } {
  if (!text || !text.trim()) return { key: null, item: null };
  const r = rawMatch(text);
  if (r.key === 'company_consulting' && /\b(hours?|hourly|hrs?)\b/.test(normalize(text))) return { key: HOURLY_KEY, item: r.item };
  return r;
}

/** Hours billed for an hourly payment: amount ÷ $500, to 2 decimals. */
export function hoursFor(amountCents: number): number {
  return Math.round((amountCents / HOURLY_RATE_CENTS) * 100) / 100;
}

//------------------------------------------------------------------------------
// Dates (all YYYY-MM-DD strings in Denver time)
//------------------------------------------------------------------------------

export function denverDate(d: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}
export const monthOf = (ymd: string) => ymd.slice(0, 7);
export function isMonth(s: unknown): s is string {
  return typeof s === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(s);
}
export function isDate(s: unknown): s is string {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T12:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}
export function addMonths(month: string, n: number): string {
  const [y, m] = month.split('-').map(Number);
  const t = y * 12 + (m - 1) + n;
  return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, '0')}`;
}
export function daysInMonth(month: string): string[] {
  const [y, m] = month.split('-').map(Number);
  const n = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return Array.from({ length: n }, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`);
}
export const weekday = (ymd: string) => new Date(`${ymd}T12:00:00Z`).getUTCDay();
export function monthName(month: string, withYear = true): string {
  return new Date(`${month}-15T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', year: withYear ? 'numeric' : undefined, timeZone: 'UTC' });
}

//------------------------------------------------------------------------------
// Rows (as stored) and the month summary the dashboard draws
//------------------------------------------------------------------------------

export interface MonthRow {
  month: string;
  note: string | null;
  prepared_by: string | null;
  prepared_at: string | null;
}
export interface GoalRow { line_key: string; est_count: number; unit_price_cents: number }
export interface EntryRow {
  id: string;
  paid_on: string;
  source: Source;
  amount_cents: number;
  quantity: number;
  hours: number | string | null;
  line_key: string | null;
  line_set_by: string | null;
  item: string | null;
  payer: string | null;
  reference: string | null;
  note: string | null;
  received_at: string | null;
  stripe_id: string | null;
  stripe_description: string | null;
  stripe_created_at: string | null;
  entered_by: string | null;
  created_at: string;
  updated_at: string;
  voided_at: string | null;
  voided_by: string | null;
  void_reason: string | null;
}

export interface LineSummary {
  key: string;
  label: string;
  section: Section;
  counted: boolean;
  estCount: number;
  unitPriceCents: number;
  goalCents: number;
  actualCents: number;
  /** Payments (× quantity) — or hours for Hourly Consulting. */
  actualCount: number;
  paceCents: number;
}
export interface DaySummary {
  date: string;
  salesCents: number;
  bySource: Record<Source, number>;
  stripeCount: number;
  uncategorized: number;
  entryIds: string[];
}
export interface MonthSummary {
  month: string;
  days: string[];
  goalCents: number;
  dailyTargetCents: number;
  elapsed: number;
  isCurrent: boolean;
  actualCents: number;
  paceCents: number;
  notCountedCents: number;
  unfiledCents: number;
  lines: LineSummary[];
  dayRows: DaySummary[];
  weeks: { label: string; days: string[]; goalCents: number; actualCents: number; doneDays: number }[];
  clients: { key: string; label: string; unit: string; actual: number; est: number }[];
  uncategorized: EntryRow[];
  awaitingReceipt: EntryRow[];
}

const live = (e: EntryRow) => !e.voided_at;
/** Hours on an entry (stored, or worked out from the amount for hourly payments). */
export function entryHours(e: EntryRow): number {
  const h = e.hours === null || e.hours === undefined ? NaN : Number(e.hours);
  if (Number.isFinite(h)) return e.amount_cents < 0 ? -Math.abs(h) : h;
  return e.line_key === HOURLY_KEY ? hoursFor(e.amount_cents) : 0;
}
export const isCounted = (key: string | null) => Boolean(key && LINE_BY_KEY[key]?.counted);

export function summarizeMonth(args: { month: string; goals: GoalRow[]; entries: EntryRow[]; today: string }): MonthSummary {
  const { month, goals, today } = args;
  const days = daysInMonth(month);
  const N = days.length;
  const elapsed = days.filter((d) => d <= today).length;
  const entries = args.entries.filter((e) => live(e) && monthOf(e.paid_on) === month);
  const goalBy = new Map(goals.map((g) => [g.line_key, g]));

  const lines: LineSummary[] = BUDGET_LINES.map((c) => {
    const g = goalBy.get(c.key);
    const goalCents = c.counted && g ? g.est_count * g.unit_price_cents : 0;
    const mine = entries.filter((e) => e.line_key === c.key);
    const actualCount = c.key === HOURLY_KEY
      ? Math.round(mine.reduce((s, e) => s + entryHours(e), 0) * 100) / 100
      : mine.filter((e) => e.amount_cents > 0).reduce((s, e) => s + e.quantity, 0);
    return {
      key: c.key, label: c.label, section: c.section, counted: c.counted,
      estCount: g?.est_count ?? 0, unitPriceCents: g?.unit_price_cents ?? c.defaultPriceCents,
      goalCents, actualCents: mine.reduce((s, e) => s + e.amount_cents, 0), actualCount,
      paceCents: N ? (goalCents * elapsed) / N : 0,
    };
  });
  const goalCents = lines.reduce((s, l) => s + l.goalCents, 0);
  const counted = entries.filter((e) => isCounted(e.line_key));
  const emptySources = (): Record<Source, number> => ({ stripe: 0, check: 0, cash: 0, transfer: 0, other: 0 });

  const dayRows: DaySummary[] = days.map((date) => {
    const mine = entries.filter((e) => e.paid_on === date);
    const bySource = emptySources();
    for (const e of mine) if (isCounted(e.line_key)) bySource[e.source] += e.amount_cents;
    return {
      date,
      salesCents: mine.filter((e) => isCounted(e.line_key)).reduce((s, e) => s + e.amount_cents, 0),
      bySource,
      stripeCount: mine.filter((e) => e.source === 'stripe').length,
      uncategorized: mine.filter((e) => !e.line_key).length,
      entryIds: mine.map((e) => e.id),
    };
  });

  const dailyTargetCents = N ? goalCents / N : 0;
  const weeks: MonthSummary['weeks'] = [];
  for (const d of days) {
    const dt = new Date(`${d}T12:00:00Z`);
    const monday = new Date(dt.getTime() - ((dt.getUTCDay() + 6) % 7) * 86400000).toISOString().slice(0, 10);
    let w = weeks.find((x) => x.label === monday);
    if (!w) { w = { label: monday, days: [], goalCents: 0, actualCents: 0, doneDays: 0 }; weeks.push(w); }
    w.days.push(d);
    w.goalCents += dailyTargetCents;
    if (d <= today) {
      w.actualCents += dayRows.find((x) => x.date === d)!.salesCents;
      w.doneDays++;
    }
  }
  const clients = lines
    .filter((l) => l.counted && l.key !== 'other_income')
    .map((l) => ({ key: l.key, label: l.label.replace(/ \(.*\)$/, ''), unit: LINE_BY_KEY[l.key].unitLabel ?? '', actual: l.actualCount, est: l.estCount }));
  const sum = (l: EntryRow[]) => l.reduce((s, e) => s + e.amount_cents, 0);
  return {
    month, days, goalCents, dailyTargetCents, elapsed, isCurrent: monthOf(today) === month,
    actualCents: sum(counted), paceCents: N ? (goalCents * elapsed) / N : 0,
    notCountedCents: sum(entries.filter((e) => e.line_key === NOT_COUNTED_KEY)),
    unfiledCents: sum(entries.filter((e) => !e.line_key)),
    lines, dayRows, weeks, clients,
    uncategorized: entries.filter((e) => !e.line_key),
    awaitingReceipt: entries.filter((e) => NEEDS_RECEIPT.includes(e.source) && !e.received_at),
  };
}

/** Pace status used for colours: on pace / a little behind / behind. */
export function paceStatus(actual: number, pace: number): 'good' | 'warn' | 'bad' {
  if (pace <= 0) return 'good';
  const r = actual / pace;
  return r >= 1 ? 'good' : r >= 0.85 ? 'warn' : 'bad';
}

export function money(cents: number, exact = false): string {
  const v = cents / 100;
  return (v < 0 ? '−$' : '$') + Math.abs(v).toLocaleString('en-US', {
    minimumFractionDigits: exact ? 2 : 0, maximumFractionDigits: exact ? 2 : 0,
  });
}

/** Dollars typed ("1,542", "$29.50") → cents, or null. */
export function parseDollars(s: unknown): number | null {
  if (typeof s === 'number') return Number.isFinite(s) ? Math.round(s * 100) : null;
  if (typeof s !== 'string') return null;
  const t = s.replace(/[$,\s]/g, '');
  if (!/^-?\d+(\.\d{1,2})?$/.test(t)) return null;
  return Math.round(parseFloat(t) * 100);
}

/** Hours typed ("2", "1.5", "0.25") → number, or null. */
export function parseHours(s: unknown): number | null {
  const t = typeof s === 'number' ? String(s) : typeof s === 'string' ? s.trim() : '';
  if (!/^\d{1,4}(\.\d{1,2})?$/.test(t)) return null;
  const h = parseFloat(t);
  return h > 0 && h <= 9999 ? h : null;
}

/** Payments in the order they came in, each with the running total so far (voids and not-counted left out). */
export function runningTotals(entries: EntryRow[]): { entry: EntryRow; at: string; runningCents: number }[] {
  let sum = 0;
  return entries
    .filter((e) => !e.voided_at && e.line_key !== NOT_COUNTED_KEY)
    .map((e) => ({ entry: e, at: e.stripe_created_at ?? e.created_at }))
    .sort((a, b) => (a.entry.paid_on < b.entry.paid_on ? -1 : a.entry.paid_on > b.entry.paid_on ? 1 : a.at < b.at ? -1 : a.at > b.at ? 1 : 0))
    .map(({ entry, at }) => ({ entry, at, runningCents: (sum += isCounted(entry.line_key) ? entry.amount_cents : 0) }));
}
