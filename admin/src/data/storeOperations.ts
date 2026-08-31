// Shipping Zones & Methods
export interface ShippingZone {
  id: string;
  name: string;
  regions: string[];
  carrier: string;
  serviceType: string;
  baseRate: number;
  freeShippingThreshold: number;
  deliveryTime: string;
  status: 'Active' | 'Inactive';
}

export const initialShippingZones: ShippingZone[] = [
  {
    id: 'SHIP-01',
    name: 'Continental North America (Armored Courier)',
    regions: ['United States', 'Canada'],
    carrier: 'Ferrari Express Concierge',
    serviceType: 'Bespoke White-Glove Hand Delivery',
    baseRate: 150.0,
    freeShippingThreshold: 5000.0,
    deliveryTime: '24-48 Hours',
    status: 'Active',
  },
  {
    id: 'SHIP-02',
    name: 'European Union & Switzerland High-Security',
    regions: ['France', 'Italy', 'Germany', 'Switzerland', 'Monaco', 'UK'],
    carrier: 'Malca-Amit Vault Transit',
    serviceType: 'Armored Diplomatic Transit',
    baseRate: 180.0,
    freeShippingThreshold: 5000.0,
    deliveryTime: '24 Hours',
    status: 'Active',
  },
  {
    id: 'SHIP-03',
    name: 'Asia Pacific Private Jet Courier',
    regions: ['Japan', 'South Korea', 'Singapore', 'UAE', 'Hong Kong'],
    carrier: 'Brink’s Global Services',
    serviceType: 'Direct Atelier Dispatch',
    baseRate: 250.0,
    freeShippingThreshold: 8000.0,
    deliveryTime: '48-72 Hours',
    status: 'Active',
  },
];

// Payments Gateways & Configuration
export interface PaymentGateway {
  id: string;
  name: string;
  provider: string;
  type: 'Credit / Debit Card' | 'Crypto Private Vault' | 'Direct Wire Transfer' | 'Concierge Escrow';
  currency: string;
  feePercentage: number;
  testMode: boolean;
  status: 'Connected' | 'Pending Setup' | 'Disabled';
  dailyVolume: number;
}

export const initialPaymentGateways: PaymentGateway[] = [
  {
    id: 'PAY-01',
    name: 'Stripe Sovereign Black',
    provider: 'Stripe Global Enterprise',
    type: 'Credit / Debit Card',
    currency: 'USD, EUR, GBP, CHF, JPY',
    feePercentage: 1.75,
    testMode: false,
    status: 'Connected',
    dailyVolume: 64200.0,
  },
  {
    id: 'PAY-02',
    name: 'Swiss Private Bank Direct Wire',
    provider: 'Lombard Odier Swiss Clearing',
    type: 'Direct Wire Transfer',
    currency: 'CHF, EUR, USD',
    feePercentage: 0.0,
    testMode: false,
    status: 'Connected',
    dailyVolume: 184000.0,
  },
  {
    id: 'PAY-03',
    name: 'BitGo Institutional Custody',
    provider: 'BitGo Vault Multi-Sig',
    type: 'Crypto Private Vault',
    currency: 'BTC, ETH, USDC',
    feePercentage: 0.5,
    testMode: false,
    status: 'Connected',
    dailyVolume: 42000.0,
  },
];

// Returns & Exchanges
export interface ReturnRequest {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  productImage: string;
  reason: string;
  type: 'Exchange' | 'Refund' | 'Atelier Tailoring Alteration';
  amount: number;
  date: string;
  status: 'Pending Review' | 'Authorized' | 'Received & Verified' | 'Completed' | 'Rejected';
}

