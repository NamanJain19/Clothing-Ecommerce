export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  collection: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  isSale?: boolean;
  stock: number;
  status: 'Published' | 'Draft' | 'Archived' | 'Out of Stock';
  image: string;
  gallery?: string[];
  description: string;
  material?: string;
  gender?: 'men' | 'women' | 'kids' | 'unisex' | 'accessories';
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export const initialProducts: Product[] = [
  {
    id: 'PRD-001',
    name: 'Atelier Cashmere Overcoat',
    sku: 'MON-CT-001',
    category: 'Outerwear',
    collection: 'Winter Solstice 2024',
    brand: 'Monolith Sartorial',
    price: 2450.0,
    compareAtPrice: 2800.0,
    stock: 14,
    status: 'Published',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATT8ERG7OXAHHfsVDDR_PIjU8lWaHou2PZNgQS0t1grOJegixUBQZY9S46UVmhNHF7htuAiQCiZNjK58-o1UrvimzQwhxlpkRj1Un45EepJyAzVXW5T9f6Uw5iNOBeGJtjWjtVWiCSmyA1S2v3oZPLm-gD10ji0-F40vUbTi1PZHMqOEJFQ6soKv6wtbqlhib1z31fyy4GdmqWBPnRp2g3p0V4IJmF7kER3FKkiHPnC64blBDBU2vNZg',
    description: 'Double-breasted heavyweight Italian cashmere overcoat with horn buttons and silk interior lining.',
    rating: 4.9,
    reviewsCount: 38,
    createdAt: '2024-10-12',
  },
  {
    id: 'PRD-002',
    name: 'Lunar Chronograph 41mm',
    sku: 'MON-WT-104',
    category: 'Horology',
    collection: 'Celestial Edition',
    brand: 'Monolith Horlogerie',
    price: 6800.0,
    stock: 2,
    status: 'Published',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyxyqvyh346BaRtj82icFZ6xEJqNwxJObUST0eLtI-twZgrnV-aKZXbTvy856m-SM3EQHVwvjSBwSw9j8GzKcmdjqR0SM8MJ6eEVGs1kfGoblzeKnFLRM0tmPIT825qn1nN9fctSzGBFjTog1_zqqpCgpNrGHp5DrggVk5VDPVKkd9iMl7ssIUbMFRUdE8l-eVAhMoofh4yJbd-RLdrXql7W4zSKTuFPkt63ATk3jXhWlc_kqlqlWivw',
    description: 'Precision mechanical chronograph with bespoke alligator leather strap and domed sapphire crystal.',
    rating: 5.0,
    reviewsCount: 19,
    createdAt: '2024-09-28',
  },
  {
    id: 'PRD-003',
    name: 'Grain Leather Minimalist Cardholder',
    sku: 'MON-AC-892',
    category: 'Leather Goods',
    collection: 'Essential Luxury',
    brand: 'Monolith Leathercraft',
    price: 320.0,
    stock: 5,
    status: 'Published',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR6aK4Him3nAFtFIsMlS9ukrGjyGi-g2fg5ua3B3PJr2da4K79QBAIf_k-fEkOXKd6hp5XX4AuPhRYDy3642DOmzX8kLetTi-uw8aVE5E5q7Kc4YfMaaHRVZm286H19bN625BHVfVn5kXW2ZDnyvaa5HgRd2qI55_MfpAB2jr9fdVdyV4DGdOBE8LOl3QsjmxG8HdBWNxqKF0PgiZLB2sKCiNKm6WX8X7HPSfhVZsRa5lQw8DZhGyajQ',
    description: 'Full-grain calfskin leather card case with hand-lacquered edges and palladium foil stamped logo.',
    rating: 4.8,
    reviewsCount: 64,
    createdAt: '2024-10-01',
  },
  {
    id: 'PRD-004',
    name: 'Nocturne Eau de Parfum (50ml)',
    sku: 'MON-FR-050',
    category: 'Fragrance',
    collection: 'Private Blend',
    brand: 'Monolith Parfums',
    price: 290.0,
    stock: 8,
    status: 'Published',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYrXKZ5TkUTAckfmZw0_waqeek0tLuqicQrZ_cLlcdWVnAqEP5HS-HqM9qT0u3gOOq75cWCjIfoF6fD0REjiUvzBFxVP9thYeChxPZV6lMYEeOVx5cY0uGyXFV_eSOE8JJyb-B1rdrK2jvf59CkvqNmAjHdNg_bESXbUGy51UCw2HDXzRnbGpZiMdduefW5mxWh9nuOU1ecSzn8ZS-kTeUjnZRj3GzVW6zRDYuxViOYHttDBi-EHLd0w',
    description: 'Rare oud, smoked cedarwood, and iris root extract encased in heavyweight smoked glass.',
    rating: 4.9,
    reviewsCount: 52,
    createdAt: '2024-08-15',
  },
  {
    id: 'PRD-005',
    name: 'Silk Jacquard Evening Jacket',
    sku: 'MON-JK-304',
    category: 'Tailoring',
    collection: 'Black Tie Gala',
    brand: 'Monolith Sartorial',
    price: 3100.0,
    stock: 0,
    status: 'Out of Stock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAieKJwXoPSramdJkcZE-alnA9VqM2Gll-lRDyQ2Tpj3TiJFvAC09t7hQfF6ZEfHLANuzPqqL7p8NwJkTEI_5w4eEwI-Yg2SM3_YgwWbPae4AwSI_eluAQ8i3Cm_WKkThHVnoYyO1nUdllWhYK4eLCHNzgktNmvwYV8C4IYlxv5d4BFJGPN9ZNp_5Lmui8BkuEZIeuOfmZJTqvYe8WkVbrnDrQ0_WrT9uROrvv67vERtvC5SzmGJP4tNQ',
    description: 'Structured tuxedo jacket in midnight silk jacquard with grosgrain shawl lapels.',
    rating: 5.0,
    reviewsCount: 14,
    createdAt: '2024-10-18',
  },
  {
    id: 'PRD-006',
    name: 'Bespoke Chelsea Boots',
    sku: 'MON-SH-551',
    category: 'Footwear',
    collection: 'Essential Luxury',
    brand: 'Monolith Leathercraft',
    price: 1150.0,
    stock: 22,
    status: 'Draft',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATT8ERG7OXAHHfsVDDR_PIjU8lWaHou2PZNgQS0t1grOJegixUBQZY9S46UVmhNHF7htuAiQCiZNjK58-o1UrvimzQwhxlpkRj1Un45EepJyAzVXW5T9f6Uw5iNOBeGJtjWjtVWiCSmyA1S2v3oZPLm-gD10ji0-F40vUbTi1PZHMqOEJFQ6soKv6wtbqlhib1z31fyy4GdmqWBPnRp2g3p0V4IJmF7kER3FKkiHPnC64blBDBU2vNZg',
    description: 'Goodyear welted box-calf leather chelsea boot with stacked leather sole.',
    rating: 4.7,
    reviewsCount: 29,
    createdAt: '2024-10-20',
  },
];
