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
  const nav = useNavigator();
  const { setIsNavVisible, setScrollSensitivity } = useLayout();

  // Immersive Mode: Hide Nav on Mount, Restore on Unmount
  useEffect(() => {
    setIsNavVisible(false); // Force hide nav
    setScrollSensitivity(false); // Disable scroll showing
    return () => {
      setIsNavVisible(true);
      setScrollSensitivity(true);
    };
  }, [setIsNavVisible, setScrollSensitivity]);

  const sensors = [
    {
      key: 'voice' as const,
      label: 'Vocal Biomarkers',
      desc: 'Analyzing tonal stability...',
      icon: Mic,
      result: tripleCheckResult.voice,
    },
    {
      key: 'ppg' as const,
      label: 'Hemodynamic Pulse',
      desc: 'Measuring HRV coherence...',
      icon: Camera,
      result: tripleCheckResult.ppg,
    },
    {
      key: 'face' as const,
      label: 'Micro-Expression',
      desc: 'Detecting fatigue signals...',
      icon: ScanFace,
      result: tripleCheckResult.face,
    },
  ];

  const isComplete = scanStatus === 'success' && tripleCheckResult.completedAt;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* AMBIENT RITUAL BACKGROUND */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${isScanning ? 'bg-black' : 'bg-background'}`}>
        {isScanning && <div className="absolute inset-0 bg-primary/5 animate-pulse" />}
      </div>

      {/* RITUAL HEADER */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center mb-8">
        <span className="text-[10px] font-bold tracking-[0.3em] text-primary/60 uppercase mb-2">
          {isScanning ? 'PROTOCOL ACTIVE' : 'BIO-VERIFICATION'}
        </span>
        <AeroPill
          variant={isComplete ? 'accent' : isScanning ? 'muted' : 'muted'}
          className="backdrop-blur-xl border-white/10"
        >
          {isComplete ? 'YIELD UNLOCKED' : isScanning ? 'ANALYZING...' : 'READY'}
        </AeroPill>
      </div>

      {/* THE ORB (Ritual Focus) */}
      <div className="relative z-10 py-8 scale-110">
        <AeroOrb score={aeroScore} size={isScanning ? 280 : 200} pulsing={isScanning} />
      </div>

      {/* SENSOR ARRAY (Only show during scan or result) */}
      <AnimatePresence>
        {(isScanning || isComplete) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-sm flex flex-col gap-3 relative z-10"
          >
            {sensors.map(({ key, label, desc, icon: Icon, result }, idx) => {
              const completed = !!result;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <AeroCard className={`border-white/5 bg-black/40 backdrop-blur-md ${completed ? 'border-primary/30' : ''}`}>
                    <div className="flex items-center gap-3 p-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        style={{
                          background: completed
                            ? 'rgba(0, 245, 255, 0.15)'
                            : 'rgba(255, 255, 255, 0.03)',
                        }}
                      >
                        <Icon
                          className="h-4 w-4"
                          style={{ color: completed ? '#00F5FF' : 'var(--muted-foreground)' }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold tracking-wider text-foreground uppercase">{label}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          {completed
                            ? `CONFIDENCE: ${(result.confidence * 100).toFixed(1)}%`
                            : desc}
                        </p>
                      </div>
                      {completed && (
                        <CheckCircle2 className="h-4 w-4 text-primary animate-in zoom-in spin-in-90 duration-300" />
                      )}
                    </div>
                  </AeroCard>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS PAYOFF (Yield Unlocked) */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm mt-6 relative z-10"
          >
            <AeroCard glow className="border-gold/20 bg-gold/5">
              <div className="flex flex-col items-center p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center mb-3 animate-bounce">
                  <Gem className="h-6 w-6 text-gold" />
                </div>
                <h2 className="font-serif text-2xl text-white mb-1">Yield Mined</h2>
                <p className="text-xs text-gold/80 uppercase tracking-widest font-bold mb-4">
                  + $5.00 Equity Added
                </p>
                <AeroButton onClick={() => nav.goToVault()} size="sm" variant="secondary" className="w-full">
                  View In Vault
                </AeroButton>
              </div>
            </AeroCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ACTION AREA */}
      <div className="mt-8 w-full max-w-sm relative z-10 pb-8">
        {!isScanning && !isComplete && (
          <AeroButton
            variant="primary"
            size="lg"
            className="w-full h-16 text-lg tracking-widest font-bold shadow-[0_0_60px_rgba(0,245,255,0.3)]"
            onClick={startTripleCheck}
          >
            INITIATE BIO-VERIFICATION
          </AeroButton>
        )}

        {isScanning && (
          <button
            onClick={cancelTripleCheck}
            className="w-full text-center text-xs text-muted-foreground hover:text-white transition-colors tracking-widest uppercase py-4"
          >
            Abort Protocol
          </button>
        )}

        {isComplete && (
          <button
            onClick={() => nav.goToDashboard()}
            className="w-full text-center text-xs text-muted-foreground hover:text-white transition-colors tracking-widest uppercase py-4"
          >
            Return to Terminal
          </button>
        )}
      </div>
    </main>
  );
}
