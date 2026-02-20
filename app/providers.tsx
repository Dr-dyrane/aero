'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from '@/modules/ui/providers/ThemeProvider';
import { AuthProvider } from '@/modules/auth/providers/AuthProvider';
import { RBACProvider } from '@/modules/auth/providers/RBACProvider';
import { LayoutProvider } from '@/modules/ui/providers/LayoutProvider';
import { BioEngineProvider } from '@/modules/bio-engine/providers/BioEngineProvider';
import { ApiProvider } from '@/modules/api/providers/ApiProvider';
import { DemoModeProvider } from '@/modules/api/providers/DemoModeProvider';
import { PWAUpdater } from '@/modules/ui';

/**
 * AERO AppProviders
 * Wraps application in the correct provider order:
 * Theme > DemoMode > Auth > RBAC > Layout > BioEngine > API
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <DemoModeProvider>
        <AuthProvider>
          <RBACProvider>
            <LayoutProvider>
              <BioEngineProvider>
                <ApiProvider>
                  <PWAUpdater />
                  {children}
                </ApiProvider>
              </BioEngineProvider>
            </LayoutProvider>
          </RBACProvider>
        </AuthProvider>
      </DemoModeProvider>
    </ThemeProvider>
  );
}
