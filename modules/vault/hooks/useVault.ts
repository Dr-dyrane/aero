'use client';

import { useCallback } from 'react';
import { useAeroStore } from '@/store/useAeroStore';

/**
 * AERO Vault Hook
 * Bio-Vault state management.
 * Endowment: $100 locked on Day 1.
 * Unlock rule: $5 per verified clean day (configurable).
 */
export function useVault() {
  const vault = useAeroStore((s) => s.vault);
  const setVault = useAeroStore((s) => s.setVault);

  const unlockDailyReward = useCallback(
    (amount = 5.0) => {
      if (vault.locked >= amount) {
        setVault({
          locked: vault.locked - amount,
          spendable: vault.spendable + amount,
        });
      }
    },
    [vault, setVault]
  );

  const resetVault = useCallback(() => {
    setVault({ locked: 100.0, spendable: 0.0 });
  }, [setVault]);

  return {
    lockedBalance: vault.locked,
    spendableBalance: vault.spendable,
    totalBalance: vault.locked + vault.spendable,
    unlockDailyReward,
    resetVault,
  };
}
