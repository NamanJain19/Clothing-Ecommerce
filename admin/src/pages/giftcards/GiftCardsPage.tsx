import React, { useState } from 'react';
import { Gift, Plus, Search, CheckCircle2, Trash2 } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { AdminSearch } from '../../components/ui/AdminSearch';
import { AdminModal } from '../../components/ui/AdminModal';
import { AdminInput } from '../../components/ui/AdminInput';
import { AdminPagination } from '../../components/ui/AdminPagination';
import { initialGiftCards, GiftCard } from '../../data/storeOperations';

export const GiftCardsPage: React.FC = () => {
  const [giftCards, setGiftCards] = useState<GiftCard[]>(initialGiftCards);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState('Monolith Executive Salon');
  const [amount, setAmount] = useState('5000');

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

  const handleIssue = (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!recipientName.trim()) return;

    const val = parseFloat(amount) || 1000;
    const newCard: GiftCard = {
      id: `GC-00${giftCards.length + 1}`,
      code: `MNL-GFT-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
        1000 + Math.random() * 9000
      )}`,
      recipientName,
      recipientEmail,
      senderName,
      initialBalance: val,
      currentBalance: val,
      status: 'Active',
      issuedDate: 'Oct 24, 2024',
      expiryDate: 'Oct 24, 2026',
    };

    setGiftCards([newCard, ...giftCards]);
    setIsModalOpen(false);
    setRecipientName('');
    setRecipientEmail('');
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

        {/* Table */}
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
            label="Credit Valuation ($)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </form>
      </AdminModal>
    </AdminLayout>
  );
};
