import { singleProductDetail, ProductDetailItem } from '../data/productDetailsData';
import { newArrivalsData } from '../data/products';
import { womenProductsData, CategoryProduct } from '../data/womenProducts';
import { menProductsData } from '../data/menProducts';
import { kidsProductsData } from '../data/kidsProducts';
import { accessoriesProductsData } from '../data/accessoriesProducts';
import { newArrivalsPageProductsData } from '../data/newArrivalsPageProducts';
import { searchResultsData } from '../data/searchResultsData';
import { saleItemsData } from '../data/saleItems';
import { BackendProduct } from '../types/product';

/**
 * Maps a real BackendProduct from MongoDB API to ProductDetailItem for ProductDetailsPage
 */
export const backendProductToDetailItem = (bp: BackendProduct): ProductDetailItem => {
  const images = bp.images && bp.images.length > 0
    ? bp.images
    : [bp.thumbnail || singleProductDetail.images[0]];

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
      : 'THE ARCHIVE';

  const colors =
    bp.colors && bp.colors.length > 0
      ? bp.colors.map((c) => ({
          name: c,
          hex:
            c.toLowerCase().includes('white') || c.toLowerCase().includes('ivory')
              ? '#F5F5F0'
              : c.toLowerCase().includes('grey') || c.toLowerCase().includes('charcoal')
              ? '#4A4A4A'
              : c.toLowerCase().includes('tan') || c.toLowerCase().includes('cognac')
              ? '#8B5A2B'
              : '#000000',
        }))
      : [{ name: 'Standard', hex: '#000000' }];

  const sizes = bp.sizes && bp.sizes.length > 0 ? bp.sizes : ['S', 'M', 'L'];

  return {
    id: bp._id || bp.id || bp.slug,
    name: bp.name,
    subtitle: `${collectionName.toUpperCase()} // ${categoryName.toUpperCase()}`,
    price: bp.price,
    description: bp.description || bp.shortDescription || 'Expertly tailored from the finest materials, embodying architectural precision, minimalist luxury, and timeless refinement.',
    colors,
    sizes,
    images: images.length >= 4 ? images : [...images, ...singleProductDetail.images.slice(images.length)],
    specs: {
      fit: 'Tailored architectural drape. True to luxury European sizing.',
      composition: bp.material || '100% Premium Natural Fibres & Fine Silk blend',
      origin: 'Handcrafted in Italy',
      care: bp.careInstructions || 'Specialist dry clean only. Cool iron on reverse.',
    },
    recommended: singleProductDetail.recommended,
  };
};

/**
 * Find and adapt any product by its ID from all catalog datasets into a full ProductDetailItem
 */
export const getProductById = (id?: string): ProductDetailItem => {
  if (!id) return singleProductDetail;

  // 1. Direct match on default single detail
  if (id === singleProductDetail.id) {
    return singleProductDetail;
  }

  // 2. Search in category collections
  const allCategoryProducts: CategoryProduct[] = [
    ...womenProductsData,
    ...menProductsData,
    ...kidsProductsData,
    ...accessoriesProductsData,
    ...newArrivalsPageProductsData,
    ...searchResultsData,
  ];

  const catMatch = allCategoryProducts.find((p) => p.id === id);
  if (catMatch) {
    return {
      id: catMatch.id,
      name: catMatch.name,
      subtitle: `MONOLITH COLLECTION // ${catMatch.specs || 'ESSENTIALS'}`,
      price: catMatch.price,
      description: `Expertly tailored from the finest materials, embodying architectural precision, minimalist luxury, and timeless refinement. Perfect for elevated everyday silhouettes.`,
      colors: [
        { name: 'Obsidian Black', hex: '#000000' },
        { name: 'Ivory White', hex: '#F5F5F0' },
        { name: 'Slate Grey', hex: '#5D5F5F' },
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      images: [
        catMatch.image,
        catMatch.hoverImage || catMatch.image,
        ...singleProductDetail.images.slice(2),
      ],
      specs: {
        fit: 'Tailored architectural drape. True to luxury European sizing.',
        composition: '100% Fine Mulberry Silk & Organic Cotton blend',
        origin: 'Hand-tailored in Milan, Italy',
        care: 'Dry clean only. Cool iron on reverse.',
      },
      recommended: singleProductDetail.recommended,
    };
  }

  // 3. Search in general products / new arrivals
  const prodMatch = newArrivalsData.find((p) => p.id === id);
  if (prodMatch) {
    return {
      id: prodMatch.id,
      name: prodMatch.name,
      subtitle: `MONOLITH // ${prodMatch.category.toUpperCase()}`,
      price: prodMatch.price,
      description: `Crafted with meticulous attention to detail, featuring refined lines, luxurious drape, and unmatched craftsmanship for the modern wardrobe.`,
      colors: [
        { name: 'Obsidian Black', hex: '#000000' },
        { name: 'Ivory White', hex: '#F5F5F0' },
        { name: 'Slate Grey', hex: '#5D5F5F' },
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      images: [prodMatch.image, ...singleProductDetail.images.slice(1)],
      specs: {
        fit: 'Sculptural luxury cut. Fits true to size.',
        composition: '100% Architectural Wool & Silk',
        origin: 'Atelier finished in Florence, Italy',
        care: 'Specialist dry clean only.',
      },
      recommended: singleProductDetail.recommended,
    };
  }

  // 4. Search in sale items
  const saleMatch = saleItemsData.find((s) => s.id === id);
  if (saleMatch) {
    return {
      id: saleMatch.id,
      name: saleMatch.name,
      subtitle: `PRIVATE ARCHIVE SALE // ${saleMatch.discountPercentage}% OFF`,
      price: saleMatch.salePrice,
      description: `Limited seasonal archive piece. Featuring exceptional structure, premium finishings, and signature Monolith detailing.`,
      colors: [
        { name: 'Obsidian Black', hex: '#000000' },
        { name: 'Ivory White', hex: '#F5F5F0' },
      ],
      sizes: ['S', 'M', 'L'],
      images: [saleMatch.image, ...singleProductDetail.images.slice(1)],
      specs: {
        fit: 'Contemporary tailored fit.',
        composition: 'Premium Virgin Wool Blend',
        origin: 'Made in Italy',
        care: 'Dry clean only.',
      },
      recommended: singleProductDetail.recommended,
    };
  }

  // Fallback to default
  return singleProductDetail;
};
