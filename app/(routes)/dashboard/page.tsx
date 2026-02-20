'use client';

import { AeroOrb } from '@/modules/ui/components/AeroOrb';
import { AeroCard } from '@/modules/ui/components/AeroCard';
import { AeroPill } from '@/modules/ui/components/AeroPill';
import { AeroButton } from '@/modules/ui/components/AeroButton';
import { useAeroStore } from '@/store/useAeroStore';
import { useVault } from '@/modules/vault';
import { useAuth } from '@/modules/auth';
import { useNavigator } from '@/lib/navigation';
import { DEMO_MERITS, DEMO_SCAN_HISTORY, MERIT_LEVELS } from '@/lib/data';
import { Shield, Zap, TrendingUp, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
  const aeroScore = useAeroStore((s) => s.aeroScore);
  const scanStatus = useAeroStore((s) => s.scanStatus);
  const streak = useAeroStore((s) => s.streak);
  const demoMode = useAeroStore((s) => s.demoMode);
  const { lockedBalance, spendableBalance } = useVault();
  const { user } = useAuth();
  const nav = useNavigator();

  const nextMerit = MERIT_LEVELS.find((m) => m.threshold > streak) ?? MERIT_LEVELS[MERIT_LEVELS.length - 1];
  const highestMerit = DEMO_MERITS[DEMO_MERITS.length - 1];
  const lastScan = DEMO_SCAN_HISTORY[0];

  return (
    <main className="flex min-h-screen flex-col items-center px-4 pb-28 pt-6">
      {/* Greeting */}
      <div className="flex w-full max-w-sm items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Welcome back,</p>
          <p className="font-serif text-lg font-semibold text-foreground">
            {user?.name ?? 'Aero User'}
          </p>
        </div>
        {demoMode && <AeroPill variant="accent">DEMO</AeroPill>}
      </div>

      {/* Aero Score Orb */}
      <section className="flex flex-col items-center py-6">
        <AeroOrb score={aeroScore} size={200} />
        <p className="mt-3 text-xs text-muted-foreground">Aero Score</p>
      </section>

      {/* Status Row */}
      <div className="flex items-center gap-2 pb-4">
        <AeroPill variant={scanStatus === 'success' ? 'accent' : 'muted'}>
          {scanStatus === 'success' ? 'Verified Clean' : scanStatus === 'idle' ? 'Ready to Scan' : scanStatus}
        </AeroPill>
        <AeroPill variant="muted">
          <Zap className="mr-1 inline h-3 w-3" style={{ color: '#D4AF37' }} />
          {'Day '}{streak}
        </AeroPill>
        {highestMerit && (
          <AeroPill variant="muted" style={{ color: '#D4AF37' }}>
            {highestMerit.level.charAt(0).toUpperCase() + highestMerit.level.slice(1)}
          </AeroPill>
        )}
      </div>

      {/* Vault Summary */}
      <AeroCard glow className="w-full max-w-sm">
        <button
          onClick={() => nav.goToVault()}
          className="flex w-full items-center justify-between p-3"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'rgba(212, 175, 55, 0.15)' }}>
              <Shield className="h-5 w-5" style={{ color: '#D4AF37' }} />
            </div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Bio-Vault</p>
              <p className="font-numbers text-xl font-bold text-foreground">
                {'$'}{spendableBalance.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {'$'}{lockedBalance.toFixed(2)} locked
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </button>
      </AeroCard>

      {/* Recent Scan */}
      {lastScan && (
        <AeroCard className="mt-3 w-full max-w-sm">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'rgba(0, 245, 255, 0.1)' }}>
                <TrendingUp className="h-5 w-5" style={{ color: '#00F5FF' }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Scan</p>
                <p className="text-sm font-medium text-foreground">
                  Score {lastScan.score} &middot; {(lastScan.confidence * 100).toFixed(0)}% conf
                </p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{lastScan.date}</span>
          </div>
        </AeroCard>
      )}

      {/* Merit Progress */}
      <AeroCard className="mt-3 w-full max-w-sm">
        <div className="flex items-center justify-between p-3">
          <div>
            <p className="text-xs text-muted-foreground">Next Merit</p>
            <p className="text-sm font-medium" style={{ color: nextMerit.color }}>
              {nextMerit.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 overflow-hidden rounded-full" style={{ background: 'var(--surface-translucent)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (streak / nextMerit.threshold) * 100)}%`,
                  background: nextMerit.color,
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {streak}/{nextMerit.threshold}d
            </span>
          </div>
        </div>
      </AeroCard>

      {/* Quick Actions */}
      <div className="mt-6 flex w-full max-w-sm flex-col gap-3">
        <AeroButton
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => nav.goToScan()}
        >
          Start Triple-Check
        </AeroButton>
        <AeroButton
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={() => nav.goToVault()}
        >
          Open Vault
        </AeroButton>
      </div>
    </main>
  );
}
