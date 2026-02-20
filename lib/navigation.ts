'use client';

import { useRouter } from 'next/navigation';
import { useLayout } from '@/modules/ui/providers/LayoutProvider';
import { useFeedback } from '@/modules/ui/hooks/useFeedback';

/**
 * AERO Navigator Helpers
 * Rule: No inline router.push in pages; always use navigator helpers.
 */
export function useNavigator() {
  const router = useRouter();
  const { setSkeletonLoading } = useLayout();
  const { playTap } = useFeedback();

  const navigate = (path: string) => {
    playTap();
    setSkeletonLoading(true);
    router.push(path);
  };

  return {
    goToWelcome: () => navigate('/welcome'),
    goToDashboard: () => navigate('/dashboard'),
    goToVault: () => navigate('/vault'),
    goToScan: () => navigate('/scan'),
    goToAuth: () => navigate('/auth'),
    goToSettings: () => navigate('/settings'),
    goToRoot: () => navigate('/'),
    goToHowItWorks: () => navigate('/how-it-works'),
    goToDecodeScore: () => navigate('/how-it-works'),
    goBack: () => {
      playTap();
      router.back();
    },
    replace: (path: string) => {
      playTap();
      setSkeletonLoading(true);
      router.replace(path);
    },
    goToOnboardingIfNeeded: (hasBaseline: boolean) =>
      hasBaseline ? navigate('/dashboard') : navigate('/scan'),
  };
}
