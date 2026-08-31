import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { orderService, OrderData } from '../services/orderService';
import { addressService } from '../services/addressService';
import {
  Camera,
  ShoppingBag,
  Clock,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  Lock,
  EyeOff,
  CheckCircle,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { wishlistCount } = useWishlist();

  const [orders, setOrders] = useState<OrderData[]>([]);
  const [addressCount, setAddressCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated) {
      setIsLoading(true);
      Promise.all([
        orderService.getMyOrders().catch(() => []),
        addressService.getAddresses().catch(() => []),
      ]).then(([ordersData, addrsData]) => {
        if (isMounted) {
          setOrders(ordersData);
          setAddressCount(addrsData.length);
          setIsLoading(false);
        }
      });
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const activeOrdersCount = orders.filter((o) =>
    ['pending', 'processing', 'confirmed', 'shipped', 'out_for_delivery'].includes(o.orderStatus)
  ).length;

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md antialiased selection:bg-primary selection:text-white">
      {/* Shared Master Navbar */}
      <Navbar />

      <main className="pt-24 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'My Account' },
          ]}
        />

        {/* Page Header */}
        <header className="mb-12">
          <h1 className="font-headline-lg text-display-lg-mobile md:text-display-lg mb-2">
            My Account
          </h1>
          <p className="font-body-lg text-body-lg text-secondary">
            Manage your profile, orders, addresses, and preferences.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Account Navigation Sidebar (3 Columns) */}
          <aside className="md:col-span-3">
            <nav className="flex flex-col gap-1 border-l border-outline-variant">
              <Link
                to="/dashboard"
                className="pl-6 py-3.5 font-label-caps text-xs uppercase transition-all duration-300 border-l-2 border-primary -ml-[1px] text-primary font-bold"
              >
                Dashboard
              </Link>
              <Link
                to="/my-orders"
                className="pl-6 py-3.5 font-label-caps text-xs uppercase transition-all duration-300 border-l-2 border-transparent -ml-[1px] text-secondary hover:text-primary"
              >
                My Orders
              </Link>
              <Link
                to="/track-order"
                className="pl-6 py-3.5 font-label-caps text-xs uppercase transition-all duration-300 border-l-2 border-transparent -ml-[1px] text-secondary hover:text-primary"
              >
                Track Orders
              </Link>
              <Link
                to="/wishlist"
                className="pl-6 py-3.5 font-label-caps text-xs uppercase transition-all duration-300 border-l-2 border-transparent -ml-[1px] text-secondary hover:text-primary"
              >
                Wishlist
              </Link>
              <Link
                to="/saved-addresses"
                className="pl-6 py-3.5 font-label-caps text-xs uppercase transition-all duration-300 border-l-2 border-transparent -ml-[1px] text-secondary hover:text-primary"
              >
                Saved Addresses
              </Link>
              <Link
                to="/payment-methods"
                className="pl-6 py-3.5 font-label-caps text-xs uppercase transition-all duration-300 border-l-2 border-transparent -ml-[1px] text-secondary hover:text-primary"
              >
                Payment Methods
              </Link>
              <Link
                to="/account-settings"
                className="pl-6 py-3.5 font-label-caps text-xs uppercase transition-all duration-300 border-l-2 border-transparent -ml-[1px] text-secondary hover:text-primary"
              >
                Account Settings
              </Link>
              <Link
                to="/notifications"
                className="pl-6 py-3.5 font-label-caps text-xs uppercase transition-all duration-300 border-l-2 border-transparent -ml-[1px] text-secondary hover:text-primary"
              >
                Notifications
              </Link>
              <Link
                to="/help-support"
                className="pl-6 py-3.5 font-label-caps text-xs uppercase transition-all duration-300 border-l-2 border-transparent -ml-[1px] text-secondary hover:text-primary"
              >
                Help & Support
              </Link>
              <button
                onClick={handleLogout}
                className="pl-6 py-3.5 mt-6 font-label-caps text-xs uppercase transition-all duration-300 border-l-2 border-transparent -ml-[1px] text-red-600 hover:opacity-70 text-left cursor-pointer flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </nav>
          </aside>

          {/* Right Column: Dashboard Main Content (9 Columns) */}
          <div className="md:col-span-9 space-y-12">
            {/* Profile Card */}
            <section className="border border-outline-variant p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 bg-white shadow-sm">
              <div className="relative">
                <div className="w-28 h-28 rounded-full border border-outline-variant overflow-hidden bg-surface-container flex items-center justify-center">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName || 'Client Avatar'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-display-lg text-3xl text-primary font-bold">
                      {user?.firstName?.[0] || 'M'}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1 text-center md:text-left space-y-1">
                <h2 className="font-headline-md text-2xl md:text-3xl text-primary font-bold">
                  {user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Private Client'}
                </h2>
                <p className="font-body-md text-secondary text-sm font-medium">{user?.email || 'client@monolithluxury.com'}</p>
                <p className="font-body-md text-secondary text-xs">{user?.phone ? `+91 ${user.phone}` : 'Monolith Private Client'}</p>
              </div>
              <button
                onClick={() => navigate('/account-settings')}
                className="bg-primary text-white px-7 py-3.5 font-button text-xs uppercase tracking-widest hover:bg-black/90 transition-all cursor-pointer shadow-sm"
              >
                Edit Profile
              </button>
            </section>

            {/* Account Overview Grid */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                onClick={() => navigate('/my-orders')}
                className="border border-outline-variant p-6 text-center group hover:bg-primary transition-colors duration-500 bg-white cursor-pointer"
              >
                <p className="font-label-caps text-[10px] text-secondary uppercase tracking-widest mb-2 group-hover:text-white/80">
                  Total Orders
                </p>
                <p className="font-headline-md text-3xl group-hover:text-white">{orders.length}</p>
              </div>
              <div
                onClick={() => navigate('/my-orders')}
                className="border border-outline-variant p-6 text-center group hover:bg-primary transition-colors duration-500 bg-white cursor-pointer"
              >
                <p className="font-label-caps text-[10px] text-secondary uppercase tracking-widest mb-2 group-hover:text-white/80">
                  Active Orders
                </p>
                <p className="font-headline-md text-3xl group-hover:text-white">{activeOrdersCount}</p>
              </div>
              <div
                onClick={() => navigate('/wishlist')}
                className="border border-outline-variant p-6 text-center group hover:bg-primary transition-colors duration-500 bg-white cursor-pointer"
              >
                <p className="font-label-caps text-[10px] text-secondary uppercase tracking-widest mb-2 group-hover:text-white/80">
                  Wishlist Items
                </p>
                <p className="font-headline-md text-3xl group-hover:text-white">{wishlistCount}</p>
              </div>
              <div
                onClick={() => navigate('/saved-addresses')}
                className="border border-outline-variant p-6 text-center group hover:bg-primary transition-colors duration-500 bg-white cursor-pointer"
              >
                <p className="font-label-caps text-[10px] text-secondary uppercase tracking-widest mb-2 group-hover:text-white/80">
                  Saved Addresses
                </p>
                <p className="font-headline-md text-3xl group-hover:text-white">{addressCount}</p>
              </div>
            </section>

            {/* Recent Orders */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <h3 className="font-headline-md text-2xl text-primary">Recent Orders</h3>
                <Link
                  to="/my-orders"
                  className="font-label-caps text-xs tracking-widest border-b border-primary hover:opacity-60 transition-opacity uppercase"
                >
                  VIEW ALL ({orders.length})
                </Link>
              </div>
              <div className="overflow-x-auto border border-outline-variant bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th className="p-4 font-label-caps text-[10px] uppercase text-secondary">Order #</th>
                      <th className="p-4 font-label-caps text-[10px] uppercase text-secondary">Date</th>
                      <th className="p-4 font-label-caps text-[10px] uppercase text-secondary">Status</th>
                      <th className="p-4 font-label-caps text-[10px] uppercase text-secondary">Total</th>
                      <th className="p-4 font-label-caps text-[10px] uppercase text-secondary text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-surface-container-low transition-colors">
                          <td className="p-4 font-body-md font-medium text-sm text-primary font-mono">{order.orderNumber}</td>
                          <td className="p-4 font-body-md text-secondary text-xs">
                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="p-4 font-body-md">
                            <span className="px-3 py-1 bg-primary text-white font-label-caps text-[9px] uppercase tracking-widest font-bold">
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="p-4 font-body-md text-sm font-semibold">₹{(order.pricing?.total || order.total || 0).toLocaleString('en-IN')}</td>
                          <td className="p-4 text-right space-x-4">
                            <button
                              onClick={() => navigate('/order-success', { state: { order } })}
                              className="font-button text-xs uppercase text-primary border-b border-primary hover:opacity-60 transition-opacity cursor-pointer"
                            >
                              Receipt
                            </button>
                            <button
                              onClick={() => navigate('/track-order')}
                              className="font-button text-xs uppercase text-primary border-b border-primary hover:opacity-60 transition-opacity cursor-pointer"
                            >
                              Track
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-secondary text-sm">
                          No orders placed yet. Explore our curated volumes.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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

export default DashboardPage;
