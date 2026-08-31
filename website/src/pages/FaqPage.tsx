import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { Search, Plus, Minus, HelpCircle, MessageSquare, Mail, ArrowRight } from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'orders' | 'shipping' | 'returns' | 'sizing' | 'payments';
  question: string;
  answer: string;
}

export const FaqPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<string | null>('faq-1');

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'orders',
      question: 'How do I place an order for bespoke or limited-edition items?',
      answer:
        'Limited-edition pieces can be acquired directly through our online boutique while stock remains. For bespoke tailored creations, please contact our private client concierge to schedule a private fitting appointment.',
    },
    {
      id: 'faq-2',
      category: 'orders',
      question: 'Can I cancel or modify my order after placement?',
      answer:
        'Orders move into our studio preparation pipeline within 30–60 minutes. If you require a modification or cancellation, please reach out to our concierge immediately via live chat or telephone.',
    },
    {
      id: 'faq-3',
      category: 'shipping',
      question: 'Which countries does MONOLITH ship to?',
      answer:
        'We ship internationally to over 50 countries via express courier partners (DHL Express & FedEx Global). Complimentary standard shipping is included on all boutique orders.',
    },
    {
      id: 'faq-4',
      category: 'shipping',
      question: 'Are customs duties and taxes included in the total order price?',
      answer:
        'For most major destinations (DDP), import duties and VAT are fully calculated and included at checkout so there are no unexpected fees upon arrival.',
    },
    {
      id: 'faq-5',
      category: 'returns',
      question: 'What is the MONOLITH return window?',
      answer:
        'We offer complimentary returns within 14 days of delivery. Returned items must be unworn, unwashed, and accompanied by all original security tags and archival packaging.',
    },
    {
      id: 'faq-6',
      category: 'returns',
      question: 'How long does it take to process a refund?',
      answer:
        'Quality inspection occurs within 48 hours of arrival at our atelier. Once approved, refunds are credited to your original payment method within 2–5 business days.',
    },
    {
      id: 'faq-7',
      category: 'sizing',
      question: 'How do I determine the correct size for architectural outerwear?',
      answer:
        'Our outerwear is tailored with structured silhouettes. Detailed garment measurements are provided on every product page. If between sizes, we recommend selecting your standard size for a relaxed drape.',
    },
    {
      id: 'faq-8',
      category: 'payments',
      question: 'Which payment methods are accepted?',
      answer:
        'We accept Visa, Mastercard, American Express, Apple Pay, Google Pay, and encrypted UPI payments. All transactions are protected with 256-bit bank-grade encryption.',
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesQuery =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md antialiased selection:bg-primary selection:text-white">
      {/* Shared Master Navbar */}
      <Navbar />

      <main className="pt-24 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Frequently Asked Questions' },
          ]}
        />

        {/* Hero Header & Search */}
        <header className="mb-16 text-center max-w-3xl mx-auto space-y-6">
          <p className="font-label-caps text-xs text-secondary uppercase tracking-[0.3em]">
            CLIENT CONCIERGE FAQ
          </p>
          <h1 className="font-headline-lg text-4xl md:text-5xl text-primary tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="font-body-lg text-secondary text-sm md:text-base leading-relaxed">
            Find answers to common inquiries regarding our sartorial collections, ordering process, global logistics, and client services.
          </p>

          {/* Search Input Bar */}
          <div className="relative max-w-lg mx-auto pt-2">
            <Search className="w-4 h-4 text-secondary absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g. shipping, returns, size)..."
              className="w-full bg-white border border-outline-variant pl-11 pr-4 py-3 text-xs font-body-md focus:border-primary focus:outline-none shadow-sm"
            />
          </div>
        </header>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { id: 'all', label: 'All Topics' },
            { id: 'orders', label: 'Orders' },
            { id: 'shipping', label: 'Shipping' },
            { id: 'returns', label: 'Returns & Refunds' },
            { id: 'sizing', label: 'Sizing & Fit' },
            { id: 'payments', label: 'Payments' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2.5 font-label-caps text-xs uppercase tracking-widest transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-primary text-white font-bold shadow-sm'
                  : 'bg-white text-secondary border border-outline-variant hover:border-primary hover:text-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-3xl mx-auto space-y-4 mb-20">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openIndex === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white border border-outline-variant transition-all duration-300 shadow-sm"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : faq.id)}
                    className="w-full p-6 text-left flex justify-between items-center gap-4 cursor-pointer"
                  >
                    <span className="font-label-caps text-xs md:text-sm uppercase font-bold text-primary">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-primary shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-outline-variant/40">
                      <p className="font-body-md text-secondary text-xs md:text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white border border-outline-variant p-8 space-y-3">
              <HelpCircle className="w-10 h-10 text-secondary mx-auto opacity-50" />
              <p className="font-headline-md text-xl text-primary">No Matching Questions Found</p>
              <p className="font-body-md text-secondary text-xs">
                Try searching with a different term or reach out to our concierge directly.
              </p>
            </div>
          )}
        </div>

        {/* Still Have Questions Concierge Card */}
        <div className="max-w-3xl mx-auto bg-surface-container-low border border-outline-variant p-8 md:p-12 text-center space-y-6">
          <h2 className="font-headline-md text-2xl text-primary font-bold">Still Have Questions?</h2>
          <p className="font-body-md text-secondary text-xs md:text-sm max-w-md mx-auto leading-relaxed">
            Our private client advisors are available 24/7 to assist with any tailored requests or technical support.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => alert('Starting Live Chat...')}
              className="bg-primary text-white px-8 py-3.5 font-button text-xs uppercase tracking-widest hover:bg-black/90 cursor-pointer shadow-md flex items-center gap-2 font-semibold"
            >
              <MessageSquare className="w-4 h-4" /> Live Concierge Chat
            </button>
            <button
              onClick={() => navigate('/contact-us')}
              className="border border-primary text-primary px-8 py-3.5 font-button text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all cursor-pointer font-semibold"
            >
              Contact Support
            </button>
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

export default FaqPage;
