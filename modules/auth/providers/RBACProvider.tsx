'use client';

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { useAuth } from './AuthProvider';
import type { UserRole } from '@/lib/types';
import {
  canViewVault,
  canManageMerits,
  canAccessAdminPanel,
  canAccess,
} from '@/lib/rbac';

interface RBACContextValue {
  role: UserRole | null;
  canViewVault: boolean;
  canManageMerits: boolean;
  canAccessAdminPanel: boolean;
  canAccess: (feature: string) => boolean;
}

const RBACContext = createContext<RBACContextValue | null>(null);

export function useRBAC() {
  const ctx = useContext(RBACContext);
  if (!ctx) throw new Error('useRBAC must be used within RBACProvider');
  return ctx;
}

export function RBACProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const value = useMemo<RBACContextValue>(
    () => ({
      role: user?.role ?? null,
      canViewVault: canViewVault(user),
      canManageMerits: canManageMerits(user),
      canAccessAdminPanel: canAccessAdminPanel(user),
      canAccess: (feature: string) => canAccess(user, feature),
    }),
    [user]
  );

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
}
