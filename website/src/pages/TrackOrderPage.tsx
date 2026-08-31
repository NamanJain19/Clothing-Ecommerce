import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { orderService, OrderData, TrackingMilestone } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { TrackingMapCard } from '../components/tracking/TrackingMapCard';
import {
  Check,
  Truck,
  Download,
  Search,
  AlertCircle,
  Package,
  Clock,
  MapPin,
  FileText,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [searchOrderId, setSearchOrderId] = useState(searchParams.get('id') || '');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [myOrdersList, setMyOrdersList] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTrackOrder = async (queryId: string, showRefreshSpinner = false) => {
    if (!queryId.trim()) return;
    if (showRefreshSpinner) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      if (isAuthenticated) {
        // Try dedicated tracking endpoint first
        try {
          const trackData = await orderService.trackOrder(queryId.trim());
          if (trackData && trackData.orderId) {
            setOrder(trackData);
            setIsLoading(false);
            setIsRefreshing(false);
            return;
          }
        } catch {
          // Fallback to order retrieval
        }

        const orders = await orderService.getMyOrders();
        setMyOrdersList(orders);
        const found = orders.find(
          (o) =>
            o._id === queryId.trim() ||
            o.orderNumber.toLowerCase() === queryId.trim().toLowerCase() ||
            (o.awbNumber && o.awbNumber.toLowerCase() === queryId.trim().toLowerCase()) ||
            (o.trackingNumber && o.trackingNumber.toLowerCase() === queryId.trim().toLowerCase()) ||
            o.orderNumber.toLowerCase().includes(queryId.trim().toLowerCase())
        );

        if (found) {
          setOrder(found);
        } else {
          setErrorMessage('No matching order found for this reference ID in your account.');
        }
      } else {
        setErrorMessage('Please sign in to track your order and verify delivery dispatch.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to locate order tracking information.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) {
      setSearchOrderId(idParam);
      fetchTrackOrder(idParam);
    } else if (isAuthenticated) {
      orderService.getMyOrders().then((orders) => {
        setMyOrdersList(orders);
        if (orders.length > 0) {
          setOrder(orders[0]);
          setSearchOrderId(orders[0].orderNumber);
        }
      }).catch(() => {});
    }
  }, [searchParams, isAuthenticated]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrackOrder(searchOrderId);
  };

  // Steps: Confirmed (1), Processing (2), Packed (3), Shipped (4), Out for Delivery (5), Delivered (6)
  const getStepIndex = (status?: string, shipmentStatus?: string) => {
    const s = (shipmentStatus || status || '').toLowerCase();
    if (s === 'delivered') return 6;
    if (s === 'out_for_delivery') return 5;
    if (s === 'in_transit' || s === 'shipped') return 4;
    if (s === 'pickup_scheduled' || s === 'packed') return 3;
    if (s === 'processing' || s === 'manifested') return 2;
    return 1;
  };

  const steps = [
    { title: 'Order Confirmed', desc: 'Order verified & payment received' },
    { title: 'Atelier Processing', desc: 'Preparing item & generating manifest' },
    { title: 'Courier Dispatched', desc: 'Consignment allocated to logistics partner' },
    { title: 'In Transit', desc: 'In transit between courier transit hubs' },
    { title: 'Out for Delivery', desc: 'Arriving with local courier partner' },
    { title: 'Delivered', desc: 'Delivered safely to your destination' },
  ];

  const currentStep = getStepIndex(order?.orderStatus, order?.shipmentStatus);
  const items = order?.items || [];
  const trackingEvents: TrackingMilestone[] = order?.trackingHistory || [];

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md antialiased selection:bg-primary selection:text-white">
      {/* Shared Master Navbar */}
      <Navbar />

      <main className="pt-24 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Track Order' },
          ]}
        />

        {/* Page Header */}
        <section className="mb-10">
          <h1 className="font-headline-lg text-3xl md:text-4xl text-primary mb-2">
            Track Your Order
          </h1>
          <p className="font-body-md text-secondary text-sm max-w-2xl">
            Live dispatch tracking and courier delivery updates.
          </p>
        </section>

        {/* Search Order Bar */}
        <section className="mb-8 bg-white p-6 md:p-8 border border-outline-variant shadow-sm">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-3">
              <label className="block font-label-caps text-[10px] uppercase mb-1 text-secondary">
                Enter Order Number
              </label>
              <input
                type="text"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                placeholder="e.g. ORD-20260827-XXXXXX"
                className="w-full border border-outline-variant bg-transparent p-3 font-mono text-sm placeholder:text-outline focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3.5 font-button text-xs uppercase tracking-widest hover:bg-black/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Search className="w-4 h-4" /> {isLoading ? 'Tracking...' : 'Track Status'}
              </button>
            </div>
          </form>

          {/* Quick Order Selector */}
          {myOrdersList.length > 1 && (
            <div className="mt-4 pt-4 border-t border-outline-variant/60 flex flex-wrap items-center gap-2">
              <span className="text-xs text-secondary font-medium">Recent Orders:</span>
              {myOrdersList.slice(0, 4).map((o) => (
                <button
                  key={o._id}
                  type="button"
                  onClick={() => {
                    setSearchOrderId(o.orderNumber);
                    setOrder(o);
                  }}
                  className={`text-xs px-2.5 py-1 border font-mono cursor-pointer transition-colors ${
                    order?._id === o._id
                      ? 'bg-primary text-white border-primary font-bold'
                      : 'border-outline-variant bg-surface hover:border-primary text-primary'
                  }`}
                >
                  {o.orderNumber}
                </button>
              ))}
            </div>
          )}
        </section>

        {errorMessage && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Tracking Progress & Map (8 Columns) */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* OpenStreetMap Real Dispatch Pinpoint Card */}
            {order && (
              <TrackingMapCard
                shippingAddress={order.shippingAddress}
                courierLatitude={order.courierLatitude}
                courierLongitude={order.courierLongitude}
                carrier={order.carrier}
                shipmentStatus={order.shipmentStatus}
              />
            )}

            {/* Timeline Progress Card */}
            <div className="bg-white p-6 md:p-8 border border-outline-variant shadow-sm space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-outline-variant pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline-md text-lg text-primary font-bold">
                      Order: <span className="font-mono text-sm">{order?.orderNumber || 'Active'}</span>
                    </h3>
                    <button
                      type="button"
                      disabled={isRefreshing}
                      onClick={() => searchOrderId && fetchTrackOrder(searchOrderId, true)}
                      className="text-secondary hover:text-primary transition-colors p-1 cursor-pointer"
                      title="Refresh real-time tracking"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
                    </button>
                  </div>
                  <p className="text-xs text-secondary mt-0.5">
                    Estimated Delivery: <span className="font-bold text-primary">{order?.estimatedDelivery || '2-4 Business Days'}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-label-caps text-xs bg-surface-container text-primary border border-outline-variant px-3 py-1 uppercase font-bold">
                    Shipment: {order?.shipmentStatus?.replace(/_/g, ' ').toUpperCase() || 'MANIFESTED'}
                  </span>
                  <span className="font-label-caps text-xs bg-primary text-white px-3 py-1 uppercase font-bold">
                    {order?.orderStatus?.toUpperCase() || 'CONFIRMED'}
                  </span>
                </div>
              </div>

              {/* Vertical Step Timeline */}
              <div className="space-y-6 pl-2">
                {steps.map((step, idx) => {
                  const stepNum = idx + 1;
                  const isCompleted = currentStep > stepNum;
                  const isCurrent = currentStep === stepNum;

                  return (
                    <div key={step.title} className="flex items-start gap-4 relative">
                      {/* Connecting Line */}
                      {idx < steps.length - 1 && (
                        <div
                          className={`absolute left-4 top-8 w-0.5 h-10 -ml-[1px] ${
                            stepNum < currentStep ? 'bg-primary' : 'bg-outline-variant'
                          }`}
                        />
                      )}

                      {/* Step Circle Icon */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                          isCompleted
                            ? 'bg-primary text-white'
                            : isCurrent
                            ? 'bg-primary text-white ring-4 ring-primary/20'
                            : 'bg-surface-container border border-outline-variant text-secondary'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : isCurrent ? (
                          <Truck className="w-4 h-4 animate-pulse" />
                        ) : (
                          <span className="text-xs font-bold">{stepNum}</span>
                        )}
                      </div>

                      {/* Step Details */}
                      <div className="pt-0.5">
                        <h4
                          className={`text-sm font-bold ${
                            isCompleted || isCurrent ? 'text-primary' : 'text-secondary opacity-60'
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p className="text-xs text-secondary">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Verified Courier Activity Scan History */}
            {trackingEvents.length > 0 && (
              <div className="bg-white p-6 md:p-8 border border-outline-variant shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-outline-variant pb-3">
                  <h3 className="font-headline-md text-base text-primary font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" /> Courier Milestone History ({trackingEvents.length})
                  </h3>
                  <span className="text-[11px] font-mono text-secondary">
                    {order?.carrier || 'Carrier Logistics'}
                  </span>
                </div>

                <div className="space-y-4">
                  {trackingEvents.slice().reverse().map((event, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-4 p-3 bg-surface rounded border border-outline-variant text-xs">
                      <div className="space-y-1">
                        <p className="font-bold text-primary">{event.activity}</p>
                        {event.location && (
                          <p className="text-secondary flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-primary" /> {event.location}
                          </p>
                        )}
                      </div>
                      <span className="font-mono text-[11px] text-secondary shrink-0">
                        {event.timestamp ? new Date(event.timestamp).toLocaleString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }) : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items List */}
            {items.length > 0 && (
              <div className="bg-white p-6 md:p-8 border border-outline-variant shadow-sm">
                <h3 className="font-headline-md text-base text-primary font-bold mb-6 border-b border-outline-variant pb-3">
                  Package Contents ({items.length} Items)
                </h3>

                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <div
                      key={item._id || idx}
                      className="flex gap-4 items-center border-b border-outline-variant pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="w-16 h-20 bg-surface-container shrink-0 border border-outline-variant overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-sm text-primary">{item.name}</h4>
                          <p className="text-xs text-secondary">
                            {item.size || 'M'} • {item.color || 'Standard'} • Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-sm text-primary">
                          ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Tracking Metadata (4 Columns) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Courier Carrier Dispatch Card */}
            <div className="bg-white p-6 md:p-8 border border-outline-variant shadow-sm space-y-5">
              <h3 className="font-headline-md text-base text-primary font-bold border-b border-outline-variant pb-3">
                Logistics & Carrier Details
              </h3>
              <div className="space-y-4 text-xs">
                <div>
                  <p className="font-label-caps text-[10px] uppercase text-secondary mb-1">Carrier Partner</p>
                  <p className="font-bold text-primary text-sm flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-primary" /> {order?.carrier || 'Delhivery Luxury Logistics'}
                  </p>
                </div>

                {order?.awbNumber || order?.trackingNumber ? (
                  <div>
                    <p className="font-label-caps text-[10px] uppercase text-secondary mb-1">Air Waybill (AWB)</p>
                    <p className="font-mono font-bold text-primary text-sm bg-surface p-2 rounded border border-outline-variant">
                      {order.awbNumber || order.trackingNumber}
                    </p>
                  </div>
                ) : null}

                {order?.shipmentId && (
                  <div>
                    <p className="font-label-caps text-[10px] uppercase text-secondary mb-1">Shipment Reference</p>
                    <p className="font-mono text-secondary text-xs">{order.shipmentId}</p>
                  </div>
                )}

                <div>
                  <p className="font-label-caps text-[10px] uppercase text-secondary mb-1">Delivery Service</p>
                  <p className="font-semibold text-primary">
                    {order?.shippingMethod === 'express' ? 'Priority Express Dispatch' : 'Standard White-Glove Courier'}
                  </p>
                </div>

                {order?.trackingUrl && (
                  <div className="pt-1">
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-surface hover:bg-surface-container text-primary font-bold text-xs uppercase tracking-wider border border-outline transition-all cursor-pointer shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4" /> Open Official Carrier Portal ↗
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Destination Address Card */}
            <div className="bg-white p-6 md:p-8 border border-outline-variant shadow-sm space-y-4 text-xs">
              <h3 className="font-headline-md text-base text-primary font-bold border-b border-outline-variant pb-3">
                Destination Address
              </h3>
              {order?.shippingAddress && (
                <div className="space-y-1.5">
                  <p className="font-bold text-primary">{order.shippingAddress.fullName}</p>
                  <p className="text-secondary leading-relaxed">
                    {order.shippingAddress.addressLine1}
                    {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                  </p>
                  <p className="font-mono text-secondary">{order.shippingAddress.phone}</p>
                </div>
              )}

              {order?._id && (
                <div className="pt-2">
                  <button
                    onClick={() => orderService.downloadInvoice(order._id)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-button text-xs uppercase tracking-wider hover:bg-black transition-all cursor-pointer shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Download Official Invoice
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 bg-surface-container-low border border-outline-variant space-y-3">
              <h4 className="font-label-caps text-xs uppercase tracking-wider font-bold text-primary">Need Assistance?</h4>
              <p className="text-xs text-secondary leading-relaxed">
                Have a question about your courier transit or address changes?
              </p>
              <Link to="/help-support" className="inline-block text-primary font-bold text-xs underline">
                Contact Support Team →
              </Link>
            </div>
          </div>
        </div>

        {/* Shared Master Newsletter */}
        <div className="mt-section-gap">
          <NewsletterSection />
        </div>
      </main>

      {/* Shared Master Footer */}
      <Footer />
    </div>
  );
};

export default TrackOrderPage;
