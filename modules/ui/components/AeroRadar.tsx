'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/modules/ui';
import Image from 'next/image';

interface Tier {
    range: string;
    level: string;
    desc: string;
    color: string;
}

interface AeroRadarProps {
    tiers: Tier[];
    onSelect?: (index: number | null) => void;
    activeIndex?: number | null;
}

/**
 * AeroRadar Component
 * High-End Phoenix Aesthetic: Flat tails leading into rounded, overlapping heads.
 * Dynamic center text reacts to diagnostic focus.
 */
export function AeroRadar({ tiers, onSelect, activeIndex }: AeroRadarProps) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'eclipse';
    const radius = 105;
    const strokeWidth = 32;
    const center = 150;
    const circumference = 2 * Math.PI * radius;

    // Each segment covers exactly 72 degrees (for 5 segments)
    const segmentAngle = 360 / tiers.length;
    const segmentLength = circumference / tiers.length;

    return (
        <div className="relative flex items-center justify-center w-[300px] h-[300px] select-none">
            {/* AMBIENT RADAR ATMOSPHERE */}
            <div className="absolute inset-0 rounded-full bg-primary/2 blur-[80px] animate-pulse pointer-events-none" />

            <svg
                viewBox="0 0 300 300"
                className="w-full h-full -rotate-90 relative z-10 overflow-visible cursor-default"
                onClick={(e) => {
                    if (e.target === e.currentTarget) onSelect?.(null);
                }}
            >
                {/* Background Shadow Ring (Diagnostic Depth) */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)'}
                    strokeWidth={strokeWidth + 12}
                    className="cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect?.(null);
                    }}
                />

                {/* 
                  PHASE 1: THE ARCS (The Body)
                  Render these first so they sit below the heads.
                */}
                {tiers.map((tier, i) => {
                    const rotation = i * segmentAngle;
                    const isSelected = activeIndex === i;

                    return (
                        <motion.circle
                            key={`arc-${i}`}
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="none"
                            stroke={tier.color}
                            strokeWidth={isSelected ? strokeWidth + 6 : strokeWidth}
                            strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                            strokeLinecap="butt" // Flat Tail
                            initial={{ strokeDashoffset: segmentLength }}
                            animate={{
                                strokeDashoffset: 0,
                                rotate: rotation,
                                scale: isSelected ? 1.05 : 1,
                                opacity: activeIndex === null ? 1 : (isSelected ? 1 : 0.15),
                            }}
                            transition={{
                                duration: 1.5,
                                delay: i * 0.1,
                                ease: [0.22, 1, 0.36, 1],
                                opacity: { duration: 0.4 }
                            }}
                            className="cursor-pointer transition-all duration-300"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect?.(i);
                            }}
                            style={{
                                transformOrigin: "center",
                                filter: isSelected ? `drop-shadow(0 0 25px ${tier.color}aa)` : (activeIndex !== null ? 'blur(4px)' : 'none'),
                            }}
                        />
                    );
                })}

                {/* 
                  PHASE 2: THE HEADS (Rounded Overlaps)
                  Rendered after Arcs to ensure the "Head" of Section i sits ON TOP of the "Tail" of Section i+1.
                */}
                {tiers.map((tier, i) => {
                    const isSelected = activeIndex === i;
                    const headRotation = (i + 1) * segmentAngle; // Lead edge position

                    return (
                        <motion.circle
                            key={`head-${i}`}
                            cx={center + radius}
                            cy={center}
                            r={isSelected ? (strokeWidth + 6) / 2 : strokeWidth / 2}
                            fill={tier.color}
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: activeIndex === null ? 1 : (isSelected ? 1 : 0.15),
                                rotate: headRotation,
                                scale: isSelected ? 1.05 : 1,
                            }}
                            transition={{
                                duration: 1.5,
                                delay: i * 0.1 + 0.5,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="pointer-events-none"
                            style={{
                                transformOrigin: "center",
                                filter: isSelected ? `drop-shadow(0 0 25px ${tier.color}aa)` : (activeIndex !== null ? 'blur(4px)' : 'none'),
                            }}
                        />
                    );
                })}

                {/* Analytical Tick Markers */}
                {[0, 72, 144, 216, 288].map((angle) => (
                    <line
                        key={angle}
                        x1={center + (radius - 12)}
                        y1={center}
                        x2={center + (radius - 8)}
                        y2={center}
                        stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                        strokeWidth="1"
                        transform={`rotate(${angle} ${center} ${center})`}
                    />
                ))}
            </svg>

            {/* Center Artifact Integration */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: isDark ? 0.35 : 0.15, scale: 0.95 }}
                    className="relative w-64 h-64 mix-blend-screen"
                >
                    <Image
                        src={isDark ? "/as.png" : "/as_light.png"}
                        alt="AERO Artifact"
                        fill
                        className="object-contain saturate-[1.2] grayscale-[0.2]"
                    />
                </motion.div>

                {/* Dynamic Protocol Branding */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex ?? 'radar'}
                            initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                            transition={{ duration: 0.4 }}
                            className="space-y-0"
                        >
                            <span className="text-[10px] tracking-[0.45em] font-bold text-primary uppercase whitespace-nowrap">
                                {typeof activeIndex === 'number' ? tiers[activeIndex].level : "RADAR"}
                            </span>
                            <div className="h-[1px] w-8 bg-primary/20 mx-auto mt-1 mb-2" />
                            <p className="text-[11px] font-serif text-foreground/40 italic leading-none lowercase tracking-widest">
                                {typeof activeIndex === 'number' ? "clinical status" : "protocol"}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
