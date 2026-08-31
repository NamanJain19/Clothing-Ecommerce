import React from 'react';
import { Search, X } from 'lucide-react';

interface AdminSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const AdminSearch: React.FC<AdminSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}) => {
  return (
    <div
      className={`relative flex items-center bg-surface border border-outline-variant rounded-lg focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all ${className}`}
    >
      <Search className="w-4 h-4 text-outline absolute left-3 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-8 bg-transparent outline-none font-body-md text-sm text-on-surface placeholder:text-outline"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 p-0.5 text-outline hover:text-on-surface rounded-full hover:bg-surface-container transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
