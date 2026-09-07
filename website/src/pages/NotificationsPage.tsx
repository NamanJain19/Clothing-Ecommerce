import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { useAuth } from '../context/AuthContext';
import { notificationService, NotificationItem } from '../services/notificationService';
import { AccountNav } from '../components/account/AccountNav';
import {
  Truck,
  Heart,
  Megaphone,
  ShieldAlert,
  CheckCircle2,
  BellOff,
  LogOut,
  ArrowRight,
  Trash2,
  Check,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.warn('Failed to load notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.warn('Failed to mark all as read:', err);
    }
  };

  const handleToggleRead = async (id: string) => {
    try {
      const updated = await notificationService.markAsRead(id);
      setNotifications(notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.warn('Failed to mark read:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (err) {
      console.warn('Failed to delete notification:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Truck className="w-5 h-5 text-primary" />;
      case 'inventory':
      case 'wishlist':
        return <Heart className="w-5 h-5 text-primary" />;
      case 'return':
        return <Megaphone className="w-5 h-5 text-primary" />;
      case 'system':
      case 'customer':
      default:
        return <ShieldAlert className="w-5 h-5 text-primary" />;
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
            { label: 'Notifications' },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Account Sidebar Navigation (3 Columns) */}
          <aside className="col-span-1 lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <AccountNav activePath="/notifications" />
            </div>
          </aside>

          {/* Main Content Area: Notifications (9 Columns) */}
          <section className="col-span-12 lg:col-span-9">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 border-b border-outline-variant pb-6 gap-4">
              <div>
                <h1 className="font-headline-lg text-3xl md:text-4xl text-primary">Notifications</h1>
                <p className="font-body-md text-secondary text-sm mt-1">
                  Stay updated on orders, bespoke releases, and private concierge alerts.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleMarkAllRead}
                  className="font-label-caps text-xs uppercase tracking-widest text-primary border border-primary px-4 py-2 hover:bg-primary hover:text-white transition-colors cursor-pointer"
                >
                  Mark All as Read
                </button>
              </div>
            </div>

            {/* Notification Feed */}
            {notifications.length > 0 ? (
              <div className="bg-white border border-outline-variant divide-y divide-outline-variant shadow-sm">
                {notifications.map((item) => (
                  <div
                    key={item._id}
                    className={`p-6 flex flex-col md:flex-row gap-6 items-start justify-between transition-colors ${
                      !item.isRead ? 'bg-surface-container-low/40' : 'hover:bg-surface-container-low/20'
                    }`}
                  >
                    <div className="flex gap-4 items-start">
                      <div className="p-3 bg-surface-container border border-outline-variant/60 rounded-full shrink-0">
                        {getIcon(item.type)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-headline-md text-base font-semibold text-primary">{item.title}</h3>
                          {!item.isRead && (
                            <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                        <p className="font-body-md text-xs text-secondary leading-relaxed max-w-2xl">
                          {item.message}
                        </p>
                        <p className="font-label-caps text-[10px] text-secondary/80 uppercase pt-1 font-mono">
                          {new Date(item.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                      {!item.isRead && (
                        <button
                          onClick={() => handleToggleRead(item._id)}
                          className="font-label-caps text-xs uppercase text-primary border-b border-primary hover:opacity-60 transition-opacity cursor-pointer"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-secondary hover:text-red-600 transition-colors cursor-pointer"
                        aria-label="Delete Notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-outline-variant p-16 text-center space-y-4">
                <BellOff className="w-12 h-12 text-secondary/40 mx-auto" />
                <h3 className="font-headline-md text-xl text-primary">No Notifications</h3>
                <p className="font-body-md text-secondary text-sm max-w-md mx-auto">
                  You are all caught up. Any updates regarding your orders and private privileges will appear here.
                </p>
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

export default NotificationsPage;
