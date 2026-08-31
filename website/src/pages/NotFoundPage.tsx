import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md antialiased selection:bg-primary selection:text-white flex flex-col justify-between">
      {/* Shared Master Navbar */}
      <Navbar />

      <main className="pt-24 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex-1 flex flex-col justify-center">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: '404 Page Not Found' },
          ]}
        />

        {/* 404 Hero Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center my-12">
          {/* Left Column: Abstract Editorial Photography */}
          <div className="md:col-span-7 border border-outline-variant overflow-hidden aspect-[4/5] bg-surface-container shadow-sm group">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80"
              alt="Monolith Architectural Minimalist Shadow"
              className="w-full h-full object-cover filter grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Right Column: 404 Error Content */}
          <div className="md:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="font-label-caps text-xs text-secondary uppercase tracking-[0.3em] font-bold">
                ERROR CODE
              </span>
              <h1 className="font-display-lg text-7xl md:text-[110px] text-primary tracking-tighter leading-none font-bold">
                404
              </h1>
              <div className="w-16 h-0.5 bg-primary mt-2" />
            </div>

            <div className="space-y-3">
              <h2 className="font-headline-md text-2xl md:text-3xl text-primary font-bold">
                Oops! The page you're looking for doesn't exist.
              </h2>
              <p className="font-body-lg text-secondary text-xs md:text-sm leading-relaxed max-w-md">
                The collection has moved or the link is broken. Let us guide you back to the curated path.
              </p>
            </div>

            {/* Action Triggers */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => navigate('/')}
                className="bg-primary text-white px-8 py-4 font-button text-xs uppercase tracking-widest hover:bg-black/90 transition-all cursor-pointer shadow-md font-semibold flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </button>
              <button
                onClick={() => navigate('/collections')}
                className="border border-primary text-primary px-8 py-4 font-button text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all cursor-pointer font-semibold flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Explore Collections
              </button>
            </div>
          </div>
        </div>

        {/* Shared Master Newsletter */}
        <div className="mt-section-gap">
          <NewsletterSection />
        </div>
      </main>

      {/* Shared Master Footer */}
      <Footer />
    </div>
  );
};

export default NotFoundPage;
