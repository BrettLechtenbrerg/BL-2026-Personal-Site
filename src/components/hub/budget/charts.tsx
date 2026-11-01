'use client';

//==============================================================================
// BL Budget — small SVG charts (no chart package). Colours: green = on pace,
// amber = a little behind, red = behind; dark tick = where we should be today.
// Ported from PMMA's components/power-hub/budget/charts.tsx (no MSI billing).
//==============================================================================

import { money, paceStatus } from '@/lib/budget';

export const STATUS = {
  good: { color: '#15803D', pill: 'bg-green-100 text-green-800', label: 'On pace' },
  warn: { color: '#D97706', pill: 'bg-amber-100 text-amber-800', label: 'A little behind' },
  bad: { color: '#B91C1C', pill: 'bg-red-100 text-red-800', label: 'Behind' },
} as const;

export function Pill({ actual, pace, text }: { actual: number; pace: number; text?: string }) {
  const s = STATUS[paceStatus(actual, pace)];
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${s.pill}`}>{text ?? s.label}</span>;
}

export function Gauge({ actual, goal, pace }: { actual: number; goal: number; pace: number }) {
  const R = 90, cx = 120, cy = 110;
  const pct = goal > 0 ? actual / goal : 0;
  const pp = goal > 0 ? Math.min(pace / goal, 1) : 0;
  const pt = (p: number, r = R) => [cx + r * Math.cos(Math.PI * (1 - p)), cy - r * Math.sin(Math.PI * (1 - p))];
  const [x1, y1] = pt(Math.min(Math.max(pct, 0.001), 1));
  const color = STATUS[paceStatus(actual, pace)].color;
  const [ax, ay] = pt(pp, R - 16), [bx, by] = pt(pp, R + 16);
  return (
    <svg viewBox="0 0 240 135" className="w-full max-w-[320px] mx-auto block" role="img" aria-label={`${Math.round(pct * 100)} percent of the month's goal`}>
      <path d="M30 110 A90 90 0 0 1 210 110" fill="none" stroke="#FFFFFF" strokeWidth="22" strokeLinecap="round" />
      {pct > 0 && <path d={`M30 110 A90 90 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`} fill="none" stroke={color} strokeWidth="22" strokeLinecap="round" />}
      {goal > 0 && <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#111827" strokeWidth="3" />}
      <text x="120" y="92" textAnchor="middle" fontSize="30" fontWeight="800" fill="#111827">{Math.round(pct * 100)}%</text>
      <text x="120" y="112" textAnchor="middle" fontSize="11" fill="#6B7280">of the month&apos;s goal</text>
    </svg>
  );
}

