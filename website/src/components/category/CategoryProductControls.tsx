import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, Check } from 'lucide-react';

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'discount_desc' | 'popular';

interface CategoryProductControlsProps {
  totalProducts?: number;
  onFilterClick?: () => void;
  sort?: SortOption;
  onSortChange?: (sort: SortOption) => void;
}

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'NEWEST',
  price_asc: 'PRICE: LOW TO HIGH',
  price_desc: 'PRICE: HIGH TO LOW',
  discount_desc: 'HIGHEST DISCOUNT',
  popular: 'MOST POPULAR',
};

export const CategoryProductControls: React.FC<CategoryProductControlsProps> = ({
  totalProducts = 128,
  onFilterClick,
  sort = 'newest',
  onSortChange,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSort = (option: SortOption) => {
    if (onSortChange) {
      onSortChange(option);
    }
    setIsSortOpen(false);
  };

  return (
    <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-16 pb-8 border-b border-outline-variant flex flex-col md:flex-row justify-between items-baseline gap-4">
      <div className="flex items-center gap-8">
        <button
          onClick={onFilterClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ letterSpacing: isHovered ? '0.2em' : '0.15em' }}
          className="group flex items-center gap-2 font-label-caps text-label-caps py-2 transition-all duration-300 cursor-pointer"
        >
          <Filter className="w-4 h-4 text-primary" />
          FILTERS
        </button>

        {/* Sort By Dropdown */}
        <div className="relative hidden md:block" ref={sortRef}>
          <div className="flex items-center gap-3">
            <span className="font-label-caps text-label-caps text-secondary/60">SORT BY:</span>
            <button
              onClick={() => setIsSortOpen((prev) => !prev)}
              className="font-label-caps text-label-caps flex items-center gap-1.5 cursor-pointer py-1 border-b border-transparent hover:border-primary transition-all"
            >
              <span>{SORT_LABELS[sort] || 'NEWEST'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-secondary transition-transform duration-300 ${
                  isSortOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {isSortOpen && (
            <div className="absolute top-full left-0 mt-3 w-56 bg-white border border-outline/10 shadow-xl py-2 z-50 animate-in fade-in duration-200">
              {(Object.keys(SORT_LABELS) as SortOption[]).map((optionKey) => {
                const isSelected = sort === optionKey;
                return (
                  <button
                    key={optionKey}
                    onClick={() => handleSelectSort(optionKey)}
                    className={`w-full text-left px-5 py-2.5 font-label-caps text-[11px] uppercase tracking-wider flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-surface text-primary font-bold'
                        : 'text-secondary hover:text-primary hover:bg-surface'
                    }`}
                  >
                    <span>{SORT_LABELS[optionKey]}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="font-label-caps text-label-caps text-secondary font-mono">
        {totalProducts} PRODUCTS
      </div>
    </section>
  );
};

