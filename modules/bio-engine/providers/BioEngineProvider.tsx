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

interface BioEngineContextValue {
  permissions: SensorPermissions;
  availability: SensorAvailability;
  tripleCheckResult: TripleCheckResult;
  isScanning: boolean;
  requestPermissions: () => Promise<void>;
  startTripleCheck: () => Promise<void>;
  cancelTripleCheck: () => void;
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
  const demoMode = useAeroStore((s) => s.demoMode);
  const setScanStatus = useAeroStore((s) => s.setScanStatus);

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
      // Demo mode: simulate scan with delays
      await new Promise((r) => setTimeout(r, 800));
      setTripleCheckResult((prev) => ({ ...prev, voice: DEMO_TRIPLE_CHECK.voice }));
      await new Promise((r) => setTimeout(r, 800));
      setTripleCheckResult((prev) => ({ ...prev, ppg: DEMO_TRIPLE_CHECK.ppg }));
      await new Promise((r) => setTimeout(r, 800));
      setTripleCheckResult(DEMO_TRIPLE_CHECK);
      setScanStatus('success');
      setIsScanning(false);
      return;
    }

    // Live pipeline:
    // 1. Voice analysis (WebAudio)
    // 2. PPG (camera + flash)
    // 3. Face (video stream)
    // Raw biometric data never leaves the device.
    setScanStatus('success');
    setIsScanning(false);
  }, [demoMode, setScanStatus]);

  const cancelTripleCheck = useCallback(() => {
    setIsScanning(false);
    setScanStatus('idle');
    setTripleCheckResult(INITIAL_RESULT);
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
      }}
    >
      {children}
    </BioEngineContext.Provider>
  );
}
