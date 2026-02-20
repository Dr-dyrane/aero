'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/modules/ui/providers/ThemeProvider';

export default function HomePage() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // Premium splash duration
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 2800);
    return () => clearTimeout(timer);
  }, [router]);

  const isDark = resolvedTheme === 'eclipse';
  // Use aero_light.png if light mode, otherwise as.png
  const logoSrc = isDark ? "/as.png" : "/aero_light.png";

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center bg-background transition-colors duration-700 overflow-hidden">
      {/* AMBIENT VOID */}
      <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-aero-blue/[0.04] blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center z-10"
      >
        <motion.div
          animate={{
            scale: [1, 1.04, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative h-48 w-48 mx-auto"
        >
          {/* Using standard img to bypass Turbopack HMR bug with next/image in this specific loader */}
          <img
            src={logoSrc}
            alt="AERO Artifact"
            className="object-contain drop-shadow-[0_0_40px_rgba(0,245,255,0.15)] w-full h-full"
          />
        </motion.div>

        {/* Progress Indicator: Clinical Minimalist Line */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 140, opacity: 1 }}
            transition={{ delay: 0.8, duration: 2, ease: "easeInOut" }}
            className="h-[1px] bg-gradient-to-r from-transparent via-foreground/20 to-transparent rounded-full"
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-[10px] tracking-[0.2em] font-light text-foreground uppercase"
          >
            Opening Aero...
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
}
