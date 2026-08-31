import { apiRequest } from './api';
import { OrderData } from './orderService';

export interface CreatePaymentOrderResponse {
  success: boolean;
  razorpayOrderId: string;
  amount: number; // in paise
  currency: string;
  keyId: string;
  order: {
    _id: string;
    orderNumber: string;
    total: number;
  };
}

export interface VerifyPaymentPayload {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  order: OrderData;
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

let razorpayScriptPromise: Promise<boolean> | null = null;

export const paymentService = {
  /**
   * Dynamically loads the official Razorpay Checkout SDK (https://checkout.razorpay.com/v1/checkout.js)
   */
  loadRazorpayScript: (): Promise<boolean> => {
    if (window.Razorpay) {
      return Promise.resolve(true);
    }

    if (razorpayScriptPromise) {
      return razorpayScriptPromise;
    }

    razorpayScriptPromise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        console.error('Failed to load Razorpay Checkout script.');
        razorpayScriptPromise = null;
        resolve(false);
      };
      document.body.appendChild(script);
    });

    return razorpayScriptPromise;
  },

  /**
   * Create Razorpay Order on backend for a pending order (POST /api/payments/create-order)
   */
  createPaymentOrder: async (orderId: string): Promise<CreatePaymentOrderResponse> => {
    const res = await apiRequest<CreatePaymentOrderResponse>('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
    return res as unknown as CreatePaymentOrderResponse;
  },

  /**
   * Verify Razorpay payment signature on backend (POST /api/payments/verify)
   */
  verifyPayment: async (payload: VerifyPaymentPayload): Promise<VerifyPaymentResponse> => {
    const res = await apiRequest<VerifyPaymentResponse>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res as unknown as VerifyPaymentResponse;
  },

  /**
   * Get payment status of an order (GET /api/payments/:orderId)
   */
  getPaymentStatus: async (orderId: string): Promise<{ success: boolean; data: any }> => {
    const res = await apiRequest<{ success: boolean; data: any }>(`/payments/${orderId}`, {
      method: 'GET',
    });
    return res as unknown as { success: boolean; data: any };
  },
};
