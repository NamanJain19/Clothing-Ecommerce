export interface Review {
  id: string;
  productName: string;
  productImage?: string;
  author: string;
  authorEmail?: string;
  rating: number;
  date: string;
  title: string;
  headline?: string;
  comment: string;
  verified?: boolean;
  isVerified?: boolean;
  status: 'Approved' | 'Pending Moderation' | 'Rejected';
}

export const initialReviews: Review[] = [
  {
    id: 'REV-01',
    productName: 'Atelier Cashmere Overcoat',
    productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATT8ERG7OXAHHfsVDDR_PIjU8lWaHou2PZNgQS0t1grOJegixUBQZY9S46UVmhNHF7htuAiQCiZNjK58-o1UrvimzQwhxlpkRj1Un45EepJyAzVXW5T9f6Uw5iNOBeGJtjWjtVWiCSmyA1S2v3oZPLm-gD10ji0-F40vUbTi1PZHMqOEJFQ6soKv6wtbqlhib1z31fyy4GdmqWBPnRp2g3p0V4IJmF7kER3FKkiHPnC64blBDBU2vNZg',
    author: 'Eleanor Vance-Croft',
    rating: 5,
    date: 'Oct 23, 2024',
    title: 'Exquisite drape and weight',
    comment: 'The Italian cashmere is unparalleled in softness yet maintains crisp structural lines. A true investment masterpiece.',
    verified: true,
    status: 'Approved',
  },
  {
    id: 'REV-02',
    productName: 'Lunar Chronograph 41mm',
    productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyxyqvyh346BaRtj82icFZ6xEJqNwxJObUST0eLtI-twZgrnV-aKZXbTvy856m-SM3EQHVwvjSBwSw9j8GzKcmdjqR0SM8MJ6eEVGs1kfGoblzeKnFLRM0tmPIT825qn1nN9fctSzGBFjTog1_zqqpCgpNrGHp5DrggVk5VDPVKkd9iMl7ssIUbMFRUdE8l-eVAhMoofh4yJbd-RLdrXql7W4zSKTuFPkt63ATk3jXhWlc_kqlqlWivw',
    author: 'Dmitri Pavlov',
    rating: 5,
    date: 'Oct 21, 2024',
    title: 'Horological perfection',
    comment: 'Flawless finishing on the column wheel movement. The dial catches light with subtle astronomical brilliance.',
    verified: true,
    status: 'Approved',
  },
  {
    id: 'REV-03',
    productName: 'Grain Leather Minimalist Cardholder',
    productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR6aK4Him3nAFtFIsMlS9ukrGjyGi-g2fg5ua3B3PJr2da4K79QBAIf_k-fEkOXKd6hp5XX4AuPhRYDy3642DOmzX8kLetTi-uw8aVE5E5q7Kc4YfMaaHRVZm286H19bN625BHVfVn5kXW2ZDnyvaa5HgRd2qI55_MfpAB2jr9fdVdyV4DGdOBE8LOl3QsjmxG8HdBWNxqKF0PgiZLB2sKCiNKm6WX8X7HPSfhVZsRa5lQw8DZhGyajQ',
    author: 'Sophia Chen',
    rating: 4,
    date: 'Oct 19, 2024',
    title: 'Supple leather, slightly snug slots',
    comment: 'Gorgeous calfskin smell and finish. Slots were slightly tight on arrival but molded gracefully after two days of use.',
    verified: true,
    status: 'Pending Moderation',
  },
];
