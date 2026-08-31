import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Eye,
  Trash2,
  Edit,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  Upload,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { AdminModal } from '../../components/ui/AdminModal';
import { AdminInput } from '../../components/ui/AdminInput';
import { AdminSelect } from '../../components/ui/AdminSelect';
import { AdminImageUpload } from '../../components/ui/AdminImageUpload';

export type BannerTargetLocation =
  | 'Homepage Hero'
  | "Men's Collection Hero"
  | "Women's Collection Hero"
  | "Kids Collection Hero"
  | 'Accessories Hero'
  | 'Private Sale Hero'
  | 'Collections Hub Hero'
  | 'New Arrivals Hero'
  | 'Homepage Promotional Feature'
  | 'Archival Protocol Banner'
  | 'Top Announcement Ticker';

export interface StorefrontBanner {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  targetPage: BannerTargetLocation;
  slideOrder: number;
  image: string;
  link: string;
  ctaText: string;
  status: 'Active' | 'Draft' | 'Archived';
  impressions: number;
  clicks: number;
}

export const initialStorefrontBanners: StorefrontBanner[] = [
  // Homepage
  {
    id: 'BAN-HOME-01',
    title: 'The Autumn / Winter Anthology',
    subtitle: 'Architectural silhouettes, virgin cashmere, and liquid silk tailoring.',
    badge: 'Curated Season // 2026',
    targetPage: 'Homepage Hero',
    slideOrder: 1,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuATT8ERG7OXAHHfsVDDR_PIjU8lWaHou2PZNgQS0t1grOJegixUBQZY9S46UVmhNHF7htuAiQCiZNjK58-o1UrvimzQwhxlpkRj1Un45EepJyAzVXW5T9f6Uw5iNOBeGJtjWjtVWiCSmyA1S2v3oZPLm-gD10ji0-F40vUbTi1PZHMqOEJFQ6soKv6wtbqlhib1z31fyy4GdmqWBPnRp2g3p0V4IJmF7kER3FKkiHPnC64blBDBU2vNZg',
    link: '/collections',
    ctaText: 'Explore Lookbook',
    status: 'Active',
    impressions: 14250,
    clicks: 1840,
  },
  // Men
  {
    id: 'BAN-MEN-01',
    title: "Men's Collection",
    subtitle: 'A definitive collection of architectural silhouettes, artisanal fabrics, and precision tailoring.',
    badge: 'Signature Tailoring',
    targetPage: "Men's Collection Hero",
    slideOrder: 1,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCGPQOk6iZWR8JE8ZK9UBA1KYtzip0hXSS5KWZKm1MrlmXyo6w5j7GmvTIkAUyoCvxGr-ugobJyf025tNF7zvDHBIk-VdDdOrAT8bHrws5ba1l3zfw0OPIaCqY13A7h6CenkerB0RiY-MzK6-LnY50eysXq8ZkPPnut6Q4KRnMnf5QZ12PZ2yZx57sFsHbppJYXoaAnuCHM7t9hP6y0L1IZ-yQjCB-tLVivwM_gAjb-sF6wWqv5b5k7mQ',
    link: '/men',
    ctaText: 'Explore Men',
    status: 'Active',
    impressions: 8900,
    clicks: 1120,
  },
  // Women
  {
    id: 'BAN-WOMEN-01',
    title: "Women's Collection",
    subtitle: 'A curated evolution of form and texture. Discover architectural silhouettes and elevated essentials.',
    badge: 'Curated Season',
    targetPage: "Women's Collection Hero",
    slideOrder: 1,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCLZ81vrKKc9KjF7nq8llSGUICo1ImWRqT2eAiWOArBi73xgF1dumkumkFx85L6231i8QY3IlUvtbfcfCkUFRoLDM5uKjiqF4UpfzAoeQOsxLSMLBg65H8QFly58hTTmUziDVDokMGkLuYH6kYz0a0S4nnLphb21Gce8c2xCN8kEqi5yRE0zWXzd4BAGVCaWB6ZkrwntDMwaiBPvDeEKzZD6ZyBQGtOEiJMIPlPuJBE7atX04ZqSviJlg',
    link: '/women',
    ctaText: 'Explore Women',
    status: 'Active',
    impressions: 11400,
    clicks: 1560,
  },
  // Sale
  {
    id: 'BAN-SALE-01',
    title: 'The Private Sale Vault',
    subtitle: 'Exclusive seasonal archives and limited luxury releases with special privileges.',
    badge: 'Private Sale // Up to 50% Off',
    targetPage: 'Private Sale Hero',
    slideOrder: 1,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDR6aK4Him3nAFtFIsMlS9ukrGjyGi-g2fg5ua3B3PJr2da4K79QBAIf_k-fEkOXKd6hp5XX4AuPhRYDy3642DOmzX8kLetTi-uw8aVE5E5q7Kc4YfMaaHRVZm286H19bN625BHVfVn5kXW2ZDnyvaa5HgRd2qI55_MfpAB2jr9fdVdyV4DGdOBE8LOl3QsjmxG8HdBWNxqKF0PgiZLB2sKCiNKm6WX8X7HPSfhVZsRa5lQw8DZhGyajQ',
    link: '/sale',
    ctaText: 'Access Vault',
    status: 'Active',
    impressions: 21500,
    clicks: 4320,
  },
  // Kids
  {
    id: 'BAN-KIDS-01',
    title: "The Kids Atelier",
    subtitle: 'Pure cashmere, soft wool knits, and mini sartorial pieces crafted with utmost comfort.',
    badge: 'Junior Edition',
    targetPage: "Kids Collection Hero",
    slideOrder: 1,
    image:
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1200&q=80',
    link: '/kids',
    ctaText: 'Explore Kids',
    status: 'Active',
    impressions: 4300,
    clicks: 650,
  },
  // Accessories
  {
    id: 'BAN-ACC-01',
    title: 'Fine Leather & Timepiece Complications',
    subtitle: 'Full-grain Italian calfskin, handmade trunks, and precision Swiss watches.',
    badge: 'Atelier Accessories',
    targetPage: 'Accessories Hero',
    slideOrder: 1,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAyxyqvyh346BaRtj82icFZ6xEJqNwxJObUST0eLtI-twZgrnV-aKZXbTvy856m-SM3EQHVwvjSBwSw9j8GzKcmdjqR0SM8MJ6eEVGs1kfGoblzeKnFLRM0tmPIT825qn1nN9fctSzGBFjTog1_zqqpCgpNrGHp5DrggVk5VDPVKkd9iMl7ssIUbMFRUdE8l-eVAhMoofh4yJbd-RLdrXql7W4zSKTuFPkt63ATk3jXhWlc_kqlqlWivw',
    link: '/accessories',
    ctaText: 'Shop Accessories',
    status: 'Active',
    impressions: 9800,
    clicks: 1420,
  },
];

