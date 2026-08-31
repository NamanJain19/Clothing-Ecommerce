import { apiRequest } from './api';
import {
  BackendProduct,
  BackendCategory,
  BackendCollection,
  ProductQueryParams,
  ProductListResponse,
  SingleProductResponse,
  CategoriesResponse,
  CollectionsResponse,
} from '../types/product';
import { Product } from '../types';
import { normalizeImageUrl, getProductImage, getProductImages, DEFAULT_FALLBACK_IMAGE } from '../utils/imageUtils';

/**
 * Maps a raw BackendProduct into the UI Product structure
 */
export const toUIProduct = (bp: BackendProduct): Product => {
  const primaryImage = getProductImage(bp);
  const allImages = getProductImages(bp);
  const hoverImage = allImages.length > 1 ? allImages[1] : primaryImage;

  const categoryName =
    typeof bp.category === 'object' && bp.category
      ? bp.category.name
      : typeof bp.category === 'string'
      ? bp.category
      : bp.gender
      ? `${bp.gender.toUpperCase()} COLLECTION`
      : 'MONOLITH';

  const collectionName =
    typeof bp.collection === 'object' && bp.collection
      ? bp.collection.name
      : typeof bp.collection === 'string'
      ? bp.collection
      : 'THE MONOLITH ARCHIVE';

  const sanitizeName = (name: string) => {
    if (!name) return 'Monolith Luxury Piece';
    return name.replace(/\s*\d{8,}\s*/g, '').trim();
  };

  const cleanName = sanitizeName(bp.name);

  return {
    id: bp._id || bp.id || bp.slug,
    name: cleanName,
    tag: bp.isNewArrival
      ? 'NEW ARRIVAL'
      : bp.isSale
      ? 'SALE'
      : bp.isFeatured
      ? 'FEATURED'
      : undefined,
    category: categoryName,
    collection: collectionName,
    price: bp.price,
    originalPrice: bp.compareAtPrice && bp.compareAtPrice > bp.price ? bp.compareAtPrice : undefined,
    image: primaryImage,
    hoverImage: hoverImage,
    images: allImages,
    description: bp.description || bp.shortDescription || 'Crafted with meticulous attention to architectural proportion and artisanal quality.',
    details: [
      bp.shortDescription || 'Meticulously tailored luxury garment.',
      `Composition: ${bp.material || '100% Premium Natural Fibres'}`,
      `Care: ${bp.careInstructions || 'Specialist Dry Clean Only'}`,
      `Artisanal SKU: ${bp.sku || 'MNL-ATELIER'}`,
    ],
    sizes: bp.sizes && bp.sizes.length > 0 ? bp.sizes : ['S', 'M', 'L'],
    colors:
      bp.colors && bp.colors.length > 0
        ? bp.colors.map((c) => ({
            name: c,
            hex: c.toLowerCase().includes('white') || c.toLowerCase().includes('ivory')
              ? '#F8F8F8'
              : c.toLowerCase().includes('grey') || c.toLowerCase().includes('charcoal')
              ? '#4A4A4A'
              : c.toLowerCase().includes('tan') || c.toLowerCase().includes('cognac')
              ? '#8B5A2B'
              : '#111111',
            image: primaryImage,
          }))
        : [{ name: 'Standard', hex: '#111111', image: primaryImage }],
    isNew: !!bp.isNewArrival,
    isTrending: !!bp.isFeatured,
  };
};

/**
 * Maps a BackendProduct into CategoryProductCard shape
 */
export const toUICategoryProduct = (bp: BackendProduct) => {
  const ui = toUIProduct(bp);
  return {
    id: ui.id,
    name: ui.name,
    specs: ui.collection || ui.category || 'MONOLITH COLLECTION',
    price: ui.price,
    image: ui.image,
    hoverImage: ui.hoverImage || ui.image,
    isNewArrival: bp.isNewArrival,
    isSale: bp.isSale,
    isFeatured: bp.isFeatured,
  };
};

export const productService = {
  /**
   * Fetch products with query filters (GET /api/products)
   */
  getProducts: async (params: ProductQueryParams = {}): Promise<ProductListResponse> => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });

    const queryString = query.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

    const res = await apiRequest<ProductListResponse>(endpoint, { method: 'GET' });
    return res as unknown as ProductListResponse;
  },

  /**
   * Fetch single product by MongoDB ID (GET /api/products/:id)
   */
  getProductById: async (id: string): Promise<BackendProduct> => {
    const res = await apiRequest<any>(`/products/${id}`, { method: 'GET' });
    if (res && (res.data || res.product)) {
      return res.data || res.product;
    }
    throw new Error(res.message || 'Product not found');
  },

  /**
   * Fetch single product by slug (GET /api/products/slug/:slug)
   */
  getProductBySlug: async (slug: string): Promise<BackendProduct> => {
    const res = await apiRequest<any>(`/products/slug/${slug}`, { method: 'GET' });
    if (res && (res.data || res.product)) {
      return res.data || res.product;
    }
    throw new Error(res.message || 'Product not found');
  },

  /**
   * Fetch all categories (GET /api/categories)
   */
  getCategories: async (params: { isActive?: boolean; parentCategory?: string } = {}): Promise<BackendCategory[]> => {
    const query = new URLSearchParams();
    if (params.isActive !== undefined) query.append('isActive', String(params.isActive));
    if (params.parentCategory) query.append('parentCategory', params.parentCategory);

    const qs = query.toString();
    const res = await apiRequest<CategoriesResponse>(`/categories${qs ? `?${qs}` : ''}`, { method: 'GET' });
    return (res as any).data || [];
  },

  /**
   * Fetch all collections (GET /api/collections)
   */
  getCollections: async (params: { isActive?: boolean; isFeatured?: boolean; category?: string } = {}): Promise<BackendCollection[]> => {
    const query = new URLSearchParams();
    if (params.isActive !== undefined) query.append('isActive', String(params.isActive));
    if (params.isFeatured !== undefined) query.append('isFeatured', String(params.isFeatured));
    if (params.category) query.append('category', params.category);

    const qs = query.toString();
    const res = await apiRequest<CollectionsResponse>(`/collections${qs ? `?${qs}` : ''}`, { method: 'GET' });
    return (res as any).data || [];
  },
};
