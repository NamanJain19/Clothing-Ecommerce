/**
 * Product, Category, and Collection TypeScript Definitions
 * Matched to Backend MongoDB Schema & API Responses
 */

export interface BackendCategory {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: any;
  sortOrder?: number;
  isActive?: boolean;
}

export interface BackendCollection {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  bannerImage?: string;
  isFeatured?: boolean;
  category?: any;
  sortOrder?: number;
  isActive?: boolean;
}

export interface BackendVariant {
  _id: string;
  id?: string;
  sku?: string;
  color?: string;
  size?: string;
  price?: number;
  stock?: number;
  image?: string;
  isActive?: boolean;
}

export interface BackendProduct {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  brand?: string;
  category?: BackendCategory | string;
  collection?: BackendCollection | string;
  gender?: 'men' | 'women' | 'unisex' | 'kids' | 'all';
  price: number;
  compareAtPrice?: number;
  discountPercentage?: number;
  sku?: string;
  images: string[];
  thumbnail?: string;
  colors?: string[];
  sizes?: string[];
  variants?: BackendVariant[];
  stock?: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isSale?: boolean;
  isActive?: boolean;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  material?: string;
  careInstructions?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  collection?: string;
  gender?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isSale?: boolean;
  isActive?: boolean | string;
  sort?:
    | 'newest'
    | 'oldest'
    | 'price_asc'
    | 'price_desc'
    | 'price_low'
    | 'price_high'
    | 'highest_rated'
    | 'rating'
    | 'most_popular'
    | 'popular';
}

export interface ProductListResponse {
  success: boolean;
  products: BackendProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SingleProductResponse {
  success: boolean;
  product: BackendProduct;
  message?: string;
}

export interface CategoriesResponse {
  success: boolean;
  count: number;
  data: BackendCategory[];
}

export interface CollectionsResponse {
  success: boolean;
  count: number;
  data: BackendCollection[];
}
