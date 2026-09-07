import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, ShieldAlert, ShoppingBag, Users, Warehouse, Loader2, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { adminService } from '../../services/adminService';

export interface LiveNotificationItem {
  id: string;
  type: 'order' | 'inventory' | 'customer' | 'system' | 'return' | 'review';
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<LiveNotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getNotifications();
      const rawList = res?.data || [];
      const mapped: LiveNotificationItem[] = rawList.map((n: any) => ({
        id: n._id || n.id,
        type: (n.type || 'system') as LiveNotificationItem['type'],
        title: n.title || 'System Notification',
        message: n.message || '',
        time: n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent',
        unread: n.isRead === false || n.read === false || n.unread === true,
      }));
      setNotifications(mapped);
    } catch (err: any) {
      console.error('Failed to load notifications:', err);
      setError(err.message || 'Unable to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      const unreadList = notifications.filter((n) => n.unread);
      await Promise.all(unreadList.map((n) => adminService.markNotificationRead(n.id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    } catch (err: any) {
      alert(err.message || 'Failed to mark notifications as read.');
    }
  };

  const toggleRead = async (id: string) => {
    try {
      await adminService.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update notification status.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete notification.');
    }
  };

  const getIcon = (type: LiveNotificationItem['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-5 h-5 text-emerald-600" />;
      case 'inventory':
        return <Warehouse className="w-5 h-5 text-amber-600" />;
      case 'customer':
        return <Users className="w-5 h-5 text-blue-600" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1000px] mx-auto w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">
              Operational Notifications
            </h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Real-time security telemetry, high-value acquisition alerts, and stock threshold warnings.
            </p>
          </div>
          {notifications.some((n) => n.unread) && (
            <AdminButton variant="outline" onClick={markAllAsRead}>
              <Check className="w-4 h-4 mr-2" /> Mark All as Read
            </AdminButton>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-outline-variant rounded-xl">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="font-body-md text-sm text-on-surface-variant">Loading notifications from database...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 bg-red-50/50 border border-red-200 rounded-xl text-center px-4">
            <AlertCircle className="w-8 h-8 text-error mb-2" />
            <p className="font-body-md text-sm text-error font-medium">{error}</p>
            <AdminButton variant="outline" className="mt-4" onClick={fetchNotifications}>
              Retry
            </AdminButton>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-outline-variant rounded-xl text-center px-4">
            <Bell className="w-10 h-10 text-on-surface-variant/40 mb-3" />
            <h3 className="font-display text-base font-bold text-primary">No notifications</h3>
            <p className="font-body-md text-sm text-on-surface-variant mt-1 max-w-sm">
              All systems operational. No unhandled alerts or urgent activity at this time.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col divide-y divide-outline-variant">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-5 flex items-start gap-4 transition-colors ${
                  notif.unread ? 'bg-surface-container-low/50' : 'hover:bg-surface-container-lowest'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/60 flex-shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                      {notif.title}
                      {notif.unread && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </h3>
                    <span className="text-xs text-on-surface-variant">{notif.time}</span>
                  </div>
                  <p className="text-sm text-on-surface leading-relaxed">{notif.message}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {notif.unread && (
                    <button
                      onClick={() => toggleRead(notif.id)}
                      className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-xs font-semibold"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-1.5 hover:bg-red-50 text-on-surface-variant hover:text-error rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
