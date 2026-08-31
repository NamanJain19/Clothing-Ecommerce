import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  HelpCircle,
  Mail,
  Phone,
  Plus,
  Minus,
  LogOut,
  Send,
  Package,
  Truck,
  RotateCcw,
  CreditCard,
  Gift,
  UserCheck,
} from 'lucide-react';

export const HelpSupportPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const faqs = [
    {
      question: 'How do I track my luxury order?',
      answer:
        'Once your order has been dispatched from our atelier, you will receive a confirmation email containing your tracking number. You can also view live status updates directly within the "Track Orders" section of your account.',
    },
    {
      question: 'What is your international return policy?',
      answer:
        'We offer complimentary returns for all orders within 14 days of delivery. Items must be in their original condition with all security tags and packaging intact.',
    },
    {
      question: 'Can I modify an order after it is placed?',
      answer:
        'To ensure prompt delivery, we begin processing orders immediately. Please contact our concierge team within 30 minutes of order placement if you require any modifications.',
    },
    {
      question: 'Do you offer personal styling consultation?',
      answer:
        'Yes, our private client advisor team provides complimentary 1-on-1 virtual styling consultations and private showroom bookings upon request.',
    },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setFullName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setIsSubmitted(false);
    }, 4000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md antialiased selection:bg-primary selection:text-white">
      {/* Shared Master Navbar */}
      <Navbar />

      <main className="pt-24 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'My Account', href: '/dashboard' },
            { label: 'Help & Support' },
          ]}
        />

        <div className="grid grid-cols-12 gap-8">
          {/* Account Sidebar Navigation (3 Columns) */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="sticky top-28 space-y-12">
              <div>
                <h2 className="font-headline-md text-2xl mb-6 text-primary">My Account</h2>
                <nav className="flex flex-col gap-1 border-l border-outline-variant">
                  <Link
                    to="/dashboard"
                    className="pl-6 py-3 font-label-caps text-xs uppercase text-secondary hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-orders"
                    className="pl-6 py-3 font-label-caps text-xs uppercase text-secondary hover:text-primary transition-colors"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/track-order"
                    className="pl-6 py-3 font-label-caps text-xs uppercase text-secondary hover:text-primary transition-colors"
                  >
                    Track Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="pl-6 py-3 font-label-caps text-xs uppercase text-secondary hover:text-primary transition-colors"
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/saved-addresses"
                    className="pl-6 py-3 font-label-caps text-xs uppercase text-secondary hover:text-primary transition-colors"
                  >
                    Saved Addresses
                  </Link>
                  <Link
                    to="/payment-methods"
                    className="pl-6 py-3 font-label-caps text-xs uppercase text-secondary hover:text-primary transition-colors"
                  >
                    Payment Methods
                  </Link>
                  <Link
                    to="/account-settings"
                    className="pl-6 py-3 font-label-caps text-xs uppercase text-secondary hover:text-primary transition-colors"
                  >
                    Account Settings
                  </Link>
                  <Link
                    to="/notifications"
                    className="pl-6 py-3 font-label-caps text-xs uppercase text-secondary hover:text-primary transition-colors"
                  >
                    Notifications
                  </Link>
                  <Link
                    to="/help-support"
                    className="pl-6 py-3 font-label-caps text-xs uppercase text-primary font-bold border-l-2 border-primary -ml-[1px]"
                  >
                    Help & Support
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="pl-6 py-3 mt-6 font-label-caps text-xs uppercase text-red-600 hover:opacity-70 text-left cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content Area: Help & Support (9 Columns) */}
          <section className="col-span-12 lg:col-span-9 space-y-16">
            <header className="border-b border-outline-variant pb-6">
              <h1 className="font-headline-lg text-3xl md:text-4xl text-primary mb-2">Help & Support</h1>
              <p className="font-body-md text-secondary text-sm">
                We're here whenever you need assistance with your luxury experience.
              </p>
            </header>

            {/* Quick Support Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                onClick={() => alert('Starting Live Concierge Chat...')}
                className="p-6 border border-outline-variant bg-white hover:bg-surface-container-low transition-colors cursor-pointer group shadow-sm"
              >
                <MessageSquare className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-label-caps text-xs uppercase font-bold text-primary mb-1">Live Chat</h4>
                <p className="text-[10px] text-secondary font-label-caps uppercase tracking-widest">
                  Available 24/7
                </p>
              </div>

              <div
                onClick={() => navigate('/contact-us')}
                className="p-6 border border-outline-variant bg-white hover:bg-surface-container-low transition-colors cursor-pointer group shadow-sm"
              >
                <HelpCircle className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-label-caps text-xs uppercase font-bold text-primary mb-1">Contact Us</h4>
                <p className="text-[10px] text-secondary font-label-caps uppercase tracking-widest">
                  Concierge Desk
                </p>
              </div>

              <div className="p-6 border border-outline-variant bg-white shadow-sm">
                <Mail className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-label-caps text-xs uppercase font-bold text-primary mb-1">Email</h4>
                <p className="text-[10px] text-secondary font-label-caps uppercase tracking-widest">
                  concierge@monolith.com
                </p>
              </div>

              <div className="p-6 border border-outline-variant bg-white shadow-sm">
                <Phone className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-label-caps text-xs uppercase font-bold text-primary mb-1">Phone</h4>
                <p className="text-[10px] text-secondary font-label-caps uppercase tracking-widest">
                  +91 1800 200 4567
                </p>
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <div className="space-y-6">
              <div className="border-b border-outline-variant pb-4">
                <h3 className="font-headline-md text-2xl text-primary">Frequently Asked Questions</h3>
              </div>
              <div className="divide-y divide-outline-variant border border-outline-variant bg-white">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-6">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex justify-between items-center text-left font-headline-md text-lg text-primary hover:opacity-75 transition-opacity cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      {openFaq === index ? (
                        <Minus className="w-5 h-5 shrink-0 ml-4" />
                      ) : (
                        <Plus className="w-5 h-5 shrink-0 ml-4" />
                      )}
                    </button>
                    {openFaq === index && (
                      <p className="mt-4 font-body-md text-secondary text-xs leading-relaxed max-w-3xl">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Support Message Form */}
            <div className="space-y-6">
              <div className="border-b border-outline-variant pb-4">
                <h3 className="font-headline-md text-2xl text-primary">Submit a Concierge Inquiry</h3>
                <p className="font-body-md text-secondary text-xs mt-1">
                  Our private client advisory team will respond within 4 hours.
                </p>
              </div>

              {isSubmitted && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  Thank you. Your inquiry has been received by our luxury concierge desk.
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-6 bg-white p-8 border border-outline-variant shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alexander Sterling"
                      className="w-full border-0 border-b border-outline-variant py-2.5 bg-transparent text-sm focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alexander@example.com"
                      className="w-full border-0 border-b border-outline-variant py-2.5 bg-transparent text-sm focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                    Subject / Order Reference
                  </label>
                  <input
                    required
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Inquiry regarding Order or Sizing"
                    className="w-full border-0 border-b border-outline-variant py-2.5 bg-transparent text-sm focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please specify your request in detail..."
                    className="w-full border border-outline-variant p-3 bg-transparent text-sm focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-primary text-white px-8 py-4 font-button text-xs uppercase tracking-widest hover:bg-black/90 transition-all cursor-pointer shadow-md flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Inquiry
                </button>
              </form>
            </div>
          </section>
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

export default HelpSupportPage;
