import React from 'react';
import { ShieldCheck, Truck, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeaturedSaleBanner: React.FC = () => {
  return (
    <section className="my-section-gap">
      <div className="relative bg-neutral-950 text-white overflow-hidden p-8 md:p-16 border border-neutral-800">
        {/* Background Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-800/40 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Editorial Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-label-caps text-[10px] tracking-[0.4em] uppercase text-neutral-400">
                Privileged Access // Limited Edition
              </span>
            </div>

            <h2 className="font-headline-lg text-3xl md:text-4xl lg:text-5xl font-normal leading-tight">
              The Archive Protocol
            </h2>

            <p className="font-body-lg text-neutral-300 text-sm md:text-base max-w-xl leading-relaxed">
              Every archive piece represents an uncompromised balance of structural tailoring, pure cashmere, and liquid silk—curated in limited volume releases with complimentary insured express delivery.
            </p>

            {/* Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-neutral-800 text-xs">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-neutral-400 shrink-0" />
                <span className="font-label-caps text-[10px] uppercase tracking-wider text-neutral-300">
                  100% Certified Luxury
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-neutral-400 shrink-0" />
                <span className="font-label-caps text-[10px] uppercase tracking-wider text-neutral-300">
                  Insured Express Dispatch
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-neutral-400 shrink-0" />
                <span className="font-label-caps text-[10px] uppercase tracking-wider text-neutral-300">
                  Atelier Packaging
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/men"
                className="px-8 py-3.5 bg-white text-black font-button text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all cursor-pointer font-bold inline-flex items-center gap-2 shadow-md"
              >
                <span>Men's Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/women"
                className="px-8 py-3.5 border border-white text-white font-button text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer font-bold inline-flex items-center gap-2"
              >
                <span>Women's Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: High Fashion Visual Spotlight */}
          <div className="lg:col-span-5 relative aspect-[4/5] max-h-[380px] overflow-hidden border border-neutral-800 bg-neutral-900 group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN-TnRFVDOLJaqtD-5XxfuD79lZgYlhhdKuJ8vGewzhc-UQ195D8Gbv7QF18DjcNfPUAlsQ4n4NEzIBFN_THDtDhqxMiNh3tiGqLAoqaXJ35-LeN8tbUn1lCahjtP-le6FHDlvM7YfsabQy4iAyhYjWCJ6hN2Wn5c-ICf9epQgRGp9uJqvSk1r81O5FQJZ7L9FdPoJ4b9bnA1isqKnU9esufqSD41cPAaJFujs8C8zDQSM5gA1Q1BayA"
              alt="Archival Spotlight"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-4 border border-neutral-700/80 flex justify-between items-center">
              <div>
                <span className="font-label-caps text-[9px] text-neutral-400 uppercase tracking-widest block">
                  Archival Vault Drop
                </span>
                <p className="font-headline-md text-sm font-normal text-white">
                  Limited Volume Reductions
                </p>
              </div>
              <span className="font-label-caps text-xs text-emerald-400 font-bold font-mono">
                UP TO 50% OFF
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSaleBanner;
