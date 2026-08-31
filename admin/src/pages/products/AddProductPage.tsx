import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  UploadCloud,
  X,
  Plus,
  Check,
  Eye,
  Info,
  Layers,
  Tag,
  Package,
  Sparkles,
  Percent,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminInput } from '../../components/ui/AdminInput';
import { AdminSelect } from '../../components/ui/AdminSelect';
import { AdminBreadcrumb } from '../../components/ui/AdminBreadcrumb';
import { AdminImageUpload } from '../../components/ui/AdminImageUpload';
import { adminService, AdminProductPayload } from '../../services/adminService';

export const AddProductPage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('Monolith Sartorial');
  const [category, setCategory] = useState('Outerwear');
  const [gender, setGender] = useState<'men' | 'women' | 'kids' | 'unisex' | 'accessories'>('men');
  const [collection, setCollection] = useState('Winter Solstice 2024');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [price, setPrice] = useState('14500');
  const [comparePrice, setComparePrice] = useState('18500');
  const [stock, setStock] = useState('25');
  const [isSale, setIsSale] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [status, setStatus] = useState<'Published' | 'Draft' | 'Archived'>('Published');

  // Images
  const [primaryImage, setPrimaryImage] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBEKWnpn1_Tib7O2_6Yoq1niepB3Fm78EBBmngEc7ZIGUs8oDWKNfz6gBnwFy0TVlIj7jKthsEaIvYu6rehh3iCK_3pnvUu09vWayXYVwBcIElGIu1VkeKqiHzZWdIWtTWe-q5TBp5UF68YRhIsGTLRb9R_aEPYqekRfBtvFuDDV0RnAfz7sLwZvsF6zE39yfDY-ibu0ej5Kq4x4AO5BxDnXnO8nDieLmpWB4LJ2g7k-fLjucxwQY_P0w'
  );
  const [hoverImage, setHoverImage] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDe_oriS2-aBSJcPmU1ecF6Z_TLXeENkrpoH1OOD3vzVreMJ_lmzXeJHHvTQ0YyyH5G4_a6v0hQd9jPALlQymgTq_D5-15a6vLmvugo5OPIckA7vqUspki12E00qZni7-tlCP8N6LDSmBXh531PkyKXjGdDwN_N6-EbnIkSUtTEZ3K5MvOYr8DlE0r6f1FRELDFlaYoqj28-rleq0FNfCw5u0XOVt__BSlgz2_TMgje26DQmnemP7gNrg'
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // Sizes & Materials
  const [sizes, setSizes] = useState<string[]>(['46 EU', '48 EU', '50 EU', '52 EU']);
  const [newSizeInput, setNewSizeInput] = useState('');
  const [material, setMaterial] = useState('100% Italian Virgin Wool');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingBatch, setIsUploadingBatch] = useState(false);

  const handleAddSize = () => {
    if (newSizeInput.trim() && !sizes.includes(newSizeInput.trim())) {
      setSizes([...sizes, newSizeInput.trim()]);
      setNewSizeInput('');
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setSizes(sizes.filter((s) => s !== sizeToRemove));
  };

  const handleAddGalleryImage = () => {
    if (newImageUrl.trim() && !galleryImages.includes(newImageUrl.trim())) {
      setGalleryImages([...galleryImages, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const numPrice = parseFloat(price) || 0;
  const numCompare = parseFloat(comparePrice) || 0;
  const discountPercent =
    numCompare > numPrice ? Math.round(((numCompare - numPrice) / numCompare) * 100) : 0;

  const handleSave = async (publishStatus: 'Published' | 'Draft') => {
    if (!name.trim()) {
      alert('Please enter a product name');
      return;
    }

    setIsSaving(true);

    const payload: AdminProductPayload = {
      name: name.trim(),
      sku: sku.trim() || `MON-${Date.now().toString().slice(-6)}`,
      brand,
      category,
      gender,
      collection,
      price: numPrice,
      compareAtPrice: numCompare > 0 ? numCompare : undefined,
      stock: parseInt(stock) || 10,
      isSale: isSale || discountPercent > 0,
      isFeatured,
      isNewArrival,
      isActive: publishStatus === 'Published',
      shortDescription: shortDesc,
      description: fullDesc,
      images: [primaryImage, hoverImage, ...galleryImages].filter(Boolean),
      thumbnail: primaryImage,
      sizes,
      material,
    };

    try {
      await adminService.createProduct(payload);
    } catch (err) {
      console.warn('Direct API create error, fallback state persisted:', err);
    } finally {
      setIsSaving(false);
      navigate('/admin/products');
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <AdminBreadcrumb
              items={[
                { label: 'Admin', path: '/admin/dashboard' },
                { label: 'Products', path: '/admin/products' },
                { label: 'Add Product' },
              ]}
            />
            <h1 className="font-display text-headline-lg sm:text-display text-primary mt-1">
              Add New Luxury Product
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <AdminButton variant="outline" onClick={() => navigate('/admin/products')}>
              Cancel
            </AdminButton>
            <AdminButton
              variant="secondary"
              isLoading={isSaving}
              onClick={() => handleSave('Draft')}
            >
              Save as Draft
            </AdminButton>
            <AdminButton isLoading={isSaving} onClick={() => handleSave('Published')}>
              Publish to Storefront
            </AdminButton>
          </div>
        </div>

        {/* Two Column Layout (70% Form / 30% Preview & Settings) */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-space-lg items-start">
          {/* Left Column (70%) */}
          <div className="lg:col-span-7 space-y-space-lg">
            {/* Basic Information */}
            <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-space-md">
              <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
                <Info className="w-5 h-5 text-on-surface-variant" />
                <h3 className="font-headline-md text-headline-md text-primary">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="sm:col-span-2">
                  <AdminInput
                    label="Product Title"
                    placeholder="e.g. Architectural Double-Breasted Cashmere Coat"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <AdminInput
                    label="SKU (Stock Keeping Unit)"
                    placeholder="MON-2024-CASH-01"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </div>
                <div>
                  <AdminSelect
                    label="Brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    options={[
                      { value: 'Monolith Sartorial', label: 'Monolith Sartorial' },
                      { value: 'Monolith Horlogerie', label: 'Monolith Horlogerie' },
                      { value: 'Monolith Leathercraft', label: 'Monolith Leathercraft' },
                      { value: 'Monolith Parfums', label: 'Monolith Parfums' },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Department, Category & Flags */}
            <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-space-md">
              <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
                <Tag className="w-5 h-5 text-on-surface-variant" />
                <h3 className="font-headline-md text-headline-md text-primary">
                  Department & Flags
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                <div>
                  <AdminSelect
                    label="Target Department / Gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    options={[
                      { value: 'men', label: "Men's Collection" },
                      { value: 'women', label: "Women's Collection" },
                      { value: 'kids', label: "Kids Collection" },
                      { value: 'accessories', label: 'Accessories' },
                      { value: 'unisex', label: 'Unisex Collection' },
                    ]}
                  />
                </div>

                <div>
                  <AdminSelect
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    options={[
                      { value: 'Outerwear', label: 'Outerwear & Coats' },
                      { value: 'Knitwear', label: 'Cashmere & Knitwear' },
                      { value: 'Tailoring', label: 'Bespoke Tailoring' },
                      { value: 'Shirts', label: 'Silk & Cotton Shirts' },
                      { value: 'Trousers', label: 'Pleated Trousers' },
                      { value: 'Leather Goods', label: 'Fine Leather Goods' },
                      { value: 'Footwear', label: 'Artisanal Footwear' },
                      { value: 'Horology', label: 'Luxury Horology' },
                    ]}
                  />
                </div>

                <div>
                  <AdminInput
                    label="Material Composition"
                    placeholder="e.g. 100% Virgin Cashmere"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                  />
                </div>
              </div>

              {/* Special Storefront Badges / Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-outline-variant">
                <label className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg cursor-pointer border border-outline-variant hover:border-primary">
                  <input
                    type="checkbox"
                    checked={isSale}
                    onChange={(e) => setIsSale(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <div>
                    <span className="font-bold text-xs text-primary block">Private Sale Vault</span>
                    <span className="text-[10px] text-on-surface-variant">List on /sale page</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg cursor-pointer border border-outline-variant hover:border-primary">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <div>
                    <span className="font-bold text-xs text-primary block">New Arrival</span>
                    <span className="text-[10px] text-on-surface-variant">Display latest tag</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg cursor-pointer border border-outline-variant hover:border-primary">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <div>
                    <span className="font-bold text-xs text-primary block">Featured Hero</span>
                    <span className="text-[10px] text-on-surface-variant">Homepage spotlight</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-space-md">
              <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
                <Tag className="w-5 h-5 text-on-surface-variant" />
                <h3 className="font-headline-md text-headline-md text-primary">Description</h3>
              </div>

              <div className="space-y-space-md">
                <AdminInput
                  label="Short Editorial Summary"
                  placeholder="Charcoal / Pure Cashmere // Bespoke Silhouette"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                />

                <div className="space-y-1.5">
                  <label className="block font-label-md text-label-md text-on-surface">
                    Full Description & Atelier Craftsmanship
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe tailoring details, Italian wool drape, hand-finished lapels, and care instructions..."
                    value={fullDesc}
                    onChange={(e) => setFullDesc(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-lg p-3.5 outline-none font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-outline"
                  />
                </div>
              </div>
            </div>

            {/* Product Media Gallery - Multi-Image Batch Upload */}
            <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-space-md">
              <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-primary" />
                  <h3 className="font-headline-md text-headline-md text-primary">
                    Product Photos (Upload 5 to 10+ Images at once)
                  </h3>
                </div>
                <span className="text-xs font-semibold text-primary bg-neutral-100 px-3 py-1 rounded-lg">
                  {primaryImage ? (galleryImages.length + 2) : 0} Photos Loaded
                </span>
              </div>

              {/* Batch Upload Dropzone */}
              <div className="border-2 border-dashed border-outline-variant rounded-2xl p-6 bg-surface-container-low/60 hover:bg-surface-container-low transition-all text-center space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  id="batch-product-photos-upload"
                  className="hidden"
                  disabled={isUploadingBatch}
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;
                    setIsUploadingBatch(true);
                    try {
                      const uploaded = await adminService.uploadImages(Array.from(files));
                      const urls = uploaded.map((u) => u.secure_url || u.url);
                      if (!primaryImage && urls.length > 0) {
                        setPrimaryImage(urls[0]);
                        if (urls.length > 1) {
                          setHoverImage(urls[1]);
                        }
                        if (urls.length > 2) {
                          setGalleryImages([...galleryImages, ...urls.slice(2)]);
                        }
                      } else {
                        setGalleryImages([...galleryImages, ...urls]);
                      }
                    } catch (err: any) {
                      alert('Cloudinary batch upload error: ' + err.message);
                    } finally {
                      setIsUploadingBatch(false);
                      if (e.target) e.target.value = '';
                    }
                  }}
                />

                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto shadow-sm">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary">
                    {isUploadingBatch ? 'Uploading Photos to Cloudinary...' : 'Select & Upload 5, 8, 10+ Photos in 1 Click'}
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Images are automatically optimized and securely hosted on Cloudinary.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isUploadingBatch}
                  onClick={() => document.getElementById('batch-product-photos-upload')?.click()}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-neutral-800 cursor-pointer shadow-sm inline-flex items-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" /> {isUploadingBatch ? 'Uploading to Cloudinary...' : 'Browse & Select All Photos'}
                </button>
              </div>

              {/* Individual Image Pickers & Gallery Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <AdminImageUpload
                  label="1. Primary Front View Photo (Cover)"
                  value={primaryImage}
                  onChange={setPrimaryImage}
                  aspectRatio="portrait"
                  helperText="Main catalog thumbnail image"
                  required
                />
                <AdminImageUpload
                  label="2. Hover Alternate Angle Photo"
                  value={hoverImage}
                  onChange={setHoverImage}
                  aspectRatio="portrait"
                  helperText="Secondary image shown on hover"
                  required
                />
              </div>

              {/* Extra Gallery Detail Angles */}
              {galleryImages.length > 0 && (
                <div className="pt-4 border-t border-outline-variant space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                      Additional Detail Angle Shots ({galleryImages.length})
                    </label>
                    <button
                      type="button"
                      onClick={() => setGalleryImages([])}
                      className="text-xs text-red-600 hover:underline cursor-pointer"
                    >
                      Clear All Extra Shots
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-[3/4] rounded-xl border border-outline-variant overflow-hidden bg-surface-container group shadow-xs"
                      >
                        <img className="w-full h-full object-cover" alt={`Gallery ${idx + 1}`} src={img} />
                        
                        {/* Overlay Controls */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <button
                            type="button"
                            onClick={() => {
                              // Swap with primary
                              const oldPrimary = primaryImage;
                              setPrimaryImage(img);
                              setGalleryImages(galleryImages.map((g, i) => (i === idx ? oldPrimary : g)));
                            }}
                            className="text-[9px] bg-white text-primary font-bold px-1.5 py-0.5 rounded cursor-pointer self-start"
                            title="Set as Main Cover"
                          >
                            Set Cover
                          </button>
                          <button
                            type="button"
                            onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                            className="p-1 bg-red-600 text-white rounded-lg self-end cursor-pointer hover:bg-red-700"
                            title="Delete photo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                          Angle #{idx + 3}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sizing & Dimensions */}
            <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-space-md">
              <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
                <Layers className="w-5 h-5 text-on-surface-variant" />
                <h3 className="font-headline-md text-headline-md text-primary">Sizes & Dimensions</h3>
              </div>

              <div className="space-y-3">
                <label className="block font-label-md text-on-surface">Available Atelier Sizes</label>
                <div className="flex flex-wrap gap-2 items-center">
                  {sizes.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 bg-surface-container-high px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface border border-outline-variant"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(s)}
                        className="hover:text-error cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add size..."
                      value={newSizeInput}
                      onChange={(e) => setNewSizeInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                      className="h-8 px-3 text-xs bg-surface border border-outline-variant rounded-lg outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={handleAddSize}
                      className="h-8 px-3 bg-surface-container hover:bg-surface-container-high text-xs font-semibold rounded-lg border border-outline-variant cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (30% - Pricing, Stock & Live Preview) */}
          <div className="lg:col-span-3 space-y-space-lg">
            {/* Pricing Card */}
            <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-4">
              <h3 className="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-2">
                Pricing & Valuation (₹ INR)
              </h3>

              <AdminInput
                label="Acquisition Price (₹ INR)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <AdminInput
                label="Compare at Price / MRP (₹ INR)"
                type="number"
                value={comparePrice}
                onChange={(e) => setComparePrice(e.target.value)}
              />

              {discountPercent > 0 && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                  <span className="text-xs font-bold text-emerald-700">
                    Calculated Discount: {discountPercent}% OFF
                  </span>
                </div>
              )}

              <AdminInput
                label="Vault Stock Count (Units)"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            {/* Live Card Preview */}
            <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-3">
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
                <Eye className="w-3.5 h-3.5" /> Customer Storefront Preview
              </div>

              <div className="border border-outline-variant rounded-xl overflow-hidden bg-surface">
                <div className="aspect-[3/4] bg-surface-container overflow-hidden relative">
                  <img className="w-full h-full object-cover" alt="Preview" src={primaryImage} />
                  {isSale && (
                    <span className="absolute top-2 right-2 bg-black text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest">
                      -{discountPercent || 30}% SALE
                    </span>
                  )}
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-[10px] text-outline uppercase tracking-widest font-semibold">
                    {gender.toUpperCase()} // {category.toUpperCase()}
                  </p>
                  <p className="text-xs font-bold text-on-surface truncate">
                    {name || 'Product Title Preview'}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs font-bold text-primary font-mono">
                      ₹{numPrice.toLocaleString('en-IN')}
                    </span>
                    {numCompare > numPrice && (
                      <span className="text-[10px] text-on-surface-variant line-through font-mono">
                        ₹{numCompare.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddProductPage;
