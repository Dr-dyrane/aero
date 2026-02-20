'use client';

import { AeroCard } from '@/modules/ui/components/AeroCard';
import { AeroPill } from '@/modules/ui/components/AeroPill';
import { AeroButton } from '@/modules/ui/components/AeroButton';
import { useTheme } from '@/modules/ui/providers/ThemeProvider';
import { useAuth } from '@/modules/auth';
import { useAeroStore } from '@/store/useAeroStore';
import { useNavigator } from '@/lib/navigation';
import { ArrowLeft, Sun, Moon, Monitor, Shield, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, signOut } = useAuth();
  const demoMode = useAeroStore((s) => s.demoMode);
  const setDemoMode = useAeroStore((s) => s.setDemoMode);
  const nav = useNavigator();

  const handleSignOut = async () => {
    await signOut();
    setDemoMode(false);
    nav.goToAuth();
  };

  const themes = [
    { key: 'eclipse' as const, label: 'Eclipse', icon: Moon, desc: 'Dark theme' },
    { key: 'cloud' as const, label: 'Cloud', icon: Sun, desc: 'Light theme' },
    { key: 'system' as const, label: 'System', icon: Monitor, desc: 'Follow system' },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center px-4 pb-282">
      {/* Header handled by TopNav */}
      <div className="h-4" />

      {/* Profile */}
      <AeroCard className="w-full max-w-sm">
        <div className="flex items-center gap-3 p-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full font-serif text-lg font-bold"
            style={{ background: 'rgba(0, 245, 255, 0.15)', color: '#00F5FF' }}
          >
            {user?.name?.charAt(0) ?? 'A'}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{user?.name ?? 'Aero User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email ?? 'user@aero.health'}</p>
          </div>
          {demoMode && <AeroPill variant="accent">DEMO</AeroPill>}
        </div>
      </AeroCard>

      {/* Demo Mode Toggle */}
      <AeroCard className="mt-3 w-full max-w-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: 'rgba(212, 175, 55, 0.1)' }}
            >
              <Shield className="h-5 w-5" style={{ color: '#D4AF37' }} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Demo Mode</p>
              <p className="text-xs text-muted-foreground">
                Bypass auth, use placeholder data
              </p>
            </div>
          </div>
          <button
            onClick={() => setDemoMode(!demoMode)}
            className="relative h-6 w-11 rounded-full transition-colors"
            style={{
              background: demoMode ? '#00F5FF' : 'var(--surface-translucent)',
            }}
            aria-label="Toggle demo mode"
            role="switch"
            aria-checked={demoMode}
          >
            <span
              className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full transition-transform"
              style={{
                background: demoMode ? '#050505' : 'var(--muted-foreground)',
                transform: demoMode ? 'translateX(20px)' : 'translateX(0)',
              }}
            />
          </button>
        </div>
      </AeroCard>

      {/* Theme Selection */}
      <div className="mt-6 w-full max-w-sm">
        <h2 className="mb-3 font-serif text-sm font-medium text-foreground">
          Appearance
        </h2>
        <div className="flex flex-col gap-2">
          {themes.map(({ key, label, icon: Icon, desc }) => {
            const isActive = theme === key || (theme === 'system' && key === 'system') || (theme !== 'system' && resolvedTheme === key && theme === key);
            return (
              <AeroCard key={key}>
                <button
                  onClick={() => setTheme(key)}
                  className="flex w-full items-center gap-3 p-3"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{
                      background: isActive
                        ? 'rgba(0, 245, 255, 0.15)'
                        : 'var(--surface-translucent)',
                    }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: isActive ? '#00F5FF' : 'var(--muted-foreground)' }}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <div
                    className="h-4 w-4 rounded-full border-2"
                    style={{
                      borderColor: isActive ? '#00F5FF' : 'var(--border)',
                      background: isActive ? '#00F5FF' : 'transparent',
                    }}
                  />
                </button>
              </AeroCard>
            );
          })}
        </div>
      </div>

      {/* Sign Out */}
      <div className="mt-6 w-full max-w-sm">
        <AeroButton
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </AeroButton>
      </div>
    </main>
  );
}
