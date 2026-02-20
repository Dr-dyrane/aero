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
      await new Promise((r) => setTimeout(r, 2800));
      setTripleCheckResult((prev) => ({ ...prev, ppg: DEMO_TRIPLE_CHECK.ppg }));
      await new Promise((r) => setTimeout(r, 2800));
      setTripleCheckResult(DEMO_TRIPLE_CHECK);

      // Even in demo mode, let's run the algorithm with simulated telemetry
      if (user?.id) {
        try {
          const telemetry = normalizeTelemetry({
            voice: 0.15 + Math.random() * 0.1,
            ppg: 0.2 + Math.random() * 0.15,
            face: 0.1 + Math.random() * 0.1
          });
          const result = await fetchAeroScore(user?.id || 'demo', telemetry, demoMode);
          setAeroScore(result.score);
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
      } catch (e) {
        setScanStatus('failed');
      }
    } else {
      setScanStatus('success');
    }
    setIsScanning(false);
  }, [demoMode, setScanStatus, user?.id, setAeroScore]);

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
