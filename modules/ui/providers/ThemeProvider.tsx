'use client';

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useAeroStore, type AeroTheme } from '@/store/useAeroStore';

interface ThemeContextValue {
  theme: AeroTheme;
  resolvedTheme: 'eclipse' | 'cloud';
  setTheme: (theme: AeroTheme) => void;
  toggleTheme: () => void;
  isSystemTheme: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

function getSystemTheme(): 'eclipse' | 'cloud' {
  if (typeof window === 'undefined') return 'eclipse';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'eclipse'
    : 'cloud';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useAeroStore((s: any) => s.theme);
  const setThemeStore = useAeroStore((s: any) => s.setTheme);

  const resolvedTheme: 'eclipse' | 'cloud' =
    theme === 'system' ? getSystemTheme() : theme;

  const isSystemTheme = theme === 'system';

  const applyTheme = useCallback((resolved: 'eclipse' | 'cloud') => {
    const root = document.documentElement;

    // Smooth transition for theme changes
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease';

    // Set data attribute for CSS targeting
    root.setAttribute('data-theme', resolved);

    // Update class for Tailwind dark mode
    if (resolved === 'eclipse') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Add meta theme-color for mobile browsers
    const themeColor = resolved === 'eclipse' ? '#0a0a0a' : '#fafafa';
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', themeColor);

    // Remove transition after animation completes
    setTimeout(() => {
      root.style.transition = '';
    }, 300);
  }, []);

  useEffect(() => {
    console.log('[ThemeProvider] Applying theme:', resolvedTheme);
    applyTheme(resolvedTheme);
  }, [resolvedTheme, applyTheme]);

  // Listen for system theme changes when in 'system' mode with debouncing
  useEffect(() => {
    if (!isSystemTheme) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    let timeoutId: number;

    const handler = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        applyTheme(getSystemTheme());
      }, 100); // Debounce rapid changes
    };

    mq.addEventListener('change', handler);
    return () => {
      mq.removeEventListener('change', handler);
      clearTimeout(timeoutId);
    };
  }, [isSystemTheme, applyTheme]);

  const toggleTheme = useCallback(() => {
    const next = resolvedTheme === 'eclipse' ? 'cloud' : 'eclipse';
    setThemeStore(next);
  }, [resolvedTheme, setThemeStore]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme: setThemeStore,
        toggleTheme,
        isSystemTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
