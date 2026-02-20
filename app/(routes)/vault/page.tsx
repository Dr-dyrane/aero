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
  const language = useAeroStore((s) => s.language);
  const nav = useNavigator();

  const content = {
    en: {
      totalBioEquity: "Total Bio-Equity",
      yield: "yield",
      projectionTitle: "10-Year Projection",
      projectionSub: "Based on current streak & compound bio-yield.",
      locked: "Locked",
      liquid: "Liquid",
      releaseInfo: "Releases at Level 5",
      availableNow: "Available Now",
      miningRate: "Mining Rate",
      rateValue: "$5.00 / verified day",
      ledger: "Ledger",
      export: "EXPORT CSV",
      cta: "Verify & Mine Yield"
    },
    ar: {
      totalBioEquity: "إجمالي الأصول الحيوية",
      yield: "عائد",
      projectionTitle: "توقعات ١٠ سنوات",
      projectionSub: "بناءً على الأداء الحالي وعائد النمو الحيوي المركب.",
      locked: "مُجمد",
      liquid: "سيولة",
      releaseInfo: "يفتح عند المستوى ٥",
      availableNow: "متاح الآن",
      miningRate: "معدل الحصاد",
      rateValue: "٥.٠٠ دولار / يوم محقق",
      ledger: "السجل",
      export: "تصدير CSV",
      cta: "تحقق واجمع العائد"
    }
  };

  const t = language === 'ar' ? content.ar : content.en;

  // Projected Value Calculation (Compound effect of sobriety)
  // Simple heuristic: Current Balance * Streak Multiplier * 10 years
  const projectedValue = (totalBalance + (5 * 365 * 10)) * 1.08;

  return (
    <main className="flex min-h-screen flex-col items-center px-4 pb-28">
      {/* Header handled by TopNav */}
      <div className="h-6" />

      {/* TOTAL EQUITY HEADER */}
      <div className="flex flex-col items-center mb-6">
        <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">{t.totalBioEquity}</span>
        <h1 className="font-serif text-5xl font-light text-foreground mt-2 flex items-baseline gap-1">
          <span className="text-2xl text-muted-foreground opacity-50">$</span>
          {totalBalance.toFixed(2)}
        </h1>
        <AeroPill variant="accent" className="mt-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
          <TrendingUp className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" />
          +12.4% {t.yield}
        </AeroPill>
      </div>

      {/* PROJECTED VALUE CARD */}
      <AeroCard className="w-full max-w-sm mb-4 border-primary/20 bg-primary/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 p-3 opacity-20">
          <TrendingUp className="h-16 w-16 text-primary" />
        </div>
        <div className="relative z-10 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary tracking-widest uppercase">
            <ShieldCheck className="h-3 w-3" />
            {t.projectionTitle}
          </div>
          <p className="text-2xl font-light tracking-wide text-foreground">
            ${projectedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-muted-foreground italic">
            {t.projectionSub}
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
            <p className="text-[10px] tracking-wider text-muted-foreground uppercase font-bold">{t.locked}</p>
            <p className="font-numbers text-lg font-semibold text-foreground">
              {'$'}{lockedBalance.toFixed(2)}
            </p>
            <span className="text-[9px] text-muted-foreground mt-1 text-center opacity-60">
              {t.releaseInfo}
            </span>
          </div>
        </AeroCard>

        {/* LIQUID (Spendable) */}
        <AeroCard className="flex-1 border-gold/20 bg-gold/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tl from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col items-center p-4 relative z-10">
            <Unlock className="mb-2 h-4 w-4 text-gold" />
            <p className="text-[10px] tracking-wider text-gold/80 uppercase font-bold">{t.liquid}</p>
            <p className="font-numbers text-lg font-semibold text-gold">
              {'$'}{spendableBalance.toFixed(2)}
            </p>
            <span className="text-[9px] text-gold/60 mt-1 text-center">
              {t.availableNow}
            </span>
          </div>
        </AeroCard>
      </div>

      {/* REWARD LOGIC */}
      <div className="mt-6 flex w-full max-w-sm flex-col items-center gap-2">
        <div className="flex items-center gap-3 w-full">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{t.miningRate}</span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        <AeroPill variant="muted" className="border-white/5 bg-white/[0.02]">
          {t.rateValue}
        </AeroPill>
      </div>

      {/* TRANSACTION LEDGER */}
      <div className="mt-8 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="font-serif text-sm font-medium text-foreground flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            {t.ledger}
          </h2>
          <button className="text-[10px] text-primary hover:text-white transition-colors">
            {t.export}
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
                  <ArrowUpRight className="h-4 w-4 rtl:-rotate-90" style={{ color: '#00F5FF' }} />
                ) : (
                  <ArrowDownLeft className="h-4 w-4 rtl:-rotate-90" style={{ color: '#D4AF37' }} />
                )}
              </div>
              <div className="flex-1 text-left rtl:text-right">
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
        {t.cta}
      </AeroButton>
    </main>
  );
}
