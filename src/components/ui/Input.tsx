import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, id, className, ...rest }, ref) => {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={inputId}
        ref={ref}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`input-field ${error ? 'error' : ''} ${className ?? ''}`}
        {...rest}
      />
      {error && (
        <span id={`${inputId}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';