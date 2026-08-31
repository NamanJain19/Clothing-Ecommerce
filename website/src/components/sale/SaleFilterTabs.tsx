import React from 'react';

export type SaleFilterTab = 'All' | 'Men' | 'Women' | 'Accessories' | 'Outerwear' | '30%+ Off' | '50% Off';

interface SaleFilterTabsProps {
  activeTab: SaleFilterTab;
  onSelectTab: (tab: SaleFilterTab) => void;
}

export const saleFilterTabsList: { key: SaleFilterTab; label: string }[] = [
  { key: 'All', label: 'All Reductions' },
  { key: 'Men', label: "Men's Archive" },
  { key: 'Women', label: "Women's Archive" },
  { key: 'Accessories', label: 'Accessories Vault' },
  { key: 'Outerwear', label: 'Outerwear & Tailoring' },
  { key: '30%+ Off', label: '30%+ Privileged' },
  { key: '50% Off', label: '50% Seasonal Vault' },
];

export const SaleFilterTabs: React.FC<SaleFilterTabsProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <div className="border-b border-outline-variant pb-4 mb-8 overflow-x-auto hide-scrollbar">
      <div className="flex items-center space-x-6 md:space-x-8 min-w-max">
        {saleFilterTabsList.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelectTab(item.key)}
              className={`font-label-caps text-label-caps uppercase tracking-widest pb-2 transition-all cursor-pointer select-none ${
                isActive
                  ? 'text-primary border-b-2 border-primary font-semibold'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SaleFilterTabs;
