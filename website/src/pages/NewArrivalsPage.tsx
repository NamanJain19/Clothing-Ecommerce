import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { NewArrivalsHeroBanner } from '../components/new-arrivals/NewArrivalsHeroBanner';
import { CategoryProductControls, SortOption } from '../components/category/CategoryProductControls';
import { CategoryProductCard } from '../components/category/CategoryProductCard';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { QuickViewModal } from '../components/ui/QuickViewModal';
import { FilterDrawer } from '../components/ui/FilterDrawer';
import { newArrivalsPageProductsData } from '../data/newArrivalsPageProducts';
import { productService, toUICategoryProduct } from '../services/productService';
import { Product } from '../types';

export const NewArrivalsPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState(newArrivalsPageProductsData);
  const [totalProducts, setTotalProducts] = useState(newArrivalsPageProductsData.length);
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>('newest');

  useEffect(() => {
    let isMounted = true;
    const fetchNewArrivals = async () => {
      setIsLoading(true);
      try {
        const res = await productService.getProducts({
          isNewArrival: true,
          sort: sort === 'price_asc' ? 'price_asc' : sort === 'price_desc' ? 'price_desc' : 'newest',
        });

        if (res.products && res.products.length > 0 && isMounted) {
          const mapped = res.products.map((bp) => toUICategoryProduct(bp));
          setProducts(mapped);
          setTotalProducts(res.pagination?.total || mapped.length);
        } else if (isMounted) {
          setProducts(newArrivalsPageProductsData);
          setTotalProducts(newArrivalsPageProductsData.length);
        }
      } catch (err) {
        console.warn('Failed to load new arrivals from API, using fallback:', err);
        if (isMounted) {
          setProducts(newArrivalsPageProductsData);
          setTotalProducts(newArrivalsPageProductsData.length);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchNewArrivals();
    return () => {
      isMounted = false;
    };
  }, [sort]);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-background text-primary font-body-md antialiased selection:bg-primary selection:text-on-primary">
      {/* Shared Master Navbar */}
      <Navbar />

      <main>
        {/* New Arrivals Hero Banner */}
        <NewArrivalsHeroBanner />

        {/* Standardized Product Controls (Filters & Sorting) */}
        <CategoryProductControls
          totalProducts={totalProducts}
          onFilterClick={() => setIsFilterOpen(true)}
          sort={sort}
          onSortChange={setSort}
        />

        {/* Standardized New Arrivals Grid */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-12">
          {isLoading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-label-caps text-xs uppercase tracking-widest text-secondary">
                Curating New Arrivals...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-24 text-center space-y-3">
              <h3 className="font-headline-md text-xl text-primary">No Pieces Found</h3>
              <p className="font-body-md text-secondary text-sm">
                No new seasonal pieces are currently available.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((product) => (
                <CategoryProductCard
                  key={product.id}
                  product={product}
                  onQuickView={handleQuickView}
                />
              ))}
            </div>
          )}

          {/* Load More Button */}
          <div className="flex justify-center mt-24">
            <button className="px-16 py-4 border border-primary font-button text-button hover:bg-primary hover:text-white transition-all duration-500 uppercase cursor-pointer">
              Load More
            </button>
          </div>
        </section>

        {/* Shared Master Newsletter */}
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

export default NewArrivalsPage;
