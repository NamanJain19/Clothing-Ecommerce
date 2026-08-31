export interface Collection {
  id: string;
  name: string;
  season: string;
  itemCount: number;
  status: 'Published' | 'Upcoming' | 'Archived';
  curator: string;
  image: string;
  description: string;
  releaseDate?: string;
}

export const initialCollections: Collection[] = [
  {
    id: 'COL-01',
    name: 'Winter Solstice 2024',
    season: 'Autumn / Winter',
    itemCount: 28,
    status: 'Published',
    curator: 'Atelier Creative Studio',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATT8ERG7OXAHHfsVDDR_PIjU8lWaHou2PZNgQS0t1grOJegixUBQZY9S46UVmhNHF7htuAiQCiZNjK58-o1UrvimzQwhxlpkRj1Un45EepJyAzVXW5T9f6Uw5iNOBeGJtjWjtVWiCSmyA1S2v3oZPLm-gD10ji0-F40vUbTi1PZHMqOEJFQ6soKv6wtbqlhib1z31fyy4GdmqWBPnRp2g3p0V4IJmF7kER3FKkiHPnC64blBDBU2vNZg',
    description: 'Monochromatic architectural volumes crafted in Loro Piana cashmere and vicuña.',
  },
  {
    id: 'COL-02',
    name: 'Celestial Horology Suite',
    season: 'Permanent Capsule',
    itemCount: 12,
    status: 'Published',
    curator: 'Master Watchmaker Guild',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyxyqvyh346BaRtj82icFZ6xEJqNwxJObUST0eLtI-twZgrnV-aKZXbTvy856m-SM3EQHVwvjSBwSw9j8GzKcmdjqR0SM8MJ6eEVGs1kfGoblzeKnFLRM0tmPIT825qn1nN9fctSzGBFjTog1_zqqpCgpNrGHp5DrggVk5VDPVKkd9iMl7ssIUbMFRUdE8l-eVAhMoofh4yJbd-RLdrXql7W4zSKTuFPkt63ATk3jXhWlc_kqlqlWivw',
    description: 'Astronomical moonphase and flyback chronographs hand-finished in Glashütte.',
  },
  {
    id: 'COL-03',
    name: 'Black Tie Gala Evening',
    season: 'Holiday 2024',
    itemCount: 16,
    status: 'Upcoming',
    curator: 'Elena Rostova',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAieKJwXoPSramdJkcZE-alnA9VqM2Gll-lRDyQ2Tpj3TiJFvAC09t7hQfF6ZEfHLANuzPqqL7p8NwJkTEI_5w4eEwI-Yg2SM3_YgwWbPae4AwSI_eluAQ8i3Cm_WKkThHVnoYyO1nUdllWhYK4eLCHNzgktNmvwYV8C4IYlxv5d4BFJGPN9ZNp_5Lmui8BkuEZIeuOfmZJTqvYe8WkVbrnDrQ0_WrT9uROrvv67vERtvC5SzmGJP4tNQ',
    description: 'Dramatic velvet smoking jackets, silk cummerbunds, and hand-embroidered evening shirts.',
  },
];
