import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Truck, ShieldCheck, Navigation } from 'lucide-react';
import { OrderAddress } from '../../services/orderService';

interface TrackingMapCardProps {
  shippingAddress?: OrderAddress;
  courierLatitude?: number | null;
  courierLongitude?: number | null;
  carrier?: string;
  shipmentStatus?: string;
}

const createDestinationIcon = () => {
  return L.divIcon({
    className: 'destination-marker-icon',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: #000000;
        border: 2px solid #ffffff;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 14px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: #ffffff;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const createCourierIcon = () => {
  return L.divIcon({
    className: 'courier-marker-icon',
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: #059669;
        border: 2px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 4px 14px rgba(5, 150, 105, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
};

export const TrackingMapCard: React.FC<TrackingMapCardProps> = ({
  shippingAddress,
  courierLatitude,
  courierLongitude,
  carrier,
  shipmentStatus,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const hasLiveCourierGps =
    typeof courierLatitude === 'number' &&
    typeof courierLongitude === 'number' &&
    !isNaN(courierLatitude) &&
    !isNaN(courierLongitude);

  // Default fallback coords (e.g. Mumbai, India or Delhi) if address coords are not yet stored
  const destLat = shippingAddress?.latitude || 28.6139;
  const destLon = shippingAddress?.longitude || 77.209;
  const hasDestCoords = Boolean(shippingAddress?.latitude && shippingAddress?.longitude);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: true,
    });
    mapInstanceRef.current = map;

    // OpenStreetMap standard tile layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    const destLatLng: L.LatLngExpression = [destLat, destLon];
    const destMarker = L.marker(destLatLng, { icon: createDestinationIcon() }).addTo(map);
    destMarker.bindPopup(`
      <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4; color: #111;">
        <strong style="text-transform: uppercase; font-size: 10px; color: #666; letter-spacing: 0.5px;">Delivery Destination</strong><br/>
        <b>${shippingAddress?.fullName || 'Customer'}</b><br/>
        ${shippingAddress?.city || ''}, ${shippingAddress?.state || ''}
      </div>
    `);

    if (hasLiveCourierGps) {
      const courierLatLng: L.LatLngExpression = [courierLatitude!, courierLongitude!];
      const courierMarker = L.marker(courierLatLng, { icon: createCourierIcon() }).addTo(map);
      courierMarker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4; color: #111;">
          <strong style="text-transform: uppercase; font-size: 10px; color: #059669; letter-spacing: 0.5px;">Live Courier Position</strong><br/>
          <b>${carrier || 'Priority Dispatch Courier'}</b><br/>
          Status: ${shipmentStatus || 'In Transit'}
        </div>
      `).openPopup();

      // Draw polyline connecting courier to destination
      const polyline = L.polyline([courierLatLng, destLatLng], {
        color: '#059669',
        weight: 3,
        opacity: 0.8,
        dashArray: '6, 8',
      }).addTo(map);

      const bounds = L.latLngBounds([courierLatLng, destLatLng]);
      map.fitBounds(bounds, { padding: [40, 40] });
    } else {
      map.setView(destLatLng, hasDestCoords ? 14 : 10);
    }

    // Invalidate size on next tick to avoid tile rendering cutoffs
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [destLat, destLon, hasDestCoords, hasLiveCourierGps, courierLatitude, courierLongitude, carrier, shipmentStatus]);

  return (
    <div className="bg-white border border-outline-variant shadow-sm overflow-hidden">
      <div className="p-4 md:p-5 border-b border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-surface">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <h3 className="font-headline-md text-sm font-bold text-primary uppercase tracking-wider">
            OpenStreetMap Dispatch Pinpoint
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {hasLiveCourierGps ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              Live Courier GPS Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface-container text-secondary border border-outline-variant">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Destination Verified
            </span>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div ref={mapContainerRef} className="w-full h-64 md:h-72 z-0" />

        {!hasLiveCourierGps && (
          <div className="absolute bottom-2 left-2 right-2 md:left-4 md:right-auto z-[400] max-w-sm bg-white/95 backdrop-blur-sm border border-outline-variant p-2.5 rounded shadow text-[11px] text-secondary leading-relaxed">
            <p className="font-bold text-primary flex items-center gap-1 mb-0.5">
              <Truck className="w-3.5 h-3.5" /> Milestone Tracking Active
            </p>
            Real-time courier GPS coordinates stream during the courier's final last-mile dispatch route. Verified milestone scans are detailed in the log below.
          </div>
        )}
      </div>

      <div className="p-3 bg-surface text-[11px] text-secondary border-t border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
        <p>
          Destination: <span className="font-semibold text-primary">{shippingAddress?.city || 'Local Atelier Destination'}</span>, {shippingAddress?.state || 'India'}
        </p>
        <span className="font-mono text-[10px] text-outline">
          {destLat.toFixed(4)}, {destLon.toFixed(4)}
        </span>
      </div>
    </div>
  );
};
