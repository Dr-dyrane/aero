'use client';

import { AeroCard } from '@/modules/ui/components/AeroCard';
import { AeroPill } from '@/modules/ui/components/AeroPill';
import { AeroButton } from '@/modules/ui/components/AeroButton';
import { useVault } from '@/modules/vault';
import { useAeroStore } from '@/store/useAeroStore';
import { useNavigator } from '@/lib/navigation';
import { DEMO_VAULT_TRANSACTIONS } from '@/lib/data';
import { ArrowLeft, Lock, Unlock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function VaultPage() {
  const { lockedBalance, spendableBalance, totalBalance } = useVault();
  const demoMode = useAeroStore((s) => s.demoMode);
  const nav = useNavigator();

  return (
    <main className="flex min-h-screen flex-col items-center px-4 pb-28 pt-2">
      {/* Header */}
      <header className="flex w-full max-w-sm items-center gap-3 py-4">
        <button
          onClick={() => nav.goToDashboard()}
          className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-[var(--surface-hover)]"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-serif text-xl font-semibold text-foreground">
          Bio-Vault
        </h1>
        {demoMode && (
          <AeroPill variant="accent" className="ml-auto">DEMO</AeroPill>
        )}
      </header>

      {/* Total Balance */}
      <AeroCard glow className="w-full max-w-sm">
        <div className="flex flex-col items-center p-6">
          <p className="text-xs text-muted-foreground">Total Balance</p>
          <p className="font-numbers text-4xl font-bold" style={{ color: '#D4AF37' }}>
            {'$'}{totalBalance.toFixed(2)}
          </p>
        </div>
      </AeroCard>

      {/* Breakdown */}
      <div className="mt-3 flex w-full max-w-sm gap-3">
        <AeroCard className="flex-1">
          <div className="flex flex-col items-center p-4">
            <Lock className="mb-2 h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Locked</p>
            <p className="font-numbers text-lg font-semibold text-foreground">
              {'$'}{lockedBalance.toFixed(2)}
            </p>
          </div>
        </AeroCard>
        <AeroCard className="flex-1">
          <div className="flex flex-col items-center p-4">
            <Unlock className="mb-2 h-4 w-4" style={{ color: '#00F5FF' }} />
            <p className="text-xs text-muted-foreground">Spendable</p>
            <p className="font-numbers text-lg font-semibold" style={{ color: '#00F5FF' }}>
              {'$'}{spendableBalance.toFixed(2)}
            </p>
          </div>
        </AeroCard>
      </div>

      {/* Unlock Info */}
      <div className="mt-4 flex w-full max-w-sm flex-col items-center gap-2">
        <AeroPill variant="accent">$5 per clean day</AeroPill>
        <p className="text-center text-xs text-muted-foreground">
          Complete your daily Triple-Check to unlock funds.
        </p>
      </div>

      {/* Transaction History */}
      <div className="mt-6 w-full max-w-sm">
        <h2 className="mb-3 font-serif text-sm font-medium text-foreground">
          Transaction History
        </h2>
        <div className="flex flex-col gap-2">
          {DEMO_VAULT_TRANSACTIONS.map((tx) => (
            <AeroCard key={tx.id}>
              <div className="flex items-center gap-3 p-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{
                    background: tx.type === 'unlock'
                      ? 'rgba(0, 245, 255, 0.1)'
                      : 'rgba(212, 175, 55, 0.1)',
                  }}
                >
                  {tx.type === 'unlock' ? (
                    <ArrowUpRight className="h-4 w-4" style={{ color: '#00F5FF' }} />
                  ) : (
                    <ArrowDownLeft className="h-4 w-4" style={{ color: '#D4AF37' }} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
                <p
                  className="font-numbers text-sm font-semibold"
                  style={{ color: tx.type === 'unlock' ? '#00F5FF' : '#D4AF37' }}
                >
                  {tx.type === 'unlock' ? '+' : ''}{'$'}{tx.amount.toFixed(2)}
                </p>
              </div>
            </AeroCard>
          ))}
        </div>
      </div>

      {/* CTA */}
      <AeroButton
        variant="primary"
        size="lg"
        className="mt-6 w-full max-w-sm"
        onClick={() => nav.goToScan()}
      >
        Start Triple-Check
      </AeroButton>
    </main>
  );
}
