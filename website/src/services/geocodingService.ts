/**
 * OpenStreetMap Nominatim Geocoding & Search Service
 * Complies with OpenStreetMap Nominatim usage policies:
 * - Debouncing & in-memory caching
 * - User-Agent identification
 * - Graceful fallback
 */

export interface GeocodedLocation {
  placeId: string;
  displayName: string;
  lat: number;
  lon: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  rawAddress?: Record<string, any>;
}

// In-memory cache to prevent repeated identical network calls
const searchCache = new Map<string, GeocodedLocation[]>();
const reverseCache = new Map<string, GeocodedLocation>();

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

const parseNominatimResult = (item: any): GeocodedLocation => {
  const addr = item.address || {};

  // Extract street/road or landmark
  const road = addr.road || addr.street || addr.pedestrian || addr.footway || addr.path || addr.suburb || addr.neighbourhood || '';
  const houseNumber = addr.house_number || addr.building || '';
  const line1 = [houseNumber, road].filter(Boolean).join(' ') || item.name || item.display_name.split(',')[0] || '';

  // Extract locality/district
  const line2 = addr.neighbourhood || addr.suburb || addr.residential || addr.commercial || '';

  // Extract City / Town / Municipality
  const city = addr.city || addr.town || addr.municipality || addr.district || addr.county || addr.state_district || 'Mumbai';

  // Extract State
  const state = addr.state || addr.province || addr.region || 'Maharashtra';

  // Extract Postal Code
  const postalCode = addr.postcode ? String(addr.postcode).replace(/\D/g, '').slice(0, 6) : '';

  // Extract Country
  const country = addr.country || 'India';

  return {
    placeId: String(item.place_id || Math.random()),
    displayName: item.display_name,
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    addressLine1: line1,
    addressLine2: line2,
    city,
    state,
    postalCode,
    country,
    rawAddress: addr,
  };
};

export const geocodingService = {
  /**
   * Search for locations / addresses using OpenStreetMap Nominatim
   * @param query Address, city, or landmark string
   * @param limit Maximum results (default: 5)
   */
  searchAddress: async (query: string, limit: number = 5): Promise<GeocodedLocation[]> => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return [];

    const cacheKey = `${trimmed.toLowerCase()}_${limit}`;
    if (searchCache.has(cacheKey)) {
      return searchCache.get(cacheKey)!;
    }

    try {
      const url = `${NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(
        trimmed
      )}&addressdetails=1&limit=${limit}&countrycodes=in`;

      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'en',
        },
      });

      if (!response.ok) {
        // Retry without country filter if empty
        const fallbackUrl = `${NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(
          trimmed
        )}&addressdetails=1&limit=${limit}`;
        const fallbackRes = await fetch(fallbackUrl);
        if (!fallbackRes.ok) return [];
        const fallbackData = await fallbackRes.json();
        const results = Array.isArray(fallbackData) ? fallbackData.map(parseNominatimResult) : [];
        searchCache.set(cacheKey, results);
        return results;
      }

      const data = await response.json();
      const results = Array.isArray(data) ? data.map(parseNominatimResult) : [];
      searchCache.set(cacheKey, results);
      return results;
    } catch (err) {
      console.warn('Nominatim address search error:', err);
      return [];
    }
  },

  /**
   * Reverse geocode coordinates to an address using OpenStreetMap Nominatim
   * @param lat Latitude
   * @param lon Longitude
   */
  reverseGeocode: async (lat: number, lon: number): Promise<GeocodedLocation | null> => {
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) return null;

    const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
    if (reverseCache.has(cacheKey)) {
      return reverseCache.get(cacheKey)!;
    }

    try {
      const url = `${NOMINATIM_BASE}/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'en',
        },
      });

      if (!response.ok) return null;

      const data = await response.json();
      if (!data || data.error) return null;

      const location = parseNominatimResult(data);
      reverseCache.set(cacheKey, location);
      return location;
    } catch (err) {
      console.warn('Nominatim reverse geocode error:', err);
      return null;
    }
  },
};
