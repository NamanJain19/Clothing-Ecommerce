import { apiRequest } from './api';

export interface OrderItem {
  _id?: string;
  product: {
    _id: string;
    name: string;
    slug?: string;
    thumbnail?: string;
    images?: string[];
    brand?: string;
  } | string;
  variantId?: string;
  name: string;
  sku?: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
  itemTotal?: number;
}

export interface OrderAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  latitude?: number | null;
  longitude?: number | null;
  formattedAddress?: string;
}

export interface TrackingMilestone {
  status: string;
  activity: string;
  location?: string;
  timestamp: string;
  rawStatus?: string;
}

export interface OrderTimelineItem {
  status: string;
  title?: string;
  description?: string;
  timestamp?: string;
  date?: string;
  completed: boolean;
  current: boolean;
}

export interface OrderData {
  _id: string;
  orderNumber: string;
  trackingNumber?: string;
  awbNumber?: string;
  shipmentId?: string;
  shiprocketOrderId?: number | string;
  shiprocketShipmentId?: number | string;
  carrier?: string;
  carrierService?: string;
  trackingUrl?: string;
  shipmentStatus?: string;
  courierLatitude?: number | null;
  courierLongitude?: number | null;
  courierLocationUpdated?: string | null;
  trackingHistory?: TrackingMilestone[];
  invoiceNumber?: string;
  shippingMethod?: 'standard' | 'express';
  estimatedDelivery?: string;
  estimatedDeliveryDate?: string;
  estimatedDeliveryMinDate?: string;
  estimatedDeliveryMaxDate?: string;
  user: string;
  items: OrderItem[];
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  paymentMethod: 'cash_on_delivery' | 'upi' | 'credit_debit_card' | 'net_banking' | 'account';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
  orderStatus: 'pending' | 'processing' | 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned' | 'refunded';
  pricing?: {
    subtotal: number;
    discount: number;
    shippingFee: number;
    tax: number;
    total: number;
  };
  subtotal?: number;
  discount?: number;
  shippingFee?: number;
  tax?: number;
  total?: number;
  notes?: string;
  timeline?: OrderTimelineItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethod?: 'cash_on_delivery' | 'upi' | 'credit_debit_card' | 'net_banking' | 'account';
  shippingMethod?: 'standard' | 'express';
  couponCode?: string;
  notes?: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  orderNumber: string;
  orderDate: string;
  atelier: {
    brandName: string;
    legalEntity: string;
    address: string;
    city: string;
    gstin: string;
    email: string;
    phone: string;
    website: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
    shippingAddress: OrderAddress;
    billingAddress: OrderAddress;
  };
  items: {
    name: string;
    sku: string;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
    itemTotal: number;
  }[];
  pricing: {
    subtotal: number;
    discount: number;
    shippingFee: number;
    shippingMethod: string;
    tax: number;
    grandTotal?: number;
    total: number;
    currency: string;
    currencySymbol: string;
  };
  payment: {
    method: string;
    status: string;
    isPaid: boolean;
  };
  fulfillment: {
    orderStatus: string;
    trackingNumber: string;
    carrier: string;
  };
}

const normalizeOrder = (rawOrder: any): OrderData => {
  if (!rawOrder) return rawOrder;
  const pricing = rawOrder.pricing || {
    subtotal: rawOrder.subtotal || 0,
    discount: rawOrder.discount || 0,
    shippingFee: rawOrder.shippingFee || 0,
    tax: rawOrder.tax || 0,
    total: rawOrder.total || rawOrder.subtotal || 0,
  };

  return {
    ...rawOrder,
    shippingMethod: rawOrder.shippingMethod || 'standard',
    estimatedDelivery: rawOrder.estimatedDelivery || (rawOrder.shippingMethod === 'express' ? '1-2 Business Days' : '3-5 Business Days'),
    trackingNumber: rawOrder.trackingNumber || (rawOrder.orderNumber ? `MNL-TRK-${rawOrder.orderNumber.replace('ORD-', '')}` : ''),
    invoiceNumber: rawOrder.invoiceNumber || (rawOrder.orderNumber ? `INV-${rawOrder.orderNumber.replace('ORD-', '')}` : ''),
    pricing,
  };
};

export const orderService = {
  /**
   * Calculate real shipping options from backend
   */
  calculateShipping: async (subtotal: number, shippingMethod: 'standard' | 'express' = 'standard') => {
    const res = await apiRequest<{ data: any }>('/orders/calculate-shipping', {
      method: 'POST',
      body: JSON.stringify({ subtotal, shippingMethod }),
    });
    return (res as any).data;
  },

  /**
   * Create new order from cart (POST /api/orders)
   */
  createOrder: async (payload: CreateOrderPayload): Promise<OrderData> => {
    const res = await apiRequest<{ data: any; order: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const rawOrder = (res as any).data || (res as any).order;
    return normalizeOrder(rawOrder);
  },

  /**
   * Get all orders of current user (GET /api/orders)
   */
  getMyOrders: async (status?: string): Promise<OrderData[]> => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    const res = await apiRequest<{ data: any[]; orders: any[] }>(`/orders${query}`, {
      method: 'GET',
    });
    const list = (res as any).data || (res as any).orders || [];
    return Array.isArray(list) ? list.map(normalizeOrder) : [];
  },

  /**
   * Get order by MongoDB ID, orderNumber or trackingNumber (GET /api/orders/:id)
   */
  getOrderById: async (id: string): Promise<OrderData> => {
    const res = await apiRequest<{ data: any; order: any }>(`/orders/${id}`, {
      method: 'GET',
    });
    const rawOrder = (res as any).data || (res as any).order;
    return normalizeOrder(rawOrder);
  },

  /**
   * Track order live from courier provider (GET /api/orders/:id/track)
   */
  trackOrder: async (id: string): Promise<any> => {
    const res = await apiRequest<{ data: any }>(`/orders/${id}/track`, {
      method: 'GET',
    });
    return (res as any).data;
  },

  /**
   * Get official structured invoice for an order (GET /api/orders/:id/invoice)
   */
  getOrderInvoice: async (id: string): Promise<InvoiceData> => {
    const res = await apiRequest<{ success: boolean; invoice: InvoiceData }>(`/orders/${id}/invoice`, {
      method: 'GET',
    });
    return (res as any).invoice;
  },

  /**
   * Cancel an order (PATCH /api/orders/:id/cancel)
   */
  cancelOrder: async (id: string, reason?: string): Promise<OrderData> => {
    const res = await apiRequest<{ data: any; order: any }>(`/orders/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason: reason || 'Customer requested cancellation' }),
    });
    const rawOrder = (res as any).data || (res as any).order;
    return normalizeOrder(rawOrder);
  },

  /**
   * Download real server-generated A4 PDF invoice for an order
   */
  downloadInvoice: async (orderId: string): Promise<void> => {
    const token = localStorage.getItem('token') || localStorage.getItem('luxury_token') || sessionStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3011/api';

    const response = await fetch(`${API_URL}/orders/${orderId}/invoice/download`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({ message: 'Failed to download invoice' }));
      throw new Error(errJson.message || 'Failed to download invoice');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Invoice-${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /**
   * Open & print official invoice PDF
   */
  printInvoice: async (orderId: string): Promise<void> => {
    const token = localStorage.getItem('token') || localStorage.getItem('luxury_token') || sessionStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3011/api';

    const response = await fetch(`${API_URL}/orders/${orderId}/invoice/download`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to load invoice for printing');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  },
};
