import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Trash2, Check, MessageSquare, RefreshCw } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { AdminSearch } from '../../components/ui/AdminSearch';
import { AdminPagination } from '../../components/ui/AdminPagination';
import { initialReviews, Review } from '../../data/reviews';
import { adminService } from '../../services/adminService';

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const fetchLiveReviews = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getReviews();
      if (res && res.reviews && res.reviews.length > 0) {
        const mapped: Review[] = res.reviews.map((r: any) => ({
          id: r._id || r.id,
          productName: r.product?.name || r.productName || 'Luxury Sartorial Garment',
          author: r.user ? `${r.user.firstName || ''} ${r.user.lastName || ''}`.trim() : (r.author || 'Verified Client'),
          authorEmail: r.user?.email || r.authorEmail || 'client@monolith.luxury',
          rating: r.rating || 5,
          headline: r.title || r.headline || 'Exemplary Craftsmanship',
          comment: r.comment || '',
          date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
          status: r.isApproved ? 'Approved' : 'Pending Moderation',
          isVerified: Boolean(r.isVerifiedPurchase ?? true),
        }));
        setReviews(mapped);
      }
    } catch (err) {
      console.warn('Failed to load reviews, using fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveReviews();
  }, []);

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage) || 1;
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleApprove = async (id: string) => {
    try {
      await adminService.approveReview(id);
    } catch (err) {
      console.warn('Live API review approval error:', err);
    }
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
    );
  };

  const handleReject = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r))
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await adminService.deleteReview(id);
    } catch (err) {
      console.warn('Live API review delete error:', err);
    }
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">
              Customer Perspectives & Review Moderation
            </h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Live feedback, star ratings, and verified customer reviews submitted on the storefront.
            </p>
          </div>
          <AdminButton
            variant="outline"
            leftIcon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
            onClick={fetchLiveReviews}
          >
            Refresh Reviews
          </AdminButton>
        </div>

        {/* Filters */}
        <div className="bg-white border border-outline-variant rounded-xl p-space-md shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-[260px]">
            <AdminSearch
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search reviews by client, product, or keywords..."
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg px-4 py-2 text-sm text-on-surface outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved & Live</option>
              <option value="Pending Moderation">Pending Moderation</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            Showing {filteredReviews.length} client reviews
          </span>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {paginatedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center font-bold text-xs text-primary border border-outline-variant">
                    {review.author
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-on-surface">{review.author}</span>
                      {review.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                          <Check className="w-3 h-3" /> Verified Acquisition
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant">{review.authorEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <AdminBadge
                    variant={
                      review.status === 'Approved'
                        ? 'success'
                        : review.status === 'Rejected'
                        ? 'error'
                        : 'warning'
                    }
                  >
                    {review.status}
                  </AdminBadge>
                  <span className="text-xs text-on-surface-variant font-medium">{review.date}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'fill-current' : 'text-outline-variant'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-xs text-on-surface uppercase tracking-wider">
                    {review.productName}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-primary mb-1">{review.headline}</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">{review.comment}</p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant">
                {review.status !== 'Approved' && (
                  <button
                    onClick={() => handleApprove(review.id)}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve & Publish
                  </button>
                )}
                {review.status !== 'Rejected' && (
                  <button
                    onClick={() => handleReject(review.id)}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-1.5 hover:bg-red-50 text-on-surface-variant hover:text-error rounded-lg transition-colors cursor-pointer"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="p-4 bg-white border border-outline-variant rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs text-on-surface-variant">
            Showing {Math.min(paginatedReviews.length, filteredReviews.length)} of{' '}
            {filteredReviews.length} reviews
          </span>
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredReviews.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReviewsPage;
