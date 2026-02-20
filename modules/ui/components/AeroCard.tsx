'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface AeroCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

/**
 * AeroCard
 * Translucent, borderless surface with backdrop blur.
 * No borders — only inner shadows for depth.
 */
export const AeroCard = forwardRef<HTMLDivElement, AeroCardProps>(
  ({ className, glow = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'aero-surface rounded-3xl p-4',
          glow && 'aero-glow',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AeroCard.displayName = 'AeroCard';
