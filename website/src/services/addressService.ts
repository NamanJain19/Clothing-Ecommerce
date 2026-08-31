import { apiRequest } from './api';

export interface AddressData {
  _id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  landmark?: string;
  addressType?: 'home' | 'work' | 'other';
  isDefault?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  formattedAddress?: string;
  createdAt?: string;
}

export const addressService = {
  /**
   * Get all saved addresses of the current user (GET /api/addresses)
   */
  getAddresses: async (): Promise<AddressData[]> => {
    const res = await apiRequest<{ data: AddressData[]; count: number }>('/addresses', {
      method: 'GET',
    });
    return (res as any).data || [];
  },

  /**
   * Get single address by ID (GET /api/addresses/:id)
   */
  getAddressById: async (id: string): Promise<AddressData> => {
    const res = await apiRequest<{ data: AddressData }>(`/addresses/${id}`, {
      method: 'GET',
    });
    return (res as any).data;
  },

  /**
   * Create a new address (POST /api/addresses)
   */
  createAddress: async (addressData: Omit<AddressData, '_id'>): Promise<AddressData> => {
    const res = await apiRequest<{ data: AddressData; address: AddressData }>('/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
    return (res as any).data || (res as any).address;
  },

  /**
   * Update an address (PUT /api/addresses/:id)
   */
  updateAddress: async (id: string, addressData: Partial<AddressData>): Promise<AddressData> => {
    const res = await apiRequest<{ data: AddressData }>(`/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
    return (res as any).data;
  },

  /**
   * Delete an address (DELETE /api/addresses/:id)
   */
  deleteAddress: async (id: string): Promise<void> => {
    await apiRequest(`/addresses/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Set address as default (PATCH /api/addresses/:id/default)
   */
  setDefaultAddress: async (id: string): Promise<AddressData> => {
    const res = await apiRequest<{ data: AddressData }>(`/addresses/${id}/default`, {
      method: 'PATCH',
    });
    return (res as any).data;
  },
};
