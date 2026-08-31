import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Plus, MoveUp, MoveDown, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { initialWebsiteSections, WebsiteSection } from '../../data/storeOperations';

export const WebsiteContentPage: React.FC = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState<WebsiteSection[]>(initialWebsiteSections);

  const toggleVisibility = (id: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === 'Visible' ? 'Hidden' : 'Visible' } : s
      )
    );
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

  const handleDelete = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
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

        {/* Sections List */}
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
                      Type: <span className="font-semibold text-primary">{section.type}</span> •
                      Location: <span className="font-medium">{section.pageLocation}</span> • Last
                      modified: {section.lastModified}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleVisibility(section.id)}
                    className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    title="Toggle Visibility"
                  >
                    {section.status === 'Visible' ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-outline" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(section.id)}
                    className="p-2 hover:bg-red-50 text-on-surface-variant hover:text-error rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
