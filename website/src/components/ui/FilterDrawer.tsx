import React from 'react';
import { X } from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] transition-opacity duration-500 ease-in-out">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={onClose}></div>
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white p-margin-mobile md:p-margin-desktop flex flex-col z-10 shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center mb-12">
          <h2 className="font-label-caps text-label-caps tracking-widest uppercase">FILTERS</h2>
          <button className="text-primary hover:opacity-60 transition-opacity cursor-pointer" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-12 pr-2">
          <div>
            <h3 className="font-label-caps text-label-caps mb-6 uppercase">CATEGORY</h3>
            <div className="space-y-4">
              {['Outerwear', 'Knitwear', 'Shirts', 'Accessories'].map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input className="w-4 h-4 rounded-none border-primary text-primary focus:ring-0 cursor-pointer" type="checkbox" />
                  <span className="font-body-md text-secondary group-hover:text-primary transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-label-caps text-label-caps mb-6 uppercase">MATERIAL</h3>
            <div className="space-y-4">
              {['Organic Cashmere', 'Italian Wool', 'Mulberry Silk'].map((mat) => (
                <label key={mat} className="flex items-center gap-3 cursor-pointer group">
                  <input className="w-4 h-4 rounded-none border-primary text-primary focus:ring-0 cursor-pointer" type="checkbox" />
                  <span className="font-body-md text-secondary group-hover:text-primary transition-colors">{mat}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-12 border-t border-outline-variant flex gap-4">
          <button className="flex-1 border border-primary py-4 font-label-caps text-label-caps hover:bg-surface-container transition-colors cursor-pointer">
            CLEAR
          </button>
          <button
            className="flex-1 bg-primary text-white py-4 font-label-caps text-label-caps hover:bg-black/90 transition-colors cursor-pointer"
            onClick={onClose}
          >
            APPLY
          </button>
        </div>
      </div>
    </div>
  );
};
