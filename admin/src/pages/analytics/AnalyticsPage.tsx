import React, { useState, useEffect } from 'react';
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
  Loader2,
  AlertCircle,
  Package,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { adminService } from '../../services/adminService';

export const AnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<any>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [orderAnalytics, setOrderAnalytics] = useState<{ statusBreakdown: any[]; paymentBreakdown: any[] }>({
    statusBreakdown: [],
    paymentBreakdown: [],
  });
  const [categorySales, setCategorySales] = useState<any[]>([]);

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, salesRes, ordersRes, productsRes] = await Promise.allSettled([
        adminService.getDashboardStats(),
        adminService.getSalesAnalytics(),
        adminService.getOrderAnalytics(),
        adminService.getProductAnalytics(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setStats(statsRes.value.data);
      }
      if (salesRes.status === 'fulfilled' && salesRes.value?.data) {
        setSalesData(Array.isArray(salesRes.value.data) ? salesRes.value.data : []);
      }
      if (ordersRes.status === 'fulfilled' && ordersRes.value?.data) {
        setOrderAnalytics(ordersRes.value.data);
      }
      if (productsRes.status === 'fulfilled' && productsRes.value?.data?.categorySales) {
        setCategorySales(productsRes.value.data.categorySales);
      }
    } catch (err: any) {
      console.error('Failed to load analytics:', err);
      setError(err.message || 'Unable to load analytics data from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const totalRevenue = stats?.totalRevenue ?? salesData.reduce((acc, curr) => acc + (curr.totalSales || 0), 0);
  const totalOrders = stats?.totalOrders ?? 0;
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalCustomers = stats?.totalCustomers ?? 0;

  const totalCatRevenue = categorySales.reduce((acc, cat) => acc + (cat.totalRevenue || 0), 0);

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
              Production sales performance, category share, and payment method statistics from MongoDB Atlas.
            </p>
          </div>
          <AdminButton variant="outline" onClick={fetchAllAnalytics}>
            Refresh Analytics
          </AdminButton>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-outline-variant rounded-xl">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="font-body-md text-sm text-on-surface-variant">Computing live production analytics from MongoDB Atlas...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 bg-red-50/50 border border-red-200 rounded-xl text-center px-4">
            <AlertCircle className="w-8 h-8 text-error mb-2" />
            <p className="font-body-md text-sm text-error font-medium">{error}</p>
            <AdminButton variant="outline" className="mt-4" onClick={fetchAllAnalytics}>
              Retry
            </AdminButton>
          </div>
        ) : (
          <>
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm">
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Total Store Revenue
                </p>
                <p className="text-3xl font-bold text-primary mt-2 font-mono">
                  ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">Live confirmed order receipts</p>
              </div>

              <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm">
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Average Order Value
                </p>
                <p className="text-3xl font-bold text-primary mt-2 font-mono">
                  ₹{aov.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">Computed across {totalOrders} orders</p>
              </div>

              <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm">
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Active Client Accounts
                </p>
                <p className="text-3xl font-bold text-primary mt-2 font-mono">
                  {totalCustomers}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">Registered clients in database</p>
              </div>

              <div className="bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm">
                <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Catalog Products
                </p>
                <p className="text-3xl font-bold text-primary mt-2 font-mono">
                  {stats?.totalProducts ?? 0}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">Active inventory pieces</p>
              </div>
            </div>

            {/* Analytics Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
              {/* Order Status Breakdown */}
              <div className="lg:col-span-6 bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-outline-variant pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    <h3 className="font-headline-md text-headline-md text-primary">
                      Order Status Breakdown
                    </h3>
                  </div>
                  <span className="text-xs text-on-surface-variant font-medium">Live Order Pipeline</span>
                </div>

                {orderAnalytics.statusBreakdown.length === 0 ? (
                  <p className="text-xs text-on-surface-variant py-8 text-center">No orders recorded in database yet</p>
                ) : (
                  <div className="space-y-4">
                    {orderAnalytics.statusBreakdown.map((item: any) => {
                      const count = item.count || 0;
                      const percentage = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
                      return (
                        <div key={item._id} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-primary capitalize">{item._id || 'Standard'}</span>
                            <span className="font-mono font-bold text-primary">
                              {count} orders ({percentage}%) • ₹{(item.totalAmount || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.max(5, percentage))}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Category Sales Share */}
              <div className="lg:col-span-6 bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-outline-variant pb-3">
                  <div className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-primary" />
                    <h3 className="font-headline-md text-headline-md text-primary">
                      Sales by Category
                    </h3>
                  </div>
                  <span className="text-xs text-on-surface-variant font-medium">Production Database</span>
                </div>

                {categorySales.length === 0 ? (
                  <p className="text-xs text-on-surface-variant py-8 text-center">No category sales data available yet</p>
                ) : (
                  <div className="space-y-3">
                    {categorySales.map((cat: any) => {
                      const sharePct = totalCatRevenue > 0 ? Math.round(((cat.totalRevenue || 0) / totalCatRevenue) * 100) : 0;
                      return (
                        <div
                          key={cat._id || cat.categoryName}
                          className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-outline-variant/60"
                        >
                          <div>
                            <p className="font-bold text-xs text-primary">{cat.categoryName || 'Uncategorized'}</p>
                            <p className="text-[11px] text-on-surface-variant font-mono">
                              ₹{(cat.totalRevenue || 0).toLocaleString('en-IN')} • {cat.totalSold || 0} pieces sold
                            </p>
                          </div>
                          <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded font-mono">
                            {sharePct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Payment Methods Breakdown */}
              <div className="lg:col-span-12 bg-white border border-outline-variant rounded-xl p-space-lg shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-outline-variant pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h3 className="font-headline-md text-headline-md text-primary">
                      Payment Methods & Channels
                    </h3>
                  </div>
                  <span className="text-xs text-on-surface-variant font-medium">Gateway Breakdown</span>
                </div>

                {orderAnalytics.paymentBreakdown.length === 0 ? (
                  <p className="text-xs text-on-surface-variant py-4 text-center">No payment gateway records found</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {orderAnalytics.paymentBreakdown.map((pm: any) => (
                      <div key={pm._id} className="p-4 rounded-xl border border-outline-variant bg-surface-container-low/50">
                        <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{pm._id || 'Razorpay / Prepaid'}</p>
                        <p className="text-2xl font-bold text-primary font-mono mt-1">₹{(pm.totalAmount || 0).toLocaleString('en-IN')}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{pm.count || 0} transactions</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
