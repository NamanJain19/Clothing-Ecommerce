import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layout, Layers, Globe, Check } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminInput } from '../../components/ui/AdminInput';
import { AdminSelect } from '../../components/ui/AdminSelect';
import { AdminBreadcrumb } from '../../components/ui/AdminBreadcrumb';

export const AddWebsiteSectionPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [type, setType] = useState('Hero Banner');
  const [pageLocation, setPageLocation] = useState('Homepage');
  const [headline, setHeadline] = useState('');
  const [subheading, setSubheading] = useState('');
  const [ctaText, setCtaText] = useState('Explore Collection');
  const [ctaLink, setCtaLink] = useState('/collections/winter-solstice');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      navigate('/admin/website-content');
    }, 800);
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1000px] mx-auto w-full space-y-space-lg">
        {/* Breadcrumb & Header */}
        <div>
          <AdminBreadcrumb
            items={[
              { label: 'Admin', path: '/admin/dashboard' },
              { label: 'Website Content', path: '/admin/website-content' },
              { label: 'New Section' },
            ]}
          />
          <h1 className="font-display text-headline-lg sm:text-display text-primary mt-1">
            Add Storefront Section
          </h1>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSave} className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-6">
          <div className="space-y-4">
            <h3 className="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-2">
              Section Classification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <AdminInput
                  label="Internal Section Identifier"
                  placeholder="e.g. Winter Solstice Hero Banner"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <AdminSelect
                label="Section Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                options={[
                  { value: 'Hero Banner', label: 'Cinematic Hero Banner' },
                  { value: 'Curated Editorial Grid', label: 'Curated Editorial Grid' },
                  { value: 'Featured Product Carousel', label: 'Product Complications Slider' },
                  { value: 'Atelier Quote', label: 'Artisanal Quote Block' },
                  { value: 'Video Showcase', label: 'Craftsmanship Video Experience' },
                ]}
              />

              <AdminSelect
                label="Target Storefront Page Location"
                value={pageLocation}
                onChange={(e) => setPageLocation(e.target.value)}
                options={[
                  { value: 'Homepage', label: '🏠 Homepage Gateway' },
                  { value: "Men's Collection", label: "👔 Men's Collection Page" },
                  { value: "Women's Collection", label: "👗 Women's Collection Page" },
                  { value: 'Kids Collection', label: '🧒 Kids Collection Page' },
                  { value: 'Accessories Page', label: '👜 Accessories Vault Page' },
                  { value: 'Private Sale Page', label: '🏷️ Private Sale & Archive Page' },
                  { value: 'Collections Hub', label: '📖 Collections Volume Hub' },
                  { value: 'Heritage Page', label: '🏛️ Heritage & Atelier Page' },
                  { value: 'Lookbook Anthology', label: '📸 Lookbook Visual Anthology' },
                ]}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-2">
              Editorial Copy & Call to Action
            </h3>

            <div className="space-y-4">
              <AdminInput
                label="Display Headline"
                placeholder="e.g. Winter Solstice MMXXIV"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />

              <AdminInput
                label="Subheading / Thesis"
                placeholder="e.g. The Architectural Silhouette Collection"
                value={subheading}
                onChange={(e) => setSubheading(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminInput
                  label="Button Text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                />
                <AdminInput
                  label="Destination URL"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant flex justify-end gap-3">
            <AdminButton variant="outline" onClick={() => navigate('/admin/website-content')}>
              Cancel
            </AdminButton>
            <AdminButton isLoading={isSaving} type="submit">
              Publish Section
            </AdminButton>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
