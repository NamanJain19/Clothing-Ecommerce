import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: Option[];
  containerClassName?: string;
}

export const AdminSelect = forwardRef<HTMLSelectElement, AdminSelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      children,
      className = '',
      containerClassName = '',
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        {label && (
          <label htmlFor={selectId} className="block font-label-md text-label-md text-on-surface">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={`w-full h-10 bg-surface border rounded-lg pl-3.5 pr-10 outline-none appearance-none transition-all duration-200 font-body-md text-on-surface cursor-pointer disabled:bg-surface-container-low disabled:cursor-not-allowed ${
              error
                ? 'border-error focus:ring-2 focus:ring-error/20'
                : 'border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10'
            } ${className}`}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <ChevronDown className="w-4 h-4 text-outline absolute right-3 pointer-events-none" />
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

AdminSelect.displayName = 'AdminSelect';
