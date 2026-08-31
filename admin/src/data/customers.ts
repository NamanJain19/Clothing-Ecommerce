export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'Bespoke Private' | 'VIP Platinum' | 'Gold Tier' | 'Client';
  totalSpent: number;
  ordersCount: number;
  city: string;
  country: string;
  joinDate: string;
  status: 'Active' | 'Dormant';
}

export const initialCustomers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Jane Doe',
    email: 'jane.doe@luxuryclient.com',
    phone: '+1 (212) 555-0199',
    tier: 'VIP Platinum',
    totalSpent: 18450.0,
    ordersCount: 9,
    city: 'New York',
    country: 'United States',
    joinDate: 'Jan 14, 2023',
    status: 'Active',
  },
  {
    id: 'CUST-002',
    name: 'Marcus Smith',
    email: 'marcus.smith@enterprise.co.uk',
    phone: '+44 20 7946 0912',
    tier: 'Gold Tier',
    totalSpent: 9200.0,
    ordersCount: 5,
    city: 'London',
    country: 'United Kingdom',
    joinDate: 'Mar 22, 2023',
    status: 'Active',
  },
  {
    id: 'CUST-003',
    name: 'Anna Kim',
    email: 'anna.kim@cheongdam.kr',
    phone: '+82 2-3410-1234',
    tier: 'Bespoke Private',
    totalSpent: 42800.0,
    ordersCount: 16,
    city: 'Seoul',
    country: 'South Korea',
    joinDate: 'Nov 05, 2022',
    status: 'Active',
  },
  {
    id: 'CUST-004',
    name: 'Lord Arthur Sterling',
    email: 'sterling.private@holdings.ch',
    phone: '+41 22 819 2000',
    tier: 'Bespoke Private',
    totalSpent: 86400.0,
    ordersCount: 22,
    city: 'Geneva',
    country: 'Switzerland',
    joinDate: 'Jun 19, 2022',
    status: 'Active',
  },
  {
    id: 'CUST-005',
    name: 'Elias Vance',
    email: 'elias.vance@vancemedia.com',
    phone: '+1 (310) 555-0144',
    tier: 'Client',
    totalSpent: 1450.0,
    ordersCount: 1,
    city: 'Los Angeles',
    country: 'United States',
    joinDate: 'Oct 24, 2024',
    status: 'Active',
  },
];
