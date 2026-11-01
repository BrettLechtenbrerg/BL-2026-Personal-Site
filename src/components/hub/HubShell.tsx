'use client';

//==============================================================================
// BL POWER HUB — shell: left menu (desktop) / top bar + drawer (phone)
//==============================================================================
// Wraps every /hub page except the login (src/app/hub/layout.tsx). Confirms
// the signed session cookie first and sends anyone without one back to /hub.
// The real security boundary stays server-side: every /api/hub/* route calls
// requireHubSession(). CRM gets its own menu item when Edge CRM Phase 2 lands.
//==============================================================================

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, GraduationCap, Loader2, LogOut, Menu, MessageSquare, Settings2, Users, X } from 'lucide-react';

const NAV = [
  { href: '/hub/budget', label: 'Dashboard (Budget)', icon: BarChart3 },
  { href: '/hub/budget/setup', label: 'Monthly Setup', icon: Settings2 },
  { href: '/hub/messaging', label: 'Messaging', icon: MessageSquare },
  { href: '/hub/academy', label: 'Academy', icon: GraduationCap },
] as const;

function isActive(pathname: string, href: string) {
  if (href === '/hub/budget') return pathname === '/hub/budget';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function HubShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const router = useRouter();
  const [ok, setOk] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/hub/auth', { cache: 'no-store' })
      .then((r) => {
        if (cancelled) return;
        if (r.ok) setOk(true);
        else router.replace('/hub');
      })
      .catch(() => { if (!cancelled) setOk(true); }); // network hiccup: the API guards still apply
    return () => { cancelled = true; };
  }, [router]);

  async function signOut() {
    await fetch('/api/hub/auth', { method: 'DELETE' }).catch(() => {});
    router.replace('/hub');
  }

  if (!ok) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-[#9B1B30] animate-spin" aria-label="Checking your login" />
      </div>
    );
  }

  const menu = (
    <nav aria-label="Power Hub" className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <Image src="/icon-192.png" alt="" width={40} height={40} className="rounded-lg" />
        <div>
          <p className="font-heading font-extrabold text-white leading-tight">Power Hub</p>
          <p className="text-xs text-[#E8C84A]">Brett Lechtenberg</p>
        </div>
      </div>
      <ul className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? 'page' : undefined} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-lg text-[15px] font-semibold transition-colors ${active ? 'bg-[#9B1B30] text-white shadow' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                <Icon size={18} className={active ? 'text-[#E8C84A]' : ''} /> {label}
              </Link>
            </li>
          );
        })}
        <li>
          <span aria-disabled="true" className="flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-lg text-[15px] font-semibold text-white/55 cursor-default">
            <Users size={18} /> CRM <span className="ml-auto text-[11px] font-bold uppercase tracking-wide text-[#D4AF37]">soon</span>
          </span>
        </li>
      </ul>
      <div className="px-3 py-4 border-t border-white/10">
        <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-lg text-[15px] text-white/80 hover:bg-white/10 hover:text-white">
          <LogOut size={18} /> Sign out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-[#1A1A1A] to-[#2A0E14] z-30">{menu}</aside>

      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#9B1B30] to-[#7A1526] shadow">
        <div className="flex items-center gap-2.5">
          <Image src="/icon-192.png" alt="" width={34} height={34} className="rounded-md" />
          <span className="font-heading font-extrabold text-white">Power Hub</span>
        </div>
        <button onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="p-2 min-h-[44px] min-w-[44px] grid place-items-center text-white">
          <Menu size={22} />
        </button>
      </div>
      {open && (
        <div className="lg:hidden fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Power Hub menu">
          <button className="absolute inset-0 bg-black/50" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-gradient-to-b from-[#1A1A1A] to-[#2A0E14] shadow-xl">
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute top-3 right-3 p-2 text-white/80 hover:text-white"><X size={20} /></button>
            {menu}
          </div>
        </div>
      )}

      <main className="lg:pl-64">{children}</main>
    </div>
  );
}
