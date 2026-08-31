import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import {
  Lock,
  ChevronRight,
  LogOut,
  X,
  Shield,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Laptop,
  Check,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { applyTheme, ThemeMode } from '../utils/theme';
import { useTheme } from '../context/ThemeContext';

export const AccountSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const { theme, setTheme } = useTheme();

  const [language, setLanguage] = useState('English (US)');
  const [currency, setCurrency] = useState('INR (₹)');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const handleThemeChange = (mode: ThemeMode) => {
    setTheme(mode);
  };

  // Profile fields
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccessMessage, setProfileSuccessMessage] = useState<string | null>(null);
  const [profileErrorMessage, setProfileErrorMessage] = useState<string | null>(null);

  // Modals
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (isPasswordModalOpen || isDeleteModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPasswordModalOpen, isDeleteModalOpen]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileSuccessMessage(null);
    setProfileErrorMessage(null);

    try {
      await authService.updateProfile({
        firstName,
        lastName,
        email,
        phone,
      });
      await refreshUser();
      setProfileSuccessMessage('Profile updated successfully.');
      setTimeout(() => setProfileSuccessMessage(null), 4000);
    } catch (err: any) {
      setProfileErrorMessage(err.message || 'Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    setIsChangingPassword(true);

    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
      });
      setPasswordSuccess('Password updated successfully.');
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess(null);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }, 1500);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await authService.deleteAccount();
    } catch (err) {
      console.warn('Delete account error:', err);
    } finally {
      logout();
      setIsDeleteModalOpen(false);
      navigate('/login');
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
            { label: 'Account Settings' },
          ]}
        />

        <div className="grid grid-cols-12 gap-8">
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
                    className="pl-6 py-3 font-label-caps text-xs uppercase text-secondary hover:text-primary transition-colors"
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
                    className="pl-6 py-3 font-label-caps text-xs uppercase text-primary font-bold border-l-2 border-primary -ml-[1px]"
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

          {/* Main Content Area: Account Settings (9 Columns) */}
          <section className="col-span-12 lg:col-span-9 space-y-12">
            <header className="border-b border-outline-variant pb-6">
              <h1 className="font-headline-lg text-3xl md:text-4xl text-primary mb-2">Account Settings</h1>
              <p className="font-body-md text-secondary text-sm">
                Manage your personal profile, security preferences, and account controls.
              </p>
            </header>

            {/* Profile Information Form */}
            <form onSubmit={handleProfileSubmit} className="space-y-6 bg-white p-8 border border-outline-variant shadow-sm">
              <div className="border-b border-outline-variant pb-4">
                <h3 className="font-headline-md text-2xl text-primary">Personal Details</h3>
                <p className="text-xs text-secondary mt-0.5">Manage your identity, email, and contact information.</p>
              </div>

              {profileSuccessMessage && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{profileSuccessMessage}</span>
                </div>
              )}

              {profileErrorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>{profileErrorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                    First Name
                  </label>
                  <input
                    required
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border-0 border-b border-outline-variant py-2.5 bg-transparent text-sm focus:border-primary font-medium"
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                    Last Name
                  </label>
                  <input
                    required
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border-0 border-b border-outline-variant py-2.5 bg-transparent text-sm focus:border-primary font-medium"
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                    Email Address (Gmail / Account Email)
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full border-0 border-b border-outline-variant py-2.5 bg-transparent text-sm focus:border-primary font-medium text-primary"
                  />
                  <p className="text-[10px] text-secondary mt-1">Used for orders, notifications, and account authentication.</p>
                </div>
                <div>
                  <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                    Mobile Phone (+91)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98200 12345"
                    className="w-full border-0 border-b border-outline-variant py-2.5 bg-transparent text-sm focus:border-primary font-medium"
                  />
                  <p className="text-[10px] text-secondary mt-1">Used for order delivery updates and tracking alerts.</p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="bg-primary text-white px-8 py-3.5 font-button text-xs uppercase tracking-widest hover:bg-black/90 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>

            {/* Appearance Section */}
            <div className="space-y-6">
              <div>
                <h3 className="font-headline-md text-2xl text-primary mb-1">Appearance & Theme</h3>
                <p className="font-body-md text-secondary text-xs">
                  Customize how the luxury interface looks on your device (persisted across sessions).
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  onClick={() => handleThemeChange('light')}
                  className={`border p-5 flex flex-col gap-4 transition-all cursor-pointer bg-white ${
                    theme === 'light' ? 'border-primary shadow-sm ring-1 ring-primary' : 'border-outline-variant hover:border-primary'
                  }`}
                >
                  <div className="aspect-video bg-surface-container flex items-center justify-center border border-outline-variant">
                    <Sun className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-label-caps text-xs uppercase font-semibold">Light Mode</span>
                    <div
                      className={`w-3.5 h-3.5 rounded-full ${
                        theme === 'light' ? 'bg-primary' : 'border border-outline-variant'
                      }`}
                    />
                  </div>
                </div>

                <div
                  onClick={() => handleThemeChange('dark')}
                  className={`border p-5 flex flex-col gap-4 transition-all cursor-pointer bg-white ${
                    theme === 'dark' ? 'border-primary shadow-sm ring-1 ring-primary' : 'border-outline-variant hover:border-primary'
                  }`}
                >
                  <div className="aspect-video bg-black flex items-center justify-center border border-primary">
                    <Moon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-label-caps text-xs uppercase font-semibold">Dark Mode</span>
                    <div
                      className={`w-3.5 h-3.5 rounded-full ${
                        theme === 'dark' ? 'bg-primary' : 'border border-outline-variant'
                      }`}
                    />
                  </div>
                </div>

                <div
                  onClick={() => handleThemeChange('system')}
                  className={`border p-5 flex flex-col gap-4 transition-all cursor-pointer bg-white ${
                    theme === 'system' ? 'border-primary shadow-sm ring-1 ring-primary' : 'border-outline-variant hover:border-primary'
                  }`}
                >
                  <div className="aspect-video bg-gradient-to-br from-white to-black flex items-center justify-center border border-outline-variant">
                    <Laptop className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-label-caps text-xs uppercase font-semibold">System Preference</span>
                    <div
                      className={`w-3.5 h-3.5 rounded-full ${
                        theme === 'system' ? 'bg-primary' : 'border border-outline-variant'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-6 pt-6 border-t border-outline-variant">
              <div>
                <h3 className="font-headline-md text-2xl text-primary mb-1">Security</h3>
                <p className="font-body-md text-secondary text-xs">Manage your account access and protection.</p>
              </div>
              <div className="bg-white border border-outline-variant divide-y divide-outline-variant">
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-surface-container-low transition-all cursor-pointer"
                >
                  <div>
                    <span className="font-label-caps text-xs uppercase font-bold text-primary block">
                      Change Password
                    </span>
                    <span className="text-xs text-secondary">Update your encrypted account password</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-secondary" />
                </button>
              </div>
            </div>

            {/* Privacy Section */}
            <div className="space-y-6 pt-6 border-t border-outline-variant">
              <div>
                <h3 className="font-headline-md text-2xl text-primary mb-1">Privacy & Data</h3>
                <p className="font-body-md text-secondary text-xs">Control your data and privacy settings.</p>
              </div>
              <div className="space-y-6">
                <div className="pt-2 flex justify-between items-center">
                  <p className="font-body-md text-secondary text-xs">
                    Permanently delete your customer account and personal profile.
                  </p>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="font-label-caps text-xs uppercase text-red-600 underline underline-offset-4 hover:opacity-70 transition-opacity cursor-pointer font-bold"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Shared Master Newsletter */}
        <div className="mt-section-gap">
          <NewsletterSection />
        </div>
      </main>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white border border-outline-variant p-8 w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-6 right-6 text-secondary hover:text-primary cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-headline-md text-2xl mb-6 text-primary">Change Password</h2>

            {passwordSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                  Current Password
                </label>
                <input
                  required
                  type={showPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border-0 border-b border-outline-variant py-2 bg-transparent text-sm focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                  New Password
                </label>
                <input
                  required
                  type={showPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border-0 border-b border-outline-variant py-2 bg-transparent text-sm focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-label-caps text-[10px] uppercase text-secondary mb-1">
                  Confirm New Password
                </label>
                <input
                  required
                  type={showPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-0 border-b border-outline-variant py-2 bg-transparent text-sm focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPass}
                    onChange={(e) => setShowPass(e.target.checked)}
                    className="w-4 h-4 text-primary border-outline-variant focus:ring-0 rounded-none cursor-pointer"
                  />
                  <span className="font-body-md text-xs text-secondary">Show Password</span>
                </label>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 bg-primary text-white py-3.5 font-button text-xs uppercase tracking-widest hover:bg-black/90 cursor-pointer shadow-md font-semibold disabled:opacity-50"
                >
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="border border-outline-variant text-secondary px-6 py-3.5 font-button text-xs uppercase tracking-widest hover:text-primary cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white border border-outline-variant p-8 w-full max-w-md shadow-2xl relative text-center space-y-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-6 right-6 text-secondary hover:text-primary cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-headline-md text-2xl text-red-600">Delete Account?</h2>
            <p className="font-body-md text-secondary text-xs leading-relaxed">
              This action is permanent and cannot be undone. All your order history, saved addresses, and preferences will be wiped.
            </p>
            <div className="pt-4 flex gap-4">
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 text-white py-3.5 font-button text-xs uppercase tracking-widest hover:bg-red-700 cursor-pointer font-bold shadow-md"
              >
                Permanently Delete
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="border border-outline-variant text-secondary px-6 py-3.5 font-button text-xs uppercase tracking-widest hover:text-primary cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shared Master Footer */}
      <Footer />
    </div>
  );
};

export default AccountSettingsPage;
