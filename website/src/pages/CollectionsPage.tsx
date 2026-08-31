import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { CollectionsHero } from '../components/collections/CollectionsHero';
import { CollectionsFilter, CollectionFilterCategory } from '../components/collections/CollectionsFilter';
import { CollectionsGridCard } from '../components/collections/CollectionsGridCard';
import { FeaturedCollectionBanner } from '../components/collections/FeaturedCollectionBanner';
import { TrendingCollectionsSection } from '../components/collections/TrendingCollectionsSection';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { collectionsGridData } from '../data/collectionsPage';
import { productService } from '../../src/services/productService';

export const CollectionsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CollectionFilterCategory>('All');
  const [collections, setCollections] = useState(collectionsGridData);

  useEffect(() => {
    let isMounted = true;
    const fetchCollections = async () => {
      try {
        const liveCollections = await productService.getCollections({ isActive: true });
        if (liveCollections && liveCollections.length > 0 && isMounted) {
          const mapped = collectionsGridData.map((fallbackCol) => {
            const match = liveCollections.find(
              (c) => c.name.toLowerCase().includes(fallbackCol.name.toLowerCase()) ||
                     fallbackCol.name.toLowerCase().includes(c.name.toLowerCase())
            );
            return match
              ? {
                  ...fallbackCol,
                  id: match._id || match.id || fallbackCol.id,
                  name: match.name,
                  description: match.description || fallbackCol.description,
                }
              : fallbackCol;
          });
          setCollections(mapped);
        }
      } catch (err) {
        console.warn('Failed to load collections from API, using fallback:', err);
      }
    };

    fetchCollections();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCollections = activeCategory === 'All'
    ? collections
    : collections.filter((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-background text-primary font-body-md antialiased selection:bg-primary-container selection:text-white">
      {/* Shared Master Navbar */}
      <Navbar />

      {/* Hero Banner (Medium Height) */}
      <CollectionsHero />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Collections' },
          ]}
        />

        {/* Collection Categories Filter */}
        <CollectionsFilter
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Collections Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredCollections.map((collection) => (
            <CollectionsGridCard key={collection.id} collection={collection} />
          ))}
        </section>

        {/* Featured Collection Banner */}
        <FeaturedCollectionBanner />

        {/* Trending Collections */}
        <TrendingCollectionsSection />

        {/* Shared Newsletter Section */}
        <NewsletterSection />
      </main>

      {/* Shared Master Footer */}
      <Footer />
    </div>
  );
};

export default CollectionsPage;
