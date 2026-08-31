import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { geocodingService, GeocodedLocation } from '../../services/geocodingService';
import { Search, MapPin, Navigation, X, Check, Loader2, AlertCircle } from 'lucide-react';

// Custom Luxury Monolith Leaflet Marker Icon
const createCustomMarkerIcon = () => {
  return L.divIcon({
    className: 'custom-monolith-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: #000000;
        border: 2px solid #ffffff;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px;
          height: 10px;
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

interface LocationMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: GeocodedLocation) => void;
  initialLat?: number | null;
  initialLon?: number | null;
  initialQuery?: string;
}

export const LocationMapModal: React.FC<LocationMapModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  initialLat,
  initialLon,
  initialQuery,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>(initialQuery || '');
  const [suggestions, setSuggestions] = useState<GeocodedLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<GeocodedLocation | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Default to Mumbai, India if no initial coords provided
  const defaultLat = initialLat || 19.0178;
  const defaultLon = initialLon || 72.8478;

  // Initialize and manage Leaflet Map
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      // Clean up previous map if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLon],
        zoom: 14,
        zoomControl: true,
      });

      // Add OpenStreetMap Standard Tile Layer with required attribution
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add Draggable Marker
      const customIcon = createCustomMarkerIcon();
      const marker = L.marker([defaultLat, defaultLon], {
        draggable: true,
        icon: customIcon,
      }).addTo(map);

      // Handle marker drag
      marker.on('dragend', async () => {
        const position = marker.getLatLng();
        handleReverseGeocode(position.lat, position.lng);
      });

      // Handle map click to reposition marker
      map.on('click', async (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng);
        handleReverseGeocode(e.latlng.lat, e.latlng.lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Initial reverse geocode if no location yet
      handleReverseGeocode(defaultLat, defaultLon);

      // Force size invalidation for proper rendering in modal
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  // Debounced search for address suggestions
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const handler = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await geocodingService.searchAddress(searchQuery.trim(), 5);
        setSuggestions(results);
      } catch (err) {
        console.warn('Location search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 450);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleReverseGeocode = async (lat: number, lon: number) => {
    setIsReverseGeocoding(true);
    setGeoError(null);
    try {
      const location = await geocodingService.reverseGeocode(lat, lon);
      if (location) {
        setSelectedLocation(location);
      } else {
        setSelectedLocation({
          placeId: `${lat}_${lon}`,
          displayName: `Latitude: ${lat.toFixed(5)}, Longitude: ${lon.toFixed(5)}`,
          lat,
          lon,
          addressLine1: 'Pinpointed Location',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
        });
      }
    } catch (err) {
      console.warn('Reverse geocode error:', err);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  const handleSelectSuggestion = (loc: GeocodedLocation) => {
    setSelectedLocation(loc);
    setSuggestions([]);
    setSearchQuery(loc.displayName);

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.flyTo([loc.lat, loc.lon], 16, { duration: 1.2 });
      markerRef.current.setLatLng([loc.lat, loc.lon]);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 16, { duration: 1.2 });
          markerRef.current.setLatLng([latitude, longitude]);
        }
        handleReverseGeocode(latitude, longitude);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation permission denied or unavailable:', err);
        setGeoError('Location access was not granted. You can still search for your address above.');
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white text-primary w-full max-w-3xl rounded-none border border-outline-variant shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-headline-md text-base sm:text-lg font-bold">
                Pinpoint Delivery Destination
              </h3>
              <p className="font-body-md text-xs text-secondary">
                Search or drag the marker to specify your delivery coordinates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Geo Actions Bar */}
        <div className="p-4 border-b border-outline-variant bg-white space-y-2 relative z-20">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, area, or street address..."
                className="w-full pl-9 pr-8 py-2.5 bg-surface-container-low border border-outline-variant text-xs sm:text-sm font-body-md placeholder:text-outline focus:border-primary focus:outline-hidden"
              />
              <Search className="w-4 h-4 text-secondary absolute left-3 top-3" />
              {isSearching && (
                <Loader2 className="w-4 h-4 text-primary animate-spin absolute right-3 top-3" />
              )}

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-outline-variant shadow-lg z-30 max-h-60 overflow-y-auto">
                  {suggestions.map((item) => (
                    <div
                      key={item.placeId}
                      onClick={() => handleSelectSuggestion(item)}
                      className="p-3 border-b border-outline-variant/50 hover:bg-surface-container-low cursor-pointer transition-colors text-xs flex items-start gap-2.5"
                    >
                      <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-primary">{item.addressLine1 || item.city}</p>
                        <p className="text-secondary line-clamp-1">{item.displayName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="px-4 py-2.5 border border-primary text-primary font-button text-xs uppercase tracking-wider hover:bg-surface-container-low transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              {isLocating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Navigation className="w-3.5 h-3.5" />
              )}
              <span>Use Current Location</span>
            </button>
          </div>

          {geoError && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{geoError}</span>
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="relative flex-1 min-h-[280px] sm:min-h-[360px] w-full bg-surface-container">
          <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '320px' }} />
          {isReverseGeocoding && (
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-xs px-3 py-1.5 border border-outline-variant shadow-md text-xs font-semibold flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              <span>Updating address details...</span>
            </div>
          )}
        </div>

        {/* Selected Location Details Preview & Confirmation Footer */}
        <div className="p-4 sm:p-5 bg-surface-container-low border-t border-outline-variant flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="space-y-0.5 text-xs max-w-lg">
            <p className="font-label-caps text-[10px] uppercase tracking-wider text-secondary">
              Selected Delivery Pinpoint:
            </p>
            <p className="font-bold text-primary text-sm line-clamp-1">
              {selectedLocation?.addressLine1 || selectedLocation?.city || 'Selected Coordinates'}
            </p>
            <p className="text-secondary text-xs line-clamp-1">
              {selectedLocation?.displayName || (selectedLocation ? `${selectedLocation.lat.toFixed(5)}, ${selectedLocation.lon.toFixed(5)}` : '')}
            </p>
          </div>

          <div className="flex gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-outline-variant text-secondary font-button text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedLocation}
              className="px-6 py-2.5 bg-primary text-white font-button text-xs uppercase tracking-widest hover:bg-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Check className="w-4 h-4" /> Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
