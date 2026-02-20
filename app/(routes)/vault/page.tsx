'use client';

import { AeroCard } from '@/modules/ui/components/AeroCard';
import { AeroPill } from '@/modules/ui/components/AeroPill';
import { AeroButton } from '@/modules/ui/components/AeroButton';
import { useVault } from '@/modules/vault';
import { useAeroStore } from '@/store/useAeroStore';
import { useNavigator } from '@/lib/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Unlock, ArrowUpRight, ArrowDownLeft, TrendingUp, ShieldCheck, History, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLayout } from '@/modules/ui/providers/LayoutProvider';
import { AeroSkeleton } from '@/modules/ui/components/AeroSkeleton';
import { useTheme } from '@/modules/ui/providers/ThemeProvider';
import { useEffect } from 'react';
import Image from 'next/image';

export default function VaultPage() {
  const { lockedBalance, spendableBalance, totalBalance } = useVault();
  const demoMode = useAeroStore((s) => s.demoMode);
  const streak = useAeroStore((s) => s.streak);
  const language = useAeroStore((s) => s.language);
  const isWakeUpCall = useAeroStore((s) => s.isWakeUpCall);
  const transactions = useAeroStore((s) => s.transactions);
  const nav = useNavigator();
  const { isSkeletonLoading, setSkeletonLoading } = useLayout();
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'eclipse';
  const asImg = isDark ? "/as.png" : "/as_light.png";

  useEffect(() => {
    setSkeletonLoading(true);
    const timer = setTimeout(() => setSkeletonLoading(false), 800);
    return () => clearTimeout(timer);
  }, [setSkeletonLoading]);

  const content = {
    en: {
      totalBioEquity: "Balance",
      yield: "reward",
      projectionTitle: isWakeUpCall ? "STABILITY RISK" : "Future Value",
      projectionSub: isWakeUpCall
        ? "Projections suspended. Your system currently shows high instability."
        : "Estimated total rewards over the next 10 years.",
      locked: "Saved",
      liquid: "Spendable",
      releaseInfo: "Unlocks at Level 5",
      availableNow: "Available Now",
      miningRate: "Daily Reward",
      rateValue: isWakeUpCall ? "REWARDS SUSPENDED" : "$5.00 / check-in",
      ledger: "History",
      export: "DOWNLOAD",
      cta: isWakeUpCall ? "START RECOVERY" : "Scan to Earn"
    },
    ar: {
      totalBioEquity: "الرصيد",
      yield: "مكافأة",
      projectionTitle: isWakeUpCall ? "خطر الاستقرار" : "القيمة المستقبلية",
      projectionSub: isWakeUpCall
        ? "تم تعليق التوقعات. يظهر نظامك حالياً عدم استقرار عالٍ."
        : "إجمالي المكافآت التقديرية خلال ١٠ سنوات.",
      locked: "مدخرات",
      liquid: "قابل للاستخدام",
      releaseInfo: "يفتح عند المستوى ٥",
      availableNow: "متاح الآن",
      miningRate: "المكافأة اليومية",
      rateValue: isWakeUpCall ? "تم تعليق المكافآت" : "٥.٠٠ دولار / يوم",
      ledger: "السجل",
      export: "تحميل",
      cta: isWakeUpCall ? "بدء التعافي" : "افحص واكسب"
    }
  };

  const t = language === 'ar' ? content.ar : content.en;

  // Projected Value Calculation
  const projectedValue = (totalBalance + (5 * 365 * 10)) * 1.08;

  if (isSkeletonLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center px-4 pb-28 bg-background">
        <div className="h-10 w-full" />
        <div className="flex flex-col items-center mb-10 w-full max-w-sm">
          <AeroSkeleton className="h-3 w-32 mb-4" />
          <AeroSkeleton className="h-12 w-48 mb-4" />
          <AeroSkeleton variant="pill" className="h-6 w-24" />
        </div>
        <AeroSkeleton variant="card" className="h-28 w-full max-w-sm mb-6" />
        <div className="flex w-full max-w-sm gap-3 mb-10">
          <AeroSkeleton variant="card" className="h-24 flex-1" />
          <AeroSkeleton variant="card" className="h-24 flex-1" />
        </div>
        <div className="w-full max-w-sm space-y-3">
          <AeroSkeleton className="h-4 w-20 mb-4" />
          {[1, 2, 3, 4].map(i => (
            <AeroSkeleton key={i} variant="card" className="h-16 w-full" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className={cn(
      "flex min-h-screen flex-col items-center px-4 pb-28 transition-colors duration-1000",
      isWakeUpCall ? "bg-red-950/20" : "bg-background"
    )}>
      {isWakeUpCall && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,59,48,0.15)_0%,transparent_70%)]" />
        </div>
      )}
      <div className="h-6" />

      {/* TOTAL EQUITY HEADER */}
      <div className="flex flex-col items-center mb-6 relative w-full pt-10 min-h-[260px] justify-center overflow-visible">
        <div className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-[100px] rounded-full pointer-events-none transition-colors duration-1000 z-0",
          isWakeUpCall ? "bg-red-500/15" : "bg-primary/5"
        )} />

        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.2] saturate-[1.2]">
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, -1, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="relative w-[400px] h-[400px]"
          >
            <Image src={asImg} alt="Protocol Artifact" fill className="object-contain" />
          </motion.div>
        </div>

        <div className="flex flex-col items-center relative z-10">
          <span className="text-[10px] font-bold text-muted-foreground tracking-[0.3em] uppercase">{t.totalBioEquity}</span>
          <h1 className={cn(
            "font-serif text-6xl font-light mt-4 flex items-baseline gap-1 tracking-tighter transition-colors duration-1000",
            isWakeUpCall ? "text-red-400" : "text-foreground"
          )}>
            <span className="text-2xl text-muted-foreground opacity-50">$</span>
            {totalBalance.toFixed(2)}
          </h1>
          <AeroPill
            variant="accent"
            className={cn(
              "mt-4 transition-colors",
              isWakeUpCall ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            )}
          >
            {isWakeUpCall ? (
              <AlertTriangle className="h-3 w-3 mr-1" />
            ) : (
              <TrendingUp className="h-3 w-3 mr-1" />
            )}
            {isWakeUpCall ? "-4.2% Risk" : `+12.4% ${t.yield}`}
          </AeroPill>
        </div>
      </div>

      <AeroCard className={cn(
        "w-full max-w-sm mb-4 overflow-hidden relative",
        isWakeUpCall ? "border-red-500/30 bg-red-500/5 shadow-[0_0_40px_rgba(239,68,68,0.1)]" : "border-primary/20 bg-primary/5"
      )}>
        <div className="absolute top-0 right-0 p-3 opacity-20">
          {isWakeUpCall ? <AlertTriangle className="h-16 w-16 text-red-500" /> : <TrendingUp className="h-16 w-16 text-primary" />}
        </div>
        <div className="relative z-10 flex flex-col gap-1">
          <div className={cn("flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase", isWakeUpCall ? "text-red-400" : "text-primary")}>
            {isWakeUpCall ? <AlertTriangle className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
            {t.projectionTitle}
          </div>
          <p className={cn("text-2xl font-light tracking-wide", isWakeUpCall ? "text-red-200" : "text-foreground")}>
            {isWakeUpCall ? "---" : `$${projectedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          </p>
          <p className="text-xs text-muted-foreground italic">{t.projectionSub}</p>
        </div>
      </AeroCard>

      <div className="mt-2 flex w-full max-w-sm gap-3">
        <AeroCard className="flex-1 bg-white/5 border-white/10 p-4 flex flex-col items-center">
          <Lock className="mb-2 h-4 w-4 text-muted-foreground" />
          <p className="text-[10px] text-muted-foreground uppercase font-bold">{t.locked}</p>
          <p className="font-numbers text-lg font-semibold">${lockedBalance.toFixed(2)}</p>
          <span className="text-[9px] text-muted-foreground mt-1">{t.releaseInfo}</span>
        </AeroCard>
        <AeroCard className="flex-1 bg-gold/5 border-gold/20 p-4 flex flex-col items-center">
          <Unlock className="mb-2 h-4 w-4 text-gold" />
          <p className="text-[10px] text-gold uppercase font-bold">{t.liquid}</p>
          <p className="font-numbers text-lg font-semibold text-gold">${spendableBalance.toFixed(2)}</p>
          <span className="text-[9px] text-gold/60 mt-1">{t.availableNow}</span>
        </AeroCard>
      </div>

      <div className="mt-8 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="font-serif text-sm font-medium flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            {t.ledger}
          </h2>
          <button className="text-[10px] text-primary">{t.export}</button>
        </div>

        <div className="flex flex-col gap-2">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5">
                {tx.type === 'unlock' ? (
                  <ArrowUpRight className="h-4 w-4" style={{ color: isWakeUpCall ? 'var(--destructive)' : 'var(--primary)' }} />
                ) : (
                  <ArrowDownLeft className="h-4 w-4 text-gold" />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{tx.description}</p>
                <p className="text-[10px] text-muted-foreground">{tx.date}</p>
              </div>
              <p className="font-numbers text-sm font-semibold" style={{ color: tx.type === 'unlock' ? (isWakeUpCall ? 'var(--destructive)' : 'var(--primary)') : 'var(--gold)' }}>
                {tx.type === 'unlock' ? '+' : ''}${tx.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <AeroButton
        variant="primary"
        size="lg"
        className={cn("mt-8 w-full max-w-sm h-14", isWakeUpCall ? "bg-red-600 border-red-500/50" : "")}
        onClick={() => nav.goToScan()}
      >
        {t.cta}
      </AeroButton>
    </main>
  );
}
