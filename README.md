# MONOLITH — Luxury Fashion E-Commerce Platform

A full-stack luxury fashion e-commerce platform with a premium customer website, powerful admin dashboard, REST API backend, MongoDB database, authentication, product management, order management, analytics, and responsive UI.

---

## 🌐 Live Demo

### Customer Website

https://monolithh.duckdns.org

### Admin Dashboard

https://clothing-ecommerce-qoo7.onrender.com

### Backend API

https://monolith-backend-yzxj.onrender.com/api

---

## 📂 GitHub Repository

https://github.com/NamanJain19/Clothing-Ecommerce

---

## ✨ Overview

MONOLITH is a full-stack luxury fashion e-commerce application designed with a premium, modern, editorial-style interface.

The platform is built with separate applications for customers and administrators, connected through a centralized REST API and MongoDB database.

### Main Applications

- 🛍️ Customer E-Commerce Website
- 👨‍💼 Admin Dashboard
- ⚙️ Backend REST API

---

## 🚀 Key Features

### 🛍️ Customer Website

- Premium luxury fashion interface
- Responsive mobile, tablet, and desktop design
- Product browsing
- Product search
- Category-based browsing
- Collection pages
- Product details
- Product image galleries
- Wishlist
- Shopping cart
- Checkout
- Address management
- Payment method management
- Order placement
- Order history
- Order tracking
- Returns
- Notifications
- Customer account dashboard
- Help & Support
- Account settings
- Google authentication
- Apple authentication
- OTP verification
- Password reset
- AI Stylist interface

---

### 👨‍💼 Admin Dashboard

- Admin authentication
- Dashboard analytics
- Product management
- Category management
- Collection management
- Banner management
- Website section management
- Order management
- Customer management
- Coupon management
- Review management
- Inventory management
- Returns management
- Notification management
- Brand management
- Size guide management
- Gift card management
- Shipping management
- Email template management
- Website settings
- Reports and analytics

---

### 🔐 Authentication

- Email and password authentication
- Google authentication
- Apple authentication
- OTP verification
- Forgot password
- Secure password reset tokens
- Token expiration
- Protected customer routes
- Protected admin routes

---

### 📊 Analytics & Management

The admin dashboard provides management and reporting capabilities for:

- Products
- Orders
- Customers
- Revenue
- Inventory
- Reviews
- Returns
- Coupons
- Website content

---

## 🧠 AI Stylist

MONOLITH includes an AI Stylist interface designed for natural-language shopping interactions.

Example customer queries include:

- "Men's new arrivals"
- "Women's new dresses"
- "shirts under ₹3000"
- "Where is my order?"

The AI Stylist is designed to work with product, category, pricing, and order-related information.

---

## 🏗️ Project Architecture

The project is organized into three main applications.

<pre>
MONOLITH
│
├── website/
│   ├── Customer E-Commerce Website
│   ├── React
│   ├── TypeScript
│   └── Vite
│
├── admin/
│   ├── Admin Dashboard
│   ├── React
│   ├── TypeScript
│   └── Vite
│
├── backend/
│   ├── REST API
│   ├── Node.js
│   ├── Express.js
│   └── MongoDB / Mongoose
│
├── docker-compose.yml
└── README.md
</pre>

---

## 🛠️ Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Bootstrap
- Framer Motion
- GSAP
- Three.js
- React Three Fiber
- Lenis

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- REST API
- Authentication
- Resend
- Twilio integration

### DevOps & Deployment

- Git
- GitHub
- Docker
- Docker Compose
- Linux
- Render
- MongoDB Atlas

---

## 🗄️ Database

MONOLITH uses MongoDB with Mongoose for persistent application data.

### Major Collections

<pre>
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
websitsections
</pre>

The database stores customer, product, order, inventory, website, and administrative information.

---

## 🔌 Backend API

The backend provides REST APIs used by both the customer website and admin dashboard.

### API Structure

<pre>
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
</pre>

---

## 🔄 Application Flow

### Customer Application

<pre>
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
</pre>

### Admin Application

<pre>
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
</pre>

Both the customer website and admin dashboard communicate with the same backend API and database.

---

## 👤 Customer Flow

<pre>
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
</pre>

---

## 👨‍💼 Admin Flow

<pre>
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
</pre>

---

## 📱 Responsive Design

The customer website is designed for multiple screen sizes.

### Supported Layouts

- 📱 Mobile
- 📲 Tablet
- 💻 Laptop
- 🖥️ Desktop
- 🖥️ Large Desktop

### Responsive Features

- Adaptive navigation
- Mobile-friendly product grids
- Responsive product details
- Responsive checkout
- Mobile account navigation
- Responsive modals
- Touch-friendly controls
- Responsive AI Stylist
- Responsive banners
- Responsive editorial sections

---

