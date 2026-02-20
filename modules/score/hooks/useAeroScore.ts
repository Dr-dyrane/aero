'use client';

import { useCallback } from 'react';
import { useAeroStore } from '@/store/useAeroStore';
import type { AeroScoreInput, AeroScoreResult } from '@/lib/types';

/**
 * Compute Aero Score (0-100)
 * Combines clinical weights (Fagerstrom-like) with biometric confidence.
 * Clinical: 60% weight, Biometric: 40% weight.
 */
export function computeAeroScore(input: AeroScoreInput): AeroScoreResult {
  const clinicalNormalized = Math.max(0, Math.min(10, input.clinicalScore));
  const biometricNormalized = Math.max(0, Math.min(1, input.biometricConfidence));

  // Clinical contributes 60 points max, biometric 40 points max
  const clinicalComponent = (clinicalNormalized / 10) * 60;
  const biometricComponent = biometricNormalized * 40;

  const score = Math.round(clinicalComponent + biometricComponent);

  return {
    score: Math.max(0, Math.min(100, score)),
    components: {
      clinical: Math.round(clinicalComponent),
      biometric: Math.round(biometricComponent),
    },
    computedAt: new Date().toISOString(),
  };
}

/** Hook: Aero Score state + computation */
export function useAeroScore() {
  const aeroScore = useAeroStore((s) => s.aeroScore);
  const setAeroScore = useAeroStore((s) => s.setAeroScore);

  const compute = useCallback(
    (input: AeroScoreInput) => {
      const result = computeAeroScore(input);
      setAeroScore(result.score);
      return result;
    },
    [setAeroScore]
  );

  return {
    score: aeroScore,
    compute,
  };
}
