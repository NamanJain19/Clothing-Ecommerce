import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { orderService, OrderData } from '../services/orderService';
import { Check, Truck, Download, ShoppingBag, ArrowRight } from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<OrderData | null>(location.state?.order || null);

  const recommendedItems = [
    {
      id: 'rec-os-1',
      name: 'The Sculptural Tote',
      category: 'Accessories',
      price: 89000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCv0wEzJe5lgd18aSDdelsFIgyNHx3IlmTkhrep-hr0ZrkvHxHCy-mDc1qTRb0XSmxlMLo3RQqlOOFCEvVkOAspGE0p-fcsid9vH2kj_YenEEa9EKjMF4PgNNWgNIxcys41tJQwxuqEIQgyUUpsp4qAfV2U2O_eaGfdm1q3pcZ6qv2F14OK1sTA0c-kiCjXQwWZt_Mn2fVV6dTOOkTNL3UBELedcCwpYdPd50VCImK4-pBR4YDKS3urLg',
    },
    {
      id: 'rec-os-2',
      name: 'Silk Wool Blazer',
      category: 'Outerwear',
      price: 125000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2k1OdC5f9vNEWHJg90GYKQDsjqDhL1VXz3T6GIneJkCRhOLRl5wDFRTwJGRbDnXFkVWDnLYCy3YESBf346NOTT4ynJKNa6oxv0500Wg45iF0WHmnsmWjftl54CfvPJ5_pLYeeaqjXd9ahhS5KcVtrmQzrhZrr2JBRIG89C85ApVyjtrJp9NrKxMBA0qjRtwm_gj8A1gbbDXJEZG-_H454v8bVudfNPpzfyN26j0oRdD33oQh5NwB7FQ',
    },
    {
      id: 'rec-os-3',
      name: 'Obsidian Frames',
      category: 'Eyewear',
      price: 42000,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChWtK4Jqgbe69Z2e30Hu20pWFJtlWlm4e_XCDag717sxlgsRHE3HyTCoatJDhMQNMgg9qWufq2u53hMfeK4prCqj0jZgbnbHzpe7IHBVUqk5RGoTZaBWTPIAztRjl4TXr8UbkYRMinf1dNAVp2JtQI02v6bzS6YdlRCub0OcT2x6sWjmhMLRXQA_Y50D_a6KPmNk-m_VIL3vOd6JNX1Dpn_FHAEKXgxQFQiSuiTh-l5nXSzv9FPTvrbA',
    },
  ];

  const formatPaymentMethod = (method?: string) => {
    switch (method) {
      case 'cash_on_delivery': return 'Cash / Card on Delivery';
      case 'credit_debit_card': return 'Credit / Debit Card (Secure SSL)';
      case 'net_banking': return 'Net Banking';
      case 'upi': return 'UPI / Instant QR';
      default: return 'Instant Payment';
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md antialiased selection:bg-primary selection:text-white">
      {/* Shared Master Navbar */}
      <Navbar />

      <main className="mt-20 px-margin-mobile md:px-margin-desktop py-section-gap max-w-container-max mx-auto">
        {/* Success Header */}
        <section className="text-center mb-16">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 border-2 border-primary flex items-center justify-center rounded-full bg-white shadow-sm">
              <Check className="w-10 h-10 text-primary stroke-[2.5]" />
            </div>
          </div>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-4">
            Order Confirmed
          </h1>
          <p className="font-body-lg text-body-lg text-secondary max-w-xl mx-auto">
            Thank you for your patronage. Your order has been placed in our atelier system and is being prepared for dispatch.
          </p>
        </section>

        {/* Order Detail Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
          {/* Details Column (8 Columns) */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8 border border-outline-variant p-8 bg-white shadow-sm">
            <div>
              <p className="font-label-caps text-[10px] uppercase text-secondary mb-2">Order Number</p>
              <p className="font-body-md font-semibold text-primary font-mono">{order?.orderNumber || 'MNL-89234'}</p>
            </div>
            <div>
              <p className="font-label-caps text-[10px] uppercase text-secondary mb-2">Order Date</p>
              <p className="font-body-md font-semibold text-primary">
                {order?.createdAt
                  ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Today'}
              </p>
            </div>
            <div>
              <p className="font-label-caps text-[10px] uppercase text-secondary mb-2">Payment Method</p>
              <p className="font-body-md font-semibold text-primary">
                {formatPaymentMethod(order?.paymentMethod)}
              </p>
            </div>
            <div>
              <p className="font-label-caps text-[10px] uppercase text-secondary mb-2">Total Amount</p>
              <p className="font-body-md font-semibold text-primary">
                ₹{(order?.pricing?.total || 31400).toLocaleString('en-IN')}
              </p>
            </div>

            {/* Shipping Address inside Grid */}
            <div className="col-span-2 md:col-span-4 pt-8 border-t border-outline-variant">
              <p className="font-label-caps text-[10px] uppercase text-secondary mb-3">Shipping Address</p>
              <address className="not-italic font-body-md text-primary leading-relaxed text-sm">
                {order?.shippingAddress ? (
                  <>
                    <span className="font-bold">{order.shippingAddress.fullName}</span><br />
                    {order.shippingAddress.addressLine1}
                    {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.country || 'India'} (Mob: +91 {order.shippingAddress.phone})
                  </>
                ) : (
                  <>
                    Aarav Sharma<br />
                    Plot 42, Bandra West, Linking Road<br />
                    Mumbai, Maharashtra 400050<br />
                    India (Mob: +91 98765 43210)
                  </>
                )}
              </address>
            </div>

            {/* Ordered Items Preview if available */}
            {order?.items && order.items.length > 0 && (
              <div className="col-span-2 md:col-span-4 pt-8 border-t border-outline-variant">
                <p className="font-label-caps text-[10px] uppercase text-secondary mb-4">Purchased Pieces</p>
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-12 h-14 object-cover border border-outline-variant" />
                        )}
                        <div>
                          <p className="font-headline-md font-bold text-primary">{item.name}</p>
                          <p className="text-secondary text-[10px] uppercase">{item.size || 'M'} • {item.color || 'Standard'} • Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-body-md font-bold text-primary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Delivery & Tracking Card (4 Columns) */}
          <div className="md:col-span-4 border border-outline-variant p-8 bg-white flex flex-col justify-between shadow-sm">
            <div>
              <p className="font-label-caps text-[10px] uppercase text-secondary mb-4">Delivery Info</p>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-body-md font-semibold text-primary">Estimated Delivery</p>
                  <p className="font-body-md text-secondary">
                    {order?.estimatedDelivery || '3-5 Business Days (Standard Delivery)'}
                  </p>
                </div>
                <div>
                  <p className="font-body-md font-semibold text-primary">Courier Partner</p>
                  <p className="font-body-md text-secondary">Blue Dart / Delhivery Express</p>
                </div>
                <div>
                  <p className="font-body-md font-semibold text-primary">Status</p>
                  <p className="font-body-md text-primary font-mono text-xs uppercase bg-surface-container-low px-2 py-1 inline-block mt-1">
                    {order?.orderStatus || 'Confirmed'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 space-y-3">
              {order?._id && (
                <button
                  onClick={() => orderService.downloadInvoice(order._id)}
                  className="w-full bg-primary text-white font-button text-xs py-3.5 uppercase tracking-widest hover:bg-black/90 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Tax Invoice
                </button>
              )}
              <button
                onClick={() => navigate(order?.orderNumber ? `/track-order?id=${order.orderNumber}` : '/track-order')}
                className="w-full border border-primary text-primary font-button text-xs py-3.5 uppercase tracking-widest hover:bg-surface-container-low transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" /> Track Courier Dispatch
              </button>
              <button
                onClick={() => navigate('/my-orders')}
                className="w-full border border-outline-variant text-secondary font-button text-xs py-3 uppercase tracking-widest hover:border-primary hover:text-primary transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                View Order History
              </button>
              <button
                onClick={() => navigate('/collections')}
                className="w-full bg-surface-container text-primary font-button text-xs py-3 uppercase tracking-widest hover:bg-surface-container-high transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Continue Shopping
              </button>
            </div>
          </div>
        </section>

        {/* Recommended Archive Essentials */}
        <section>
          <div className="flex justify-between items-end mb-8 border-b border-outline-variant pb-4">
            <div>
              <span className="font-label-caps text-[10px] tracking-[0.4em] uppercase text-secondary mb-1 block">
                Selected for you
              </span>
              <h2 className="font-display-lg text-3xl">Complete The Wardrobe</h2>
            </div>
            <Link
              to="/new-arrivals"
              className="font-label-caps text-[11px] uppercase tracking-widest border-b border-primary pb-1 hover:opacity-60 transition-opacity"
            >
              View New Season →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {recommendedItems.map((item) => (
              <div key={item.id} onClick={() => navigate('/new-arrivals')} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-surface-container overflow-hidden mb-4 border border-outline-variant">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="font-label-caps text-[10px] text-secondary uppercase">{item.category}</p>
                <h4 className="font-headline-md text-base font-bold text-primary">{item.name}</h4>
                <p className="font-body-md text-sm font-semibold text-primary mt-1">₹{item.price.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Shared Master Footer */}
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
