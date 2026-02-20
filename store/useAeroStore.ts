import { create } from 'zustand';
import {
  DEMO_VAULT,
  DEMO_AERO_SCORE,
  DEMO_STREAK,
  DEMO_VAULT_TRANSACTIONS,
  DEMO_SCAN_HISTORY,
} from '@/lib/data';

export type AeroTheme = 'eclipse' | 'cloud' | 'system';
export type ScanStatus = 'idle' | 'scanning' | 'success' | 'failed';

type VaultState = {
  locked: number;
  spendable: number;
};

import { persist } from 'zustand/middleware';
import { Transaction, ScanHistoryItem } from '@/lib/types';

type AeroState = {
  // Demo Mode
  demoMode: boolean;
  setDemoMode: (v: boolean) => void;

  // Vault
  vault: VaultState;
  setVault: (vault: Partial<VaultState>) => void;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void;

  // Aero Score
  aeroScore: number;
  setAeroScore: (score: number) => void;
  isWakeUpCall: boolean;
  setWakeUpCall: (v: boolean) => void;
  scans: ScanHistoryItem[];
  addScan: (scan: Omit<ScanHistoryItem, 'id' | 'date'>) => void;

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
              isWakeUpCall: DEMO_AERO_SCORE <= 20,
              transactions: [...DEMO_VAULT_TRANSACTIONS],
              scans: [...DEMO_SCAN_HISTORY.map((s, i) => ({ ...s, id: `scan-${i}` }))]
            }
            : {
              demoMode,
              vault: { locked: 100.0, spendable: 0.0 },
              aeroScore: 0,
              streak: 0,
              scanStatus: 'idle',
              isWakeUpCall: false,
              transactions: [],
              scans: []
            }
        ),

      // Vault
      vault: { locked: DEMO_VAULT.locked_balance, spendable: DEMO_VAULT.spendable_balance },
      setVault: (vault) =>
        set((state) => ({ vault: { ...state.vault, ...vault } })),
      transactions: [...DEMO_VAULT_TRANSACTIONS],
      addTransaction: (tx) => set((state) => ({
        transactions: [
          {
            ...tx,
            id: `tx-${Date.now()}`,
            date: new Date().toISOString().split('T')[0]
          },
          ...state.transactions
        ]
      })),

      // Aero Score
      aeroScore: DEMO_AERO_SCORE,
      isWakeUpCall: false,
      setAeroScore: (aeroScore) => set({
        aeroScore,
        isWakeUpCall: aeroScore <= 20
      }),
      setWakeUpCall: (v) => set({ isWakeUpCall: v }),
      scans: [...DEMO_SCAN_HISTORY.map((s, i) => ({ ...s, id: `scan-${i}` }))],
      addScan: (scan) => set((state) => ({
        scans: [
          {
            ...scan,
            id: `scan-${Date.now()}`,
            date: new Date().toISOString().split('T')[0]
          },
          ...state.scans
        ]
      })),

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
