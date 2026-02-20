'use client';

import { useRouter } from 'next/navigation';

/**
 * AERO Navigator Helpers
 * Rule: No inline router.push in pages; always use navigator helpers.
 */
export function useNavigator() {
  const router = useRouter();

  return {
    goToDashboard: () => router.push('/dashboard'),
    goToVault: () => router.push('/vault'),
    goToScan: () => router.push('/scan'),
    goToAuth: () => router.push('/auth'),
    goToSettings: () => router.push('/settings'),
    goToOnboardingIfNeeded: (hasBaseline: boolean) =>
      hasBaseline ? router.push('/dashboard') : router.push('/scan'),
  };
}
