import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { HeroBanner } from '../components/home/HeroBanner';
import { EditorialCollections } from '../components/home/EditorialCollections';
import { NewArrivalsSection } from '../components/home/NewArrivalsSection';
import { CategoryTriptychSection } from '../components/home/CategoryTriptychSection';
import { AccessoriesSection } from '../components/home/AccessoriesSection';
import { PrivateSaleSection } from '../components/home/PrivateSaleSection';
import { BrandStorySection } from '../components/home/BrandStorySection';
import { InstagramGallerySection } from '../components/home/InstagramGallerySection';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { Footer } from '../components/layout/Footer';
import { QuickViewModal } from '../components/ui/QuickViewModal';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md selection:bg-black selection:text-white">
      {/* Shared Navbar */}
      <Navbar />

      {/* Main Home Sections */}
      <main>
        <HeroBanner />
        <EditorialCollections />
        <NewArrivalsSection onQuickView={handleQuickView} />
        <CategoryTriptychSection />
        <AccessoriesSection />
        <PrivateSaleSection />
        <BrandStorySection />
        <InstagramGallerySection />
        <NewsletterSection />
      </main>

      {/* Shared Footer */}
      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal product={selectedProduct} onClose={handleCloseModal} />
    </div>
  );
};

export default HomePage;
