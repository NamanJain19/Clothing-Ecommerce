import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { CategoryProductCard } from '../components/category/CategoryProductCard';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { QuickViewModal } from '../components/ui/QuickViewModal';
import { FilterDrawer } from '../components/ui/FilterDrawer';
import { searchResultsData } from '../data/searchResultsData';
import { productService, toUICategoryProduct } from '../services/productService';
import { Product } from '../types';
import { Filter, ChevronDown, Search, Camera, Sparkles } from 'lucide-react';
import { VisualSearchModal } from '../components/common/VisualSearchModal';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || 'SILK';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [products, setProducts] = useState(searchResultsData);
  const [totalProducts, setTotalProducts] = useState(searchResultsData.length);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const delayDebounceFn = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setProducts([]);
        setTotalProducts(0);
        return;
      }

      setIsLoading(true);
      try {
        const res = await productService.getProducts({
          search: searchQuery.trim(),
        });

        if (res.products && res.products.length > 0 && isMounted) {
          const mapped = res.products.map((bp) => toUICategoryProduct(bp));
          setProducts(mapped);
          setTotalProducts(res.pagination?.total || mapped.length);
        } else if (isMounted) {
          // Local fallback filter if API yields 0
          const localFiltered = searchResultsData.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.specs.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setProducts(localFiltered);
          setTotalProducts(localFiltered.length);
        }
      } catch (err) {
        console.warn('API search failed, falling back to local dataset:', err);
        if (isMounted) {
          const localFiltered = searchResultsData.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.specs.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setProducts(localFiltered);
          setTotalProducts(localFiltered.length);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(delayDebounceFn);
      isMounted = false;
    };
  }, [searchQuery]);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md antialiased selection:bg-primary selection:text-on-primary">
      {/* Shared Master Navbar */}
      <Navbar />

      <main className="mt-20 pt-10 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Search' },
          ]}
        />

        {/* Header Section */}
        <section className="mb-16">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-2">
            Search Results
          </h1>
          <p className="font-body-lg text-body-lg text-secondary">
            "Discover curated essentials."
          </p>
        </section>

        {/* Search Controls Bar */}
        <section className="mb-12 border-b border-outline-variant pb-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-gutter">
            <div className="w-full md:w-1/2">
              <div className="relative group flex items-center">
                <input
                  className="w-full bg-transparent border-b border-primary py-4 pr-12 font-headline-md text-2xl sm:text-3xl focus:outline-none focus:ring-0 placeholder:text-surface-variant text-primary uppercase"
                  placeholder="Enter keyword..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setIsVisualSearchOpen(true)}
                  title="Search by Photo / AI Lens"
                  className="absolute right-2 bottom-4 p-2 text-amber-600 hover:text-neutral-900 transition-all rounded-full hover:bg-neutral-100 cursor-pointer flex items-center gap-1.5"
                >
                  <Camera className="w-5 h-5" />
                  <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                    AI Lens
                  </span>
                </button>
                <label className="absolute -top-6 left-0 font-label-caps text-label-caps text-outline uppercase tracking-widest">
                  Search Keyword
                </label>
              </div>
            </div>

            <div className="flex items-center gap-gutter w-full md:w-auto justify-between md:justify-end">
              <p className="font-label-caps text-label-caps text-secondary uppercase">
                RESULTS COUNT ({totalProducts})
              </p>
              <div className="flex gap-6">
                <button className="flex items-center gap-2 font-label-caps text-label-caps text-primary hover:opacity-70 transition-opacity cursor-pointer">
                  SORT BY <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="flex items-center gap-2 font-label-caps text-label-caps text-primary hover:opacity-70 transition-opacity cursor-pointer"
                >
                  FILTER <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Product Results Grid OR Loading / Empty State */}
        {isLoading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-label-caps text-xs uppercase tracking-widest text-secondary">
              Searching Archive Catalogue...
            </p>
          </div>
        ) : products.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-section-gap">
            {products.map((product) => (
              <CategoryProductCard
                key={product.id}
                product={product}
                onQuickView={handleQuickView}
              />
            ))}
          </section>
        ) : (
          <section className="py-24 text-center space-y-6">
            <Search className="w-12 h-12 text-outline mx-auto stroke-1" />
            <div className="space-y-2">
              <h3 className="font-headline-md text-2xl text-primary">No Results Found</h3>
              <p className="font-body-md text-secondary text-sm max-w-md mx-auto">
                We couldn't find any products matching "{searchQuery}". Try searching for cashmere, silk, coat, or blazer.
              </p>
            </div>
            <button
              onClick={() => setSearchQuery('CASHMERE')}
              className="px-8 py-3.5 border border-primary text-primary font-button text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all cursor-pointer"
            >
              Browse Cashmere Collection
            </button>
          </section>
        )}

        {/* Shared Master Newsletter */}
        <NewsletterSection />
      </main>

      {/* Shared Master Footer */}
      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal product={selectedProduct} onClose={handleCloseModal} />

      {/* Filter Slide-out Drawer */}
      <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

      {/* AI Visual Lens Image Search Modal */}
      <VisualSearchModal
        isOpen={isVisualSearchOpen}
        onClose={() => setIsVisualSearchOpen(false)}
      />
    </div>
  );
};

export default SearchPage;
