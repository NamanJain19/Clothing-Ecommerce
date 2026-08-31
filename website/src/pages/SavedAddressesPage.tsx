import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { useAuth } from '../context/AuthContext';
import { addressService, AddressData } from '../services/addressService';
import { Plus, LogOut, X, Check, AlertCircle, Trash2, Star, MapPin } from 'lucide-react';
import { LocationMapModal } from '../components/checkout/LocationMapModal';
import { GeocodedLocation } from '../services/geocodingService';

export const SavedAddressesPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [formattedAddress, setFormattedAddress] = useState<string>('');
  const [isDefault, setIsDefault] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch (err: any) {
      console.warn('Failed to load addresses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const handleDelete = async (id: string) => {
    try {
      await addressService.deleteAddress(id);
      setAddresses(addresses.filter((a) => a._id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressService.setDefaultAddress(id);
      await fetchAddresses();
    } catch (err: any) {
      alert(err.message || 'Failed to set default address');
    }
  };

  const handleSelectLocation = (loc: GeocodedLocation) => {
    if (loc.addressLine1) setAddressLine1(loc.addressLine1);
    if (loc.addressLine2) setAddressLine2(loc.addressLine2);
    if (loc.city) setCity(loc.city);
    if (loc.state) setState(loc.state);
    if (loc.postalCode) setPostalCode(loc.postalCode);
    if (loc.country) setCountry(loc.country);
    setLatitude(loc.lat);
    setLongitude(loc.lon);
    setFormattedAddress(loc.displayName);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await addressService.createAddress({
        fullName: fullName.trim(),
        phone: phone.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
        isDefault: isDefault || addresses.length === 0,
        latitude: latitude || undefined,
        longitude: longitude || undefined,
        formattedAddress: formattedAddress || undefined,
      });

      setIsModalOpen(false);
      // Reset form
      setFullName('');
      setPhone('');
      setAddressLine1('');
      setAddressLine2('');
      setCity('');
      setState('Maharashtra');
      setPostalCode('');
      setCountry('India');
      setLatitude(null);
      setLongitude(null);
      setFormattedAddress('');
      setIsDefault(false);

      await fetchAddresses();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save address.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md antialiased selection:bg-primary selection:text-white">
      {/* Shared Master Navbar */}
      <Navbar />

      <main className="pt-24 pb-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'My Account', href: '/dashboard' },
            { label: 'Saved Addresses' },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Account Sidebar Navigation (3 Columns) */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="sticky top-28 space-y-12">
              <div>
                <h2 className="font-headline-md text-2xl mb-6 text-primary">My Account</h2>
                <nav className="flex flex-col gap-1 border-l border-outline-variant">
                  <Link
                    to="/dashboard"
                    className="pl-6 py-3 font-label-caps text-xs uppercase text-secondary hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-orders"
                    className="pl-6 py-3 font-label-caps text-xs uppercase text-secondary hover:text-primary transition-colors"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/track-order"
                    className="pl-6 py-3 font-label-caps text-xs uppercase text-secondary hover:text-primary transition-colors"
                  >
                    Track Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="pl-6 py-3 font-label-caps text-xs uppercase text-secondary hover:text-primary transition-colors"
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/saved-addresses"
                    className="pl-6 py-3 font-label-caps text-xs uppercase text-primary font-bold border-l-2 border-primary -ml-[1px]"
                  >
                    Saved Addresses
                  </Link>
                  <Link
                    to="/payment-methods"
                    className="pl-6 py-3 font-label-caps text-xs uppercase text-secondary hover:text-primary transition-colors"
                  >
                    Payment Methods
                  </Link>
                  <Link
                    to="/account-settings"
                    className="pl-6 py-3 font-label-caps text-xs uppercase text-secondary hover:text-primary transition-colors"
                  >
                    Account Settings
                  </Link>
                  <Link
                    to="/notifications"
                    className="pl-6 py-3 font-label-caps text-xs uppercase text-secondary hover:text-primary transition-colors"
                  >
                    Notifications
                  </Link>
                  <Link
                    to="/help-support"
                    className="pl-6 py-3 font-label-caps text-xs uppercase text-secondary hover:text-primary transition-colors"
                  >
                    Help & Support
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="pl-6 py-3 mt-6 font-label-caps text-xs uppercase text-red-600 hover:opacity-70 text-left cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content Area: Saved Addresses (9 Columns) */}
          <section className="col-span-12 lg:col-span-9">
            <div className="flex justify-between items-end mb-10 border-b border-outline-variant pb-6">
              <div>
                <h1 className="font-headline-lg text-3xl md:text-4xl text-primary">Saved Addresses</h1>
                <p className="font-body-md text-secondary text-sm mt-1">
                  Manage your delivery locations for a faster checkout experience.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Add New Address Trigger Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="group flex flex-col items-center justify-center border-2 border-dashed border-outline-variant p-8 min-h-[280px] hover:border-primary transition-all duration-300 bg-white cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Plus className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <span className="font-label-caps text-xs uppercase tracking-widest text-primary font-semibold">
                  Add New Address
                </span>
              </button>

              {/* Address Cards */}
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="relative bg-white border border-outline-variant p-8 flex flex-col justify-between min-h-[280px] hover:border-primary transition-colors duration-300 shadow-sm"
                >
                  <div>
                    <div className="h-6 mb-4 flex items-center justify-between">
                      {addr.isDefault ? (
                        <span className="bg-primary text-white font-label-caps text-[9px] px-3 py-1 tracking-widest font-bold uppercase">
                          PRIMARY DEFAULT
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetDefault(addr._id!)}
                          className="text-[10px] font-label-caps uppercase text-secondary hover:text-primary transition-colors cursor-pointer"
                        >
                          Make Default
                        </button>
                      )}
                    </div>
                    <h3 className="font-headline-md text-xl text-primary mb-3">{addr.fullName}</h3>
                    <div className="space-y-1 text-secondary font-body-md text-xs leading-relaxed">
                      <p>{addr.addressLine1}</p>
                      {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                      <p>
                        {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                      <p>{addr.country || 'India'}</p>
                      <p className="pt-2 text-primary font-mono">Tel: +91 {addr.phone}</p>
                      {addr.latitude && addr.longitude && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 bg-surface-container text-primary font-mono text-[10px]">
                          <MapPin className="w-3 h-3" /> Map Verified
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-outline-variant/40">
                    <button
                      onClick={() => handleDelete(addr._id!)}
                      className="font-label-caps text-xs uppercase tracking-widest text-secondary hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Shared Master Newsletter */}
        <div className="mt-section-gap">
          <NewsletterSection />
        </div>
      </main>

      {/* Add Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white border border-outline-variant p-8 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-secondary hover:text-primary cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pr-8">
              <h2 className="font-headline-md text-2xl text-primary">Add New Delivery Address</h2>
              <button
                type="button"
                onClick={() => setIsMapModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-primary text-primary font-button text-[11px] uppercase tracking-wider hover:bg-surface-container-low transition-all cursor-pointer w-fit"
              >
                <MapPin className="w-3.5 h-3.5" /> Pinpoint on Map
              </button>
            </div>

            {latitude && longitude && (
              <div className="mb-4 p-3 bg-surface-container-low border border-primary/30 flex items-start gap-2.5 text-xs text-secondary">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-primary">Map Verified Location</p>
                  <p className="line-clamp-1">{formattedAddress || `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`}</p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleAddAddress} className="space-y-4">
              <div>
                <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                  Full Recipient Name
                </label>
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Aarav Sharma"
                  className="w-full border-0 border-b border-outline-variant py-2 bg-transparent text-sm focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                  Mobile Number (India +91)
                </label>
                <input
                  required
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full border-0 border-b border-outline-variant py-2 bg-transparent text-sm focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                  Street Address (House No. / Building / Area)
                </label>
                <input
                  required
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Flat 402, Signature Towers, Linking Road"
                  className="w-full border-0 border-b border-outline-variant py-2 bg-transparent text-sm focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                  Apartment / Suite / Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Near Luxury Boulevard"
                  className="w-full border-0 border-b border-outline-variant py-2 bg-transparent text-sm focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">City</label>
                  <input
                    required
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai"
                    className="w-full border-0 border-b border-outline-variant py-2 bg-transparent text-sm focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">PIN Code</label>
                  <input
                    required
                    type="text"
                    maxLength={6}
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="400050"
                    className="w-full border-0 border-b border-outline-variant py-2 bg-transparent text-sm focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">State</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full border-0 border-b border-outline-variant py-2 bg-transparent text-sm focus:border-primary"
                  >
                    <option>Maharashtra</option>
                    <option>Delhi NCR</option>
                    <option>Karnataka</option>
                    <option>Gujarat</option>
                    <option>Tamil Nadu</option>
                    <option>Telangana</option>
                    <option>West Bengal</option>
                    <option>Rajasthan</option>
                    <option>Punjab</option>
                    <option>Kerala</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full border-0 border-b border-outline-variant py-2 bg-transparent text-sm focus:border-primary"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="w-4 h-4 text-primary border-outline-variant focus:ring-0 rounded-none cursor-pointer"
                  />
                  <span className="font-body-md text-xs text-secondary">Set as primary default delivery address</span>
                </label>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary text-white py-3.5 font-button text-xs uppercase tracking-widest hover:bg-black/90 cursor-pointer shadow-md font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving Address...' : 'Save Address'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="border border-outline-variant text-secondary px-6 py-3.5 font-button text-xs uppercase tracking-widest hover:text-primary cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive OpenStreetMap Location Picker Modal */}
      <LocationMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSelectLocation={handleSelectLocation}
        initialLat={latitude}
        initialLon={longitude}
        initialQuery={addressLine1 ? `${addressLine1}, ${city}` : city}
      />

      {/* Shared Master Footer */}
      <Footer />
    </div>
  );
};

export default SavedAddressesPage;
