import { CategoryProduct } from './womenProducts';

export interface CartItem {
  id: string;
  name: string;
  categoryTag: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

export const initialCartItems: CartItem[] = [
  {
    id: 'cart-1',
    name: 'Archival Silk Slip Dress',
    categoryTag: 'Ready-to-Wear',
    color: 'Pearl White',
    size: 'EU 38',
    price: 1250,
    quantity: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-Nfjeq46m2xJ4GymhY-CWVY9EVjOojA372rE-6bRT6KWYPqn6NPSyYDtDgR_WS3i6DV8xJUf6iqw7lMT59PNsRlHn2hMwtSINciz2CaydrVqGxBArBq1Vj7l1Jk_rZQ292u5GgHodW_XB8RBw9r8AXCeL9ou5-aIyL8_-gFaH6rwBXLI5AErv7DWmcfuhABNuNi3CiNvpCSluBUrdj0pj3h6pHh0bh65f5GsPFj7oPPUYJI2C9OqaEw',
  },
  {
    id: 'cart-2',
    name: 'Structured Shell Tote',
    categoryTag: 'Accessories',
    color: 'Onyx',
    size: 'Large',
    price: 2800,
    quantity: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFtLoVCpjmLLF4euu36NK_6oJtWQg21x9_7KJcP_BUE8tDzeSi6YtksJJNA2mpFFOayX2a8cIYBOYcyz03DbvS1P4J4Ru3-9dIU_56_g9O3ug8ls2gHZwpVa57uOh4WCW7-QsuhqPFROH9VO3mgaFsE_qREyQ-tqj6xLCp9xpFLfHH-dU1yD6zmVi_z4P6-HFIeMGWJAqhG5uTtvvp6MTraqEip-Ml8h-nwpB-Vq_Diiki8ZSS_5Hrwg',
  },
];

export const savedForLaterItems: CategoryProduct[] = [
  {
    id: 'sfl-1',
    name: 'Sculptural Form Vase',
    specs: 'LIFESTYLE',
    price: 450,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAtbjctRIiCsa01-iRpYdPP2plzlub-C1xAjbAWROswag7UbRACHsXn4Ma-R2MKi1GTfzLLKGZAzkMmHNO4ncVmIqsuKisWEPBfTyHPJiQOOpFrss-YHo8XGbZ9Gjy6lCwzVMcScx5IqtPcIi3BfSr_xJB2tunDxddoAXfSelUNmzJEbCYRGTfAbxG_mNNcg5ZgK92P4AkG93N6DHdXcpgUiWDNEuW77wu8bwF1yaFoF_puRFCq32qsg',
    hoverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAtbjctRIiCsa01-iRpYdPP2plzlub-C1xAjbAWROswag7UbRACHsXn4Ma-R2MKi1GTfzLLKGZAzkMmHNO4ncVmIqsuKisWEPBfTyHPJiQOOpFrss-YHo8XGbZ9Gjy6lCwzVMcScx5IqtPcIi3BfSr_xJB2tunDxddoAXfSelUNmzJEbCYRGTfAbxG_mNNcg5ZgK92P4AkG93N6DHdXcpgUiWDNEuW77wu8bwF1yaFoF_puRFCq32qsg',
  },
  {
    id: 'sfl-2',
    name: 'Leather Archive Folder',
    specs: 'ACCESSORIES',
    price: 780,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2usURM-6I-5Ij5MukFivp82C4at9DSlwWkDEmdkgBFHGEAFNtETI8a_WPsLBQ9PhNqL5CH4oJGtEB5JFunnKmIrTf0HPnTHR7uDIhAVCftwSTpWzU_D7QNlYs9aQ2QhfeAGz3M4lpNyKeX-76NoOiGJfyD8DTWlxG1aPwOJJA9I2OAbAzXoQprRKi84gi_1xa7IDmIjP6J8pU48qhAI41WaPThTLg4Fpv_DvZ3M5vKH-QJNr3yHyXbA',
    hoverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2usURM-6I-5Ij5MukFivp82C4at9DSlwWkDEmdkgBFHGEAFNtETI8a_WPsLBQ9PhNqL5CH4oJGtEB5JFunnKmIrTf0HPnTHR7uDIhAVCftwSTpWzU_D7QNlYs9aQ2QhfeAGz3M4lpNyKeX-76NoOiGJfyD8DTWlxG1aPwOJJA9I2OAbAzXoQprRKi84gi_1xa7IDmIjP6J8pU48qhAI41WaPThTLg4Fpv_DvZ3M5vKH-QJNr3yHyXbA',
  },
  {
    id: 'sfl-3',
    name: 'Monolith Mask Frame',
    specs: 'EYEWEAR',
    price: 320,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHiT0fkfHT6dtaPlHq845eu_VN8o5Y3NLKbXar-MK48hUBmbEYc-uTqNeq_ztHnEu0M1YiYE11j_CZQaCXGH4v4jmym3Jnk80VWWJ6MfYuAXeFEmZDwCtqXXaxcCICwyu2_qRjPDg3ZIP2nb99VPWucVdQYCLxnHe_jFa9Y9OIBeBTSc4UcwYondoMKxwxxxqGPH3qKBR1Jm9eLNYH1_TD6YEzKPTZ8oNqtzNTRYetD_NqGnnCen25EQ',
    hoverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHiT0fkfHT6dtaPlHq845eu_VN8o5Y3NLKbXar-MK48hUBmbEYc-uTqNeq_ztHnEu0M1YiYE11j_CZQaCXGH4v4jmym3Jnk80VWWJ6MfYuAXeFEmZDwCtqXXaxcCICwyu2_qRjPDg3ZIP2nb99VPWucVdQYCLxnHe_jFa9Y9OIBeBTSc4UcwYondoMKxwxxxqGPH3qKBR1Jm9eLNYH1_TD6YEzKPTZ8oNqtzNTRYetD_NqGnnCen25EQ',
  },
];
