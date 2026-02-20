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

  const getPageConfig = (path: string) => {
    if (path.startsWith('/dashboard')) return { title: 'Aero Terminal', scrollSensitive: true };
    if (path.startsWith('/vault')) return { title: 'Bio-Vault', scrollSensitive: true };
    if (path.startsWith('/scan')) return { title: 'Triple-Check', scrollSensitive: true };
    if (path.startsWith('/settings')) return { title: 'Settings', scrollSensitive: true };
    return { title: '', scrollSensitive: true };
  };

  const config = getPageConfig(pathname);

  return (
    <>
      <div className="aero-bg-glow" />
      {showNav && <TopNav title={config.title} scrollSensitivity={config.scrollSensitive} />}
      <div className="relative z-10">{children}</div>
      {showNav && <BottomNav />}
    </>
  );
}
