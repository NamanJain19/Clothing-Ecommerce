import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { SaleHeroBanner } from '../components/sale/SaleHeroBanner';
import { SaleFilterTabs, SaleFilterTab } from '../components/sale/SaleFilterTabs';
import { CategoryProductControls, SortOption } from '../components/category/CategoryProductControls';
import { CategoryProductCard } from '../components/category/CategoryProductCard';
import { FeaturedSaleBanner } from '../components/sale/FeaturedSaleBanner';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { QuickViewModal } from '../components/ui/QuickViewModal';
import { FilterDrawer } from '../components/ui/FilterDrawer';
import { saleItemsData } from '../data/saleItems';
import { productService, toUICategoryProduct } from '../services/productService';
import { Product } from '../types';

interface SaleProductItem {
  id: string;
  name: string;
  category?: string;
  discountPercentage: number;
  specs: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage: string;
}

export const SalePage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SaleFilterTab>('All');
  const [sort, setSort] = useState<SortOption>('newest');
  const [visibleCount, setVisibleCount] = useState(8);

  const [rawProducts, setRawProducts] = useState<SaleProductItem[]>(
    saleItemsData.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      discountPercentage: item.discountPercentage,
      specs: `${item.category || 'PRIVATE SALE'} // -${item.discountPercentage}%`,
      price: item.salePrice,
      originalPrice: item.originalPrice,
      image: item.image,
      hoverImage: item.hoverImage || item.image,
    }))
  );
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real sale products from backend
  useEffect(() => {
    let isMounted = true;
    const fetchSaleProducts = async () => {
      setIsLoading(true);
      try {
        const res = await productService.getProducts({
          isSale: true,
          sort: sort === 'price_asc' ? 'price_asc' : sort === 'price_desc' ? 'price_desc' : 'newest',
        });

        if (res.products && res.products.length > 0 && isMounted) {
          const mapped: SaleProductItem[] = res.products.map((bp) => {
            const uiProd = toUICategoryProduct(bp);
            const discountPct = bp.discountPercentage || (bp.compareAtPrice && bp.compareAtPrice > bp.price ? Math.round(((bp.compareAtPrice - bp.price) / bp.compareAtPrice) * 100) : 30);
            return {
              id: uiProd.id,
              name: uiProd.name,
              category: typeof bp.category === 'object' ? bp.category?.name : (bp.gender || 'Archive'),
              discountPercentage: discountPct,
              specs: uiProd.specs,
              price: uiProd.price,
              originalPrice: bp.compareAtPrice || Math.round(uiProd.price * 1.4),
              image: uiProd.image,
              hoverImage: uiProd.hoverImage || uiProd.image,
            };
          });
          setRawProducts(mapped);
        } else if (isMounted) {
          const fallback: SaleProductItem[] = saleItemsData.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            discountPercentage: item.discountPercentage,
            specs: `${item.category || 'PRIVATE SALE'} // -${item.discountPercentage}%`,
            price: item.salePrice,
            originalPrice: item.originalPrice,
            image: item.image,
            hoverImage: item.hoverImage || item.image,
          }));
          setRawProducts(fallback);
        }
      } catch (err) {
        console.warn('Failed to load sale products from API, using fallback:', err);
        if (isMounted) {
          const fallback: SaleProductItem[] = saleItemsData.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            discountPercentage: item.discountPercentage,
            specs: `${item.category || 'PRIVATE SALE'} // -${item.discountPercentage}%`,
            price: item.salePrice,
            originalPrice: item.originalPrice,
            image: item.image,
            hoverImage: item.hoverImage || item.image,
          }));
          setRawProducts(fallback);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchSaleProducts();
    return () => {
      isMounted = false;
    };
  }, [sort]);


  // Client-side filtering by Tab
  const filteredProducts = useMemo(() => {
    let result = [...rawProducts];

    if (activeTab === 'Men') {
      result = result.filter((p) => (p.category || '').toLowerCase().includes('men'));
    } else if (activeTab === 'Women') {
      result = result.filter((p) => (p.category || '').toLowerCase().includes('women'));
    } else if (activeTab === 'Accessories') {
      result = result.filter((p) => (p.category || '').toLowerCase().includes('acc'));
    } else if (activeTab === 'Outerwear') {
      result = result.filter(
        (p) =>
          (p.category || '').toLowerCase().includes('outerwear') ||
          p.name.toLowerCase().includes('coat') ||
          p.name.toLowerCase().includes('blazer') ||
          p.name.toLowerCase().includes('trench')
      );
    } else if (activeTab === '30%+ Off') {
      result = result.filter((p) => (p.discountPercentage || 0) >= 30);
    } else if (activeTab === '50% Off') {
      result = result.filter((p) => (p.discountPercentage || 0) >= 40);
    }

    // Sort result
    if (sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'discount_desc') {
      result.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
    }

    return result;
  }, [rawProducts, activeTab, sort]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  return (
    <div className="min-h-screen bg-background text-primary font-body-md antialiased selection:bg-primary-container selection:text-white">
      {/* Shared Master Navbar */}
      <Navbar />

      <main>
        {/* Dynamic Sale Hero Banner Carousel */}
        <SaleHeroBanner />

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8">
          {/* Breadcrumb Navigation */}
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Private Sale' },
            ]}
          />

          {/* Quick Department / Discount Filter Tabs */}
          <SaleFilterTabs activeTab={activeTab} onSelectTab={setActiveTab} />

          {/* Product Controls Bar (Filters & Sorting) */}
          <CategoryProductControls
            totalProducts={filteredProducts.length}
            onFilterClick={() => setIsFilterOpen(true)}
            sort={sort}
            onSortChange={setSort}
          />

          {/* Sale Product Grid */}
          <section className="mt-12">
            {isLoading ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="font-label-caps text-xs uppercase tracking-widest text-secondary">
                  Curating Private Archive Selections...
                </p>
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="py-24 text-center space-y-3 border border-outline-variant bg-surface-container-low p-12">
                <h3 className="font-headline-md text-xl text-primary font-normal">
                  No Archive Pieces Found in this Department
                </h3>
                <p className="font-body-md text-secondary text-sm">
                  Try selecting another tab or clearing your active filters.
                </p>
                <button
                  onClick={() => setActiveTab('All')}
                  className="mt-4 px-6 py-2.5 bg-primary text-white font-button text-xs uppercase tracking-widest cursor-pointer"
                >
                  View All Reductions
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {displayedProducts.map((product) => (
                  <CategoryProductCard
                    key={product.id}
                    product={product}
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>
            )}

            {/* Load More Section */}
            {filteredProducts.length > displayedProducts.length && (
              <div className="mt-section-gap flex flex-col items-center">
                <div className="w-64 h-[1px] bg-outline-variant mb-12"></div>
                <button
                  onClick={handleLoadMore}
                  className="font-label-caps text-label-caps px-12 py-4 border border-primary hover:bg-primary hover:text-white transition-all duration-300 uppercase cursor-pointer"
                >
                  LOAD MORE ({filteredProducts.length - displayedProducts.length} REMAINING)
                </button>
              </div>
            )}
          </section>

          {/* Featured Editorial Archival Banner */}
          <FeaturedSaleBanner />
        </div>

        {/* Shared Newsletter Section */}
        <NewsletterSection />
      </main>

      {/* Shared Master Footer */}
      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal product={selectedProduct} onClose={handleCloseModal} />

      {/* Filter Slide-out Drawer */}
      <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
};

export default SalePage;


