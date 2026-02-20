'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface AeroPillProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'accent' | 'muted';
}

/**
 * AeroPill
 * Rounded-full pill element for tags, badges, status indicators.
 */
export const AeroPill = forwardRef<HTMLDivElement, AeroPillProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
          variant === 'default' && 'aero-surface text-foreground',
          variant === 'accent' && 'bg-primary/20 text-primary',
          variant === 'muted' && 'bg-muted text-muted-foreground',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AeroPill.displayName = 'AeroPill';