export const initialReturns: ReturnRequest[] = [
  {
    id: 'RET-101',
    orderNumber: '#ORD-9018',
    customerName: 'Claire Beauchamp',
    customerEmail: 'claire.beauchamp@luxury.fr',
    productName: 'Atelier Cashmere Overcoat',
    productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATT8ERG7OXAHHfsVDDR_PIjU8lWaHou2PZNgQS0t1grOJegixUBQZY9S46UVmhNHF7htuAiQCiZNjK58-o1UrvimzQwhxlpkRj1Un45EepJyAzVXW5T9f6Uw5iNOBeGJtjWjtVWiCSmyA1S2v3oZPLm-gD10ji0-F40vUbTi1PZHMqOEJFQ6soKv6wtbqlhib1z31fyy4GdmqWBPnRp2g3p0V4IJmF7kER3FKkiHPnC64blBDBU2vNZg',
    reason: 'Sleeve length adjustment requested for custom cuff silhouette.',
    type: 'Atelier Tailoring Alteration',
    amount: 2450.0,
    date: 'Oct 23, 2024',
    status: 'Authorized',
  },
  {
    id: 'RET-102',
    orderNumber: '#ORD-8994',
    customerName: 'Viktor Romanov',
    customerEmail: 'viktor.romanov@nordiccapital.com',
    productName: 'Grain Leather Minimalist Cardholder',
    productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR6aK4Him3nAFtFIsMlS9ukrGjyGi-g2fg5ua3B3PJr2da4K79QBAIf_k-fEkOXKd6hp5XX4AuPhRYDy3642DOmzX8kLetTi-uw8aVE5E5q7Kc4YfMaaHRVZm286H19bN625BHVfVn5kXW2ZDnyvaa5HgRd2qI55_MfpAB2jr9fdVdyV4DGdOBE8LOl3QsjmxG8HdBWNxqKF0PgiZLB2sKCiNKm6WX8X7HPSfhVZsRa5lQw8DZhGyajQ',
    reason: 'Exchange for Midnight Black colorway.',
    type: 'Exchange',
    amount: 320.0,
    date: 'Oct 20, 2024',
    status: 'Received & Verified',
  },
];

// Brands
export interface Brand {
  id: string;
  name: string;
  origin: string;
  founded: number;
  productCount: number;
  status: 'Active' | 'Archived';
  description: string;
  logoText: string;
}

export const initialBrands: Brand[] = [
  {
    id: 'BRD-01',
    name: 'Monolith Sartorial',
    origin: 'Milan, Italy',
    founded: 1988,
    productCount: 112,
    status: 'Active',
    description: 'Bespoke tailoring, outerwear, and ceremonial gala evening garments.',
    logoText: 'MS',
  },
  {
    id: 'BRD-02',
    name: 'Monolith Horlogerie',
    origin: 'Geneva, Switzerland',
    founded: 1994,
    productCount: 38,
    status: 'Active',
    description: 'High complication mechanical timepieces with astronomical dial works.',
    logoText: 'MH',
  },
  {
    id: 'BRD-03',
    name: 'Monolith Leathercraft',
    origin: 'Florence, Italy',
    founded: 1991,
    productCount: 64,
    status: 'Active',
    description: 'Hand-burnished vegetable tanned and saddle-stitched exotic skins.',
    logoText: 'ML',
  },
  {
    id: 'BRD-04',
    name: 'Monolith Parfums',
    origin: 'Grasse, France',
    founded: 2004,
    productCount: 22,
    status: 'Active',
    description: 'Rare botanical extractions formulated in limited batch vintage pressings.',
    logoText: 'MP',
  },
];

// Size Guides
export interface SizeGuide {
  id: string;
  title: string;
  category: string;
  chartData: {
    size: string;
    chest: string;
    waist: string;
    hips: string;
    shoulders: string;
  }[];
  notes: string;
  lastUpdated: string;
}

export const initialSizeGuides: SizeGuide[] = [
  {
    id: 'SZ-01',
    title: 'Men’s Sartorial Outerwear & Tailoring',
    category: 'Outerwear & Tailoring',
    chartData: [
      { size: '46 EU / 36 US', chest: '92-95 cm', waist: '78-81 cm', hips: '94-97 cm', shoulders: '44.5 cm' },
      { size: '48 EU / 38 US', chest: '96-99 cm', waist: '82-85 cm', hips: '98-101 cm', shoulders: '45.5 cm' },
      { size: '50 EU / 40 US', chest: '100-103 cm', waist: '86-89 cm', hips: '102-105 cm', shoulders: '46.5 cm' },
      { size: '52 EU / 42 US', chest: '104-107 cm', waist: '90-93 cm', hips: '106-109 cm', shoulders: '47.5 cm' },
      { size: '54 EU / 44 US', chest: '108-111 cm', waist: '94-97 cm', hips: '110-113 cm', shoulders: '48.5 cm' },
    ],
    notes: 'Measurements reflect actual garment proportions. Designed for modern structured drape over fine knitwear.',
    lastUpdated: 'Oct 15, 2024',
  },
  {
    id: 'SZ-02',
    title: 'Horology Strap & Wrist Circumference',
    category: 'Horology',
    chartData: [
      { size: 'Small (S)', chest: 'N/A', waist: 'N/A', hips: 'N/A', shoulders: '150-165 mm' },
      { size: 'Standard (M)', chest: 'N/A', waist: 'N/A', hips: 'N/A', shoulders: '165-185 mm' },
      { size: 'Large (L)', chest: 'N/A', waist: 'N/A', hips: 'N/A', shoulders: '185-210 mm' },
    ],
    notes: 'Bespoke pin buckle or deployment clasp fittings adjusted complacently at any authorized boutique.',
    lastUpdated: 'Sep 29, 2024',
  },
];

