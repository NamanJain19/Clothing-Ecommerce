import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Edit,
  ArrowLeft,
  Star,
  Package,
  TrendingUp,
  CreditCard,
  Building,
  CheckCircle2,
  Calendar,
  Layers,
  ShoppingBag,
  Percent,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { AdminBreadcrumb } from '../../components/ui/AdminBreadcrumb';
import type { Product } from '../../data/products';
import { adminService } from '../../services/adminService';
import { DEFAULT_FALLBACK_IMAGE, normalizeImageUrl, getProductImage } from '../../utils/imageUtils';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await adminService.getProductById(id);
        const found = (res as any)?.data || (res as any)?.product;
        if (found) {
          const primaryImg = getProductImage(found);
          const gallery = (found.images && found.images.length > 0) ? found.images.map(normalizeImageUrl) : [primaryImg];
          const mapped: Product = {
            id: found._id || found.id,
            name: found.name,
            sku: found.sku || `MON-${found._id?.slice(-5)}`,
            brand: found.brand || 'Monolith Sartorial',
            category: typeof found.category === 'object' ? found.category?.name : (found.category || 'Outerwear'),
            collection: typeof found.collection === 'object' ? found.collection?.name : (found.collection || 'Monolith Archive'),
            price: found.price || 0,
            compareAtPrice: found.compareAtPrice || found.price || 0,
            isSale: Boolean(found.isSale),
            stock: found.stock ?? 0,
            status: found.stock === 0 ? 'Out of Stock' : (found.isActive ? 'Published' : 'Draft'),
            image: primaryImg,
            gallery: gallery,
            description: found.description || '',
            material: found.material || '100% Virgin Cashmere',
            rating: found.rating || 5,
            reviewsCount: found.reviewsCount || 0,
            createdAt: found.createdAt || '2024-01-15',
          };
          setProduct(mapped);
          setSelectedImage(primaryImg);
        } else {
          setError('Product not found in database.');
        }
      } catch (err: any) {
        console.error('Fetch product details error:', err);
        setError(err?.message || 'Unable to load product details from MongoDB.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-label-md text-on-surface-variant">Loading product details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !product) {
    return (
      <AdminLayout>
        <div className="p-8 max-w-xl mx-auto text-center space-y-4">
          <p className="text-error font-medium">{error || 'Product not found.'}</p>
          <button
            onClick={() => navigate('/admin/products')}
            className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90"
          >
            ← Back to Products
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <AdminBreadcrumb
              items={[
                { label: 'Admin', path: '/admin/dashboard' },
                { label: 'Products', path: '/admin/products' },
                { label: product.name },
              ]}
            />
            <div className="flex items-center gap-3 mt-1">
              <h1 className="font-display text-headline-lg sm:text-display text-primary">
                {product.name}
              </h1>
              <AdminBadge variant={product.status === 'Published' ? 'success' : 'neutral'}>
                {product.status}
              </AdminBadge>
              {product.isSale && (
                <span className="text-xs px-2.5 py-1 bg-red-100 text-red-700 font-bold rounded-full">
                  Private Sale Vault
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AdminButton variant="outline" onClick={() => navigate('/admin/products')}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Catalog
            </AdminButton>
            <AdminButton
              leftIcon={<Edit className="w-4 h-4" />}
              onClick={() => navigate(`/admin/products/${product.id}/edit`)}
            >
              Edit Asset
            </AdminButton>
          </div>
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          <div className="bg-white border border-outline-variant rounded-xl p-space-md shadow-sm">
            <p className="text-xs text-on-surface-variant uppercase font-semibold tracking-wider">
              Acquisition Valuation
            </p>
            <p className="text-2xl font-bold text-primary mt-1 font-mono">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <p className="text-xs text-red-600 mt-1 font-medium">
                MRP: ₹{product.compareAtPrice.toLocaleString('en-IN')} (On Sale)
              </p>
            )}
          </div>

          <div className="bg-white border border-outline-variant rounded-xl p-space-md shadow-sm">
            <p className="text-xs text-on-surface-variant uppercase font-semibold tracking-wider">
              Total Units in Vault
            </p>
            <p className="text-2xl font-bold text-primary mt-1 font-mono">{product.stock} units</p>
            <p className="text-xs text-on-surface-variant mt-1">Safety threshold: 5 units</p>
          </div>

          <div className="bg-white border border-outline-variant rounded-xl p-space-md shadow-sm">
            <p className="text-xs text-on-surface-variant uppercase font-semibold tracking-wider">
              Lifetime Valuations
            </p>
            <p className="text-2xl font-bold text-primary mt-1 font-mono">
              ₹{(product.price * 14).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-emerald-600 mt-1 font-medium">14 customer acquisitions</p>
          </div>

          <div className="bg-white border border-outline-variant rounded-xl p-space-md shadow-sm">
            <p className="text-xs text-on-surface-variant uppercase font-semibold tracking-wider">
              Client Perspectives
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-primary">{product.rating || 5.0}</span>
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Based on {product.reviewsCount || 8} verified reviews
            </p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
          {/* Visual Gallery */}
          <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-4">
            <h3 className="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-2">
              Visual Presentation
            </h3>
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface-container border border-outline-variant">
              <img
                src={normalizeImageUrl(selectedImage)}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                }}
              />
            </div>

            {product.gallery && product.gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pt-2">
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 aspect-[3/4] rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                      selectedImage === img ? 'border-primary shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={normalizeImageUrl(img)}
                      alt="Thumb"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Specifications & Overview */}
          <div className="lg:col-span-2 space-y-space-lg">
            <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-4">
              <h3 className="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-2">
                Atelier Narrative & Specifications
              </h3>
              <p className="font-body-md text-on-surface leading-relaxed">{product.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-outline-variant text-xs">
                <div>
                  <span className="text-on-surface-variant uppercase font-bold block">SKU Code</span>
                  <span className="font-mono font-bold text-primary">{product.sku}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant uppercase font-bold block">Brand</span>
                  <span className="font-semibold text-primary">{product.brand}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant uppercase font-bold block">Category</span>
                  <span className="font-semibold text-primary">{product.category}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant uppercase font-bold block">Collection</span>
                  <span className="font-semibold text-primary">{product.collection}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant uppercase font-bold block">Material Composition</span>
                  <span className="font-semibold text-primary">{product.material || 'Virgin Cashmere'}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant uppercase font-bold block">Primary Vault Location</span>
                  <span className="font-semibold text-primary">Milan Central Facility</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductDetailsPage;
