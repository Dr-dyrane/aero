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

  // Theme
  theme: AeroTheme;
  setTheme: (theme: AeroTheme) => void;

  // Scan Status
  scanStatus: ScanStatus;
  setScanStatus: (status: ScanStatus) => void;

  // Streak
  streak: number;
  setStreak: (n: number) => void;
};

export const useAeroStore = create<AeroState>((set) => ({
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
          }
        : {
            demoMode,
            vault: { locked: 100.0, spendable: 0.0 },
            aeroScore: 0,
            streak: 0,
            scanStatus: 'idle',
          }
    ),

  // Vault
  vault: { locked: DEMO_VAULT.locked_balance, spendable: DEMO_VAULT.spendable_balance },
  setVault: (vault) =>
    set((state) => ({ vault: { ...state.vault, ...vault } })),

  // Aero Score
  aeroScore: DEMO_AERO_SCORE,
  setAeroScore: (aeroScore) => set({ aeroScore }),

  // Theme
  theme: 'eclipse',
  setTheme: (theme) => set({ theme }),

  // Scan Status
  scanStatus: 'success',
  setScanStatus: (scanStatus) => set({ scanStatus }),

  // Streak
  streak: DEMO_STREAK,
  setStreak: (streak) => set({ streak }),
}));
