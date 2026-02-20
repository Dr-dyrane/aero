'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { apiClient } from '@/lib/apiClient';

interface ApiContextValue {
  apiClient: typeof apiClient;
}

const ApiContext = createContext<ApiContextValue | null>(null);

export function useApi() {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error('useApi must be used within ApiProvider');
  return ctx.apiClient;
}

export function ApiProvider({ children }: { children: ReactNode }) {
  return (
    <ApiContext.Provider value={{ apiClient }}>
      {children}
    </ApiContext.Provider>
  );
}
