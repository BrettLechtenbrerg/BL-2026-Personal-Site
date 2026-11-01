//==============================================================================
// BL Power Hub — Budget loaders (service-role Supabase; server only)
//==============================================================================
import type { SupabaseClient } from '@supabase/supabase-js';
import { daysInMonth, summarizeMonth, type EntryRow, type GoalRow, type MonthRow } from './budget';

export const ENTRY_COLS =
  'id, paid_on, source, amount_cents, quantity, hours, line_key, line_set_by, item, payer, reference, note, received_at, stripe_id, stripe_description, stripe_created_at, entered_by, created_at, updated_at, voided_at, voided_by, void_reason';

export const T = {
  months: 'bl_budget_months',
  goals: 'bl_budget_goals',
  entries: 'bl_budget_entries',
  settings: 'bl_budget_settings',
  reminders: 'bl_budget_reminder_log',
} as const;

export class MissingTablesError extends Error {}

export function check<T>(r: { data: T | null; error: { message: string } | null }): T {
  if (r.error) {
    if (/does not exist|schema cache/i.test(r.error.message)) throw new MissingTablesError(r.error.message);
    throw new Error(r.error.message);
  }
  return r.data as T;
}

export async function loadMonth(db: SupabaseClient, month: string) {
  const all = daysInMonth(month);
  const [first, last] = [all[0], all[all.length - 1]];
  const [config, goals, entries] = await Promise.all([
    db.from(T.months).select('month, note, prepared_by, prepared_at').eq('month', month).maybeSingle(),
    db.from(T.goals).select('line_key, est_count, unit_price_cents').eq('month', month),
    db.from(T.entries).select(ENTRY_COLS).gte('paid_on', first).lte('paid_on', last).order('paid_on').order('created_at'),
  ]);
  return {
    config: check(config) as MonthRow | null,
    goals: (check(goals) ?? []) as GoalRow[],
    entries: (check(entries) ?? []) as EntryRow[],
  };
}

export async function monthSummary(db: SupabaseClient, month: string, today: string) {
  const m = await loadMonth(db, month);
  return { ...m, summary: summarizeMonth({ month, today, goals: m.goals, entries: m.entries }) };
}
