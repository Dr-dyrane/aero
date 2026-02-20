'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface AeroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * AeroButton
 * Pill-shaped, translucent, glow-on-hover.
 * Uses global AERO tokens.
 */
export const AeroButton = forwardRef<HTMLButtonElement, AeroButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base
          'inline-flex items-center justify-center font-sans font-medium',
          'rounded-full transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variants
          variant === 'primary' && [
            'bg-primary text-primary-foreground font-semibold',
            'hover:shadow-[0_0_30px_var(--color-aero-glow-blue)]',
            'active:scale-[0.98]',
          ],
          variant === 'secondary' && [
            'aero-surface aero-surface-hover',
            'text-foreground',
          ],
          variant === 'ghost' && [
            'bg-transparent text-foreground',
            'hover:bg-[var(--surface-hover)]',
          ],
          // Sizes
          size === 'sm' && 'h-8 px-3 text-xs',
          size === 'md' && 'h-10 px-5 text-sm',
          size === 'lg' && 'h-12 px-8 text-base',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
AeroButton.displayName = 'AeroButton';
