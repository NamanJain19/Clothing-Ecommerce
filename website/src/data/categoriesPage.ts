export interface CategoryVolume {
  id: string;
  title: string;
  volume: string;
  description: string;
  itemCount: number;
  image: string;
  link: string;
}

export const categoriesPageData: CategoryVolume[] = [
  {
    id: 'cat-vol-1',
    title: 'Women',
    volume: 'Volume I',
    description: 'Architectural silhouettes, liquid silks, and structured linens for the contemporary wardrobe.',
    itemCount: 128,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPGh3NLXUeJtgdP7GK6kUSOeBYQRcBq4xUTKy6-3uHZvXggmyGfsqGyrXbc7naneJ0NtRcsHq_lVeqx7Kf4P8NiY8ZHOqR_wjqcGEihHaVJRWlce7lpmajlMPi38arVHDJ4o9R_KL9VlhyyOSifFY7hASsSEz6sCOFHvKKLHD_a9GrceeKzOaEuGHrTLVtZOIYDKi4wmKpWWzX4SZMPe6A5gpcpkq5dcMi4eLAzh_Ff-prOjbrtPclLg',
    link: '/women',
  },
  {
    id: 'cat-vol-2',
    title: 'Men',
    volume: 'Volume II',
    description: 'Precision tailoring, organic cashmeres, and structural outerwear defining authoritative elegance.',
    itemCount: 32,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNZmi_RZnL6datlMrPFP75SYRKOzbWNQPiIPXD1e-ymzSzSwrr9Tc3xRFcu6PTn3BPRs266SaUwJoTMsnPLFh9ifFXiSfSgZ0O2_6baVp4gXlO5AS-F4qTon_EwyT3VZMoogWz7q9NBICZ7zNyaS46NrSow3_PsqOw-hkyzXbXcTyVvg-vBNGwrnaSQBjQVcTvwYDawSzZ8VyHUuMpnrlimO5y9WJwqiOX_LJITCeZBS8HelHtLK49Lg',
    link: '/men',
  },
  {
    id: 'cat-vol-3',
    title: 'Kids',
    volume: 'Volume III',
    description: 'Elevated essentials and quiet luxury scaled for the modern youth and next generation.',
    itemCount: 48,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2TCOvLrSu_ZnSas2TATMSGQJzwpbzEWA5N20WXdS4Koyqk3p-JTIrWqRXGbw-xriCFnyFd7KbhvF2LOJMNAEmtKU6fJ_G_4hv-RKWdoTtIwqnQsL9MshjR_tX0ldovjVmtNmCFg4BYg3NJbeBalw6yNit_Lb9ji0Z6Ga4vAtQ458GTkUKe6fNfEm_QPBWHQWpXFDP7cf6NFcmqaNwXV6-1Q5yIl9zeiSn2-0y9N6zaA-niX98AvkFoQ',
    link: '/kids',
  },
  {
    id: 'cat-vol-4',
    title: 'Accessories',
    volume: 'Volume IV',
    description: 'Sculptural leather totes, optical acetate frames, and Swiss-engineered chronograph timepieces.',
    itemCount: 24,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5_ok-84xG2vlq-CN8Jqelz54YWkbdkWNibDoJnkfElRzh-XEVnZadRUpxDvyTkNJwyTyEXLAjO_m_ACrYM6DD80P70lFppkivOARZd89FEF_n11-BosDh4soWF92oB43QZ_txiX8YXSddBCza8EF-EfB3iYi_R0jo9DN87Jsm-WQYwd8CfnvhQiEC4WyBUGujNs5F2PuiHxCHSebePGDz9IOgbsv9ZR6FIxlghpqVGAXLwRB7CTI-Zw',
    link: '/accessories',
  },
  {
    id: 'cat-vol-5',
    title: 'Outerwear',
    volume: 'Volume V',
    description: 'Monolithic shell coats and weather-resistant overcoats engineered for protection and style.',
    itemCount: 36,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3rOK7OMn5CCqYhMWh4EfOywq-bjX8AkxzOvzFqd8i3jykbxlOmF6LtXa0BBr0FoTkj13Ys_1VaJFLwURSLx9NKBV9JqiUGJqi3jPKXGHfBrwQxzUobFXGhd9NNoU34C8yreYDluxaLmd66JBI8_EMOUUf5WJUdxpmrGp2RaeHPS-JJTkN62V4i8awdUcRdnbtUe7BruTD-xum2hbT-22Z_ub2M1pQgUUS8Eaws3xOC0ZTqlr59Nxevg',
    link: '/women',
  },
  {
    id: 'cat-vol-6',
    title: 'Tailoring',
    volume: 'Volume VI',
    description: 'Double-breasted blazers and virgin wool trousers with precise architectural proportions.',
    itemCount: 42,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcXoIfvy-TfCWCc5Cj_m4dGA98RMoinP9cJFMukEo7t2DzyVTeW575p2G9YrM_rBMC_ozV9O5paz8CQ7mLeylIFsDVDNJtWcc1rjcPPJLq7X7w4GkWistVnumVDmux36ObtYLJ2aN-D_JnVnYAy_5xn0Pe9WV03dG4RFeCVjTWah-CXI9U_J5Du77z7Jy9AbevHr-AmD_iJaw14lwZiNrPg5EMGcYUks0-szv0gyiZgKe49dlPeT85Vg',
    link: '/men',
  },
];
