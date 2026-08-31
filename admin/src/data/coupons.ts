export interface Coupon {
  id: string;
  code: string;
  type: 'Percentage' | 'Fixed Amount' | 'Complimentary Bespoke';
  value: string;
  minSpend: number;
  usageLimit: number;
  usedCount: number;
  validUntil: string;
  status: 'Active' | 'Scheduled' | 'Expired' | 'Disabled';
}

export const initialCoupons: Coupon[] = [
  {
    id: 'CPN-01',
    code: 'PRIVATEVIP15',
    type: 'Percentage',
    value: '15% OFF',
    minSpend: 2500,
    usageLimit: 100,
    usedCount: 42,
    validUntil: 'Dec 31, 2024',
    status: 'Active',
  },
  {
    id: 'CPN-02',
    code: 'ATELIERWELCOME',
    type: 'Fixed Amount',
    value: '$300 OFF',
    minSpend: 1500,
    usageLimit: 250,
    usedCount: 189,
    validUntil: 'Nov 30, 2024',
    status: 'Active',
  },
  {
    id: 'CPN-03',
    code: 'BLACKTIEGALA',
    type: 'Percentage',
    value: '20% OFF',
    minSpend: 4000,
    usageLimit: 50,
    usedCount: 0,
    validUntil: 'Jan 15, 2025',
    status: 'Scheduled',
  },
  {
    id: 'CPN-04',
    code: 'SUMMERARCHIVE',
    type: 'Percentage',
    value: '25% OFF',
    minSpend: 2000,
    usageLimit: 150,
    usedCount: 150,
    validUntil: 'Aug 31, 2024',
    status: 'Expired',
  },
];
