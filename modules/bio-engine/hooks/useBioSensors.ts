'use client';

import { useState, useCallback } from 'react';
import type { BiometricResult, SensorType } from '@/lib/types';

/**
 * AERO Bio-Sensor Hooks
 * Browser-side sensor logic only.
 * Raw biometric data never leaves the device.
 */

interface UseBioSensorReturn {
  isActive: boolean;
  result: BiometricResult | null;
  start: () => Promise<void>;
  stop: () => void;
}

/** Voice analysis via WebAudio */
export function useVoiceSensor(): UseBioSensorReturn {
  const [isActive, setIsActive] = useState(false);
  const [result, setResult] = useState<BiometricResult | null>(null);

  const start = useCallback(async () => {
    setIsActive(true);
    // WebAudio jitter analysis pipeline placeholder
    // Only derived confidence scores leave the device
    setResult({
      sensor: 'voice' as SensorType,
      confidence: 0,
      timestamp: new Date().toISOString(),
    });
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
  }, []);

  return { isActive, result, start, stop };
}

/** PPG (Photoplethysmography) via camera + flash */
export function usePPGSensor(): UseBioSensorReturn {
  const [isActive, setIsActive] = useState(false);
  const [result, setResult] = useState<BiometricResult | null>(null);

  const start = useCallback(async () => {
    setIsActive(true);
    // Camera + flash HRV analysis pipeline placeholder
    setResult({
      sensor: 'ppg' as SensorType,
      confidence: 0,
      timestamp: new Date().toISOString(),
    });
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
  }, []);

  return { isActive, result, start, stop };
}

/** Face analysis via video stream */
export function useFaceSensor(): UseBioSensorReturn {
  const [isActive, setIsActive] = useState(false);
  const [result, setResult] = useState<BiometricResult | null>(null);

  const start = useCallback(async () => {
    setIsActive(true);
    // Video stream perfusion analysis pipeline placeholder
    setResult({
      sensor: 'face' as SensorType,
      confidence: 0,
      timestamp: new Date().toISOString(),
    });
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
  }, []);

  return { isActive, result, start, stop };
}
