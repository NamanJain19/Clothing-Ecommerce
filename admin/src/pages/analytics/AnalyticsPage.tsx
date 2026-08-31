import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Globe,
  Users,
  CreditCard,
  ShoppingBag,
  ArrowUpRight,
  PieChart,
  Activity,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';

export const AnalyticsPage: React.FC = () => {
  const regions = [
    { name: 'North India (Delhi NCR / Chandigarh)', revenue: '₹4,82,000', percentage: '38%', growth: '+14.2%' },
    { name: 'Western India (Mumbai / Pune / Ahmedabad)', revenue: '₹4,25,000', percentage: '33%', growth: '+18.1%' },
    { name: 'South India (Bengaluru / Hyderabad / Chennai)', revenue: '₹2,68,000', percentage: '21%', growth: '+24.5%' },
    { name: 'East & Central India (Kolkata / Indore)', revenue: '₹1,09,300', percentage: '8%', growth: '+9.4%' },
  ];

  const categoryShare = [
    { category: 'Outerwear & Coats', share: '42%', value: '₹5,39,400' },
    { category: 'Watches & Horology', share: '32%', value: '₹4,10,970' },
    { category: 'Fine Leather Goods', share: '18%', value: '₹2,31,170' },
    { category: 'Cashmere & Knitwear', share: '8%', value: '₹1,02,760' },
  ];

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">
              Sales & Store Analytics
            </h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Real-time sales performance, customer retention, and regional revenue metrics in ₹ (INR).
            </p>
          </div>
          <div className="flex gap-3">
            <select className="bg-white border border-outline-variant rounded-lg px-4 py-2 text-sm text-on-surface font-semibold outline-none cursor-pointer">
              <option>Last 30 Days (August 2026)</option>
              <option>Year to Date (2026)</option>
              <option>Previous Year (2025)</option>
            </select>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Total Store Revenue
              </p>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                +14.8% <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-3xl font-bold text-primary mt-2 font-mono">₹12,84,300.00</p>
            <p className="text-xs text-on-surface-variant mt-1">vs ₹11,18,900.00 prior period</p>
          </div>

          <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Average Order Value
              </p>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                +8.2% <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-3xl font-bold text-primary mt-2 font-mono">₹24,200.00</p>
            <p className="text-xs text-on-surface-variant mt-1">Average per customer order</p>
          </div>

          <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Customer Retention Rate
              </p>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                +4.1% <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-3xl font-bold text-primary mt-2 font-mono">88.4%</p>
            <p className="text-xs text-on-surface-variant mt-1">Repeat buying customers</p>
          </div>

          <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Checkout Conversion
              </p>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                +1.9% <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-3xl font-bold text-primary mt-2 font-mono">4.38%</p>
            <p className="text-xs text-on-surface-variant mt-1">Cart-to-order completion</p>
          </div>
        </div>

        {/* Analytics Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Regional Sales */}
          <div className="lg:col-span-7 bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                <h3 className="font-headline-md text-headline-md text-primary">
                  Regional Sales Distribution
                </h3>
              </div>
              <span className="text-xs text-on-surface-variant font-medium">Pan-India Regions</span>
            </div>

            <div className="space-y-4">
              {regions.map((reg) => (
                <div key={reg.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-primary">{reg.name}</span>
                    <span className="font-mono font-bold text-primary">
                      {reg.revenue} ({reg.percentage})
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: reg.percentage }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Sales Share */}
          <div className="lg:col-span-5 bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                <h3 className="font-headline-md text-headline-md text-primary">
                  Sales by Category
                </h3>
              </div>
              <span className="text-xs text-on-surface-variant font-medium">Product Revenue</span>
            </div>

            <div className="space-y-3">
              {categoryShare.map((cat) => (
                <div
                  key={cat.category}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-outline-variant/60"
                >
                  <div>
                    <p className="font-bold text-xs text-primary">{cat.category}</p>
                    <p className="text-[11px] text-on-surface-variant font-mono">{cat.value}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded font-mono">
                    {cat.share}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
