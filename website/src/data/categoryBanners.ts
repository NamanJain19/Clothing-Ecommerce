export interface CategorySlide {
  id: string;
  image: string;
  badge?: string;
  title: string;
  subtitle: string;
}

export const categoryBannersData: Record<string, CategorySlide[]> = {
  women: [
    {
      id: 'women-01',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLZ81vrKKc9KjF7nq8llSGUICo1ImWRqT2eAiWOArBi73xgF1dumkumkFx85L6231i8QY3IlUvtbfcfCkUFRoLDM5uKjiqF4UpfzAoeQOsxLSMLBg65H8QFly58hTTmUziDVDokMGkLuYH6kYz0a0S4nnLphb21Gce8c2xCN8kEqi5yRE0zWXzd4BAGVCaWB6ZkrwntDMwaiBPvDeEKzZD6ZyBQGtOEiJMIPlPuJBE7atX04ZqSviJlg',
      badge: 'Women’s Collection',
      title: 'Women',
      subtitle: 'A curated evolution of form and texture. Discover architectural silhouettes and elevated essentials.',
    },
    {
      id: 'women-02',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfVe4sTWNXcAiUmdiIrefO78YBH1vRfmgc0fvOJ3O8eScLTGeHGkMOcttQVjots95sT7ms9y22OcTA-m6z83Hya1RaWhe_xwTEcYGPYm14VwDbkOKOH3IIjg0foPVlcx03N8G1idk4HdCq2VjZXGatA-kjqwpx6MUE3JMJhmJ7aNZVc59fAklM7JHNfFJfnct-pgigsWsPDImvC9gZILgODNrfdLG7LaWeuI7ZfOA59VcaWGWwAake1w',
      badge: 'Editorial Silk',
      title: 'Liquid Silk & Tailoring',
      subtitle: 'Effortless drape meeting modern tailoring in pure silk and refined linens.',
    },
    {
      id: 'women-03',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR7U5-7Fsr12Vz6Os5kscKNLSXqUYM0SY5hwO9DxE2WzfXaS5CWc5n9EHg_EDshXcsl6aFQjFsRwX2_vyMAOeRrmQ499TnSuWGcJGN51QOn77pGDxAGZb1fVhykjN_rrab9WNkmhnmCB-CbTNj1ZcRcsgeHZ4FAH13meqbScsBC-0quLcVAERgA5YWLZwqYCKWgqoRjQPvp_otQV7H4yWHu4RdnH1QdS4osNxbtw0nT7Fm-XtV29fKPw',
      badge: 'New Season',
      title: 'Minimalist Restraint',
      subtitle: 'Structured lines designed with timeless restraint for the contemporary individual.',
    },
  ],
  men: [
    {
      id: 'men-01',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGPQOk6iZWR8JE8ZK9UBA1KYtzip0hXSS5KWZKm1MrlmXyo6w5j7GmvTIkAUyoCvxGr-ugobJyf025tNF7zvDHBIk-VdDdOrAT8bHrws5ba1l3zfw0OPIaCqY13A7h6CenkerB0RiY-MzK6-LnY50eysXq8ZkPPnut6Q4KRnMnf5QZ12PZ2yZx57sFsHbppJYXoaAnuCHM7t9hP6y0L1IZ-yQjCB-tLVivwM_gAjb-sF6wWqv5b5k7mQ',
      badge: 'Men’s Collection',
      title: 'Men',
      subtitle: 'A definitive collection of architectural silhouettes, artisanal fabrics, and precision tailoring.',
    },
    {
      id: 'men-02',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD03yYNyAPdt_qsDTHKWPRh49SKI4b6hjDHGvgReLR298F09fFgzwUWtbLQ7rJvf_d78tlfiEtAzNcyF5L98DEMKURC3YpaA1r3SAOeSNePMYCD3goZntJomPn3n4KuT2pbBFzUKxt--nAOa49R8eL2OBc6V0Zky8YBs-hoVcUfT8RE_ml36K5z95hx3mpe-PBfJpMwisinLC09_A9pzyXcyAAByNOLFFP7z1eDd2sXmvG7lT4w_Zy8Ig',
      badge: 'Heritage Craft',
      title: 'Structured Outerwear',
      subtitle: 'Heavyweight cashmere, structured wool, and tailored coats crafted to perfection.',
    },
    {
      id: 'men-03',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6P3LvTpbcepbLXlBcYDTq_SXmZ4LQvWG3F1HrlpPDXtmaLD8e1bPy9brbqxR0bLNtAat9YUu1aLx8pIB4Cru6R2nqif_SV74QwdvfCqPPkkdl5E73wpWF58hxf2Gujj8G_DLZQXXZ9yBXEksiuN3mXa-7X5tDTh0xvI_uo3D-5QkNyntYkr4LuMfvLJ7UFK4WKw2HEc3JmVB-p9wr8cpFyUWexQ60aXwlNI0b8FOu5n6cdPjN09uXdQ',
      badge: 'Modern Classic',
      title: 'Architectural Suitings',
      subtitle: 'Sharply tailored suiting made from the finest Italian and British fabrics.',
    },
  ],
  kids: [
    {
      id: 'kids-01',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpjsRRXS_4RAewE2JaELlpFcDwguk2mkno6RMUNZILd2s3Cnmjg0ZjdfeDHcNJl74DgZ0wLwCNvioYHzd4NfaPqwtvMX9CkTIcGEtaVvkOuYq6DEgrypY09s3onfnPorGwpT3LHB7QJpmOyrPheoG-C0XgSGu8ro5jr1Lxn-BkcX43ik1ApV0jETxAQ9PoiA_RH9qyUUfNCGjSIGYkzZn9jng3NLVAsyPyMuiQ5rCUkzBOI-cBRTpLtw',
      badge: 'Youth Collection',
      title: 'Kids',
      subtitle: 'An elevated collection for the next generation. Timeless silhouettes and quiet luxury.',
    },
    {
      id: 'kids-02',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASnX_GTdK8OwqTUbIUfzchVMhgvxZtpDVZcb2OQ9Gz2jvxK-LSKwj4_5VrOVYv4qz6N3J8A-s6XuYW_RXjFptpwEdfttWxJPJqMaTZFFK8PnnBmYE5wiB7VLuT1g-tLUVsaRZONMSSW-1z8snbboR22BfWUGlQ0DFEzdLwOpyIE3FqAhms6ztAGy-tkrHu73OkR-urfm2Hy-I-4n1f3IES8KQs_8bGMgl_mG0dXrdXyeWiz7r13MGYsQ',
      badge: 'Organic Essentials',
      title: 'The Young Minimalist',
      subtitle: 'Organic cotton, gentle knitwear, and durable silhouettes tailored for youth.',
    },
  ],
  accessories: [
    {
      id: 'acc-01',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_gPO2IxbQcKE0MeuRu3ujTPMbzifjsViruEisG--jVU6M79_vMtLkQcQDaLe50xxcUHi5ZRzmd0C_hBl-P_ntl1DR1aK6-9np6029VRwY0drbR4Wd0yvXxsh2gROr4bDnm5xHZf1z3-LvY8iziAfRovxkN5wgPXrLivciZ2PD4kd3Yuma26abcnmVGhHKcmXt3g-FnCY5lx2QCd4uIuhKNkE91E-yMfb6BVbSvdN60id3W-Ua0x3sQA',
      badge: 'Curated Accessories',
      title: 'Accessories',
      subtitle: 'Curated leather goods, mechanical timepieces, and opticals designed for the modern collector.',
    },
    {
      id: 'acc-02',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-EPqxQerVjTwX4Z91pKWuL2MdnfG7MP4ACCJYK_LaFlmBXCajZ5CAx9eohL93zzSozoR2Gyzqa1Ux4BdREFieEpp8SbPBgWepoRojvNk7tmhJtj8ZOQONRxWeDIOfQChpVoR96mKUEU6yXfA9psFgSYCxPVWAdFLqPtHpaaiwCJk-NJo7udUFQlfUrQVIgs3_K4v6_dpCsc2ZX_OqJ_RTj5mmRgT5IhQuxAMQoJB3vpjZk3ZMtO17yQ',
      badge: 'Fine Leather & Hardware',
      title: 'Nappa & Metal Artifacts',
      subtitle: 'Sculpted leather bags and precision-machined accents crafted by master artisans.',
    },
  ],
  newArrivals: [
    {
      id: 'new-01',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA67_ik-4fd4s0o3mWsXvoBvZkJ7i9zBkvPGT0kHUc3bPX_tPcMpuCeYHs_QgECNY3qb-SOjFZT2iGyuJ4B126w2jbSIvJnH3rx0pC5NtSLsUjePOB56hUh6HZ1bFBV-KaH-2ZV2jPBNZhYlVxYp45PbnWYGlegyabBW1o1huXULkoUkQUAUfZeAy_fIVh-nSbXVDVOjgqOJGlBj3Ld4_ENnfBtMfKa_dBW8vkVnKcFzIrprkwU1PlPsg',
      badge: 'The Latest Season',
      title: 'New Arrivals',
      subtitle: 'Fresh silhouettes just released from our international atelier, showcasing latest craft.',
    },
    {
      id: 'new-02',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-1AEfx93nIUVS9dzHjhb6T-CbQAcgoW6tbfB056EV0u7-KxjKYT2KydDSR9eY1W2Sxb6hb13Us0YKjbM986fZinbZlNSuTu9Q9kw6vhoLa31Rj-7oNBfN1JSlU2-hagc_tIt4LwXvWC9YbIyj5G1Ul24yM1GVVtU23gDqkIkwUt05IPkDJUvVkeOfLfovyRKafaXhDVnEi5Il8xdNK8ws0X4tC3ZU4cg36llOzR6pD93VuWHS5vGzxw',
      badge: 'Signature Drop',
      title: 'Signature Monochrome',
      subtitle: 'Understated luxury with immaculate tailoring and architectural balance.',
    },
  ],
  collections: [
    {
      id: 'col-01',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfVe4sTWNXcAiUmdiIrefO78YBH1vRfmgc0fvOJ3O8eScLTGeHGkMOcttQVjots95sT7ms9y22OcTA-m6z83Hya1RaWhe_xwTEcYGPYm14VwDbkOKOH3IIjg0foPVlcx03N8G1idk4HdCq2VjZXGatA-kjqwpx6MUE3JMJhmJ7aNZVc59fAklM7JHNfFJfnct-pgigsWsPDImvC9gZILgODNrfdLG7LaWeuI7ZfOA59VcaWGWwAake1w',
      badge: 'Editorial Series',
      title: 'The Collections',
      subtitle: 'The seasonal anthology: exploring structure, tactile serenity, and timeless geometry.',
    },
    {
      id: 'col-02',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR7U5-7Fsr12Vz6Os5kscKNLSXqUYM0SY5hwO9DxE2WzfXaS5CWc5n9EHg_EDshXcsl6aFQjFsRwX2_vyMAOeRrmQ499TnSuWGcJGN51QOn77pGDxAGZb1fVhykjN_rrab9WNkmhnmCB-CbTNj1ZcRcsgeHZ4FAH13meqbScsBC-0quLcVAERgA5YWLZwqYCKWgqoRjQPvp_otQV7H4yWHu4RdnH1QdS4osNxbtw0nT7Fm-XtV29fKPw',
      badge: 'Volume IV',
      title: 'Structural Architecture',
      subtitle: 'Where sculpture meets haute couture. Explore our complete seasonal lookbooks.',
    },
  ],
  sale: [
    {
      id: 'sale-01',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmNcJR0zkNI6kjkj7_kznxY3UFY2apfmH3BhzJexUEHbp_5-KIMftywc1awkQi-RjToqoUgSaTqpEabL5QZXURpRBnrOaZz-j1Fyv8A5ip8puDzkTds0h6JvRMDXSlpOU2oli2dpks3dviZNqDnftVEZk3-hl5SQBv4Y2acpl9pRpKAVwgj7ReL6bKDe1zMSR0B1zKQIiBPErc4Ye3W--EUs8i5ghI4jGhkuvQDcododyAUREQXRMT3Q',
      badge: 'Private Archive // Limited Access',
      title: 'Private Sale',
      subtitle: 'Curated archive selections and architectural essentials at privileged private pricing.',
    },
    {
      id: 'sale-02',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDN-TnRFVDOLJaqtD-5XxfuD79lZgYlhhdKuJ8vGewzhc-UQ195D8Gbv7QF18DjcNfPUAlsQ4n4NEzIBFN_THDtDhqxMiNh3tiGqLAoqaXJ35-LeN8tbUn1lCahjtP-le6FHDlvM7YfsabQy4iAyhYjWCJ6hN2Wn5c-ICf9epQgRGp9uJqvSk1r81O5FQJZ7L9FdPoJ4b9bnA1isqKnU9esufqSD41cPAaJFujs8C8zDQSM5gA1Q1BayA',
      badge: 'Archival Vault',
      title: 'Seasonal Reductions',
      subtitle: 'Limited edition garments and runway pieces available with complimentary insured express shipping.',
    },
  ],
};
