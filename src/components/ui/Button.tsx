import type { ButtonHTMLAttributes } from 'react';
import { clsx } from '@/utils/clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  isLoading?: boolean;
}

export function Button({ variant = 'primary', isLoading, className, children, disabled, ...rest }: ButtonProps) {
  return (
    <button
      className={clsx(
        'btn disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' && 'btn-primary',
        variant === 'secondary' && 'btn-secondary',
        variant === 'ghost' && 'btn-ghost',
        variant === 'danger' && 'btn-danger',
        className,
      )}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading ? 'Loading…' : children}
    </button>
  );
}