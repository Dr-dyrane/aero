'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AeroCard } from '@/modules/ui/components/AeroCard';
import { AeroPill } from '@/modules/ui/components/AeroPill';
import { AeroButton } from '@/modules/ui/components/AeroButton';
import { AeroOrb } from '@/modules/ui/components/AeroOrb';
import { useBioEngine } from '@/modules/bio-engine';
import { useAeroStore } from '@/store/useAeroStore';
import { useNavigator } from '@/lib/navigation';
import { useLayout } from '@/modules/ui/providers/LayoutProvider';
import { AeroSkeleton } from '@/modules/ui/components/AeroSkeleton';
import { useTheme } from '@/modules/ui/providers/ThemeProvider';
import { Mic, Camera, ScanFace, CheckCircle2, Circle, ShieldCheck, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function ScanPage() {
  const {
    tripleCheckResult,
    isScanning,
    startTripleCheck,
    cancelTripleCheck,
  } = useBioEngine();
  const scanStatus = useAeroStore((s) => s.scanStatus);
  const aeroScore = useAeroStore((s) => s.aeroScore);
  const language = useAeroStore((s) => s.language);
  const nav = useNavigator();
  const { setIsNavVisible, setScrollSensitivity, isSkeletonLoading, setSkeletonLoading } = useLayout();
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'eclipse';
  const logoSrc = isDark ? "/as.png" : "/as_light.png"; // Default theme-sensitive logo if no imgSrc provided

  useEffect(() => {
    setSkeletonLoading(true);
    const timer = setTimeout(() => setSkeletonLoading(false), 800);
    return () => clearTimeout(timer);
  }, [setSkeletonLoading]);

  const content = {
    en: {
      protocolActive: "SCANNING",
      bioVerification: "Health Scan",
      yieldUnlocked: "REWARD UNLOCKED",
      analyzing: "ANALYZING...",
      ready: "READY",
      confidence: "Accuracy",
      yieldMined: "Reward Earned",
      equityAdded: "+ $5.00 Balance Added",
      equityDeducted: "- $5.00 Balance Reverted",
      stabilityFailure: "STABILITY FAILURE",
      viewInVault: "View Balance",
      initiate: "START HEALTH SCAN",
      abort: "Cancel",
      return: "Return Home",
      sensors: {
        voice: { label: "Voice Scan", desc: "Checking voice stability..." },
        ppg: { label: "Heart Scan", desc: "Measuring heart rhythm..." },
        face: { label: "Face Scan", desc: "Analyzing facial signals..." }
      }
    },
    ar: {
      protocolActive: "جاري الفحص",
      bioVerification: "فحص الصحة",
      yieldUnlocked: "تم فتح المكافأة",
      analyzing: "جاري التحليل...",
      ready: "جاهز",
      confidence: "مستوى الدقة",
      yieldMined: "تم ربح المكافأة",
      equityAdded: "+ ٥.٠٠ دولار رصيد مضاف",
      equityDeducted: "- ٥.٠٠ دولار رصيد مسترجع",
      stabilityFailure: "فشل الاستقرار",
      viewInVault: "عرض الرصيد",
      initiate: "بدء فحص الصحة",
      abort: "إلغاء",
      return: "العودة للرئيسية",
      sensors: {
        voice: { label: "فحص الصوت", desc: "تحليل استقرار نبرة الصوت..." },
        ppg: { label: "فحص القلب", desc: "قياس انتظام نبضات القلب..." },
        face: { label: "فحص الوجه", desc: "تحليل إشارات الوجه..." }
      }
    }
  };

  const t = language === 'ar' ? content.ar : content.en;

  // Immersive Mode
  useEffect(() => {
    setIsNavVisible(false);
    setScrollSensitivity(false);
    return () => {
      setIsNavVisible(true);
      setScrollSensitivity(true);
    };
  }, [setIsNavVisible, setScrollSensitivity]);

  const isComplete = scanStatus === 'success' && tripleCheckResult.completedAt;

  // Determine current active sensor step
  const activeSensor = !tripleCheckResult.voice ? 'voice' : !tripleCheckResult.ppg ? 'ppg' : !tripleCheckResult.face ? 'face' : null;

  const sensorData = {
    voice: { label: t.sensors.voice.label, desc: t.sensors.voice.desc, icon: Mic },
    ppg: { label: t.sensors.ppg.label, desc: t.sensors.ppg.desc, icon: Camera },
    face: { label: t.sensors.face.label, desc: t.sensors.face.desc, icon: ScanFace },
  };

  if (isSkeletonLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 bg-background">
        <div className="absolute top-12 flex flex-col items-center gap-2">
          <AeroSkeleton variant="circle" className="h-[72px] w-[72px]" />
          <AeroSkeleton className="h-3 w-32" />
        </div>
        <div className="flex flex-col items-center gap-12 w-full max-w-sm">
          <AeroSkeleton variant="circle" className="h-[240px] w-[240px]" />
          <AeroSkeleton variant="pill" className="h-20 w-full" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-6 relative overflow-hidden bg-background">
      {/* AMBIENT RITUAL BACKGROUND */}
      <div className={cn(
        "absolute inset-0 transition-colors duration-1000",
        isScanning
          ? (resolvedTheme === 'eclipse' ? 'bg-black' : 'bg-white')
          : 'bg-background'
      )}>
        {isScanning && (
          <div className={cn(
            "absolute inset-0 animate-pulse",
            resolvedTheme === 'eclipse' ? "bg-primary/5" : "bg-primary/[0.03]"
          )} />
        )}
      </div>

      {/* FIXED STATUS ANCHOR (72px AeroOrb as requested) */}
      <div className="absolute top-12 flex flex-col items-center gap-2 z-50">
        <AeroOrb score={aeroScore} size={72} pulsing={isScanning} />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[9px] font-bold tracking-[0.3em] text-primary/60 uppercase"
        >
          {isScanning ? t.protocolActive : t.bioVerification}
        </motion.span>
      </div>

      <AnimatePresence mode="wait">
        {!isScanning && !isComplete ? (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            className="flex flex-col items-center justify-center z-10 w-full max-w-sm relative min-h-[400px]"
          >
            {/* RITUAL ARTIFACT BACKGROUND */}
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: resolvedTheme === 'eclipse' ? [0.18, 0.25, 0.18] : [0.12, 0.18, 0.12],
                  filter: resolvedTheme === 'eclipse'
                    ? [`drop-shadow(0 0 80px color-mix(in srgb, var(--primary) 15%, transparent))`, `drop-shadow(0 0 160px color-mix(in srgb, var(--primary) 30%, transparent))`, `drop-shadow(0 0 80px color-mix(in srgb, var(--primary) 15%, transparent))`]
                    : [`drop-shadow(0 0 50px color-mix(in srgb, var(--primary) 10%, transparent))`, `drop-shadow(0 0 100px color-mix(in srgb, var(--primary) 20%, transparent))`, `drop-shadow(0 0 50px color-mix(in srgb, var(--primary) 10%, transparent))`]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="relative w-[520px] h-[520px] saturate-[1.3]"
              >
                <Image
                  src={logoSrc}
                  alt="Ritual Artifact"
                  fill
                  className="object-contain"
                />
              </motion.div>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-12 w-full">
              <div className="flex flex-col items-center gap-2">
                <span className={cn(
                  "text-[10px] tracking-[0.4em] font-bold uppercase",
                  resolvedTheme === 'eclipse' ? "text-primary opacity-60" : "text-primary/80"
                )}>{t.ready}</span>
                <h2 className="text-3xl font-serif text-foreground tracking-tighter">{t.bioVerification}</h2>
              </div>

              <AeroButton
                variant="primary"
                size="lg"
                className={cn(
                  "w-full h-20 text-lg tracking-widest font-bold shadow-2xl border backdrop-blur-xl transition-all",
                  resolvedTheme === 'eclipse'
                    ? "bg-primary/20 border-primary/30 text-primary shadow-primary/20"
                    : "bg-primary text-white border-primary/10 shadow-primary/40"
                )}
                onClick={startTripleCheck}
              >
                {t.initiate}
              </AeroButton>
            </div>
          </motion.div>
        ) : isScanning ? (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center w-full max-w-sm z-10 gap-8"
          >
            {/* Focused Sensor View: Progressive Disclosure */}
            <AnimatePresence mode="wait">
              {activeSensor && (
                <motion.div
                  key={activeSensor}
                  initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
                  className="w-full"
                >
                  <AeroCard className={cn(
                    "p-8 border-primary/20 backdrop-blur-2xl active:scale-[0.98] transition-transform",
                    resolvedTheme === 'eclipse'
                      ? "bg-black/40 shadow-[0_0_80px_color-mix(in srgb, var(--primary) 10%, transparent)]"
                      : "bg-white/80 shadow-[0_40px_100px_rgba(0,0,0,0.05)] border-primary/10"
                  )}>
                    <div className="flex flex-col items-center text-center gap-6">
                      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 animate-pulse">
                        {(() => {
                          const Icon = sensorData[activeSensor as keyof typeof sensorData].icon;
                          return <Icon className="h-10 w-10 text-primary" />;
                        })()}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-serif text-foreground tracking-wide">
                          {sensorData[activeSensor as keyof typeof sensorData].label}
                        </h3>
                        <p className="text-sm text-muted-foreground/60 font-mono tracking-tight">
                          {sensorData[activeSensor as keyof typeof sensorData].desc}
                        </p>
                      </div>

                      {/* Progress Line */}
                      <div className={cn(
                        "w-full h-[1px] relative overflow-hidden",
                        resolvedTheme === 'eclipse' ? "bg-white/5" : "bg-black/5"
                      )}>
                        <motion.div
                          className="absolute inset-0 bg-primary"
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    </div>
                  </AeroCard>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={cancelTripleCheck}
              className={cn(
                "mt-4 text-[10px] transition-colors tracking-[0.3em] uppercase py-4 font-bold",
                resolvedTheme === 'eclipse' ? "text-muted-foreground/60 hover:text-destructive" : "text-foreground/40 hover:text-destructive"
              )}
            >
              {t.abort}
            </button>
          </motion.div>
        ) : isComplete ? (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center w-full max-w-sm z-10 gap-6"
          >
            <AeroCard
              glow
              className={cn(
                "w-full backdrop-blur-3xl p-8 border",
                aeroScore <= 20 ? "border-red-500/30 bg-red-500/5 shadow-[0_0_80px_rgba(239,68,68,0.1)]" : "border-gold/30 bg-gold/5"
              )}
            >
              <div className="flex flex-col items-center text-center gap-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12 }}
                  className={cn(
                    "h-24 w-24 rounded-full flex items-center justify-center",
                    aeroScore <= 20
                      ? "bg-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.3)]"
                      : "bg-gold/20 shadow-[0_0_50px_rgba(212,175,55,0.3)]"
                  )}
                >
                  {aeroScore <= 20 ? (
                    <ShieldCheck className="h-12 w-12 text-red-500" />
                  ) : (
                    <Gem className="h-12 w-12 text-gold" />
                  )}
                </motion.div>

                <div className="space-y-2">
                  <h2 className={cn(
                    "font-serif text-4xl transition-colors",
                    aeroScore <= 20 ? "text-red-500" : (resolvedTheme === 'eclipse' ? "text-white" : "text-foreground")
                  )}>
                    {aeroScore <= 20 ? t.stabilityFailure : t.yieldMined}
                  </h2>
                  <p className={cn(
                    "text-sm uppercase tracking-[0.2em] font-bold",
                    aeroScore <= 20 ? "text-red-400" : "text-gold/80"
                  )}>
                    {aeroScore <= 20 ? t.equityDeducted : t.equityAdded}
                  </p>
                </div>

                <div className="w-full space-y-3 pt-4">
                  <AeroButton
                    onClick={() => nav.goToVault()}
                    size="lg"
                    variant="primary"
                    className="w-full bg-gold border-none text-black hover:bg-gold/90"
                  >
                    {t.viewInVault}
                  </AeroButton>
                  <AeroButton
                    onClick={() => nav.goToHowItWorks()}
                    size="lg"
                    variant="ghost"
                    className="w-full border-primary/20 hover:bg-primary/5 text-primary text-[10px] tracking-[0.2em] font-bold"
                  >
                    DECODE YOUR SCORE
                  </AeroButton>
                  <button
                    onClick={() => nav.goToDashboard()}
                    className={cn(
                      "w-full text-center text-[10px] transition-colors tracking-[0.2em] uppercase py-4 font-bold",
                      resolvedTheme === 'eclipse' ? "text-muted-foreground hover:text-white" : "text-foreground/60 hover:text-primary"
                    )}
                  >
                    {t.return}
                  </button>
                </div>
              </div>
            </AeroCard>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
