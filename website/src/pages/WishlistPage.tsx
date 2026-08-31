import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { CategoryProductCard } from '../components/category/CategoryProductCard';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { QuickViewModal } from '../components/ui/QuickViewModal';
import { FilterDrawer } from '../components/ui/FilterDrawer';
import { recentlyViewedItems } from '../data/wishlistData';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { ChevronDown, Heart } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { wishlistItems: wishlist, clearWishlist, removeFromWishlist } = useWishlist();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      clearWishlist();
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeFromWishlist(productId);
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md antialiased selection:bg-primary selection:text-on-primary">
      {/* Shared Master Navbar */}
      <Navbar />

      <main className="mt-20 pt-8 pb-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Wishlist' },
            ]}
          />

          {/* Wishlist Header */}
          <header className="py-8">
            <div className="flex flex-col gap-4">
              <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg">
                Wishlist
              </h1>
              <p className="font-body-lg text-secondary max-w-xl">
                Save your favorite pieces and shop them anytime.
              </p>
            </div>

            {/* Action Bar */}
            <div className="mt-12 flex flex-col md:flex-row justify-between items-end md:items-center border-b border-outline-variant pb-6 gap-6">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">
                {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'} Saved
              </span>
              {wishlist.length > 0 && (
                <div className="flex items-center gap-8">
                  <button className="font-label-caps text-label-caps flex items-center gap-2 uppercase tracking-widest text-primary hover:opacity-70 transition-opacity cursor-pointer">
                    Sort By <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleClearWishlist}
                    className="font-label-caps text-label-caps uppercase tracking-widest text-secondary hover:text-primary transition-colors cursor-pointer"
                  >
                    Clear Wishlist
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Wishlist Grid OR Empty State */}
          {wishlist.length > 0 ? (
            <section className="my-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {wishlist.map((product) => (
                  <div key={product.id} className="relative group">
                    <CategoryProductCard
                      product={{
                        id: product.id,
                        name: product.name,
                        specs: product.specs || product.category || 'MONOLITH COLLECTION',
                        price: product.price,
                        image: product.image,
                        hoverImage: product.hoverImage || product.image,
                      }}
                      onQuickView={handleQuickView}
                    />
                    <button
                      onClick={() => handleRemoveItem(product.id)}
                      className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-primary shadow-sm hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
                      title="Remove from Wishlist"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="py-section-gap my-8 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center mb-6">
                <Heart className="w-10 h-10 text-secondary" />
              </div>
              <h2 className="font-headline-lg text-3xl mb-4">Your Wishlist is Empty</h2>
              <p className="font-body-lg text-secondary mb-8 max-w-md">
                Discover our latest collections and find something you love.
              </p>
              <a
                href="/collections"
                className="bg-primary text-on-primary px-12 py-4 font-button text-button uppercase tracking-widest hover:bg-black/80 transition-colors"
              >
                Continue Shopping
              </a>
            </section>
          )}
        </div>

        {/* Recently Viewed Carousel Section */}
        <section className="bg-surface-container-low py-section-gap mt-section-gap px-margin-mobile md:px-margin-desktop overflow-hidden">
          <div className="max-w-container-max mx-auto">
            <h2 className="font-headline-lg text-3xl md:text-4xl mb-12">Recently Viewed</h2>
            <div className="flex gap-8 overflow-x-auto hide-scrollbar pb-8">
              {recentlyViewedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="min-w-[280px] md:min-w-[340px] group cursor-pointer"
                >
                  <div className="aspect-[4/5] bg-white overflow-hidden border border-outline-variant relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 flex justify-between items-baseline">
                    <div>
                      <h3 className="font-label-caps text-label-caps uppercase">{item.name}</h3>
                      <p className="font-label-caps text-[10px] text-secondary mt-1">{item.specs}</p>
                    </div>
                    <span className="font-label-caps text-label-caps">₹{item.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* You May Also Like Section */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <h2 className="font-headline-lg text-3xl md:text-4xl mb-12 text-center">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 group relative overflow-hidden min-h-[480px] border border-outline-variant bg-black">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-EPqxQerVjTwX4Z91pKWuL2MdnfG7MP4ACCJYK_LaFlmBXCajZ5CAx9eohL93zzSozoR2Gyzqa1Ux4BdREFieEpp8SbPBgWepoRojvNk7tmhJtj8ZOQONRxWeDIOfQChpVoR96mKUEU6yXfA9psFgSYCxPVWAdFLqPtHpaaiwCJk-NJo7udUFQlfUrQVIgs3_K4v6_dpCsc2ZX_OqJ_RTj5mmRgT5IhQuxAMQoJB3vpjZk3ZMtO17yQ"
                alt="Seasonal Edit"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10 text-white">
                <h3 className="font-headline-md text-3xl mb-2">The Seasonal Edit</h3>
                <p className="font-body-md text-sm text-white/80 mb-6 max-w-xs">
                  Explore our curated selection of timeless transition pieces.
                </p>
                <a
                  href="/collections"
                  className="font-label-caps text-[10px] uppercase tracking-widest underline underline-offset-8"
                >
                  Shop Collection
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-8 md:col-span-1">
              <div className="group min-h-[224px] bg-white border border-outline-variant relative overflow-hidden cursor-pointer">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_UYVLsGRRTYgrI1P4mkDFF6UxX2LNpHEOrUVIUJESgC76qoh1AYoGPBKRyBB53M_WuNCGyP6dhbdW311SJuLdcQL3YFj83oUfmNUlieDWJ-W4wpO3nc2JGvF0ojKAOAGJJpvBqtfXmfHyBnyHYHU7WDSNApjWnZl6IL4QRyjSSGrB0yiZqqOAvtZQdwhDANMX6a_mkhGsVycdQwc52JypvCtXc-fFGXWaEH9CRW5L2uCYLuIAtyTsoQ"
                  alt="Silver Ring"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="group min-h-[224px] bg-white border border-outline-variant relative overflow-hidden cursor-pointer">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbEYVRREgwJ3wy11DeXSPA2TgzDetYaLMyXp9qeDwXLmVbr6htlE7sHkpUACIcCf6Tk3wMIpRGxn5quBjCb7O28e2NmW_kpKeHW9TVoYMTy1UCoee0AA42qlE6cryJzO89i82Rvj_Fhq4L3eVq71Y-fFB66Bgr2oLDlfQqsIr2SEbz_5L-iJi1tpvfbbD1G9RNaDUZedYU0vqcQOBGlPjjpSseTNU3AaYL86sjcPVWlo5yH8G2zbCvFg"
                  alt="Pointed Mules"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="md:col-span-1 group relative min-h-[480px] border border-outline-variant overflow-hidden cursor-pointer">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA67_ik-4fd4s0o3mWsXvoBvZkJ7i9zBkvPGT0kHUc3bPX_tPcMpuCeYHs_QgECNY3qb-SOjFZT2iGyuJ4B126w2jbSIvJnH3rx0pC5NtSLsUjePOB56hUh6HZ1bFBV-KaH-2ZV2jPBNZhYlVxYp45PbnWYGlegyabBW1o1huXULkoUkQUAUfZeAy_fIVh-nSbXVDVOjgqOJGlBj3Ld4_ENnfBtMfKa_dBW8vkVnKcFzIrprkwU1PlPsg"
                alt="Leather Accessories"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="bg-white text-black px-6 py-2 font-label-caps text-[10px] uppercase tracking-widest">
                  View All
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Shared Master Newsletter */}
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <NewsletterSection />
        </div>
      </main>

      {/* Shared Master Footer */}
      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      {/* Filter Drawer */}
      <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
};

export default WishlistPage;
