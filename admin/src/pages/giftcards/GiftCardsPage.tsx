import React, { useState, useEffect } from 'react';
import { Gift, Plus, Search, CheckCircle2, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { AdminSearch } from '../../components/ui/AdminSearch';
import { AdminModal } from '../../components/ui/AdminModal';
import { AdminInput } from '../../components/ui/AdminInput';
import { AdminPagination } from '../../components/ui/AdminPagination';
import { adminService } from '../../services/adminService';

export interface GiftCardItem {
  id: string;
  code: string;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  initialBalance: number;
  currentBalance: number;
  status: 'Active' | 'Disabled';
  expiryDate: string;
}

export const GiftCardsPage: React.FC = () => {
  const [giftCards, setGiftCards] = useState<GiftCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState('Monolith Executive Concierge');
  const [amount, setAmount] = useState('5000');

  const fetchGiftCards = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminService.getGiftCards();
      const rawList = res?.data || [];
      const mapped: GiftCardItem[] = rawList.map((c: any) => ({
        id: c._id || c.id,
        code: c.code || 'MNL-GFT-LIVE',
        recipientName: c.recipient?.name || c.name || 'Private Client',
        recipientEmail: c.recipient?.email || '',
        senderName: c.senderName || 'Atelier Concierge',
        initialBalance: c.amount || 0,
        currentBalance: c.remainingBalance ?? c.amount ?? 0,
        status: c.isActive === false ? 'Disabled' : 'Active',
        expiryDate: c.expiryDate ? new Date(c.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Perpetual',
      }));
      setGiftCards(mapped);
    } catch (err: any) {
      console.error('Failed to load gift cards:', err);
      setError(err.message || 'Unable to load gift cards from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGiftCards();
  }, []);

  const filteredCards = giftCards.filter(
    (c) =>
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.recipientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCards.length / itemsPerPage) || 1;
  const paginatedCards = filteredCards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleIssue = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!recipientName.trim()) return;

    const val = parseFloat(amount) || 1000;
    const generatedCode = `MNL-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    try {
      const payload = {
        code: generatedCode,
        name: recipientName.trim(),
        amount: val,
        remainingBalance: val,
        recipient: {
          name: recipientName.trim(),
          email: recipientEmail.trim(),
        },
        senderName: senderName.trim(),
        isActive: true,
      };

      await adminService.createGiftCard(payload);
      setIsModalOpen(false);
      setRecipientName('');
      setRecipientEmail('');
      await fetchGiftCards();
    } catch (err: any) {
      alert(err.message || 'Failed to issue gift card to MongoDB.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to revoke this gift card?')) return;
    try {
      await adminService.deleteGiftCard(id);
      setGiftCards((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete gift card.');
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">
              Bespoke Gift Cards & Private Credits
            </h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Issue high-denomination private credit certificates and monitor active balances.
            </p>
          </div>
          <AdminButton leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
            Issue Private Certificate
          </AdminButton>
        </div>

        {/* Search */}
        <div className="bg-white border border-outline-variant rounded-xl p-space-md shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <AdminSearch
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by certificate code or recipient..."
            />
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            Showing {filteredCards.length} active certificates
          </span>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-outline-variant rounded-xl">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="font-body-md text-sm text-on-surface-variant">Loading gift certificates from database...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 bg-red-50/50 border border-red-200 rounded-xl text-center px-4">
            <AlertCircle className="w-8 h-8 text-error mb-2" />
            <p className="font-body-md text-sm text-error font-medium">{error}</p>
            <AdminButton variant="outline" className="mt-4" onClick={fetchGiftCards}>
              Retry
            </AdminButton>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-outline-variant rounded-xl text-center px-4">
            <Gift className="w-10 h-10 text-on-surface-variant/40 mb-3" />
            <h3 className="font-display text-base font-bold text-primary">No gift certificates found</h3>
            <p className="font-body-md text-sm text-on-surface-variant mt-1 max-w-sm">
              Issue luxury store credit or bespoke certificates to clients.
            </p>
            <AdminButton leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)} className="mt-4">
              Issue Private Certificate
            </AdminButton>
          </div>
        ) : (
          /* Table */
          <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                      Gift Card Code
                    </th>
                    <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                      Recipient
                    </th>
                    <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                      Sender
                    </th>
                    <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                      Initial Balance
                    </th>
                    <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                      Remaining Balance
                    </th>
                    <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                      Status
                    </th>
                    <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                      Expiry Date
                    </th>
                    <th className="px-6 py-4 text-right font-semibold text-secondary uppercase tracking-wider text-[11px]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {paginatedCards.map((card) => (
                    <tr key={card.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-xs bg-surface-container px-2.5 py-1 rounded border border-outline-variant text-primary">
                          {card.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm text-on-surface">{card.recipientName}</p>
                        <p className="text-xs text-on-surface-variant">{card.recipientEmail}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-on-surface">
                        {card.senderName}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-on-surface font-mono">
                        ₹{card.initialBalance.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-primary font-mono">
                        ₹{card.currentBalance.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <AdminBadge variant={card.status === 'Active' ? 'success' : 'neutral'}>
                          {card.status}
                        </AdminBadge>
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant">{card.expiryDate}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(card.id)}
                          className="p-1.5 hover:bg-red-50 text-on-surface-variant hover:text-error rounded-lg transition-colors cursor-pointer"
                          title="Revoke Certificate"
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
                Showing {Math.min(paginatedCards.length, filteredCards.length)} of{' '}
                {filteredCards.length} certificates
              </span>
              <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredCards.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}
      </div>

      {/* Issue Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Issue Private Credit Certificate"
        description="Mint an encrypted high-value credit balance in favor of a private client."
        footer={
          <>
            <AdminButton variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={handleIssue}>Issue & Transmit</AdminButton>
          </>
        }
      >
        <form onSubmit={handleIssue} className="space-y-4">
          <AdminInput
            label="Beneficiary Full Name"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="e.g. Lady Evelyn Montgomery"
            required
          />
          <AdminInput
            label="Beneficiary Email Address"
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="evelyn@montgomery-estate.co.uk"
          />
          <AdminInput
            label="Patron / Sender Reference"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
          />
          <AdminInput
            label="Credit Valuation (₹)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </form>
      </AdminModal>
    </AdminLayout>
  );
};
