import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { heroBannersData, HeroSlide } from '../../data/heroBanners';

interface HeroBannerProps {
  banners?: HeroSlide[];
  autoPlayInterval?: number; // In milliseconds (default 6000ms = 6s)
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  banners = heroBannersData,
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

  const scrollToNextSection = () => {
    const nextSection = document.getElementById('collections') || document.querySelector('section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeBanner = banners[currentSlide] || banners[0];

  return (
    <header
      className="relative h-screen w-full overflow-hidden flex items-center justify-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Banner Slides with Smooth Crossfade */}
      {banners.map((banner, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={banner.id}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Dark contrast gradient overlay */}
            <div className="absolute inset-0 bg-black/35 z-10"></div>
            <div
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-[7000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              style={{
                backgroundImage: `url('${banner.image}')`,
              }}
            ></div>
          </div>
        );
      })}

      {/* Hero Content Container */}
      <div className="relative z-20 text-center text-white px-margin-mobile md:px-0 max-w-4xl">
        <h1
          key={`title-${currentSlide}`}
          className="font-display-lg text-display-lg-mobile md:text-display-lg mb-6 editorial-reveal visible"
        >
          {activeBanner.title}
        </h1>
        <p
          key={`subtitle-${currentSlide}`}
          className="font-body-lg text-body-lg mb-10 max-w-2xl mx-auto editorial-reveal delay-100 visible text-white/90"
        >
          {activeBanner.subtitle}
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 editorial-reveal delay-200 visible">
          <Link
            className="w-full md:w-auto px-12 py-4 bg-white text-black font-button text-button uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-500 shadow-md cursor-pointer btn-hero-primary"
            to={activeBanner.primaryButtonLink}
          >
            {activeBanner.primaryButtonText}
          </Link>
          <Link
            className="w-full md:w-auto px-12 py-4 border border-white text-white font-button text-button uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500 cursor-pointer"
            to={activeBanner.secondaryButtonLink}
          >
            {activeBanner.secondaryButtonText}
          </Link>
        </div>
      </div>

      {/* Left Arrow Navigation */}
      {banners.length > 1 && (
        <button
          onClick={prevSlide}
          className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/20 hover:bg-black/60 text-white/70 hover:text-white backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-300 cursor-pointer focus:outline-none"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Right Arrow Navigation */}
      {banners.length > 1 && (
        <button
          onClick={nextSlide}
          className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/20 hover:bg-black/60 text-white/70 hover:text-white backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-300 cursor-pointer focus:outline-none"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Pagination Indicators / Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {banners.map((banner, index) => {
            const isActive = index === currentSlide;
            return (
              <button
                key={banner.id}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer focus:outline-none ${
                  isActive
                    ? 'w-10 bg-white shadow-sm'
                    : 'w-3 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          })}
        </div>
      )}

      {/* Scroll Down Indicator */}
      <button
        onClick={scrollToNextSection}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 animate-bounce cursor-pointer p-2 focus:outline-none text-white/80 hover:text-white transition-colors"
        aria-label="Scroll to collections"
      >
        <ChevronDown className="w-7 h-7" />
      </button>
    </header>
  );
};