## 🎨 Design System

MONOLITH follows a premium luxury fashion design direction.

### Design Principles

- Minimal
- Editorial
- Premium
- Luxury
- Modern
- Clean typography
- Large visual imagery
- Subtle animations
- Responsive layouts

### Typography

The project uses Google Fonts with a combination of modern sans-serif and editorial serif typography.

---

## 🔑 Environment Variables

Environment variables are required for the backend, website, and admin applications.

### Backend Environment Variables

<pre>
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
</pre>

### Website Environment Variables

<pre>
VITE_API_URL=
</pre>

### Admin Environment Variables

<pre>
VITE_API_URL=
</pre>

> Never commit `.env` files, API keys, passwords, database credentials, or other secrets to GitHub.

---

## 💻 Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/NamanJain19/Clothing-Ecommerce.git
cd Clothing-Ecommerce
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend:

```text
http://localhost:3011
```

### 3. Website Setup

Open another terminal:

```bash
cd website
npm install
npm run dev
```

Website:

```text
http://localhost:3008
```

### 4. Admin Setup

Open another terminal:

```bash
cd admin
npm install
npm run dev
```

Admin Dashboard:

```text
http://localhost:3009
```

---

## 🐳 Docker

The project includes Docker Compose configuration.

### Start Services

```bash
docker compose up -d
```

### Rebuild Services

```bash
docker compose build
```

### Stop Services

```bash
docker compose down
```

---

## ☁️ Production Deployment

The project is deployed using Render with MongoDB Atlas as the cloud database.

### Production Architecture

<pre>
Customer
   │
   ▼
monolithh.duckdns.org
   │
   ▼
Backend API
   │
   ▼
MongoDB Atlas


Administrator
   │
   ▼
Admin Dashboard
   │
   ▼
Backend API
   │
   ▼
MongoDB Atlas
</pre>

### Production Services

| Service | Platform |
|---|---|
| Customer Website | Render |
| Admin Dashboard | Render |
| Backend API | Render |
| Database | MongoDB Atlas |
| Domain | DuckDNS |

---

## 📸 Screenshots

Screenshots can be added here to showcase the customer website and admin dashboard.

### Customer Website

Recommended screenshots:

- Homepage
- Product Listing
- Product Details
- Shopping Cart
- Checkout
- Account Dashboard
- Order Tracking
- AI Stylist

### Admin Dashboard

Recommended screenshots:

- Admin Dashboard
- Product Management
- Order Management
- Customer Management
- Inventory
- Analytics
- Website Management

---

## 🔒 Security

The application follows common security practices including:

- Environment variables for sensitive configuration
- Password hashing
- Protected API routes
- Authentication middleware
- Secure password reset tokens
- Token expiration
- Single-use password reset tokens
- CORS configuration
- Server-side validation
- No credentials committed to source control

---

## 📈 Project Highlights

- Full-stack e-commerce architecture
- Separate customer and admin applications
- RESTful backend API
- MongoDB database integration
- Authentication system
- Product management
- Inventory management
- Order management
- Customer management
- Review management
- Returns management
- Analytics and reporting
- Website content management
- Responsive UI/UX
- Cloud deployment
- Docker support
- AI-powered shopping interface

---

## 🎯 Project Goals

MONOLITH was built to demonstrate how a modern fashion e-commerce platform can be structured using a scalable full-stack architecture.

The project focuses on:

- Premium UI/UX
- Real-world e-commerce workflows
- Centralized API architecture
- Database-driven content
- Admin-controlled data
- Responsive application design
- Authentication and account management
- Cloud deployment
- Modern frontend technologies

---

## 📚 Skills Demonstrated

This project demonstrates practical experience in:

- Full-stack web development
- React development
- TypeScript
- Node.js
- Express.js
- REST API development
- MongoDB
- Mongoose
- Authentication
- E-commerce architecture
- Admin dashboard development
- Database integration
- Responsive UI/UX
- API integration
- Docker
- Cloud deployment
- MongoDB Atlas
- Render
- AI-assisted application features

---

## 👨‍💻 Author

### Naman Jain

BCA Student | Full-Stack Developer | AI Automation & Cloud Enthusiast

**GitHub:**  
https://github.com/NamanJain19

**Portfolio:**  
https://personal-portfolio-git-main-namanjain19s-projects.vercel.app

---

## 📄 License

This project is created for educational, portfolio, and demonstration purposes.

---

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

## 🔗 Project Links

| Resource | Link |
|---|---|
| 🌐 Website | https://monolithh.duckdns.org |
| 👨‍💼 Admin | https://clothing-ecommerce-qoo7.onrender.com |
| ⚙️ Backend API | https://monolith-backend-yzxj.onrender.com/api |
| 📂 GitHub | https://github.com/NamanJain19/Clothing-Ecommerce |
