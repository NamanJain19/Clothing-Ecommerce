import { apiRequest } from './api';

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: 'order' | 'inventory' | 'customer' | 'system' | 'return' | 'review';
  isRead: boolean;
  link?: string;
  createdAt: string;
  updatedAt: string;
}

export const notificationService = {
  /**
   * Get all notifications for authenticated customer (GET /api/notifications)
   */
  getNotifications: async (): Promise<NotificationItem[]> => {
    const res = await apiRequest<{ data: NotificationItem[]; count: number }>('/notifications', {
      method: 'GET',
    });
    return (res as any).data || [];
  },

  /**
   * Mark a notification as read (PATCH /api/notifications/:id/read)
   */
  markAsRead: async (id: string): Promise<NotificationItem> => {
    const res = await apiRequest<{ data: NotificationItem }>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
    return (res as any).data;
  },

  /**
   * Mark all notifications as read (PATCH /api/notifications/read-all)
   */
  markAllAsRead: async (): Promise<void> => {
    await apiRequest('/notifications/read-all', {
      method: 'PATCH',
    });
  },

  /**
   * Delete a notification (DELETE /api/notifications/:id)
   */
  deleteNotification: async (id: string): Promise<void> => {
    await apiRequest(`/notifications/${id}`, {
      method: 'DELETE',
    });
  },
};
