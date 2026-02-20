'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AeroCard } from '@/modules/ui/components/AeroCard';
import { AeroPill } from '@/modules/ui/components/AeroPill';
import { AeroButton } from '@/modules/ui/components/AeroButton';
import { AeroOrb } from '@/modules/ui/components/AeroOrb';
import { useBioEngine } from '@/modules/bio-engine';
import { useAeroStore } from '@/store/useAeroStore';
import { useNavigator } from '@/lib/navigation';
import { ArrowLeft, Mic, Camera, ScanFace, CheckCircle2, Circle } from 'lucide-react';

export default function ScanPage() {
  const {
    tripleCheckResult,
    isScanning,
    startTripleCheck,
    cancelTripleCheck,
  } = useBioEngine();
  const scanStatus = useAeroStore((s) => s.scanStatus);
  const aeroScore = useAeroStore((s) => s.aeroScore);
  const demoMode = useAeroStore((s) => s.demoMode);
  const nav = useNavigator();

  const sensors = [
    {
      key: 'voice' as const,
      label: 'Voice Analysis',
      desc: 'Vocal biomarker detection',
      icon: Mic,
      result: tripleCheckResult.voice,
    },
    {
      key: 'ppg' as const,
      label: 'PPG Scan',
      desc: 'Heart rate variability via camera',
      icon: Camera,
      result: tripleCheckResult.ppg,
    },
    {
      key: 'face' as const,
      label: 'Face Scan',
      desc: 'Micro-expression analysis',
      icon: ScanFace,
      result: tripleCheckResult.face,
    },
  ];

  const isComplete = scanStatus === 'success' && tripleCheckResult.completedAt;

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
          Triple-Check
        </h1>
        <div className="ml-auto flex items-center gap-2">
          {demoMode && <AeroPill variant="accent">DEMO</AeroPill>}
          <AeroPill
            variant={isComplete ? 'accent' : isScanning ? 'muted' : 'muted'}
          >
            {isComplete ? 'Complete' : isScanning ? 'Scanning...' : scanStatus}
          </AeroPill>
        </div>
      </header>

      {/* Orb visualization */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="py-4"
          >
            <AeroOrb score={aeroScore} size={140} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sensor Cards */}
      <div className="mt-4 flex w-full max-w-sm flex-col gap-3">
        {sensors.map(({ key, label, desc, icon: Icon, result }) => {
          const completed = !!result;
          return (
            <AeroCard key={key}>
              <div className="flex items-center gap-3 p-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    background: completed
                      ? 'rgba(0, 245, 255, 0.15)'
                      : 'var(--surface-translucent)',
                  }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: completed ? '#00F5FF' : 'var(--muted-foreground)' }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">
                    {completed
                      ? `${(result.confidence * 100).toFixed(0)}% confidence`
                      : desc}
                  </p>
                </div>
                {completed ? (
                  <CheckCircle2 className="h-5 w-5" style={{ color: '#00F5FF' }} />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </AeroCard>
          );
        })}
      </div>

      {/* Results */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 w-full max-w-sm"
        >
          <AeroCard glow>
            <div className="flex flex-col items-center p-4">
              <p className="text-xs text-muted-foreground">Overall Confidence</p>
              <p className="font-numbers text-3xl font-bold" style={{ color: '#00F5FF' }}>
                {(tripleCheckResult.overallConfidence * 100).toFixed(0)}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Scan verified. $5 unlocked to Bio-Vault.
              </p>
            </div>
          </AeroCard>
        </motion.div>
      )}

      {/* Actions */}
      <div className="mt-6 flex w-full max-w-sm flex-col gap-3">
        {!isScanning && !isComplete && (
          <AeroButton
            variant="primary"
            size="lg"
            className="w-full"
            onClick={startTripleCheck}
          >
            Begin Scan
          </AeroButton>
        )}

        {isScanning && (
          <AeroButton
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={cancelTripleCheck}
          >
            Cancel Scan
          </AeroButton>
        )}

        {isComplete && (
          <>
            <AeroButton
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => nav.goToDashboard()}
            >
              Back to Dashboard
            </AeroButton>
            <AeroButton
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={startTripleCheck}
            >
              Scan Again
            </AeroButton>
          </>
        )}
      </div>
    </main>
  );
}
