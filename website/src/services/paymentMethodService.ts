export interface SavedCard {
  id: string;
  type: 'card';
  cardNumberMasked: string; // e.g. '•••• •••• •••• 4242'
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  brand: 'Visa' | 'MasterCard' | 'Amex' | 'RuPay' | 'Card';
  isDefault: boolean;
  createdAt: string;
}

export interface SavedUPI {
  id: string;
  type: 'upi';
  upiId: string; // e.g. 'alex@okhdfcbank'
  accountHolderName: string;
  app: 'Google Pay' | 'PhonePe' | 'Paytm' | 'BHIM' | 'UPI';
  isDefault: boolean;
  createdAt: string;
}

export type SavedPaymentMethod = SavedCard | SavedUPI;

const STORAGE_KEY = 'monolith_saved_payment_methods';

const defaultMethods: SavedPaymentMethod[] = [
  {
    id: 'pm_card_sample_1',
    type: 'card',
    cardNumberMasked: '•••• •••• •••• 4242',
    cardHolderName: 'Monolith Private Client',
    expiryMonth: '12',
    expiryYear: '28',
    brand: 'Visa',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pm_upi_sample_2',
    type: 'upi',
    upiId: 'luxury.client@okhdfcbank',
    accountHolderName: 'Monolith Private Client',
    app: 'Google Pay',
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
];

export const paymentMethodService = {
  getPaymentMethods: (): SavedPaymentMethod[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMethods));
      return defaultMethods;
    } catch {
      return defaultMethods;
    }
  },

  addCard: (card: Omit<SavedCard, 'id' | 'type' | 'createdAt'>): SavedCard => {
    const methods = paymentMethodService.getPaymentMethods();
    const newCard: SavedCard = {
      ...card,
      id: `pm_card_${Date.now()}`,
      type: 'card',
      createdAt: new Date().toISOString(),
    };

    if (newCard.isDefault) {
      methods.forEach((m) => (m.isDefault = false));
    }

    const updated = [newCard, ...methods];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newCard;
  },

  addUPI: (upi: Omit<SavedUPI, 'id' | 'type' | 'createdAt'>): SavedUPI => {
    const methods = paymentMethodService.getPaymentMethods();
    const newUpi: SavedUPI = {
      ...upi,
      id: `pm_upi_${Date.now()}`,
      type: 'upi',
      createdAt: new Date().toISOString(),
    };

    if (newUpi.isDefault) {
      methods.forEach((m) => (m.isDefault = false));
    }

    const updated = [newUpi, ...methods];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newUpi;
  },

  setDefault: (id: string): SavedPaymentMethod[] => {
    const methods = paymentMethodService.getPaymentMethods();
    methods.forEach((m) => {
      m.isDefault = m.id === id;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(methods));
    return methods;
  },

  removePaymentMethod: (id: string): SavedPaymentMethod[] => {
    const methods = paymentMethodService.getPaymentMethods();
    const filtered = methods.filter((m) => m.id !== id);
    if (filtered.length > 0 && !filtered.some((m) => m.isDefault)) {
      filtered[0].isDefault = true;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  },
};