// Gift Cards
export interface GiftCard {
  id: string;
  code: string;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  initialBalance: number;
  currentBalance: number;
  status: 'Active' | 'Fully Redeemed' | 'Expired' | 'Revoked';
  issuedDate: string;
  expiryDate: string;
}

export const initialGiftCards: GiftCard[] = [
  {
    id: 'GC-001',
    code: 'MNL-GFT-9041-8821',
    recipientName: 'Baroness Caroline de Rothschild',
    recipientEmail: 'caroline@rothschild-salon.fr',
    senderName: 'Lord Arthur Sterling',
    initialBalance: 10000.0,
    currentBalance: 7550.0,
    status: 'Active',
    issuedDate: 'Oct 01, 2024',
    expiryDate: 'Oct 01, 2026',
  },
  {
    id: 'GC-002',
    code: 'MNL-GFT-3012-7492',
    recipientName: 'Sebastian Hayes',
    recipientEmail: 'sebastian.hayes@oxford.ac.uk',
    senderName: 'Elena Rostova',
    initialBalance: 2500.0,
    currentBalance: 0.0,
    status: 'Fully Redeemed',
    issuedDate: 'Aug 14, 2024',
    expiryDate: 'Aug 14, 2026',
  },
];

// Email Templates
export interface EmailTemplate {
  id: string;
  name: string;
  title: string;
  subject: string;
  trigger: string;
  category: 'Orders' | 'Authentication' | 'Atelier Private Concierge' | 'Marketing';
  status: 'Active' | 'Draft';
  lastModified: string;
  htmlContent: string;
}

export const initialEmailTemplates: EmailTemplate[] = [
  {
    id: 'TMP-01',
    name: 'Bespoke Order Confirmation',
    title: 'Bespoke Order Confirmation',
    subject: 'Confirmation of Atelier Acquisition — {{order_number}}',
    trigger: 'Order Placed & Paid',
    category: 'Orders',
    status: 'Active',
    lastModified: 'Oct 21, 2024',
    htmlContent: `<h2>Monolith Luxury</h2><p>Dear {{customer_name}},</p><p>We have received your bespoke acquisition for order <strong>{{order_number}}</strong>. Our master tailors and artisans are now preparing your assets.</p>`,
  },
  {
    id: 'TMP-02',
    name: 'Armored Dispatch & Tracking Notification',
    title: 'Armored Dispatch & Tracking Notification',
    subject: 'Armored Transit Dispatched — {{order_number}}',
    trigger: 'Order Shipped',
    category: 'Orders',
    status: 'Active',
    lastModified: 'Oct 18, 2024',
    htmlContent: `<h2>Monolith Secure Transit</h2><p>Dear {{customer_name}},</p><p>Your order <strong>{{order_number}}</strong> is currently in transit with {{carrier_name}} under tracking number <strong>{{tracking_number}}</strong>.</p>`,
  },
  {
    id: 'TMP-03',
    name: 'Two-Factor Access Verification Code',
    title: 'Two-Factor Access Verification Code',
    subject: 'Monolith Executive Gateway — Verification OTP',
    trigger: 'Admin / VIP 2FA Login',
    category: 'Authentication',
    status: 'Active',
    lastModified: 'Oct 10, 2024',
    htmlContent: `<h2>Authorized Security</h2><p>Your one-time authorization code is: <strong>{{otp_code}}</strong>. This passkey expires in 5 minutes.</p>`,
  },
];

