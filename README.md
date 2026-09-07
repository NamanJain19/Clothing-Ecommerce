# MONOLITH — Luxury Fashion E-Commerce Platform

A full-stack luxury fashion e-commerce platform built with a modern customer-facing website, admin dashboard, REST API backend, MongoDB database, authentication, product management, order management, responsive UI, and AI-powered shopping assistance.

MONOLITH is designed as a complete end-to-end e-commerce system rather than a static frontend demo. The customer website, admin panel, backend API, and database work together using real production data.

---

## 🚀 Live Demo

### Customer Website
https://monolithh.duckdns.org

### Backend API
https://monolith-backend-yzxj.onrender.com

### Admin Dashboard
https://clothing-ecommerce-qoo7.onrender.com

---

## ✨ Project Overview

MONOLITH is a premium luxury fashion e-commerce platform focused on delivering a modern editorial shopping experience while providing a complete backend and administration system.

The platform includes:

- Luxury fashion storefront
- Product catalog
- Categories and collections
- New arrivals
- Sale section
- Product details
- Search and filtering
- Wishlist
- Shopping cart
- Checkout
- Order management
- Order tracking
- Customer accounts
- Saved addresses
- Payment methods
- Notifications
- Reviews
- Coupons
- Gift cards
- Authentication
- Forgot Password / Reset Password
- Google authentication
- Apple authentication
- OTP verification
- AI Stylist
- Admin dashboard
- Product management
- Category management
- Collection management
- Banner management
- Customer management
- Order management
- Inventory management
- Returns management
- Review management
- Analytics and reports
- Website/CMS management
- Responsive mobile and tablet experience

---

## 🛍️ Customer Website

The customer-facing website provides a premium editorial shopping experience inspired by modern luxury fashion platforms.

### Main Features

- Premium luxury UI/UX
- Responsive design
- Editorial homepage
- Featured categories
- New arrivals
- Featured collections
- Sale collections
- Product search
- Product filtering
- Product sorting
- Product details
- Product image galleries
- Size selection
- Wishlist
- Quick view
- Shopping cart
- Checkout
- Order confirmation
- Order tracking
- Customer dashboard
- Saved addresses
- Payment methods
- Notifications
- Help & Support
- FAQ
- Shipping policy
- Return & refund policy
- Privacy policy
- Terms & conditions
- About MONOLITH
- Contact page

---

## 🤖 AI Stylist

MONOLITH includes an AI-powered shopping assistant designed to help customers discover products and navigate the platform using natural language.

Example queries include:

- "Show me shirts under ₹3000"
- "Men's new arrivals"
- "Women's new dresses"
- "Show me something for men under ₹5000"
- "Products on sale"
- "Where is my order?"

The AI Stylist is designed to work with the existing product and customer/order data instead of relying on hardcoded demo products.

---

## 🔐 Authentication

The platform includes a complete authentication system.

### Supported Authentication Features

- Email/password authentication
- Google authentication
- Apple authentication
- OTP verification
- Forgot Password
- Reset Password
- Secure reset tokens
- Customer account management
- Session-based authenticated requests

### Password Reset Flow

The password reset system generates a secure reset token and sends a reset link to the customer's email.

Example:

https://monolithh.duckdns.org/reset-password?token=TOKEN

Reset tokens are securely generated and handled by the backend.

---

## 🛒 Shopping & Checkout

Customers can:

1. Browse products
2. Search products
3. Filter products
4. View product details
5. Select product sizes
6. Add products to wishlist
7. Add products to cart
8. Update cart quantities
9. Apply coupons
10. Select or add an address
11. Select a payment method
12. Place an order
13. View order confirmation
14. Track orders
15. View previous orders

---

## 📦 Order Management

Customers can view:

- Order history
- Order details
- Order status
- Delivery progress
- Purchased products
- Order totals
- Shipping information
- Tracking information

The Admin Dashboard provides management capabilities for orders and order statuses.

---

## ❤️ Wishlist

Customers can save products to their wishlist and manage their saved products from their account.

Wishlist functionality is connected to the backend rather than using temporary frontend-only data.

---

## 👤 Customer Account

The customer account area includes:

- Dashboard
- My Orders
- Saved Addresses
- Payment Methods
- Notifications
- Account Settings
- Help & Support
- Track Order
- Logout

The account navigation has been optimized for mobile and tablet devices so that navigation options remain accessible without requiring horizontal page scrolling.

---

## 🖥️ Admin Dashboard

MONOLITH includes a separate web-based administration dashboard.

The Admin Dashboard is connected to the same production backend and database used by the customer website.

### Admin Features

- Dashboard analytics
- Product management
- Category management
- Collection management
- Banner management
- Website/CMS management
- Customer management
- Order management
- Inventory management
- Returns management
- Reviews management
- Coupons management
- Gift cards management
- Notifications management
- Brand management
- Size guide management
- Shipping management
- Email templates
- Reports
- Analytics
- Website settings

Admin changes are designed to persist through the backend and MongoDB database.

---

## 🗄️ Backend

The backend is built using Node.js and Express.js.

### Backend Responsibilities

- Authentication
- User management
- Product APIs
- Category APIs
- Collection APIs
- Cart APIs
- Wishlist APIs
- Order APIs
- Payment APIs
- Review APIs
- Coupon APIs
- Gift card APIs
- Notification APIs
- Admin APIs
- Analytics APIs
- Reports
- Password reset
- Email services
- OTP services
- AI-related services

---

## 🗃️ Database

MONOLITH uses MongoDB with Mongoose.

The production database contains real application data including:

- Users
- Products
- Categories
- Collections
- Orders
- Addresses
- Carts
- Wishlists
- Reviews
- Coupons
- Gift Cards
- Notifications
- Payments
- Returns
- Brands
- Size Guides
- Website Sections
- Banners
- Settings

The Admin Dashboard and Customer Website operate against the same backend/database architecture.

---

## 📱 Responsive Design

The website has been audited and optimized across:

### Mobile

- 320px
- 360px
- 375px
- 390px
- 414px
- 430px

### Tablet

- 768px
- 820px
- 834px
- 1024px

### Desktop

- 1280px+
- 1440px+

Responsive improvements include:

- Mobile navigation
- Responsive product grids
- Responsive account pages
- Responsive checkout
- Responsive cart
- Responsive order pages
- Responsive modals
- Responsive OTP verification
- Responsive AI Stylist widget
- Responsive banners
- Responsive forms
- Touch-friendly controls
- Mobile-friendly account navigation
- Horizontal overflow prevention

The responsive audit achieved zero page-level horizontal overflow across the tested viewport sizes.

---

## 🎨 Design System

MONOLITH follows a premium luxury editorial visual language.

Design characteristics include:

- Minimal luxury aesthetic
- Editorial layouts
- Large typography
- Clean spacing
- Monochromatic visual direction
- Premium product presentation
- Responsive layouts
- Subtle animations
- Modern navigation
- Glassmorphism-inspired UI accents where appropriate

The desktop design was preserved while responsive behavior was improved for smaller screens.

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- GSAP
- Three.js
- React Three Fiber

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication

- Email/Password
- Google OAuth
- Apple Authentication
- OTP Verification

### AI & Automation

- AI Stylist
- Natural-language product discovery
- AI-powered shopping assistance

### DevOps & Deployment

- Docker
- Git
- GitHub
- Linux
- Nginx
- Render

---

## 📁 Project Structure

```text
Clothing-Ecommerce/
│
├── admin/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── middleware/
│   ├── server.js
│   └── package.json
│
├── website/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── data/
│   │   └── styles/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
└── README.md
