import React, { useState, useEffect, useCallback } from 'react';
import { categoryBannersData, CategorySlide } from '../../data/categoryBanners';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MenHeroBannerProps {
  banners?: CategorySlide[];
  autoPlayInterval?: number;
}

export const MenHeroBanner: React.FC<MenHeroBannerProps> = ({
  banners = categoryBannersData.men,
  autoPlayInterval = 6000,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (isPaused || banners.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide, autoPlayInterval, banners.length]);

  const activeBanner = banners[currentSlide] || banners[0];

  return (
    <header
      className="relative h-[50vh] min-h-[420px] max-h-[480px] w-full overflow-hidden bg-surface-container select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Banner Slides */}
      {banners.map((banner, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={banner.id}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <div
              className={`w-full h-full bg-cover bg-center transition-transform duration-[7000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              style={{
                backgroundImage: `url('${banner.image}')`,
              }}
            ></div>
          </div>
        );
      })}

      {/* Hero Content - Persistent Title with dynamic background slides */}
      <div className="relative z-20 h-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col justify-center">
        <div className="max-w-2xl text-white">
          <span className="font-label-caps text-[11px] uppercase tracking-[0.3em] mb-3 text-white/80 block">
            Signature Tailoring
          </span>
          <h1 className="font-display-lg text-[44px] md:text-display-lg text-white mb-2 leading-tight">
            Men's Collection
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-xl text-sm md:text-base leading-relaxed">
            A definitive collection of architectural silhouettes, artisanal fabrics, and precision tailoring.
          </p>
        </div>
      </div>

      {/* Left/Right Controls */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-300 cursor-pointer"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-300 cursor-pointer"
            aria-label="Next banner"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Pagination Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
          {banners.map((banner, index) => {
            const isActive = index === currentSlide;
            return (
              <button
                key={banner.id}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer ${
                  isActive ? 'w-8 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            );
          })}
        </div>
      )}
    </header>
  );
};
