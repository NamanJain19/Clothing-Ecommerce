import React, { useState, useEffect } from 'react';
import { TicketPercent, Plus, Edit, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { AdminSearch } from '../../components/ui/AdminSearch';
import { AdminModal } from '../../components/ui/AdminModal';
import { AdminInput } from '../../components/ui/AdminInput';
import { AdminSelect } from '../../components/ui/AdminSelect';
import { AdminPagination } from '../../components/ui/AdminPagination';
import { initialCoupons, Coupon } from '../../data/coupons';
import { adminService } from '../../services/adminService';

export const CouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [code, setCode] = useState('');
  const [type, setType] = useState<Coupon['type']>('Percentage');
  const [value, setValue] = useState('20% OFF');
  const [minSpend, setMinSpend] = useState('5000');
  const [usageLimit, setUsageLimit] = useState('100');
  const [validUntil, setValidUntil] = useState('2025-12-31');

  const fetchLiveCoupons = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getCoupons();
      if (res && res.coupons && res.coupons.length > 0) {
        const mapped: Coupon[] = res.coupons.map((c: any) => ({
          id: c._id || c.id,
          code: c.code,
          type: c.discountType === 'percentage' ? 'Percentage' : 'Fixed Amount',
          value: c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`,
          minSpend: c.minOrderValue || 0,
          usageLimit: c.usageLimit || 100,
          usedCount: c.usedCount || 0,
          validUntil: c.validUntil ? new Date(c.validUntil).toISOString().split('T')[0] : '2025-12-31',
          status: c.isActive ? 'Active' : 'Disabled',
        }));
        setCoupons(mapped);
      }
    } catch (err) {
      console.warn('Failed to fetch coupons, using fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveCoupons();
  }, []);

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage) || 1;
  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateCoupon = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!code.trim()) return;

    const discountVal = parseInt(value.replace(/\D/g, '')) || 20;

    const newCoupon: Coupon = {
      id: `CPN-0${coupons.length + 1}`,
      code: code.toUpperCase().trim(),
      type,
      value,
      minSpend: parseFloat(minSpend) || 0,
      usageLimit: parseInt(usageLimit, 10) || 100,
      usedCount: 0,
      validUntil,
      status: 'Active',
    };

    try {
      await adminService.createCoupon({
        code: code.toUpperCase().trim(),
        discountType: type === 'Percentage' ? 'percentage' : 'fixed',
        discountValue: discountVal,
        minOrderValue: parseFloat(minSpend) || 0,
        usageLimit: parseInt(usageLimit, 10) || 100,
        validUntil: new Date(validUntil).toISOString(),
        isActive: true,
      });
    } catch (err) {
      console.warn('Live API coupon create error:', err);
    }

    setCoupons([newCoupon, ...coupons]);
    setIsModalOpen(false);
    setCode('');
  };

  const handleDelete = async (id: string) => {
    try {
      await adminService.deleteCoupon(id);
    } catch (err) {
      console.warn('Live API coupon delete error:', err);
    }
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const getStatusBadge = (status: Coupon['status']) => {
    switch (status) {
      case 'Active':
        return <AdminBadge variant="success">Active</AdminBadge>;
      case 'Scheduled':
        return <AdminBadge variant="info">Scheduled</AdminBadge>;
      case 'Expired':
        return <AdminBadge variant="neutral">Expired</AdminBadge>;
      case 'Disabled':
        return <AdminBadge variant="error">Disabled</AdminBadge>;
      default:
        return <AdminBadge>{status}</AdminBadge>;
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">Coupons & VIP Codes</h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Manage promotional codes, bespoke vouchers, and private client incentives.
            </p>
          </div>
          <AdminButton leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
            Create Promo Code
          </AdminButton>
        </div>

        {/* Search */}
        <div className="bg-white border border-outline-variant rounded-xl p-space-md shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <AdminSearch
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search coupon codes..."
            />
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            Showing {filteredCoupons.length} vouchers
          </span>
        </div>

        {/* Table */}
        <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Promo Code
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Benefit
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Min. Spend
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Redemptions
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Expiry Date
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {paginatedCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-sm text-primary tracking-wide bg-surface-container px-2.5 py-1 rounded-md border border-outline-variant">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-sm text-primary">{coupon.value}</td>
                    <td className="px-6 py-4 text-sm font-medium text-on-surface font-mono">
                      ₹{coupon.minSpend.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-on-surface">
                      {coupon.usedCount} / {coupon.usageLimit}
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">{coupon.validUntil}</td>
                    <td className="px-6 py-4">{getStatusBadge(coupon.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="p-1.5 hover:bg-red-50 text-on-surface-variant hover:text-error rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
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
              Showing {Math.min(paginatedCoupons.length, filteredCoupons.length)} of{' '}
              {filteredCoupons.length} vouchers
            </span>
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredCoupons.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Create Coupon Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Promotional Passkey"
        description="Issue custom promotional vouchers for private clients."
        footer={
          <>
            <AdminButton variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleCreateCoupon}>Issue Coupon</AdminButton>
          </>
        }
      >
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <AdminInput
            label="Voucher Passkey Code"
            placeholder="e.g. SOLSTICE20"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <AdminSelect
              label="Benefit Type"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              options={[
                { value: 'Percentage', label: 'Percentage (%) Off' },
                { value: 'Fixed Amount', label: 'Fixed Valuation (₹) Off' },
                { value: 'Complimentary Shipping', label: 'Complimentary Armored Courier' },
              ]}
            />
            <AdminInput
              label="Benefit Yield Value"
              placeholder="e.g. 20% OFF or 500"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AdminInput
              label="Minimum Cart Threshold (₹ INR)"
              type="number"
              value={minSpend}
              onChange={(e) => setMinSpend(e.target.value)}
            />
            <AdminInput
              label="Total Usage Limit"
              type="number"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
            />
          </div>

          <AdminInput
            label="Expiration Cutoff Date"
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            required
          />
        </form>
      </AdminModal>
    </AdminLayout>
  );
};
