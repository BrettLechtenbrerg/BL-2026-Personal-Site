'use client';

//==============================================================================
// BL Budget — add a payment (check, bank transfer, cash, other) + the list
//==============================================================================

import { useState } from 'react';
import { Ban, Banknote, CheckCircle2, CreditCard, FileCheck, Landmark, Loader2, Plus, Wallet } from 'lucide-react';
import {
  BUDGET_START, HOURLY_KEY, HOURLY_RATE_CENTS, LINE_BY_KEY, NEEDS_RECEIPT, NOT_COUNTED_KEY, SOURCE_LABEL, entryHours, money,
  parseDollars, parseHours, type EntryRow, type Source,
} from '@/lib/budget';
import LineSelect from './LineSelect';
import { budgetAction, fmtDay, fmtHours, fmtTime } from './api';

export const SOURCE_ICON = { stripe: CreditCard, check: FileCheck, transfer: Landmark, cash: Banknote, other: Wallet } as const;
const HAND: Exclude<Source, 'stripe'>[] = ['check', 'transfer', 'cash', 'other'];
const SHORT: Record<Source, string> = { stripe: 'Stripe', check: 'Check', transfer: 'Bank transfer', cash: 'Cash', other: 'Other' };

export default function EntriesPanel({ defaultDay, today, entries, onChanged, onError }: {
  defaultDay: string; today: string; entries: EntryRow[];
  onChanged: (msg?: string) => void; onError: (msg: string) => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const empty = { amount: '', hours: '', quantity: '1', item: '', payer: '', reference: '', note: '' };
  const [form, setForm] = useState({ source: 'check' as Exclude<Source, 'stripe'>, line: null as string | null, paid_on: '', received: false, ...empty });
  const paidOn = form.paid_on || (defaultDay <= today ? defaultDay : today);
  const hourly = form.line === HOURLY_KEY;
  const hoursAmount = hourly && parseHours(form.hours) ? Math.round(parseHours(form.hours)! * HOURLY_RATE_CENTS) : null;

  async function run(id: string, body: Record<string, unknown>, msg?: string) {
    setBusy(id);
    try { await budgetAction(body); onChanged(msg); }
    catch (e) { onError(e instanceof Error ? e.message : 'That did not save.'); }
    finally { setBusy(null); }
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.line) return onError('Choose the income line.');
    const typed = form.amount.trim() ? parseDollars(form.amount) : null;
    if (form.amount.trim() && (!typed || typed <= 0)) return onError('Enter the amount, e.g. 2500 or 1,500.00.');
    if (hourly && form.hours.trim() && !parseHours(form.hours)) return onError('Hours must be a number like 2 or 1.5.');
    const cents = typed ?? hoursAmount;
    if (!cents) return onError(hourly ? 'Enter the hours (or the amount).' : 'Enter the amount, e.g. 2500 or 1,500.00.');
    const qty = Number(form.quantity || '1');
    await run('add', {
      action: 'add_entry', source: form.source, paid_on: paidOn, amount_cents: cents, line_key: form.line,
      hours: hourly && form.hours.trim() ? form.hours.trim() : undefined,
      quantity: Number.isInteger(qty) && qty > 0 ? qty : 1, item: form.item, payer: form.payer,
      reference: form.reference, note: form.note, received: form.received,
    }, `${SHORT[form.source]} ${money(cents, true)} saved.`);
    setForm((f) => ({ ...f, ...empty }));
  }

  const input = 'px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white min-h-[40px] w-full';
  const refLabel = form.source === 'check' ? 'Check #' : form.source === 'transfer' ? 'Transfer / wire ref' : 'Reference';
  const sorted = [...entries].sort((a, b) => (a.paid_on < b.paid_on ? 1 : a.paid_on > b.paid_on ? -1 : (b.stripe_created_at ?? b.created_at).localeCompare(a.stripe_created_at ?? a.created_at)));

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="bg-white border border-[#F0C4CD] rounded-xl p-4 space-y-3" aria-label="Add a payment">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-gray-900 mr-1">Add a payment</span>
          {HAND.map((s) => (
            <button key={s} type="button" onClick={() => setForm({ ...form, source: s })} aria-pressed={form.source === s}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold border min-h-[40px] ${form.source === s ? 'bg-[#9B1B30] text-white border-[#9B1B30]' : 'bg-white text-gray-700 border-gray-300'}`}>
              {SOURCE_LABEL[s]}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <label className="text-xs text-gray-600 col-span-2">Income line
            <LineSelect value={form.line} onChange={(k) => setForm({ ...form, line: k })} className={input} />
          </label>
          <label className="text-xs text-gray-600">Date paid
            <input type="date" value={paidOn} min={BUDGET_START} max={today} onChange={(e) => setForm({ ...form, paid_on: e.target.value })} className={input} />
          </label>
          {hourly ? (
            <label className="text-xs text-gray-600">Hours
              <input inputMode="decimal" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} placeholder="2" className={input} />
            </label>
          ) : (
            <label className="text-xs text-gray-600">How many
              <input inputMode="numeric" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value.replace(/\D/g, '') })} className={input} />
            </label>
          )}
          <label className="text-xs text-gray-600">Amount ($)
            <input inputMode="decimal" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder={hoursAmount ? (hoursAmount / 100).toFixed(0) : '2500'} className={input} />
            {hourly && <span className="text-[11px] text-gray-500">{hoursAmount ? `${form.hours} × $500 = ${money(hoursAmount)}` : 'Blank = hours × $500'}</span>}
          </label>
          <label className="text-xs text-gray-600">Client / company
            <input value={form.payer} onChange={(e) => setForm({ ...form, payer: e.target.value })} maxLength={120} className={input} />
          </label>
          <label className="text-xs text-gray-600">{refLabel} (optional)
            <input value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} maxLength={60} className={input} />
          </label>
          <label className="text-xs text-gray-600">What for (optional)
            <input value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} placeholder="e.g. November retainer" maxLength={200} className={input} />
          </label>
          <label className="text-xs text-gray-600 col-span-2 lg:col-span-3">Note (optional)
            <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} maxLength={300} className={input} />
          </label>
          <div className="flex items-end col-span-2 lg:col-span-1">
            <button type="submit" disabled={busy === 'add'} className="w-full flex items-center justify-center gap-2 px-4 py-2 min-h-[40px] bg-[#9B1B30] text-white rounded-lg font-semibold disabled:opacity-50">
              {busy === 'add' ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Save
            </button>
          </div>
        </div>
        {NEEDS_RECEIPT.includes(form.source) && (
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" className="w-4 h-4" checked={form.received} onChange={(e) => setForm({ ...form, received: e.target.checked })} />
            Already in the bank (leave unticked and it waits under &ldquo;Needs attention&rdquo; until it clears)
          </label>
        )}
      </form>

      {sorted.length === 0 ? (
        <p className="text-sm text-gray-600">No payments here yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white border border-[#F0C4CD] rounded-xl px-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-200">
                <th className="py-2 pr-3">Paid</th><th className="py-2 pr-3 text-right">Amount</th><th className="py-2 pr-3">Income line</th>
                <th className="py-2 pr-3">Who / what</th><th className="py-2 pr-3">Entered</th><th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((e) => {
                const Icon = SOURCE_ICON[e.source];
                const waiting = NEEDS_RECEIPT.includes(e.source) && !e.received_at && !e.voided_at;
                const hrs = e.line_key === HOURLY_KEY ? entryHours(e) : 0;
                return (
                  <tr key={e.id} className={`border-b border-gray-100 align-top ${e.voided_at ? 'opacity-50' : ''}`}>
                    <td className="py-2 pr-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 font-medium text-gray-900"><Icon size={15} /> {SHORT[e.source]}</span>
                      <div className="text-xs text-gray-500">{fmtDay(e.paid_on)}</div>
                      {e.reference && <div className="text-xs text-gray-500">#{e.reference}</div>}
                    </td>
                    <td className={`py-2 pr-3 text-right font-semibold whitespace-nowrap ${e.voided_at ? 'line-through' : ''} ${e.amount_cents < 0 ? 'text-red-700' : 'text-gray-900'}`}>
                      {money(e.amount_cents, true)}
                      {hrs !== 0 && <div className="text-xs font-normal text-gray-500">{fmtHours(hrs)}</div>}
                      {e.quantity > 1 && <div className="text-xs font-normal text-gray-500">× {e.quantity}</div>}
                    </td>
                    <td className="py-2 pr-3 min-w-[220px]">
                      {e.voided_at ? (
                        <span className="text-gray-600">{e.line_key ? LINE_BY_KEY[e.line_key]?.label : '—'}</span>
                      ) : (
                        <LineSelect value={e.line_key} allowNone label="Income line" onChange={(k) => run(e.id, { action: 'set_line', id: e.id, line_key: k }, 'Income line saved.')} />
                      )}
                      {!e.line_key && !e.voided_at && <div className="text-xs font-semibold text-amber-700 mt-1">Needs a category</div>}
                      {e.line_key === NOT_COUNTED_KEY && <div className="text-xs text-gray-500 mt-1">Kept on record, not counted</div>}
                      {e.stripe_description && <div className="text-xs text-gray-500 mt-1">Stripe: &ldquo;{e.stripe_description}&rdquo;</div>}
                    </td>
                    <td className="py-2 pr-3 text-gray-700">
                      {e.payer && <div>{e.payer}</div>}
                      {e.item && <div className="text-gray-500">{e.item}</div>}
                      {e.note && <div className="text-xs text-gray-500">{e.note}</div>}
                    </td>
                    <td className="py-2 pr-3 text-xs text-gray-500 whitespace-nowrap">
                      {e.entered_by}<div>{fmtTime(e.stripe_created_at ?? e.created_at)}</div>
                      {waiting && <div className="font-semibold text-amber-700">Not in the bank yet</div>}
                      {e.voided_at && <div className="text-red-700">voided{e.void_reason ? `: ${e.void_reason}` : ''}</div>}
                    </td>
                    <td className="py-2 text-right whitespace-nowrap space-y-1">
                      {waiting && (
                        <button disabled={busy === e.id} onClick={() => run(e.id, { action: 'set_received', id: e.id, received: true }, 'Marked received.')}
                          className="inline-flex items-center gap-1 px-2 py-1.5 min-h-[36px] text-xs text-green-800 border border-green-300 bg-green-50 rounded-lg hover:bg-green-100">
                          <CheckCircle2 size={14} /> In the bank
                        </button>
                      )}
                      {e.source !== 'stripe' && !e.voided_at && (
                        <button disabled={busy === e.id} title="Void (kept on record, not counted)"
                          onClick={() => {
                            const reason = window.prompt(`Void ${SHORT[e.source]} ${money(e.amount_cents, true)}? It stays on record but no longer counts.\n\nReason (optional):`, '');
                            if (reason !== null) run(e.id, { action: 'void', id: e.id, reason }, 'Payment voided.');
                          }}
                          className="ml-1 inline-flex items-center gap-1 px-2 py-1.5 min-h-[36px] text-xs text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                          <Ban size={14} /> Void
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
