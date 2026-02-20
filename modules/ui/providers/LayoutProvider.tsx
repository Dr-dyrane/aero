'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

interface LayoutContextValue {
  isMobile: boolean;
  isDesktop: boolean;
  isSkeletonLoading: boolean;
  setSkeletonLoading: (v: boolean) => void;
  safeAreaInsets: { top: number; bottom: number };
}

const LayoutContext = createContext<LayoutContextValue | null>(null);

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error('useLayout must be used within LayoutProvider');
  return ctx;
}

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(true);
  const [isSkeletonLoading, setSkeletonLoading] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(!e.matches);
    };
    handler(mq);
    mq.addEventListener('change', handler);

    // Initial skeleton clears after mount
    setSkeletonLoading(false);

    return () => mq.removeEventListener('change', handler);
  }, []);

  const safeAreaInsets = {
    top: typeof window !== 'undefined'
      ? parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            'env(safe-area-inset-top)'
          ) || '0'
        )
      : 0,
    bottom: typeof window !== 'undefined'
      ? parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            'env(safe-area-inset-bottom)'
          ) || '0'
        )
      : 0,
  };

  return (
    <LayoutContext.Provider
      value={{
        isMobile,
        isDesktop: !isMobile,
        isSkeletonLoading,
        setSkeletonLoading,
        safeAreaInsets,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}
