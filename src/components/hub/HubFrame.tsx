'use client';

import { usePathname } from 'next/navigation';
import HubShell from './HubShell';

/** The login page (/hub) stands alone; every other hub page gets the Power Hub menu. */
export default function HubFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  if (pathname === '/hub' || pathname === '/hub/') return <>{children}</>;
  return <HubShell>{children}</HubShell>;
}
