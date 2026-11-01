'use client';

//==============================================================================
// POWER HUB — Budget & Sales dashboard (Brett's business)
//==============================================================================
// Stripe payments file themselves from the description, product or invoice
// line; checks, bank transfers, cash and other money are added here. Each
// income line is compared with Brett's monthly estimate (how many × price),
// paced over the calendar days of the month. Ported from PMMA's Budget page
// (1 Nov 2026). API: /api/hub/budget. Docs: docs/BUDGET.md.
//==============================================================================

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, ChevronLeft, ChevronRight, Download, Loader2, RefreshCw, Settings2, X } from 'lucide-react';
import {
  BUDGET_START, LINE_BY_KEY, SECTIONS, SOURCE_LABEL, addMonths, entryHours, isCounted, money, monthName, monthOf, paceStatus,
  summarizeMonth, type Source,
} from '@/lib/budget';
import { DayBars, Gauge, LineBar, PaceChart, Pill, STATUS } from '@/components/hub/budget/charts';
import EntriesPanel from '@/components/hub/budget/EntriesPanel';
import RunningTotalCard from '@/components/hub/budget/RunningTotalCard';
import ClientsCard from '@/components/hub/budget/ClientsCard';
import NeedsAttentionCard from '@/components/hub/budget/NeedsAttentionCard';
import { budgetAction, fmtDay, fmtHours, fmtTime, loadBudget, type BudgetData } from '@/components/hub/budget/api';

// Each box gets its own soft tint so the dashboard isn't all white (same as PMMA).
const TONE = {
  month: 'bg-amber-50 border-amber-200',
  day: 'bg-sky-50 border-sky-200',
  attention: 'bg-orange-50 border-orange-200',
  pace: 'bg-slate-50 border-slate-300',
  clients: 'bg-lime-50 border-lime-200',
  lines: 'bg-indigo-50/60 border-indigo-200',
  days: 'bg-violet-50 border-violet-200',
  payments: 'bg-[#FDF2F4] border-[#F0C4CD]',
  running: 'bg-teal-50 border-teal-200',
} as const;
const card = (tone: keyof typeof TONE) => `${TONE[tone]} border rounded-2xl p-5 shadow-sm`;
const h2 = 'text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2';
const FIRST_MONTH = monthOf(BUDGET_START);

function Header({ subtitle }: { subtitle: string }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-6">
      <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900">Budget &amp; Sales</h1>
      <p className="text-gray-600 mt-0.5">{subtitle}</p>
    </div>
  );
}

function BudgetPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [data, setData] = useState<BudgetData | null>(null);
  const [month, setMonth] = useState<string | null>(params.get('month'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const load = useCallback(async (m: string | null) => {
    try {
      const d = await loadBudget(m ?? '');
      setData(d);
      setMonth(d.month);
      return d;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const sync = useCallback(async (force: boolean, m: string | null) => {
    setSyncing(true);
    try {
      const r = await budgetAction<{ inserted?: number; connected?: boolean; ok?: boolean; error?: string }>({ action: 'sync', force });
      if (r.connected && r.ok === false && r.error) setError(`Stripe: ${r.error}`);
      if (r.inserted || force) await load(m);
      if (force && r.connected) setNotice(r.inserted ? `${r.inserted} new Stripe payment${r.inserted === 1 ? '' : 's'}.` : 'Stripe is up to date.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Stripe check failed.');
    } finally {
      setSyncing(false);
    }
  }, [load]);

  useEffect(() => {
    load(month).then((d) => { if (d?.stripeConnected) sync(false, d.month); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summary = useMemo(() => data && summarizeMonth({ month: data.month, today: data.today, goals: data.goals, entries: data.entries }), [data]);

  const go = (m: string) => {
    setMonth(m); setSelected(null); setLoading(true);
    router.replace(`/hub/budget?month=${m}`);
    load(m);
  };
  const changed = (msg?: string) => { if (msg) setNotice(msg); load(month); };

  if (loading && !data) {
    return <div className="p-8 flex items-center gap-2 text-gray-500"><Loader2 className="animate-spin" size={18} /> Loading the budget…</div>;
  }
  if (!data || !summary) {
    return (
      <div><Header subtitle="Couldn't load" />
        <div className="p-6"><div role="alert" className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex gap-2"><AlertCircle size={18} /> {error || 'Could not load.'}</div></div>
      </div>
    );
  }

  const isCurrent = summary.isCurrent;
  const focus = selected ?? (isCurrent ? data.today : null);
  const focusDay = focus ? summary.dayRows.find((d) => d.date === focus) ?? null : null;
  const listEntries = selected ? data.entries.filter((e) => e.paid_on === selected) : data.entries;
  const next = addMonths(data.month, 1);
  const setupDue = isCurrent && Number(data.today.slice(8)) >= 19 && !data.nextMonthReady;
  const behind = summary.actualCents - summary.paceCents;
  const monthSources = summary.dayRows.reduce((acc, d) => {
    for (const s of Object.keys(acc) as Source[]) acc[s] += d.bySource[s];
    return acc;
  }, { stripe: 0, check: 0, cash: 0, transfer: 0, other: 0 } as Record<Source, number>);
  const visibleLines = summary.lines.filter((l) => showAll || l.goalCents > 0 || l.actualCents !== 0);
  const pastMonth = data.month < monthOf(data.today);

  function downloadCsv() {
    const rows = [['Paid on', 'How', 'Amount', 'Hours', 'Qty', 'Income line', 'Counted', 'Client / company', 'What for', 'Reference', 'In the bank', 'Stripe description', 'Note', 'Entered by', 'Voided']];
    for (const e of data!.entries) {
      const h = entryHours(e);
      rows.push([e.paid_on, SOURCE_LABEL[e.source], (e.amount_cents / 100).toFixed(2), h ? String(h) : '', String(e.quantity),
        e.line_key ? LINE_BY_KEY[e.line_key]?.label ?? e.line_key : 'NEEDS A CATEGORY', isCounted(e.line_key) && !e.voided_at ? 'yes' : 'no',
        e.payer ?? '', e.item ?? '', e.reference ?? '', e.received_at ? e.received_at.slice(0, 10) : e.source === 'stripe' ? 'Stripe' : 'not yet',
        e.stripe_description ?? '', e.note ?? '', e.entered_by ?? '', e.voided_at ? `voided${e.void_reason ? `: ${e.void_reason}` : ''}` : '']);
    }
    // Leading = + - @ would make spreadsheet apps run the cell as a formula.
    const cell = (c: string) => `"${(/^[=+\-@]/.test(c) && !/^-?\d/.test(c) ? `'${c}` : c).replace(/"/g, '""')}"`;
    const csv = rows.map((r) => r.map(cell).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `bl-budget-${data!.month}.csv`;
    a.click();
  }

  return (
    <div>
      <Header subtitle={`${monthName(data.month)}${isCurrent ? ` · day ${summary.elapsed} of ${summary.days.length}` : ''}`} />
      <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-[1400px]">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg">
            <button aria-label="Previous month" disabled={data.month <= FIRST_MONTH} onClick={() => go(addMonths(data.month, -1))} className="p-2.5 min-h-[44px] text-gray-700 hover:bg-gray-50 rounded-l-lg disabled:opacity-30"><ChevronLeft size={18} /></button>
            <span className="px-2 font-semibold text-gray-900 min-w-[130px] text-center">{monthName(data.month)}</span>
            <button aria-label="Next month" onClick={() => go(addMonths(data.month, 1))} className="p-2.5 min-h-[44px] text-gray-700 hover:bg-gray-50 rounded-r-lg"><ChevronRight size={18} /></button>
          </div>
          <button onClick={() => sync(true, data.month)} disabled={syncing || !data.stripeConnected}
            className="flex items-center gap-2 px-3 py-2 min-h-[44px] bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60">
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
            {data.stripeConnected ? `Check Stripe${data.sync?.at ? ` · ${fmtTime(data.sync.at)}` : ''}` : 'Stripe not connected yet'}
          </button>
          <Link href={`/hub/budget/setup?month=${data.config ? next : data.month}`}
            className={`flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-lg text-sm font-semibold ${setupDue ? 'bg-[#D4AF37] text-gray-900' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
            <Settings2 size={16} /> {data.config ? `Set up ${monthName(next, false)}` : `Set up ${monthName(data.month, false)}`}{setupDue ? ' (due the 20th)' : ''}
          </Link>
          {data.config && (
            <Link href={`/hub/budget/setup?month=${data.month}`} className="px-3 py-2 min-h-[44px] flex items-center text-sm text-gray-600 underline">Edit {monthName(data.month, false)}</Link>
          )}
          <button onClick={downloadCsv} className="sm:ml-auto flex items-center gap-2 px-3 py-2 min-h-[44px] bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
            <Download size={16} /> Download CSV
          </button>
        </div>

        {notice && (
          <div role="status" className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-800 flex justify-between gap-3">
            <span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss"><X size={16} /></button>
          </div>
        )}
        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm flex justify-between gap-3">
            <span className="flex gap-2"><AlertCircle size={18} className="shrink-0" /> {error}</span><button onClick={() => setError('')} aria-label="Dismiss"><X size={16} /></button>
          </div>
        )}
        {!data.config && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
            <span><b>{monthName(data.month)} isn&apos;t set up yet.</b> Payments still show below; goals appear once you add your estimates.</span>
            <Link href={`/hub/budget/setup?month=${data.month}`} className="px-4 py-2 min-h-[44px] flex items-center bg-[#9B1B30] text-white rounded-lg font-semibold">Set up {monthName(data.month, false)}</Link>
          </div>
        )}

        {/* Row 1: gauge · today · needs attention */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <section className={card('month')} aria-labelledby="h-month">
            <h2 id="h-month" className={h2}>Month vs. budget</h2>
            {summary.goalCents > 0 ? (
              <>
                <Gauge actual={summary.actualCents} goal={summary.goalCents} pace={isCurrent ? summary.paceCents : pastMonth ? summary.goalCents : 0} />
                <p className="text-center text-sm text-gray-600"><b className="text-gray-900">{money(summary.actualCents)}</b> of {money(summary.goalCents)}
                  {isCurrent && <> · should be at {money(summary.paceCents)} today</>}</p>
                {isCurrent && summary.elapsed > 0 && (
                  <p className="text-center mt-1.5"><Pill actual={summary.actualCents} pace={summary.paceCents} text={behind >= 0 ? `${money(behind)} ahead of pace` : `${money(-behind)} behind pace`} /></p>
                )}
              </>
            ) : (
              <>
                <p className="text-4xl font-extrabold text-gray-900">{money(summary.actualCents)}</p>
                <p className="text-gray-600 text-sm mt-1">No estimates yet. <Link className="underline" href={`/hub/budget/setup?month=${data.month}`}>Set up {monthName(data.month, false)}</Link> to see the gauge.</p>
              </>
            )}
            {(summary.unfiledCents !== 0 || summary.notCountedCents !== 0) && (
              <div className="mt-3 pt-2 border-t border-black/5 text-xs text-gray-600 space-y-0.5">
                {summary.unfiledCents !== 0 && <p>+ {money(summary.unfiledCents, true)} waiting for an income line (not added yet)</p>}
                {summary.notCountedCents !== 0 && <p>{money(summary.notCountedCents, true)} not BL business, kept on record, not counted</p>}
              </div>
            )}
          </section>
          <section className={card('day')} aria-labelledby="h-day">
            <h2 id="h-day" className={h2}>{focus === data.today ? 'Today' : focus ? fmtDay(focus) : 'Day'}</h2>
            {focusDay ? (
              <>
                <p className="text-4xl font-extrabold text-gray-900">{money(focusDay.salesCents)}</p>
                {summary.dailyTargetCents > 0 && (
                  <p className="text-sm text-gray-500 mt-1">Daily average needed {money(summary.dailyTargetCents)}
                    {focusDay.date <= data.today && <> <Pill actual={focusDay.salesCents} pace={summary.dailyTargetCents} text={`${Math.round((focusDay.salesCents / summary.dailyTargetCents) * 100)}%`} /></>}</p>
                )}
                <div className="mt-3">
                  {(['stripe', 'check', 'transfer', 'cash', 'other'] as Source[]).map((s) => (
                    <div key={s} className="flex justify-between py-1.5 border-b border-black/5 last:border-0 text-[15px]">
                      <span className="text-gray-700">{s === 'stripe' ? `Stripe (${focusDay.stripeCount})` : SOURCE_LABEL[s]}</span>
                      <b className="text-gray-900">{money(focusDay.bySource[s], true)}</b>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Coaching and consulting money often lands in a few big days, so watch the month, not the day.</p>
              </>
            ) : <p className="text-sm text-gray-600">Tap a day in &ldquo;Day by day&rdquo; to see it here.</p>}
          </section>
          <section className={card('attention')} aria-labelledby="h-attention">
            <h2 id="h-attention" className={h2}>Needs attention</h2>
            <NeedsAttentionCard uncategorized={summary.uncategorized} awaiting={data.awaitingReceipt} onChanged={changed} onError={setError} />
          </section>
        </div>

        {/* Row 2: payments · running total */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <section className={`${card('payments')} lg:col-span-8`} aria-labelledby="h-entries">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h2 id="h-entries" className="text-lg sm:text-xl font-extrabold text-[#7A1525]">
                Payments – {selected ? fmtDay(selected, true) : monthName(data.month)}
              </h2>
              {selected && (
                <button onClick={() => setSelected(null)} className="px-3 py-1.5 min-h-[40px] text-sm bg-white border border-gray-300 rounded-lg text-gray-700">Show all of {monthName(data.month, false)}</button>
              )}
            </div>
            <EntriesPanel defaultDay={selected ?? (isCurrent ? data.today : pastMonth ? summary.days[summary.days.length - 1] : data.today)} today={data.today}
              entries={listEntries} onChanged={changed} onError={setError} />
          </section>
          <section className={`${card('running')} lg:col-span-4`} aria-labelledby="h-running">
            <h2 id="h-running" className="text-lg sm:text-xl font-extrabold text-teal-900 mb-2">Running Total – {monthName(data.month, false)}</h2>
            <RunningTotalCard entries={data.entries} goalCents={summary.goalCents} bySource={monthSources} />
          </section>
        </div>

        {/* Row 3: lines · days */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <section className={`${card('lines')} lg:col-span-7`} aria-labelledby="h-lines">
            <h2 id="h-lines" className={h2}>Each income line vs. my estimate</h2>
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-1">
              {(['good', 'warn', 'bad'] as const).map((k) => <span key={k} className="flex items-center gap-1.5"><i className="w-3 h-3 rounded-sm inline-block" style={{ background: STATUS[k].color }} />{STATUS[k].label}</span>)}
              <span className="flex items-center gap-1.5"><i className="w-[3px] h-3 bg-gray-900 inline-block" />Where I should be today</span>
            </div>
            {SECTIONS.map((s) => {
              const ls = visibleLines.filter((l) => l.section === s);
              if (!ls.length) return null;
              return (
                <div key={s}>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#9B1B30] mt-4">{s}</p>
                  {ls.map((l) => {
                    const unit = LINE_BY_KEY[l.key]?.unitLabel ?? '';
                    const count = unit === 'hours' ? fmtHours(l.actualCount).replace(/ hrs?$/, '') : l.actualCount;
                    return (
                      <div key={l.key} className="py-2 border-b border-black/5 last:border-0">
                        <div className="flex flex-wrap justify-between gap-x-2 text-[15px]">
                          <span className="text-gray-900"><b>{l.label}</b>{' '}
                            {!l.counted ? <span className="text-xs text-gray-500">not counted</span>
                              : l.goalCents > 0 ? <Pill actual={l.actualCents} pace={isCurrent ? l.paceCents : pastMonth ? l.goalCents : 0} /> : <span className="text-xs text-gray-500">no estimate</span>}</span>
                          <span className="text-gray-500 whitespace-nowrap text-sm">
                            {l.counted && (l.estCount > 0 || l.actualCount !== 0) && <>{count} of {l.estCount} {unit} · </>}
                            {l.counted ? <>{money(l.actualCents)} of {money(l.goalCents)}</> : <>{money(l.actualCents)} on record</>}</span>
                        </div>
                        {l.counted && <LineBar actual={l.actualCents} goal={l.goalCents} pace={isCurrent ? l.paceCents : pastMonth ? l.goalCents : 0} />}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            <button onClick={() => setShowAll(!showAll)} className="mt-3 min-h-[40px] text-sm text-[#9B1B30] font-semibold">
              {showAll ? 'Hide lines with no estimate and no money' : `Show all ${summary.lines.length} lines`}
            </button>
          </section>
          <section className={`${card('days')} lg:col-span-5`} aria-labelledby="h-days">
            <h2 id="h-days" className={h2}>Day by day <span className="normal-case font-normal">(tap a day)</span></h2>
            <DayBars days={summary.dayRows} target={summary.dailyTargetCents} today={data.today} selected={selected} onSelect={(d) => setSelected(d === selected ? null : d)} />
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-1">
              <span className="flex items-center gap-1.5"><i className="w-3 h-3 rounded-sm bg-[#9B1B30] inline-block" />Money in</span>
              <span className="flex items-center gap-1.5"><i className="w-3 border-t-2 border-dashed border-gray-900 inline-block" />Daily average needed</span>
            </div>
            <h2 className={`${h2} mt-5`}>Week by week</h2>
            {summary.weeks.map((w) => {
              const first = w.days[0], last = w.days[w.days.length - 1];
              const label = first === last ? fmtDay(first) : `${fmtDay(first).replace(/^\w+, /, '')}–${Number(last.slice(8))}`;
              return (
                <div key={w.label} className="flex justify-between items-center py-1.5 border-b border-black/5 last:border-0 text-[15px]">
                  <span className="text-gray-700">{label} <span className="text-gray-400 text-sm">({w.days.length} day{w.days.length === 1 ? '' : 's'})</span></span>
                  {w.doneDays ? (
                    <span><b className="text-gray-900">{money(w.actualCents)}</b> {w.goalCents > 0 && <span className="text-gray-500 text-sm">of {money(w.goalCents)}</span>}{' '}
                      {w.goalCents > 0 && <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS[paceStatus(w.actualCents, (w.goalCents * w.doneDays) / w.days.length)].pill}`}>{Math.round((w.actualCents / w.goalCents) * 100)}%</span>}</span>
                  ) : <span className="text-gray-500 text-sm">{w.goalCents > 0 ? `goal ${money(w.goalCents)}` : '—'}</span>}
                </div>
              );
            })}
          </section>
        </div>

        {/* Row 4: pace · clients */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <section className={`${card('pace')} lg:col-span-2`} aria-labelledby="h-pace">
            <h2 id="h-pace" className={h2}>Am I on pace? (running total)</h2>
            <PaceChart days={summary.dayRows} goal={summary.goalCents} elapsed={summary.elapsed} />
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-1">
              <span className="flex items-center gap-1.5"><i className="w-3 h-3 rounded-sm bg-[#9B1B30] inline-block" />Actual so far</span>
              <span className="flex items-center gap-1.5"><i className="w-3 h-3 rounded-sm bg-gray-300 inline-block" />Budget pace</span>
              <span className="flex items-center gap-1.5"><i className="w-3 h-3 rounded-sm bg-[#D4AF37] inline-block" />Month goal</span>
            </div>
          </section>
          <section className={card('clients')} aria-labelledby="h-clients">
            <h2 id="h-clients" className={h2}>Clients</h2>
            <ClientsCard summary={summary} />
          </section>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={null}><BudgetPage /></Suspense>;
}
