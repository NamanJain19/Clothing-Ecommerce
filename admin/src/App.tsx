import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages (1-4)
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { OtpPage } from './pages/auth/OtpPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Dashboard & Products (5-9)
import { AdminDashboardPage } from './pages/dashboard/AdminDashboardPage';
import { ProductsPage } from './pages/products/ProductsPage';
import { AddProductPage } from './pages/products/AddProductPage';
import { EditProductPage } from './pages/products/EditProductPage';
import { ProductDetailsPage } from './pages/products/ProductDetailsPage';

// Core Operations & Commerce (10-17)
import { CategoriesPage } from './pages/categories/CategoriesPage';
import { CollectionsPage } from './pages/collections/CollectionsPage';
import { OrdersPage } from './pages/orders/OrdersPage';
import { CustomersPage } from './pages/customers/CustomersPage';
import { InventoryPage } from './pages/inventory/InventoryPage';
import { CouponsPage } from './pages/coupons/CouponsPage';
import { ReviewsPage } from './pages/reviews/ReviewsPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';

// CMS & Storefront (18-20)
import { WebsiteContentPage } from './pages/content/WebsiteContentPage';
import { AddWebsiteSectionPage } from './pages/content/AddWebsiteSectionPage';
import { BannerManagementPage } from './pages/banners/BannerManagementPage';

// Infrastructure, Logistics & Governance (21-24)
import { ShippingPage } from './pages/shipping/ShippingPage';
import { PaymentsPage } from './pages/payments/PaymentsPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { SettingsPage } from './pages/settings/SettingsPage';

// Extended Store Operations (25-31)
import { ReturnsPage } from './pages/returns/ReturnsPage';
import { BrandsPage } from './pages/brands/BrandsPage';
import { SizeGuidePage } from './pages/sizeguide/SizeGuidePage';
import { GiftCardsPage } from './pages/giftcards/GiftCardsPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { NavigationPage } from './pages/navigation/NavigationPage';
import { PagesManagementPage } from './pages/cms/PagesManagementPage';

// Email Templates & Audience (32-35)
import { EmailTemplatesPage } from './pages/email/EmailTemplatesPage';
import { CreateEmailTemplatePage } from './pages/email/CreateEmailTemplatePage';
import { EditEmailTemplatePage } from './pages/email/EditEmailTemplatePage';
import { NewsletterPage } from './pages/newsletter/NewsletterPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Pages (1-4) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/admin/otp" element={<OtpPage />} />
        <Route path="/admin/reset-password" element={<ResetPasswordPage />} />

        {/* Dashboard & Products (5-9) */}
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/products" element={<ProductsPage />} />
        <Route path="/admin/products/new" element={<AddProductPage />} />
        <Route path="/admin/products/:id/edit" element={<EditProductPage />} />
        <Route path="/admin/products/:id" element={<ProductDetailsPage />} />

        {/* Core Operations & Commerce (10-17) */}
        <Route path="/admin/categories" element={<CategoriesPage />} />
        <Route path="/admin/collections" element={<CollectionsPage />} />
        <Route path="/admin/orders" element={<OrdersPage />} />
        <Route path="/admin/customers" element={<CustomersPage />} />
        <Route path="/admin/inventory" element={<InventoryPage />} />
        <Route path="/admin/coupons" element={<CouponsPage />} />
        <Route path="/admin/reviews" element={<ReviewsPage />} />
        <Route path="/admin/analytics" element={<AnalyticsPage />} />

        {/* CMS & Storefront (18-20) */}
        <Route path="/admin/website-content" element={<WebsiteContentPage />} />
        <Route path="/admin/website-content/new" element={<AddWebsiteSectionPage />} />
        <Route path="/admin/banners" element={<BannerManagementPage />} />

        {/* Infrastructure, Logistics & Governance (21-24) */}
        <Route path="/admin/shipping" element={<ShippingPage />} />
        <Route path="/admin/payments" element={<PaymentsPage />} />
        <Route path="/admin/notifications" element={<NotificationsPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />

        {/* Extended Store Operations (25-31) */}
        <Route path="/admin/returns" element={<ReturnsPage />} />
        <Route path="/admin/brands" element={<BrandsPage />} />
        <Route path="/admin/size-guide" element={<SizeGuidePage />} />
        <Route path="/admin/gift-cards" element={<GiftCardsPage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="/admin/navigation" element={<NavigationPage />} />
        <Route path="/admin/pages" element={<PagesManagementPage />} />

        {/* Email Templates & Audience (32-35) */}
        <Route path="/admin/email-templates" element={<EmailTemplatesPage />} />
        <Route path="/admin/email-templates/new" element={<CreateEmailTemplatePage />} />
        <Route path="/admin/email-templates/:id/edit" element={<EditEmailTemplatePage />} />
        <Route path="/admin/newsletter" element={<NewsletterPage />} />

        {/* Default Redirects */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
