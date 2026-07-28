import { ButtonHTMLAttributes } from 'react';
import { clsx } from '@/utils/clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export function Button({ variant = 'primary', isLoading, className, children, disabled, ...rest }: ButtonProps) {
  return (
    <button
      className={clsx(
        'rounded-md px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-pitch text-white hover:bg-pitch-dark focus:ring-pitch',
        variant === 'secondary' && 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400',
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