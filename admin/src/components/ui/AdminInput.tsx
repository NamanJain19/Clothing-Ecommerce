import React, { forwardRef, useState } from 'react';

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const AdminInput = forwardRef<HTMLInputElement, AdminInputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = '',
      containerClassName = '',
      id,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        {label && (
          <label htmlFor={inputId} className="block font-label-md text-label-md text-on-surface">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span
              className={`absolute left-3 transition-colors duration-200 pointer-events-none ${
                isFocused ? 'text-primary' : 'text-outline'
              }`}
            >
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={`w-full h-10 bg-surface border rounded-lg outline-none transition-all duration-200 font-body-md text-on-surface placeholder:text-outline disabled:bg-surface-container-low disabled:cursor-not-allowed ${
              leftIcon ? 'pl-10' : 'pl-3.5'
            } ${rightIcon ? 'pr-10' : 'pr-3.5'} ${
              error
                ? 'border-error focus:ring-2 focus:ring-error/20'
                : 'border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10'
            } ${className}`}
            {...props}
          />
          {rightIcon && <span className="absolute right-3 flex items-center">{rightIcon}</span>}
        </div>
        {error ? (
          <p className="font-caption text-error text-xs">{error}</p>
        ) : helperText ? (
          <p className="font-caption text-on-surface-variant text-xs">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

AdminInput.displayName = 'AdminInput';
