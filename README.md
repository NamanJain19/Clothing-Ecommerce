MONOLITH — Luxury Fashion E-Commerce Platform

A full-stack luxury fashion e-commerce platform featuring a premium customer website, admin dashboard, REST API backend, authentication, product management, order management, analytics, and responsive UI.

🌐 Live Demo

Website: https://monolithh.duckdns.org

Admin Dashboard: https://clothing-ecommerce-qoo7.onrender.com

Backend API: https://monolith-backend-yzxj.onrender.com/api

📂 GitHub Repository

https://github.com/NamanJain19/Clothing-Ecommerce

✨ Overview

MONOLITH is a full-stack luxury fashion e-commerce application designed with a premium, modern, editorial-style interface.

The project contains three major parts:

Customer Website
Admin Dashboard
Backend REST API

The platform uses MongoDB for persistent application data and provides separate interfaces for customers and administrators.

🚀 Key Features
🛍️ Customer Website
Premium luxury fashion UI
Responsive mobile, tablet, and desktop design
Product browsing
Product search
Category-based browsing
Collection pages
Product details
Product images and galleries
Wishlist
Shopping cart
Checkout
Address management
Payment method management
Order placement
Order history
Order tracking
Returns
Notifications
Customer account dashboard
Help & Support
Account settings
Google authentication
Apple authentication
OTP verification
Password reset
AI Stylist interface
👨‍💼 Admin Dashboard
Admin authentication
Dashboard analytics
Product management
Category management
Collection management
Banner management
Website section management
Order management
Customer management
Coupon management
Review management
Inventory management
Returns management
Notification management
Brand management
Size guide management
Gift card management
Shipping management
Email template management
Website settings
Reports and analytics
🔐 Authentication
Email/password authentication
Google authentication
Apple authentication
OTP verification
Forgot password
Secure password reset tokens
Protected customer routes
Protected admin routes
📊 Analytics & Management

The admin dashboard provides management and reporting capabilities for:

Products
Orders
Customers
Revenue
Inventory
Reviews
Returns
Coupons
Website content
🧠 AI Stylist

MONOLITH includes an AI Stylist interface designed to understand natural-language shopping requests.

Example queries include:

"Men's new arrivals"
"Women's new dresses"
"shirts under ₹3000"
"Where is my order?"

The AI Stylist is designed to connect customer queries with relevant product, category, pricing, and order information.

🏗️ Project Architecture

The application is divided into three independent services.

MONOLITH
│
├── website/
│   ├── Customer E-Commerce Website
│   ├── React + TypeScript
│   └── Vite
│
├── admin/
│   ├── Admin Dashboard
│   ├── React + TypeScript
│   └── Vite
│
├── backend/
│   ├── REST API
│   ├── Node.js
│   ├── Express.js
│   └── MongoDB / Mongoose
│
└── docker-compose.yml
🛠️ Technology Stack
Frontend
React
TypeScript
Vite
Tailwind CSS
Bootstrap
Framer Motion
GSAP
Three.js
React Three Fiber
Lenis
Backend
Node.js
Express.js
MongoDB
Mongoose
REST API
JWT / Authentication
Nodemailer / Email Services
Resend
Twilio integration
Development & Deployment
Git
GitHub
Docker
Docker Compose
Linux
Render
MongoDB Atlas
🗄️ Database

The application uses MongoDB with Mongoose for database management.

Major collections include:

users
products
categories
collections
brands
orders
payments
carts
wishlists
reviews
returns
coupons
giftcards
addresses
notifications
banners
settings
sizeguides
websistections

The database stores customer, product, order, inventory, website, and administrative information.

🔌 Backend API

The backend exposes REST APIs used by both the customer website and admin dashboard.

Example API structure:

/api
│
├── /auth
├── /products
├── /categories
├── /collections
├── /orders
├── /users
├── /reviews
├── /coupons
├── /returns
├── /notifications
├── /brands
├── /size-guides
├── /gift-cards
├── /banners
├── /website-sections
└── /admin
📱 Responsive Design

The website is designed to work across:

Mobile
Tablet
Laptop
Desktop
Large desktop screens

Responsive layouts include:

Adaptive navigation
Mobile-friendly product grids
Responsive product details
Responsive checkout
Mobile account navigation
Responsive modals
Touch-friendly controls
Responsive AI Stylist
Responsive banners and editorial sections
🎨 Design System

MONOLITH follows a premium luxury fashion design direction.

