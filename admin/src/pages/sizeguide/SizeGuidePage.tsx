import React, { useState, useEffect } from 'react';
import { Ruler, Plus, Edit, Trash2, Check, Loader2, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminModal } from '../../components/ui/AdminModal';
import { AdminInput } from '../../components/ui/AdminInput';
import { adminService } from '../../services/adminService';

export interface SizeChartRow {
  size: string;
  chest?: string;
  waist?: string;
  hips?: string;
  shoulders?: string;
}

export interface SizeGuideItem {
  id: string;
  title: string;
  category: string;
  notes: string;
  lastUpdated: string;
  chartData: SizeChartRow[];
}

export const SizeGuidePage: React.FC = () => {
  const [guides, setGuides] = useState<SizeGuideItem[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<SizeGuideItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [categoryName, setCategoryName] = useState('Outerwear');
  const [notes, setNotes] = useState('');

  const fetchGuides = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getSizeGuides();
      const rawList = res?.data || [];
      const mapped: SizeGuideItem[] = rawList.map((g: any) => ({
        id: g._id || g.id,
        title: g.name || g.title || 'Standard Size Guide',
        category: g.category?.name || g.category || 'Garments',
        notes: g.description || g.notes || 'Measurements in centimeters (cm). True to bespoke fit.',
        lastUpdated: g.updatedAt ? new Date(g.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Live',
        chartData: Array.isArray(g.measurements) && g.measurements.length > 0
          ? g.measurements.map((m: any) => ({
              size: m.size || 'M',
              chest: m.chest || m.bust || '98 - 102 cm',
              waist: m.waist || '82 - 86 cm',
              hips: m.hips || '98 - 102 cm',
              shoulders: m.shoulders || '46 cm',
            }))
          : [
              { size: 'EU 46 / S', chest: '92 - 96 cm', waist: '78 - 82 cm', hips: '94 - 98 cm', shoulders: '44 cm' },
              { size: 'EU 48 / M', chest: '96 - 100 cm', waist: '82 - 86 cm', hips: '98 - 102 cm', shoulders: '45.5 cm' },
              { size: 'EU 50 / L', chest: '100 - 104 cm', waist: '86 - 90 cm', hips: '102 - 106 cm', shoulders: '47 cm' },
              { size: 'EU 52 / XL', chest: '104 - 108 cm', waist: '90 - 95 cm', hips: '106 - 110 cm', shoulders: '48.5 cm' },
            ],
      }));
      setGuides(mapped);
      if (mapped.length > 0) {
        setSelectedGuide(mapped[0]);
      } else {
        setSelectedGuide(null);
      }
    } catch (err: any) {
      console.error('Failed to load size guides:', err);
      setError(err.message || 'Unable to load size guides from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const handleOpenAdd = () => {
    setTitle('');
    setCategoryName('Outerwear');
    setNotes('Measurements in centimeters (cm).');
    setIsModalOpen(true);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (!title.trim()) return;

    try {
      const payload = {
        name: title.trim(),
        description: notes.trim(),
        measurements: [
          { size: 'EU 46 / S', chest: '92 - 96 cm', waist: '78 - 82 cm', hips: '94 - 98 cm', shoulders: '44 cm' },
          { size: 'EU 48 / M', chest: '96 - 100 cm', waist: '82 - 86 cm', hips: '98 - 102 cm', shoulders: '45.5 cm' },
          { size: 'EU 50 / L', chest: '100 - 104 cm', waist: '86 - 90 cm', hips: '102 - 106 cm', shoulders: '47 cm' },
          { size: 'EU 52 / XL', chest: '104 - 108 cm', waist: '90 - 95 cm', hips: '106 - 110 cm', shoulders: '48.5 cm' },
        ],
      };
      await adminService.createSizeGuide(payload);
      setIsModalOpen(false);
      await fetchGuides();
    } catch (err: any) {
      alert(err.message || 'Failed to create size guide in database.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this size guide?')) return;
    try {
      await adminService.deleteSizeGuide(id);
      await fetchGuides();
    } catch (err: any) {
      alert(err.message || 'Failed to delete size guide.');
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">
              Size Guides & Measurements
            </h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Configure sizing specifications and measurement charts for garments, footwear, and accessories.
            </p>
          </div>
          <AdminButton leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
            Add Size Chart
          </AdminButton>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-outline-variant rounded-xl">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="font-body-md text-sm text-on-surface-variant">Loading size guides from database...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 bg-red-50/50 border border-red-200 rounded-xl text-center px-4">
            <AlertCircle className="w-8 h-8 text-error mb-2" />
            <p className="font-body-md text-sm text-error font-medium">{error}</p>
            <AdminButton variant="outline" className="mt-4" onClick={fetchGuides}>
              Retry
            </AdminButton>
          </div>
        ) : guides.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-outline-variant rounded-xl text-center px-4">
            <Ruler className="w-10 h-10 text-on-surface-variant/40 mb-3" />
            <h3 className="font-display text-base font-bold text-primary">No size guides configured</h3>
            <p className="font-body-md text-sm text-on-surface-variant mt-1 max-w-sm">
              Create sizing charts and fit specifications for customer guidance.
            </p>
            <AdminButton leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd} className="mt-4">
              Add Size Chart
            </AdminButton>
          </div>
        ) : (
          /* Guides Navigation & Chart Split */
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-space-lg items-start">
            {/* Guide Selector (30%) */}
            <div className="lg:col-span-3 space-y-3">
              {guides.map((guide) => (
                <div
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-start ${
                    selectedGuide?.id === guide.id
                      ? 'bg-white border-primary shadow-sm ring-1 ring-primary'
                      : 'bg-white border-outline-variant hover:bg-surface-container-low'
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-sm text-primary">{guide.title}</h3>
                    <p className="text-xs text-on-surface-variant mt-1">Category: {guide.category}</p>
                    <p className="text-[11px] text-outline mt-2">Last updated: {guide.lastUpdated}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(guide.id);
                    }}
                    className="p-1 hover:bg-red-50 text-on-surface-variant hover:text-error rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Guide Matrix Table (70%) */}
            {selectedGuide && (
              <div className="lg:col-span-7 bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-outline-variant pb-3">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-primary">
                      {selectedGuide.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">{selectedGuide.notes}</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-outline-variant text-[11px] font-semibold text-secondary uppercase tracking-wider">
                        <th className="px-4 py-3">Size Specification</th>
                        <th className="px-4 py-3">Chest Proportions</th>
                        <th className="px-4 py-3">Waistline</th>
                        <th className="px-4 py-3">Hip Circumference</th>
                        <th className="px-4 py-3">Shoulder Span</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {selectedGuide.chartData.map((row) => (
                        <tr key={row.size} className="hover:bg-surface-container-lowest">
                          <td className="px-4 py-3.5 font-bold text-primary">{row.size}</td>
                          <td className="px-4 py-3.5 text-on-surface-variant font-mono text-xs">
                            {row.chest}
                          </td>
                          <td className="px-4 py-3.5 text-on-surface-variant font-mono text-xs">
                            {row.waist}
                          </td>
                          <td className="px-4 py-3.5 text-on-surface-variant font-mono text-xs">
                            {row.hips}
                          </td>
                          <td className="px-4 py-3.5 text-on-surface-variant font-mono text-xs">
                            {row.shoulders}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Size Guide Template"
        description="Create a new measurement matrix in MongoDB Atlas."
        footer={
          <>
            <AdminButton variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSave}>Save Guide</AdminButton>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <AdminInput
            label="Size Guide Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Bespoke Tailoring & Suit Jackets"
            required
          />
          <AdminInput
            label="Category"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="e.g. Outerwear"
          />
          <div className="space-y-1.5">
            <label className="block font-label-md text-sm text-on-surface">Fit Notes & Instructions</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg p-3 outline-none text-sm text-on-surface focus:border-primary"
            />
          </div>
        </form>
      </AdminModal>
    </AdminLayout>
  );
};

export default SizeGuidePage;
