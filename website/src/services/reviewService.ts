import { apiRequest } from './api';

export interface ReviewItem {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  product: string;
  order?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductReviewsResponse {
  success: boolean;
  reviews: ReviewItem[];
  averageRating: number;
  reviewCount: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateReviewPayload {
  rating: number;
  title: string;
  comment: string;
  orderId?: string;
  images?: string[];
}

export const reviewService = {
  /**
   * Get all approved reviews for a product (GET /api/products/:productId/reviews)
   */
  getProductReviews: async (productId: string, params: { page?: number; limit?: number; rating?: number; sort?: string } = {}): Promise<ProductReviewsResponse> => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.rating) query.append('rating', String(params.rating));
    if (params.sort) query.append('sort', params.sort);

    const qs = query.toString();
    const res = await apiRequest<ProductReviewsResponse>(`/products/${productId}/reviews${qs ? `?${qs}` : ''}`, {
      method: 'GET',
    });
    return res as unknown as ProductReviewsResponse;
  },

  /**
   * Submit a verified customer review (POST /api/products/:productId/reviews)
   */
  createReview: async (productId: string, payload: CreateReviewPayload): Promise<{ success: boolean; review: ReviewItem; message: string }> => {
    const res = await apiRequest<{ success: boolean; review: ReviewItem; message: string }>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res as unknown as { success: boolean; review: ReviewItem; message: string };
  },

  /**
   * Update review (PUT /api/reviews/:id)
   */
  updateReview: async (reviewId: string, payload: Partial<CreateReviewPayload>): Promise<{ success: boolean; review: ReviewItem }> => {
    const res = await apiRequest<{ success: boolean; review: ReviewItem }>(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res as unknown as { success: boolean; review: ReviewItem };
  },

  /**
   * Delete review (DELETE /api/reviews/:id)
   */
  deleteReview: async (reviewId: string): Promise<void> => {
    await apiRequest(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  },
};
