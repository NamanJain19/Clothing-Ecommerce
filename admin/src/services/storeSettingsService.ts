export interface StoreSettings {
  storeName: string;
  contactEmail: string;
  supportPhone: string;
  headquarters: string;
  gstin: string;
  currency: string;
  
  // WhatsApp Concierge
  whatsappEnabled: boolean;
  whatsappNumber: string;
  whatsappAgentName: string;
  whatsappWelcomeMessage: string;

  // SMS Gateway & Notifications
  smsEnabled: boolean;
  smsProvider: string;
  smsApiKey: string;
  smsSenderId: string;
  orderPlacedSms: boolean;
  orderShippedSms: boolean;
  deliveryOtpSms: boolean;

  // Payments & Shipping Rules
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  codEnabled: boolean;
  freeShippingThreshold: number;
  standardShippingFee: number;
  gstPercentage: number;

  // Admin Profile
  adminName: string;
  adminEmail: string;
  adminAvatar: string;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'MONOLITH LUXURY OPERATIONS',
  contactEmail: 'concierge@monolith.luxury',
  supportPhone: '+91 98765 43210',
  headquarters: '42 Luxury Boulevard, Chanakyapuri, New Delhi, 110021, India',
  gstin: '27AABCM1234F1Z5',
  currency: 'INR (₹)',

  whatsappEnabled: true,
  whatsappNumber: '+919876543210',
  whatsappAgentName: 'Monolith VIP Concierge',
  whatsappWelcomeMessage: 'Namaste! I would like personal concierge assistance with my luxury order.',

  smsEnabled: true,
  smsProvider: 'Fast2SMS (India)',
  smsApiKey: 'f2sms_live_9812491028401x',
  smsSenderId: 'MNLTHX',
  orderPlacedSms: true,
  orderShippedSms: true,
  deliveryOtpSms: true,

  razorpayEnabled: true,
  razorpayKeyId: 'rzp_test_1DP5mmOlF5G5ag',
  codEnabled: true,
  freeShippingThreshold: 5000,
  standardShippingFee: 250,
  gstPercentage: 18,

  adminName: 'Store Administrator',
  adminEmail: 'admin@monolith.com',
  adminAvatar:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
};

const STORAGE_KEY = 'monolith_store_settings';

export const storeSettingsService = {
  getSettings(): StoreSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Error reading store settings from localStorage', e);
    }
    return DEFAULT_STORE_SETTINGS;
  },

  saveSettings(settings: Partial<StoreSettings>): StoreSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      // Dispatch custom event for cross-component instant reactive update
      window.dispatchEvent(new CustomEvent('monolith_settings_updated', { detail: updated }));
    } catch (e) {
      console.warn('Error saving store settings to localStorage', e);
    }
    return updated;
  },
};

export default storeSettingsService;
