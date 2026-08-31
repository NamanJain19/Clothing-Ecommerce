export interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  status: 'Active' | 'Hidden';
  image: string;
  description: string;
  featured: boolean;
}

export const initialCategories: Category[] = [
  {
    id: 'CAT-01',
    name: 'Outerwear & Coats',
    slug: 'outerwear-coats',
    productCount: 48,
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATT8ERG7OXAHHfsVDDR_PIjU8lWaHou2PZNgQS0t1grOJegixUBQZY9S46UVmhNHF7htuAiQCiZNjK58-o1UrvimzQwhxlpkRj1Un45EepJyAzVXW5T9f6Uw5iNOBeGJtjWjtVWiCSmyA1S2v3oZPLm-gD10ji0-F40vUbTi1PZHMqOEJFQ6soKv6wtbqlhib1z31fyy4GdmqWBPnRp2g3p0V4IJmF7kER3FKkiHPnC64blBDBU2vNZg',
    description: 'Masterfully tailored wool, cashmere, and technical storm-coat silhouettes.',
    featured: true,
  },
  {
    id: 'CAT-02',
    name: 'Horology & Timepieces',
    slug: 'horology-timepieces',
    productCount: 24,
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyxyqvyh346BaRtj82icFZ6xEJqNwxJObUST0eLtI-twZgrnV-aKZXbTvy856m-SM3EQHVwvjSBwSw9j8GzKcmdjqR0SM8MJ6eEVGs1kfGoblzeKnFLRM0tmPIT825qn1nN9fctSzGBFjTog1_zqqpCgpNrGHp5DrggVk5VDPVKkd9iMl7ssIUbMFRUdE8l-eVAhMoofh4yJbd-RLdrXql7W4zSKTuFPkt63ATk3jXhWlc_kqlqlWivw',
    description: 'Swiss and German mechanical complications, chronographs, and haute horlogerie.',
    featured: true,
  },
  {
    id: 'CAT-03',
    name: 'Fine Leather Goods',
    slug: 'fine-leather-goods',
    productCount: 86,
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR6aK4Him3nAFtFIsMlS9ukrGjyGi-g2fg5ua3B3PJr2da4K79QBAIf_k-fEkOXKd6hp5XX4AuPhRYDy3642DOmzX8kLetTi-uw8aVE5E5q7Kc4YfMaaHRVZm286H19bN625BHVfVn5kXW2ZDnyvaa5HgRd2qI55_MfpAB2jr9fdVdyV4DGdOBE8LOl3QsjmxG8HdBWNxqKF0PgiZLB2sKCiNKm6WX8X7HPSfhVZsRa5lQw8DZhGyajQ',
    description: 'Artisanal trunks, weekender bags, briefcases, and personal leather accessories.',
    featured: true,
  },
  {
    id: 'CAT-04',
    name: 'Haute Parfumerie',
    slug: 'haute-parfumerie',
    productCount: 32,
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYrXKZ5TkUTAckfmZw0_waqeek0tLuqicQrZ_cLlcdWVnAqEP5HS-HqM9qT0u3gOOq75cWCjIfoF6fD0REjiUvzBFxVP9thYeChxPZV6lMYEeOVx5cY0uGyXFV_eSOE8JJyb-B1rdrK2jvf59CkvqNmAjHdNg_bESXbUGy51UCw2HDXzRnbGpZiMdduefW5mxWh9nuOU1ecSzn8ZS-kTeUjnZRj3GzVW6zRDYuxViOYHttDBi-EHLd0w',
    description: 'Limited formulation extraits de parfum, scented candles, and room sprays.',
    featured: false,
  },
  {
    id: 'CAT-05',
    name: 'Bespoke Tailoring',
    slug: 'bespoke-tailoring',
    productCount: 54,
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAieKJwXoPSramdJkcZE-alnA9VqM2Gll-lRDyQ2Tpj3TiJFvAC09t7hQfF6ZEfHLANuzPqqL7p8NwJkTEI_5w4eEwI-Yg2SM3_YgwWbPae4AwSI_eluAQ8i3Cm_WKkThHVnoYyO1nUdllWhYK4eLCHNzgktNmvwYV8C4IYlxv5d4BFJGPN9ZNp_5Lmui8BkuEZIeuOfmZJTqvYe8WkVbrnDrQ0_WrT9uROrvv67vERtvC5SzmGJP4tNQ',
    description: 'Full canvas dinner suits, double-breasted blazers, and made-to-measure trousers.',
    featured: true,
  },
];
