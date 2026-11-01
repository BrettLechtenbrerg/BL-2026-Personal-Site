'use client';

//==============================================================================
// BL Budget — the month's running total: every counted payment in the order it
// came in (Stripe time for cards, entry time for the rest) with the total so far.
//==============================================================================

import { LINE_BY_KEY, money, runningTotals, type EntryRow, type Source } from '@/lib/budget';
import { fmtDay } from './api';

const HOW: Record<Source, string> = { stripe: 'Card', check: 'Check', transfer: 'Transfer', cash: 'Cash', other: 'Other' };

export default function RunningTotalCard({ entries, goalCents, bySource }: {
  entries: EntryRow[]; goalCents: number; bySource: Record<Source, number>;
}) {
  const rows = runningTotals(entries);
  const total = rows.length ? rows[rows.length - 1].runningCents : 0;
  const pct = goalCents > 0 ? Math.min(total / goalCents, 1) : 0;
  return (
    <div className="flex flex-col h-full">
      <p className="text-sm text-gray-600">Money in this month</p>
      <p className="text-4xl font-extrabold text-gray-900 leading-tight">{money(total, true)}</p>
      <div className="flex flex-wrap gap-1.5 mt-2 text-xs font-semibold">
        {(Object.keys(HOW) as Source[]).filter((s) => bySource[s]).map((s) => (
          <span key={s} className="px-2 py-1 rounded-full bg-white border border-teal-200 text-gray-800">{HOW[s]} {money(bySource[s], true)}</span>
        ))}
      </div>
      <div className="mt-4 bg-white border border-teal-200 rounded-xl flex-1 min-h-[160px] overflow-y-auto max-h-[420px]" aria-label="Payments in the order they came in, with the running total">
        {rows.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">No payments yet this month. Each one appears here as it comes in.</p>
        ) : (
          <ol className="divide-y divide-gray-100">
            {rows.map(({ entry: e, runningCents }) => (
              <li key={e.id} className="px-3 py-2">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap">{fmtDay(e.paid_on)}</span>
                  <span className={`text-sm whitespace-nowrap ${e.amount_cents < 0 ? 'text-red-700' : 'text-gray-700'}`}>{e.amount_cents < 0 ? '' : '+'}{money(e.amount_cents, true)}</span>
                  <span className="ml-auto text-base font-extrabold text-gray-900 whitespace-nowrap">{money(runningCents, true)}</span>
                </div>
                <div className="text-xs text-gray-600 truncate">
                  {e.line_key ? LINE_BY_KEY[e.line_key]?.label.replace(/ \(.*\)$/, '') : <span className="text-amber-700 font-semibold">Needs a category (not added yet)</span>}
                  {' · '}{HOW[e.source]}{e.payer ? ` · ${e.payer}` : ''}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
      {goalCents > 0 && (
        <div className="mt-4 text-sm text-gray-700">
          <div className="h-3 bg-white border border-teal-200 rounded-full" role="img" aria-label={`${Math.round((total / goalCents) * 100)} percent of the month's goal`}>
            <div className="h-full rounded-full bg-teal-600" style={{ width: `${pct * 100}%` }} />
          </div>
          <p className="text-xs text-gray-600 mt-1">{Math.round((total / goalCents) * 100)}% of the month&apos;s goal ({money(goalCents)})</p>
        </div>
      )}
    </div>
  );
}
