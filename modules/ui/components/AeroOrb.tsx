'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTheme } from '@/modules/ui';
import { useAeroStore } from '@/store/useAeroStore';

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
  const { resolvedTheme } = useTheme();
  const isWakeUpCall = useAeroStore((s) => s.isWakeUpCall); // Added useAeroStore hook
  const isDark = resolvedTheme === 'eclipse' || isWakeUpCall; // Modified isDark to include isWakeUpCall

  // Default theme-sensitive logo if no imgSrc provided
  const logoSrc = imgSrc || (isDark ? "/as.png" : "/as_light.png");

  const glowIntensity = score / 100;
  const glowAlpha = 0.12 + glowIntensity * 0.35;

  // The Wake-Up Call Shift: Cyan transforms into a pulsing Warning Red
  const glowAlphaHex = Math.round(glowAlpha * 255).toString(16).padStart(2, '0');
  const glowColor = isWakeUpCall ? `var(--destructive)` : `var(--primary)`;

  // Determine animation parameters based on pulsing prop and wake-up call state
  const ambientOpacity = isWakeUpCall ? [0.4, 0.9, 0.4] : (pulsing ? [0.3, 0.8, 0.3] : [0.3, 0.6, 0.3]);
  const ambientScale = isWakeUpCall ? [1, 1.2, 1] : (pulsing ? [1, 1.15, 1] : 1);
  const ambientDuration = isWakeUpCall ? 1.8 : (pulsing ? 3.6 : 10);

  const artifactY = isWakeUpCall ? [0, -6, 0] : (pulsing ? [0, -4, 0] : [0, -8, 0]);
  const artifactDuration = isWakeUpCall ? 2.4 : (pulsing ? 4.8 : 12);

  return (
    <div
      className={cn('relative flex items-center justify-center select-none', className)}
      style={{ width: size, height: size }}
    >
      {/* AMBIENT AURA: Solid performance via single-layer opacity breathe */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, 
            color-mix(in srgb, ${glowColor} ${glowAlpha * 120}%, transparent) 0%, 
            color-mix(in srgb, ${glowColor} ${glowAlpha * 60}%, transparent) 40%, 
            transparent 75%
          )`,
          filter: `blur(45px)`,
        }}
        animate={{
          opacity: ambientOpacity,
          scale: ambientScale,
        }}
        transition={{
          duration: ambientDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* THE ARTIFACT: Stabilized motion path */}
      <motion.div
        className="relative flex items-center justify-center w-full h-full"
        animate={{
          y: artifactY,
        }}
        transition={{
          duration: artifactDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {logoSrc ? (
          <div className="relative flex items-center justify-center w-full h-full">
            <img
              src={logoSrc}
              alt="Aero Score Artifact"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: `drop-shadow(0 0 30px color-mix(in srgb, ${glowColor} ${glowAlpha * 150}%, transparent))`,
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
                color: isDark ? '#FFFFFF' : '#000000',
                opacity: isDark ? 0.85 : 0.9,
                mixBlendMode: isDark ? 'plus-lighter' : 'normal',
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
            <span className={cn("font-numbers text-3xl font-medium", isDark ? "text-white" : "text-black")}>{score}</span>
          </div>
        )}
        {/* GLOSS LAYER: Glass morphism depth */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent opacity-40 mix-blend-overlay pointer-events-none" />
      </motion.div>
    </div>
  );
}