Design Principles
Minimal
Editorial
Premium
Luxury
Modern
Clean typography
Large visual imagery
Subtle animations
Responsive layouts
Typography

The project primarily uses Google Fonts with a combination of modern sans-serif and editorial serif typography.

🔑 Environment Variables

Create environment files for the respective services.

Backend
MONGODB_URI=
PORT=
JWT_SECRET=
FRONTEND_URL=
ADMIN_URL=
ALLOWED_ORIGINS=

RESEND_API_KEY=
EMAIL_FROM=
RESET_PASSWORD_URL=

TWILIO_ACCOUNT_SID=
TWILIO_API_KEY_SID=
TWILIO_API_KEY_SECRET=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
TWILIO_MESSAGING_SERVICE_SID=
TWILIO_VERIFY_SERVICE_SID=
Website
VITE_API_URL=
Admin
VITE_API_URL=

Do not commit .env files or API credentials to GitHub.

💻 Local Development
1. Clone Repository
git clone https://github.com/NamanJain19/Clothing-Ecommerce.git
cd Clothing-Ecommerce
2. Install Backend Dependencies
cd backend
npm install
3. Start Backend
npm run dev

Backend runs on:

http://localhost:3011
4. Install Website Dependencies

Open another terminal:

cd website
npm install
npm run dev

Website runs on:

http://localhost:3008
5. Install Admin Dependencies

Open another terminal:

cd admin
npm install
npm run dev

Admin runs on:

http://localhost:3009
🐳 Docker

The project also contains Docker Compose configuration.

docker compose up -d

To rebuild services:

docker compose build

To stop services:

docker compose down
📦 Production Deployment

The project is deployed using Render.

Services
Customer Website
        ↓
monolithh.duckdns.org

Admin Dashboard
        ↓
clothing-ecommerce-qoo7.onrender.com

Backend API
        ↓
monolith-backend-yzxj.onrender.com

MongoDB Atlas is used as the cloud database.

🔄 Application Flow
Customer
   │
   ▼
MONOLITH Website
   │
   ▼
Backend REST API
   │
   ▼
MongoDB Atlas

Admin:

Administrator
      │
      ▼
Admin Dashboard
      │
      ▼
Backend REST API
      │
      ▼
MongoDB Atlas

Both the customer website and admin dashboard communicate with the same backend and database.

👤 Customer Flow
Register / Login
       ↓
Browse Products
       ↓
Search / Categories / Collections
       ↓
Product Details
       ↓
Add to Wishlist / Cart
       ↓
Checkout
       ↓
Place Order
       ↓
Track Order
       ↓
Manage Account
🛠️ Admin Flow
Admin Login
     ↓
Dashboard
     ↓
Manage Products
     ↓
Manage Categories / Collections
     ↓
Manage Orders
     ↓
Manage Customers
     ↓
Manage Inventory
     ↓
Manage Reviews / Returns
     ↓
Analytics & Reports
     ↓
Website Content Management
📸 Screenshots

Screenshots of the customer website and admin dashboard can be added here.

Customer Website

Add screenshots of:

Homepage
Product Listing
Product Details
Shopping Cart
Checkout
Account
Order Tracking
Admin Dashboard

Add screenshots of:

Dashboard
Product Management
Orders
Customers
Analytics
Website Management
🔒 Security

The project follows common application security practices including:

Environment variables for secrets
Password hashing
Protected API routes
Authentication middleware
Secure password reset tokens
Token expiration
Single-use password reset tokens
CORS configuration
Server-side validation
No credentials committed to source control
📈 Project Highlights
Full-stack e-commerce architecture
Separate customer and admin applications
RESTful backend API
MongoDB database integration
Authentication system
Product and inventory management
Order management
Customer management
Analytics and reporting
Responsive design
Cloud deployment
AI-powered shopping interface
Admin-controlled website content
📚 What I Built

This project demonstrates practical experience in:

Full-stack web development
React application development
TypeScript
REST API development
Database design
Authentication
Admin dashboard development
E-commerce workflows
Responsive UI/UX
Cloud deployment
Docker
MongoDB Atlas
API integration
AI-assisted application features
👨‍💻 Author

Naman Jain

BCA Student | Full-Stack Developer | AI Automation & Cloud Enthusiast

GitHub:
https://github.com/NamanJain19

Portfolio:
https://personal-portfolio-git-main-namanjain19s-projects.vercel.app

📄 License

This project is created for educational, portfolio, and demonstration purposes.

⭐ Project

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.
