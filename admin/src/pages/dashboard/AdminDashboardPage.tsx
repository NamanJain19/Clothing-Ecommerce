import React from 'react';
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
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const recentOrders = [
    {
      id: '#ORD-9023',
      initials: 'JD',
      initialsBg: 'bg-secondary-container',
      customer: 'Jane Doe',
      amount: '₹1,25,000.00',
      status: 'Shipped',
      statusClass: 'bg-green-100 text-green-700',
      date: 'Oct 24, 2024',
    },
    {
      id: '#ORD-9022',
      initials: 'MS',
      initialsBg: 'bg-tertiary-fixed',
      customer: 'Marcus Smith',
      amount: '₹84,500.00',
      status: 'Processing',
      statusClass: 'bg-blue-100 text-blue-700',
      date: 'Oct 23, 2024',
    },
    {
      id: '#ORD-9021',
      initials: 'AK',
      initialsBg: 'bg-surface-container-highest',
      customer: 'Anna Kim',
      amount: '₹2,10,000.00',
      status: 'Pending',
      statusClass: 'bg-yellow-100 text-yellow-700',
      date: 'Oct 23, 2024',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      title: 'New Order Received',
      highlight: '#ORD-9023',
      time: '2 minutes ago',
      icon: ShoppingCart,
      iconColor: 'text-green-700',
      bgColor: 'bg-green-100',
    },
    {
      id: 2,
      title: 'Product Updated:',
      highlight: 'Lunar Chronograph',
      time: '45 minutes ago',
      icon: Edit,
      iconColor: 'text-blue-700',
      bgColor: 'bg-blue-100',
    },
    {
      id: 3,
      title: 'New Customer Registered:',
      highlight: 'Elias Vance',
      time: '3 hours ago',
      icon: UserPlus,
      iconColor: 'text-purple-700',
      bgColor: 'bg-purple-100',
    },
    {
      id: 4,
      title: 'Low stock alert:',
      highlight: 'Silk Pocket Square',
      time: '5 hours ago',
      icon: AlertTriangle,
      iconColor: 'text-orange-700',
      bgColor: 'bg-orange-100',
    },
  ];

  const lowStockProducts = [
    {
      name: 'Lunar Chronograph',
      stock: 'Only 2 items left',
      stockClass: 'text-error',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAyxyqvyh346BaRtj82icFZ6xEJqNwxJObUST0eLtI-twZgrnV-aKZXbTvy856m-SM3EQHVwvjSBwSw9j8GzKcmdjqR0SM8MJ6eEVGs1kfGoblzeKnFLRM0tmPIT825qn1nN9fctSzGBFjTog1_zqqpCgpNrGHp5DrggVk5VDPVKkd9iMl7ssIUbMFRUdE8l-eVAhMoofh4yJbd-RLdrXql7W4zSKTuFPkt63ATk3jXhWlc_kqlqlWivw',
    },
    {
      name: 'Leather Card Holder',
      stock: 'Only 5 items left',
      stockClass: 'text-error',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDR6aK4Him3nAFtFIsMlS9ukrGjyGi-g2fg5ua3B3PJr2da4K79QBAIf_k-fEkOXKd6hp5XX4AuPhRYDy3642DOmzX8kLetTi-uw8aVE5E5q7Kc4YfMaaHRVZm286H19bN625BHVfVn5kXW2ZDnyvaa5HgRd2qI55_MfpAB2jr9fdVdyV4DGdOBE8LOl3QsjmxG8HdBWNxqKF0PgiZLB2sKCiNKm6WX8X7HPSfhVZsRa5lQw8DZhGyajQ',
    },
    {
      name: 'Signature Scent (50ml)',
      stock: '8 items remaining',
      stockClass: 'text-on-tertiary-container',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDYrXKZ5TkUTAckfmZw0_waqeek0tLuqicQrZ_cLlcdWVnAqEP5HS-HqM9qT0u3gOOq75cWCjIfoF6fD0REjiUvzBFxVP9thYeChxPZV6lMYEeOVx5cY0uGyXFV_eSOE8JJyb-B1rdrK2jvf59CkvqNmAjHdNg_bESXbUGy51UCw2HDXzRnbGpZiMdduefW5mxWh9nuOU1ecSzn8ZS-kTeUjnZRj3GzVW6zRDYuxViOYHttDBi-EHLd0w',
    },
  ];

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Section 1: Welcome Card */}
        <section className="relative overflow-hidden bg-primary-container text-on-primary rounded-xl p-6 sm:p-space-xl flex flex-col md:flex-row justify-between items-center gap-space-lg border border-primary">
          <div className="relative z-10 space-y-2 text-center md:text-left">
            <h2 className="font-headline-lg text-headline-lg text-white">Welcome Back, Admin</h2>
            <p className="text-on-primary-container font-body-md max-w-lg">
              Your store performance is up by 12% compared to last month. You have 14 new orders
              that require your immediate attention.
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
                +12.4% <TrendingUp className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <p className="font-caption text-on-surface-variant">Total Revenue</p>
              <p className="font-display text-display text-primary font-mono">₹12,84,300</p>
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
              <span className="text-green-600 font-label-sm flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                +8.1% <TrendingUp className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <p className="font-caption text-on-surface-variant">Total Orders</p>
              <p className="font-display text-display text-primary">1,240</p>
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
                Stable <Minus className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <p className="font-caption text-on-surface-variant">Products</p>
              <p className="font-display text-display text-primary">452</p>
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
                +2.4% <TrendingUp className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <p className="font-caption text-on-surface-variant">Customers</p>
              <p className="font-display text-display text-primary">8,924</p>
            </div>
          </motion.div>
        </section>

        {/* Section 3 & 6: Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg items-start">
          {/* Section 3: Recent Orders Table */}
          <section className="lg:col-span-2 bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-space-lg py-4 border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-primary">Recent Orders</h3>
              <button className="text-primary font-label-md hover:underline cursor-pointer">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="px-space-lg py-4 font-label-md text-on-surface-variant">Order ID</th>
                    <th className="px-space-lg py-4 font-label-md text-on-surface-variant">Customer</th>
                    <th className="px-space-lg py-4 font-label-md text-on-surface-variant">Amount</th>
                    <th className="px-space-lg py-4 font-label-md text-on-surface-variant">Status</th>
                    <th className="px-space-lg py-4 font-label-md text-on-surface-variant">Date</th>
                    <th className="px-space-lg py-4 font-label-md text-on-surface-variant text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => navigate('/admin/orders')}
                      className="hover:bg-surface-container-low transition-colors group cursor-pointer"
                    >
                      <td className="px-space-lg py-5 font-label-md text-primary">{order.id}</td>
                      <td className="px-space-lg py-5">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-8 w-8 rounded-full ${order.initialsBg} flex items-center justify-center font-bold text-[10px] text-on-surface`}
                          >
                            {order.initials}
                          </div>
                          <span className="text-body-md">{order.customer}</span>
                        </div>
                      </td>
                      <td className="px-space-lg py-5 font-body-md">{order.amount}</td>
                      <td className="px-space-lg py-5">
                        <span
                          className={`px-2 py-1 ${order.statusClass} text-[11px] font-bold rounded uppercase tracking-wider`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-space-lg py-5 text-on-surface-variant text-body-md">
                        {order.date}
                      </td>
                      <td className="px-space-lg py-5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/admin/orders');
                          }}
                          className="p-1 hover:bg-surface-container rounded-lg transition-all text-on-surface-variant cursor-pointer"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6: Recent Activity */}
          <aside className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-space-lg py-4 border-b border-outline-variant">
              <h3 className="font-headline-md text-headline-md text-primary">Recent Activity</h3>
            </div>
            <div className="p-space-lg space-y-6 relative">
              {/* Timeline line */}
              <div className="absolute left-[31px] top-space-lg bottom-space-lg w-px bg-outline-variant" />

              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="relative flex gap-4">
                    <div
                      className={`z-10 h-8 w-8 rounded-full ${activity.bgColor} flex items-center justify-center ring-4 ring-white flex-shrink-0`}
                    >
                      <Icon className={`w-4 h-4 ${activity.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-body-md text-on-surface">
                        {activity.title} <span className="font-bold">{activity.highlight}</span>
                      </p>
                      <p className="text-caption text-on-surface-variant">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
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
                Critical
              </span>
            </div>
            <div className="p-space-lg space-y-4">
              {lowStockProducts.map((prod) => (
                <div
                  key={prod.name}
                  className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-outline-variant"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-md bg-white border border-outline-variant p-1 flex-shrink-0">
                      <img
                        className="w-full h-full object-cover rounded-sm"
                        alt={prod.name}
                        src={prod.image}
                      />
                    </div>
                    <div>
                      <p className="font-label-md text-on-surface">{prod.name}</p>
                      <p className={`text-caption font-medium ${prod.stockClass}`}>{prod.stock}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/admin/inventory')}
                    className="px-4 py-1.5 bg-primary text-white text-caption font-bold rounded-lg hover:opacity-90 transition-all cursor-pointer"
                  >
                    Restock
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};
