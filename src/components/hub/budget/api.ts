'use client';

import type { EntryRow, GoalRow, MonthRow } from '@/lib/budget';

export interface SyncStatus { ok: boolean; at: string; fetched: number; inserted: number; warnings: string[]; error?: string }
export interface BudgetData {
  month: string; today: string;
  config: MonthRow | null; goals: GoalRow[]; entries: EntryRow[];
  awaitingReceipt: EntryRow[];
  nextMonthReady: boolean;
  sync: SyncStatus | null;
  remindersOn: boolean;
  stripeConnected: boolean;
}

function signedOut(status: number) {
  if (status === 401 && typeof window !== 'undefined') window.location.replace('/hub');
}

export async function loadBudget(month: string): Promise<BudgetData> {
  const res = await fetch(`/api/hub/budget?month=${encodeURIComponent(month)}`, { cache: 'no-store' });
  const data = await res.json().catch(() => ({}));
  signedOut(res.status);
  if (!res.ok) throw new Error(data.error || 'Could not load the budget.');
  return data as BudgetData;
}

export async function budgetAction<T = Record<string, unknown>>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch('/api/hub/budget', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  signedOut(res.status);
  if (!res.ok) throw new Error(data.error || 'That did not save.');
  return data as T;
}

export function fmtDay(ymd: string, long = false): string {
  return new Date(`${ymd}T12:00:00Z`).toLocaleDateString('en-US', {
    weekday: long ? 'long' : 'short', month: long ? 'long' : 'short', day: 'numeric', timeZone: 'UTC',
  });
}
export function fmtTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', { timeZone: 'America/Denver', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}
export const fmtHours = (h: number) => `${Number.isInteger(h) ? h : h.toFixed(2).replace(/0$/, '')} hr${h === 1 ? '' : 's'}`;
