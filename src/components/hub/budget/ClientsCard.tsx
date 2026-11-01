'use client';

//==============================================================================
// BL Budget — clients: group members, individual clients, consulting
// engagements and hours billed, each against the month's estimate.
//==============================================================================

import { type MonthSummary } from '@/lib/budget';
import { fmtHours } from './api';

export default function ClientsCard({ summary }: { summary: MonthSummary }) {
  return (
    <div className="space-y-3">
      {summary.clients.map((c) => {
        const pct = c.est > 0 ? Math.min(c.actual / c.est, 1) * 100 : c.actual > 0 ? 100 : 0;
        const actual = c.unit === 'hours' ? fmtHours(c.actual) : String(c.actual);
        return (
          <div key={c.key}>
            <div className="flex justify-between gap-3 text-[15px]">
              <span className="text-gray-700">{c.label}</span>
              <span><b className="text-gray-900">{actual}</b> <span className="text-gray-500 text-sm">of {c.est} {c.unit}</span></span>
            </div>
            <div className="h-2.5 bg-white border border-black/5 rounded-full mt-1">
              <div className="h-full rounded-full bg-[#9B1B30]" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
      <p className="text-xs text-gray-500">Counts are paid payments this month (refunds left out). Hours = hourly payments ÷ $500, unless entered.</p>
    </div>
  );
}
