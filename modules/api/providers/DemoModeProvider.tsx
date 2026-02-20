'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useAeroStore } from '@/store/useAeroStore';

interface DemoModeContextValue {
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  toggleDemoMode: () => void;
}

const DemoModeContext = createContext<DemoModeContextValue | null>(null);

export function useDemoMode() {
  const ctx = useContext(DemoModeContext);
  if (!ctx) throw new Error('useDemoMode must be used within DemoModeProvider');
  return ctx;
}

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const demoMode = useAeroStore((s: any) => s.demoMode);
  const setDemoModeStore = useAeroStore((s: any) => s.setDemoMode);

  // Initialize demo mode from cookie on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cookieDemoMode = document.cookie
        .split('; ')
        .find(row => row.startsWith('aero-demo-mode='))
        ?.split('=')[1];
      
      if (cookieDemoMode === 'true' && !demoMode) {
        setDemoModeStore(true);
      }
    }
  }, [demoMode, setDemoModeStore]);

  const setDemoMode = (enabled: boolean) => {
    // Update store
    setDemoModeStore(enabled);
    
    // Update cookie
    if (typeof window !== 'undefined') {
      document.cookie = `aero-demo-mode=${enabled}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
    }
  };

  const toggleDemoMode = () => {
    setDemoMode(!demoMode);
  };

  return (
    <DemoModeContext.Provider
      value={{
        isDemoMode: demoMode,
        setDemoMode,
        toggleDemoMode,
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
}
