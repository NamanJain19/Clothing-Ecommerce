export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'inventory' | 'customer' | 'system';
  unread: boolean;
  time: string;
  actionUrl?: string;
}

export const initialNotifications: NotificationItem[] = [
  {
    id: 'NOTIF-01',
    title: 'High-Value Bespoke Order Placed',
    message: 'Lord Arthur Sterling placed order #ORD-9020 for Lunar Chronograph 41mm ($6,800.00).',
    type: 'order',
    unread: true,
    time: '5 minutes ago',
    actionUrl: '/admin/orders',
  },
  {
    id: 'NOTIF-02',
    title: 'Critical Stock Threshold Reached',
    message: 'Lunar Chronograph 41mm inventory has reached only 2 remaining units in Geneva Safe Deposit.',
    type: 'inventory',
    unread: true,
    time: '2 hours ago',
    actionUrl: '/admin/inventory',
  },
  {
    id: 'NOTIF-03',
    title: 'VIP Client Registered',
    message: 'Elias Vance created a verified client profile from Beverly Hills atelier gateway.',
    type: 'customer',
    unread: false,
    time: '4 hours ago',
    actionUrl: '/admin/customers',
  },
  {
    id: 'NOTIF-04',
    title: 'System Security Audit Completed',
    message: 'Automated 256-bit vault compliance audit passed with zero vulnerabilities.',
    type: 'system',
    unread: false,
    time: '1 day ago',
    actionUrl: '/admin/settings',
  },
];
