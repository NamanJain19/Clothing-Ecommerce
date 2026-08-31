import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { NewsletterSection } from '../components/home/NewsletterSection';

export const TermsConditionsPage: React.FC = () => {
  const sections = [
    {
      id: 'introduction',
      title: '1. INTRODUCTION',
      content: [
        'Welcome to MONOLITH. These Terms & Conditions outline the rules and regulations for the use of the MONOLITH website and the purchase of our products. By accessing this website, we assume you accept these terms in full. Do not continue to use the website if you do not agree to all terms stated on this page.',
        'Throughout the site, the terms “we”, “us” and “our” refer to MONOLITH. MONOLITH offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.',
      ],
    },
    {
      id: 'website-usage',
      title: '2. WEBSITE USAGE',
      content: [
        'By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).',
        'A breach or violation of any of the Terms will result in an immediate termination of your Services. We reserve the right to refuse service to anyone for any reason at any time.',
      ],
    },
    {
      id: 'orders',
      title: '3. ORDERS',
      content: [
        'We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. These restrictions may include orders placed by or under the same customer account, the same credit card, and/or orders that use the same billing and/or shipping address.',
        'In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made.',
      ],
    },
    {
      id: 'payments',
      title: '4. PAYMENTS',
      content: [
        'All payments are processed securely through our verified partners. We accept major credit cards and digital payment solutions. You agree to provide current, complete and accurate purchase and account information for all purchases made at our store.',
        'You agree to promptly update your account and other information, including your email address and credit card numbers and expiration dates, so that we can complete your transactions and contact you as needed.',
      ],
    },
    {
      id: 'pricing',
      title: '5. PRICING',
      content: [
        'Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.',
        'We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service. All prices are inclusive of taxes where applicable unless stated otherwise.',
      ],
    },
    {
      id: 'shipping',
      title: '6. SHIPPING',
      content: [
        'Shipping times and costs vary depending on the destination and the shipping method selected. MONOLITH is not responsible for any delays caused by the shipping carrier or customs clearance processes.',
        'Risk of loss and title for items purchased from MONOLITH pass to you upon delivery of the items to the carrier. We recommend reviewing our full Shipping Policy for detailed information on international delivery.',
      ],
    },
    {
      id: 'returns',
      title: '7. RETURNS',
      content: [
        'Please refer to our Returns & Exchanges page for full details on our policy. Items must be returned in their original condition, unworn and with all tags attached, within 14 days of receipt.',
        'Bespoke or personalized items are final sale and cannot be returned. Refunds will be issued to the original method of payment within 10 business days of receiving the returned goods.',
      ],
    },
    {
      id: 'intellectual-property',
      title: '8. INTELLECTUAL PROPERTY',
      content: [
        'The Service and its original content, features and functionality are and will remain the exclusive property of MONOLITH and its licensors. Our intellectual property may not be used in connection with any product or service without the prior written consent of MONOLITH.',
        'All designs, photography, and editorial content are protected by international copyright laws. Unauthorized reproduction is strictly prohibited.',
      ],
    },
    {
      id: 'liability',
      title: '9. LIMITATION OF LIABILITY',
      content: [
        'In no case shall MONOLITH, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind.',
        'This includes, without limitation, lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages, whether based in contract, tort (including negligence), strict liability or otherwise, arising from your use of any of the service or any products procured using the service.',
      ],
    },
    {
      id: 'termination',
      title: '10. TERMINATION',
      content: [
        'The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of this agreement for all purposes.',
        'These Terms of Service are effective unless and until terminated by either you or us. You may terminate these Terms of Service at any time by notifying us that you no longer wish to use our Services, or when you cease using our site.',
      ],
    },
    {
      id: 'contact',
      title: '11. CONTACT INFORMATION',
      content: [
        'Questions about the Terms of Service should be sent to us at:',
      ],
      extra: (
        <div className="pt-4 border-l-2 border-primary pl-6 py-2 text-xs font-mono space-y-1 text-primary">
          <p className="font-bold">MONOLITH GLOBAL HEADQUARTERS</p>
          <p>Legal Department</p>
          <p>legal@monolith-studio.com</p>
          <p>+44 (0) 20 7946 0123</p>
        </div>
      ),
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
            { label: 'Terms & Conditions' },
          ]}
        />

        {/* Hero Section */}
        <header className="mb-16 md:grid md:grid-cols-12 gap-8 items-end border-b border-outline-variant pb-8">
          <div className="md:col-span-8 space-y-3">
            <p className="font-label-caps text-xs text-secondary uppercase tracking-[0.3em]">
              LEGAL FRAMEWORK
            </p>
            <h1 className="font-display-lg text-4xl md:text-6xl text-primary tracking-tight">
              Terms & Conditions
            </h1>
            <p className="font-body-lg text-secondary text-sm md:text-base max-w-2xl leading-relaxed">
              These terms govern the relationship between MONOLITH and its community. By engaging with our platform, you acknowledge a shared commitment to quality, integrity, and the pursuit of minimalist excellence.
            </p>
          </div>
          <div className="md:col-span-4 text-left md:text-right mt-6 md:mt-0">
            <p className="font-label-caps text-[10px] text-secondary uppercase tracking-widest">
              LAST UPDATED
            </p>
            <p className="font-body-md text-sm font-bold text-primary">OCTOBER 2024</p>
          </div>
        </header>

        {/* Content Layout: Sticky Nav + Legal Articles */}
        <div className="md:grid md:grid-cols-12 gap-12">
          {/* Side Navigation (Sticky 3 cols) */}
          <aside className="hidden md:block md:col-span-3">
            <div className="sticky top-28 space-y-3">
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-secondary block mb-2 font-bold">
                SECTIONS
              </span>
              <nav className="flex flex-col gap-2 border-l border-outline-variant">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="pl-4 py-1.5 font-label-caps text-xs uppercase text-secondary hover:text-primary transition-colors hover:border-l-2 hover:border-primary -ml-[1px]"
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Legal Text Articles (9 cols) */}
          <article className="md:col-span-9 space-y-16">
            {sections.map((sec, idx) => (
              <React.Fragment key={sec.id}>
                {/* Visual Intermission Image after section 4 */}
                {idx === 4 && (
                  <div className="w-full h-80 md:h-[400px] overflow-hidden border border-outline-variant my-12">
                    <img
                      src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
                      alt="Monolith Structural Architecture"
                      className="w-full h-full object-cover filter grayscale contrast-125"
                    />
                  </div>
                )}

                <section id={sec.id} className="space-y-4">
                  <div className="w-12 h-0.5 bg-primary" />
                  <h2 className="font-headline-md text-2xl text-primary font-bold">{sec.title}</h2>
                  <div className="space-y-4 font-body-md text-secondary text-sm md:text-base leading-relaxed">
                    {sec.content.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                    {sec.extra}
                  </div>
                </section>
              </React.Fragment>
            ))}
          </article>
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

export default TermsConditionsPage;
