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
import { Mic, Camera, ScanFace, CheckCircle2, Circle, ShieldCheck, Gem } from 'lucide-react';

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
  const { setIsNavVisible, setScrollSensitivity } = useLayout();

  const content = {
    en: {
      protocolActive: "PROTOCOL ACTIVE",
      bioVerification: "BIO-VERIFICATION",
      yieldUnlocked: "YIELD UNLOCKED",
      analyzing: "ANALYZING...",
      ready: "READY",
      confidence: "CONFIDENCE",
      yieldMined: "Yield Mined",
      equityAdded: "+ $5.00 Equity Added",
      viewInVault: "View In Vault",
      initiate: "INITIATE BIO-VERIFICATION",
      abort: "Abort Protocol",
      return: "Return to Terminal",
      sensors: {
        voice: { label: "Vocal Biomarkers", desc: "Analyzing tonal stability..." },
        ppg: { label: "Hemodynamic Pulse", desc: "Measuring HRV coherence..." },
        face: { label: "Micro-Expression", desc: "Detecting fatigue signals..." }
      }
    },
    ar: {
      protocolActive: "البروتوكول نشط",
      bioVerification: "التحقق الحيوي",
      yieldUnlocked: "تم فتح العائد",
      analyzing: "جاري التحليل...",
      ready: "جاهز",
      confidence: "مستوى الثقة",
      yieldMined: "تم حصاد العائد",
      equityAdded: "+ ٥.٠٠ دولار أصول مضافة",
      viewInVault: "عرض الخزنة",
      initiate: "بدء التحقق الحيوي",
      abort: "إلغاء البروتوكول",
      return: "العودة إلى الواجهة",
      sensors: {
        voice: { label: "المقاييس الصوتية", desc: "تحليل استقرار النبرة..." },
        ppg: { label: "النبض الدوري", desc: "قياس تباين معدل ضربات القلب..." },
        face: { label: "تعبيرات دقيقة", desc: "كشف إشارات الإرهاق..." }
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

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-6 relative overflow-hidden bg-background">
      {/* AMBIENT RITUAL BACKGROUND */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${isScanning ? 'bg-black' : 'bg-background'}`}>
        {isScanning && <div className="absolute inset-0 bg-primary/5 animate-pulse" />}
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
            className="flex flex-col items-center gap-12 z-10 w-full max-w-sm"
          >
            <div className="relative py-8">
              <AeroOrb score={aeroScore} size={240} />
            </div>

            <AeroButton
              variant="primary"
              size="lg"
              className="w-full h-20 text-lg tracking-widest font-bold shadow-[0_0_60px_rgba(0,245,255,0.3)] border border-primary/20"
              onClick={startTripleCheck}
            >
              {t.initiate}
            </AeroButton>
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
                  <AeroCard className="p-8 border-primary/20 bg-black/40 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,245,255,0.1)] active:scale-[0.98] transition-transform">
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
                      <div className="w-full h-[1px] bg-white/5 relative overflow-hidden">
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
              className="mt-4 text-[10px] text-muted-foreground/40 hover:text-destructive transition-colors tracking-[0.3em] uppercase py-4"
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
            <AeroCard glow className="w-full border-gold/30 bg-gold/5 backdrop-blur-3xl p-8">
              <div className="flex flex-col items-center text-center gap-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12 }}
                  className="h-24 w-24 rounded-full bg-gold/20 flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.3)]"
                >
                  <Gem className="h-12 w-12 text-gold" />
                </motion.div>

                <div className="space-y-2">
                  <h2 className="font-serif text-4xl text-white">{t.yieldMined}</h2>
                  <p className="text-sm text-gold/80 uppercase tracking-[0.2em] font-bold">
                    {t.equityAdded}
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
                  <button
                    onClick={() => nav.goToDashboard()}
                    className="w-full text-center text-[10px] text-muted-foreground hover:text-white transition-colors tracking-[0.2em] uppercase py-4"
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
