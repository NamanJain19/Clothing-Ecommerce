import React from 'react';
import { Link } from 'react-router-dom';

export const BrandStorySection: React.FC = () => {
  return (
    <section className="py-section-gap border-t border-outline/10" id="brand-story">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-12 items-center gap-0 bg-white shadow-xl">
        <div className="col-span-1 md:col-span-6 h-[700px] overflow-hidden">
          <img
            alt="The Architecture of Identity"
            className="w-full h-full object-cover grayscale"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcXoIfvy-TfCWCc5Cj_m4dGA98RMoinP9cJFMukEo7t2DzyVTeW575p2G9YrM_rBMC_ozV9O5paz8CQ7mLeylIFsDVDNJtWcc1rjcPPJLq7X7w4GkWistVnumVDmux36ObtYLJ2aN-D_JnVnYAy_5xn0Pe9WV03dG4RFeCVjTWah-CXI9U_J5Du77z7Jy9AbevHr-AmD_iJaw14lwZiNrPg5EMGcYUks0-szv0gyiZgKe49dlPeT85Vg"
          />
        </div>
        <div className="col-span-1 md:col-span-6 px-8 md:px-24 py-20 flex flex-col items-start justify-center">
          <span className="font-label-caps text-[10px] tracking-[0.5em] uppercase text-secondary mb-10 block">
            Since MCMXCIV
          </span>
          <h2 className="font-display-lg text-3xl md:text-headline-lg mb-8 leading-tight">
            The Architecture of Identity
          </h2>
          <p className="font-body-lg text-body-lg text-secondary mb-12 leading-relaxed">
            Born from a vision of absolute purity, Monolith was founded on the belief that clothing is the ultimate architecture for the soul. We reject the fleeting trends of the season in favor of enduring structural integrity and the world's most refined natural fibers.
          </p>
          <Link
            className="px-12 py-5 bg-black text-white font-button text-[12px] uppercase tracking-[0.2em] hover:bg-secondary transition-all duration-300"
            to="/about-us"
          >
            Our Philosophy
          </Link>
        </div>
      </div>
    </section>
  );
};
