import React, { useState } from 'react';
import { Plus, MoreVertical, Edit, Trash2, Layers, Check, X, UploadCloud } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { AdminSearch } from '../../components/ui/AdminSearch';
import { AdminDrawer } from '../../components/ui/AdminDrawer';
import { AdminInput } from '../../components/ui/AdminInput';
import { AdminImageUpload } from '../../components/ui/AdminImageUpload';
import { AdminPagination } from '../../components/ui/AdminPagination';
import { initialCategories, Category } from '../../data/categories';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Drawer Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Active' | 'Hidden'>('Active');
  const [image, setImage] = useState('');

  const filteredCategories = categories.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage) || 1;
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setStatus('Active');
    setImage(
      'https://lh3.googleusercontent.com/aida-public/AB6AXuATT8ERG7OXAHHfsVDDR_PIjU8lWaHou2PZNgQS0t1grOJegixUBQZY9S46UVmhNHF7htuAiQCiZNjK58-o1UrvimzQwhxlpkRj1Un45EepJyAzVXW5T9f6Uw5iNOBeGJtjWjtVWiCSmyA1S2v3oZPLm-gD10ji0-F40vUbTi1PZHMqOEJFQ6soKv6wtbqlhib1z31fyy4GdmqWBPnRp2g3p0V4IJmF7kER3FKkiHPnC64blBDBU2vNZg'
    );
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description);
    setStatus(category.status);
    setImage(category.image);
    setIsDrawerOpen(true);
  };

  const handleSave = (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!name.trim()) return;

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name,
                slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
                description,
                status,
                image,
              }
            : c
        )
      );
    } else {
      const newCat: Category = {
        id: `CAT-0${categories.length + 1}`,
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        productCount: 0,
        status,
        image,
        description,
        featured: false,
      };
      setCategories([...categories, newCat]);
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">Categories</h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Classify and organize luxury catalog merchandise.
            </p>
          </div>
          <AdminButton leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
            Add Category
          </AdminButton>
        </div>

        {/* Action Bar */}
        <div className="bg-white border border-outline-variant rounded-xl p-space-md shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-[260px]">
            <AdminSearch
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search categories..."
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg px-4 py-2 text-sm text-on-surface outline-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Hidden">Hidden</option>
            </select>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            Showing {filteredCategories.length} categories
          </span>
        </div>

        {/* Categories Table Card */}
        <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Category
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Slug
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Product Count
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {paginatedCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-surface-container-lowest transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg border border-outline-variant overflow-hidden bg-surface-container flex-shrink-0">
                          <img
                            className="w-full h-full object-cover"
                            alt={category.name}
                            src={category.image}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-on-surface">{category.name}</p>
                          <p className="font-caption text-xs text-on-surface-variant truncate max-w-[280px]">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-primary">
                      {category.productCount} items
                    </td>
                    <td className="px-6 py-4">
                      <AdminBadge variant={category.status === 'Active' ? 'success' : 'neutral'}>
                        {category.status}
                      </AdminBadge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(category)}
                          className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="p-4 border-t border-outline-variant bg-surface-container-low flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-on-surface-variant">
              Showing {Math.min(paginatedCategories.length, filteredCategories.length)} of{' '}
              {filteredCategories.length} categories
            </span>
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredCategories.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Add / Edit Category Drawer */}
      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        description="Define taxonomy classification and showcase imagery."
        footer={
          <>
            <AdminButton variant="outline" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSave}>
              {editingCategory ? 'Update Category' : 'Create Category'}
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-6">
          <AdminImageUpload
            label="Category Master Image (Direct File Upload)"
            value={image}
            onChange={setImage}
            aspectRatio="square"
            helperText="Upload category thumbnail (JPG, PNG, WEBP)"
            required
          />

          <AdminInput
            label="Category Name"
            placeholder="e.g. Outerwear & Coats"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!editingCategory) {
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
              }
            }}
            required
          />

          <AdminInput
            label="URL Slug"
            placeholder="outerwear-coats"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block font-label-md text-label-md text-on-surface">
              Editorial Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of craftsmanship..."
              className="w-full bg-surface border border-outline-variant rounded-lg p-3 outline-none text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-label-md text-label-md text-on-surface">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full h-10 bg-surface border border-outline-variant rounded-lg px-3.5 outline-none text-sm text-on-surface focus:border-primary"
            >
              <option value="Active">Active</option>
              <option value="Hidden">Hidden</option>
            </select>
          </div>
        </form>
      </AdminDrawer>
    </AdminLayout>
  );
};
