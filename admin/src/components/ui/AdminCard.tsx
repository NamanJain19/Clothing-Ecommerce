import React from 'react';

interface AdminCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export const AdminCard: React.FC<AdminCardProps> = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  bodyClassName = 'p-space-lg',
}) => {
  return (
    <div className={`bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="px-space-lg py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
          <div>
            {title && <h3 className="font-headline-md text-headline-md text-primary">{title}</h3>}
            {subtitle && <p className="font-caption text-on-surface-variant mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
};
