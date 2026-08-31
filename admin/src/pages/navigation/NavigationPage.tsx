import React, { useState } from 'react';
import { Compass, Plus, MoveUp, MoveDown, Edit, Trash2, Check } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { AdminModal } from '../../components/ui/AdminModal';
import { AdminInput } from '../../components/ui/AdminInput';
import { initialNavigationMenus, NavigationMenu } from '../../data/storeOperations';

export const NavigationPage: React.FC = () => {
  const [menus, setMenus] = useState<NavigationMenu[]>(initialNavigationMenus);
  const [selectedMenu, setSelectedMenu] = useState<NavigationMenu>(menus[0]);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleAddItem = (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!newLabel.trim()) return;

    const updatedItems = [...selectedMenu.items, { label: newLabel, url: newUrl }];
    const updatedMenu = { ...selectedMenu, items: updatedItems, itemsCount: updatedItems.length };

    setMenus((prev) => prev.map((m) => (m.id === selectedMenu.id ? updatedMenu : m)));
    setSelectedMenu(updatedMenu);
    setIsAddItemModalOpen(false);
    setNewLabel('');
    setNewUrl('');
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = selectedMenu.items.filter((_, i) => i !== index);
    const updatedMenu = { ...selectedMenu, items: updatedItems, itemsCount: updatedItems.length };
    setMenus((prev) => prev.map((m) => (m.id === selectedMenu.id ? updatedMenu : m)));
    setSelectedMenu(updatedMenu);
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">
              Storefront Navigation Menus
            </h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Configure header menus, footer links, and VIP drawer pathways.
            </p>
          </div>
          <AdminButton leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsAddItemModalOpen(true)}>
            Add Menu Item
          </AdminButton>
        </div>

        {/* Menu Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-space-lg items-start">
          {/* Menu Selector (30%) */}
          <div className="lg:col-span-3 space-y-3">
            {menus.map((menu) => (
              <div
                key={menu.id}
                onClick={() => setSelectedMenu(menu)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedMenu.id === menu.id
                    ? 'bg-white border-primary shadow-sm ring-1 ring-primary'
                    : 'bg-white border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-primary">{menu.location}</h3>
                  <AdminBadge variant="success">{menu.status}</AdminBadge>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">
                  {menu.items.length} Linked Pathways
                </p>
              </div>
            ))}
          </div>

          {/* Menu Items List (70%) */}
          <div className="lg:col-span-7 bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <div>
                <h3 className="font-headline-md text-headline-md text-primary">
                  {selectedMenu.location} Links
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Reorder and configure destination targets.
                </p>
              </div>
            </div>

            <div className="divide-y divide-outline-variant">
              {selectedMenu.items.map((item, idx) => (
                <div
                  key={idx}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-surface-container-lowest"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-on-surface">{item.label}</p>
                      {item.badge && (
                        <span className="text-[10px] uppercase font-bold bg-primary text-white px-2 py-0.5 rounded">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-xs text-on-surface-variant">{item.url}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 hover:bg-red-50 text-on-surface-variant hover:text-error rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AdminModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        title="Add Navigation Target"
        description={`Linking item inside ${selectedMenu.location}`}
        footer={
          <>
            <AdminButton variant="outline" onClick={() => setIsAddItemModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleAddItem}>Add Item</AdminButton>
          </>
        }
      >
        <form onSubmit={handleAddItem} className="space-y-4">
          <AdminInput
            label="Menu Item Label"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="e.g. Bespoke Tailoring"
            required
          />
          <AdminInput
            label="Destination Path (URL)"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="/categories/bespoke-tailoring"
            required
          />
        </form>
      </AdminModal>
    </AdminLayout>
  );
};
