export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  collection?: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  images?: string[];
  description?: string;
  details?: string[];
  sizes?: string[];
  colors?: ProductColor[];
  aspectRatio?: '3/4' | '4/5' | 'square';
  tag?: string;
  isNew?: boolean;
  isTrending?: boolean;
}

export interface Collection {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  height: string;
  link: string;
}

export interface Category {
  id: string;
  title: string;
  volume: string;
  image: string;
  link: string;
}

export interface AccessoryItem {
  id: string;
  collectionName: string;
  name: string;
  price: number;
  image: string;
}

export interface SaleItem {
  id: string;
  name: string;
  category?: string;
  discountPercentage: number;
  salePrice: number;
  originalPrice: number;
  image: string;
}

export interface InstagramPost {
  id: string;
  image: string;
  alt: string;
}
