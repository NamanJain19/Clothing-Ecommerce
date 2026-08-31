import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  UploadCloud,
  X,
  Plus,
  Info,
  Layers,
  Tag,
  Eye,
  Trash2,
  Sparkles,
  Percent,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminInput } from '../../components/ui/AdminInput';
import { AdminSelect } from '../../components/ui/AdminSelect';
import { AdminBreadcrumb } from '../../components/ui/AdminBreadcrumb';
import { AdminImageUpload } from '../../components/ui/AdminImageUpload';
import { initialProducts, Product } from '../../data/products';
import { adminService } from '../../services/adminService';

export const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fallbackProduct = initialProducts.find((p) => p.id === id) || initialProducts[0];

  const [name, setName] = useState(fallbackProduct.name);
  const [sku, setSku] = useState(fallbackProduct.sku);
  const [brand, setBrand] = useState(fallbackProduct.brand);
  const [category, setCategory] = useState(fallbackProduct.category);
  const [collection, setCollection] = useState(fallbackProduct.collection);
  const [gender, setGender] = useState<string>('unisex');
  const [price, setPrice] = useState(fallbackProduct.price.toString());
  const [comparePrice, setComparePrice] = useState((fallbackProduct.compareAtPrice || 0).toString());
  const [isSale, setIsSale] = useState(Boolean(fallbackProduct.isSale));
  const [stock, setStock] = useState(fallbackProduct.stock.toString());
  const [description, setDescription] = useState(fallbackProduct.description);
  const [material, setMaterial] = useState(fallbackProduct.material || '100% Virgin Cashmere / Loro Piana Wool');
  const [status, setStatus] = useState<Product['status']>(fallbackProduct.status);
  const [primaryImage, setPrimaryImage] = useState(fallbackProduct.image);
  const [hoverImage, setHoverImage] = useState(fallbackProduct.image);
  const [galleryImages, setGalleryImages] = useState<string[]>(fallbackProduct.gallery || []);
  const [newGalleryInput, setNewGalleryInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingBatch, setIsUploadingBatch] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await adminService.getProducts();
        const found = res.products?.find((p: any) => p._id === id || p.id === id);
        if (found) {
          setName(found.name || '');
          setSku(found.sku || '');
          setBrand(found.brand || 'Monolith Sartorial');
          setCategory(found.category || 'Outerwear');
          setCollection(found.collection || 'Winter Solstice 2024');
          setGender(found.gender || 'unisex');
          setPrice(String(found.price || 0));
          setComparePrice(String(found.compareAtPrice || found.price || 0));
          setIsSale(Boolean(found.isSale || found.isSaleVault));
          setStock(String(found.stock ?? 15));
          setDescription(found.description || '');
          setMaterial(found.material || '100% Virgin Cashmere');
          setStatus(found.status || 'Published');
          if (found.images && found.images.length > 0) {
            setPrimaryImage(found.images[0]);
            setHoverImage(found.images[1] || found.images[0]);
            setGalleryImages(found.images);
          }
        }
      } catch (err) {
        console.warn('Could not fetch product from live API, using fallback state:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const discountPercent =
    Number(comparePrice) > Number(price) && Number(comparePrice) > 0
      ? Math.round(((Number(comparePrice) - Number(price)) / Number(comparePrice)) * 100)
      : 0;

  const handleAddGalleryImage = () => {
    if (newGalleryInput.trim()) {
      setGalleryImages([...galleryImages, newGalleryInput.trim()]);
      setNewGalleryInput('');
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, idx) => idx !== index));
  };

  const handleUpdate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim() || !id) return;

    setIsSaving(true);
    const updatedImages = [
      primaryImage,
      hoverImage !== primaryImage ? hoverImage : null,
      ...galleryImages.filter((img) => img !== primaryImage && img !== hoverImage),
    ].filter(Boolean) as string[];

    const payload = {
      name,
      sku,
      brand,
      category,
      collection,
      gender: gender as any,
      price: parseFloat(price) || 0,
      compareAtPrice: parseFloat(comparePrice) || parseFloat(price) || 0,
      isSale: isSale,
      stock: parseInt(stock, 10) || 0,
      description,
      material,
      status,
      images: updatedImages.length > 0 ? updatedImages : [primaryImage],
    };

    try {
      await adminService.updateProduct(id, payload);
    } catch (err) {
      console.warn('Failed to update live API:', err);
    } finally {
      setIsSaving(false);
      navigate('/admin/products');
    }
  };

  return (
    <AdminLayout>
      <form onSubmit={handleUpdate} className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <AdminBreadcrumb
              items={[
                { label: 'Admin', path: '/admin/dashboard' },
                { label: 'Products', path: '/admin/products' },
                { label: 'Edit Asset' },
              ]}
            />
            <h1 className="font-display text-headline-lg sm:text-display text-primary mt-1">
              Edit Product: {name}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <AdminButton variant="outline" type="button" onClick={() => navigate('/admin/products')}>
              Cancel
            </AdminButton>
            <AdminButton isLoading={isSaving} type="submit">
              Save & Publish Changes
            </AdminButton>
          </div>
        </div>

        {/* 70/30 Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-space-lg items-start">
          <div className="lg:col-span-7 space-y-space-lg">
            {/* Basic Info */}
            <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-space-md">
              <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
                <Info className="w-5 h-5 text-on-surface-variant" />
                <h3 className="font-headline-md text-headline-md text-primary">Master Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="sm:col-span-2">
                  <AdminInput
                    label="Product Name / Title"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <AdminInput label="SKU Identification" value={sku} onChange={(e) => setSku(e.target.value)} required />
                </div>
                <div>
                  <AdminSelect
                    label="Brand / Atelier"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    options={[
                      { value: 'Monolith Sartorial', label: 'Monolith Sartorial' },
                      { value: 'Monolith Horlogerie', label: 'Monolith Horlogerie' },
                      { value: 'Monolith Leathercraft', label: 'Monolith Leathercraft' },
                      { value: 'Monolith Parfums', label: 'Monolith Parfums' },
                      { value: 'Monolith Private Archive', label: 'Monolith Private Archive' },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Private Sale Vault & Pricing in ₹ INR */}
            <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                <div className="flex items-center gap-2">
                  <Percent className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-headline-md text-headline-md text-primary">
                    Valuation & Private Sale Vault (₹ INR)
                  </h3>
                </div>
                {discountPercent > 0 && isSale && (
                  <span className="text-xs px-2.5 py-1 bg-red-100 text-red-700 font-bold rounded-full">
                    {discountPercent}% OFF LIVE
                  </span>
                )}
              </div>

              {/* Private Sale Vault Checkbox */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-emerald-950">Include in Private Sale & Archive Vault (/sale)</p>
                  <p className="text-xs text-emerald-800">
                    Product will automatically feature on the private sale showcase with calculated discount badges.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isSale}
                  onChange={(e) => setIsSale(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div>
                  <AdminInput
                    label="Offer / Selling Price (₹ INR)"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <AdminInput
                    label="Original / Compare-At Price MRP (₹ INR)"
                    type="number"
                    value={comparePrice}
                    onChange={(e) => setComparePrice(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Description & Material */}
            <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-space-md">
              <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
                <Tag className="w-5 h-5 text-on-surface-variant" />
                <h3 className="font-headline-md text-headline-md text-primary">Atelier Description & Composition</h3>
              </div>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description and craftsmanship details..."
                className="w-full bg-surface border border-outline-variant rounded-lg p-3.5 outline-none font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
              <AdminInput
                label="Material Composition / Provenance"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. 100% Italian Double-Faced Cashmere, Horn Buttons"
              />
            </div>

            {/* Product Media Gallery - Multi-Image Batch Upload */}
            <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-space-md">
              <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  <h3 className="font-headline-md text-headline-md text-primary">
                    Product Photos (Upload 5 to 10+ Images at once)
                  </h3>
                </div>
                <span className="text-xs font-semibold text-primary bg-neutral-100 px-3 py-1 rounded-lg">
                  {primaryImage ? (galleryImages.length + 2) : 0} Photos Loaded
                </span>
              </div>

              {/* Batch Upload Option */}
              <div className="border-2 border-dashed border-outline-variant rounded-2xl p-6 bg-surface-container-low/60 hover:bg-surface-container-low transition-all text-center space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  id="edit-batch-product-photos-upload"
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
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary">
                    {isUploadingBatch ? 'Uploading Photos to Cloudinary...' : 'Select & Upload Multiple Photos in 1 Click'}
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Images are automatically optimized and securely stored on Cloudinary.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isUploadingBatch}
                  onClick={() => document.getElementById('edit-batch-product-photos-upload')?.click()}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-neutral-800 cursor-pointer shadow-sm inline-flex items-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" /> {isUploadingBatch ? 'Uploading to Cloudinary...' : 'Browse & Select Photos'}
                </button>
              </div>

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
                />
              </div>

              {/* Extra Gallery Assets */}
              {galleryImages.length > 0 && (
                <div className="pt-4 border-t border-outline-variant space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase">
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
                    {galleryImages.map((url, idx) => (
                      <div key={idx} className="relative aspect-[3/4] rounded-xl border overflow-hidden group shadow-xs">
                        <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <button
                            type="button"
                            onClick={() => {
                              const oldPrimary = primaryImage;
                              setPrimaryImage(url);
                              setGalleryImages(galleryImages.map((g, i) => (i === idx ? oldPrimary : g)));
                            }}
                            className="text-[9px] bg-white text-primary font-bold px-1.5 py-0.5 rounded cursor-pointer self-start"
                            title="Set as Main Cover"
                          >
                            Set Cover
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="p-1 bg-red-600 text-white rounded-lg self-end cursor-pointer hover:bg-red-700"
                            title="Remove Photo"
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
          </div>

          {/* Right Column: Classification & Stock */}
          <div className="lg:col-span-3 space-y-space-lg">
            <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-4">
              <h3 className="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-2">
                Inventory & Stock
              </h3>
              <AdminInput
                label="Available Units"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>

            <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-4">
              <h3 className="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-2">
                Department & Placement
              </h3>

              <AdminSelect
                label="Storefront Department (Gender)"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                options={[
                  { value: 'men', label: "Men's Collection (/men)" },
                  { value: 'women', label: "Women's Collection (/women)" },
                  { value: 'kids', label: "Kids Collection (/kids)" },
                  { value: 'accessories', label: 'Accessories & Leather (/accessories)' },
                  { value: 'unisex', label: 'Unisex / Universal' },
                ]}
              />

              <AdminSelect
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  { value: 'Outerwear', label: 'Outerwear & Coats' },
                  { value: 'Horology', label: 'Horology & Timepieces' },
                  { value: 'Leather Goods', label: 'Fine Leather Goods' },
                  { value: 'Tailoring', label: 'Bespoke Tailoring' },
                  { value: 'Knitwear', label: 'Virgin Cashmere & Knitwear' },
                  { value: 'Footwear', label: 'Bespoke Footwear' },
                  { value: 'Shirts', label: 'Silk & Poplin Shirts' },
                ]}
              />

              <AdminSelect
                label="Collection Series"
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                options={[
                  { value: 'Winter Solstice 2024', label: 'Winter Solstice 2024' },
                  { value: 'Celestial Edition', label: 'Celestial Edition' },
                  { value: 'Black Tie Gala', label: 'Black Tie Gala' },
                  { value: 'Essential Luxury', label: 'Essential Luxury' },
                  { value: 'Archival Protocol', label: 'Archival Protocol' },
                ]}
              />

              <AdminSelect
                label="Publishing Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                options={[
                  { value: 'Published', label: 'Published & Live' },
                  { value: 'Draft', label: 'Internal Draft' },
                  { value: 'Archived', label: 'Archived Vault' },
                  { value: 'Out of Stock', label: 'Out of Stock' },
                ]}
              />
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default EditProductPage;
