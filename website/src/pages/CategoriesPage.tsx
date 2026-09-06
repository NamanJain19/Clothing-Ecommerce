import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { CategoriesHero } from '../components/categories/CategoriesHero';
import { CategoryVolumeCard } from '../components/categories/CategoryVolumeCard';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { categoriesPageData } from '../data/categoriesPage';

export const CategoriesPage: React.FC = () => {
  const categories = categoriesPageData;

  return (
    <div className="min-h-screen bg-background text-primary font-body-md antialiased selection:bg-primary-container selection:text-white">
      {/* Shared Master Navbar */}
      <Navbar />

      {/* Categories Hero Banner */}
      <CategoriesHero />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Categories' },
          ]}
        />

        {/* Section Header */}
        <section className="mb-12 border-b border-outline-variant pb-6 flex flex-col md:flex-row justify-between items-baseline gap-4">
          <div>
            <span className="font-label-caps text-[10px] tracking-[0.4em] uppercase text-secondary mb-2 block">
              Departmental Overview
            </span>
            <h2 className="font-display-lg text-4xl">The Master Volumes</h2>
          </div>
          <div className="font-label-caps text-label-caps text-secondary italic">
            {categories.length} DEPARTMENTS AVAILABLE
          </div>
        </section>

        {/* Categories Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-section-gap">
          {categories.map((category) => (
            <CategoryVolumeCard key={category.id} category={category} />
          ))}
        </section>

        {/* Featured Philosophy Section */}
        <section className="bg-black text-white p-12 md:p-20 mb-section-gap relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="font-label-caps text-[10px] tracking-[0.5em] uppercase text-white/60 mb-6 block">
              The Triptych Philosophy
            </span>
            <h2 className="font-display-lg text-4xl md:text-5xl italic mb-6 leading-tight">
              Identity in Three Acts
            </h2>
            <p className="font-body-lg text-white/80 mb-10 leading-relaxed">
              Every department is meticulously structured as an editorial volume, harmonizing form, function, and texture into a cohesive architectural wardrobe.
            </p>
            <div className="flex flex-wrap gap-6">
              <a
                href="/women"
                className="px-8 py-4 bg-white text-black font-button text-[11px] uppercase tracking-widest hover:bg-black hover:text-white border border-white transition-all duration-300"
              >
                Explore Women
              </a>
              <a
                href="/men"
                className="px-8 py-4 border border-white text-white font-button text-[11px] uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
              >
                Explore Men
              </a>
            </div>
          </div>
        </section>

        {/* Shared Newsletter Section */}
        <NewsletterSection />
      </main>

      {/* Shared Master Footer */}
      <Footer />
    </div>
  );
};

export default CategoriesPage;
