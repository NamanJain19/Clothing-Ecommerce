import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { useAuth } from '../context/AuthContext';
import { orderService, OrderData } from '../services/orderService';
import { ChevronDown, LogOut, Package, ArrowRight, Truck } from 'lucide-react';

export const MyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'transit' | 'completed'>('all');
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated) {
      setIsLoading(true);
      orderService.getMyOrders()
        .then((data) => {
          if (isMounted) {
            setOrders(data);
          }
        })
        .catch((err) => {
          console.warn('Failed to load orders from API:', err);
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'transit') {
      return ['pending', 'processing', 'confirmed', 'shipped', 'out_for_delivery'].includes(o.orderStatus);
    }
    if (activeTab === 'completed') {
      return o.orderStatus === 'delivered';
    }
    return true;
  });

  const formatStatus = (status: string) => {
    switch (status) {
      case 'delivered': return { label: 'Delivered', color: 'bg-emerald-500' };
      case 'shipped':
      case 'out_for_delivery': return { label: 'In Transit', color: 'bg-amber-500' };
      case 'processing':
      case 'confirmed': return { label: 'Confirmed', color: 'bg-blue-500' };
      case 'cancelled': return { label: 'Cancelled', color: 'bg-rose-500' };
      default: return { label: 'Pending', color: 'bg-zinc-400' };
    }
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
            { label: 'My Orders' },
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
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="pl-6 py-3 mt-6 font-label-caps text-xs uppercase text-red-600 hover:opacity-70 text-left cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content Area: My Orders (9 Columns) */}
          <section className="col-span-12 lg:col-span-9 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-outline-variant pb-6">
              <div>
                <p className="font-label-caps text-[10px] uppercase tracking-widest text-secondary mb-1">
                  History
                </p>
                <h1 className="font-headline-lg text-3xl md:text-4xl text-primary">Order Archives</h1>
              </div>
              <div className="mt-6 md:mt-0 flex gap-6">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`font-label-caps text-xs uppercase pb-1 cursor-pointer transition-colors ${
                    activeTab === 'all'
                      ? 'text-primary border-b-2 border-primary font-bold'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  All Orders ({orders.length})
                </button>
                <button
                  onClick={() => setActiveTab('transit')}
                  className={`font-label-caps text-xs uppercase pb-1 cursor-pointer transition-colors ${
                    activeTab === 'transit'
                      ? 'text-primary border-b-2 border-primary font-bold'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  In Transit
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`font-label-caps text-xs uppercase pb-1 cursor-pointer transition-colors ${
                    activeTab === 'completed'
                      ? 'text-primary border-b-2 border-primary font-bold'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* Orders List / Loading / Empty */}
            {isLoading ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="font-label-caps text-xs uppercase tracking-widest text-secondary">
                  Loading Order Archives...
                </p>
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="space-y-6">
                {filteredOrders.map((order) => {
                  const firstItem = order.items?.[0];
                  const statusInfo = formatStatus(order.orderStatus);
                  return (
                    <div
                      key={order._id}
                      className="border border-outline-variant p-6 md:p-8 bg-white flex flex-col md:flex-row gap-6 hover:border-primary transition-all duration-300 shadow-sm"
                    >
                      <div className="w-full md:w-32 h-40 bg-surface-container shrink-0 overflow-hidden border border-outline-variant">
                        <img
                          src={firstItem?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-Nfjeq46m2xJ4GymhY-CWVY9EVjOojA372rE-6bRT6KWYPqn6NPSyYDtDgR_WS3i6DV8xJUf6iqw7lMT59PNsRlHn2hMwtSINciz2CaydrVqGxBArBq1Vj7l1Jk_rZQ292u5GgHodW_XB8RBw9r8AXCeL9ou5-aIyL8_-gFaH6rwBXLI5AErv7DWmcfuhABNuNi3CiNvpCSluBUrdj0pj3h6pHh0bh65f5GsPFj7oPPUYJI2C9OqaEw'}
                          alt={firstItem?.name || 'Monolith Piece'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        <div className="space-y-1">
                          <p className="font-label-caps text-[10px] text-secondary font-mono">Order #{order.orderNumber}</p>
                          <p className="font-headline-md text-xl text-primary">{firstItem?.name || 'Luxury Order'}</p>
                          <p className="font-body-md text-secondary text-xs">
                            Ordered: {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-label-caps text-[10px] text-secondary">Status</p>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${statusInfo.color}`} />
                            <p className="font-body-md text-sm font-semibold text-primary">{statusInfo.label}</p>
                          </div>
                          <p className="font-body-md text-secondary text-xs">
                            {order.items?.length || 1} {(order.items?.length || 1) === 1 ? 'Piece' : 'Pieces'} in parcel
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-label-caps text-[10px] text-secondary">Total</p>
                          <p className="font-headline-md text-xl font-bold text-primary">
                            ₹{(order.pricing?.total || 0).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 justify-center">
                        <button
                          onClick={() => navigate(`/order-details?id=${order._id}`, { state: { order } })}
                          className="font-button text-xs uppercase bg-primary text-white px-5 py-2.5 hover:bg-black/90 transition-opacity cursor-pointer shadow-sm text-center"
                        >
                          Order Details
                        </button>
                        <button
                          onClick={() => navigate('/order-success', { state: { order } })}
                          className="font-button text-xs uppercase border border-primary text-primary px-5 py-2.5 hover:bg-primary hover:text-white transition-all cursor-pointer text-center"
                        >
                          Receipt
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center space-y-6 border border-dashed border-outline-variant bg-white p-12">
                <Package className="w-12 h-12 text-outline mx-auto stroke-1" />
                <div className="space-y-2">
                  <h3 className="font-headline-md text-2xl text-primary">No Orders Found</h3>
                  <p className="font-body-md text-secondary text-sm max-w-md mx-auto">
                    You haven't placed any orders yet. Discover timeless pieces in our curated archive.
                  </p>
                </div>
                <Link
                  to="/collections"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-button text-xs uppercase tracking-widest hover:bg-black transition-all"
                >
                  <span>Explore Collections</span>
                  <ArrowRight className="w-4 h-4" />
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

export default MyOrdersPage;
