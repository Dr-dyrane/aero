/**
 * Aero Score Calculator ($AS$)
 * Privacy-first local computation for nicotine cessation scoring
 * 
 * Formula: AS = ((Wb * B) + (Wv * V) + (Wh * H)) / Stotal) * 100
 */

export interface BehavioralMetrics {
  timeSinceLastUse: number; // hours since last nicotine use
  cravingsLogged: number; // number of cravings logged today
  daysClean: number; // consecutive days without nicotine
}

export interface VocalMetrics {
  jitterDeviation: number; // deviation from baseline (0-1)
  shimmerDeviation: number; // deviation from baseline (0-1)
  spectralCentroidShift: number; // voice frequency shift (0-1)
}

export interface HemodynamicMetrics {
  hrvDelta: number; // Heart Rate Variability change from baseline (-1 to 1)
  vasoconstrictionIndex: number; // blood vessel constriction (0-1)
  oxygenSaturation: number; // SpO2 percentage (0-1)
}

export interface AeroScoreInput {
  behavioral: BehavioralMetrics;
  vocal: VocalMetrics;
  hemodynamic: HemodynamicMetrics;
  baseline?: {
    vocal: VocalMetrics;
    hemodynamic: HemodynamicMetrics;
  };
}

export interface AeroScoreWeights {
  behavioral: number; // Wb
  vocal: number; // Wv
  hemodynamic: number; // Wh
}

export interface AeroScoreResult {
  score: number; // 0-100
  breakdown: {
    behavioral: number;
    vocal: number;
    hemodynamic: number;
  };
  confidence: number; // 0-1, based on data quality
  trend: 'improving' | 'stable' | 'declining';
}

/**
 * Default weights optimized for clinical effectiveness
 */
const DEFAULT_WEIGHTS: AeroScoreWeights = {
  behavioral: 0.4, // 40% - behavioral patterns are strongest predictor
  vocal: 0.3, // 30% - vocal biomarkers indicate acute inflammation
  hemodynamic: 0.3, // 30% - cardiovascular recovery metrics
};

/**
 * Calculate normalized behavioral score (0-1)
 */
function calculateBehavioralScore(metrics: BehavioralMetrics): number {
  // Time since last use: better if longer
  const timeScore = Math.min(metrics.timeSinceLastUse / 168, 1); // cap at 1 week
  
  // Cravings: better if fewer
  const cravingsScore = Math.max(0, 1 - (metrics.cravingsLogged / 10)); // assume 10 is max
  
  // Days clean: linear progression
  const daysScore = Math.min(metrics.daysClean / 30, 1); // cap at 30 days
  
  // Weighted average
  return (timeScore * 0.5 + cravingsScore * 0.3 + daysScore * 0.2);
}

/**
 * Calculate normalized vocal score (0-1)
 */
function calculateVocalScore(
  current: VocalMetrics, 
  baseline?: VocalMetrics
): number {
  if (!baseline) return 0.5; // neutral if no baseline
  
  // Lower deviation is better
  const jitterScore = Math.max(0, 1 - current.jitterDeviation);
  const shimmerScore = Math.max(0, 1 - current.shimmerDeviation);
  const spectralScore = Math.max(0, 1 - current.spectralCentroidShift);
  
  return (jitterScore + shimmerScore + spectralScore) / 3;
}

/**
 * Calculate normalized hemodynamic score (0-1)
 */
function calculateHemodynamicScore(
  current: HemodynamicMetrics,
  baseline?: HemodynamicMetrics
): number {
  if (!baseline) return 0.5; // neutral if no baseline
  
  // HRV: higher is generally better (less stress)
  const hrvScore = Math.max(0, Math.min(1, (current.hrvDelta + 1) / 2));
  
  // Vasoconstriction: lower is better
  const vasoScore = Math.max(0, 1 - current.vasoconstrictionIndex);
  
  // Oxygen saturation: higher is better
  const o2Score = current.oxygenSaturation;
  
  return (hrvScore * 0.4 + vasoScore * 0.3 + o2Score * 0.3);
}

/**
 * Calculate confidence based on data quality and completeness
 */
function calculateConfidence(input: AeroScoreInput): number {
  let confidence = 0.5; // base confidence
  
  // Boost confidence if we have baseline data
  if (input.baseline) confidence += 0.2;
  
  // Check data freshness (all metrics should be recent)
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  
  // This would need timestamp fields in the actual implementation
  // For now, assume fresh data
  confidence += 0.2;
  
  // Check data completeness
  if (input.behavioral.daysClean >= 0) confidence += 0.05;
  if (input.vocal.jitterDeviation >= 0) confidence += 0.05;
  if (input.hemodynamic.hrvDelta >= -1) confidence += 0.05;
  
  return Math.min(confidence, 1);
}

/**
 * Main Aero Score calculation
 */
export function calculateAeroScore(
  input: AeroScoreInput,
  weights: AeroScoreWeights = DEFAULT_WEIGHTS
): AeroScoreResult {
  // Calculate individual component scores
  const behavioralScore = calculateBehavioralScore(input.behavioral);
  const vocalScore = calculateVocalScore(input.vocal, input.baseline?.vocal);
  const hemodynamicScore = calculateHemodynamicScore(input.hemodynamic, input.baseline?.hemodynamic);
  
  // Apply weights and normalize
  const totalWeight = weights.behavioral + weights.vocal + weights.hemodynamic;
  const weightedSum = 
    (weights.behavioral * behavioralScore) +
    (weights.vocal * vocalScore) +
    (weights.hemodynamic * hemodynamicScore);
  
  const rawScore = (weightedSum / totalWeight) * 100;
  const score = Math.max(0, Math.min(100, rawScore)); // clamp to 0-100
  
  // Calculate confidence
  const confidence = calculateConfidence(input);
  
  // Determine trend (this would need historical data)
  const trend: 'improving' | 'stable' | 'declining' = 'stable'; // placeholder
  
  return {
    score: Math.round(score),
    breakdown: {
      behavioral: Math.round(behavioralScore * 100),
      vocal: Math.round(vocalScore * 100),
      hemodynamic: Math.round(hemodynamicScore * 100),
    },
    confidence,
    trend,
  };
}

/**
 * Get clinical interpretation of score
 */
export function getScoreInterpretation(score: number): {
  level: string;
  color: string;
  description: string;
  recommendation: string;
} {
  if (score >= 80) {
    return {
      level: 'Vascular Elite',
      color: '#00F5FF',
      description: 'Excellent cardiovascular recovery and behavioral consistency',
      recommendation: 'Maintain current routine. Consider mentorship opportunities.',
    };
  } else if (score >= 60) {
    return {
      level: 'Oxygen Optimized',
      color: '#00D4FF',
      description: 'Good recovery with room for improvement',
      recommendation: 'Focus on consistency in daily routines',
    };
  } else if (score >= 40) {
    return {
      level: 'Carbon Neutral',
      color: '#D4AF37',
      description: 'Moderate recovery patterns detected',
      recommendation: 'Increase biometric monitoring frequency',
    };
  } else {
    return {
      level: 'Nicotine Active',
      color: '#FF6B6B',
      description: 'Recent nicotine use detected',
      recommendation: 'Focus on abstinence and support systems',
    };
  }
}
