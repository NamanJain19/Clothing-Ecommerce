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
import { initialProducts, Product } from '../../data/products';
import { adminService } from '../../services/adminService';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fallbackProduct = initialProducts.find((p) => p.id === id) || initialProducts[0];
  const [product, setProduct] = useState<Product>(fallbackProduct);
  const [selectedImage, setSelectedImage] = useState<string>(fallbackProduct.image);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const res = await adminService.getProducts();
        const found = res.products?.find((p: any) => p._id === id || p.id === id);
        if (found) {
          const mapped: Product = {
            id: found._id || found.id,
            name: found.name,
            sku: found.sku || `MON-${found._id?.slice(-5)}`,
            brand: found.brand || 'Monolith Sartorial',
            category: found.category || 'Outerwear',
            collection: found.collection || 'Winter Solstice 2024',
            price: found.price || 0,
            compareAtPrice: found.compareAtPrice || found.price || 0,
            isSale: Boolean(found.isSale),
            stock: found.stock ?? 15,
            status: found.status || 'Published',
            image: found.images?.[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
            gallery: found.images || [],
            description: found.description || '',
            material: found.material || '100% Virgin Cashmere',
            rating: found.rating || 5,
            reviewsCount: found.reviewsCount || 12,
            createdAt: found.createdAt || '2024-01-15',
          };
          setProduct(mapped);
          setSelectedImage(mapped.image);
        }
      } catch (err) {
        console.warn('Using local fallback for product details:', err);
      }
    };
    fetchProduct();
  }, [id]);

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
              <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
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
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
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
