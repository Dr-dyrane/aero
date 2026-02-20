'use client';

import { AeroCard } from '@/modules/ui/components/AeroCard';
import { AeroPill } from '@/modules/ui/components/AeroPill';
import { AeroButton } from '@/modules/ui/components/AeroButton';
import { useVault } from '@/modules/vault';
import { useAeroStore } from '@/store/useAeroStore';
import { useNavigator } from '@/lib/navigation';
import { DEMO_VAULT_TRANSACTIONS } from '@/lib/data';
import { ArrowLeft, Lock, Unlock, ArrowUpRight, ArrowDownLeft, TrendingUp, ShieldCheck, History } from 'lucide-react';

export default function VaultPage() {
  const { lockedBalance, spendableBalance, totalBalance } = useVault();
  const demoMode = useAeroStore((s) => s.demoMode);
  const streak = useAeroStore((s) => s.streak);
  const nav = useNavigator();

  // Projected Value Calculation (Compound effect of sobriety)
  // Simple heuristic: Current Balance * Streak Multiplier * 10 years
  const projectedValue = (totalBalance + (5 * 365 * 10)) * 1.08;

  return (
    <main className="flex min-h-screen flex-col items-center px-4 pb-28">
      {/* Header handled by TopNav */}
      <div className="h-6" />

      {/* TOTAL EQUITY HEADER */}
      <div className="flex flex-col items-center mb-6">
        <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">Total Bio-Equity</span>
        <h1 className="font-serif text-5xl font-light text-foreground mt-2 flex items-baseline gap-1">
          <span className="text-2xl text-muted-foreground opacity-50">$</span>
          {totalBalance.toFixed(2)}
        </h1>
        <AeroPill variant="accent" className="mt-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
          <TrendingUp className="h-3 w-3 mr-1" />
          +12.4% yield
        </AeroPill>
      </div>

      {/* PROJECTED VALUE CARD */}
      <AeroCard className="w-full max-w-sm mb-4 border-primary/20 bg-primary/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-3 opacity-20">
          <TrendingUp className="h-16 w-16 text-primary" />
        </div>
        <div className="relative z-10 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary tracking-widest uppercase">
            <ShieldCheck className="h-3 w-3" />
            10-Year Projection
          </div>
          <p className="text-2xl font-light tracking-wide text-foreground">
            ${projectedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-muted-foreground italic">
            Based on current streak & compound bio-yield.
          </p>
        </div>
      </AeroCard>

      {/* ASSET ALLOCATION (Liquid vs Frozen) */}
      <div className="mt-2 flex w-full max-w-sm gap-3">
        {/* FROZEN (Endowment) */}
        <AeroCard className="flex-1 border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col items-center p-4 relative z-10">
            <Lock className="mb-2 h-4 w-4 text-muted-foreground" />
            <p className="text-[10px] tracking-wider text-muted-foreground uppercase font-bold">Locked</p>
            <p className="font-numbers text-lg font-semibold text-foreground">
              {'$'}{lockedBalance.toFixed(2)}
            </p>
            <span className="text-[9px] text-muted-foreground mt-1 text-center opacity-60">
              Releases at Level 5
            </span>
          </div>
        </AeroCard>

        {/* LIQUID (Spendable) */}
        <AeroCard className="flex-1 border-gold/20 bg-gold/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tl from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col items-center p-4 relative z-10">
            <Unlock className="mb-2 h-4 w-4 text-gold" />
            <p className="text-[10px] tracking-wider text-gold/80 uppercase font-bold">Liquid</p>
            <p className="font-numbers text-lg font-semibold text-gold">
              {'$'}{spendableBalance.toFixed(2)}
            </p>
            <span className="text-[9px] text-gold/60 mt-1 text-center">
              Available Now
            </span>
          </div>
        </AeroCard>
      </div>

      {/* REWARD LOGIC */}
      <div className="mt-6 flex w-full max-w-sm flex-col items-center gap-2">
        <div className="flex items-center gap-3 w-full">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Mining Rate</span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        <AeroPill variant="muted" className="border-white/5 bg-white/[0.02]">
          $5.00 / verified day
        </AeroPill>
      </div>

      {/* TRANSACTION LEDGER */}
      <div className="mt-8 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="font-serif text-sm font-medium text-foreground flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            Ledger
          </h2>
          <button className="text-[10px] text-primary hover:text-white transition-colors">
            EXPORT CSV
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {DEMO_VAULT_TRANSACTIONS.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
            >
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
                <p className="text-sm font-medium text-foreground leading-none mb-1">{tx.description}</p>
                <p className="text-[10px] text-muted-foreground font-mono opacity-60">{tx.date} • ID: {tx.id.slice(0, 6)}</p>
              </div>
              <p
                className="font-numbers text-sm font-semibold"
                style={{ color: tx.type === 'unlock' ? '#00F5FF' : '#D4AF37' }}
              >
                {tx.type === 'unlock' ? '+' : ''}{'$'}{tx.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <AeroButton
        variant="primary"
        size="lg"
        className="mt-8 w-full max-w-sm h-14"
        onClick={() => nav.goToScan()}
      >
        Verify & Mine Yield
      </AeroButton>
    </main>
  );
}
