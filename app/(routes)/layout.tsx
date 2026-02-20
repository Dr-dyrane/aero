'use client';

import { usePathname } from 'next/navigation';
import { BottomNav } from '@/modules/ui/components/BottomNav';

const HIDE_NAV_ROUTES = ['/auth'];

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNav = !HIDE_NAV_ROUTES.some((r) => pathname.startsWith(r));

  return (
    <>
      <div className="aero-bg-glow" />
      <div className="relative z-10">{children}</div>
      {showNav && <BottomNav />}
    </>
  );
}
