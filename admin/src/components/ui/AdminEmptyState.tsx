import React from 'react';
import { PackageOpen } from 'lucide-react';

interface AdminEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center bg-white border border-outline-variant rounded-2xl ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-outline mb-4 border border-outline-variant">
        {icon || <PackageOpen className="w-7 h-7" />}
      </div>
      <h4 className="font-headline-md text-headline-md text-on-surface mb-1">{title}</h4>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
