'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { useAeroStore } from '@/store/useAeroStore';
import { DEMO_TRIPLE_CHECK } from '@/lib/data';
import type {
  SensorPermissions,
  SensorAvailability,
  TripleCheckResult,
} from '@/lib/types';
import { useAuth } from '@/modules/auth';
import { normalizeTelemetry, fetchAeroScore } from '../services/algorithm';
import { useFeedback } from '@/modules/ui/hooks/useFeedback';

interface BioEngineContextValue {
  permissions: SensorPermissions;
  availability: SensorAvailability;
  tripleCheckResult: TripleCheckResult;
  isScanning: boolean;
  requestPermissions: () => Promise<void>;
  startTripleCheck: () => Promise<void>;
  cancelTripleCheck: () => void;
  resetScan: () => void;
}

const BioEngineContext = createContext<BioEngineContextValue | null>(null);

export function useBioEngine() {
  const ctx = useContext(BioEngineContext);
  if (!ctx)
    throw new Error('useBioEngine must be used within BioEngineProvider');
  return ctx;
}

const INITIAL_RESULT: TripleCheckResult = {
  voice: null,
  ppg: null,
  face: null,
  overallConfidence: 0,
  completedAt: null,
};

export function BioEngineProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const demoMode = useAeroStore((s) => s.demoMode);
  const setScanStatus = useAeroStore((s) => s.setScanStatus);
  const setAeroScore = useAeroStore((s) => s.setAeroScore);
  const setVault = useAeroStore((s) => s.setVault);
  const vault = useAeroStore((s) => s.vault);
  const addTransaction = useAeroStore((s) => s.addTransaction);
  const addScan = useAeroStore((s) => s.addScan);

  const [permissions, setPermissions] = useState<SensorPermissions>({
    microphone: 'unknown',
    camera: 'unknown',
  });

  const [availability, setAvailability] = useState<SensorAvailability>({
    voice: false,
    ppg: false,
    face: false,
  });

  const [tripleCheckResult, setTripleCheckResult] =
    useState<TripleCheckResult>(INITIAL_RESULT);

  const [isScanning, setIsScanning] = useState(false);
  const { playPulse, playSuccess, playError } = useFeedback();

  // Detect sensor availability on mount
  useEffect(() => {
    const hasMediaDevices = !!navigator?.mediaDevices?.getUserMedia;
    setAvailability({
      voice: hasMediaDevices,
      ppg: hasMediaDevices, // PPG uses camera
      face: hasMediaDevices, // Face uses camera
    });
  }, []);

  const requestPermissions = useCallback(async () => {
    try {
      // Request microphone
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      micStream.getTracks().forEach((t) => t.stop());
      setPermissions((prev) => ({ ...prev, microphone: 'granted' }));
    } catch {
      setPermissions((prev) => ({ ...prev, microphone: 'denied' }));
    }

    try {
      // Request camera
      const camStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      camStream.getTracks().forEach((t) => t.stop());
      setPermissions((prev) => ({ ...prev, camera: 'granted' }));
    } catch {
      setPermissions((prev) => ({ ...prev, camera: 'denied' }));
    }
  }, []);

  const startTripleCheck = useCallback(async () => {
    setIsScanning(true);
    setScanStatus('scanning');
    setTripleCheckResult(INITIAL_RESULT);

    if (demoMode) {
      // Demo mode: simulate scan with delays (Slow & Graceful)
      await new Promise((r) => setTimeout(r, 2800));
      setTripleCheckResult((prev) => ({ ...prev, voice: DEMO_TRIPLE_CHECK.voice }));
      playPulse();
      await new Promise((r) => setTimeout(r, 2800));
      setTripleCheckResult((prev) => ({ ...prev, ppg: DEMO_TRIPLE_CHECK.ppg }));
      playPulse();
      await new Promise((r) => setTimeout(r, 2800));
      setTripleCheckResult(DEMO_TRIPLE_CHECK);
      playSuccess();

      // Even in demo mode, let's run the algorithm with simulated telemetry
      if (user?.id || demoMode) {
        try {
          // Generate realistic "clean" telemetry (~0.8 - 1.0) with 5% chance of failure
          const isFailing = Math.random() < 0.05;
          const base = isFailing ? 0.1 : 0.85;

          const telemetry = normalizeTelemetry({
            voice: base + Math.random() * 0.1,
            ppg: (base + 0.05) + Math.random() * 0.1,
            face: (base - 0.05) + Math.random() * 0.1
          });
          const result = await fetchAeroScore(user?.id || 'demo', telemetry, demoMode);
          setAeroScore(result.score);

          // Update Vault and Record History
          if (result.score > 80) {
            setVault((v) => ({
              spendable: v.spendable + 5.00,
              locked: Math.max(0, v.locked - 5.00)
            }));
            addTransaction({
              amount: 5,
              type: 'unlock',
              description: 'Daily stability reward'
            });
            addScan({
              score: result.score,
              confidence: 0.9 + Math.random() * 0.1,
              status: 'clean'
            });
          } else if (result.score <= 20) {
            setVault((v) => {
              const deduction = Math.min(v.spendable, 5.00);
              return {
                spendable: v.spendable - deduction,
                locked: v.locked + deduction
              };
            });
            addTransaction({
              amount: 5, // Logic for amount is handled in functional update
              type: 'unlock',
              description: 'Stability Reversion'
            });
            addScan({
              score: result.score,
              confidence: 0.8 + Math.random() * 0.1,
              status: 'compromised'
            });
          }
        } catch (e) {
          console.warn('Algorithm sync failed, falling back to demo static score');
        }
      }

      setScanStatus('success');
      setIsScanning(false);
      return;
    }

    // Live pipeline:
    // 1. Voice analysis (WebAudio)
    // 2. PPG (camera + flash)
    // 3. Face (video stream)
    // Raw biometric data never leaves the device.
    if (user?.id) {
      try {
        // Placeholder for real sensor data collection
        const telemetry = normalizeTelemetry({
          voice: 0.5, // To be replaced with real frequency tracking
          ppg: 0.5,   // To be replaced with real pulse-ox
          face: 0.5   // To be replaced with real perfusion map
        });
        const result = await fetchAeroScore(user.id, telemetry, demoMode);
        setAeroScore(result.score);
        setScanStatus('success');
        playSuccess();
      } catch (e) {
        setScanStatus('failed');
        playError();
      }
    } else {
      setScanStatus('success');
      playSuccess();
    }
    setIsScanning(false);
  }, [demoMode, setScanStatus, user?.id, setAeroScore, playPulse, playSuccess, playError, vault, setVault, addTransaction, addScan]);

  const cancelTripleCheck = useCallback(() => {
    setIsScanning(false);
    setScanStatus('idle');
    setTripleCheckResult(INITIAL_RESULT);
  }, [setScanStatus]);

  const resetScan = useCallback(() => {
    setScanStatus('idle');
    setTripleCheckResult(INITIAL_RESULT);
    setIsScanning(false);
  }, [setScanStatus]);

  return (
    <BioEngineContext.Provider
      value={{
        permissions,
        availability,
        tripleCheckResult,
        isScanning,
        requestPermissions,
        startTripleCheck,
        cancelTripleCheck,
        resetScan,
      }}
    >
      {children}
    </BioEngineContext.Provider>
  );
}
