import React, { useState, useEffect } from 'react';
import { Users, Crown, Mail, Phone, MapPin, Eye, Plus, ShieldCheck } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { AdminSearch } from '../../components/ui/AdminSearch';
import { AdminDrawer } from '../../components/ui/AdminDrawer';
import { AdminPagination } from '../../components/ui/AdminPagination';
import type { Customer } from '../../data/customers';
import { adminService } from '../../services/adminService';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchLiveCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getCustomers();
      const rawList = (res as any)?.data || (res as any)?.customers || [];
      const mapped: Customer[] = rawList.map((u: any) => {
        const spent = u.totalSpent || 0;
        let tier: Customer['tier'] = 'Gold Tier';
        if (spent >= 100000) tier = 'Bespoke Private';
        else if (spent >= 50000) tier = 'VIP Platinum';
        else if (spent < 20000) tier = 'Gold Tier';

        return {
          id: u._id || u.id,
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Private Client',
          email: u.email,
          phone: u.phone || 'N/A',
          city: u.addresses?.[0]?.city || u.city || 'India',
          country: u.country || 'India',
          ordersCount: u.orderCount || u.ordersCount || 0,
          totalSpent: spent,
          joinDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recent',
          tier,
          status: (u.isActive !== false ? 'Active' : 'Dormant') as 'Active' | 'Dormant',
          shippingAddress: u.addresses?.[0] ? `${u.addresses[0].addressLine1 || ''}, ${u.addresses[0].city || ''}` : 'Primary Client Address on File',
        };
      });
      setCustomers(mapped);
    } catch (err: any) {
      console.error('Failed to load customers from MongoDB:', err);
      setError(err?.message || 'Unable to load registered customers from MongoDB.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'All' || c.tier === tierFilter;
    return matchesSearch && matchesStatusOrTier(c);
  });

  function matchesStatusOrTier(c: Customer) {
    return tierFilter === 'All' || c.tier === tierFilter;
  }

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getTierBadge = (tier: Customer['tier']) => {
    switch (tier) {
      case 'Bespoke Private':
        return <AdminBadge variant="primary">Bespoke Private</AdminBadge>;
      case 'VIP Platinum':
        return <AdminBadge variant="info">VIP Platinum</AdminBadge>;
      case 'Gold Tier':
        return <AdminBadge variant="warning">Gold Tier</AdminBadge>;
      default:
        return <AdminBadge variant="neutral">Client</AdminBadge>;
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">Customers</h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Private client directory, lifetime valuations, and bespoke concierge relations.
            </p>
          </div>
          <AdminButton
            leftIcon={<Crown className="w-4 h-4" />}
            onClick={() => alert('VIP client onboarding invitation initiated.')}
          >
            Invite VIP Client
          </AdminButton>
        </div>

        {/* Filters */}
        <div className="bg-white border border-outline-variant rounded-xl p-space-md shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-[260px]">
            <AdminSearch
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search clients by name, email, or city..."
            />
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg px-4 py-2 text-sm text-on-surface outline-none cursor-pointer"
            >
              <option value="All">All Tiers</option>
              <option value="Bespoke Private">Bespoke Private</option>
              <option value="VIP Platinum">VIP Platinum</option>
              <option value="Gold Tier">Gold Tier</option>
              <option value="Client">Client</option>
            </select>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            Showing {filteredCustomers.length} clients
          </span>
        </div>

        {/* Customers Table */}
        <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Client Profile
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Tier Level
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Location
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Orders
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Lifetime Valuation
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Join Date
                  </th>
                  <th className="px-6 py-4 text-right font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {isLoading && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs">Loading registered clients from MongoDB...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!isLoading && error && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-error">
                      <p className="font-semibold text-sm">{error}</p>
                      <button
                        onClick={fetchLiveCustomers}
                        className="mt-2 px-3 py-1 bg-primary text-white rounded text-xs"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                )}
                {!isLoading && !error && paginatedCustomers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant">
                      <p className="font-semibold text-sm">No clients found</p>
                      <p className="text-xs mt-1">There are no client profiles matching your search criteria.</p>
                    </td>
                  </tr>
                )}
                {!isLoading && !error && paginatedCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className="hover:bg-surface-container-lowest transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs">
                          {customer.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-on-surface">{customer.name}</p>
                          <p className="text-xs text-on-surface-variant">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getTierBadge(customer.tier)}</td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">
                      {customer.city}, {customer.country}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-primary">
                      {customer.ordersCount} orders
                    </td>
                    <td className="px-6 py-4 font-bold text-sm text-primary font-mono">
                      ₹{customer.totalSpent.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">{customer.joinDate}</td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="p-4 border-t border-outline-variant bg-surface-container-low flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-on-surface-variant">
              Showing {Math.min(paginatedCustomers.length, filteredCustomers.length)} of{' '}
              {filteredCustomers.length} clients
            </span>
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredCustomers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Customer Drawer */}
      {selectedCustomer && (
        <AdminDrawer
          isOpen={Boolean(selectedCustomer)}
          onClose={() => setSelectedCustomer(null)}
          title="Client Concierge File"
          description={`Comprehensive operational profile for ${selectedCustomer.name}`}
          footer={
            <AdminButton onClick={() => setSelectedCustomer(null)}>Close Profile</AdminButton>
          }
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant">
              <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                {selectedCustomer.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <h3 className="font-bold text-base text-primary">{selectedCustomer.name}</h3>
                <div className="mt-1">{getTierBadge(selectedCustomer.tier)}</div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 p-2.5 border border-outline-variant/60 rounded-lg">
                <Mail className="w-4 h-4 text-outline" />
                <span className="text-on-surface">{selectedCustomer.email}</span>
              </div>
              <div className="flex items-center gap-3 p-2.5 border border-outline-variant/60 rounded-lg">
                <Phone className="w-4 h-4 text-outline" />
                <span className="text-on-surface">{selectedCustomer.phone}</span>
              </div>
              <div className="flex items-center gap-3 p-2.5 border border-outline-variant/60 rounded-lg">
                <MapPin className="w-4 h-4 text-outline" />
                <span className="text-on-surface">
                  {selectedCustomer.city}, {selectedCustomer.country}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-surface-container-low rounded-xl text-center border border-outline-variant/50">
                <p className="text-[11px] uppercase font-bold text-on-surface-variant">Lifetime Valuation</p>
                <p className="text-lg font-bold text-primary mt-1">
                  ${selectedCustomer.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-surface-container-low rounded-xl text-center border border-outline-variant/50">
                <p className="text-[11px] uppercase font-bold text-on-surface-variant">Total Acquisitions</p>
                <p className="text-lg font-bold text-primary mt-1">
                  {selectedCustomer.ordersCount} Orders
                </p>
              </div>
            </div>
          </div>
        </AdminDrawer>
      )}
    </AdminLayout>
  );
};
