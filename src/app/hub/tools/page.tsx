'use client';

//==============================================================================
// POWER HUB — My tools: one tile per dashboard with a live up/down dot.
//==============================================================================

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, Laptop, Loader2, MessageSquareQuote, RefreshCw } from 'lucide-react';
import { TOOLS, type ToolStatus } from '@/lib/my-tools';

function Dot({ s }: { s: ToolStatus | undefined }) {
  if (!s) return <span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-300" aria-label="Checking" />;
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${s.up ? 'bg-green-500' : 'bg-red-500'}`}
      role="img"
      aria-label={s.up ? 'Up' : 'Down'}
      title={s.up ? `Up (${s.code}, ${s.ms} ms)` : `Down (${s.code ?? 'no answer'})`}
    />
  );
}

export default function HubToolsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Record<string, ToolStatus>>({});
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch('/api/hub/tools', { cache: 'no-store' })
      .then(async (res) => {
        if (res.status === 401 || res.status === 503) { router.replace('/hub'); return null; }
        if (!res.ok) throw new Error('Status check failed.');
        return res.json();
      })
      .then((json) => {
        if (!json) return;
        setStatus(json.status ?? {});
        setCheckedAt(json.checkedAt ?? null);
      })
      .catch(() => setError('Could not check the dashboards just now. Try Refresh.'))
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(load, [load]);

  const refresh = () => {
    setLoading(true);
    setError(null);
    load();
  };

  return (
    <div className="px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-[#1A1A1A]">My tools</h1>
            <p className="text-sm text-[#4A4A4A] mt-1">
              Your dashboards in one place. Each keeps its own sign-in.
              {checkedAt && ` Checked ${new Date(checkedAt).toLocaleTimeString()}.`}
            </p>
          </div>
          <button onClick={refresh} disabled={loading}
            className="inline-flex items-center gap-2 px-4 min-h-[44px] rounded-lg bg-white border border-gray-200 text-sm font-semibold text-[#1A1A1A] hover:border-[#9B1B30] disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} Refresh
          </button>
        </div>

        {error && <p role="alert" className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

        <div className="grid gap-5 md:grid-cols-2">
          {TOOLS.map((tool) => {
            const [main, ...more] = tool.links;
            return (
              <section key={tool.id} aria-labelledby={`tool-${tool.id}`} className="flex flex-col rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
                <div className="flex items-center gap-2.5">
                  {main ? <Dot s={loading ? undefined : status[main.url]} /> : <Laptop size={16} className="text-[#4A4A4A]" aria-label="Runs on the iMac" />}
                  <h2 id={`tool-${tool.id}`} className="font-heading text-lg font-bold text-[#1A1A1A]">{tool.name}</h2>
                </div>
                <p className="mt-2 text-sm text-[#4A4A4A]">{tool.purpose}</p>

                {tool.local && (
                  <ul className="mt-3 space-y-1 text-sm text-[#1A1A1A] list-disc pl-5">
                    {tool.local.map((l) => <li key={l}>{l}</li>)}
                  </ul>
                )}
                {tool.notes?.map((n) => <p key={n} className="mt-3 text-xs text-[#7A1526] bg-[#E8C84A]/15 rounded-lg px-3 py-2">{n}</p>)}

                <div className="mt-auto pt-4 space-y-3">
                  {main && (
                    <a href={main.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 min-h-[44px] rounded-lg bg-[#9B1B30] text-white text-sm font-semibold hover:bg-[#7A1526]">
                      Open {main.label} <ExternalLink size={15} aria-hidden="true" />
                    </a>
                  )}
                  {main?.note && <p className="text-xs text-[#4A4A4A]">{main.note}</p>}
                  {more.map((l) => (
                    <p key={l.url} className="flex items-center gap-2 text-sm">
                      <Dot s={loading ? undefined : status[l.url]} />
                      <a href={l.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#9B1B30] underline">{l.label}</a>
                      {l.note && <span className="text-xs text-[#4A4A4A]">· {l.note}</span>}
                    </p>
                  ))}
                  <p className="flex items-center gap-2 text-xs text-[#4A4A4A]">
                    <MessageSquareQuote size={14} aria-hidden="true" /> To work on it with me, say “{tool.resume}”
                  </p>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
