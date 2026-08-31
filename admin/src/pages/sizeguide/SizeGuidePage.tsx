import React, { useState } from 'react';
import { Ruler, Plus, Edit, Check } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { initialSizeGuides, SizeGuide } from '../../data/storeOperations';

export const SizeGuidePage: React.FC = () => {
  const [guides, setGuides] = useState<SizeGuide[]>(initialSizeGuides);
  const [selectedGuide, setSelectedGuide] = useState<SizeGuide>(guides[0]);

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
          <AdminButton
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => alert('New size guide chart template created.')}
          >
            Add Size Chart
          </AdminButton>
        </div>

        {/* Guides Navigation & Chart Split */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-space-lg items-start">
          {/* Guide Selector (30%) */}
          <div className="lg:col-span-3 space-y-3">
            {guides.map((guide) => (
              <div
                key={guide.id}
                onClick={() => setSelectedGuide(guide)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedGuide.id === guide.id
                    ? 'bg-white border-primary shadow-sm ring-1 ring-primary'
                    : 'bg-white border-outline-variant hover:bg-surface-container-low'
                }`}
              >
                <h3 className="font-bold text-sm text-primary">{guide.title}</h3>
                <p className="text-xs text-on-surface-variant mt-1">Category: {guide.category}</p>
                <p className="text-[11px] text-outline mt-2">Last updated: {guide.lastUpdated}</p>
              </div>
            ))}
          </div>

          {/* Guide Matrix Table (70%) */}
          <div className="lg:col-span-7 bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <div>
                <h3 className="font-headline-md text-headline-md text-primary">
                  {selectedGuide.title}
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">{selectedGuide.notes}</p>
              </div>
              <AdminButton size="sm" variant="outline">
                <Edit className="w-3.5 h-3.5 mr-1" /> Edit Matrix
              </AdminButton>
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
        </div>
      </div>
    </AdminLayout>
  );
};
