'use client';

import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireAuth?: boolean;
  requireBaseline?: boolean;
}

export function AuthGuard({ 
  children, 
  fallback = null,
  requireAuth = true,
  requireBaseline = false 
}: AuthGuardProps) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <>{fallback || <div>Loading...</div>}</>;
  }

  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }

  if (requireBaseline && user?.has_baseline === false) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
