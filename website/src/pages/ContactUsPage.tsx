import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { NewsletterSection } from '../components/home/NewsletterSection';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Globe,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const ContactUsPage: React.FC = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState('Personal Styling');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for reaching out. The Monolith Concierge Team will contact you within 2 hours.');
    setFullName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  const flagships = [
    {
      city: 'NEW YORK',
      name: 'Fifth Avenue Flagship',
      address: '740 Fifth Avenue, Suite 1200',
      zip: 'New York, NY 10019',
      hours: 'Mon–Sat: 10:00 – 19:00 | Sun: 12:00 – 17:00',
      phone: '+1 (212) 555-0198',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
    },
    {
      city: 'PARIS',
      name: 'Maison du Faubourg',
      address: '75 Rue du Faubourg Saint-Honoré',
      zip: '75008 Paris, France',
      hours: 'Mon–Sat: 10:30 – 19:30 | Closed Sun',
      phone: '+33 1 42 68 55 00',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    },
    {
      city: 'TOKYO',
      name: 'Ginza Atelier',
      address: '6-10-1 Ginza, Chuo-ku',
      zip: 'Tokyo 104-0061, Japan',
      hours: 'Daily: 11:00 – 20:00',
      phone: '+81 3 5537 1100',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
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
            { label: 'Contact Us' },
          ]}
        />

        {/* Hero Header */}
        <header className="mb-16 text-center max-w-3xl mx-auto space-y-4">
          <p className="font-label-caps text-xs text-secondary uppercase tracking-[0.25em]">
            ATELIER CONCIERGE
          </p>
          <h1 className="font-headline-lg text-4xl md:text-5xl lg:text-6xl text-primary tracking-tight">
            Connect With Monolith
          </h1>
          <p className="font-body-lg text-secondary text-base md:text-lg leading-relaxed">
            Whether inquiring about private client appointments, bespoke orders, or global shipping, our dedicated concierge team is at your service.
          </p>
        </header>

        {/* Contact Method Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="border border-outline-variant p-8 bg-white text-center space-y-4 hover:border-primary transition-all duration-300 shadow-sm group">
            <div className="w-12 h-12 rounded-full bg-surface-container mx-auto flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
              <MessageSquare className="w-5 h-5 text-primary group-hover:text-white" />
            </div>
            <h3 className="font-headline-md text-xl text-primary">Private Concierge</h3>
            <p className="font-body-md text-secondary text-xs leading-relaxed">
              Immediate live chat assistance for sizing, styling, and order status.
            </p>
            <button
              onClick={() => alert('Launching Private Concierge Live Chat...')}
              className="font-label-caps text-xs uppercase tracking-widest text-primary underline underline-offset-4 font-semibold hover:opacity-60 cursor-pointer block mx-auto"
            >
              START LIVE CHAT
            </button>
          </div>

          <div className="border border-outline-variant p-8 bg-white text-center space-y-4 hover:border-primary transition-all duration-300 shadow-sm group">
            <div className="w-12 h-12 rounded-full bg-surface-container mx-auto flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
              <Phone className="w-5 h-5 text-primary group-hover:text-white" />
            </div>
            <h3 className="font-headline-md text-xl text-primary">Client Support</h3>
            <p className="font-body-md text-secondary text-xs leading-relaxed">
              Available Monday through Saturday, 9:00 AM – 8:00 PM EST.
            </p>
            <a
              href="tel:+18006666548"
              className="font-label-caps text-xs uppercase tracking-widest text-primary font-bold hover:opacity-60 block"
            >
              +1 (800) 666-6548
            </a>
          </div>

          <div className="border border-outline-variant p-8 bg-white text-center space-y-4 hover:border-primary transition-all duration-300 shadow-sm group">
            <div className="w-12 h-12 rounded-full bg-surface-container mx-auto flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
              <Mail className="w-5 h-5 text-primary group-hover:text-white" />
            </div>
            <h3 className="font-headline-md text-xl text-primary">Email Inquiries</h3>
            <p className="font-body-md text-secondary text-xs leading-relaxed">
              Dedicated email assistance with priority response within 2 hours.
            </p>
            <a
              href="mailto:concierge@monolithluxury.com"
              className="font-label-caps text-xs uppercase tracking-widest text-primary font-bold hover:opacity-60 block"
            >
              concierge@monolithluxury.com
            </a>
          </div>
        </div>

        {/* Split Section: Direct Message Form & Global Flagships */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
          {/* Direct Message Form (7 cols) */}
          <div className="lg:col-span-7 bg-surface-container-low border border-outline-variant p-8 md:p-12 space-y-8">
            <div>
              <span className="font-label-caps text-[10px] text-secondary uppercase tracking-widest">
                CLIENT SERVICES
              </span>
              <h2 className="font-headline-md text-3xl text-primary mt-1">Send a Message</h2>
              <p className="font-body-md text-secondary text-xs mt-2">
                Please complete the details below. Our client advisor will respond promptly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alexander Sterling"
                    className="w-full border-0 border-b border-outline-variant py-2 bg-transparent text-sm focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alexander@example.com"
                    className="w-full border-0 border-b border-outline-variant py-2 bg-transparent text-sm focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 012-3456"
                    className="w-full border-0 border-b border-outline-variant py-2 bg-transparent text-sm focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                    Inquiry Type
                  </label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full border-0 border-b border-outline-variant py-2 bg-transparent text-sm focus:ring-0 focus:border-primary cursor-pointer"
                  >
                    <option>Personal Styling</option>
                    <option>Bespoke Appointment</option>
                    <option>Order & Tracking Status</option>
                    <option>Press & Editorial</option>
                    <option>General Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How may our concierge assist you today?"
                  className="w-full border-0 border-b border-outline-variant py-2 bg-transparent text-sm focus:border-primary resize-none"
                />
              </div>

              <button
                type="submit"
                className="bg-primary text-white font-button text-xs uppercase tracking-widest px-10 py-4 hover:bg-black/90 transition-all cursor-pointer shadow-md flex items-center gap-2 font-semibold"
              >
                <Send className="w-4 h-4" /> Send Inquiry
              </button>
            </form>
          </div>

          {/* Global Flagships List (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="font-label-caps text-[10px] text-secondary uppercase tracking-widest">
                GLOBAL PRESENCE
              </span>
              <h2 className="font-headline-md text-3xl text-primary mt-1">Our Flagship Ateliers</h2>
              <p className="font-body-md text-secondary text-xs mt-2">
                Visit our physical sanctuaries for private fitting sessions and bespoke consultations.
              </p>
            </div>

            <div className="space-y-6">
              {flagships.map((f, idx) => (
                <div
                  key={idx}
                  className="border border-outline-variant bg-white p-6 flex gap-6 items-center shadow-sm hover:border-primary transition-all duration-300"
                >
                  <div className="w-24 h-24 shrink-0 overflow-hidden border border-outline-variant bg-surface-container">
                    <img src={f.image} alt={f.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <span className="font-label-caps text-[9px] bg-primary text-white px-2 py-0.5 font-bold tracking-widest">
                      {f.city}
                    </span>
                    <h4 className="font-headline-md text-base text-primary font-bold">{f.name}</h4>
                    <p className="text-secondary">{f.address}</p>
                    <p className="text-secondary">{f.zip}</p>
                    <p className="text-primary font-semibold pt-1">{f.phone}</p>
                  </div>
                </div>
              ))}
            </div>
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

export default ContactUsPage;
