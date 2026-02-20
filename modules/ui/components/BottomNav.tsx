'use client';

import { usePathname } from 'next/navigation';
import { useNavigator } from '@/lib/navigation';
import { LayoutDashboard, Shield, ScanFace, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Home', icon: LayoutDashboard, path: '/dashboard' },
  { key: 'vault', label: 'Vault', icon: Shield, path: '/vault' },
  { key: 'scan', label: 'Scan', icon: ScanFace, path: '/scan' },
  { key: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const nav = useNavigator();

  const handleNav = (path: string) => {
    switch (path) {
      case '/dashboard': nav.goToDashboard(); break;
      case '/vault': nav.goToVault(); break;
      case '/scan': nav.goToScan(); break;
      case '/settings': nav.goToSettings(); break;
    }
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t px-2 pb-[env(safe-area-inset-bottom)] pt-2"
      style={{
        background: 'var(--background)',
        borderColor: 'var(--border)',
        backdropFilter: 'blur(40px)',
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map(({ key, label, icon: Icon, path }) => {
        const isActive = pathname === path;
        return (
          <button
            key={key}
            onClick={() => handleNav(path)}
            className={cn(
              'flex flex-col items-center gap-0.5 rounded-2xl px-4 py-2 text-xs transition-colors',
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon
              className="h-5 w-5"
              style={isActive ? { color: '#00F5FF' } : undefined}
            />
            <span
              className={cn(
                'text-[10px]',
                isActive ? 'font-medium' : 'font-normal'
              )}
              style={isActive ? { color: '#00F5FF' } : undefined}
            >
              {label}
            </span>
            {isActive && (
              <div
                className="mt-0.5 h-0.5 w-4 rounded-full"
                style={{ background: '#00F5FF' }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
