import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { CategoryProductCard } from '../components/category/CategoryProductCard';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { QuickViewModal } from '../components/ui/QuickViewModal';
import { FilterDrawer } from '../components/ui/FilterDrawer';
import { savedForLaterItems } from '../data/cartData';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { DEFAULT_FALLBACK_IMAGE, normalizeImageUrl } from '../utils/imageUtils';
import { Plus, Minus, Heart, ShieldCheck, Truck, RefreshCw, Zap, Lock, CreditCard } from 'lucide-react';

export const ShoppingCartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items: cartItems, subtotal, updateQuantity, removeFromCart } = useCart();
  const [isGiftOrder, setIsGiftOrder] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<Product | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const freeShippingThreshold = 4900;
  const awayFromFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercentage = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleUpdateQuantity = (id: string, delta: number) => {
    const targetItem = cartItems.find((item) => item.id === id);
    if (targetItem) {
      updateQuantity(id, targetItem.quantity + delta);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md antialiased selection:bg-primary selection:text-white">
      {/* Shared Master Navbar */}
      <Navbar />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-section-gap">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shopping Cart' },
          ]}
        />

        {/* Page Header */}
        <header className="mb-12 text-center">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">
            Shopping Cart
          </h1>
          <p className="font-body-lg text-body-lg text-secondary">
            Review your selected items before checkout.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Items & Options (8 Columns) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Free Shipping Progress */}
            <div className="bg-surface-container-low p-8 border border-outline-variant">
              <div className="flex justify-between items-end mb-4">
                <p className="font-label-caps text-label-caps text-primary uppercase">
                  {awayFromFreeShipping > 0
                    ? `You're ₹${awayFromFreeShipping.toLocaleString('en-IN')} away from Free Express Delivery`
                    : 'You have unlocked Complimentary Express Delivery across India!'}
                </p>
                <p className="font-body-md text-secondary font-medium">Subtotal: ₹{subtotal.toLocaleString('en-IN')}</p>
              </div>
              <div className="h-1.5 w-full bg-surface-container-highest overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            {cartItems.length > 0 ? (
              <section className="space-y-10">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row gap-8 pb-10 border-b border-outline-variant"
                  >
                    <div className="w-full md:w-44 aspect-[3/4] overflow-hidden bg-surface-container shrink-0 border border-outline-variant">
                      <img 
                        src={normalizeImageUrl(item.image)} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                        }} 
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-headline-md text-2xl text-primary mb-1">{item.name}</h3>
                          <p className="font-label-caps text-[10px] text-secondary mb-4 uppercase tracking-widest">
                            {item.categoryTag}
                          </p>
                          <div className="space-y-1 text-secondary font-body-md text-sm">
                            <p>Color: {item.color}</p>
                            <p>Size: {item.size}</p>
                          </div>
                        </div>
                        <p className="font-label-caps text-headline-md text-primary text-xl font-semibold">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-8">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-4 border border-outline-variant px-3 py-1 bg-white">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                              className="hover:text-primary transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-body-md px-2 text-sm font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                              className="hover:text-primary transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="flex gap-4 text-secondary font-label-caps text-[10px] uppercase tracking-widest">
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="hover:underline underline-offset-4 transition-all hover:text-primary cursor-pointer"
                            >
                              Remove
                            </button>
                            <button className="hover:underline underline-offset-4 transition-all hover:text-primary cursor-pointer">
                              Save for Later
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            ) : (
              <div className="py-16 text-center border border-outline-variant bg-surface-container-low p-8">
                <h3 className="font-headline-md text-2xl mb-4">Your Shopping Cart is Empty</h3>
                <p className="font-body-md text-secondary mb-8">Discover our latest collections and find something you love.</p>
                <a
                  href="/collections"
                  className="inline-block bg-primary text-on-primary px-10 py-4 font-button text-button uppercase tracking-widest hover:bg-black/80 transition-colors"
                >
                  Explore Collections
                </a>
              </div>
            )}

            {/* Gift Options Collapsible */}
            <section className="py-8 border-b border-outline-variant">
              <label className="flex items-center gap-4 cursor-pointer group mb-4">
                <input
                  type="checkbox"
                  checked={isGiftOrder}
                  onChange={(e) => setIsGiftOrder(e.target.checked)}
                  className="w-5 h-5 border-primary text-primary focus:ring-0 rounded-none cursor-pointer"
                />
                <span className="font-headline-md text-2xl text-primary group-hover:opacity-70 transition-opacity">
                  This order is a gift
                </span>
              </label>

              {isGiftOrder && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={giftWrap}
                        onChange={(e) => setGiftWrap(e.target.checked)}
                        className="border-outline text-primary focus:ring-0 rounded-none"
                      />
                      <span className="font-body-md text-secondary text-sm">Complimentary Monolith Gift Wrap</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="border-outline text-primary focus:ring-0 rounded-none" />
                      <span className="font-body-md text-secondary text-sm">Include Gift Receipt</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="border-outline text-primary focus:ring-0 rounded-none" />
                      <span className="font-body-md text-secondary text-sm">Hide Price on Packing Slip</span>
                    </label>
                  </div>
                  <div className="space-y-4">
                    <textarea
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      className="w-full border-b border-outline-variant focus:border-primary focus:ring-0 bg-transparent py-2 font-body-md text-sm resize-none h-20 placeholder:text-outline"
                      placeholder="Personalized Gift Message (Optional)"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Saved for Later Section */}
            <section className="pt-6">
              <h2 className="font-headline-md text-3xl mb-8">Saved for Later</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {savedForLaterItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="relative group border border-outline-variant bg-white p-4 cursor-pointer"
                  >
                    <div className="aspect-[3/4] bg-surface-container-low overflow-hidden relative mb-4">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h4 className="font-headline-md text-lg text-primary mb-1">{item.name}</h4>
                    <p className="font-label-caps text-[10px] text-secondary mb-4">₹{item.price.toLocaleString('en-IN')}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="w-full bg-primary text-white font-label-caps text-[10px] py-2.5 uppercase tracking-widest hover:bg-black/80 transition-all cursor-pointer"
                    >
                      Move to Cart
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary Sticky Panel (4 Columns) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-8">
            <div className="bg-white border border-outline-variant p-8 shadow-sm">
              <h2 className="font-headline-md text-2xl mb-8 border-b border-outline-variant pb-4">
                Order Summary
              </h2>

              <div className="space-y-4 mb-8 text-sm">
                <div className="flex justify-between text-secondary">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}.00</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Shipping</span>
                  <span className="text-primary font-medium">
                    {subtotal >= freeShippingThreshold ? 'Free' : '₹150.00'}
                  </span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>GST Tax</span>
                  <span className="text-emerald-700 font-medium">Included in Price</span>
                </div>
                <div className="pt-4 border-t border-outline-variant flex justify-between font-headline-md text-2xl text-primary font-semibold">
                  <span>Total</span>
                  <span>₹{(subtotal + (subtotal >= freeShippingThreshold ? 0 : 150)).toLocaleString('en-IN')}.00</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="mb-8">
                <div className="flex gap-2 border-b border-outline-variant pb-1">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:ring-0 py-2 font-body-md uppercase tracking-widest text-xs placeholder:normal-case"
                    placeholder="Promo / Voucher Code"
                  />
                  <button className="font-label-caps text-[11px] text-primary hover:opacity-70 transition-opacity uppercase tracking-widest font-semibold cursor-pointer">
                    Apply
                  </button>
                </div>
              </div>

              {/* Estimated Delivery */}
              <div className="space-y-4 mb-8 bg-surface-container-low p-4 border border-outline-variant/60">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="font-body-md text-xs">
                    <p className="text-primary font-semibold">Estimated Delivery</p>
                    <p className="text-secondary mt-0.5">Tue, 12 Aug – Thu, 14 Aug</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-4">
                <Link
                  to="/checkout"
                  className="w-full block text-center bg-primary text-white py-5 font-button text-button uppercase tracking-widest hover:bg-black/80 transition-colors shadow-md"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  to="/collections"
                  className="w-full block text-center border border-primary py-4 font-button text-[12px] uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Payment Icons */}
              <div className="mt-8 pt-6 border-t border-outline-variant flex justify-center gap-4 text-secondary opacity-60">
                <CreditCard className="w-6 h-6" />
                <Lock className="w-6 h-6" />
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            {/* Trust Badges Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-4 text-center border border-outline-variant">
                <ShieldCheck className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="font-label-caps text-[9px] text-secondary uppercase tracking-wider">Authentic Items</p>
              </div>
              <div className="bg-surface-container-low p-4 text-center border border-outline-variant">
                <Lock className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="font-label-caps text-[9px] text-secondary uppercase tracking-wider">Secure Payment</p>
              </div>
              <div className="bg-surface-container-low p-4 text-center border border-outline-variant">
                <RefreshCw className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="font-label-caps text-[9px] text-secondary uppercase tracking-wider">Free Returns</p>
              </div>
              <div className="bg-surface-container-low p-4 text-center border border-outline-variant">
                <Zap className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="font-label-caps text-[9px] text-secondary uppercase tracking-wider">Express Delivery</p>
              </div>
            </div>
          </aside>
        </div>

        {/* Shared Master Newsletter */}
        <div className="mt-section-gap">
          <NewsletterSection />
        </div>
      </main>

      {/* Shared Master Footer */}
      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal product={selectedQuickViewProduct} onClose={() => setSelectedQuickViewProduct(null)} />

      {/* Filter Drawer */}
      <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
};

export default ShoppingCartPage;
