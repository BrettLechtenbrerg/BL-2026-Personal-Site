'use client';

//==============================================================================
// POWER HUB — Set up a month's budget (Brett, on the 20th of each month)
//==============================================================================
// Brett's estimate for every counted income line as "how many × price"
// (e.g. 4 coaching clients × $2,000 = $8,000; 10 hours × $500 = $5,000).
// Starts from last month's estimates and shows last month's estimate →
// actual. Also holds the reminder-email switch.
//==============================================================================

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowLeft, Loader2, Mail, Save } from 'lucide-react';
import {
  BUDGET_LINES, BUDGET_START, SECTIONS, addMonths, daysInMonth, isMonth, money, monthName, monthOf, parseDollars, summarizeMonth,
} from '@/lib/budget';
import { budgetAction, loadBudget, type BudgetData } from '@/components/hub/budget/api';

interface Est { count: string; price: string }
const dollars = (c: number) => (c ? String(c % 100 ? (c / 100).toFixed(2) : c / 100) : '');
const COUNTED = BUDGET_LINES.filter((l) => l.counted);
const FIRST_MONTH = monthOf(BUDGET_START);

function SetupPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [month, setMonth] = useState('');
  const [cur, setCur] = useState<BudgetData | null>(null);
  const [prev, setPrev] = useState<BudgetData | null>(null);
  const [est, setEst] = useState<Record<string, Est>>({});
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [remindersOn, setRemindersOn] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const q = params.get('month');
        const base = await loadBudget(isMonth(q) ? q : '');
        let m = isMonth(q) ? q : base.config ? addMonths(base.month, 1) : base.month;
        if (m < FIRST_MONTH) m = FIRST_MONTH;
        const [c, p] = await Promise.all([m === base.month ? Promise.resolve(base) : loadBudget(m), loadBudget(addMonths(m, -1))]);
        setMonth(m); setCur(c); setPrev(p); setRemindersOn(c.remindersOn); setNote(c.config?.note ?? '');
        const goals = c.goals.length ? c.goals : p.goals;
        setEst(Object.fromEntries(COUNTED.map((line) => {
          const g = goals.find((x) => x.line_key === line.key);
          return [line.key, { count: g ? String(g.est_count || '') : '', price: dollars(g?.unit_price_cents || line.defaultPriceCents) }];
        })));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not load.');
      } finally {
        setLoading(false);
      }
    })();
  }, [params]);

  const prevSummary = useMemo(() => prev && summarizeMonth({ month: prev.month, today: prev.today, goals: prev.goals, entries: prev.entries }), [prev]);
  const lineGoal = (k: string) => (Number(est[k]?.count) || 0) * (parseDollars(est[k]?.price || '0') ?? 0);
  const total = COUNTED.reduce((s, c) => s + lineGoal(c.key), 0);

  async function save() {
    setError('');
    for (const c of COUNTED) {
      const e = est[c.key];
      if (e?.count && !/^\d+$/.test(e.count)) return setError(`${c.label}: "how many" must be a whole number.`);
      if (e?.price && (parseDollars(e.price) === null || parseDollars(e.price)! < 0)) return setError(`${c.label}: the price must be a dollar amount.`);
    }
    setSaving(true);
    try {
      await budgetAction({
        action: 'save_month', month, note,
        goals: COUNTED.map((c) => ({ key: c.key, est_count: Number(est[c.key]?.count) || 0, unit_price_cents: parseDollars(est[c.key]?.price || '0') ?? 0 })),
      });
      router.push(`/hub/budget?month=${month}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'That did not save.');
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 flex items-center gap-2 text-gray-500"><Loader2 className="animate-spin" size={18} /> Loading…</div>;
  if (!month) return <div role="alert" className="p-6 text-red-800 flex gap-2"><AlertCircle size={18} /> {error || 'Could not load.'}</div>;

  const input = 'px-2 py-1.5 border border-gray-300 rounded-lg text-gray-900 bg-white min-h-[40px] w-full text-right';
  const prevGoal = (k: string) => prev?.goals.find((g) => g.line_key === k);
  const prevLine = (k: string) => prevSummary?.lines.find((l) => l.key === k);
  const nDays = daysInMonth(month).length;

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 pt-6">
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900">Set up the {monthName(month)} budget</h1>
        <p className="text-gray-600 mt-0.5">{cur?.config?.prepared_at ? `Last saved ${new Date(cur.config.prepared_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'America/Denver' })}` : 'Done on the 20th of the month before. About 5 minutes.'}</p>
      </div>
      <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-[1100px]">
        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/hub/budget?month=${month}`} className="inline-flex items-center gap-1.5 min-h-[40px] text-sm text-gray-600 underline"><ArrowLeft size={16} /> Back to the budget</Link>
          <span className="text-gray-300">|</span>
          {month > FIRST_MONTH && <Link href={`/hub/budget/setup?month=${addMonths(month, -1)}`} className="text-sm text-gray-600 underline min-h-[40px] inline-flex items-center">{monthName(addMonths(month, -1), false)}</Link>}
          <Link href={`/hub/budget/setup?month=${addMonths(month, 1)}`} className="text-sm text-gray-600 underline min-h-[40px] inline-flex items-center">{monthName(addMonths(month, 1), false)}</Link>
        </div>
        {error && <div role="alert" className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm flex gap-2"><AlertCircle size={18} /> {error}</div>}

        <section className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-lg font-bold text-gray-900">My estimates for {monthName(month, false)}</h2>
          <p className="text-sm text-gray-600 mb-3">Your best estimate for each line: <b>how many × price</b>. Example: 4 coaching clients × $2,000 = $8,000, or 10 hours × $500 = $5,000. Leave a line blank if you don&apos;t expect any. &ldquo;Not BL business&rdquo; never has a goal.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[620px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
                  <th className="py-2 pr-3">Income line</th><th className="py-2 pr-3 w-24">How many</th><th className="py-2 pr-3 w-32">× Price ($)</th>
                  <th className="py-2 pr-3 text-right">= Goal</th><th className="py-2 text-right">{prev ? monthName(prev.month, false) : 'Last month'}: estimate → actual</th>
                </tr>
              </thead>
              <tbody>
                {SECTIONS.filter((s) => COUNTED.some((c) => c.section === s)).map((s) => [
                  <tr key={s}><td colSpan={5} className="pt-4 pb-1 text-xs font-extrabold uppercase tracking-wider text-[#9B1B30]">{s}</td></tr>,
                  ...COUNTED.filter((c) => c.section === s).map((c) => {
                    const pg = prevGoal(c.key), pl = prevLine(c.key);
                    return (
                      <tr key={c.key} className="border-b border-gray-100">
                        <td className="py-2 pr-3 text-gray-900"><span className="font-medium">{c.label}</span>{c.unitLabel && <div className="text-xs text-gray-500">{c.unitLabel}</div>}</td>
                        <td className="py-2 pr-3"><input aria-label={`${c.label}: how many`} inputMode="numeric" value={est[c.key]?.count ?? ''} placeholder="0"
                          onChange={(e) => setEst({ ...est, [c.key]: { ...est[c.key], count: e.target.value.replace(/\D/g, '') } })} className={input} /></td>
                        <td className="py-2 pr-3"><input aria-label={`${c.label}: price`} inputMode="decimal" value={est[c.key]?.price ?? ''} placeholder="0"
                          onChange={(e) => setEst({ ...est, [c.key]: { ...est[c.key], price: e.target.value } })} className={input} /></td>
                        <td className="py-2 pr-3 text-right font-semibold text-gray-900">{lineGoal(c.key) ? money(lineGoal(c.key)) : '—'}</td>
                        <td className="py-2 text-right text-gray-500 whitespace-nowrap">
                          {pg || (pl && pl.actualCents) ? `${pg?.est_count ?? 0} → ${pl?.actualCount ?? 0} · ${money(pl?.actualCents ?? 0)}` : '—'}
                        </td>
                      </tr>
                    );
                  }),
                ])}
              </tbody>
              <tfoot>
                <tr><td className="pt-3 font-semibold text-gray-900" colSpan={3}>Month goal</td><td className="pt-3 text-right font-extrabold text-[#9B1B30] text-lg">{money(total)}</td>
                  <td className="pt-3 text-right text-gray-500">{total ? `${money(total / nDays)} a day on average (${nDays} days)` : ''}</td></tr>
              </tfoot>
            </table>
          </div>
          <label className="block mt-4 text-sm text-gray-700">Note for the month (optional)
            <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} placeholder="e.g. new group cohort starts the 15th"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 min-h-[40px]" />
          </label>
        </section>

        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] bg-[#9B1B30] text-white rounded-lg font-bold disabled:opacity-50">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save {monthName(month, false)} budget
        </button>

        <section className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Mail size={18} /> Reminder emails (19th and 20th)</h2>
          <p className="text-sm text-gray-600 mt-1">To brett@brettlechtenberg.com: &ldquo;set up next month&apos;s budget tomorrow / today&rdquo;, with a button to this page. The 20th email is skipped once next month is set up.</p>
          <label className="mt-3 inline-flex items-center gap-3 text-gray-900 font-semibold min-h-[44px]">
            <input type="checkbox" checked={remindersOn} className="w-5 h-5" onChange={async (e) => {
              const on = e.target.checked;
              try { await budgetAction({ action: 'set_reminders', on }); setRemindersOn(on); }
              catch (err) { setError(err instanceof Error ? err.message : 'That did not save.'); }
            }} />
            Reminder emails are {remindersOn ? 'ON' : 'OFF'}
          </label>
        </section>
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={null}><SetupPage /></Suspense>;
}
