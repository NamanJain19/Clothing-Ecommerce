import React, { useState } from 'react';
import { Tag, Plus, Edit, Trash2, MapPin, Calendar, Layers } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { AdminModal } from '../../components/ui/AdminModal';
import { AdminInput } from '../../components/ui/AdminInput';
import { initialBrands, Brand } from '../../data/storeOperations';

export const BrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('Milan, Italy');
  const [founded, setFounded] = useState('1990');
  const [description, setDescription] = useState('');

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setOrigin('Milan, Italy');
    setFounded('1990');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (brand: Brand) => {
    setEditingId(brand.id);
    setName(brand.name);
    setOrigin(brand.origin);
    setFounded(String(brand.founded));
    setDescription(brand.description);
    setIsModalOpen(true);
  };

  const handleSave = (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!name.trim()) return;

    const logo = name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    if (editingId) {
      setBrands((prev) =>
        prev.map((b) =>
          b.id === editingId
            ? {
                ...b,
                name,
                origin,
                founded: parseInt(founded, 10) || 2024,
                description,
                logoText: logo,
              }
            : b
        )
      );
    } else {
      const newBrand: Brand = {
        id: `BRD-0${brands.length + 1}`,
        name,
        origin,
        founded: parseInt(founded, 10) || 2024,
        productCount: 0,
        status: 'Active',
        description,
        logoText: logo,
      };
      setBrands([...brands, newBrand]);
    }

    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setBrands((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">
              Brand & Label Management
            </h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Manage luxury labels, designer brands, and catalog allocations.
            </p>
          </div>
          <AdminButton leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
            Add New Brand
          </AdminButton>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm tracking-wider">
                    {brand.logoText}
                  </div>
                  <AdminBadge variant="success">{brand.status}</AdminBadge>
                </div>

                <h3 className="font-bold text-base text-primary mt-4">{brand.name}</h3>
                <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{brand.origin}</span> • Est. {brand.founded}
                </p>

                <p className="text-xs text-on-surface-variant leading-relaxed mt-3">{brand.description}</p>
              </div>

              <div className="pt-4 border-t border-outline-variant flex items-center justify-between text-xs">
                <span className="font-bold text-primary">{brand.productCount} Active Products</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(brand)}
                    className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    title="Edit Brand"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="p-1.5 hover:bg-red-50 text-on-surface-variant hover:text-error rounded-lg transition-colors cursor-pointer"
                    title="Delete Brand"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create / Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="3xl"
        title={editingId ? 'Edit Brand' : 'Add New Brand'}
        description="Configure brand name, origin location, and label description."
        footer={
          <>
            <AdminButton variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSave}>
              {editingId ? 'Save Changes' : 'Create Brand'}
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <AdminInput
            label="Brand Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Monolith Sartorial"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <AdminInput
              label="Brand Origin City & Country"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. Florence, Italy"
            />
            <AdminInput
              label="Founded Year"
              type="number"
              value={founded}
              onChange={(e) => setFounded(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block font-label-md text-sm text-on-surface">Brand Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brand craftsmanship and heritage specialization..."
              className="w-full bg-surface border border-outline-variant rounded-lg p-3 outline-none text-sm text-on-surface focus:border-primary"
            />
          </div>
        </form>
      </AdminModal>
    </AdminLayout>
  );
};

export default BrandsPage;
