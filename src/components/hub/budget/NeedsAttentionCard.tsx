'use client';

//==============================================================================
// BL Budget — needs attention: payments with no income line, and checks or
// bank transfers entered but not yet seen in the bank (any month).
//==============================================================================

import { CheckCircle2 } from 'lucide-react';
import { SOURCE_LABEL, money, type EntryRow } from '@/lib/budget';
import LineSelect from './LineSelect';
import { budgetAction, fmtDay } from './api';

export default function NeedsAttentionCard({ uncategorized, awaiting, onChanged, onError }: {
  uncategorized: EntryRow[]; awaiting: EntryRow[]; onChanged: (m?: string) => void; onError: (m: string) => void;
}) {
  async function act(body: Record<string, unknown>, msg: string) {
    try { await budgetAction(body); onChanged(msg); }
    catch (e) { onError(e instanceof Error ? e.message : 'That did not save.'); }
  }
  if (!uncategorized.length && !awaiting.length) {
    return <p className="flex items-center gap-2 text-[15px] text-green-800"><CheckCircle2 size={18} /> All clear: every payment has a line and every check is in the bank.</p>;
  }
  return (
    <div className="space-y-4">
      {uncategorized.length > 0 && (
        <div>
          <p className="font-semibold text-amber-900 text-[15px]">{uncategorized.length} payment{uncategorized.length === 1 ? '' : 's'} need{uncategorized.length === 1 ? 's' : ''} a category</p>
          <ul className="mt-1.5 space-y-2">
            {uncategorized.map((e) => (
              <li key={e.id} className="text-sm text-gray-900">
                <div className="flex justify-between gap-2"><b>{money(e.amount_cents, true)}</b><span className="text-gray-600">{fmtDay(e.paid_on)}</span></div>
                <div className="text-gray-600 text-xs truncate">{e.stripe_description ? `“${e.stripe_description}”` : e.item ?? 'no description'}{e.payer ? ` · ${e.payer}` : ''}</div>
                <LineSelect value={null} allowNone label={`Income line for ${money(e.amount_cents, true)} on ${fmtDay(e.paid_on)}`}
                  className="mt-1 w-full px-2 py-1.5 border border-amber-300 rounded-lg text-sm text-gray-900 bg-white min-h-[40px]"
                  onChange={(k) => { if (k) act({ action: 'set_line', id: e.id, line_key: k }, 'Income line saved.'); }} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {awaiting.length > 0 && (
        <div>
          <p className="font-semibold text-amber-900 text-[15px]">{awaiting.length} not in the bank yet</p>
          <ul className="mt-1.5 space-y-2">
            {awaiting.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-2 text-sm text-gray-900">
                <span><b>{money(e.amount_cents, true)}</b> <span className="text-gray-600">{SOURCE_LABEL[e.source]} · {fmtDay(e.paid_on)}{e.payer ? ` · ${e.payer}` : ''}</span></span>
                <button onClick={() => act({ action: 'set_received', id: e.id, received: true }, 'Marked received.')}
                  className="shrink-0 inline-flex items-center gap-1 px-2 py-1.5 min-h-[36px] text-xs text-green-800 border border-green-300 bg-white rounded-lg hover:bg-green-50">
                  <CheckCircle2 size={14} /> In the bank
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
