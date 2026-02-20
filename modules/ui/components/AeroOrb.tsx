'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface AeroOrbProps {
  score: number; // 0-100
  size?: number; // px
  className?: string;
  imgSrc?: string;
  pulsing?: boolean;
}

/**
 * AeroOrb
 * 3D liquid orb with breathing animation.
 * Displays the Aero Score at center.
 * Uses exact AERO palette: #00F5FF glow.
 */
export function AeroOrb({ score, size = 288, className, imgSrc, pulsing = false }: AeroOrbProps) {
  const glowIntensity = score / 100;
  const glowAlpha = 0.12 + glowIntensity * 0.35;
  const glowColor = `rgba(0, 245, 255, ${glowAlpha})`;

  return (
    <div
      className={cn('relative flex items-center justify-center select-none', className)}
      style={{ width: size, height: size }}
    >
      {/* AMBIENT AURA: Solid performance via single-layer opacity breathe */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          filter: `blur(40px)`,
        }}
        animate={{
          opacity: pulsing ? [0.4, 0.9, 0.4] : [0.4, 0.7, 0.4],
          scale: pulsing ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: pulsing ? 0.8 : 4,
          repeat: Infinity,
          ease: [0.4, 0, 0.2, 1], // Standard fast-out-linear-in
        }}
      />

      {/* THE ARTIFACT: Stabilized motion path */}
      <motion.div
        className="relative flex items-center justify-center w-full h-full"
        animate={{
          y: pulsing ? [0, -2, 0] : [0, -6, 0],
        }}
        transition={{
          duration: pulsing ? 0.4 : 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {imgSrc ? (
          <div className="relative flex items-center justify-center w-full h-full">
            <img
              src={imgSrc}
              alt="Aero Score Artifact"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: `drop-shadow(0 0 20px rgba(0, 245, 255, ${glowAlpha}))`,
              }}
              className="z-10"
              draggable={false}
            />

            {/* Score: Blended organically into the artifact artifact (No Shadow) */}
            <span
              className="absolute z-20 font-numbers flex items-center justify-center transition-opacity duration-700"
              style={{
                fontSize: size * 0.23,
                fontWeight: 500,
                letterSpacing: '-0.06em',
                color: '#FFFFFF',
                opacity: 0.85,
                mixBlendMode: 'plus-lighter',
              }}
            >
              {score}
            </span>
          </div>
        ) : (
          <div
            className="flex items-center justify-center rounded-full glass-surface"
            style={{
              width: size * 0.7,
              height: size * 0.7,
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              boxShadow: `inset 0 1px 1px rgba(255,255,255,0.1), 0 0 30px ${glowColor}`,
            }}
          >
            <span className="font-numbers text-3xl font-medium text-white">{score}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
