import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { useAuth } from '../context/AuthContext';
import { orderService, OrderData } from '../services/orderService';
import { CreditCard, LogOut, ArrowRight, Download, Truck, RotateCcw, AlertCircle } from 'lucide-react';

export const OrderDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { logout, isAuthenticated } = useAuth();

  const [order, setOrder] = useState<OrderData | null>(location.state?.order || null);
  const [isLoading, setIsLoading] = useState<boolean>(!order);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const orderId = searchParams.get('id');

  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated) {
      if (orderId) {
        setIsLoading(true);
        orderService
          .getOrderById(orderId)
          .then((data) => {
            if (isMounted) {
              setOrder(data);
              setIsLoading(false);
            }
          })
          .catch((err) => {
            if (isMounted) {
              setErrorMessage(err.message || 'Order not found');
              setIsLoading(false);
            }
          });
      } else if (!order) {
        // Load latest order if available
        setIsLoading(true);
        orderService
          .getMyOrders()
          .then((orders) => {
            if (isMounted) {
              if (orders.length > 0) {
                setOrder(orders[0]);
              }
              setIsLoading(false);
            }
          })
          .catch(() => {
            if (isMounted) setIsLoading(false);
          });
      }
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [orderId, isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const items = order?.items || [];
  const shippingAddr = order?.shippingAddress;
  const billingAddr = order?.billingAddress || shippingAddr;

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
            { label: 'My Orders', href: '/my-orders' },
            { label: 'Order Details' },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Sidebar Navigation (3 Columns) */}
          <aside className="md:col-span-3 space-y-8">
            <div className="space-y-6">
              <h3 className="font-label-caps text-xs text-secondary uppercase tracking-widest">MY ACCOUNT</h3>
              <nav className="flex flex-col gap-1 border-l border-outline-variant">
                <Link
                  to="/dashboard"
                  className="pl-6 py-3 font-label-caps text-xs uppercase text-secondary hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-orders"
                  className="pl-6 py-3 font-label-caps text-xs uppercase text-primary font-bold border-l-2 border-primary -ml-[1px]"
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
                <button
                  onClick={handleLogout}
                  className="pl-6 py-3 mt-4 font-label-caps text-xs uppercase text-red-600 hover:opacity-70 text-left cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </nav>
            </div>

            {/* Help Concierge Card */}
            <div className="p-6 bg-surface-container-low border border-outline-variant">
              <p className="font-label-caps text-xs uppercase tracking-widest mb-2 font-semibold">NEED HELP?</p>
              <p className="font-body-md text-secondary mb-4 text-xs">
                Our concierge is available 24/7 for any inquiries regarding your orders.
              </p>
              <Link to="/help-support" className="block text-primary font-label-caps text-[10px] underline tracking-widest">
                CONTACT SUPPORT
              </Link>
            </div>
          </aside>

          {/* Main Content Area: Order Details (9 Columns) */}
          <section className="md:col-span-9 space-y-12">
            <header className="mb-8">
              <h1 className="font-headline-lg text-3xl md:text-4xl text-primary mb-2">Order Details</h1>
              <p className="font-body-md text-secondary text-sm">View complete real-time information about your order.</p>
            </header>

            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {order ? (
              <>
                {/* Order Info Card */}
                <div className="bg-white border border-outline-variant p-6 md:p-8 shadow-sm">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="font-label-caps text-[10px] text-secondary uppercase mb-1">ORDER NUMBER</p>
                      <p className="font-body-md font-semibold text-primary font-mono">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="font-label-caps text-[10px] text-secondary uppercase mb-1">DATE</p>
                      <p className="font-body-md font-semibold text-primary">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="font-label-caps text-[10px] text-secondary uppercase mb-1">STATUS</p>
                      <span className="inline-block px-3 py-1 bg-primary text-white font-label-caps text-[9px] uppercase tracking-widest font-bold">
                        {order.orderStatus}
                      </span>
                    </div>
                    <div>
                      <p className="font-label-caps text-[10px] text-secondary uppercase mb-1">TOTAL AMOUNT</p>
                      <p className="font-body-md font-semibold text-primary">
                        ₹{(order.pricing?.total || order.total || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="mt-6 pt-6 border-t border-outline-variant flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-4">
                      <button
                        onClick={() => orderService.downloadInvoice(order._id)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-button text-[11px] uppercase tracking-widest hover:bg-black transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Tax Invoice
                      </button>
                      <button
                        onClick={() => navigate(`/track-order?id=${order.orderNumber}`)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 border border-primary text-primary font-button text-[11px] uppercase tracking-widest hover:bg-surface-container-low transition-all cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" /> Track Courier Dispatch
                      </button>
                    </div>
                    {order.trackingNumber && (
                      <p className="font-mono text-xs text-secondary">
                        AWB / Tracking: <span className="text-primary font-bold">{order.trackingNumber}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-6">
                  <h2 className="font-label-caps text-xs uppercase tracking-widest text-primary font-semibold">
                    ITEMS PURCHASED ({items.length})
                  </h2>

                  {items.map((item, idx) => (
                    <div
                      key={item._id || idx}
                      className="flex flex-col md:flex-row gap-6 items-start border-b border-outline-variant pb-8 bg-white p-6 border shadow-sm"
                    >
                      <div className="w-28 h-36 bg-surface-container shrink-0 overflow-hidden border border-outline-variant">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-headline-md text-xl text-primary">{item.name}</h3>
                          <p className="font-body-md font-semibold text-primary">
                            ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                          </p>
                        </div>
                        <p className="font-body-md text-secondary text-xs mb-1">
                          Size: {item.size || 'M'} • Color: {item.color || 'Standard'} • Qty: {item.quantity}
                        </p>
                        <div className="flex gap-6 mt-4">
                          <button
                            onClick={() => navigate('/cart')}
                            className="font-label-caps text-[10px] uppercase tracking-widest border-b border-primary pb-1 hover:opacity-60 transition-opacity cursor-pointer"
                          >
                            BUY AGAIN
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & Billing Side-by-side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {shippingAddr && (
                    <div className="space-y-3 bg-white p-6 border border-outline-variant shadow-sm">
                      <h4 className="font-label-caps text-xs uppercase tracking-widest text-primary font-semibold">
                        SHIPPING ADDRESS
                      </h4>
                      <div className="font-body-md text-secondary text-xs leading-relaxed space-y-1">
                        <p className="text-primary font-bold text-sm">{shippingAddr.fullName}</p>
                        <p>{shippingAddr.addressLine1}</p>
                        {shippingAddr.addressLine2 && <p>{shippingAddr.addressLine2}</p>}
                        <p>
                          {shippingAddr.city}, {shippingAddr.state} {shippingAddr.postalCode}
                        </p>
                        <p>{shippingAddr.country || 'India'}</p>
                        <p className="pt-2 text-primary font-mono">Tel: +91 {shippingAddr.phone}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 bg-white p-6 border border-outline-variant shadow-sm">
                    <h4 className="font-label-caps text-xs uppercase tracking-widest text-primary font-semibold">
                      PAYMENT INFORMATION
                    </h4>
                    <div className="font-body-md text-secondary text-xs leading-relaxed space-y-1">
                      <p className="text-primary font-bold text-sm uppercase">Method: {order.paymentMethod?.replace(/_/g, ' ')}</p>
                      <p className="uppercase">Payment Status: <span className="font-bold text-primary">{order.paymentStatus}</span></p>
                      <p>Currency: INR (₹)</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white border border-outline-variant p-16 text-center space-y-4">
                <p className="text-secondary text-sm">No order selected.</p>
                <Link
                  to="/my-orders"
                  className="inline-block px-6 py-3 bg-primary text-white font-button text-xs uppercase tracking-widest hover:bg-black transition-all"
                >
                  View All Orders
                </Link>
              </div>
            )}
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

export default OrderDetailsPage;
