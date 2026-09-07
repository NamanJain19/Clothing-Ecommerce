import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Minus,
  Eye,
  PlusSquare,
  LayoutGrid,
  Ticket,
  ClipboardList,
  ShoppingCart,
  Edit,
  UserPlus,
  AlertTriangle,
  CreditCard,
  ShoppingBag,
  Package,
  Users,
  LineChart,
  RefreshCw,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { adminService } from '../../services/adminService';

interface DashboardData {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  totalReturns: number;
  totalRefunds: number;
  recentOrders: any[];
  topProducts: any[];
  salesSummary?: any[];
}

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [lowStockList, setLowStockList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dashRes, lowStockRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getLowStock(5).catch(() => ({ data: [] })),
      ]);

      if (dashRes && dashRes.data) {
        setData(dashRes.data);
      } else {
        setError('Unable to load dashboard data. Please try again.');
      }

      if (lowStockRes && lowStockRes.data) {
        setLowStockList(lowStockRes.data);
      }
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      setError(err?.message || 'Unable to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (val?: number) => {
    return `₹${(val || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered' || s === 'completed') {
      return 'bg-green-100 text-green-700';
    }
    if (s === 'processing' || s === 'confirmed') {
      return 'bg-blue-100 text-blue-700';
    }
    if (s === 'shipped') {
      return 'bg-purple-100 text-purple-700';
    }
    if (s === 'cancelled') {
      return 'bg-red-100 text-red-700';
    }
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="font-label-md text-on-surface-variant">Connecting to Monolith Operations Hub...</p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-3">
            <AlertTriangle className="w-10 h-10 text-red-600 mx-auto" />
            <h3 className="font-headline-sm text-red-900 font-semibold">Unable to load data. Please try again.</h3>
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        )}

        {/* Real Content */}
        {!isLoading && !error && data && (
          <>
            {/* Section 1: Welcome Card */}
            <section className="relative overflow-hidden bg-primary-container text-on-primary rounded-xl p-6 sm:p-space-xl flex flex-col md:flex-row justify-between items-center gap-space-lg border border-primary">
              <div className="relative z-10 space-y-2 text-center md:text-left">
                <h2 className="font-headline-lg text-headline-lg text-white">Welcome Back, Operations Admin</h2>
                <p className="text-on-primary-container font-body-md max-w-lg">
                  You currently have {data.pendingOrders || 0} active orders requiring processing across your live MongoDB Atlas inventory.
                </p>
                <div className="pt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                  <button
                    onClick={() => navigate('/admin/analytics')}
                    className="px-6 py-2.5 bg-white text-primary rounded-lg font-label-md hover:bg-neutral-100 transition-all cursor-pointer font-bold shadow-sm"
                  >
                    View Analytics
                  </button>
                  <button
                    onClick={() => navigate('/admin/reports')}
                    className="px-6 py-2.5 border border-white/30 text-white rounded-lg font-label-md hover:bg-white/10 transition-all cursor-pointer font-medium"
                  >
                    Download Report
                  </button>
                </div>
              </div>
              <div className="relative w-full md:w-64 h-32 md:h-40 rounded-lg overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                <LineChart className="w-16 h-16 text-white/20 stroke-[1.5]" />
              </div>
            </section>

            {/* Section 2: Overview Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
              {/* Card 1: Revenue */}
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-white border border-outline-variant p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-secondary-container rounded-lg">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-green-600 font-label-sm flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                    Live <TrendingUp className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div>
                  <p className="font-caption text-on-surface-variant">Total Revenue</p>
                  <p className="font-display text-display text-primary font-mono">{formatCurrency(data.totalRevenue)}</p>
                </div>
              </motion.div>

              {/* Card 2: Orders */}
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-white border border-outline-variant p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-secondary-container rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-primary font-label-sm flex items-center gap-1 bg-primary/5 px-2 py-0.5 rounded-full">
                    {data.pendingOrders || 0} Pending
                  </span>
                </div>
                <div>
                  <p className="font-caption text-on-surface-variant">Total Orders</p>
                  <p className="font-display text-display text-primary">{data.totalOrders?.toLocaleString('en-IN') || 0}</p>
                </div>
              </motion.div>

              {/* Card 3: Products */}
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-white border border-outline-variant p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-secondary-container rounded-lg">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-on-surface-variant font-label-sm flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-full">
                    Catalog Active
                  </span>
                </div>
                <div>
                  <p className="font-caption text-on-surface-variant">Products</p>
                  <p className="font-display text-display text-primary">{data.totalProducts || 0}</p>
                </div>
              </motion.div>

              {/* Card 4: Customers */}
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-white border border-outline-variant p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-secondary-container rounded-lg">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-green-600 font-label-sm flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
                <div>
                  <p className="font-caption text-on-surface-variant">Customers</p>
                  <p className="font-display text-display text-primary">{data.totalCustomers?.toLocaleString('en-IN') || 0}</p>
                </div>
              </motion.div>
            </section>

            {/* Section 3 & 6: Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg items-start">
              {/* Section 3: Recent Orders Table */}
              <section className="lg:col-span-2 bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="px-space-lg py-4 border-b border-outline-variant flex justify-between items-center">
                  <h3 className="font-headline-md text-headline-md text-primary">Recent Orders</h3>
                  <button
                    onClick={() => navigate('/admin/orders')}
                    className="text-primary font-label-md hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  {(!data.recentOrders || data.recentOrders.length === 0) ? (
                    <div className="p-8 text-center text-on-surface-variant text-sm">
                      No customer orders have been placed yet.
                    </div>
                  ) : (
                    <table className="w-full text-left">
                      <thead className="bg-surface-container-low border-b border-outline-variant">
                        <tr>
                          <th className="px-space-lg py-4 font-label-md text-on-surface-variant">Order #</th>
                          <th className="px-space-lg py-4 font-label-md text-on-surface-variant">Customer</th>
                          <th className="px-space-lg py-4 font-label-md text-on-surface-variant">Amount</th>
                          <th className="px-space-lg py-4 font-label-md text-on-surface-variant">Status</th>
                          <th className="px-space-lg py-4 font-label-md text-on-surface-variant">Date</th>
                          <th className="px-space-lg py-4 font-label-md text-on-surface-variant text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant">
                        {data.recentOrders.map((order) => {
                          const customerName = order.shippingAddress
                            ? `${order.shippingAddress.firstName || ''} ${order.shippingAddress.lastName || ''}`.trim()
                            : order.user?.firstName
                            ? `${order.user.firstName} ${order.user.lastName || ''}`.trim()
                            : 'Guest';
                          const initials = customerName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'CU';

                          return (
                            <tr
                              key={order._id}
                              onClick={() => navigate('/admin/orders')}
                              className="hover:bg-surface-container-low transition-colors group cursor-pointer"
                            >
                              <td className="px-space-lg py-5 font-label-md text-primary font-mono text-xs">
                                {order.orderNumber || order._id?.slice(-8).toUpperCase()}
                              </td>
                              <td className="px-space-lg py-5">
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-full bg-secondary-container flex items-center justify-center font-bold text-[10px] text-on-surface">
                                    {initials}
                                  </div>
                                  <span className="text-body-md font-medium">{customerName}</span>
                                </div>
                              </td>
                              <td className="px-space-lg py-5 font-body-md font-mono">{formatCurrency(order.total)}</td>
                              <td className="px-space-lg py-5">
                                <span className={`px-2 py-1 ${getStatusBadge(order.orderStatus)} text-[11px] font-bold rounded uppercase tracking-wider`}>
                                  {order.orderStatus}
                                </span>
                              </td>
                              <td className="px-space-lg py-5 text-on-surface-variant text-body-md text-xs">
                                {formatDate(order.createdAt)}
                              </td>
                              <td className="px-space-lg py-5 text-right">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/admin/orders');
                                  }}
                                  className="p-1 hover:bg-surface-container rounded-lg transition-all text-on-surface-variant cursor-pointer"
                                  aria-label="View order details"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>

              {/* Section 6: Top Selling Products */}
              <aside className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="px-space-lg py-4 border-b border-outline-variant">
                  <h3 className="font-headline-md text-headline-md text-primary">Top Products</h3>
                </div>
                <div className="p-space-lg space-y-4">
                  {(!data.topProducts || data.topProducts.length === 0) ? (
                    <p className="text-sm text-on-surface-variant text-center py-6">
                      No sales metrics recorded yet.
                    </p>
                  ) : (
                    data.topProducts.map((p, idx) => (
                      <div key={p._id || idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-low transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-10 w-10 rounded-md bg-surface-container flex items-center justify-center overflow-hidden border border-outline-variant flex-shrink-0">
                            {p.image ? (
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-5 h-5 text-outline" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-label-md text-on-surface truncate text-xs">{p.name || 'Luxury Item'}</p>
                            <p className="text-[11px] text-on-surface-variant">{p.totalSold || 0} units sold</p>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-semibold text-primary">
                          {formatCurrency(p.totalRevenue)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </aside>
            </div>

            {/* Section 4 & 5: Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
              {/* Section 4: Quick Actions */}
              <section className="space-y-4">
                <h3 className="font-headline-md text-headline-md text-primary">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate('/admin/products/new')}
                    className="bg-white border border-outline-variant p-6 rounded-xl text-left hover:border-primary transition-all group cursor-pointer shadow-sm"
                  >
                    <PlusSquare className="w-8 h-8 text-on-surface-variant group-hover:text-primary mb-2 transition-colors" />
                    <p className="font-label-md text-on-surface">Add Product</p>
                  </button>
                  <button
                    onClick={() => navigate('/admin/collections')}
                    className="bg-white border border-outline-variant p-6 rounded-xl text-left hover:border-primary transition-all group cursor-pointer shadow-sm"
                  >
                    <LayoutGrid className="w-8 h-8 text-on-surface-variant group-hover:text-primary mb-2 transition-colors" />
                    <p className="font-label-md text-on-surface">Create Collection</p>
                  </button>
                  <button
                    onClick={() => navigate('/admin/coupons')}
                    className="bg-white border border-outline-variant p-6 rounded-xl text-left hover:border-primary transition-all group cursor-pointer shadow-sm"
                  >
                    <Ticket className="w-8 h-8 text-on-surface-variant group-hover:text-primary mb-2 transition-colors" />
                    <p className="font-label-md text-on-surface">Create Coupon</p>
                  </button>
                  <button
                    onClick={() => navigate('/admin/orders')}
                    className="bg-white border border-outline-variant p-6 rounded-xl text-left hover:border-primary transition-all group cursor-pointer shadow-sm"
                  >
                    <ClipboardList className="w-8 h-8 text-on-surface-variant group-hover:text-primary mb-2 transition-colors" />
                    <p className="font-label-md text-on-surface">View Orders</p>
                  </button>
                </div>
              </section>

              {/* Section 5: Low Stock */}
              <section className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="px-space-lg py-4 border-b border-outline-variant flex justify-between items-center">
                  <h3 className="font-headline-md text-headline-md text-primary">Low Stock Alerts</h3>
                  <span className="px-2 py-0.5 bg-error/10 text-error font-bold text-[11px] rounded uppercase">
                    Critical Stock (&le; 5)
                  </span>
                </div>
                <div className="p-space-lg space-y-4">
                  {lowStockList.length === 0 ? (
                    <p className="text-sm text-on-surface-variant text-center py-6">
                      All inventory levels are within healthy operational thresholds.
                    </p>
                  ) : (
                    lowStockList.slice(0, 4).map((prod) => (
                      <div
                        key={prod._id}
                        className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-outline-variant"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-12 w-12 rounded-md bg-white border border-outline-variant p-1 flex-shrink-0">
                            <img
                              className="w-full h-full object-cover rounded-sm"
                              alt={prod.name}
                              src={prod.thumbnail || prod.images?.[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80'}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-label-md text-on-surface truncate text-xs">{prod.name}</p>
                            <p className="text-caption font-medium text-error">Only {prod.stock || 0} units remaining</p>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate('/admin/inventory')}
                          className="px-4 py-1.5 bg-primary text-white text-caption font-bold rounded-lg hover:opacity-90 transition-all cursor-pointer flex-shrink-0 ml-2"
                        >
                          Restock
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
