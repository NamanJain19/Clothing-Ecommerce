import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { useAuth } from '../context/AuthContext';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Plus,
  Trash2,
  X,
  AlertCircle,
  Smartphone,
  Check,
} from 'lucide-react';
import {
  paymentMethodService,
  SavedPaymentMethod,
} from '../services/paymentMethodService';

export const PaymentMethodsPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>([]);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isAddUpiOpen, setIsAddUpiOpen] = useState(false);

  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('12');
  const [expiryYear, setExpiryYear] = useState('28');
  const [cardCvv, setCardCvv] = useState('');
  const [isDefaultCard, setIsDefaultCard] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  // UPI Form State
  const [upiId, setUpiId] = useState('');
  const [upiHolder, setUpiHolder] = useState('');
  const [upiApp, setUpiApp] = useState<'Google Pay' | 'PhonePe' | 'Paytm' | 'BHIM' | 'UPI'>('Google Pay');
  const [isDefaultUpi, setIsDefaultUpi] = useState(false);
  const [upiError, setUpiError] = useState<string | null>(null);

  // Success Feedback
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    setPaymentMethods(paymentMethodService.getPaymentMethods());
  }, []);

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (isAddCardOpen || isAddUpiOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAddCardOpen, isAddUpiOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleSetDefault = (id: string) => {
    const updated = paymentMethodService.setDefault(id);
    setPaymentMethods(updated);
    showFeedback('Default payment instrument updated successfully.');
  };

  const handleRemove = (id: string) => {
    const updated = paymentMethodService.removePaymentMethod(id);
    setPaymentMethods(updated);
    showFeedback('Payment method removed.');
  };

  const detectBrand = (num: string): 'Visa' | 'MasterCard' | 'Amex' | 'RuPay' | 'Card' => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (clean.startsWith('5')) return 'MasterCard';
    if (clean.startsWith('34') || clean.startsWith('37')) return 'Amex';
    if (clean.startsWith('60') || clean.startsWith('65')) return 'RuPay';
    return 'Card';
  };

  const formatCardNumber = (val: string) => {
    const clean = val.replace(/\D/g, '').substring(0, 16);
    const parts = clean.match(/.{1,4}/g) || [];
    return parts.join(' ');
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCardError(null);

    const cleanNum = cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 15) {
      setCardError('Please enter a valid 15 or 16-digit card number.');
      return;
    }

    if (!cardHolder.trim()) {
      setCardError('Cardholder name is required.');
      return;
    }

    if (cardCvv.length < 3) {
      setCardError('Please enter a valid CVV.');
      return;
    }

    const brand = detectBrand(cleanNum);
    const last4 = cleanNum.slice(-4);
    const masked = `•••• •••• •••• ${last4}`;

    paymentMethodService.addCard({
      cardNumberMasked: masked,
      cardHolderName: cardHolder.trim(),
      expiryMonth,
      expiryYear,
      brand,
      isDefault: isDefaultCard || paymentMethods.length === 0,
    });

    setPaymentMethods(paymentMethodService.getPaymentMethods());
    setIsAddCardOpen(false);
    setCardNumber('');
    setCardHolder('');
    setCardCvv('');
    showFeedback('Card saved successfully.');
  };

  const handleAddUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUpiError(null);

    if (!upiId.includes('@') || upiId.length < 5) {
      setUpiError('Please enter a valid UPI ID (e.g. username@okhdfcbank).');
      return;
    }

    paymentMethodService.addUPI({
      upiId: upiId.trim().toLowerCase(),
      accountHolderName: upiHolder.trim() || 'Monolith Client',
      app: upiApp,
      isDefault: isDefaultUpi || paymentMethods.length === 0,
    });

    setPaymentMethods(paymentMethodService.getPaymentMethods());
    setIsAddUpiOpen(false);
    setUpiId('');
    setUpiHolder('');
    showFeedback('UPI handle saved successfully.');
  };

  const savedCards = paymentMethods.filter((p) => p.type === 'card');
  const savedUPIs = paymentMethods.filter((p) => p.type === 'upi');

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
            { label: 'Payment Methods' },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
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
                    className="pl-6 py-3 font-label-caps text-xs uppercase text-primary font-bold border-l-2 border-primary -ml-[1px]"
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
                    className="pl-6 py-3 font-label-caps text-xs uppercase text-secondary hover:text-primary transition-colors"
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

          {/* Main Content Area: Payment Methods (9 Columns) */}
          <section className="col-span-12 lg:col-span-9 space-y-10">
            <div className="border-b border-outline-variant pb-6">
              <h1 className="font-headline-lg text-3xl md:text-4xl text-primary">Saved Payment Methods</h1>
              <p className="font-body-md text-secondary text-sm mt-1">
                Save credit/debit cards and UPI IDs for 1-click fast checkout.
              </p>
            </div>

            {feedbackMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{feedbackMessage}</span>
              </div>
            )}

            {/* SECTION 1: SAVED CREDIT / DEBIT CARDS */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-outline-variant pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="font-headline-md text-xl text-primary font-bold">Credit & Debit Cards</h2>
                </div>
                <button
                  onClick={() => setIsAddCardOpen(true)}
                  className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 font-button text-xs uppercase tracking-wider hover:bg-black/90 transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add New Card
                </button>
              </div>

              {savedCards.length === 0 ? (
                <div className="bg-white border border-outline-variant p-6 text-center space-y-2">
                  <p className="text-sm text-secondary">No credit or debit cards saved yet.</p>
                  <button
                    onClick={() => setIsAddCardOpen(true)}
                    className="text-primary font-semibold text-xs underline cursor-pointer"
                  >
                    + Add a card for faster checkout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedCards.map((pm) => (
                    <div
                      key={pm.id}
                      className={`border p-5 bg-white space-y-3 relative transition-all ${
                        pm.isDefault
                          ? 'border-primary ring-1 ring-primary shadow-sm'
                          : 'border-outline-variant hover:border-primary'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-surface-container flex items-center justify-center border border-outline-variant font-bold text-xs text-primary">
                            {pm.brand || 'CARD'}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-primary">{pm.cardHolderName}</h4>
                            <p className="font-mono text-xs text-secondary tracking-wider">{pm.cardNumberMasked}</p>
                          </div>
                        </div>

                        {pm.isDefault && (
                          <span className="font-label-caps text-[9px] bg-primary text-white px-2 py-0.5 uppercase tracking-wider font-bold">
                            Default
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center text-xs text-secondary pt-2 border-t border-outline-variant/50">
                        <span>Expires {pm.expiryMonth}/{pm.expiryYear}</span>

                        <div className="flex items-center gap-3">
                          {!pm.isDefault && (
                            <button
                              onClick={() => handleSetDefault(pm.id)}
                              className="text-primary hover:underline font-medium cursor-pointer"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => handleRemove(pm.id)}
                            className="text-rose-600 hover:opacity-70 cursor-pointer p-1"
                            title="Remove Card"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 2: SAVED UPI HANDLES */}
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center border-b border-outline-variant pb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-primary" />
                  <h2 className="font-headline-md text-xl text-primary font-bold">Saved UPI Accounts</h2>
                </div>
                <button
                  onClick={() => setIsAddUpiOpen(true)}
                  className="inline-flex items-center gap-2 border border-outline-variant bg-white text-primary px-4 py-2 font-button text-xs uppercase tracking-wider hover:border-primary transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add UPI ID
                </button>
              </div>

              {savedUPIs.length === 0 ? (
                <div className="bg-white border border-outline-variant p-6 text-center space-y-2">
                  <p className="text-sm text-secondary">No UPI IDs saved yet.</p>
                  <button
                    onClick={() => setIsAddUpiOpen(true)}
                    className="text-primary font-semibold text-xs underline cursor-pointer"
                  >
                    + Add Google Pay, PhonePe, or Paytm UPI
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedUPIs.map((pm) => (
                    <div
                      key={pm.id}
                      className={`border p-5 bg-white space-y-3 relative transition-all ${
                        pm.isDefault
                          ? 'border-primary ring-1 ring-primary shadow-sm'
                          : 'border-outline-variant hover:border-primary'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-surface-container flex items-center justify-center border border-outline-variant font-bold text-xs text-primary">
                            {pm.app === 'Google Pay' ? 'GPay' : pm.app === 'PhonePe' ? 'PhonePe' : pm.app === 'Paytm' ? 'Paytm' : 'UPI'}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-primary">{pm.app}</h4>
                            <p className="font-mono text-xs text-secondary">{pm.upiId}</p>
                          </div>
                        </div>

                        {pm.isDefault && (
                          <span className="font-label-caps text-[9px] bg-primary text-white px-2 py-0.5 uppercase tracking-wider font-bold">
                            Default
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center text-xs text-secondary pt-2 border-t border-outline-variant/50">
                        <span>Holder: {pm.accountHolderName}</span>

                        <div className="flex items-center gap-3">
                          {!pm.isDefault && (
                            <button
                              onClick={() => handleSetDefault(pm.id)}
                              className="text-primary hover:underline font-medium cursor-pointer"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => handleRemove(pm.id)}
                            className="text-rose-600 hover:opacity-70 cursor-pointer p-1"
                            title="Remove UPI"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Security Note */}
            <div className="flex items-center gap-3 p-4 bg-surface-container-low border border-outline-variant text-xs text-secondary">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
              <span>
                Your payment credentials are encrypted using 256-bit SSL tokenization in compliance with PCI-DSS & RBI standards.
              </span>
            </div>
          </section>
        </div>

        {/* Add Card Modal */}
        {isAddCardOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white max-w-md w-full p-8 border border-outline-variant shadow-2xl relative space-y-6 my-8">
              <div className="flex justify-between items-center border-b border-outline-variant pb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h3 className="font-headline-md text-xl text-primary font-bold">Add Credit / Debit Card</h3>
                </div>
                <button
                  onClick={() => setIsAddCardOpen(false)}
                  className="text-secondary hover:text-primary cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cardError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>{cardError}</span>
                </div>
              )}

              <form onSubmit={handleAddCardSubmit} className="space-y-4">
                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                    Card Number
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="4242 •••• •••• 4242"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    className="w-full border border-outline-variant p-3 font-mono text-sm tracking-wider focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                    Name on Card
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="NAME ON CARD"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    className="w-full border border-outline-variant p-3 text-sm focus:border-primary focus:outline-none font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                      Expiry (MM / YY)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={expiryMonth}
                        onChange={(e) => setExpiryMonth(e.target.value)}
                        className="border border-outline-variant p-3 text-xs bg-white focus:border-primary focus:outline-none"
                      >
                        {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <select
                        value={expiryYear}
                        onChange={(e) => setExpiryYear(e.target.value)}
                        className="border border-outline-variant p-3 text-xs bg-white focus:border-primary focus:outline-none"
                      >
                        {['26', '27', '28', '29', '30', '31', '32'].map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                      CVV
                    </label>
                    <input
                      required
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full border border-outline-variant p-3 font-mono text-sm tracking-widest focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDefaultCard}
                    onChange={(e) => setIsDefaultCard(e.target.checked)}
                    className="accent-primary"
                  />
                  <span className="font-body-md text-xs text-secondary">Set as default payment card</span>
                </label>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddCardOpen(false)}
                    className="px-5 py-2.5 border border-outline-variant text-secondary text-xs uppercase hover:bg-surface transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary text-white text-xs uppercase font-bold tracking-wider hover:bg-black/90 transition-all cursor-pointer shadow-sm"
                  >
                    Save Card
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add UPI Modal */}
        {isAddUpiOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white max-w-md w-full p-8 border border-outline-variant shadow-2xl relative space-y-6 my-8">
              <div className="flex justify-between items-center border-b border-outline-variant pb-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-primary" />
                  <h3 className="font-headline-md text-xl text-primary font-bold">Add UPI ID</h3>
                </div>
                <button
                  onClick={() => setIsAddUpiOpen(false)}
                  className="text-secondary hover:text-primary cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {upiError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>{upiError}</span>
                </div>
              )}

              <form onSubmit={handleAddUpiSubmit} className="space-y-4">
                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                    UPI App Provider
                  </label>
                  <select
                    value={upiApp}
                    onChange={(e) => setUpiApp(e.target.value as any)}
                    className="w-full border border-outline-variant p-3 text-xs bg-white focus:border-primary focus:outline-none"
                  >
                    <option value="Google Pay">Google Pay (GPay)</option>
                    <option value="PhonePe">PhonePe</option>
                    <option value="Paytm">Paytm</option>
                    <option value="BHIM">BHIM UPI</option>
                    <option value="UPI">Other Bank UPI</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                    UPI ID / VPA
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="mobile@okhdfcbank or user@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full border border-outline-variant p-3 text-sm focus:border-primary focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Naman Jain"
                    value={upiHolder}
                    onChange={(e) => setUpiHolder(e.target.value)}
                    className="w-full border border-outline-variant p-3 text-sm focus:border-primary focus:outline-none font-medium"
                  />
                </div>

                <label className="flex items-center gap-2 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDefaultUpi}
                    onChange={(e) => setIsDefaultUpi(e.target.checked)}
                    className="accent-primary"
                  />
                  <span className="font-body-md text-xs text-secondary">Set as default UPI</span>
                </label>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddUpiOpen(false)}
                    className="px-5 py-2.5 border border-outline-variant text-secondary text-xs uppercase hover:bg-surface transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary text-white text-xs uppercase font-bold tracking-wider hover:bg-black/90 transition-all cursor-pointer shadow-sm"
                  >
                    Save UPI ID
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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

export default PaymentMethodsPage;
