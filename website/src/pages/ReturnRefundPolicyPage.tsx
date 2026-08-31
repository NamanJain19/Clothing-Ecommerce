import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { CheckCircle2, Mail, Phone, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export const ReturnRefundPolicyPage: React.FC = () => {
  const navigate = useNavigate();

  const sidebarLinks = [
    { id: 'eligibility', label: 'ELIGIBILITY' },
    { id: 'process', label: 'RETURN PROCESS' },
    { id: 'timeline', label: 'REFUND TIMELINE' },
    { id: 'exchanges', label: 'EXCHANGE POLICY' },
    { id: 'damaged', label: 'DAMAGED PRODUCTS' },
    { id: 'cancellation', label: 'CANCELLATIONS' },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md antialiased selection:bg-primary selection:text-white">
      {/* Shared Master Navbar */}
      <Navbar />

      <main className="pt-24 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Return & Refund Policy' },
          ]}
        />

        {/* Hero Header */}
        <header className="mb-16 max-w-3xl space-y-4">
          <p className="font-label-caps text-xs text-secondary uppercase tracking-[0.3em]">
            CUSTOMER CARE
          </p>
          <h1 className="font-headline-lg text-4xl md:text-6xl text-primary tracking-tight">
            Returns & Refunds
          </h1>
          <div className="w-16 h-0.5 bg-primary" />
        </header>

        {/* Content Layout: Sticky Sidebar + Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          {/* Sidebar Navigation (3 cols) */}
          <aside className="hidden md:block md:col-span-3">
            <nav className="sticky top-28 space-y-3">
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-secondary block mb-2 font-bold">
                NAVIGATION
              </span>
              <div className="flex flex-col gap-2 border-l border-outline-variant">
                {sidebarLinks.map((link) => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    className="pl-4 py-1.5 font-label-caps text-xs uppercase text-secondary hover:text-primary transition-colors hover:border-l-2 hover:border-primary -ml-[1px]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </nav>
          </aside>

          {/* Policy Main Sections (9 cols) */}
          <div className="md:col-span-9 space-y-20">
            {/* Return Eligibility */}
            <section id="eligibility" className="space-y-8 scroll-mt-28">
              <h2 className="font-headline-md text-3xl text-primary font-bold">Return Eligibility</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="font-body-lg text-secondary text-sm md:text-base leading-relaxed">
                    Our curation is meticulous, and we want your experience to be flawless. Items may be returned within 14 days of delivery provided they remain in their original condition.
                  </p>
                  <ul className="space-y-3 font-body-md text-xs text-primary font-medium">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span>Original security seals and designer tags must remain intact.</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span>Items must be unworn, unwashed, and completely unaltered.</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span>Original packaging, garment bags, and accessories must be included.</span>
                    </li>
                  </ul>
                </div>

                <div className="border border-outline-variant p-8 bg-surface-container-low space-y-4">
                  <h3 className="font-label-caps text-xs uppercase tracking-widest font-bold text-primary">
                    NON-RETURNABLE ITEMS
                  </h3>
                  <p className="font-body-md text-secondary text-xs italic">
                    For hygiene and exclusivity reasons, the following sales are final:
                  </p>
                  <ul className="space-y-2 font-label-caps text-[10px] text-secondary tracking-wider font-semibold">
                    <li>• INTIMATES & SWIMWEAR</li>
                    <li>• BESPOKE & CUSTOM ORDERS</li>
                    <li>• UNSEALED FRAGRANCES</li>
                    <li>• ARCHIVE SALE SELECTIONS</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Return Process */}
            <section id="process" className="space-y-8 scroll-mt-28">
              <h2 className="font-headline-md text-3xl text-primary font-bold">The Return Process</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border border-outline-variant bg-white space-y-3 hover:border-primary transition-all shadow-sm">
                  <span className="font-headline-md text-3xl text-secondary opacity-40 font-mono">01</span>
                  <h4 className="font-label-caps text-xs uppercase font-bold text-primary">INITIATE</h4>
                  <p className="font-body-md text-secondary text-xs leading-relaxed">
                    Access your account portal under <span className="text-primary font-bold">My Orders</span> and select items to generate a Return Authorization Number (RAN).
                  </p>
                </div>

                <div className="p-6 border border-outline-variant bg-white space-y-3 hover:border-primary transition-all shadow-sm">
                  <span className="font-headline-md text-3xl text-secondary opacity-40 font-mono">02</span>
                  <h4 className="font-label-caps text-xs uppercase font-bold text-primary">PACKAGE</h4>
                  <p className="font-body-md text-secondary text-xs leading-relaxed">
                    Secure items in the original shipping box. Affix the provided pre-paid DHL Express label to the exterior.
                  </p>
                </div>

                <div className="p-6 border border-outline-variant bg-white space-y-3 hover:border-primary transition-all shadow-sm">
                  <span className="font-headline-md text-3xl text-secondary opacity-40 font-mono">03</span>
                  <h4 className="font-label-caps text-xs uppercase font-bold text-primary">DISPATCH</h4>
                  <p className="font-body-md text-secondary text-xs leading-relaxed">
                    Schedule a complimentary pickup or drop off at any authorized concierge collection point.
                  </p>
                </div>
              </div>
            </section>

            {/* Refund Timeline */}
            <section id="timeline" className="space-y-8 scroll-mt-28">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <h2 className="font-headline-md text-3xl text-primary font-bold">Refund Timeline</h2>
                  <p className="font-body-lg text-secondary text-xs md:text-sm leading-relaxed">
                    Quality inspection occurs within 48 hours of receipt at our atelier. Once approved, refunds are initiated immediately to your original payment method.
                  </p>
                  <div className="space-y-3 border-t border-outline-variant pt-4 text-xs font-body-md">
                    <div className="flex justify-between border-b border-outline-variant/60 pb-2">
                      <span className="font-label-caps uppercase text-secondary">ATELIER INSPECTION</span>
                      <span className="font-bold text-primary">1–2 Business Days</span>
                    </div>
                    <div className="flex justify-between border-b border-outline-variant/60 pb-2">
                      <span className="font-label-caps uppercase text-secondary">PROCESSING</span>
                      <span className="font-bold text-primary">2–3 Business Days</span>
                    </div>
                    <div className="flex justify-between border-b border-outline-variant/60 pb-2">
                      <span className="font-label-caps uppercase text-secondary">BANK CLEARANCE</span>
                      <span className="font-bold text-primary">5–10 Business Days</span>
                    </div>
                  </div>
                </div>

                <div className="aspect-square border border-outline-variant overflow-hidden bg-surface-container">
                  <img
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"
                    alt="Monolith Studio Inspection"
                    className="w-full h-full object-cover filter grayscale contrast-125"
                  />
                </div>
              </div>
            </section>

            {/* Exchange & Damaged Policy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section id="exchanges" className="p-8 bg-primary text-white space-y-4 scroll-mt-28 shadow-md">
                <h2 className="font-headline-md text-2xl font-bold">Exchange Policy</h2>
                <p className="font-body-md text-white/80 text-xs leading-relaxed">
                  Prefer a different size or shade? We offer seamless exchanges within the 14-day window. Contact our concierge for immediate inventory reservation.
                </p>
                <button
                  onClick={() => navigate('/collections')}
                  className="border border-white text-white px-6 py-3 font-button text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer font-semibold"
                >
                  RESERVE SIZE
                </button>
              </section>

              <section id="damaged" className="p-8 border border-primary bg-white space-y-4 scroll-mt-28 shadow-sm">
                <h2 className="font-headline-md text-2xl text-primary font-bold">Damaged Products</h2>
                <p className="font-body-md text-secondary text-xs leading-relaxed">
                  In the rare event of a transit-related defect, please notify us within 24 hours of delivery. We will arrange an immediate priority replacement.
                </p>
                <a
                  href="mailto:claim@monolithluxury.com"
                  className="font-label-caps text-xs uppercase text-primary underline font-bold tracking-widest block"
                >
                  CLAIM@MONOLITHLUXURY.COM
                </a>
              </section>
            </div>

            {/* Order Cancellation */}
            <section id="cancellation" className="pt-8 border-t border-outline-variant space-y-3 scroll-mt-28">
              <h2 className="font-headline-md text-2xl text-primary font-bold">Order Cancellation</h2>
              <p className="font-body-md text-secondary text-xs md:text-sm leading-relaxed">
                Orders may be cancelled within 60 minutes of placement. After this window, the logistics cycle is initiated and the standard return process must be followed.
              </p>
              <p className="font-body-md text-secondary text-xs italic">
                Note: Priority shipping orders move immediately to fulfillment and cannot be cancelled.
              </p>
            </section>
          </div>
        </div>

        {/* Dedicated Support Floating Banner */}
        <section className="relative h-96 overflow-hidden mb-24 border border-outline-variant">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1600&q=80"
            alt="Monolith Dedicated Concierge"
            className="w-full h-full object-cover filter grayscale contrast-125 brightness-90"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6 text-center text-white">
            <div className="bg-white/95 text-primary p-8 border border-outline-variant max-w-md space-y-4 shadow-2xl">
              <h3 className="font-headline-md text-2xl font-bold">Dedicated Support</h3>
              <p className="font-body-md text-secondary text-xs leading-relaxed">
                Our concierge team is available 24/7 for bespoke assistance regarding your return.
              </p>
              <div className="space-y-1 pt-2 text-xs font-label-caps uppercase tracking-widest font-bold">
                <a href="mailto:concierge@monolithluxury.com" className="block text-primary underline">
                  CONCIERGE@MONOLITHLUXURY.COM
                </a>
                <p className="text-secondary">+1 (800) MONO-LITH</p>
              </div>
            </div>
          </div>
        </section>

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

export default ReturnRefundPolicyPage;
