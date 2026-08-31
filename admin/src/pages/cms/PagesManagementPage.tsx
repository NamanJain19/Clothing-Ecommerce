import React, { useState } from 'react';
import { FileText, Plus, Edit, Trash2, Globe, Eye } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { AdminSearch } from '../../components/ui/AdminSearch';
import { AdminModal } from '../../components/ui/AdminModal';
import { AdminInput } from '../../components/ui/AdminInput';
import { AdminSelect } from '../../components/ui/AdminSelect';
import { AdminPagination } from '../../components/ui/AdminPagination';
import { initialPages, PageItem } from '../../data/storeOperations';

export const PagesManagementPage: React.FC = () => {
  const [pages, setPages] = useState<PageItem[]>(initialPages);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [layout, setLayout] = useState<PageItem['layout']>('Standard Editorial');

  const filteredPages = pages.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPages.length / itemsPerPage) || 1;
  const paginatedPages = filteredPages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setLayout('Standard Editorial');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (page: PageItem) => {
    setEditingId(page.id);
    setTitle(page.title);
    setSlug(page.slug);
    setLayout(page.layout);
    setIsModalOpen(true);
  };

  const handleSave = (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!title.trim()) return;

    if (editingId) {
      setPages((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                title,
                slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                layout,
                lastUpdated: 'Just now',
              }
            : p
        )
      );
    } else {
      const newPage: PageItem = {
        id: `PG-0${pages.length + 1}`,
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        layout,
        status: 'Published',
        lastUpdated: 'Just now',
        author: 'Executive Curator',
      };
      setPages([...pages, newPage]);
    }

    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">
              Editorial CMS Pages
            </h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Author brand heritage narratives, legal declarations, and bespoke concierge guides.
            </p>
          </div>
          <AdminButton leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
            Create New Page
          </AdminButton>
        </div>

        {/* Search */}
        <div className="bg-white border border-outline-variant rounded-xl p-space-md shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <AdminSearch
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search pages by title or slug..."
            />
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            Showing {filteredPages.length} pages
          </span>
        </div>

        {/* Table */}
        <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Page Title
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    URL Slug
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Editorial Layout
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Author
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Last Updated
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
                {paginatedPages.map((page) => (
                  <tr key={page.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-6 py-4 font-semibold text-sm text-primary">{page.title}</td>
                    <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">
                      /{page.slug}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-on-surface">{page.layout}</td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">{page.author}</td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">
                      {page.lastUpdated}
                    </td>
                    <td className="px-6 py-4">
                      <AdminBadge variant={page.status === 'Published' ? 'success' : 'neutral'}>
                        {page.status}
                      </AdminBadge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(page)}
                          className="p-1.5 hover:bg-surface-container text-on-surface-variant hover:text-primary rounded-lg transition-colors cursor-pointer"
                          title="Edit Page Asset"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(page.id)}
                          className="p-1.5 hover:bg-red-50 text-on-surface-variant hover:text-error rounded-lg transition-colors cursor-pointer"
                          title="Delete Page"
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
              Showing {Math.min(paginatedPages.length, filteredPages.length)} of{' '}
              {filteredPages.length} CMS pages
            </span>
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredPages.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="5xl"
        title={editingId ? 'Edit Editorial CMS Page' : 'Create Editorial Page'}
        description={
          editingId
            ? 'Update standalone page title, route slug, and editorial layout template.'
            : 'Establish a new standalone narrative in the storefront directory.'
        }
        footer={
          <>
            <AdminButton variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSave}>
              {editingId ? 'Save Changes' : 'Publish Page'}
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <AdminInput
            label="Page Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Master Tailoring & Bespoke Philosophy"
            required
          />
          <AdminInput
            label="Slug Path"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. master-tailoring"
          />
          <AdminSelect
            label="Editorial Layout Preset"
            value={layout}
            onChange={(e) => setLayout(e.target.value as any)}
            options={[
              { value: 'Standard Editorial', label: 'Standard Editorial' },
              { value: 'Full Screen Atelier', label: 'Full Screen Atelier Cinematic' },
              { value: 'Legal Compliance', label: 'Legal Compliance' },
              { value: 'Interactive Map', label: 'Interactive Atelier Salon Locator' },
            ]}
          />
        </form>
      </AdminModal>
    </AdminLayout>
  );
};
