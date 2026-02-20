'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { AeroButton, AeroCard, AeroPill } from '@/modules/ui';
import { useAuth } from '@/modules/auth';
import { useAeroStore } from '@/store/useAeroStore';
import { useNavigator } from '@/lib/navigation';

export default function AuthPage() {
  const { signInWithGoogle, isLoading, isAuthenticated } = useAuth();
  const { demoMode, setDemoMode, language } = useAeroStore();
  const nav = useNavigator();

  const handleDemoLogin = () => {
    setDemoMode(true);
    nav.goToDashboard();
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
    nav.goToDashboard();
  };

  useEffect(() => {
    if (isAuthenticated || demoMode) {
      nav.goToDashboard();
    }
  }, [isAuthenticated, demoMode, nav]);

  const content = {
    en: {
      title: "A E R O",
      subtitle: "Rebranding Addiction as an Elite Bio-Investment",
      google: "Continue with Google",
      loading: "Loading...",
      demo: "Enter Demo Mode",
      footer: "By continuing, you agree to protect your Bio-Vault endowment.",
      or: "or",
      noKeys: "No API keys needed"
    },
    ar: {
      title: "أ يـ ر و",
      subtitle: "إعادة تعريف الإدمان كاستثمار حيوي نخبة",
      google: "المتابعة باستخدام Google",
      loading: "جاري التحميل...",
      demo: "دخول وضع المحاكاة",
      footer: "بالمتابعة، أنت توافق على حماية مخصصاتك في الخزنة الحيوية.",
      or: "أو",
      noKeys: "لا حاجة لمفاتيح API"
    }
  };

  const t = language === 'ar' ? content.ar : content.en;

  if (isAuthenticated || demoMode) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background glow */}
      <div className="aero-bg-glow" />

      {/* Logo + Branding */}
      <div className="relative z-10 flex flex-col items-center">
        <Image
          src="/aero.png"
          alt="AERO"
          width={160}
          height={160}
          className="mb-6"
          priority
        />

        <h1 className="font-serif text-3xl font-bold tracking-wider text-foreground uppercase">
          {t.title}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground max-w-[280px]">
          {t.subtitle}
        </p>
      </div>

      {/* Auth Card */}
      <AeroCard className="relative z-10 mt-10 w-full max-w-sm">
        <div className="flex flex-col gap-4 p-6">
          <AeroButton
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? t.loading : t.google}
          </AeroButton>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
            <span className="text-xs text-muted-foreground uppercase tracking-widest">{t.or}</span>
            <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
          </div>

          <AeroButton
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={handleDemoLogin}
          >
            {t.demo}
          </AeroButton>

          <div className="flex justify-center">
            <AeroPill variant="muted">{t.noKeys}</AeroPill>
          </div>

          <p className="text-center text-xs text-muted-foreground leading-relaxed mt-2">
            {t.footer}
          </p>
        </div>
      </AeroCard>
    </main>
  );
}
