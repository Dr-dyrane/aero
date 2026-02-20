'use client';

import { AeroOrb, AeroCard, AeroPill, AeroButton } from '@/modules/ui';
import { useAeroStore } from '@/store/useAeroStore';
import { useVault } from '@/modules/vault';
import { useAuth } from '@/modules/auth';
import { useNavigator } from '@/lib/navigation';
import { DEMO_MERITS, DEMO_SCAN_HISTORY, MERIT_LEVELS } from '@/lib/data';
import { Shield, Zap, TrendingUp, ChevronRight, Sparkles, Brain, Clock, Globe, ArrowUpRight } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

export default function DashboardPage() {
  const aeroScore = useAeroStore((s) => s.aeroScore);
  const scanStatus = useAeroStore((s) => s.scanStatus);
  const streak = useAeroStore((s) => s.streak);
  const demoMode = useAeroStore((s) => s.demoMode);
  const { lockedBalance, spendableBalance } = useVault();
  const { user } = useAuth();
  const nav = useNavigator();
  const language = useAeroStore((s) => s.language);

  // Dictionary
  const content = {
    en: {
      bioMarketValue: "Bio-Market Value",
      topGlobal: "TOP 4.2% GLOBAL",
      marketInsight: "Market Insight",
      insightText: `"Your baseline stability signals a breakout. Projected yield increases by 12% if streak holds through weekend."`,
      liveFeed: "Live Feed",
      fullReport: "FULL REPORT",
      totalEquity: "Total Equity",
      locked: "LOCKED",
      verifyStatus: "Verify Status",
      secure: "SECURE",
      pending: "PENDING",
      uptime: "99.8% Uptime",
      yieldTier: "Yield Tier",
      levelUp: "to Level Up",
      ctaMain: "VERIFY & MINE YIELD",
      ctaSub: "DAILY CHECK-IN UNLOCKED",
      footer: "Encrypted Bio-Ledger Active"
    },
    ar: {
      bioMarketValue: "القيمة السوقية الحيوية",
      topGlobal: "أعلى ٤.٢٪ عالمياً",
      marketInsight: "رؤى السوق",
      insightText: `"استقرارك الحيوي يشير إلى انطلاقة قوية. العائد المتوقع سيزيد بنسبة ١٢٪ إذا استمر الأداء خلال عطلة نهاية الأسبوع."`,
      liveFeed: "بث مباشر",
      fullReport: "التقرير الكامل",
      totalEquity: "إجمالي الأصول",
      locked: "مُجمد",
      verifyStatus: "حالة التحقق",
      secure: "آمن",
      pending: "قيد الانتظار",
      uptime: "٩٩.٨٪ استقرار",
      yieldTier: "مستوى العائد",
      levelUp: "للترقية",
      ctaMain: "تحقق واجمع العائد",
      ctaSub: "تسجيل الدخول اليومي متاح",
      footer: "السجل الحيوي المشفر نشط"
    }
  };

  const t = language === 'ar' ? content.ar : content.en;

  const nextMerit = MERIT_LEVELS.find((m) => m.threshold > streak) ?? MERIT_LEVELS[MERIT_LEVELS.length - 1];
  const highestMerit = DEMO_MERITS[DEMO_MERITS.length - 1];
  const lastScan = DEMO_SCAN_HISTORY[0];

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center px-4 pb-32 overflow-x-hidden">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-sm flex flex-col items-center"
      >
        {/* Header Section: Reduced padding, now handled by TopNav */}
        <div className="h-6" />

        {/* BIO-MARKET VALUE TICKER */}
        <motion.section variants={item} className="flex flex-col items-center py-6 relative w-full pt-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

          {/* Global Identity Anchor (72px AeroOrb) */}
          <div className="mb-6">
            <AeroOrb score={aeroScore} size={72} pulsing />
          </div>

          <div className="flex flex-col items-center gap-1 z-10">
            <span className="text-[10px] tracking-[0.2em] font-bold text-muted-foreground uppercase opacity-70">
              {t.bioMarketValue}
            </span>
            <h1 className="font-serif text-7xl font-light tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground via-foreground to-foreground/50 tabular-nums">
              {aeroScore}
            </h1>

            {/* Global Percentile Indicator */}
            <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
              <Globe className="h-3 w-3 text-primary animate-pulse" />
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
                {t.topGlobal}
              </span>
            </div>
          </div>
        </motion.section>

        {/* Scoring Narrative (Simplified, no large redundant orb) */}
        <motion.div variants={item} className="mb-8 opacity-40">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </motion.div>

        {/* Intelligence Card */}
        <motion.div variants={item} className="w-full">
          <AeroCard className="relative overflow-hidden group border-primary/20 bg-primary/5">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Brain className="h-12 w-12 text-primary" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[10px] tracking-widest text-primary uppercase font-bold">
                <Sparkles className="h-3 w-3" />
                {t.marketInsight}
              </div>
              <p className="text-sm font-medium leading-relaxed text-foreground/90 italic">
                {t.insightText}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {t.liveFeed}
                </div>
                <button className="text-[10px] font-bold text-primary hover:text-white transition-colors flex items-center gap-1">
                  {t.fullReport} <ChevronRight className="h-3 w-3 rtl:rotate-180" />
                </button>
              </div>
            </div>
          </AeroCard>
        </motion.div>

        {/* ENDOWMENT PROTOCOL (Vault) */}
        <motion.div variants={item} className="w-full mt-4">
          <AeroCard glow className="p-0 overflow-hidden">
            <button
              onClick={() => nav.goToVault()}
              className="flex w-full items-center justify-between p-4 group relative"
            >
              {/* Liquid Gold Background Hint */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="flex items-center gap-4 relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 transition-transform group-hover:scale-105 border border-gold/20">
                  <Shield className="h-6 w-6 text-gold" />
                </div>
                <div className="text-left rtl:text-right">
                  <p className="text-[10px] tracking-widest text-muted-foreground uppercase font-bold">{t.totalEquity}</p>
                  <p className="font-numbers text-2xl font-medium text-foreground flex items-center gap-2">
                    {'$'}{(spendableBalance + lockedBalance).toFixed(2)}
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <ArrowUpRight className="h-2.5 w-2.5 rtl:-rotate-90" /> +5.2%
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 relative z-10">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                  <span className="text-[10px] font-bold text-gold tracking-wider">{t.locked}</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {'$'}{lockedBalance.toFixed(2)}
                </span>
              </div>
            </button>
          </AeroCard>
        </motion.div>

        {/* Mining Status Grid */}
        <motion.div variants={item} className="grid grid-cols-2 gap-3 w-full mt-4">
          <AeroCard className="p-4 flex flex-col justify-between h-32 bg-white/[0.02]">
            <div>
              <p className="text-[10px] tracking-widest text-muted-foreground uppercase font-bold mb-1">{t.verifyStatus}</p>
              <div className="flex items-center gap-1.5 mt-2">
                {scanStatus === 'success' ? (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Shield className="h-4 w-4" />
                    <span className="font-bold text-sm">{t.secure}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-400">
                    <Clock className="h-4 w-4" />
                    <span className="font-bold text-sm">{t.pending}</span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">{t.uptime}</p>
          </AeroCard>

          <AeroCard className="p-4 flex flex-col justify-between h-32 bg-white/[0.02]">
            <div>
              <p className="text-[10px] tracking-widest text-muted-foreground uppercase font-bold mb-1">{t.yieldTier}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-serif text-sm font-semibold uppercase" style={{ color: nextMerit.color }}>
                  {nextMerit.name}
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(streak / nextMerit.threshold) * 100}%` }}
                  transition={{ delay: 1, duration: 1.5 }}
                  className="h-full rounded-full"
                  style={{ background: nextMerit.color }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground text-right">{streak}/{nextMerit.threshold}d {t.levelUp}</p>
            </div>
          </AeroCard>
        </motion.div>

        {/* Primary Action Button: MINE YIELD */}
        <motion.div variants={item} className="w-full mt-8">
          <AeroButton
            variant="primary"
            size="lg"
            className="w-full h-16 text-lg shadow-[0_0_50px_rgba(0,245,255,0.2)] group border border-primary/50 relative overflow-hidden"
            onClick={() => nav.goToScan()}
          >
            {/* Inner Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

            <div className="flex items-center gap-3 relative z-10">
              <ScanFace className="h-6 w-6 transition-transform group-hover:scale-110" />
              <div className="flex flex-col items-start leading-none gap-1">
                <span className="text-base font-bold tracking-wide">{t.ctaMain}</span>
                <span className="text-[10px] font-normal opacity-80 tracking-wider font-sans">{t.ctaSub}</span>
              </div>
            </div>
          </AeroButton>

          <div className="mt-6 flex items-center justify-center gap-2 opacity-40">
            <div className="h-1 w-1 rounded-full bg-foreground" />
            <p className="text-[9px] tracking-[0.2em] uppercase">{t.footer}</p>
            <div className="h-1 w-1 rounded-full bg-foreground" />
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}

const ScanFace = ({ className, ...props }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M7 2H5a2 2 0 0 0-2 2v2" /><path d="M17 2h2a2 2 0 0 1 2 2v2" /><path d="M2 17v2a2 2 0 0 0 2 2h2" /><path d="M22 17v2a2 2 0 0 1-2 2h-2" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" x2="9.01" y1="9" y2="9" /><line x1="15" x2="15.01" y1="9" y2="9" />
  </svg>
);
