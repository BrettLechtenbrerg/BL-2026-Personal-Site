'use client';

import { BUDGET_LINES, SECTIONS } from '@/lib/budget';

export default function LineSelect({ value, onChange, id, allowNone, className, label }: {
  value: string | null; onChange: (key: string | null) => void; id?: string; allowNone?: boolean; className?: string; label?: string;
}) {
  return (
    <select id={id} aria-label={label} value={value ?? ''} onChange={(e) => onChange(e.target.value || null)}
      className={className ?? 'px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white min-h-[40px]'}>
      <option value="">{allowNone ? '— Needs a category —' : 'Choose an income line…'}</option>
      {SECTIONS.map((s) => (
        <optgroup key={s} label={s}>
          {BUDGET_LINES.filter((c) => c.section === s).map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
        </optgroup>
      ))}
    </select>
  );
}
