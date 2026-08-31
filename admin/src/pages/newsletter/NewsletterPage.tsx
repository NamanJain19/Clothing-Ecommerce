import React, { useState } from 'react';
import { Mail, Download, Trash2, CheckCircle2, UserCheck, Search, Send } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { AdminSearch } from '../../components/ui/AdminSearch';
import { AdminPagination } from '../../components/ui/AdminPagination';

export interface Subscriber {
  id: string;
  email: string;
  source: 'Footer' | 'Private Sale Popup' | 'Checkout Opt-in' | 'VIP Salon Invitation';
  status: 'Active' | 'Unsubscribed';
  subscribedAt: string;
}

export const initialSubscribers: Subscriber[] = [
  {
    id: 'SUB-01',
    email: 'elias.vance@monolith.luxury',
    source: 'VIP Salon Invitation',
    status: 'Active',
    subscribedAt: 'Aug 28, 2024',
  },
  {
    id: 'SUB-02',
    email: 'clara.sartorial@paris.fr',
    source: 'Private Sale Popup',
    status: 'Active',
    subscribedAt: 'Aug 27, 2024',
  },
  {
    id: 'SUB-03',
    email: 'marcus.couture@milan.it',
    source: 'Footer',
    status: 'Active',
    subscribedAt: 'Aug 25, 2024',
  },
  {
    id: 'SUB-04',
    email: 'victoria.sterling@london.uk',
    source: 'Checkout Opt-in',
    status: 'Active',
    subscribedAt: 'Aug 24, 2024',
  },
  {
    id: 'SUB-05',
    email: 'alexander.wright@luxury.com',
    source: 'Private Sale Popup',
    status: 'Active',
    subscribedAt: 'Aug 22, 2024',
  },
];

export const NewsletterPage: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredSubscribers = subscribers.filter((s) =>
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage) || 1;
  const paginatedSubscribers = filteredSubscribers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Email,Source,Status,SubscribedAt']
        .concat(subscribers.map((s) => `${s.email},${s.source},${s.status},${s.subscribedAt}`))
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'monolith_newsletter_subscribers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id: string) => {
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">
              Newsletter & Private Dispatch Audience
            </h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Curate registered subscriber emails, seasonal lookbook dispatches, and export customer marketing leads.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AdminButton
              variant="outline"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleExportCSV}
            >
              Export CSV Manifest
            </AdminButton>
          </div>
        </div>

        {/* Stats Snapshot */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white border border-outline-variant rounded-xl shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Total Active Subscribers
            </span>
            <p className="text-2xl font-bold text-primary">{subscribers.length}</p>
          </div>
          <div className="p-5 bg-white border border-outline-variant rounded-xl shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Lead Source Leader
            </span>
            <p className="text-2xl font-bold text-primary">Private Sale Popup</p>
          </div>
          <div className="p-5 bg-white border border-outline-variant rounded-xl shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Audience Engagement Rate
            </span>
            <p className="text-2xl font-bold text-emerald-600">94.2%</p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="bg-white border border-outline-variant rounded-xl p-space-md shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-[260px]">
            <AdminSearch
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by subscriber email..."
            />
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            Showing {filteredSubscribers.length} verified subscribers
          </span>
        </div>

        {/* Subscribers Table */}
        <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Subscriber Email
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Acquisition Channel
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Subscription Status
                  </th>
                  <th className="px-6 py-4 font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Date Subscribed
                  </th>
                  <th className="px-6 py-4 text-right font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {paginatedSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary">
                          <Mail className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-sm text-primary">{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2.5 py-1 rounded bg-surface-container-high text-on-surface border border-outline-variant font-medium">
                        {subscriber.source}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <AdminBadge variant={subscriber.status === 'Active' ? 'success' : 'neutral'}>
                        {subscriber.status}
                      </AdminBadge>
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">{subscriber.subscribedAt}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(subscriber.id)}
                        className="p-1.5 hover:bg-red-50 text-on-surface-variant hover:text-error rounded-lg transition-colors cursor-pointer"
                        title="Remove Subscriber"
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
              Showing {Math.min(paginatedSubscribers.length, filteredSubscribers.length)} of{' '}
              {filteredSubscribers.length} subscribers
            </span>
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredSubscribers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewsletterPage;
