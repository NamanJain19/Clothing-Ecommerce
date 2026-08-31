import React, { useState } from 'react';
import { Bell, Check, Trash2, ShieldAlert, ShoppingBag, Users, Warehouse } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { initialNotifications, NotificationItem } from '../../data/notifications';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: NotificationItem['type']) => {
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
          <AdminButton variant="outline" onClick={markAllAsRead}>
            <Check className="w-4 h-4 mr-2" /> Mark All as Read
          </AdminButton>
        </div>

        {/* Notifications List */}
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
                <button
                  onClick={() => toggleRead(notif.id)}
                  className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-xs font-semibold"
                >
                  {notif.unread ? 'Mark read' : 'Mark unread'}
                </button>
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
      </div>
    </AdminLayout>
  );
};
