'use client';

import { AeroCard } from '@/modules/ui/components/AeroCard';
import { AeroPill } from '@/modules/ui/components/AeroPill';
import { AeroButton } from '@/modules/ui/components/AeroButton';
import { useTheme } from '@/modules/ui/providers/ThemeProvider';
import { useAuth } from '@/modules/auth';
import { useAeroStore } from '@/store/useAeroStore';
import { useNavigator } from '@/lib/navigation';
import { ArrowLeft, Sun, Moon, Monitor, Shield, LogOut, Zap, ShieldAlert, ShieldCheck, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLayout } from '@/modules/ui/providers/LayoutProvider';
import { AeroSkeleton } from '@/modules/ui/components/AeroSkeleton';
import { useEffect } from 'react';

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, signOut } = useAuth();
  const {
    demoMode, setDemoMode,
    language, setLanguage,
    isWakeUpCall, setAeroScore,
    streak, setStreak
  } = useAeroStore();
  const nav = useNavigator();
  const { isSkeletonLoading, setSkeletonLoading } = useLayout();

  useEffect(() => {
    setSkeletonLoading(true);
    const timer = setTimeout(() => setSkeletonLoading(false), 800);
    return () => clearTimeout(timer);
  }, [setSkeletonLoading]);

  const handleSignOut = async () => {
    await signOut();
    setDemoMode(false);
    setLanguage(null as any);
    nav.goToRoot();
  };

  const content = {
    en: {
      profile: "Patient Identity",
      demoMode: "Simulation Protocol",
      demoDesc: "Bypass auth, use localized placeholder data",
      appearance: "Visual Interface",
      language: "Linguistic Interface",
      signOut: "Logout",
      themes: {
        eclipse: { label: "Eclipse", desc: "Digital Dark Protocol" },
        cloud: { label: "Cloud", desc: "Atmospheric Light Protocol" },
        system: { label: "System", desc: "Inherited OS Context" }
      },
      languages: {
        en: "English (Global)",
        ar: "العربية (Regional)"
      }
    },
    ar: {
      profile: "هوية المريض",
      demoMode: "بروتوكول المحاكاة",
      demoDesc: "تجاوز المصادقة، استخدام بيانات تجريبية",
      appearance: "الواجهة المرئية",
      language: "واجهة اللغة",
      signOut: "تسجيل الخروج",
      themes: {
        eclipse: { label: "الكسوف", desc: "النمط الداكن الرقمي" },
        cloud: { label: "السحاب", desc: "النمط الفاتح الجوي" },
        system: { label: "النظام", desc: "سياق نظام التشغيل" }
      },
      languages: {
        en: "الإنجليزية (عالمي)",
        ar: "العربية (إقليمي)"
      }
    }
  };

  const t = language === 'ar' ? content.ar : content.en;

  if (isSkeletonLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center px-4 pb-20 bg-background">
        <div className="h-6 w-full" />
        <AeroSkeleton variant="card" className="h-24 w-full max-w-sm mb-4" />
        <AeroSkeleton variant="card" className="h-16 w-full max-w-sm mb-10" />
        <div className="w-full max-w-sm space-y-4">
          <AeroSkeleton className="h-3 w-32" />
          <AeroSkeleton variant="card" className="h-14 w-full" />
          <AeroSkeleton variant="card" className="h-14 w-full" />
        </div>
        <div className="w-full max-w-sm space-y-4 mt-8">
          <AeroSkeleton className="h-3 w-32" />
          <AeroSkeleton variant="card" className="h-16 w-full" />
          <AeroSkeleton variant="card" className="h-16 w-full" />
        </div>
      </main>
    );
  }

  const themes = [
    { key: 'eclipse' as const, label: t.themes.eclipse.label, icon: Moon, desc: t.themes.eclipse.desc },
    { key: 'cloud' as const, label: t.themes.cloud.label, icon: Sun, desc: t.themes.cloud.desc },
    { key: 'system' as const, label: t.themes.system.label, icon: Monitor, desc: t.themes.system.desc },
  ];

  const languages = [
    { key: 'en' as const, label: t.languages.en },
    { key: 'ar' as const, label: t.languages.ar },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center px-4 pb-32">
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
            <div className="text-left rtl:text-right">
              <p className="text-sm font-medium text-foreground">{t.demoMode}</p>
              <p className="text-xs text-muted-foreground leading-tight">
                {t.demoDesc}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDemoMode(!demoMode)}
            className="relative h-6 w-11 rounded-full transition-colors flex-shrink-0"
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

      {/* Language Selection */}
      <div className="mt-6 w-full max-w-sm">
        <h2 className="mb-3 font-serif text-sm font-medium text-foreground px-1">
          {t.language}
        </h2>
        <div className="flex flex-col gap-2">
          {languages.map(({ key, label }) => {
            const isActive = language === key;
            return (
              <AeroCard key={key}>
                <button
                  onClick={() => setLanguage(key)}
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
                    <Monitor className="h-5 w-5" style={{ color: isActive ? '#00F5FF' : 'var(--muted-foreground)' }} />
                  </div>
                  <div className="flex-1 text-left rtl:text-right">
                    <p className="text-sm font-medium text-foreground">{label}</p>
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

      {/* SYSTEM OVERRIDE: Clinical Debugger */}
      {demoMode && (
        <div className="mt-8 w-full max-w-sm space-y-3">
          <div className="flex items-center gap-2 px-1 mb-2">
            <Activity className="h-3 w-3 text-red-500 animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-red-500 uppercase">System Override</span>
          </div>

          <AeroCard className="border-red-500/20 bg-red-500/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldAlert className="h-12 w-12 text-red-500" />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                  <Zap className="h-5 w-5 text-red-500" />
                </div>
                <div className="text-left rtl:text-right">
                  <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Addiction Alert</p>
                  <p className="text-[9px] font-mono text-red-400/60 leading-tight uppercase font-bold">
                    Force AS {'<='} 20.00_protocol
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAeroScore(isWakeUpCall ? 87 : 12)}
                className="relative h-6 w-11 rounded-full transition-colors flex-shrink-0"
                style={{
                  background: isWakeUpCall ? '#FF3B30' : 'rgba(255,255,255,0.05)',
                }}
              >
                <span
                  className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full transition-transform bg-white shadow-sm"
                  style={{
                    transform: isWakeUpCall ? 'translateX(20px)' : 'translateX(0)',
                  }}
                />
              </button>
            </div>
          </AeroCard>

          <AeroCard className="border-primary/20 bg-primary/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck className="h-12 w-12 text-primary" />
            </div>
            <button
              onClick={() => setStreak(streak === 30 ? 3 : 30)}
              className="flex w-full items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left rtl:text-right">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">Force Maturity</p>
                  <p className="text-[9px] font-mono text-primary/60 leading-tight uppercase font-bold">
                    Set Streak: {streak === 30 ? '3 days' : '30 days (Crown)'}
                  </p>
                </div>
              </div>
              <div className={cn(
                "h-2 w-2 rounded-full",
                streak === 30 ? "bg-primary animate-pulse shadow-[0_0_10px_var(--primary)]" : "bg-white/10"
              )} />
            </button>
          </AeroCard>
        </div>
      )}

      {/* Theme Selection */}
      <div className="mt-6 w-full max-w-sm">
        <h2 className="mb-3 font-serif text-sm font-medium text-foreground px-1">
          {t.appearance}
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
                        ? 'color-mix(in srgb, var(--primary) 15%, transparent)'
                        : 'var(--surface-translucent)',
                    }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: isActive ? 'var(--primary)' : 'var(--muted-foreground)' }}
                    />
                  </div>
                  <div className="flex-1 text-left rtl:text-right">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <div
                    className="h-4 w-4 rounded-full border-2"
                    style={{
                      borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                      background: isActive ? 'var(--primary)' : 'transparent',
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
          className="w-full flex items-center justify-center gap-2"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 rtl:rotate-180" />
          {t.signOut}
        </AeroButton>
      </div>
    </main>
  );
}
