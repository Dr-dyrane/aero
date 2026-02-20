'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAeroStore } from '@/store/useAeroStore';
import { useApi } from '@/modules/api/providers/ApiProvider';
import {
  calculateAeroScore,
  type AeroScoreInput,
  type AeroScoreResult,
  getScoreInterpretation,
} from '@/lib/aeroScoreCalculator';

export function useAeroScoreCalculator() {
  const { aeroScore, setAeroScore } = useAeroStore();
  const api = useApi();
  const [isCalculating, setIsCalculating] = useState(false);
  const [lastCalculation, setLastCalculation] = useState<AeroScoreResult | null>(null);

  /**
   * Calculate Aero Score from current biometric data
   */
  const calculateScore = useCallback(async (
    input: AeroScoreInput,
    saveToServer = true
  ): Promise<AeroScoreResult> => {
    setIsCalculating(true);
    
    try {
      // Local calculation (privacy-first)
      const result = calculateAeroScore(input);
      setLastCalculation(result);
      
      // Update store with new score
      setAeroScore(result.score);
      
      // Optionally save to server for longitudinal tracking
      if (saveToServer) {
        await api.calculateAeroScore('current-user', input.behavioral, {
          vocal: input.vocal,
          hemodynamic: input.hemodynamic,
        });
      }
      
      return result;
    } catch (error) {
      console.error('Aero Score calculation failed:', error);
      throw error;
    } finally {
      setIsCalculating(false);
    }
  }, [api, setAeroScore]);

  /**
   * Quick score update with minimal data
   */
  const updateScoreQuick = useCallback(async (
    timeSinceLastUse: number,
    cravingsToday: number
  ): Promise<number> => {
    // Create minimal input for quick calculation
    const minimalInput: AeroScoreInput = {
      behavioral: {
        timeSinceLastUse,
        cravingsLogged: cravingsToday,
        daysClean: Math.floor(timeSinceLastUse / 24),
      },
      vocal: {
        jitterDeviation: 0.2, // placeholder
        shimmerDeviation: 0.15, // placeholder
        spectralCentroidShift: 0.1, // placeholder
      },
      hemodynamic: {
        hrvDelta: 0.1, // placeholder
        vasoconstrictionIndex: 0.3, // placeholder
        oxygenSaturation: 0.95, // placeholder
      },
    };

    const result = await calculateScore(minimalInput, false);
    return result.score;
  }, [calculateScore]);

  /**
   * Get current score interpretation
   */
  const getInterpretation = useCallback(() => {
    return getScoreInterpretation(aeroScore);
  }, [aeroScore]);

  /**
   * Simulate daily score change (for demo/testing)
   */
  const simulateDailyChange = useCallback(async () => {
    const currentInterpretation = getInterpretation();
    
    // Simulate improvement for demo
    const improvement = Math.random() * 5 + 2; // 2-7 point improvement
    const newScore = Math.min(100, aeroScore + improvement);
    
    setAeroScore(Math.round(newScore));
    
    return {
      previousScore: aeroScore,
      newScore: Math.round(newScore),
      improvement: Math.round(improvement),
    };
  }, [aeroScore, setAeroScore, getInterpretation]);

  return {
    // State
    currentScore: aeroScore,
    isCalculating,
    lastCalculation,
    interpretation: getInterpretation(),
    
    // Actions
    calculateScore,
    updateScoreQuick,
    simulateDailyChange,
    getInterpretation,
  };
}
