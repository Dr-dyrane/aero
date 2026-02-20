import { create } from 'zustand';
import {
  DEMO_VAULT,
  DEMO_AERO_SCORE,
  DEMO_STREAK,
} from '@/lib/data';

export type AeroTheme = 'eclipse' | 'cloud' | 'system';
export type ScanStatus = 'idle' | 'scanning' | 'success' | 'failed';

type VaultState = {
  locked: number;
  spendable: number;
};

type AeroState = {
  // Demo Mode
  demoMode: boolean;
  setDemoMode: (v: boolean) => void;

  // Vault
  vault: VaultState;
  setVault: (vault: Partial<VaultState>) => void;

  // Aero Score
  aeroScore: number;
  setAeroScore: (score: number) => void;
  isWakeUpCall: boolean;
  setWakeUpCall: (v: boolean) => void;

  // Theme
  theme: AeroTheme;
  setTheme: (theme: AeroTheme) => void;

  // Scan Status
  scanStatus: ScanStatus;
  setScanStatus: (status: ScanStatus) => void;

  // Streak
  streak: number;
  setStreak: (n: number) => void;

  // Language
  language: 'en' | 'ar' | null;
  setLanguage: (lang: 'en' | 'ar') => void;
};

import { persist } from 'zustand/middleware';

export const useAeroStore = create<AeroState>()(
  persist(
    (set) => ({
      // Demo Mode — ON by default
      demoMode: true,
      setDemoMode: (demoMode) =>
        set(
          demoMode
            ? {
              demoMode,
              vault: { locked: DEMO_VAULT.locked_balance, spendable: DEMO_VAULT.spendable_balance },
              aeroScore: DEMO_AERO_SCORE,
              streak: DEMO_STREAK,
              scanStatus: 'success',
              isWakeUpCall: DEMO_AERO_SCORE <= 20
            }
            : {
              demoMode,
              vault: { locked: 100.0, spendable: 0.0 },
              aeroScore: 0,
              streak: 0,
              scanStatus: 'idle',
              isWakeUpCall: false
            }
        ),

      // Vault
      vault: { locked: DEMO_VAULT.locked_balance, spendable: DEMO_VAULT.spendable_balance },
      setVault: (vault) =>
        set((state) => ({ vault: { ...state.vault, ...vault } })),

      // Aero Score
      aeroScore: DEMO_AERO_SCORE,
      isWakeUpCall: false,
      setAeroScore: (aeroScore) => set({
        aeroScore,
        isWakeUpCall: aeroScore <= 20
      }),
      setWakeUpCall: (v) => set({ isWakeUpCall: v }),

      // Theme
      theme: 'eclipse',
      setTheme: (theme) => set({ theme }),

      // Scan Status
      scanStatus: 'success',
      setScanStatus: (scanStatus) => set({ scanStatus }),

      // Streak
      streak: DEMO_STREAK,
      setStreak: (streak) => set({ streak }),

      // Language
      language: null,
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'aero-storage',
    }
  )
);
