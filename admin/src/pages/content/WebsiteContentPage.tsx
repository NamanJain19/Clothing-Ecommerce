import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Plus, MoveUp, MoveDown, Eye, EyeOff, Edit, Trash2, Loader2, AlertCircle, LayoutTemplate } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { adminService } from '../../services/adminService';

export interface WebsiteSectionItem {
  id: string;
  title: string;
  type: string;
  pageLocation: string;
  status: 'Visible' | 'Hidden';
  lastModified: string;
  sortOrder: number;
}

export const WebsiteContentPage: React.FC = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState<WebsiteSectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getWebsiteContent();
      const rawList = res?.data || [];
      const mapped: WebsiteSectionItem[] = rawList.map((s: any, idx: number) => ({
        id: s._id || s.id,
        title: s.name || s.title || `Section ${idx + 1}`,
        type: s.type || 'Hero Banner',
        pageLocation: s.pageLocation || s.page || 'Homepage',
        status: s.isActive === false ? 'Hidden' : 'Visible',
        lastModified: s.updatedAt ? new Date(s.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Live',
        sortOrder: s.sortOrder ?? idx,
      }));
      setSections(mapped);
    } catch (err: any) {
      console.error('Failed to load website content sections:', err);
      setError(err.message || 'Unable to load website sections from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const toggleVisibility = async (id: string, currentStatus: string) => {
    const newActive = currentStatus !== 'Visible';
    try {
      await adminService.updateWebsiteSection(id, { isActive: newActive });
      setSections((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newActive ? 'Visible' : 'Hidden' } : s))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update section visibility.');
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    setSections(newSections);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this website section?')) return;
    try {
      await adminService.deleteWebsiteSection(id);
      setSections((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete website section from database.');
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">
              Website Content Manager
            </h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Curate homepage sections, hero banners, editorial grids, and visual layouts.
            </p>
          </div>
          <AdminButton
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/admin/website-content/new')}
          >
            Add New Section
          </AdminButton>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-outline-variant rounded-xl">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="font-body-md text-sm text-on-surface-variant">Loading storefront layout from database...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 bg-red-50/50 border border-red-200 rounded-xl text-center px-4">
            <AlertCircle className="w-8 h-8 text-error mb-2" />
            <p className="font-body-md text-sm text-error font-medium">{error}</p>
            <AdminButton variant="outline" className="mt-4" onClick={fetchSections}>
              Retry
            </AdminButton>
          </div>
        ) : sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-outline-variant rounded-xl text-center px-4">
            <LayoutTemplate className="w-10 h-10 text-on-surface-variant/40 mb-3" />
            <h3 className="font-display text-base font-bold text-primary">No sections created</h3>
            <p className="font-body-md text-sm text-on-surface-variant mt-1 max-w-sm">
              Configure hero banners, video experiences, and editorial storytelling blocks.
            </p>
            <AdminButton leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate('/admin/website-content/new')} className="mt-4">
              Add New Section
            </AdminButton>
          </div>
        ) : (
          /* Sections List */
          <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center text-xs font-semibold text-on-surface-variant">
              <span>Section Architecture (Drag & Reorder)</span>
              <span>Total Sections: {sections.length}</span>
            </div>

            <div className="divide-y divide-outline-variant">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-container-lowest transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1 text-on-surface-variant">
                      <button
                        disabled={index === 0}
                        onClick={() => moveSection(index, 'up')}
                        className="p-1 hover:text-primary disabled:opacity-20 cursor-pointer"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        disabled={index === sections.length - 1}
                        onClick={() => moveSection(index, 'down')}
                        className="p-1 hover:text-primary disabled:opacity-20 cursor-pointer"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-on-surface">{section.title}</h3>
                        <AdminBadge variant={section.status === 'Visible' ? 'success' : 'neutral'}>
                          {section.status}
                        </AdminBadge>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Type: <span className="font-semibold text-primary">{section.type}</span> • Location:{' '}
                        <span className="font-medium">{section.pageLocation}</span> • Last modified:{' '}
                        {section.lastModified}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => toggleVisibility(section.id, section.status)}
                      className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                      title={section.status === 'Visible' ? 'Hide Section' : 'Publish Section'}
                    >
                      {section.status === 'Visible' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="p-2 hover:bg-red-50 text-on-surface-variant hover:text-error rounded-lg transition-colors cursor-pointer"
                      title="Delete Section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
