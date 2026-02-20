import { cn } from '@/lib/utils';

interface AeroSkeletonProps {
  className?: string;
  variant?: 'pill' | 'circle' | 'card';
}

/**
 * AeroSkeleton
 * Consistent skeleton loader per AERO spec:
 * bg-white/10 (eclipse) / bg-black/6 (cloud), backdrop-blur-sm, animate-pulse, rounded-full.
 */
export function AeroSkeleton({ className, variant = 'pill' }: AeroSkeletonProps) {
  return (
    <div
      className={cn(
        'aero-skeleton animate-pulse backdrop-blur-sm',
        variant === 'pill' && 'rounded-full',
        variant === 'circle' && 'aspect-square rounded-full',
        variant === 'card' && 'rounded-3xl',
        className
      )}
    />
  );
}
