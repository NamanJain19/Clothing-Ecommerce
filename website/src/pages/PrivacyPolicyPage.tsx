import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { ArrowRight, ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md antialiased selection:bg-primary selection:text-white">
      {/* Shared Master Navbar */}
      <Navbar />

      <main className="pt-24 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Privacy Policy' },
          ]}
        />

        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <header className="mb-20 text-center space-y-4">
            <p className="font-label-caps text-xs text-secondary uppercase tracking-[0.3em]">LEGAL NOTICE</p>
            <h1 className="font-headline-lg text-4xl md:text-5xl text-primary italic">Privacy Policy</h1>
            <div className="w-16 h-[1px] bg-primary mx-auto" />
            <p className="font-body-lg text-secondary text-sm italic">Last Updated: October 2024</p>
          </header>

          {/* Policy Content Sections */}
          <div className="space-y-16">
            {/* 01. Introduction */}
            <section id="introduction" className="space-y-4">
              <h2 className="font-headline-md text-2xl text-primary font-bold">01. Introduction</h2>
              <div className="font-body-lg text-secondary text-sm md:text-base leading-relaxed space-y-4">
                <p>
                  Welcome to MONOLITH. We are committed to protecting your personal information and your right to privacy. This policy describes how we collect, use, and share your personal information when you visit our website or make a purchase.
                </p>
                <p>
                  At MONOLITH, we believe in radical transparency. Our digital ecosystem is designed to mirror the refined experience of our physical boutiques—quiet, secure, and focused entirely on the user journey. Your trust is the foundation of our brand architecture.
                </p>
              </div>
            </section>

            {/* 02. Information We Collect */}
            <section id="information-collection" className="space-y-4">
              <h2 className="font-headline-md text-2xl text-primary font-bold">02. Information We Collect</h2>
              <div className="font-body-lg text-secondary text-sm md:text-base leading-relaxed space-y-4">
                <p>
                  When you interact with our platform, we collect certain identifiers to facilitate a personalized experience. This includes:
                </p>
                <ul className="space-y-4 border-l-2 border-primary pl-6 py-2 italic text-xs md:text-sm">
                  <li>
                    <span className="font-bold text-primary not-italic">Personal Identifiers:</span> Name, shipping address, billing address, and email coordinates.
                  </li>
                  <li>
                    <span className="font-bold text-primary not-italic">Technical Telemetry:</span> IP addresses, browser types, and device identifiers used to optimize the visual rendering of our interface.
                  </li>
                  <li>
                    <span className="font-bold text-primary not-italic">Commercial History:</span> Record of curated selections and purchase history within the MONOLITH archive.
                  </li>
                </ul>
              </div>
            </section>

            {/* 03. How We Use Information */}
            <section id="usage" className="space-y-4">
              <h2 className="font-headline-md text-2xl text-primary font-bold">03. How We Use Information</h2>
              <div className="font-body-lg text-secondary text-sm md:text-base leading-relaxed space-y-4">
                <p>Your data serves as the blueprint for our service optimization. We utilize your information to:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-1" />
                    <span>Process and fulfill your sartorial acquisitions seamlessly.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-1" />
                    <span>Curate editorial content aligned with your aesthetic preferences.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-1" />
                    <span>Maintain the structural integrity and security of the MONOLITH digital domain.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Aesthetic Editorial Break Image */}
            <section className="py-4">
              <div className="relative w-full aspect-[16/9] overflow-hidden border border-outline-variant">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
                  alt="Monolith Architectural Geometry"
                  className="w-full h-full object-cover filter grayscale contrast-125"
                />
              </div>
            </section>

            {/* 04. Cookies */}
            <section id="cookies" className="space-y-4">
              <h2 className="font-headline-md text-2xl text-primary font-bold">04. Cookies & Digital Footprints</h2>
              <p className="font-body-lg text-secondary text-sm md:text-base leading-relaxed">
                We use small data files, known as cookies, to memorize your preferences and session states. These digital markers ensure that your navigation through our collections remains fluid and uninterrupted. You may manage these via your browser settings, though some functional aspects of the gallery may be diminished.
              </p>
            </section>

            {/* 05. Data Protection */}
            <section id="protection" className="space-y-4">
              <h2 className="font-headline-md text-2xl text-primary font-bold">05. Data Protection</h2>
              <p className="font-body-lg text-secondary text-sm md:text-base leading-relaxed">
                MONOLITH employs industry-leading encryption protocols to safeguard your personal data. We treat your information with the same reverence we accord our physical archives. Access is strictly limited to authorized personnel essential to the delivery of your service.
              </p>
            </section>

            {/* 06. Third Party Services */}
            <section id="third-party" className="space-y-4">
              <h2 className="font-headline-md text-2xl text-primary font-bold">06. Third Party Services</h2>
              <p className="font-body-lg text-secondary text-sm md:text-base leading-relaxed">
                We partner with a selected circle of logistical and financial intermediaries. These partners are vetted for their commitment to data sovereignty and are only provided the minimum data necessary to execute their specific functions within the MONOLITH ecosystem.
              </p>
            </section>

            {/* 07. User Rights */}
            <section id="rights" className="space-y-6">
              <h2 className="font-headline-md text-2xl text-primary font-bold">07. User Rights</h2>
              <p className="font-body-lg text-secondary text-sm md:text-base leading-relaxed">
                Regardless of your geographic location, MONOLITH extends universal rights to its users:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="border-t border-outline-variant pt-4 space-y-1">
                  <h3 className="font-label-caps text-xs uppercase font-bold text-primary">ACCESS</h3>
                  <p className="text-xs text-secondary leading-relaxed">
                    The right to request a digital transcript of the personal data we hold.
                  </p>
                </div>
                <div className="border-t border-outline-variant pt-4 space-y-1">
                  <h3 className="font-label-caps text-xs uppercase font-bold text-primary">ERASURE</h3>
                  <p className="text-xs text-secondary leading-relaxed">
                    The right to request the permanent deletion of your presence from our database.
                  </p>
                </div>
                <div className="border-t border-outline-variant pt-4 space-y-1">
                  <h3 className="font-label-caps text-xs uppercase font-bold text-primary">CORRECTION</h3>
                  <p className="text-xs text-secondary leading-relaxed">
                    The right to rectify any inaccuracies in your personal identity profile.
                  </p>
                </div>
                <div className="border-t border-outline-variant pt-4 space-y-1">
                  <h3 className="font-label-caps text-xs uppercase font-bold text-primary">PORTABILITY</h3>
                  <p className="text-xs text-secondary leading-relaxed">
                    The right to transfer your data to another digital service provider.
                  </p>
                </div>
              </div>
            </section>

            {/* 08. Contact Information */}
            <section id="contact" className="bg-surface-container-low p-8 md:p-10 border border-outline-variant space-y-4">
              <h2 className="font-headline-md text-2xl text-primary font-bold">08. Legal Contact Information</h2>
              <p className="font-body-md text-secondary text-xs leading-relaxed">
                For inquiries regarding this Privacy Policy or your data rights, please contact our dedicated Privacy Liaison:
              </p>
              <div className="pt-2 text-xs text-primary space-y-1 font-mono">
                <p className="font-bold">MONOLITH LEGAL DEPT.</p>
                <p>privacy@monolith.studio</p>
                <p>1221 Avenue of the Americas, New York, NY 10020</p>
              </div>
            </section>
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

export default PrivacyPolicyPage;
