'use client';

import { useTheme, ThemeToggle } from '@/modules/ui';
import { ArrowRight, Globe } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigator } from '@/lib/navigation';
import { useAeroStore } from '@/store/useAeroStore';
import { useState } from 'react';

export default function WelcomeDroplet() {
  const { resolvedTheme } = useTheme();
  const nav = useNavigator();
  const { language, setLanguage } = useAeroStore();
  const isDark = resolvedTheme === 'eclipse';
  const logoSrc = isDark ? "/aero.png" : "/aero_light.png";

  // Local state for transition
  const [isSelecting, setIsSelecting] = useState(!language);

  const handleLanguageSelect = (lang: 'en' | 'ar') => {
    setLanguage(lang);
    setTimeout(() => setIsSelecting(false), 500); // Allow exit animation
  };

  // Content Dictionary
  const content = {
    en: {
      title: "Aero Score",
      subtitle: "Your Health Score.",
      caption: "Your rewards are waiting.",
      cta: "Claim My Rewards"
    },
    ar: {
      title: "أيرو",
      subtitle: "درجتك الصحية الشخصية.",
      caption: "مكافآتك في انتظارك.",
      cta: "استلم مكافآتك"
    }
  };

  const text = language ? content[language] : content.en;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden bg-background text-foreground transition-colors duration-700 pb-6 px-6">

      {/* AMBIENT VOID: Deterministic Background Glow */}
      <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-aero-blue/[0.03] blur-[160px] dark:bg-[#00F5FF]/[0.03] transition-colors duration-700 pointer-events-none" />

      {/* THEME TOGGLE: Top Right Absolute (Specific to Welcome) */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <AnimatePresence mode="wait">
        {isSelecting ? (
          <motion.div
            key="language-select"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col items-center justify-center w-full max-w-sm gap-8 z-20"
          >
            <div className="relative h-20 w-20 mb-4">
              <Image src={logoSrc} alt="AERO" fill className="object-contain opacity-80" />
            </div>

            <div className="flex flex-col gap-4 w-full">
              <button
                onClick={() => handleLanguageSelect('en')}
                className="flex items-center justify-between p-6 rounded-2xl bg-surface-translucent border border-white/5 hover:bg-white/10 transition-all group backdrop-blur-xl"
              >
                <div className="flex flex-col items-start">
                  <span className="text-xl font-light tracking-wide">English</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">Default</span>
                </div>
                <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
              </button>

              <button
                onClick={() => handleLanguageSelect('ar')}
                className="flex items-center justify-between p-6 rounded-2xl bg-surface-translucent border border-white/5 hover:bg-white/10 transition-all group backdrop-blur-xl"
                dir="rtl"
              >
                <div className="flex flex-col items-start">
                  <span className="text-xl font-light tracking-wide font-sans">العربية</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">الشرق الأوسط</span>
                </div>
                {/* Arrow direction handled by RTL context ideally, but manually flipping here for visual consistency if needed, or let RTL handle it */}
                <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 rotate-180" />
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* HERO: The Artifact + Typography (Center) */}
            <div className="flex-1 flex flex-col items-center justify-evenly w-full max-w-md z-10 py-10">
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
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative h-56 w-56 md:h-72 md:w-72"
                >
                  <Image
                    src={logoSrc}
                    alt="AERO Logo"
                    fill
                    className="object-contain"
                    style={{ filter: 'drop-shadow(0 0 40px color-mix(in srgb, var(--primary) 20%, transparent))' }}
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
                  {text.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1.2 }}
                  className="text-sm font-light leading-relaxed text-muted-foreground/60 max-w-xs tracking-wide"
                >
                  {text.subtitle} <br />
                  <span className="font-medium text-foreground/50 italic">{text.caption}</span>
                </motion.p>
              </div>
            </div>

            {/* ACTION: Bottom-Anchored */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-sm z-20 pb-8 md:pb-12"
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

                <span className="relative z-10 text-base">{text.cta}</span>

                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-foreground/[0.03] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all group-hover:bg-foreground/[0.07]">
                  <ArrowRight className="h-5 w-5 text-primary/70 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </div>
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
