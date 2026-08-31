import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { WomensPage } from '../pages/WomensPage';
import { MensPage } from '../pages/MensPage';
import { KidsPage } from '../pages/KidsPage';
import { CollectionsPage } from '../pages/CollectionsPage';
import { CategoriesPage } from '../pages/CategoriesPage';
import { AccessoriesPage } from '../pages/AccessoriesPage';
import { NewArrivalsPage } from '../pages/NewArrivalsPage';
import { SalePage } from '../pages/SalePage';
import { SearchPage } from '../pages/SearchPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { WishlistPage } from '../pages/WishlistPage';
import { ShoppingCartPage } from '../pages/ShoppingCartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderSuccessPage } from '../pages/OrderSuccessPage';
import { TrackOrderPage } from '../pages/TrackOrderPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { OtpVerificationPage } from '../pages/OtpVerificationPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { DashboardPage } from '../pages/DashboardPage';
import { MyOrdersPage } from '../pages/MyOrdersPage';
import { OrderDetailsPage } from '../pages/OrderDetailsPage';
import { SavedAddressesPage } from '../pages/SavedAddressesPage';
import { PaymentMethodsPage } from '../pages/PaymentMethodsPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { AccountSettingsPage } from '../pages/AccountSettingsPage';
import { HelpSupportPage } from '../pages/HelpSupportPage';
import { ContactUsPage } from '../pages/ContactUsPage';
import { AboutUsPage } from '../pages/AboutUsPage';
import { PrivacyPolicyPage } from '../pages/PrivacyPolicyPage';
import { TermsConditionsPage } from '../pages/TermsConditionsPage';
import { ShippingPolicyPage } from '../pages/ShippingPolicyPage';
import { ReturnRefundPolicyPage } from '../pages/ReturnRefundPolicyPage';
import { FaqPage } from '../pages/FaqPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { VirtualTryOnPage } from '../pages/VirtualTryOnPage';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/try-on" element={<VirtualTryOnPage />} />
      <Route path="/virtual-fitting-room" element={<VirtualTryOnPage />} />
      <Route path="/collections" element={<CollectionsPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/women" element={<WomensPage />} />
      <Route path="/men" element={<MensPage />} />
      <Route path="/kids" element={<KidsPage />} />
      <Route path="/accessories" element={<AccessoriesPage />} />
      <Route path="/new-arrivals" element={<NewArrivalsPage />} />
      <Route path="/sale" element={<SalePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/product-details" element={<ProductDetailsPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/cart" element={<ShoppingCartPage />} />
      <Route path="/shopping-cart" element={<ShoppingCartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/track-order" element={<TrackOrderPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/create-account" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/otp-verification" element={<OtpVerificationPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      {/* Protected Customer Account Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/account-dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
      <Route path="/order-details" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
      <Route path="/saved-addresses" element={<ProtectedRoute><SavedAddressesPage /></ProtectedRoute>} />
      <Route path="/payment-methods" element={<ProtectedRoute><PaymentMethodsPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/account-settings" element={<ProtectedRoute><AccountSettingsPage /></ProtectedRoute>} />
      
      <Route path="/help-support" element={<HelpSupportPage />} />
      <Route path="/contact-us" element={<ContactUsPage />} />
      <Route path="/contact" element={<ContactUsPage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-conditions" element={<TermsConditionsPage />} />
      <Route path="/terms" element={<TermsConditionsPage />} />
      <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
      <Route path="/return-refund-policy" element={<ReturnRefundPolicyPage />} />
      <Route path="/returns" element={<ReturnRefundPolicyPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
