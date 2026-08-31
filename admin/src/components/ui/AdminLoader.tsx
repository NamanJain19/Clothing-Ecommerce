import React from 'react';
import { Loader2 } from 'lucide-react';

interface AdminLoaderProps {
  text?: string;
  className?: string;
}

export const AdminLoader: React.FC<AdminLoaderProps> = ({
  text = 'Loading...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
      <p className="font-body-md text-body-md text-on-surface-variant">{text}</p>
    </div>
  );
};
