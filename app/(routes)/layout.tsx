'use client';

import { usePathname } from 'next/navigation';
import { BottomNav, TopNav } from '@/modules/ui';

const HIDE_NAV_ROUTES = ['/auth'];

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNav = !HIDE_NAV_ROUTES.some((r) => pathname.startsWith(r));

  const getPageTitle = (path: string) => {
    if (path.startsWith('/dashboard')) return 'Aero Terminal';
    if (path.startsWith('/vault')) return 'Bio-Vault';
    if (path.startsWith('/scan')) return 'Triple-Check';
    if (path.startsWith('/settings')) return 'Settings';
    return '';
  };

  return (
    <>
      <div className="aero-bg-glow" />
      {showNav && <TopNav title={getPageTitle(pathname)} />}
      <div className="relative z-10">{children}</div>
      {showNav && <BottomNav />}
    </>
  );
}
