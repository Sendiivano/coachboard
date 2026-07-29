import type { HTMLAttributes } from 'react';
import { clsx } from '@/utils/clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

// Single source of truth for the "container" look used across pages —
// avoids each page hand-rolling its own border/shadow/radius combination.
export function Card({ padded = true, className, children, ...rest }: CardProps) {
  return (
    <div
      className={clsx(
        'card',
        padded && 'p-6',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}