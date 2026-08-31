import React, { useState } from 'react';
import { RotateCcw, CheckCircle, XCircle, Eye, Search, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { AdminSearch } from '../../components/ui/AdminSearch';
import { AdminModal } from '../../components/ui/AdminModal';
import { AdminPagination } from '../../components/ui/AdminPagination';
import { initialReturns, ReturnRequest } from '../../data/storeOperations';

export const ReturnsPage: React.FC = () => {
  const [returnsList, setReturnsList] = useState<ReturnRequest[]>(initialReturns);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredReturns = returnsList.filter(
    (r) =>
      r.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReturns.length / itemsPerPage) || 1;
  const paginatedReturns = filteredReturns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const updateStatus = (id: string, status: ReturnRequest['status']) => {
    setReturnsList((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (selectedReturn && selectedReturn.id === id) {
      setSelectedReturn({ ...selectedReturn, status });
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">
              Returns, Exchanges & Tailoring Alterations
            </h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Process bespoke fit alterations, exchanges, and verified returns.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white border border-outline-variant rounded-xl p-space-md shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <AdminSearch
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by order #, client, or item..."
            />
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            Showing {filteredReturns.length} requests
          </span>
        </div>

        {/* Table */}
        <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Request & Order
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Customer
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Product Item
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Request Type
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Amount (₹)
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
                {paginatedReturns.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedReturn(req)}
                    className="hover:bg-surface-container-lowest transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-xs text-primary">{req.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-xs text-on-surface">{req.customerName}</p>
                      <p className="font-mono text-[11px] text-on-surface-variant">{req.orderNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          className="w-8 h-8 rounded object-cover bg-surface-container"
                          alt={req.productName}
                          src={req.productImage}
                        />
                        <span className="text-xs font-medium text-on-surface truncate max-w-[160px]">
                          {req.productName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-primary">{req.type}</td>
                    <td className="px-6 py-4 font-bold text-sm text-primary font-mono">
                      ₹{req.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <AdminBadge
                        variant={
                          req.status === 'Completed' || req.status === 'Authorized'
                            ? 'success'
                            : req.status === 'Received & Verified'
                            ? 'info'
                            : 'warning'
                        }
                      >
                        {req.status}
                      </AdminBadge>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedReturn(req)}
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
              Showing {Math.min(paginatedReturns.length, filteredReturns.length)} of{' '}
              {filteredReturns.length} requests
            </span>
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredReturns.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedReturn && (
        <AdminModal
          isOpen={Boolean(selectedReturn)}
          onClose={() => setSelectedReturn(null)}
          title={`Return Request ${selectedReturn.id}`}
          description={`Order ${selectedReturn.orderNumber} • ${selectedReturn.customerName}`}
          footer={
            <div className="flex justify-between items-center w-full">
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(selectedReturn.id, 'Authorized')}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Authorize Service
                </button>
                <button
                  onClick={() => updateStatus(selectedReturn.id, 'Completed')}
                  className="px-3 py-1.5 bg-primary hover:bg-on-background text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Mark Completed
                </button>
              </div>
              <AdminButton variant="outline" onClick={() => setSelectedReturn(null)}>
                Close
              </AdminButton>
            </div>
          }
        >
          <div className="space-y-4 text-sm">
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant space-y-1">
              <p className="font-semibold text-xs text-on-surface-variant uppercase">
                Client Statement / Reason
              </p>
              <p className="text-on-surface leading-relaxed">{selectedReturn.reason}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-surface rounded-lg border border-outline-variant">
                <span className="text-on-surface-variant">Service Type:</span>
                <p className="font-bold text-primary text-sm mt-0.5">{selectedReturn.type}</p>
              </div>
              <div className="p-3 bg-surface rounded-lg border border-outline-variant">
                <span className="text-on-surface-variant">Asset Value:</span>
                <p className="font-bold text-primary text-sm mt-0.5">
                  ${selectedReturn.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </AdminModal>
      )}
    </AdminLayout>
  );
};
