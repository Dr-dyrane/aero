'use client';

import { useTheme, ThemeToggle } from '@/modules/ui';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useNavigator } from '@/lib/navigation';

export default function WelcomeDroplet() {
  const { resolvedTheme } = useTheme();
  const nav = useNavigator();
  const isDark = resolvedTheme === 'eclipse';
  const logoSrc = isDark ? "/logo.svg" : "/aero_light.png";

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-between overflow-hidden bg-background text-foreground transition-colors duration-700 py-12 px-6">

      {/* AMBIENT VOID: Deterministic Background Glow */}
      <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-aero-blue/[0.03] blur-[160px] dark:bg-[#00F5FF]/[0.03] transition-colors duration-700 pointer-events-none" />

      {/* HERO: The Artifact + Typography (Center) */}
      <div className="flex-1 flex flex-col items-center justify-start pt-20 gap-8 w-full max-w-md z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, filter: "blur(20px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* LOCALIZED AURA: Bio-digital atmosphere */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[120%] w-[120%] bg-aero-blue/[0.08] blur-[80px] rounded-full pointer-events-none animate-pulse" />

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative h-72 w-72"
          >
            <Image
              src={logoSrc}
              alt="AERO Logo"
              fill
              className="object-contain drop-shadow-[0_0_40px_rgba(0,245,255,0.2)]"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Typography: Tightly coupled to the Artifact */}
        <div className="flex flex-col items-center text-center gap-4">
          <motion.h1
            initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl font-light tracking-[-0.07em] text-transparent bg-clip-text bg-gradient-to-b from-foreground via-foreground to-foreground/40 font-[family-name:var(--font-space-grotesk)]"
          >
            Aero Score
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.2 }}
            className="text-sm font-light leading-relaxed text-muted-foreground/60 max-w-xs tracking-wide"
          >
            The first Medical Credit Score. <br />
            <span className="font-medium text-foreground/50 italic">Your endowment is locked in the vault.</span>
          </motion.p>
        </div>
      </div>

      {/* ACTION: Bottom-Anchored */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm z-20 pb-8"
      >
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => nav.goToDashboard()}
          className="group relative flex w-full items-center justify-between pl-10 pr-2 overflow-hidden rounded-full bg-surface-translucent py-2 font-medium tracking-wider text-foreground backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
        >
          {/* Liquid Sheen: Hidden gradient that appears on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.2)_0%,transparent_60%)]" />

          {/* Shimmer Effect: Subtle auto-sweep */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          <span className="relative z-10 text-base">Claim My Endowment</span>

          <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-foreground/[0.03] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all group-hover:bg-foreground/[0.07]">
            <ArrowRight className="h-5 w-5 text-primary/70 transition-transform group-hover:translate-x-1" />
          </div>
        </motion.button>
      </motion.div>

    </div>
  );
}
