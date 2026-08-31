import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { CheckCircle2, ArrowRight, Truck, Globe, PackageCheck, AlertCircle, ShieldAlert } from 'lucide-react';

export const ShippingPolicyPage: React.FC = () => {
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    navigate('/track-order');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md antialiased selection:bg-primary selection:text-white">
      {/* Shared Master Navbar */}
      <Navbar />

      <main className="pt-24 pb-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Shipping Policy' },
            ]}
          />

          {/* Hero Section */}
          <header className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 border border-outline-variant overflow-hidden aspect-[16/9] bg-surface-container">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
                alt="Monolith High Fashion Logistics Warehouse"
                className="w-full h-full object-cover filter grayscale contrast-125 brightness-95"
              />
            </div>
            <div className="md:col-span-5 space-y-4">
              <p className="font-label-caps text-xs text-secondary uppercase tracking-[0.3em]">
                GLOBAL SARTORIAL DELIVERY
              </p>
              <h1 className="font-headline-lg text-4xl md:text-5xl text-primary tracking-tight">
                Shipping & Logistics
              </h1>
              <p className="font-body-lg text-secondary text-sm md:text-base leading-relaxed">
                A commitment to precision, speed, and transparency. MONOLITH ensures your curated pieces arrive with the exact care and discretion with which they were crafted.
              </p>
            </div>
          </header>
        </div>

        {/* Sticky Minimalist Sub-Navigation Bar */}
        <nav className="sticky top-20 z-40 bg-white/90 backdrop-blur-md border-y border-outline-variant mb-16">
          <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex gap-8 py-3.5 overflow-x-auto no-scrollbar text-xs font-label-caps uppercase tracking-widest">
            <a href="#methods" className="text-secondary hover:text-primary transition-colors">
              Shipping Methods
            </a>
            <a href="#processing" className="text-secondary hover:text-primary transition-colors">
              Order Processing
            </a>
            <a href="#international" className="text-secondary hover:text-primary transition-colors">
              International
            </a>
            <a href="#tracking" className="text-secondary hover:text-primary transition-colors">
              Tracking
            </a>
            <a href="#delays" className="text-secondary hover:text-primary transition-colors">
              Delays & Claims
            </a>
          </div>
        </nav>

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-24">
          {/* 01. Shipping Methods & Times */}
          <section id="methods" className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4 space-y-3">
              <h2 className="font-headline-md text-2xl text-primary font-bold">01. Shipping Methods & Times</h2>
              <p className="font-body-md text-secondary text-xs leading-relaxed">
                We offer a range of delivery options tailored to your urgency and location. Each method is handled by our premium global logistics partners.
              </p>
            </div>
            <div className="md:col-span-8 bg-white border border-outline-variant divide-y divide-outline-variant">
              <div className="p-6 flex justify-between items-center hover:bg-surface-container-low transition-colors">
                <div>
                  <h3 className="font-label-caps text-xs uppercase font-bold text-primary mb-1">
                    Standard Boutique Delivery
                  </h3>
                  <p className="font-body-md text-secondary text-xs">3–5 Business Days</p>
                </div>
                <span className="font-label-caps text-xs uppercase tracking-widest font-bold text-primary">
                  Complimentary
                </span>
              </div>

              <div className="p-6 flex justify-between items-center hover:bg-surface-container-low transition-colors">
                <div>
                  <h3 className="font-label-caps text-xs uppercase font-bold text-primary mb-1">
                    Priority Express
                  </h3>
                  <p className="font-body-md text-secondary text-xs">1–2 Business Days</p>
                </div>
                <span className="font-label-caps text-xs uppercase tracking-widest font-bold text-primary">
                  $35.00 USD
                </span>
              </div>

              <div className="p-6 flex justify-between items-center hover:bg-surface-container-low transition-colors">
                <div>
                  <h3 className="font-label-caps text-xs uppercase font-bold text-primary mb-1">
                    Same Day Courier (NYC & London)
                  </h3>
                  <p className="font-body-md text-secondary text-xs">Orders placed before 10:00 AM EST</p>
                </div>
                <span className="font-label-caps text-xs uppercase tracking-widest font-bold text-primary">
                  $50.00 USD
                </span>
              </div>
            </div>
          </section>

          {/* 02. Order Processing */}
          <section id="processing" className="bg-surface-container-low p-8 md:p-12 border border-outline-variant grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-6 space-y-6">
              <h2 className="font-headline-md text-2xl text-primary font-bold">02. Order Processing</h2>
              <p className="font-body-md text-secondary text-xs leading-relaxed">
                Every MONOLITH order undergoes a meticulous quality inspection and archival packaging process before dispatch. Our dedication to perfection ensures your item arrives in pristine condition.
              </p>
              <ul className="space-y-3 font-body-md text-xs text-secondary">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>Orders are processed Monday through Friday, excluding public holidays.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>Typical studio handling time is 24–48 hours from order confirmation.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>Pre-order items will ship as soon as stock becomes available in our studio.</span>
                </li>
              </ul>
            </div>
            <div className="md:col-span-6 border border-outline-variant overflow-hidden aspect-square bg-white">
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80"
                alt="Monolith Archival White Glove Packaging"
                className="w-full h-full object-cover filter grayscale contrast-125"
              />
            </div>
          </section>

          {/* 03. International Shipping */}
          <section id="international" className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4 space-y-3">
              <h2 className="font-headline-md text-2xl text-primary font-bold">03. Global Logistics</h2>
              <p className="font-body-md text-secondary text-xs leading-relaxed">
                We partner with DHL Express and FedEx Global to ship to over 50 countries worldwide.
              </p>
            </div>
            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 border border-outline-variant space-y-2">
                <h4 className="font-label-caps text-xs uppercase font-bold text-primary">Customs & Duties (DDP vs DDU)</h4>
                <p className="font-body-md text-secondary text-xs leading-relaxed">
                  For major international destinations, import taxes and customs duties are calculated and prepaid at checkout (DDP). For DDU destinations, duties will be payable upon arrival.
                </p>
              </div>
              <div className="bg-white p-6 border border-outline-variant space-y-2">
                <h4 className="font-label-caps text-xs uppercase font-bold text-primary">Transit Timelines</h4>
                <p className="font-body-md text-secondary text-xs leading-relaxed">
                  International express shipments typically take 4–8 business days depending on customs processing in your destination country.
                </p>
              </div>
            </div>
          </section>

          {/* 04. Order Tracking */}
          <section id="tracking" className="bg-white p-8 md:p-12 border border-outline-variant text-center space-y-6">
            <h2 className="font-headline-md text-2xl text-primary font-bold">04. Real-Time Tracking</h2>
            <p className="font-body-md text-secondary text-xs max-w-xl mx-auto leading-relaxed">
              Maintain full visibility of your shipment from our atelier to your doorstep. Enter your order number below to check live status.
            </p>
            <form onSubmit={handleTrackSubmit} className="max-w-md mx-auto flex gap-4">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="ORDER NUMBER (e.g. MON-9821)"
                className="flex-1 border-0 border-b border-primary py-2 bg-transparent text-xs font-mono focus:border-primary uppercase"
              />
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2.5 font-button text-xs uppercase tracking-widest hover:bg-black/90 cursor-pointer shadow-sm flex items-center gap-2"
              >
                Track <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </section>

          {/* 05. Delays & Claims */}
          <section id="delays" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 border border-outline-variant space-y-4">
              <h3 className="font-label-caps text-xs uppercase font-bold text-primary flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-primary" /> Delivery Delays
              </h3>
              <p className="font-body-md text-secondary text-xs leading-relaxed">
                While we strive for absolute punctuality, occasional delays due to weather, carrier volume, or customs clearance may occur. In such instances, our concierge team will notify you immediately.
              </p>
              <button
                onClick={() => navigate('/contact-us')}
                className="font-label-caps text-xs uppercase border-b border-primary pb-1 font-bold text-primary hover:opacity-60 cursor-pointer"
              >
                CONTACT CONCIERGE
              </button>
            </div>

            <div className="bg-white p-8 border border-outline-variant space-y-4">
              <h3 className="font-label-caps text-xs uppercase font-bold text-primary flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-primary" /> Lost Packages & Claims
              </h3>
              <p className="font-body-md text-secondary text-xs leading-relaxed">
                All MONOLITH shipments are fully insured. If your package is lost or arrives damaged, please report it to us within 48 hours of the scheduled delivery date for a priority investigation.
              </p>
              <button
                onClick={() => navigate('/help-support')}
                className="font-label-caps text-xs uppercase border-b border-primary pb-1 font-bold text-primary hover:opacity-60 cursor-pointer"
              >
                FILE A CLAIM
              </button>
            </div>
          </section>

          {/* Final Concierge CTA */}
          <section className="text-center space-y-4 py-8">
            <p className="font-label-caps text-xs uppercase tracking-widest text-secondary">
              FURTHER ASSISTANCE
            </p>
            <h2 className="font-headline-lg text-3xl text-primary italic">Need immediate help with your shipment?</h2>
            <button
              onClick={() => navigate('/contact-us')}
              className="bg-primary text-white font-button text-xs uppercase tracking-widest px-10 py-4 hover:bg-black/90 transition-all cursor-pointer shadow-md font-semibold"
            >
              Contact Support
            </button>
          </section>

          {/* Shared Master Newsletter */}
          <NewsletterSection />
        </div>
      </main>

      {/* Shared Master Footer */}
      <Footer />
    </div>
  );
};

export default ShippingPolicyPage;
