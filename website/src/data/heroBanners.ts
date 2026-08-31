export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

export const heroBannersData: HeroSlide[] = [
  {
    id: 'banner-01',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-1AEfx93nIUVS9dzHjhb6T-CbQAcgoW6tbfB056EV0u7-KxjKYT2KydDSR9eY1W2Sxb6hb13Us0YKjbM986fZinbZlNSuTu9Q9kw6vhoLa31Rj-7oNBfN1JSlU2-hagc_tIt4LwXvWC9YbIyj5G1Ul24yM1GVVtU23gDqkIkwUt05IPkDJUvVkeOfLfovyRKafaXhDVnEi5Il8xdNK8ws0X4tC3ZU4cg36llOzR6pD93VuWHS5vGzxw',
    title: 'The Art of Modern Elegance',
    subtitle: 'Discover the new signature collection, where timeless design meets contemporary craft.',
    primaryButtonText: 'Shop Collection',
    primaryButtonLink: '/collections',
    secondaryButtonText: 'Explore New Arrivals',
    secondaryButtonLink: '/new-arrivals',
  },
  {
    id: 'banner-02',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfVe4sTWNXcAiUmdiIrefO78YBH1vRfmgc0fvOJ3O8eScLTGeHGkMOcttQVjots95sT7ms9y22OcTA-m6z83Hya1RaWhe_xwTEcYGPYm14VwDbkOKOH3IIjg0foPVlcx03N8G1idk4HdCq2VjZXGatA-kjqwpx6MUE3JMJhmJ7aNZVc59fAklM7JHNfFJfnct-pgigsWsPDImvC9gZILgODNrfdLG7LaWeuI7ZfOA59VcaWGWwAake1w',
    title: 'Ephemeral Light & Liquid Silk',
    subtitle: 'A dialogue between light and weight, crafted for the discerning minimalist wardrobe.',
    primaryButtonText: 'View Womens Edit',
    primaryButtonLink: '/women',
    secondaryButtonText: 'Discover Accessories',
    secondaryButtonLink: '/accessories',
  },
  {
    id: 'banner-03',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD03yYNyAPdt_qsDTHKWPRh49SKI4b6hjDHGvgReLR298F09fFgzwUWtbLQ7rJvf_d78tlfiEtAzNcyF5L98DEMKURC3YpaA1r3SAOeSNePMYCD3goZntJomPn3n4KuT2pbBFzUKxt--nAOa49R8eL2OBc6V0Zky8YBs-hoVcUfT8RE_ml36K5z95hx3mpe-PBfJpMwisinLC09_A9pzyXcyAAByNOLFFP7z1eDd2sXmvG7lT4w_Zy8Ig',
    title: 'Monolithic Forms & Outerwear',
    subtitle: 'Architectural silhouettes engineered to withstand the elements with timeless grace.',
    primaryButtonText: 'Explore Menswear',
    primaryButtonLink: '/men',
    secondaryButtonText: 'All Categories',
    secondaryButtonLink: '/categories',
  },
];
