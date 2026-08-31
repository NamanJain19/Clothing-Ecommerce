export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface OrderTrackingHistoryEvent {
  status: string;
  activity: string;
  location?: string;
  timestamp: string;
  rawStatus?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  initials: string;
  date: string;
  amount: number;
  itemsCount?: number;
  status: 'Shipped' | 'Processing' | 'Pending' | 'Delivered' | 'Cancelled' | 'Confirmed' | 'Out for Delivery';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  paymentMethod?: string;
  trackingNumber?: string;
  awbNumber?: string;
  shipmentId?: string;
  shiprocketOrderId?: number | string;
  shiprocketShipmentId?: number | string;
  carrier?: string;
  carrierService?: string;
  trackingUrl?: string;
  shipmentStatus?: string;
  shippingAddress: string;
  estimatedDelivery?: string;
  latitude?: number | null;
  longitude?: number | null;
  trackingHistory?: OrderTrackingHistoryEvent[];
  items: OrderItem[];
}

export const initialOrders: Order[] = [
  {
    id: 'ORD-9023',
    orderNumber: '#ORD-9023',
    customerName: 'Jane Doe',
    customerEmail: 'jane.doe@luxuryclient.com',
    initials: 'JD',
    date: 'Oct 24, 2024',
    amount: 1250.0,
    itemsCount: 1,
    status: 'Shipped',
    paymentStatus: 'Paid',
    shippingAddress: '740 Park Avenue, Apt 14B, New York, NY 10021',
    items: [
      {
        productId: 'PRD-006',
        name: 'Bespoke Chelsea Boots',
        quantity: 1,
        price: 1150.0,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATT8ERG7OXAHHfsVDDR_PIjU8lWaHou2PZNgQS0t1grOJegixUBQZY9S46UVmhNHF7htuAiQCiZNjK58-o1UrvimzQwhxlpkRj1Un45EepJyAzVXW5T9f6Uw5iNOBeGJtjWjtVWiCSmyA1S2v3oZPLm-gD10ji0-F40vUbTi1PZHMqOEJFQ6soKv6wtbqlhib1z31fyy4GdmqWBPnRp2g3p0V4IJmF7kER3FKkiHPnC64blBDBU2vNZg',
      },
    ],
  },
  {
    id: 'ORD-9022',
    orderNumber: '#ORD-9022',
    customerName: 'Marcus Smith',
    customerEmail: 'marcus.smith@enterprise.co.uk',
    initials: 'MS',
    date: 'Oct 23, 2024',
    amount: 840.5,
    itemsCount: 2,
    status: 'Processing',
    paymentStatus: 'Paid',
    shippingAddress: '12 Grosvenor Square, Mayfair, London W1K 6LD',
    items: [
      {
        productId: 'PRD-003',
        name: 'Grain Leather Minimalist Cardholder',
        quantity: 2,
        price: 320.0,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR6aK4Him3nAFtFIsMlS9ukrGjyGi-g2fg5ua3B3PJr2da4K79QBAIf_k-fEkOXKd6hp5XX4AuPhRYDy3642DOmzX8kLetTi-uw8aVE5E5q7Kc4YfMaaHRVZm286H19bN625BHVfVn5kXW2ZDnyvaa5HgRd2qI55_MfpAB2jr9fdVdyV4DGdOBE8LOl3QsjmxG8HdBWNxqKF0PgiZLB2sKCiNKm6WX8X7HPSfhVZsRa5lQw8DZhGyajQ',
      },
    ],
  },
  {
    id: 'ORD-9021',
    orderNumber: '#ORD-9021',
    customerName: 'Anna Kim',
    customerEmail: 'anna.kim@cheongdam.kr',
    initials: 'AK',
    date: 'Oct 23, 2024',
    amount: 2100.0,
    itemsCount: 1,
    status: 'Pending',
    paymentStatus: 'Pending',
    shippingAddress: '88 Apgujeong-ro, Gangnam-gu, Seoul, 06014',
    items: [
      {
        productId: 'PRD-001',
        name: 'Atelier Cashmere Overcoat',
        quantity: 1,
        price: 2450.0,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATT8ERG7OXAHHfsVDDR_PIjU8lWaHou2PZNgQS0t1grOJegixUBQZY9S46UVmhNHF7htuAiQCiZNjK58-o1UrvimzQwhxlpkRj1Un45EepJyAzVXW5T9f6Uw5iNOBeGJtjWjtVWiCSmyA1S2v3oZPLm-gD10ji0-F40vUbTi1PZHMqOEJFQ6soKv6wtbqlhib1z31fyy4GdmqWBPnRp2g3p0V4IJmF7kER3FKkiHPnC64blBDBU2vNZg',
      },
    ],
  },
  {
    id: 'ORD-9020',
    orderNumber: '#ORD-9020',
    customerName: 'Lord Arthur Sterling',
    customerEmail: 'sterling.private@holdings.ch',
    initials: 'AS',
    date: 'Oct 22, 2024',
    amount: 6800.0,
    itemsCount: 1,
    status: 'Delivered',
    paymentStatus: 'Paid',
    shippingAddress: 'Quai du Mont-Blanc 19, 1201 Genève, Switzerland',
    items: [
      {
        productId: 'PRD-002',
        name: 'Lunar Chronograph 41mm',
        quantity: 1,
        price: 6800.0,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyxyqvyh346BaRtj82icFZ6xEJqNwxJObUST0eLtI-twZgrnV-aKZXbTvy856m-SM3EQHVwvjSBwSw9j8GzKcmdjqR0SM8MJ6eEVGs1kfGoblzeKnFLRM0tmPIT825qn1nN9fctSzGBFjTog1_zqqpCgpNrGHp5DrggVk5VDPVKkd9iMl7ssIUbMFRUdE8l-eVAhMoofh4yJbd-RLdrXql7W4zSKTuFPkt63ATk3jXhWlc_kqlqlWivw',
      },
    ],
  },
];