export const BannerManagementPage: React.FC = () => {
  const [banners, setBanners] = useState<StorefrontBanner[]>(initialStorefrontBanners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('All');

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badge, setBadge] = useState('Curated Season // 2026');
  const [targetPage, setTargetPage] = useState<BannerTargetLocation>('Homepage Hero');
  const [slideOrder, setSlideOrder] = useState<number>(1);
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80'
  );
  const [link, setLink] = useState('/collections');
  const [ctaText, setCtaText] = useState('Explore Collection');
  const [status, setStatus] = useState<'Active' | 'Draft'>('Active');

  const handleOpenAdd = () => {
    setEditingBannerId(null);
    setTitle('');
    setSubtitle('');
    setBadge('Curated Season // 2026');
    setTargetPage('Homepage Hero');
    setSlideOrder(1);
    setImage('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80');
    setLink('/collections');
    setCtaText('Explore Collection');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner: StorefrontBanner) => {
    setEditingBannerId(banner.id);
    setTitle(banner.title);
    setSubtitle(banner.subtitle);
    setBadge(banner.badge || '');
    setTargetPage(banner.targetPage);
    setSlideOrder(banner.slideOrder || 1);
    setImage(banner.image);
    setLink(banner.link);
    setCtaText(banner.ctaText);
    setStatus(banner.status === 'Archived' ? 'Draft' : banner.status);
    setIsModalOpen(true);
  };

  const filterTabs = [
    'All',
    'Homepage',
    'Men',
    'Women',
    'Kids',
    'Accessories',
    'Sale',
    'Collections',
  ];

  const filteredBanners = banners.filter((b) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Homepage') return b.targetPage.includes('Home');
    if (activeTab === 'Men') return b.targetPage.includes("Men");
    if (activeTab === 'Women') return b.targetPage.includes("Women");
    if (activeTab === 'Kids') return b.targetPage.includes("Kids");
    if (activeTab === 'Accessories') return b.targetPage.includes("Accessories");
    if (activeTab === 'Sale') return b.targetPage.includes("Sale") || b.targetPage.includes("Archive");
    if (activeTab === 'Collections') return b.targetPage.includes("Collection");
    return true;
  });

  const handleSaveBanner = (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!title.trim()) return;

    if (editingBannerId) {
      setBanners((prev) =>
        prev.map((b) =>
          b.id === editingBannerId
            ? {
                ...b,
                title,
                subtitle,
                badge,
                targetPage,
                slideOrder: Number(slideOrder) || 1,
                image: image || b.image,
                link,
                ctaText,
                status,
              }
            : b
        )
      );
    } else {
      const newBanner: StorefrontBanner = {
        id: `BAN-${Date.now().toString().slice(-4)}`,
        title,
        subtitle,
        badge,
        targetPage,
        slideOrder: Number(slideOrder) || 1,
        image: image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
        link,
        ctaText,
        status,
        impressions: 0,
        clicks: 0,
      };
      setBanners([newBanner, ...banners]);
    }

    setIsModalOpen(false);
    setEditingBannerId(null);
  };

  const handleDelete = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">
              Banner & Hero Carousel Hub
            </h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Upload hero banners, set target page locations, and manage carousel slides with direct device image upload.
            </p>
          </div>
          <AdminButton leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
            Add New Banner
          </AdminButton>
        </div>

        {/* Target Page Filter Tabs */}
        <div className="bg-white border border-outline-variant rounded-xl p-2 shadow-sm flex items-center gap-2 overflow-x-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-label-caps text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? 'bg-primary text-white font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
              }`}
            >
              {tab} {tab === 'All' ? `(${banners.length})` : ''}
            </button>
          ))}
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {filteredBanners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              {/* Image Preview with Badges */}
              <div className="relative aspect-[16/9] bg-surface-container overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={banner.title}
                  src={banner.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Top Location & Status Pills */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                  <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-md text-[10px] font-bold uppercase tracking-wider text-white border border-white/20">
                    📍 {banner.targetPage}
                  </span>
                  <AdminBadge variant={banner.status === 'Active' ? 'success' : 'warning'}>
                    {banner.status}
                  </AdminBadge>
                </div>

                {/* Bottom Overlay Content */}
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  {banner.badge && (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                      {banner.badge} • Slide #{banner.slideOrder}
                    </span>
                  )}
                  <h3 className="font-bold text-base truncate">{banner.title}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {banner.subtitle}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-primary font-medium bg-surface-container-low p-2 rounded-lg">
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      Button: <strong className="text-primary">{banner.ctaText}</strong> → {banner.link}
                    </span>
                  </div>
                </div>

                {/* Analytics Snapshot */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-outline-variant text-center">
                  <div className="p-2 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] uppercase font-bold text-on-surface-variant">Views</p>
                    <p className="text-sm font-bold text-primary font-mono">{banner.impressions.toLocaleString()}</p>
                  </div>
                  <div className="p-2 bg-surface-container-low rounded-lg">
                    <p className="text-[10px] uppercase font-bold text-on-surface-variant">Clicks</p>
                    <p className="text-sm font-bold text-primary font-mono">{banner.clicks.toLocaleString()}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[10px] font-mono text-on-surface-variant font-bold">
                    ORDER: SLIDE {banner.slideOrder}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(banner)}
                      className="p-2 hover:bg-surface-container-high text-on-surface-variant hover:text-primary rounded-lg transition-colors cursor-pointer"
                      title="Edit Banner Asset"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="p-2 hover:bg-red-50 text-on-surface-variant hover:text-error rounded-lg transition-colors cursor-pointer"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create / Edit Banner Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="6xl"
        title={editingBannerId ? 'Edit Storefront Banner' : 'Upload & Deploy Storefront Banner'}
        description={
          editingBannerId
            ? 'Update high-res photo, page location, headline, tagline, and button links.'
            : 'Configure target page placement, carousel slide sequence, and visual media.'
        }
        footer={
          <>
            <AdminButton variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSaveBanner}>
              {editingBannerId ? 'Save & Update Banner' : 'Deploy Banner'}
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleSaveBanner} className="space-y-5">
          {/* Section 1: Placement & Positioning Card */}
          <div className="p-5 bg-surface-container-low border border-outline-variant rounded-xl space-y-3">
            <h4 className="font-bold text-xs text-primary uppercase tracking-wider">
              1. Storefront Page Location & Sequence
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <AdminSelect
                  label="Target Storefront Page (Where will this appear?)"
                  value={targetPage}
                  onChange={(e) => setTargetPage(e.target.value as BannerTargetLocation)}
                  options={[
                    { value: 'Homepage Hero', label: '🏠 Homepage (Top Hero Carousel)' },
                    { value: "Men's Collection Hero", label: "👔 Men's Collection Page (Hero Carousel)" },
                    { value: "Women's Collection Hero", label: "👗 Women's Collection Page (Hero Carousel)" },
                    { value: "Kids Collection Hero", label: "🧒 Kids Collection Page (Hero Carousel)" },
                    { value: 'Accessories Hero', label: '👜 Accessories Page (Hero Carousel)' },
                    { value: 'Private Sale Hero', label: '🏷️ Private Sale Page (Hero Carousel)' },
                    { value: 'Collections Hub Hero', label: '📖 The Collections Hub (Hero Banner)' },
                    { value: 'New Arrivals Hero', label: '✨ New Arrivals Page (Hero Banner)' },
                    { value: 'Homepage Promotional Feature', label: '🌟 Homepage Mid-Page Feature' },
                    { value: 'Archival Protocol Banner', label: '📜 Archival Protocol Dark Banner' },
                    { value: 'Top Announcement Ticker', label: '📢 Top Header Announcement Bar' },
                  ]}
                />
              </div>
              <div>
                <AdminInput
                  label="Slide Sequence #"
                  type="number"
                  value={String(slideOrder)}
                  onChange={(e) => setSlideOrder(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Editorial Copy Card */}
          <div className="p-5 bg-surface-container-low border border-outline-variant rounded-xl space-y-3">
            <h4 className="font-bold text-xs text-primary uppercase tracking-wider">
              2. Banner Text & Badges
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AdminInput
                label="Banner Main Headline"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Architectural Wool Outerwear"
                required
              />
              <AdminInput
                label="Tagline / Badge (Upper Text)"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Curated Season // 2026"
              />
            </div>
            <AdminInput
              label="Subtitle / Supporting Description"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. A curated evolution of form, texture, and structured tailoring."
            />
          </div>

          {/* Section 3: Multi-Image Carousel & Direct Device Upload Card */}
          <div className="p-5 bg-surface-container-low border border-outline-variant rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-primary uppercase tracking-wider">
                3. Banner Visual Media (Batch Upload 3 to 6+ Carousel Slides)
              </h4>
              <span className="text-[11px] text-on-surface-variant font-medium">
                High-Res (1920x800 or 16:9)
              </span>
            </div>

            {/* Batch Multi-Slide Uploader */}
            <div className="border-2 border-dashed border-outline-variant rounded-2xl p-5 bg-white text-center space-y-3 hover:bg-neutral-50 transition-all">
              <input
                type="file"
                accept="image/*"
                multiple
                id="batch-banner-carousel-upload"
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0) return;
                  Array.from(files).forEach((file) => {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      if (ev.target?.result) {
                        const newUrl = ev.target.result as string;
                        if (!image) {
                          setImage(newUrl);
                        } else {
                          // Auto create an additional carousel slide banner in the list
                          const newSlide: StorefrontBanner = {
                            id: `BAN-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                            title: `${title || 'Curated Editorial'} (Slide #${banners.filter(b => b.targetPage === targetPage).length + 1})`,
                            subtitle: subtitle || 'Refined tailoring and silhouettes.',
                            badge: badge || 'New Season // 2026',
                            targetPage: targetPage,
                            slideOrder: banners.filter(b => b.targetPage === targetPage).length + 1,
                            image: newUrl,
                            link: link || '/collections',
                            ctaText: ctaText || 'Explore Collection',
                            status: 'Active',
                            impressions: 0,
                            clicks: 0,
                          };
                          setBanners((prev) => [...prev, newSlide]);
                        }
                      }
                    };
                    reader.readAsDataURL(file);
                  });
                }}
              />

              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mx-auto shadow-xs">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-primary">
                  Upload Multiple Slide Images for this Carousel
                </h5>
                <p className="text-[11px] text-on-surface-variant">
                  Select 3 to 6 photos from your computer to create a full multi-slide hero slideshow.
                </p>
              </div>
              <button
                type="button"
                onClick={() => document.getElementById('batch-banner-carousel-upload')?.click()}
                className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-neutral-800 cursor-pointer shadow-xs inline-flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" /> Select 3-6 Slide Photos
              </button>
            </div>

            {/* Primary Slide Image */}
            <AdminImageUpload
              label="Primary Slide Image (Active)"
              value={image}
              onChange={setImage}
              aspectRatio="banner"
              helperText="Main image for this specific slide"
              required
            />
          </div>

          {/* Section 4: Call to Action Card */}
          <div className="p-5 bg-surface-container-low border border-outline-variant rounded-xl space-y-3">
            <h4 className="font-bold text-xs text-primary uppercase tracking-wider">
              4. Button Text & Destination Route
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AdminInput
                label="Button Label"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="e.g. Explore Lookbook"
              />
              <AdminInput
                label="Destination Link URL"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="e.g. /sale, /men, /collections"
              />
            </div>
          </div>
        </form>
      </AdminModal>
    </AdminLayout>
  );
};

export default BannerManagementPage;
