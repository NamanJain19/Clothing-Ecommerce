import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Building,
  MessageCircle,
  CreditCard,
  User,
  Key,
  Check,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  MapPin,
  FileText,
  Truck,
  Sparkles,
  Smartphone,
  BellRing,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { AdminButton } from '../../components/ui/AdminButton';
import { AdminInput } from '../../components/ui/AdminInput';
import { storeSettingsService, StoreSettings } from '../../services/storeSettingsService';
import { adminService } from '../../services/adminService';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'store' | 'whatsapp' | 'sms' | 'payments' | 'admin'>('store');
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState('Settings saved & synced in real-time!');

  // Form State initialized from storeSettingsService
  const [settings, setSettings] = useState<StoreSettings>(storeSettingsService.getSettings());

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSave = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    // 1. Save to local reactive store
    storeSettingsService.saveSettings(settings);

    // 2. Persist to MongoDB backend
    try {
      await adminService.updateSettings(settings);
    } catch (err) {
      console.warn('Backend settings update warning:', err);
    }

    setToastMessage('Store settings updated & saved to Database live!');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await adminService.changePassword(currentPassword, newPassword);
      if (res && res.success === false) {
        setPasswordError(res.message || 'Failed to update password');
      } else {
        setPasswordSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccess(false), 3500);
      }
    } catch (err) {
      setPasswordError('Error connecting to backend database');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-space-xl max-w-[1100px] mx-auto w-full space-y-space-lg">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-primary tracking-tight">
              Store & Operations Settings
            </h1>
            <p className="font-body-md text-on-surface-variant mt-1">
              Configure store identity, WhatsApp live concierge, SMS notifications, payment gateways, and admin security in real-time.
            </p>
          </div>
          {isSaved && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-2 rounded-xl text-xs font-bold shadow-sm animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{toastMessage}</span>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-outline-variant gap-2 sm:gap-6 text-xs sm:text-sm font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('store')}
            className={`pb-3 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'store'
                ? 'border-b-2 border-primary text-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <Building className="w-4 h-4" />
            Store Profile & GST
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`pb-3 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'whatsapp'
                ? 'border-b-2 border-primary text-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            WhatsApp Concierge
          </button>
          <button
            onClick={() => setActiveTab('sms')}
            className={`pb-3 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sms'
                ? 'border-b-2 border-primary text-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <Smartphone className="w-4 h-4 text-indigo-600" />
            SMS Gateway & Alerts
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`pb-3 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'payments'
                ? 'border-b-2 border-primary text-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Payments & Shipping
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`pb-3 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'admin'
                ? 'border-b-2 border-primary text-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <User className="w-4 h-4" />
            Admin Profile & Security
          </button>
        </div>

        {/* Main Settings Form Container */}
        <form onSubmit={handleSave} className="bg-white border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* TAB 1: Store Profile */}
          {activeTab === 'store' && (
            <div className="space-y-6">
              <div className="border-b border-outline-variant pb-4">
                <h3 className="font-headline-md text-lg text-primary font-bold">
                  Store Profile & Business Details
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  These details appear on customer invoices, website header, and order confirmations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminInput
                  label="Official Store Brand Name"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  required
                />
                <AdminInput
                  label="Store Currency (Standard)"
                  value={settings.currency}
                  disabled
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminInput
                  label="Customer Support Email"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  required
                />
                <AdminInput
                  label="Helpline & Concierge Phone"
                  value={settings.supportPhone}
                  onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminInput
                  label="GSTIN / Business Tax ID"
                  value={settings.gstin}
                  onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
                  placeholder="e.g. 27AABCM1234F1Z5"
                />
                <AdminInput
                  label="Registered Head Office Address"
                  value={settings.headquarters}
                  onChange={(e) => setSettings({ ...settings, headquarters: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          {/* TAB 2: WhatsApp Concierge */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-6">
              <div className="border-b border-outline-variant pb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-headline-md text-lg text-primary font-bold flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                    WhatsApp Concierge & Live Chatbot
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Enable 1-click floating WhatsApp chat on the storefront for VIP styling and order assistance.
                  </p>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <span className="text-xs font-bold text-primary">
                    {settings.whatsappEnabled ? 'Widget Active' : 'Widget Disabled'}
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.whatsappEnabled}
                    onChange={(e) => setSettings({ ...settings, whatsappEnabled: e.target.checked })}
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                  />
                </label>
              </div>

              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs text-emerald-950">
                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Instant Real-Time Floating Widget:</strong>
                  When enabled, customers browsing your website at <code>http://localhost:3008</code> will see a luxury WhatsApp button on the bottom right corner with quick styling prompts.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminInput
                  label="Business WhatsApp Number (with Country Code)"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  placeholder="+919876543210"
                  required
                />
                <AdminInput
                  label="Concierge Agent Display Name"
                  value={settings.whatsappAgentName}
                  onChange={(e) => setSettings({ ...settings, whatsappAgentName: e.target.value })}
                  placeholder="e.g. Monolith VIP Concierge"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface uppercase tracking-wider">
                  Default Pre-filled Welcome Message
                </label>
                <textarea
                  rows={3}
                  value={settings.whatsappWelcomeMessage}
                  onChange={(e) => setSettings({ ...settings, whatsappWelcomeMessage: e.target.value })}
                  placeholder="Message pre-filled in customer's WhatsApp chat..."
                  className="w-full bg-surface border border-outline-variant rounded-xl p-3.5 outline-none text-xs text-on-surface focus:border-primary"
                />
              </div>
            </div>
          )}

          {/* TAB 3: SMS Gateway & Notifications */}
          {activeTab === 'sms' && (
            <div className="space-y-6">
              <div className="border-b border-outline-variant pb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-headline-md text-lg text-primary font-bold flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-indigo-600" />
                    SMS Gateway & Automated Customer Alerts
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Send automated SMS alerts to customer mobile numbers on order confirmation, dispatch, and delivery.
                  </p>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <span className="text-xs font-bold text-primary">
                    {settings.smsEnabled ? 'SMS Active' : 'SMS Disabled'}
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.smsEnabled}
                    onChange={(e) => setSettings({ ...settings, smsEnabled: e.target.checked })}
                    className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                  />
                </label>
              </div>

              <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl flex items-start gap-3 text-xs text-indigo-950">
                <BellRing className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Pan-India Automated SMS Gateway:</strong>
                  Supports fast transactional SMS via Indian DLT-compliant gateways (Fast2SMS, Msg91, Twilio). Instant alerts are delivered within 3 seconds of customer checkout.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <AdminInput
                  label="SMS Gateway Provider"
                  value={settings.smsProvider || 'Fast2SMS (India)'}
                  onChange={(e) => setSettings({ ...settings, smsProvider: e.target.value })}
                  placeholder="Fast2SMS / Msg91 / Twilio"
                />
                <AdminInput
                  label="SMS Sender ID (DLT Header)"
                  value={settings.smsSenderId || 'MNLTHX'}
                  onChange={(e) => setSettings({ ...settings, smsSenderId: e.target.value })}
                  placeholder="e.g. MNLTHX"
                />
                <AdminInput
                  label="Gateway Authorization API Key"
                  type="password"
                  value={settings.smsApiKey || 'f2sms_live_9812491028401x'}
                  onChange={(e) => setSettings({ ...settings, smsApiKey: e.target.value })}
                  placeholder="••••••••••••••••"
                />
              </div>

              {/* Event Triggers */}
              <div className="pt-2 space-y-3">
                <h4 className="font-bold text-xs text-primary uppercase tracking-wider">
                  Automated SMS Trigger Events
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-primary">Order Placed SMS</h5>
                      <p className="text-[11px] text-on-surface-variant">Instant confirmation SMS on checkout</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.orderPlacedSms}
                      onChange={(e) => setSettings({ ...settings, orderPlacedSms: e.target.checked })}
                      className="w-4 h-4 accent-primary rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-primary">Courier Shipped SMS</h5>
                      <p className="text-[11px] text-on-surface-variant">Sends AWB & live tracking link</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.orderShippedSms}
                      onChange={(e) => setSettings({ ...settings, orderShippedSms: e.target.checked })}
                      className="w-4 h-4 accent-primary rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-primary">Delivery OTP SMS</h5>
                      <p className="text-[11px] text-on-surface-variant">Verifies doorstep COD collection</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.deliveryOtpSms}
                      onChange={(e) => setSettings({ ...settings, deliveryOtpSms: e.target.checked })}
                      className="w-4 h-4 accent-primary rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Payments & Shipping Policies */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="border-b border-outline-variant pb-4">
                <h3 className="font-headline-md text-lg text-primary font-bold">
                  Payment Gateways & Shipping Policies
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Control which payment methods and delivery rates are available during checkout.
                </p>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-primary">Cash on Delivery (COD)</h4>
                    <p className="text-[11px] text-on-surface-variant">Allow customers to pay cash at doorstep</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.codEnabled}
                    onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                    className="w-5 h-5 accent-primary rounded cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-primary">Razorpay Online Gateway</h4>
                    <p className="text-[11px] text-on-surface-variant">Accept UPI, RuPay, Visa & Net Banking</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.razorpayEnabled}
                    onChange={(e) => setSettings({ ...settings, razorpayEnabled: e.target.checked })}
                    className="w-5 h-5 accent-primary rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Financial Thresholds */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <AdminInput
                  label="Free Delivery Threshold (₹ INR)"
                  type="number"
                  value={String(settings.freeShippingThreshold)}
                  onChange={(e) =>
                    setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) || 0 })
                  }
                  helperText="Orders above this amount get complimentary shipping"
                />
                <AdminInput
                  label="Standard Express Fee (₹ INR)"
                  type="number"
                  value={String(settings.standardShippingFee)}
                  onChange={(e) =>
                    setSettings({ ...settings, standardShippingFee: parseFloat(e.target.value) || 0 })
                  }
                  helperText="Applied when below free shipping threshold"
                />
                <AdminInput
                  label="Standard GST Tax Rate (%)"
                  type="number"
                  value={String(settings.gstPercentage)}
                  onChange={(e) =>
                    setSettings({ ...settings, gstPercentage: parseFloat(e.target.value) || 0 })
                  }
                  helperText="Standard Indian luxury apparel GST %"
                />
              </div>

              <div className="pt-2">
                <AdminInput
                  label="Razorpay Production / Test Key ID"
                  value={settings.razorpayKeyId}
                  onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })}
                  placeholder="rzp_test_..."
                />
              </div>
            </div>
          )}

          {/* TAB 5: Admin Profile & Security */}
          {activeTab === 'admin' && (
            <div className="space-y-6">
              <div className="border-b border-outline-variant pb-4">
                <h3 className="font-headline-md text-lg text-primary font-bold">
                  Admin Profile & Login Credentials
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Update administrator identity and system security password.
                </p>
              </div>

              {/* Admin Avatar & Bio */}
              <div className="p-5 bg-surface-container-low border border-outline-variant rounded-xl flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary shadow-md bg-neutral-100">
                    <img
                      src={settings.adminAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt="Admin profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    id="admin-avatar-upload"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        const r = new FileReader();
                        r.onload = (ev) => {
                          if (ev.target?.result) {
                            setSettings({ ...settings, adminAvatar: ev.target.result as string });
                          }
                        };
                        r.readAsDataURL(f);
                      }
                    }}
                  />
                </div>

                <div className="space-y-2 text-center sm:text-left">
                  <h4 className="font-bold text-sm text-primary">Administrator Profile Photo</h4>
                  <p className="text-xs text-on-surface-variant max-w-sm">
                    Upload high-res profile avatar from your device (JPG, PNG, WEBP). This avatar will display on your top header.
                  </p>
                  <button
                    type="button"
                    onClick={() => document.getElementById('admin-avatar-upload')?.click()}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-neutral-800 cursor-pointer shadow-xs"
                  >
                    Browse & Upload Profile Photo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminInput
                  label="Administrator Full Name"
                  value={settings.adminName}
                  onChange={(e) => setSettings({ ...settings, adminName: e.target.value })}
                  required
                />
                <AdminInput
                  label="Administrator Login Email"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                  required
                />
              </div>

              {/* Password Change Sub-section */}
              <div className="p-5 bg-surface-container-low border border-outline-variant rounded-xl space-y-4">
                <h4 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-2">
                  <Key className="w-4 h-4" /> Change Master Admin Password (MongoDB Database Persisted)
                </h4>

                {passwordSuccess && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Admin password successfully updated in MongoDB Database!
                  </div>
                )}

                {passwordError && (
                  <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg text-xs font-semibold">
                    {passwordError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <AdminInput
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <AdminInput
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <AdminInput
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    disabled={isChangingPassword}
                    onClick={handlePasswordChange}
                    className="px-5 py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-bold hover:bg-neutral-800 cursor-pointer disabled:opacity-50"
                  >
                    {isChangingPassword ? 'Saving to Database...' : 'Update Password in Database'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-outline-variant flex items-center justify-between">
            <span className="text-xs text-on-surface-variant">
              Changes are immediately saved to MongoDB and broadcasted live to the storefront website.
            </span>
            <AdminButton type="submit">
              Save All Settings & Sync Live
            </AdminButton>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
