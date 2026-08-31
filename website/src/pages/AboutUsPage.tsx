import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { ArrowRight, Compass, ShieldCheck, Feather, Layers, Award } from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  const milestones = [
    {
      year: '2018',
      title: 'The Foundation',
      description: 'Established in Paris as a boutique architectural design house producing limited-edition outerwear.',
    },
    {
      year: '2020',
      title: 'Global Atelier Expansion',
      description: 'Opened flagship physical sanctuaries in New York Fifth Avenue and Tokyo Ginza.',
    },
    {
      year: '2022',
      title: 'Zero-Waste Silk & Cashmere Initiative',
      description: 'Pioneered 100% traceably sourced organic textiles and circular luxury recycling programs.',
    },
    {
      year: '2024',
      title: 'The Digital Atelier',
      description: 'Launched bespoke digital client styling experiences across 45 countries worldwide.',
    },
  ];

  const pillars = [
    {
      icon: Layers,
      title: 'Architectural Form',
      description:
        'Every garment is sculpted with mathematical precision, drawing inspiration from brutalist and modernist physical structures.',
    },
    {
      icon: Feather,
      title: 'Uncompromising Materiality',
      description:
        'We source exclusively Loro Piana cashmeres, Japanese selvedge denim, and double-faced Italian wools.',
    },
    {
      icon: ShieldCheck,
      title: 'Traceable Craftsmanship',
      description:
        'Crafted by master artisans in small-batch European ateliers with generational expertise.',
    },
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
            { label: 'About Us' },
          ]}
        />

        {/* Hero Banner Section */}
        <header className="relative mb-20">
          <div className="relative aspect-[21/9] min-h-[350px] overflow-hidden border border-outline-variant">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80"
              alt="Monolith Atelier Architecture"
              className="w-full h-full object-cover filter grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-8 text-white">
              <span className="font-label-caps text-xs uppercase tracking-[0.3em] mb-3 text-white/80">
                THE MONOLITH HERITAGE
              </span>
              <h1 className="font-headline-lg text-4xl md:text-6xl max-w-3xl tracking-tight text-white mb-4">
                Architectural Form. Uncompromising Utility.
              </h1>
              <p className="font-body-lg text-sm md:text-base max-w-xl text-white/90 font-light">
                Redefining modern luxury through brutalist minimalism, structural precision, and timeless material integrity.
              </p>
            </div>
          </div>
        </header>

        {/* Brand Narrative Split */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 space-y-6">
            <span className="font-label-caps text-xs text-secondary uppercase tracking-[0.2em]">
              OUR PHILOSOPHY
            </span>
            <h2 className="font-headline-lg text-3xl md:text-4xl text-primary leading-tight">
              Where High Architecture Meets Haute Couture
            </h2>
            <p className="font-body-md text-secondary text-sm md:text-base leading-relaxed">
              Monolith was born out of a desire to purge fashion of transient trends and superficial ornamentation. Founded in 2018, our house approaches garment design not merely as clothing, but as wearable architectural structures.
            </p>
            <p className="font-body-md text-secondary text-sm md:text-base leading-relaxed">
              Each piece is designed around silhouette, weight, and light interaction. By eliminating unnecessary seams and prioritizing pure geometric lines, we engineer wardrobe staples that endure across decades.
            </p>
          </div>
          <div className="lg:col-span-6 border border-outline-variant overflow-hidden aspect-[4/3] bg-surface-container">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
              alt="Monolith Studio Design Process"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Three Core Pillars */}
        <section className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="font-label-caps text-xs text-secondary uppercase tracking-[0.2em]">
              OUR COMMITMENT
            </span>
            <h2 className="font-headline-lg text-3xl md:text-4xl text-primary">The Monolith Pillars</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((p, idx) => {
              const IconComp = p.icon;
              return (
                <div
                  key={idx}
                  className="border border-outline-variant bg-white p-8 space-y-4 hover:border-primary transition-all duration-300 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
                    <IconComp className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-headline-md text-xl text-primary font-bold">{p.title}</h3>
                  <p className="font-body-md text-secondary text-xs leading-relaxed">{p.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Timeline / Milestones */}
        <section className="mb-24 bg-surface-container-low p-8 md:p-16 border border-outline-variant">
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="font-label-caps text-xs text-secondary uppercase tracking-[0.2em]">
                CHRONOLOGY
              </span>
              <h2 className="font-headline-lg text-3xl text-primary">House Milestones</h2>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:left-3 md:before:left-1/2 before:-translate-x-px before:h-full before:w-0.5 before:bg-outline-variant">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className={`relative flex flex-col md:flex-row items-center justify-between gap-8 ${
                    idx % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  <div className="w-full md:w-5/12 bg-white p-6 border border-outline-variant shadow-sm space-y-2">
                    <span className="font-headline-md text-2xl text-primary font-bold">{m.year}</span>
                    <h4 className="font-headline-md text-lg text-primary">{m.title}</h4>
                    <p className="font-body-md text-secondary text-xs leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-primary border-4 border-white shadow-md z-10 shrink-0 hidden md:block" />
                  <div className="w-full md:w-5/12 hidden md:block" />
                </div>
              ))}
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

export default AboutUsPage;