export function PaceChart({ days, goal, elapsed }: { days: { date: string; salesCents: number }[]; goal: number; elapsed: number }) {
  const N = days.length;
  const W = 760, H = 240, L = 72, B = 26, T = 14;
  const running: number[] = [];
  days.slice(0, elapsed).forEach((d, i) => running.push((running[i - 1] ?? 0) + d.salesCents));
  const cum = running[running.length - 1] ?? 0;
  const max = Math.max(goal, cum, 1) * 1.05;
  const X = (i: number) => L + ((W - L - 12) * i) / Math.max(N, 1);
  const Y = (v: number) => T + (H - T - B) * (1 - Math.max(v, 0) / max);
  const pts: [number, number][] = [[X(0), Y(0)], ...running.map((v, i) => [X(i + 1), Y(v)] as [number, number])];
  const last = pts[pts.length - 1];
  const ticks = goal > 0 ? [0, 0.25, 0.5, 0.75, 1].map((f) => goal * f) : [0, max / 2, max];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Running total ${money(cum)} against a goal of ${money(goal)}`}>
      {ticks.map((v) => (
        <g key={v}>
          <line x1={L} x2={W - 12} y1={Y(v)} y2={Y(v)} stroke="#F3F4F6" />
          <text x={L - 6} y={Y(v) + 4} textAnchor="end" fontSize="11" fill="#6B7280">{money(v)}</text>
        </g>
      ))}
      {days.map((d, i) => (i % 3 === 0 || i === N - 1) && (
        <text key={d.date} x={X(i + 1)} y={H - 8} textAnchor="middle" fontSize="11" fill="#6B7280">{Number(d.date.slice(8))}</text>
      ))}
      {goal > 0 && <line x1={X(0)} y1={Y(0)} x2={X(N)} y2={Y(goal)} stroke="#D1D5DB" strokeWidth="3" strokeDasharray="6 5" />}
      {goal > 0 && <line x1={L} x2={W - 12} y1={Y(goal)} y2={Y(goal)} stroke="#D4AF37" strokeWidth="2" />}
      <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke="#9B1B30" strokeWidth="4" strokeLinejoin="round" />
      {elapsed > 0 && (
        <>
          <line x1={X(elapsed)} x2={X(elapsed)} y1={T} y2={H - B} stroke="#E5E7EB" strokeDasharray="3 3" />
          <circle cx={last[0]} cy={last[1]} r="6" fill="#9B1B30" />
          <text x={Math.min(last[0] + 10, W - 130)} y={Math.max(last[1] - 8, 14)} fontSize="13" fontWeight="700" fill="#111827">So far {money(cum)}</text>
        </>
      )}
    </svg>
  );
}

export function DayBars({ days, target, today, selected, onSelect }: {
  days: { date: string; salesCents: number }[];
  target: number; today: string; selected: string | null; onSelect: (d: string) => void;
}) {
  const N = days.length, W = 520, H = 170, B = 22;
  const max = Math.max(target * 1.4, ...days.map((d) => d.salesCents), 1);
  const bw = (W - 20) / Math.max(N, 1);
  const Y = (v: number) => 10 + (H - 10 - B) * (1 - Math.max(v, 0) / max);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Money in by day">
      {days.map((d, i) => {
        const x = 10 + i * bw, future = d.date > today, sel = d.date === selected;
        return (
          <g key={d.date} onClick={() => onSelect(d.date)} className="cursor-pointer">
            <title>{`${d.date}: ${money(d.salesCents)}`}</title>
            <rect x={x + 1} y={10} width={bw - 2} height={H - B - 10} fill={sel ? '#FDF2F4' : 'transparent'} />
            {!future && d.salesCents > 0 && (
              <rect x={x + 2} y={Y(d.salesCents)} width={bw - 4} height={H - B - Y(d.salesCents)} fill="#9B1B30" rx="2" />
            )}
            {(i % 2 === 0 || sel) && (
              <text x={x + bw / 2} y={H - 6} fontSize="10" textAnchor="middle" fill={sel ? '#111827' : '#6B7280'} fontWeight={sel ? 800 : 400}>{Number(d.date.slice(8))}</text>
            )}
          </g>
        );
      })}
      {target > 0 && (
        <>
          <line x1="10" x2={W - 10} y1={Y(target)} y2={Y(target)} stroke="#111827" strokeDasharray="5 4" />
          <text x={W - 10} y={Y(target) - 5} fontSize="11" textAnchor="end" fill="#111827">Target {money(target)}/day</text>
        </>
      )}
    </svg>
  );
}

export function LineBar({ actual, goal, pace }: { actual: number; goal: number; pace: number }) {
  const color = goal > 0 ? STATUS[paceStatus(actual, pace)].color : '#9CA3AF';
  const w = goal > 0 ? Math.min(Math.max(actual, 0) / goal, 1) * 100 : actual > 0 ? 100 : 0;
  const m = goal > 0 ? Math.min(pace / goal, 1) * 100 : null;
  return (
    <div className="relative h-4 bg-white border border-black/5 rounded-lg mt-1.5">
      <div className="absolute inset-y-0 left-0 rounded-lg" style={{ width: `${w}%`, background: color }} />
      {m !== null && <div className="absolute -top-1 -bottom-1 w-[3px] bg-gray-900 rounded" style={{ left: `calc(${m}% - 1px)` }} />}
    </div>
  );
}