// CMS Pages
export interface PageItem {
  id: string;
  title: string;
  slug: string;
  layout: 'Standard Editorial' | 'Full Screen Atelier' | 'Legal Compliance' | 'Interactive Map';
  status: 'Published' | 'Draft';
  lastUpdated: string;
  author: string;
}

export const initialPages: PageItem[] = [
  {
    id: 'PG-01',
    title: 'The Monolith Heritage & Atelier History',
    slug: 'heritage-atelier',
    layout: 'Full Screen Atelier',
    status: 'Published',
    lastUpdated: 'Oct 19, 2024',
    author: 'Curator Master In-Chief',
  },
  {
    id: 'PG-02',
    title: 'Private Client Concierge & Bespoke Appointments',
    slug: 'concierge-bespoke',
    layout: 'Standard Editorial',
    status: 'Published',
    lastUpdated: 'Oct 12, 2024',
    author: 'Elena Rostova',
  },
  {
    id: 'PG-03',
    title: 'Privacy Policy & Data Sovereign Protocol',
    slug: 'privacy-policy',
    layout: 'Legal Compliance',
    status: 'Published',
    lastUpdated: 'Sep 30, 2024',
    author: 'Legal Counsel Guild',
  },
];

// Navigation Menus
export interface NavigationMenu {
  id: string;
  location: 'Header Primary' | 'Footer Col 1' | 'Footer Col 2' | 'Mobile VIP Drawer';
  itemsCount: number;
  status: 'Active' | 'Draft';
  items: { label: string; url: string; badge?: string }[];
}

export const initialNavigationMenus: NavigationMenu[] = [
  {
    id: 'NAV-01',
    location: 'Header Primary',
    itemsCount: 5,
    status: 'Active',
    items: [
      { label: 'Outerwear', url: '/categories/outerwear-coats' },
      { label: 'Horology', url: '/categories/horology-timepieces' },
      { label: 'Leather Goods', url: '/categories/fine-leather-goods' },
      { label: 'Collections', url: '/collections' },
      { label: 'Atelier Salon', url: '/salon', badge: 'Private' },
    ],
  },
  {
    id: 'NAV-02',
    location: 'Footer Col 1',
    itemsCount: 4,
    status: 'Active',
    items: [
      { label: 'The Heritage', url: '/pages/heritage-atelier' },
      { label: 'Bespoke Services', url: '/pages/concierge-bespoke' },
      { label: 'Sustainability & Sourcing', url: '/pages/sourcing' },
      { label: 'Press & Editorial', url: '/pages/press' },
    ],
  },
];

// Website Content Sections
export interface WebsiteSection {
  id: string;
  title: string;
  type: 'Hero Banner' | 'Curated Editorial Grid' | 'Featured Product Carousel' | 'Atelier Quote' | 'Video Showcase';
  pageLocation: 'Homepage' | 'Collections Hub' | 'Heritage Page';
  order: number;
  status: 'Visible' | 'Hidden';
  lastModified: string;
}

export const initialWebsiteSections: WebsiteSection[] = [
  {
    id: 'SEC-01',
    title: 'Winter Solstice MMXXIV Cinematic Hero',
    type: 'Hero Banner',
    pageLocation: 'Homepage',
    order: 1,
    status: 'Visible',
    lastModified: 'Oct 24, 2024',
  },
  {
    id: 'SEC-02',
    title: 'Master Tailoring Editorial Quad',
    type: 'Curated Editorial Grid',
    pageLocation: 'Homepage',
    order: 2,
    status: 'Visible',
    lastModified: 'Oct 22, 2024',
  },
  {
    id: 'SEC-03',
    title: 'Haute Horlogerie Complications Slider',
    type: 'Featured Product Carousel',
    pageLocation: 'Homepage',
    order: 3,
    status: 'Visible',
    lastModified: 'Oct 20, 2024',
  },
  {
    id: 'SEC-04',
    title: 'Milan Atelier Craftsmanship Video Experience',
    type: 'Video Showcase',
    pageLocation: 'Heritage Page',
    order: 1,
    status: 'Visible',
    lastModified: 'Oct 14, 2024',
  },
];
