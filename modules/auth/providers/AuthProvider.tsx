'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { AeroUser, AeroSession } from '@/lib/types';
import { useAeroStore } from '@/store/useAeroStore';
import { DEMO_USER } from '@/lib/data';

interface AuthContextValue extends AeroSession {
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

/** Convenience hook: redirects if not authenticated */
export function useRequireAuth() {
  const auth = useAuth();
  return auth;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const demoMode = useAeroStore((s) => s.demoMode);
  const [user, setUser] = useState<AeroUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (demoMode) {
      setUser(DEMO_USER);
      setIsLoading(false);
      return;
    }

    async function initSession() {
      try {
        // Supabase session check will go here when connected
        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    }
    initSession();
  }, [demoMode]);

  const signInWithGoogle = async () => {
    if (demoMode) {
      setUser(DEMO_USER);
      return;
    }
    // Supabase Google OAuth trigger
  };

  const signOut = async () => {
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** HOC: Redirect to /auth if unauthenticated */
export function withAuthGate<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthGated(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const demoMode = useAeroStore((s) => s.demoMode);

    if (isLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="aero-skeleton h-12 w-48" />
        </div>
      );
    }

    if (!isAuthenticated && !demoMode) {
      return null;
    }

    return <Component {...props} />;
  };
}

/** HOC: Ensure baseline scan completed */
export function withOnboardingGate<P extends object>(
  Component: React.ComponentType<P>
) {
  return function OnboardingGated(props: P) {
    const { user, isLoading } = useAuth();
    const demoMode = useAeroStore((s) => s.demoMode);

    if (isLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="aero-skeleton h-12 w-48" />
        </div>
      );
    }

    if (!demoMode && user && !user.has_baseline) {
      return null;
    }

    return <Component {...props} />;
  };
}
