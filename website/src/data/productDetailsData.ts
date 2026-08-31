export interface ProductDetailItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  description: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  images: string[];
  specs: {
    fit: string;
    composition: string;
    origin: string;
    care: string;
  };
  recommended: {
    id: string;
    name: string;
    specs: string;
    price: number;
    image: string;
    hoverImage: string;
  }[];
}

export const singleProductDetail: ProductDetailItem = {
  id: 'prod-detail-1',
  name: 'Silk-Blend Oversized Shirt',
  subtitle: 'MONOLITH ARCHIVE // VOL. I',
  price: 890,
  description:
    'An architectural silhouette crafted from heavyweight silk-cotton crepe de chine. Features subtle dropped shoulders, structured extended cuffs, and hand-finished mother-of-pearl button fastenings.',
  colors: [
    { name: 'Obsidian Black', hex: '#000000' },
    { name: 'Ivory White', hex: '#F5F5F0' },
    { name: 'Slate Grey', hex: '#5D5F5F' },
  ],
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  images: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC-Hg7kaTJwYMU8QyY_u43lcl_WN44ZBkua1rxa-K8QMnzpW8Lm18EZkJLk64UAhpJ2peq7iaSr2q20MOBCcLEpUYW_BoYDj56QuEe7Ta9mCiGIAzeJFTwtG1EN3eIvgsTkNHIExqI9aPI8S49PsuxACgSDXovZCMBdS1JRgezvc_6AXe_bkfOXfh9tXGSk8PcI8DFl_pJ4sVVNRjCxIy1OLlq4NkiAeLNbbPlcHqGfrzJuB5O1059T1g',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCiMMIcFRwLeskgynVCXpiIyQqIjjdUv7npwG91RX4Lex-MOrO1PnorTccAMoxypZcrtEC8XLjaRbS3ipuJAMnvqwZL4EM3p_g4H7mbQMARNF8QUgawYDNva11LWQe41kxKj_rjdtVtv6luhfJUvPjktDdSF0MEYMlcV8VFzNruQKOnC8L_PddqQJ60A7rPnGs8vZ1KjqBuBiJJy6TamEIPvnm_4_-l8vTqwwfNZJTGHzbgn_-1rYAP-Q',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD1wgePncgjSfMvSbwKY-JZPN3QXOTgQrIQb62jlg0lrv69ESwlco4ApX4WGNRg9U3PX8HBGpuvXrSAjhkxgi3nsprFjZfw81VVUuehgEeoFnRAclHs7z_W0RCI7HxZfgHv7JVcF8SNOhqucz3uwHs7LACtT7VJGrDqWYD1_TSNO_ymLEgqYDrIATINBIxvunMLG6SMYjJWb6LhlDxyfGdjJOdKpz9D-6SAY4b5HsEYXAUjZl84pToCHg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB3rOK7OMn5CCqYhMWh4EfOywq-bjX8AkxzOvzFqd8i3jykbxlOmF6LtXa0BBr0FoTkj13Ys_1VaJFLwURSLx9KBV9JqiUGJqi3jPKXGHfBrwQxzUobFXGhd9NNoU34C8yreYDluxaLmd66JBI8_EMOUUf5WJUdxpmrGp2RaeHPS-JJTkN62V4i8awdUcRdnbtUe7BruTD-xum2hbT-22Z_ub2M1pQgUUS8Eaws3xOC0ZTqlr59Nxevg',
  ],
  specs: {
    fit: 'Relaxed oversized drape. Designed to fit loose on the body.',
    composition: '68% Mulberry Silk, 32% Organic Egyptian Cotton',
    origin: 'Hand-tailored in Milan, Italy',
    care: 'Dry clean only. Cool iron on reverse.',
  },
  recommended: [
    {
      id: 'rec-1',
      name: 'Tailored Wool Trousers',
      specs: 'CHARCOAL / VIRGIN WOOL',
      price: 550,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1wgePncgjSfMvSbwKY-JZPN3QXOTgQrIQb62jlg0lrv69ESwlco4ApX4WGNRg9U3PX8HBGpuvXrSAjhkxgi3nsprFjZfw81VVUuehgEeoFnRAclHs7z_W0RCI7HxZfgHv7JVcF8SNOhqucz3uwHs7LACtT7VJGrDqWYD1_TSNO_ymLEgqYDrIATINBIxvunMLG6SMYjJWb6LhlDxyfGdjJOdKpz9D-6SAY4b5HsEYXAUjZl84pToCHg',
      hoverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc_gk8Gq0cQ_YFcl5Bvh_J2rQJVxXka7Y03WlI2l9TR-Ju6JJkcihmpekaGkHoUd5hTXDcdBxbdv8oO6or20L-PZQ6EyCUtf5pv80I2tSPpQ8whRytZXW7I_7cPmJhmmKVP7CEvPUqV1B4yfgQ2PLEcwkXXAdYkhMfwoBTeaZGSVQJh37trcyqcmuV6jlT7Z4idrFmrH3dQ2Kfd3fNbRXXcQIwcWb8OKTqXZs058gvM7oKLba24dsj5A',
    },
    {
      id: 'rec-2',
      name: 'Monolith Tote I',
      specs: 'BLACK GRAIN LEATHER',
      price: 1250,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmNcJR0zkNI6kjkj7_kznxY3UFY2apfmH3BhzJexUEHbp_5-KIMftywc1awkQi-RjToqoUgSaTqpEabL5QZXURpRBnrOaZz-j1Fyv8A5ip8puDzkTds0h6JvRMDXSlpOU2oli2dpks3dviZNqDnftVEZk3-hl5SQBv4Y2acpl9pRpKAVwgj7ReL6bKDe1zMSR0B1zKQIiBPErc4Ye3W--EUs8i5ghI4jGhkuvQDcododyAUREQXRMT3Q',
      hoverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_gPO2IxbQcKE0MeuRu3ujTPMbzifjsViruEisG--jVU6M79_vMtLkQcQDaLe50xxcUHi5ZRzmd0C_hBl-P_ntl1DR1aK6-9np6029VRwY0drbR4Wd0yvXxsh2gROr4bDnm5xHZf1z3-LvY8iziAfRovxkN5wgPXrLivciZ2PD4kd3Yuma26abcnmVGhHKcmXt3g-FnCY5lx2QCd4uIuhKNkE91E-yMfb6BVbSvdN60id3W-Ua0x3sQA',
    },
    {
      id: 'rec-3',
      name: 'Minimalist Leather Oxford',
      specs: 'CALFSKIN LEATHER',
      price: 950,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwqcNCNaPHRRhoPg4qmMOeiXvtSC9rLhlxFpsfhDhH8tZ50YYlk9TnxiTfCWSY282kFXuY_vkfunRhaYR1NyuYSmm5n2sMbhxtrFyxMn8OBoqyLXZyX3WiNwSoiH-_r9Oy5NAPjNc59m3qfBclIUyUr4gluMj0tmTp6sGiZcp30kA1Zz2RbDMvW-sgtSIUg4R6lBIRt9E7dA-33WKwZ_PymrBhocj3I1xINiq8OeFKY4-esLV8e9XsNA',
      hoverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnY6X99tcQPAz-ikyCiktSmrRh6DQf_AEX36nztRncZmUyhYqfipksbtIseV4506MmC7vPuKXTi7BBzPwgySdn5owyiduZoJ3S1EEg_59hk9YgF-cqE_AVeRMPHm8N71iGM7rkHfxNFTHV1W5bpfAVCxemRypNmMWuGW3czhos1F9M7rGDDuhmX5l2Kk5dYESuCe3UH1ie5GybYFdSuU_V6IKW9g9Ql1nAPgfamTQ5GFb4qCHDMbp7PQ',
    },
  ],
};
