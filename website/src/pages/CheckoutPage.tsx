import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { addressService, AddressData } from '../services/addressService';
import { orderService, CreateOrderPayload, OrderData } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { storeSettingsService, StoreSettings } from '../services/storeSettingsService';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Lock,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  QrCode,
  Building,
  Phone,
  AlertCircle,
  Plus,
  X,
  MapPin,
} from 'lucide-react';
import { LocationMapModal } from '../components/checkout/LocationMapModal';
import { GeocodedLocation } from '../services/geocodingService';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items: cartItems, subtotal, totalItems, clearCart } = useCart();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(storeSettingsService.getSettings());
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [serverShippingOptions, setServerShippingOptions] = useState<any[]>([]);

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setStoreSettings(storeSettingsService.getSettings());
    };
    window.addEventListener('monolith_settings_updated', handleSettingsUpdate);
    window.addEventListener('storage', handleSettingsUpdate);
    return () => {
      window.removeEventListener('monolith_settings_updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleSettingsUpdate);
    };
  }, []);

  // Fetch real server-side shipping calculations and estimated delivery dates
  useEffect(() => {
    orderService.calculateShipping(subtotal, shippingMethod)
      .then((data) => {
        if (data && data.options) {
          setServerShippingOptions(data.options);
        }
      })
      .catch((err) => {
        console.warn('Failed to calculate shipping options:', err);
      });
  }, [subtotal, shippingMethod]);

  const standardOption = serverShippingOptions.find((o) => o.id === 'standard');
  const expressOption = serverShippingOptions.find((o) => o.id === 'express');

  const shippingFee =
    shippingMethod === 'express'
      ? (expressOption ? expressOption.fee : 250)
      : (standardOption ? standardOption.fee : (subtotal >= 1999 || subtotal === 0 ? 0 : 99));
  const total = subtotal + shippingFee;

  // Address state
  const [savedAddresses, setSavedAddresses] = useState<AddressData[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [isLoadingAddresses, setIsLoadingAddresses] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form States
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Maharashtra');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [formattedAddress, setFormattedAddress] = useState<string>('');
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);

  // Gift states
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  // Payment states
  const [upiId, setUpiId] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Prefill user details if authenticated
  useEffect(() => {
    if (user) {
      if (user.email && !email) setEmail(user.email);
      if (user.firstName && !fullName) {
        setFullName(`${user.firstName} ${user.lastName || ''}`.trim());
      }
      if (user.phone && !phone) setPhone(user.phone);
    }
  }, [user]);

  // Load saved addresses when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoadingAddresses(true);
      addressService.getAddresses()
        .then((addrs) => {
          setSavedAddresses(addrs);
          const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
          if (defaultAddr && defaultAddr._id) {
            setSelectedAddressId(defaultAddr._id);
          }
        })
        .catch((err) => {
          console.warn('Failed to load saved addresses:', err);
        })
        .finally(() => {
          setIsLoadingAddresses(false);
        });
    }
  }, [isAuthenticated]);

  // Sync inputs when selecting a saved address
  useEffect(() => {
    if (selectedAddressId !== 'new') {
      const selected = savedAddresses.find((a) => a._id === selectedAddressId);
      if (selected) {
        setFullName(selected.fullName || '');
        setPhone(selected.phone || '');
        setAddress(selected.addressLine1 || '');
        setCity(selected.city || '');
        setState(selected.state || 'Maharashtra');
        setPostalCode(selected.postalCode || '');
        setCountry(selected.country || 'India');
        setLatitude(selected.latitude || null);
        setLongitude(selected.longitude || null);
        setFormattedAddress(selected.formattedAddress || '');
      }
    }
  }, [selectedAddressId, savedAddresses]);

  const handleSelectLocation = (loc: GeocodedLocation) => {
    if (loc.addressLine1) setAddress(loc.addressLine1);
    if (loc.city) setCity(loc.city);
    if (loc.state) setState(loc.state);
    if (loc.postalCode) setPostalCode(loc.postalCode);
    if (loc.country) setCountry(loc.country);
    setLatitude(loc.lat);
    setLongitude(loc.lon);
    setFormattedAddress(loc.displayName);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty. Please add items before placing an order.');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalShippingAddressId = selectedAddressId;

      // If user chose to enter a new address or has no saved address, create it first
      if (selectedAddressId === 'new' || !selectedAddressId) {
        if (!fullName || !phone || !address || !city || !state || !postalCode) {
          throw new Error('Please fill in all required shipping address fields.');
        }

        const newAddr = await addressService.createAddress({
          fullName: fullName.trim(),
          phone: phone.trim(),
          addressLine1: address.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          country: country || 'India',
          isDefault: savedAddresses.length === 0,
          latitude: latitude || undefined,
          longitude: longitude || undefined,
          formattedAddress: formattedAddress || undefined,
        });

        if (!newAddr || !newAddr._id) {
          throw new Error('Failed to save shipping address.');
        }
        finalShippingAddressId = newAddr._id;
      }

      // Map paymentMethod to backend enum
      let backendPaymentMethod: CreateOrderPayload['paymentMethod'] = 'upi';
      if (paymentMethod === 'cod') backendPaymentMethod = 'cash_on_delivery';
      else if (paymentMethod === 'card') backendPaymentMethod = 'credit_debit_card';
      else if (paymentMethod === 'netbanking') backendPaymentMethod = 'net_banking';
      else backendPaymentMethod = 'upi';

      // 1. Create the backend order first
      const orderPayload: CreateOrderPayload = {
        shippingAddressId: finalShippingAddressId,
        paymentMethod: backendPaymentMethod,
        shippingMethod: shippingMethod,
        notes: isGift && giftMessage ? `Gift: ${giftMessage}` : undefined,
      };

      const createdOrder = await orderService.createOrder(orderPayload);
      if (!createdOrder || !createdOrder._id) {
        throw new Error('Failed to create order on server.');
      }

      // 2. Handle Cash on Delivery (COD) -> Instant Success
      if (backendPaymentMethod === 'cash_on_delivery') {
        await clearCart();
        navigate('/order-success', { state: { order: createdOrder } });
        return;
      }

      // 3. Handle Online Payment (Official Razorpay Test Checkout)
      const paymentOrderData = await paymentService.createPaymentOrder(createdOrder._id);

      const rzpOrderId = (paymentOrderData as any).data?.razorpayOrderId || paymentOrderData.razorpayOrderId;
      const rzpAmount = (paymentOrderData as any).data?.amount || paymentOrderData.amount;
      const rzpKey = (paymentOrderData as any).data?.keyId || paymentOrderData.keyId;
      const rzpCurrency = (paymentOrderData as any).data?.currency || paymentOrderData.currency || 'INR';

      if (!rzpOrderId || !rzpKey) {
        throw new Error('Failed to obtain Razorpay order credentials from server.');
      }

      // Load official Razorpay Checkout SDK
      const isScriptLoaded = await paymentService.loadRazorpayScript();
      if (!isScriptLoaded || !window.Razorpay) {
        throw new Error('Unable to load Razorpay Checkout SDK. Please check your internet connection.');
      }

      const options = {
        key: rzpKey,
        amount: rzpAmount,
        currency: rzpCurrency,
        name: 'Monolith Luxury Atelier',
        description: `Order #${createdOrder.orderNumber}`,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-Nfjeq46m2xJ4GymhY-CWVY9EVjOojA372rE-6bRT6KWYPqn6NPSyYDtDgR_WS3i6DV8xJUf6iqw7lMT59PNsRlHn2hMwtSINciz2CaydrVqGxBArBq1Vj7l1Jk_rZQ292u5GgHodW_XB8RBw9r8AXCeL9ou5-aIyL8_-gFaH6rwBXLI5AErv7DWmcfuhABNuNi3CiNvpCSluBUrdj0pj3h6pHh0bh65f5GsPFj7oPPUYJI2C9OqaEw',
        order_id: rzpOrderId,
        prefill: {
          name: fullName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : ''),
          email: email || user?.email || '',
          contact: phone || user?.phone || '',
        },
        theme: {
          color: '#000000',
        },
        handler: async function (response: any) {
          try {
            setIsSubmitting(true);
            const verifyRes = await paymentService.verifyPayment({
              orderId: createdOrder._id,
              razorpay_order_id: response.razorpay_order_id || rzpOrderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              await clearCart();
              navigate('/order-success', { state: { order: verifyRes.order || createdOrder } });
            } else {
              setErrorMessage(verifyRes.message || 'Payment signature verification failed.');
            }
          } catch (err: any) {
            console.error('Payment verification failed:', err);
            setErrorMessage(err.message || 'Payment verification failed. Please contact support.');
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            setErrorMessage('Payment window was dismissed. Your order is pending in archives.');
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response: any) {
        setIsSubmitting(false);
        setErrorMessage(`Payment failed: ${response.error?.description || 'Transaction declined'}`);
      });

      razorpayInstance.open();
      setIsSubmitting(false);
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md antialiased selection:bg-primary selection:text-white">
      {/* Shared Master Navbar */}
      <Navbar />

      <main className="pt-24 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Cart', href: '/cart' },
            { label: 'Checkout' },
          ]}
        />

        <header className="mb-12">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-2">Checkout</h1>
          <p className="font-body-lg text-secondary">Complete your order securely.</p>
        </header>

        {/* Login Prompt Banner if Guest */}
        {!isAuthenticated && !authLoading && (
          <div className="mb-8 p-5 bg-surface-container border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-headline-md text-sm text-primary font-bold">Already have an account?</p>
              <p className="font-body-md text-xs text-secondary">Log in for faster checkout with your saved addresses.</p>
            </div>
            <Link
              to="/login?redirect=/checkout"
              className="px-6 py-2.5 bg-primary text-white font-button text-xs uppercase tracking-widest hover:bg-black transition-all"
            >
              Sign In
            </Link>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-8 p-4 bg-error/10 border border-error/30 text-error flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Form Steps (7 Columns) */}
          <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-12">
            {/* Step 1: Contact Information */}
            <section className="space-y-6 bg-white p-8 border border-outline-variant">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-label-caps text-label-caps bg-primary text-white w-8 h-8 flex items-center justify-center font-bold">
                  01
                </span>
                <h2 className="font-headline-md text-2xl">Contact Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label-caps text-[10px] uppercase mb-1 text-secondary">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full border-0 border-b border-outline-variant bg-transparent py-3 px-0 font-body-md placeholder:text-outline focus:border-primary transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-[10px] uppercase mb-1 text-secondary">
                    Mobile Number (India +91)
                  </label>
                  <input
                    required
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full border-0 border-b border-outline-variant bg-transparent py-3 px-0 font-body-md placeholder:text-outline focus:border-primary transition-all text-sm"
                  />
                </div>
              </div>
            </section>

            {/* Step 2: Shipping Address */}
            <section className="space-y-6 bg-white p-8 border border-outline-variant">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <span className="font-label-caps text-label-caps bg-primary text-white w-8 h-8 flex items-center justify-center font-bold">
                    02
                  </span>
                  <h2 className="font-headline-md text-2xl">Shipping Address</h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMapModalOpen(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 border border-primary text-primary font-button text-xs uppercase tracking-wider hover:bg-surface-container-low transition-all cursor-pointer w-fit"
                >
                  <MapPin className="w-4 h-4 text-primary" /> Pinpoint on Map / Search
                </button>
              </div>

              {/* Pinpointed Location Banner */}
              {latitude && longitude && (
                <div className="p-3 bg-surface-container-low border border-primary/30 flex items-start gap-2.5 text-xs text-secondary">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-primary">Map Verified Location</p>
                    <p className="line-clamp-1">{formattedAddress || `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`}</p>
                  </div>
                </div>
              )}

              {/* Saved Addresses Selector (if authenticated & addresses exist) */}
              {isAuthenticated && savedAddresses.length > 0 && (
                <div className="mb-6 space-y-3">
                  <label className="block font-label-caps text-[10px] uppercase tracking-widest text-secondary">
                    Choose from Saved Addresses
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => setSelectedAddressId(addr._id || 'new')}
                        className={`p-4 border cursor-pointer transition-all ${
                          selectedAddressId === addr._id
                            ? 'border-primary bg-surface-container-low shadow-sm'
                            : 'border-outline-variant hover:border-primary/40'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-headline-md text-sm font-bold">{addr.fullName}</p>
                          {addr.isDefault && (
                            <span className="font-label-caps text-[8px] bg-primary text-white px-2 py-0.5 uppercase">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="font-body-md text-xs text-secondary line-clamp-2">{addr.addressLine1}, {addr.city}</p>
                        <p className="font-body-md text-xs text-secondary">{addr.state} - {addr.postalCode}</p>
                        <p className="font-body-md text-xs text-secondary mt-1">Tel: +91 {addr.phone}</p>
                        {addr.latitude && addr.longitude && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono text-primary font-bold mt-1 bg-surface-container px-1.5 py-0.5">
                            <MapPin className="w-2.5 h-2.5" /> Map Verified
                          </span>
                        )}
                      </div>
                    ))}
                    <div
                      onClick={() => setSelectedAddressId('new')}
                      className={`p-4 border border-dashed flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        selectedAddressId === 'new'
                          ? 'border-primary bg-surface-container-low text-primary'
                          : 'border-outline text-secondary hover:border-primary'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span className="font-label-caps text-xs uppercase tracking-widest">Use New Address</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Address Form Inputs */}
              {(selectedAddressId === 'new' || savedAddresses.length === 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="md:col-span-2">
                    <label className="block font-label-caps text-[10px] uppercase mb-1 text-secondary">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Aarav Sharma"
                      className="w-full border-0 border-b border-outline-variant bg-transparent py-3 px-0 font-body-md placeholder:text-outline focus:border-primary transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-label-caps text-[10px] uppercase mb-1 text-secondary">
                      Country
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full border-0 border-b border-outline-variant bg-transparent py-3 px-0 font-body-md focus:ring-0 focus:border-primary text-sm"
                    >
                      <option>India</option>
                      <option>United Arab Emirates</option>
                      <option>United Kingdom</option>
                      <option>United States</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-caps text-[10px] uppercase mb-1 text-secondary">
                      State
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full border-0 border-b border-outline-variant bg-transparent py-3 px-0 font-body-md focus:ring-0 focus:border-primary text-sm"
                    >
                      <option>Maharashtra</option>
                      <option>Delhi NCR</option>
                      <option>Karnataka</option>
                      <option>Gujarat</option>
                      <option>Tamil Nadu</option>
                      <option>Telangana</option>
                      <option>West Bengal</option>
                      <option>Rajasthan</option>
                      <option>Uttar Pradesh</option>
                      <option>Punjab</option>
                      <option>Kerala</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-caps text-[10px] uppercase mb-1 text-secondary">
                      City / Town
                    </label>
                    <input
                      required
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai / New Delhi"
                      className="w-full border-0 border-b border-outline-variant bg-transparent py-3 px-0 font-body-md placeholder:text-outline focus:border-primary transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-label-caps text-[10px] uppercase mb-1 text-secondary">
                      6-Digit PIN Code
                    </label>
                    <input
                      required
                      type="text"
                      maxLength={6}
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="400001"
                      className="w-full border-0 border-b border-outline-variant bg-transparent py-3 px-0 font-body-md placeholder:text-outline focus:border-primary transition-all text-sm tracking-widest font-mono"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-label-caps text-[10px] uppercase mb-1 text-secondary">
                      Flat / House No. / Building / Street Address
                    </label>
                    <input
                      required
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Plot 42, Bandra West, Linking Road"
                      className="w-full border-0 border-b border-outline-variant bg-transparent py-3 px-0 font-body-md placeholder:text-outline focus:border-primary transition-all text-sm"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Step 3: Shipping Method */}
            <section className="space-y-6 bg-white p-8 border border-outline-variant">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-label-caps text-label-caps bg-primary text-white w-8 h-8 flex items-center justify-center font-bold">
                  03
                </span>
                <h2 className="font-headline-md text-2xl">Shipping Method & Delivery Window</h2>
              </div>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-5 border border-outline-variant cursor-pointer hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="text-primary focus:ring-0"
                    />
                    <div>
                      <p className="font-label-caps text-label-caps">Standard White-Glove Delivery</p>
                      <p className="text-secondary text-xs">
                        {standardOption?.estimatedDelivery || 'Estimated 3-5 business days across India'}
                      </p>
                    </div>
                  </div>
                  <span className="font-body-md font-semibold text-primary">
                    {subtotal >= 1999 ? 'Free' : '₹99'}
                  </span>
                </label>

                <label className="flex items-center justify-between p-5 border border-outline-variant cursor-pointer hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="text-primary focus:ring-0"
                    />
                    <div>
                      <p className="font-label-caps text-label-caps">Priority Express Atelier Dispatch</p>
                      <p className="text-secondary text-xs">
                        {expressOption?.estimatedDelivery || 'Guaranteed 1-2 business days with insured courier'}
                      </p>
                    </div>
                  </div>
                  <span className="font-body-md font-semibold text-primary">₹250</span>
                </label>
              </div>
            </section>

            {/* Step 4: Payment Method */}
            <section className="space-y-6 bg-white p-8 border border-outline-variant">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-label-caps text-label-caps bg-primary text-white w-8 h-8 flex items-center justify-center font-bold">
                  04
                </span>
                <h2 className="font-headline-md text-2xl">Payment Selection (Razorpay Secured)</h2>
              </div>

              <div className="space-y-4">
                {/* UPI Option */}
                <div className="border border-outline-variant overflow-hidden">
                  <label className="flex items-center justify-between p-5 cursor-pointer hover:bg-surface-container-low transition-colors">
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="text-primary focus:ring-0"
                      />
                      <div className="flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-secondary" />
                        <span className="font-label-caps text-label-caps">UPI / Google Pay / PhonePe / QR</span>
                      </div>
                    </div>
                    <span className="text-secondary text-xs font-mono">Instant Gateway</span>
                  </label>
                </div>

                {/* Card Option */}
                <div className="border border-outline-variant overflow-hidden">
                  <label className="flex items-center justify-between p-5 cursor-pointer hover:bg-surface-container-low transition-colors">
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="text-primary focus:ring-0"
                      />
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-secondary" />
                        <span className="font-label-caps text-label-caps">Credit / Debit Card (Visa, MC, Amex)</span>
                      </div>
                    </div>
                    <span className="text-secondary text-xs">256-bit SSL</span>
                  </label>
                </div>

                {/* Net Banking */}
                <div className="border border-outline-variant overflow-hidden">
                  <label className="flex items-center justify-between p-5 cursor-pointer hover:bg-surface-container-low transition-colors">
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'netbanking'}
                        onChange={() => setPaymentMethod('netbanking')}
                        className="text-primary focus:ring-0"
                      />
                      <div className="flex items-center gap-2">
                        <Building className="w-5 h-5 text-secondary" />
                        <span className="font-label-caps text-label-caps">Net Banking (All Major Indian Banks)</span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Cash on Delivery */}
                <div className={`border border-outline-variant overflow-hidden ${!storeSettings.codEnabled ? 'opacity-50 bg-neutral-100' : ''}`}>
                  <label className={`flex items-center justify-between p-5 transition-colors ${storeSettings.codEnabled ? 'cursor-pointer hover:bg-surface-container-low' : 'cursor-not-allowed'}`}>
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="payment"
                        disabled={!storeSettings.codEnabled}
                        checked={paymentMethod === 'cod' && storeSettings.codEnabled}
                        onChange={() => storeSettings.codEnabled && setPaymentMethod('cod')}
                        className="text-primary focus:ring-0"
                      />
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-secondary" />
                        <span className="font-label-caps text-label-caps">Cash / Card on Delivery (COD)</span>
                      </div>
                    </div>
                    <span className="text-secondary text-xs">
                      {storeSettings.codEnabled ? 'Available for Pan-India' : 'Currently Unavailable'}
                    </span>
                  </label>
                </div>
              </div>
            </section>

            {/* Step 5: Gift Option */}
            <section className="space-y-4 bg-white p-8 border border-outline-variant">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-headline-md text-lg">Signature Monolith Gift Packaging</h3>
                  <p className="font-body-md text-xs text-secondary">Includes bespoke black ribbon box & handwritten card.</p>
                </div>
                <input
                  type="checkbox"
                  checked={isGift}
                  onChange={(e) => setIsGift(e.target.checked)}
                  className="w-5 h-5 text-primary border-outline rounded-none focus:ring-0"
                />
              </div>
              {isGift && (
                <div className="pt-4 border-t border-outline-variant">
                  <label className="block text-[10px] font-label-caps text-secondary uppercase mb-1">
                    Complimentary Gift Note
                  </label>
                  <textarea
                    rows={3}
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="Write your bespoke message here..."
                    className="w-full border border-outline-variant bg-transparent p-3 text-sm focus:border-primary"
                  />
                </div>
              )}
            </section>

            <button
              type="submit"
              disabled={isSubmitting || cartItems.length === 0}
              className="w-full py-5 bg-primary text-on-primary font-button text-sm uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Payment & Order...</span>
                </div>
              ) : (
                <>
                  <span>
                    {paymentMethod === 'cod' ? 'Place Order (COD)' : 'Proceed to Payment'} • ₹{total.toLocaleString('en-IN')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Right Column: Order Summary (5 Columns) */}
          <div className="lg:col-span-5 space-y-8 sticky top-28">
            <div className="bg-surface-container-low p-8 border border-outline-variant">
              <div className="flex justify-between items-center pb-6 border-b border-outline-variant">
                <h3 className="font-headline-md text-xl">Order Summary</h3>
                <span className="font-label-caps text-secondary text-xs">
                  {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              {/* Items Preview */}
              <div className="py-6 space-y-4 max-h-80 overflow-y-auto divide-y divide-outline-variant">
                {cartItems.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                    <div className="w-16 h-20 bg-white border border-outline-variant overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <p className="font-headline-md text-primary font-semibold line-clamp-1">{item.name}</p>
                        <p className="text-secondary uppercase text-[10px] mt-0.5">
                          {item.size || 'M'} • {item.color || 'Standard'} • Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-body-md font-bold text-primary">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="pt-6 border-t border-outline-variant space-y-3 text-sm">
                <div className="flex justify-between text-secondary">
                  <span>Cart Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>{shippingMethod === 'express' ? 'Priority Express Dispatch' : 'Standard Delivery'}</span>
                  <span className="text-primary font-semibold">
                    {shippingFee === 0 ? 'Complimentary' : `₹${shippingFee.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Estimated Taxes (GST 5%)</span>
                  <span>Included</span>
                </div>
                <div className="pt-4 border-t border-outline-variant flex justify-between font-headline-md text-xl text-primary font-bold">
                  <span>Total Amount</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="p-6 bg-white border border-outline-variant space-y-4 text-xs text-secondary">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                <span>Razorpay 256-Bit Encrypted Secure Payment</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-primary shrink-0" />
                <span>Complimentary Insured Delivery Across India</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span>14-Day Complimentary Luxury Returns & Exchange</span>
              </div>
            </div>
          </div>
        </div>


      </main>

      {/* Interactive OpenStreetMap Location Picker Modal */}
      <LocationMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSelectLocation={handleSelectLocation}
        initialLat={latitude}
        initialLon={longitude}
        initialQuery={address ? `${address}, ${city}` : city}
      />

      {/* Shared Master Footer */}
      <Footer />
    </div>
  );
};

export default CheckoutPage;
