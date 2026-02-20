'use client';

import Image from 'next/image';
import { AeroButton } from '@/modules/ui/components/AeroButton';
import { AeroCard } from '@/modules/ui/components/AeroCard';
import { AeroPill } from '@/modules/ui/components/AeroPill';
import { useAuth } from '@/modules/auth';
import { useAeroStore } from '@/store/useAeroStore';
import { useNavigator } from '@/lib/navigation';

export default function AuthPage() {
  const { signInWithGoogle, isLoading, isAuthenticated } = useAuth();
  const demoMode = useAeroStore((s) => s.demoMode);
  const setDemoMode = useAeroStore((s) => s.setDemoMode);
  const nav = useNavigator();

  const handleDemoLogin = () => {
    setDemoMode(true);
    nav.goToDashboard();
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
    nav.goToDashboard();
  };

  if (isAuthenticated || demoMode) {
    nav.goToDashboard();
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
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

        <h1 className="font-serif text-3xl font-bold tracking-wider text-foreground">
          A E R O
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Rebranding Addiction as an Elite Bio-Investment
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
            {isLoading ? 'Loading...' : 'Continue with Google'}
          </AeroButton>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
          </div>

          <AeroButton
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={handleDemoLogin}
          >
            Enter Demo Mode
          </AeroButton>

          <div className="flex justify-center">
            <AeroPill variant="muted">No API keys needed</AeroPill>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to protect your Bio-Vault endowment.
          </p>
        </div>
      </AeroCard>
    </main>
  );
}
