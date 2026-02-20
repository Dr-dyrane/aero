'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AeroOrbProps {
  score: number; // 0-100
  size?: number; // px
  className?: string;
}

/**
 * AeroOrb
 * 3D liquid orb with breathing animation.
 * Displays the Aero Score at center.
 * Uses exact AERO palette: #00F5FF glow.
 */
export function AeroOrb({ score, size = 200, className }: AeroOrbProps) {
  const glowIntensity = score / 100;
  const glowColor = `rgba(0, 245, 255, ${0.15 + glowIntensity * 0.45})`;

  return (
    <div
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          filter: `blur(${20 + glowIntensity * 20}px)`,
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Orb body */}
      <motion.div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: size * 0.75,
          height: size * 0.75,
          background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 40%, transparent 70%)`,
          backdropFilter: 'blur(40px)',
          boxShadow: `
            inset 0 2px 4px rgba(255,255,255,0.1),
            0 0 ${30 + glowIntensity * 40}px ${glowColor}
          `,
        }}
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Inner glow — #00F5FF */}
        <div
          className="absolute inset-4 rounded-full"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(0, 245, 255, ${0.08 + glowIntensity * 0.25}) 0%, transparent 70%)`,
          }}
        />

        {/* Score display */}
        <span
          className="relative z-10 font-numbers"
          style={{
            fontSize: size * 0.22,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
          }}
        >
          {score}
        </span>
      </motion.div>
    </div>
  );
}
