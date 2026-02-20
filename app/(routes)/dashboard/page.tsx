'use client';

import { AeroOrb, AeroCard, AeroPill, AeroButton } from '@/modules/ui';
import { useAeroStore } from '@/store/useAeroStore';
import { useVault } from '@/modules/vault';
import { useAuth } from '@/modules/auth';
import { useNavigator } from '@/lib/navigation';
import { DEMO_MERITS, DEMO_SCAN_HISTORY, MERIT_LEVELS } from '@/lib/data';
import { Shield, Zap, TrendingUp, ChevronRight, Sparkles, Brain, Clock } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

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

        {/* Hero Score Section */}
        <motion.section variants={item} className="flex flex-col items-center py-4 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
          <AeroOrb score={aeroScore} size={288} imgSrc="/as.png" />
          <div className="mt-4 flex items-center gap-2">
            <AeroPill variant={scanStatus === 'success' ? 'accent' : 'muted'}>
              <div className={scanStatus === 'success' ? 'animate-pulse' : ''}>
                {scanStatus === 'success' ? 'Authenticated Clean' : 'Awaiting Check'}
              </div>
            </AeroPill>
            <AeroPill variant="muted" className="aero-surface">
              <Zap className="mr-1 h-3 w-3" style={{ color: 'var(--gold)' }} />
              {streak}d Streak
            </AeroPill>
          </div>
        </motion.section>

        {/* Intelligence Card */}
        <motion.div variants={item} className="w-full mt-10">
          <AeroCard className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Brain className="h-12 w-12 text-primary" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[10px] tracking-widest text-primary uppercase font-bold">
                <Sparkles className="h-3 w-3" />
                Live Insight
              </div>
              <p className="text-sm font-medium leading-relaxed text-foreground/90 italic">
                "Your baseline stability is up by 4.2% since yesterday. Recovery window is optimal for high-focus tasks."
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-border/10">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Updated 12m ago
                </div>
                <button className="text-[10px] font-bold text-primary hover:text-white transition-colors flex items-center gap-1">
                  VIEW REPORT <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </AeroCard>
        </motion.div>

        {/* Vault Summary (Primary Action) */}
        <motion.div variants={item} className="w-full mt-4">
          <AeroCard glow className="p-0">
            <button
              onClick={() => nav.goToVault()}
              className="flex w-full items-center justify-between p-4 group"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 transition-transform group-hover:scale-105">
                  <Shield className="h-6 w-6 text-gold" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] tracking-widest text-muted-foreground uppercase font-bold">Bio-Vault</p>
                  <p className="font-numbers text-2xl font-medium text-foreground">
                    {'$'}{spendableBalance.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                <span className="text-[10px] text-muted-foreground font-medium">
                  {'$'}{lockedBalance.toFixed(2)} PENDING
                </span>
              </div>
            </button>
          </AeroCard>
        </motion.div>

        {/* History & Progress Grid */}
        <motion.div variants={item} className="grid grid-cols-2 gap-3 w-full mt-4">
          <AeroCard className="p-4 flex flex-col justify-between h-32">
            <div>
              <p className="text-[10px] tracking-widest text-muted-foreground uppercase font-bold mb-1">Status</p>
              <div className="flex items-center gap-1.5 mt-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="font-numbers text-lg font-medium">87</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">91% Confidence</p>
          </AeroCard>

          <AeroCard className="p-4 flex flex-col justify-between h-32">
            <div>
              <p className="text-[10px] tracking-widest text-muted-foreground uppercase font-bold mb-1">Next Merit</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-2 w-2 rounded-full" style={{ background: nextMerit.color }} />
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
              <p className="text-[10px] text-muted-foreground text-right">{streak}/{nextMerit.threshold}d</p>
            </div>
          </AeroCard>
        </motion.div>

        {/* Primary Action Button */}
        <motion.div variants={item} className="w-full mt-10">
          <AeroButton
            variant="primary"
            size="lg"
            className="w-full h-14 text-lg shadow-[0_0_40px_rgba(0,245,255,0.15)] group"
            onClick={() => nav.goToScan()}
          >
            <ScanFace className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
            Start Triple-Check
          </AeroButton>
          <p className="mt-4 text-center text-[10px] text-muted-foreground tracking-widest uppercase font-medium">
            Next scan recommended in 4 hours
          </p>
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
