export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  placement: 'Home Hero' | 'Category Header' | 'Private Salon Modal' | 'Announcement Bar';
  image: string;
  link: string;
  ctaText: string;
  status: 'Active' | 'Scheduled' | 'Draft';
  impressions: number;
  clicks: number;
}

export const initialBanners: Banner[] = [
  {
    id: 'BAN-01',
    title: 'Winter Solstice MMXXIV',
    subtitle: 'The Architectural Silhouette Collection',
    placement: 'Home Hero',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATT8ERG7OXAHHfsVDDR_PIjU8lWaHou2PZNgQS0t1grOJegixUBQZY9S46UVmhNHF7htuAiQCiZNjK58-o1UrvimzQwhxlpkRj1Un45EepJyAzVXW5T9f6Uw5iNOBeGJtjWjtVWiCSmyA1S2v3oZPLm-gD10ji0-F40vUbTi1PZHMqOEJFQ6soKv6wtbqlhib1z31fyy4GdmqWBPnRp2g3p0V4IJmF7kER3FKkiHPnC64blBDBU2vNZg',
    link: '/collections/winter-solstice',
    ctaText: 'Discover The Atelier',
    status: 'Active',
    impressions: 48920,
    clicks: 6410,
  },
  {
    id: 'BAN-02',
    title: 'Celestial Complications',
    subtitle: 'Hand-assembled in Glashütte & Geneva',
    placement: 'Category Header',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyxyqvyh346BaRtj82icFZ6xEJqNwxJObUST0eLtI-twZgrnV-aKZXbTvy856m-SM3EQHVwvjSBwSw9j8GzKcmdjqR0SM8MJ6eEVGs1kfGoblzeKnFLRM0tmPIT825qn1nN9fctSzGBFjTog1_zqqpCgpNrGHp5DrggVk5VDPVKkd9iMl7ssIUbMFRUdE8l-eVAhMoofh4yJbd-RLdrXql7W4zSKTuFPkt63ATk3jXhWlc_kqlqlWivw',
    link: '/categories/horology-timepieces',
    ctaText: 'Explore Timepieces',
    status: 'Active',
    impressions: 22100,
    clicks: 3180,
  },
  {
    id: 'BAN-03',
    title: 'Private Salon Appointments',
    subtitle: 'Book bespoke fitting at Paris & Milan suites',
    placement: 'Private Salon Modal',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAieKJwXoPSramdJkcZE-alnA9VqM2Gll-lRDyQ2Tpj3TiJFvAC09t7hQfF6ZEfHLANuzPqqL7p8NwJkTEI_5w4eEwI-Yg2SM3_YgwWbPae4AwSI_eluAQ8i3Cm_WKkThHVnoYyO1nUdllWhYK4eLCHNzgktNmvwYV8C4IYlxv5d4BFJGPN9ZNp_5Lmui8BkuEZIeuOfmZJTqvYe8WkVbrnDrQ0_WrT9uROrvv67vERtvC5SzmGJP4tNQ',
    link: '/salon',
    ctaText: 'Reserve Concierge',
    status: 'Scheduled',
    impressions: 0,
    clicks: 0,
  },
];
