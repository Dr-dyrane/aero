'use client';

import { motion } from 'framer-motion';
import { useAeroScoreCalculator } from '../hooks/useAeroScoreCalculator';
import { cn } from '@/lib/utils';

interface AeroScoreDisplayProps {
  size?: number;
  showBreakdown?: boolean;
  className?: string;
}

export function AeroScoreDisplay({
  size = 200,
  showBreakdown = false,
  className
}: AeroScoreDisplayProps) {
  const { currentScore, interpretation, isCalculating, lastCalculation } = useAeroScoreCalculator();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'var(--primary)'; // Peak Health
    if (score >= 60) return '#10B981'; // Optimized - emerald
    if (score >= 40) return '#EAB308'; // Balanced - yellow
    return '#EF4444'; // Recovery Needed - red
  };

  const getGlowIntensity = (score: number) => {
    return Math.max(0.3, score / 100);
  };

  const scoreColor = getScoreColor(currentScore);
  const glowIntensity = getGlowIntensity(currentScore);

  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      {/* Main Score Sphere */}
      <div
        className="relative"
        style={{
          width: size,
          height: size,
        }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${scoreColor}40 0%, transparent 70%)`,
            filter: `blur(${size * 0.15}px)`,
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [glowIntensity * 0.6, glowIntensity * 0.8, glowIntensity * 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Main sphere with liquid effect */}
        <motion.div
          className="absolute inset-2 rounded-full backdrop-blur-xl"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, ${scoreColor}60, ${scoreColor}40),
              radial-gradient(circle at 70% 70%, ${scoreColor}20, transparent),
              linear-gradient(135deg, ${scoreColor}30, ${scoreColor}10)
            `,
            border: `1px solid ${scoreColor}30`,
            boxShadow: `
              inset 0 0 ${size * 0.1}px ${scoreColor}20,
              0 0 ${size * 0.2}px ${scoreColor}40
            `,
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Inner liquid core */}
        <motion.div
          className="absolute inset-4 rounded-full"
          style={{
            background: `
              radial-gradient(circle at 40% 40%, ${scoreColor}80, ${scoreColor}60),
              conic-gradient(from 0deg, ${scoreColor}40, ${scoreColor}20, ${scoreColor}40)
            `,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {isCalculating ? (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-2xl font-bold"
                style={{ color: scoreColor }}
              >
                ...
              </motion.div>
            ) : (
              <>
                <motion.div
                  key={currentScore}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="text-3xl font-bold tabular-nums"
                  style={{ color: scoreColor }}
                >
                  {currentScore}
                </motion.div>
                <div
                  className="text-xs font-medium opacity-80"
                  style={{ color: scoreColor }}
                >
                  $AS$
                </div>
              </>
            )}
          </div>
        </div>

        {/* Breathing effect overlay */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, transparent 60%, ${scoreColor}10)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </div>

      {/* Score interpretation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 text-center"
      >
        <div
          className="text-sm font-semibold"
          style={{ color: scoreColor }}
        >
          {interpretation.level}
        </div>
        <div className="text-xs text-muted-foreground mt-1 max-w-xs">
          {interpretation.description}
        </div>
      </motion.div>

      {/* Optional breakdown */}
      {showBreakdown && lastCalculation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-6 w-full max-w-xs"
        >
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-medium text-foreground">Behavioral</div>
              <div className="text-muted-foreground">{lastCalculation.breakdown.behavioral}%</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Voice</div>
              <div className="text-muted-foreground">{lastCalculation.breakdown.vocal}%</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Stability</div>
              <div className="text-muted-foreground">{lastCalculation.breakdown.hemodynamic}%</div>
            </div>
          </div>

          <div className="mt-3 text-xs text-center text-muted-foreground">
            Confidence: {Math.round(lastCalculation.confidence * 100)}%
          </div>
        </motion.div>
      )}
    </div>
  );
}
