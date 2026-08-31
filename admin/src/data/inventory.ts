export interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  category?: string;
  location: string;
  totalStock?: number;
  availableStock: number;
  reservedStock: number;
  safetyThreshold: number;
  status: 'In Stock' | 'Low Stock' | 'Critical' | 'Out of Stock';
  unitCost?: number;
  lastAudited?: string;
  lastAuditDate?: string;
}

export const initialInventory: InventoryItem[] = [
  {
    id: 'INV-001',
    sku: 'MON-CT-001',
    productName: 'Atelier Cashmere Overcoat',
    category: 'Outerwear',
    location: 'Milan Vault A-4',
    availableStock: 14,
    reservedStock: 2,
    safetyThreshold: 5,
    status: 'In Stock',
    unitCost: 1100.0,
    lastAudited: 'Oct 20, 2024',
  },
  {
    id: 'INV-002',
    sku: 'MON-WT-104',
    productName: 'Lunar Chronograph 41mm',
    category: 'Horology',
    location: 'Geneva Safe Deposit 08',
    availableStock: 2,
    reservedStock: 1,
    safetyThreshold: 4,
    status: 'Critical',
    unitCost: 3400.0,
    lastAudited: 'Oct 22, 2024',
  },
  {
    id: 'INV-003',
    sku: 'MON-AC-892',
    productName: 'Grain Leather Minimalist Cardholder',
    category: 'Leather Goods',
    location: 'Paris Hub C-12',
    availableStock: 5,
    reservedStock: 2,
    safetyThreshold: 8,
    status: 'Low Stock',
    unitCost: 120.0,
    lastAudited: 'Oct 18, 2024',
  },
  {
    id: 'INV-004',
    sku: 'MON-FR-050',
    productName: 'Nocturne Eau de Parfum (50ml)',
    category: 'Fragrance',
    location: 'Grasse Cellar B-02',
    availableStock: 8,
    reservedStock: 0,
    safetyThreshold: 10,
    status: 'Low Stock',
    unitCost: 85.0,
    lastAudited: 'Oct 15, 2024',
  },
  {
    id: 'INV-005',
    sku: 'MON-JK-304',
    productName: 'Silk Jacquard Evening Jacket',
    category: 'Tailoring',
    location: 'London Atelier Rack 3',
    availableStock: 0,
    reservedStock: 0,
    safetyThreshold: 3,
    status: 'Out of Stock',
    unitCost: 1450.0,
    lastAudited: 'Oct 23, 2024',
  },
];
