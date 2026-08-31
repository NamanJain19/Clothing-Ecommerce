import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface AdminButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const AdminButton: React.FC<AdminButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-label-md rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed select-none';

  const sizeClasses = {
    sm: 'h-8 px-3 text-label-sm gap-1.5',
    md: 'h-10 px-4 text-label-md gap-2',
    lg: 'h-12 px-6 text-label-md gap-2.5',
  };

  const variantClasses = {
    primary: 'bg-primary text-on-primary hover:bg-on-background active:scale-[0.98] shadow-sm',
    secondary: 'bg-secondary-container text-on-secondary-container hover:bg-surface-container-high',
    outline: 'border border-outline-variant bg-surface text-on-surface hover:bg-surface-container-low hover:border-outline',
    danger: 'bg-error text-on-error hover:bg-red-700 shadow-sm',
    ghost: 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </motion.button>
  );
};
