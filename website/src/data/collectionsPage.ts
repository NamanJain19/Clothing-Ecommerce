export interface CollectionGridItem {
  id: string;
  name: string;
  category: 'All' | 'Men' | 'Women' | 'Kids' | 'Accessories' | 'New Arrivals' | 'Sale';
  description: string;
  productCount: number;
  image: string;
  link?: string;
}

export const collectionsGridData: CollectionGridItem[] = [
  {
    id: 'cg-1',
    name: 'Summer Solstice Collection',
    category: 'Women',
    description: 'Lightweight narratives for the high-noon sun crafted from liquid silks and Mediterranean linens.',
    productCount: 34,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7AiIV0zqhkUZQi8-w5jGGVJ3-pmm3YwuaYNl4vKcmnwSb9pZasJoShu6YgThq7eYXDqxK_NYDvg39jqAgERcQBgsRlsGcdJUH4Ehmg8rYaqD_D6pnZyf-2WmZxKXfek4sx3AVJUajNAGRCf9bSmsFKQbqMlgT7TP2D08kzteo9yzEKOhFY_1aGcDHbSXVlvHHh3mFnyrr0mqxP4LWIE-RI4qv-wdwzpqGpoT5UUo0REcl6ZY3EtywuQ',
  },
  {
    id: 'cg-2',
    name: 'Winter Monolith Knitwear',
    category: 'Men',
    description: 'Architectural cashmeres, virgin wools, and structured outerwear built for cold climates.',
    productCount: 28,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgs6xkL16M24VB-WmvyhxO7Fj8XxDTJKWwtvQwjZdb1nkcoZUyS1iNz7u2RnWcqEdkPfosEp8N_fg5cvlLqoBHVJXUcDTwlgCoFA7QZ0d2lN4w5r2mHqHac4tNSkksZWF-YB53GDlKr0MBkMv2T9q1kTHVwk--rjYEHV8sRvCFfhkKVZHXKqvj9qmggSZcUrBMqUlAwZleWqB8OIB8Fr70iu0V42kT-xofUq5KC7RtV7IXaDDxpWqZxA',
  },
  {
    id: 'cg-3',
    name: 'The New Youth Capsule',
    category: 'Kids',
    description: 'Quiet luxury silhouettes and organic cotton tailoring scaled for the modern next generation.',
    productCount: 48,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpjsRRXS_4RAewE2JaELlpFcDwguk2mkno6RMUNZILd2s3Cnmjg0ZjdfeDHcNJl74DgZ0wLwCNvioYHzd4NfaPqwtvMX9CkTIcGEtaVvkOuYq6DEgrypY09s3onfnPorGwpT3LHB7QJpmOyrPheoG-C0XgSGu8ro5jr1Lxn-BkcX43ik1ApV0jETxAQ9PoiA_RH9qyUUfNCGjSIGYkzZn9jng3NLVAsyPyMuiQ5rCUkzBOI-cBRTpLtw',
  },
  {
    id: 'cg-4',
    name: 'Artisanal Leather Goods',
    category: 'Accessories',
    description: 'Sculptural totes, optics, and handcrafted calfskin leather footwear.',
    productCount: 19,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZNKbeC6tbKNKUGYH0u690uKr4J3Glb3K8jjeqsCGTQM60D7HDHloDJxhgkg4xVaDB-Wl-9s2EFsuoU_25p-GLAylUMfbOtZxSfdpGCnd83EFUDcSJiDKHzLf57bngJr893SOSNf_R16IQPuhMTqO-OebVcbtCohbGtdlrO1c4w12JlwHDqgfTvS5U3JgH7UnQCFRLtodIK6iB-UZii4v-l3WvWuIMsyJscbGBzYCpU8ZVhJRxoLdFsw',
  },
  {
    id: 'cg-5',
    name: 'Architectural Formal Gala',
    category: 'Sale',
    description: 'Dramatic tuxedos and high-contrast eveningwear available exclusively for private sale.',
    productCount: 16,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTwZ4S54FUsccRMFyv63A--79IGwscXVSzI0qWKSXf4RSb6bP-UW3jU1vNKUpYP1LLIMn4ELvak0S4JMuu5FtYce6-G06fR0TYBAtnVMbrhM9kqaerMiwIZXlUTEdQsGkbP_C9Cb0gMnKNKzsBnAetikdbgwi1J3BmqX6fA4uls71Jhafxi35eFEgA_ZtqLpkLULbXp1gUvJ_GwwS-N70b7raHVPv_ZnRtygi5fwDZs08SDb31lsn_YA',
  },
  {
    id: 'cg-6',
    name: 'Urban Streetwear Archive',
    category: 'New Arrivals',
    description: 'Technical fabrics and relaxed contemporary cuts designed for city life.',
    productCount: 24,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfvAdyXuP5l0zIKAKee8-CuqwTwBmTP52kYdyxjb_wzY0xbq4YhPFSLvYBBtzRp6Y1Y5oD4sNTD81WSIeF_oRm5qooe4PxlWbt0hyDljACD4AgbB5L1SeI1mVkc1JI7tph-_5xb5s_c5k8kpZTk-Ds3zVhm2td05T2JlM1_Qbn717JYqRnxTfB-iEf7Gk2NPRDViYO44B6ty9s4NJz02R87Iw1ah3UlWy2EjUl3k-HhsUscEgxX3OknQ',
  },
];
