import React from 'react';

export type CollectionFilterCategory = 'All' | 'Men' | 'Women' | 'Kids' | 'Accessories' | 'New Arrivals' | 'Sale';

interface CollectionsFilterProps {
  activeCategory: CollectionFilterCategory;
  onSelectCategory: (category: CollectionFilterCategory) => void;
}

export const collectionsCategories: CollectionFilterCategory[] = [
  'All',
  'Men',
  'Women',
  'Kids',
  'Accessories',
  'New Arrivals',
  'Sale',
];

export const CollectionsFilter: React.FC<CollectionsFilterProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="border-b border-outline-variant pb-4 mb-12 overflow-x-auto hide-scrollbar">
      <div className="flex items-center space-x-8 min-w-max">
        {collectionsCategories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`font-label-caps text-label-caps uppercase tracking-widest pb-2 transition-all cursor-pointer ${
                isActive
                  ? 'text-primary border-b-2 border-primary font-semibold'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
