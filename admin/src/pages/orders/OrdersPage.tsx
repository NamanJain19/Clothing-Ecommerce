import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Eye,
  Download,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  RefreshCw,
  CreditCard,
  MapPin,
  Package,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminBadge } from '../../components/ui/AdminBadge';
import { AdminSearch } from '../../components/ui/AdminSearch';
import { AdminModal } from '../../components/ui/AdminModal';
import { AdminPagination } from '../../components/ui/AdminPagination';
import { initialOrders, Order } from '../../data/orders';
import { adminService } from '../../services/adminService';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [carrierInput, setCarrierInput] = useState('BlueDart Express');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchLiveOrders = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getOrders();
      if (res && res.orders && res.orders.length > 0) {
        const mapped: Order[] = res.orders.map((o: any) => ({
          id: o._id || o.id,
          orderNumber: o.orderNumber || `ORD-${o._id?.slice(-6)}`,
          customerName: o.user ? `${o.user.firstName || ''} ${o.user.lastName || ''}`.trim() : (o.shippingAddress?.fullName || 'Valued Client'),
          customerEmail: o.user?.email || o.shippingAddress?.email || 'client@monolith.luxury',
          initials: (o.user?.firstName?.[0] || 'C') + (o.user?.lastName?.[0] || 'L'),
          amount: o.totalAmount || 0,
          status: (o.orderStatus?.charAt(0).toUpperCase() + o.orderStatus?.slice(1)) || 'Processing',
          paymentStatus: o.paymentStatus?.toLowerCase() === 'paid' || o.paymentMethod === 'razorpay' ? 'Paid' : 'Pending',
          paymentMethod: o.paymentMethod?.toUpperCase() || 'RAZORPAY',
          date: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
          shippingAddress: typeof o.shippingAddress === 'object' ? `${o.shippingAddress.addressLine1 || ''}, ${o.shippingAddress.city || ''}, ${o.shippingAddress.state || ''} - ${o.shippingAddress.postalCode || ''}` : String(o.shippingAddress || 'Armored Courier Dispatch'),
          estimatedDelivery: o.estimatedDelivery || '',
          latitude: o.shippingAddress?.latitude || null,
          longitude: o.shippingAddress?.longitude || null,
          awbNumber: o.awbNumber || o.trackingNumber || '',
          trackingNumber: o.awbNumber || o.trackingNumber || '',
          shipmentId: o.shipmentId || '',
          shiprocketOrderId: o.shiprocketOrderId || '',
          shiprocketShipmentId: o.shiprocketShipmentId || '',
          carrier: o.carrier || '',
          carrierService: o.carrierService || '',
          trackingUrl: o.trackingUrl || '',
          shipmentStatus: o.shipmentStatus || 'pending',
          trackingHistory: o.trackingHistory || [],
          items: (o.items || []).map((it: any) => ({
            productId: it.product?._id || it.product || 'item-1',
            name: it.product?.name || it.name || 'Luxury Fashion Garment',
            quantity: it.quantity || 1,
            price: it.price || 0,
            image: it.product?.images?.[0] || it.image || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=300&q=80',
          })),
        }));
        setOrders(mapped);
      }
    } catch (err) {
      console.warn('Failed to load live orders, using fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'shipped':
        return <AdminBadge variant="success">Shipped</AdminBadge>;
      case 'processing':
      case 'confirmed':
        return <AdminBadge variant="info">Processing</AdminBadge>;
      case 'pending':
      case 'placed':
        return <AdminBadge variant="warning">Pending</AdminBadge>;
      case 'delivered':
        return <AdminBadge variant="primary">Delivered</AdminBadge>;
      case 'out_for_delivery':
      case 'out for delivery':
        return <AdminBadge variant="info">Out for Delivery</AdminBadge>;
      case 'cancelled':
        return <AdminBadge variant="error">Cancelled</AdminBadge>;
      default:
        return <AdminBadge>{status}</AdminBadge>;
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!selectedOrder) return;
    setIsUpdatingStatus(true);

    try {
      await adminService.updateOrderStatus(
        selectedOrder.id,
        newStatus.toLowerCase().replace(/\s+/g, '_'),
        trackingNumberInput.trim() || `TRK-IN-${Date.now().toString().slice(-6)}`,
        carrierInput
      );
    } catch (err) {
      console.warn('Live API status update error, updated in-memory:', err);
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: newStatus as any } : o))
    );
    setSelectedOrder({ ...selectedOrder, status: newStatus as any });
    setIsUpdatingStatus(false);
  };

  const handleGenerateShipment = async (carrierName = 'Blue Dart Express (Air Priority)') => {
    if (!selectedOrder) return;
    setIsUpdatingStatus(true);
    try {
      const res = await adminService.createShipment(selectedOrder.id, carrierName);
      if (res && res.data) {
        const updated = res.data;
        const mappedOrder: Order = {
          ...selectedOrder,
          awbNumber: updated.awbNumber,
          trackingNumber: updated.awbNumber,
          shipmentId: updated.shipmentId,
          carrier: updated.carrier,
          carrierService: updated.carrierService,
          trackingUrl: updated.trackingUrl,
          shipmentStatus: updated.shipmentStatus,
          status: (updated.orderStatus === 'shipped' ? 'Shipped' : updated.orderStatus === 'processing' ? 'Processing' : selectedOrder.status) as any,
          trackingHistory: updated.trackingHistory || [],
        };
        setSelectedOrder(mappedOrder);
        setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? mappedOrder : o)));
        alert(`Shipment created with ${updated.carrier}! AWB: ${updated.awbNumber}`);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to generate shipment');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleRefreshTracking = async () => {
    if (!selectedOrder) return;
    setIsUpdatingStatus(true);
    try {
      const res = await adminService.refreshTracking(selectedOrder.id);
      if (res && res.data) {
        const { order: updated, liveTracking } = res.data;
        const mappedOrder: Order = {
          ...selectedOrder,
          awbNumber: updated.awbNumber || liveTracking.awbNumber,
          trackingNumber: updated.awbNumber || liveTracking.awbNumber,
          shipmentId: updated.shipmentId || liveTracking.shipmentId,
          carrier: updated.carrier || liveTracking.carrier,
          carrierService: updated.carrierService || liveTracking.carrierService,
          trackingUrl: updated.trackingUrl || liveTracking.trackingUrl,
          shipmentStatus: updated.shipmentStatus || liveTracking.shipmentStatus,
          trackingHistory: updated.trackingHistory || liveTracking.trackingHistory || [],
        };
        setSelectedOrder(mappedOrder);
        setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? mappedOrder : o)));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to refresh tracking');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const downloadAdminInvoice = async (orderId: string) => {
    try {
      await adminService.downloadInvoicePDF(orderId);
    } catch (err) {
      console.error('Error downloading admin invoice:', err);
      alert('Could not download invoice. Please verify backend is reachable.');
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1440px] mx-auto w-full space-y-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">
              Order Fulfillment & Invoices
            </h1>
            <p className="text-body-sm text-on-surface-variant mt-1">
              Manage client orders, courier tracking consignments, and tax invoices.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AdminButton variant="outline" size="sm" onClick={fetchLiveOrders}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </AdminButton>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <div className="w-full sm:w-80">
            <AdminSearch
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by order #, client or email..."
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['All', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === status
                    ? 'bg-primary text-white'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  <th className="px-6 py-4">Order #</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-sm">
                {paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order);
                      setTrackingNumberInput(`TRK-IN-${order.orderNumber.replace(/\D/g, '').slice(-6) || '884920'}`);
                    }}
                    className="hover:bg-surface-container-low/60 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-primary">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                          {order.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-on-surface">{order.customerName}</p>
                          <p className="text-xs text-on-surface-variant">{order.customerEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-on-surface">
                      ₹{order.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {order.paymentStatus} • {order.paymentMethod || 'RAZORPAY'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">{order.date}</td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => downloadAdminInvoice(order.id)}
                          className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                          title="Download Official Tax Invoice PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setTrackingNumberInput(`TRK-IN-${order.orderNumber.replace(/\D/g, '').slice(-6) || '884920'}`);
                          }}
                          className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                          title="Manage Order"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="p-4 border-t border-outline-variant bg-surface-container-low flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-on-surface-variant">
              Showing {Math.min(paginatedOrders.length, filteredOrders.length)} of{' '}
              {filteredOrders.length} orders
            </span>
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredOrders.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Order Details & Courier Dispatch Modal */}
      {selectedOrder && (
        <AdminModal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order ${selectedOrder.orderNumber}`}
          description={`Placed on ${selectedOrder.date} by ${selectedOrder.customerName}`}
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => downloadAdminInvoice(selectedOrder.id)}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download Tax Invoice (PDF)
              </button>
              <AdminButton variant="outline" onClick={() => setSelectedOrder(null)}>
                Close
              </AdminButton>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Courier Dispatch Actions Bar */}
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-4 h-4" /> Real-time Courier Status Dispatch
                </span>
                <span className="text-xs font-semibold">{getStatusBadge(selectedOrder.status)}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                    Courier Partner
                  </label>
                  <select
                    value={carrierInput}
                    onChange={(e) => setCarrierInput(e.target.value)}
                    className="w-full bg-white border border-outline-variant rounded-lg p-2 text-xs font-semibold"
                  >
                    <option value="BlueDart Express">BlueDart Express (Air Priority)</option>
                    <option value="Delhivery Luxury">Delhivery Luxury Logistics</option>
                    <option value="DHL Express">DHL Express Insured</option>
                    <option value="Monolith White-Glove">Monolith White-Glove Atelier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                    Tracking Consignment #
                  </label>
                  <input
                    type="text"
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    className="w-full bg-white border border-outline-variant rounded-lg p-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Status Change Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  disabled={isUpdatingStatus}
                  onClick={() => updateOrderStatus('Confirmed')}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-bold cursor-pointer"
                >
                  ✓ Confirm Order
                </button>
                <button
                  disabled={isUpdatingStatus}
                  onClick={() => updateOrderStatus('Processing')}
                  className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-bold cursor-pointer"
                >
                  ⚙️ Move to Processing
                </button>
                <button
                  disabled={isUpdatingStatus}
                  onClick={() => updateOrderStatus('Shipped')}
                  className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-lg text-xs font-bold cursor-pointer"
                >
                  📦 Mark as Shipped
                </button>
                <button
                  disabled={isUpdatingStatus}
                  onClick={() => updateOrderStatus('Out for Delivery')}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold cursor-pointer"
                >
                  🚚 Out for Delivery
                </button>
                <button
                  disabled={isUpdatingStatus}
                  onClick={() => updateOrderStatus('Delivered')}
                  className="px-3 py-1.5 bg-primary text-white hover:bg-neutral-900 rounded-lg text-xs font-bold cursor-pointer"
                >
                  🏆 Mark as Delivered
                </button>
              </div>
            </div>

            {/* Customer & Address */}
            <div className="p-4 bg-surface-container-low rounded-xl space-y-2 border border-outline-variant text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-sm text-on-surface">
                  <MapPin className="w-4 h-4 text-primary" /> Delivery Destination & Client
                </div>
                {selectedOrder.estimatedDelivery && (
                  <span className="text-[11px] font-bold text-primary bg-white px-2 py-0.5 rounded border border-outline-variant">
                    Est: {selectedOrder.estimatedDelivery}
                  </span>
                )}
              </div>
              <p className="text-on-surface font-semibold">{selectedOrder.customerName}</p>
              <p className="text-on-surface-variant">{selectedOrder.customerEmail}</p>
              <p className="text-on-surface-variant font-mono bg-white p-2 rounded border border-outline-variant">
                {selectedOrder.shippingAddress}
              </p>
              {selectedOrder.latitude && selectedOrder.longitude && (
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-on-surface-variant">
                    Coordinates: {selectedOrder.latitude.toFixed(4)}, {selectedOrder.longitude.toFixed(4)}
                  </span>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${selectedOrder.latitude}&mlon=${selectedOrder.longitude}#map=16/${selectedOrder.latitude}/${selectedOrder.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-bold hover:underline inline-flex items-center gap-1"
                  >
                    View on OpenStreetMap ↗
                  </a>
                </div>
              )}
            </div>

            {/* Courier Logistics & Live Milestones */}
            <div className="p-4 bg-surface-container-low rounded-xl space-y-3 border border-outline-variant text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-sm text-on-surface">
                  <Truck className="w-4 h-4 text-primary" /> Courier Partner & Consignment
                </div>
                <div className="flex items-center gap-1.5">
                  {selectedOrder.awbNumber ? (
                    <button
                      type="button"
                      disabled={isUpdatingStatus}
                      onClick={handleRefreshTracking}
                      className="px-2 py-1 bg-white hover:bg-neutral-100 border border-outline-variant rounded font-semibold text-[11px] text-primary flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isUpdatingStatus ? 'animate-spin' : ''}`} /> Refresh Live Scans
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isUpdatingStatus}
                      onClick={() => handleGenerateShipment('Blue Dart Express (Air Priority)')}
                      className="px-2.5 py-1 bg-primary text-white hover:bg-neutral-900 rounded font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      🚀 Generate Courier Shipment
                    </button>
                  )}
                </div>
              </div>

              {selectedOrder.awbNumber ? (
                <div className="space-y-2 bg-white p-3 rounded-lg border border-outline-variant">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-on-surface-variant">Carrier</p>
                      <p className="font-semibold text-on-surface">{selectedOrder.carrier || 'Delhivery Luxury Logistics'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-on-surface-variant">Air Waybill (AWB)</p>
                      <p className="font-mono font-bold text-primary">{selectedOrder.awbNumber}</p>
                    </div>
                    {selectedOrder.shiprocketOrderId && (
                      <div>
                        <p className="text-[10px] uppercase font-bold text-on-surface-variant">Shiprocket Order / Shipment</p>
                        <p className="font-mono text-[11px] text-on-surface-variant">
                          #{selectedOrder.shiprocketOrderId} / #{selectedOrder.shiprocketShipmentId}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] uppercase font-bold text-on-surface-variant">Shipment Status</p>
                      <span className="inline-block px-2 py-0.5 bg-surface-container rounded text-[11px] font-bold text-primary border border-outline-variant">
                        {selectedOrder.shipmentStatus?.toUpperCase() || 'MANIFESTED'}
                      </span>
                    </div>
                  </div>

                  {selectedOrder.trackingUrl && (
                    <div className="pt-1 flex items-center justify-end">
                      <a
                        href={selectedOrder.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        Open Carrier Tracking Portal ↗
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-on-surface-variant italic">No courier shipment created yet. Click Generate above to create AWB.</p>
              )}

              {/* Courier Milestones */}
              {selectedOrder.trackingHistory && selectedOrder.trackingHistory.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant">
                    Verified Milestone Scans ({selectedOrder.trackingHistory.length})
                  </p>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                    {selectedOrder.trackingHistory.slice().reverse().map((scan, sIdx) => (
                      <div key={sIdx} className="p-2 bg-white rounded border border-outline-variant flex items-start justify-between gap-2 text-[11px]">
                        <div>
                          <p className="font-semibold text-on-surface">{scan.activity}</p>
                          {scan.location && <p className="text-on-surface-variant text-[10px]">📍 {scan.location}</p>}
                        </div>
                        <span className="font-mono text-[10px] text-on-surface-variant shrink-0">
                          {scan.timestamp ? new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Acquired Items ({selectedOrder.items.length})
              </p>
              {selectedOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border border-outline-variant rounded-xl bg-white"
                >
                  <div className="flex items-center gap-3">
                    <img
                      className="w-12 h-12 rounded-lg object-cover bg-surface-container border"
                      alt={item.name}
                      src={item.image}
                    />
                    <div>
                      <p className="font-semibold text-sm text-on-surface">{item.name}</p>
                      <p className="text-xs text-on-surface-variant">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-primary font-mono">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-3 border-t border-outline-variant font-bold text-base">
              <span>Total Amount Paid</span>
              <span className="text-primary font-mono">
                ₹{selectedOrder.amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </AdminModal>
      )}
    </AdminLayout>
  );
};

export default OrdersPage;
