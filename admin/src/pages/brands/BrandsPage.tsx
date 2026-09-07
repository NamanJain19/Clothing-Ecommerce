import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit, Trash2, MapPin, Calendar, Layers, Loader2, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { AdminModal } from '../../components/ui/AdminModal';
import { AdminInput } from '../../components/ui/AdminInput';
import { adminService } from '../../services/adminService';

export interface BrandItem {
  id: string;
  name: string;
  origin: string;
  founded: number;
  productCount: number;
  status: string;
  description: string;
  logoText: string;
}

export const BrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('Milan, Italy');
  const [founded, setFounded] = useState('1990');
  const [description, setDescription] = useState('');

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getBrands();
      const rawList = res?.data || [];
      const mapped: BrandItem[] = rawList.map((b: any) => {
        const brandName = b.name || 'Brand';
        const logo = brandName
          .split(' ')
          .map((w: string) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

        return {
          id: b._id || b.id,
          name: brandName,
          origin: b.origin || 'Milan, Italy',
          founded: b.founded || 2024,
          productCount: b.productCount || 0,
          status: b.isActive === false ? 'Inactive' : 'Active',
          description: b.description || '',
          logoText: logo,
        };
      });
      setBrands(mapped);
    } catch (err: any) {
      console.error('Failed to load brands:', err);
      setError(err.message || 'Unable to load brands. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setOrigin('Milan, Italy');
    setFounded('1990');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (brand: BrandItem) => {
    setEditingId(brand.id);
    setName(brand.name);
    setOrigin(brand.origin);
    setFounded(String(brand.founded));
    setDescription(brand.description);
    setIsModalOpen(true);
  };

  const handleSave = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!name.trim()) return;

    try {
      const payload = {
        name: name.trim(),
        origin: origin.trim(),
        founded: parseInt(founded, 10) || 2024,
        description: description.trim(),
        isActive: true,
      };

      if (editingId) {
        await adminService.updateBrand(editingId, payload);
      } else {
        await adminService.createBrand(payload);
      }

      setIsModalOpen(false);
      setEditingId(null);
      await fetchBrands();
    } catch (err: any) {
      alert(err.message || 'Failed to save brand to database.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return;
    try {
      await adminService.deleteBrand(id);
      setBrands((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete brand from database.');
    }
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

        {/* Brands Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-outline-variant rounded-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="font-body-md text-sm text-on-surface-variant">Loading brands from database...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 bg-red-50/50 border border-red-200 rounded-2xl text-center px-4">
            <AlertCircle className="w-8 h-8 text-error mb-2" />
            <p className="font-body-md text-sm text-error font-medium">{error}</p>
            <AdminButton variant="outline" className="mt-4" onClick={fetchBrands}>
              Retry
            </AdminButton>
          </div>
        ) : brands.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-outline-variant rounded-2xl text-center px-4">
            <Tag className="w-10 h-10 text-on-surface-variant/40 mb-3" />
            <h3 className="font-display text-base font-bold text-primary">No brands configured</h3>
            <p className="font-body-md text-sm text-on-surface-variant mt-1 max-w-sm">
              Add labels and designer ateliers to organize your luxury catalog.
            </p>
            <AdminButton leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd} className="mt-4">
              Add New Brand
            </AdminButton>
          </div>
        ) : (
          /* Brands Grid */
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
                    <AdminBadge variant={brand.status === 'Active' ? 'success' : 'neutral'}>{brand.status}</AdminBadge>
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
        )}
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
