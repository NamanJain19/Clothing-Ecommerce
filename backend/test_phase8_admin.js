const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { generateToken } = require('./src/utils/jwt');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Category = require('./src/models/Category');
const Collection = require('./src/models/Collection');
const Order = require('./src/models/Order');
const Coupon = require('./src/models/Coupon');
const Review = require('./src/models/Review');
const Banner = require('./src/models/Banner');
const WebsiteSection = require('./src/models/WebsiteSection');
const Notification = require('./src/models/Notification');
const Return = require('./src/models/Return');
const Brand = require('./src/models/Brand');
const SizeGuide = require('./src/models/SizeGuide');
const GiftCard = require('./src/models/GiftCard');

dotenv.config();

const BASE_URL = 'http://localhost:3011';

async function runTests() {
  console.log('--- STARTING PHASE 8 ADMIN API TESTS ---');
  
  // 1. Setup DB Connection & Test Users
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/luxury-fashion';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB for test verification.');

  // Create or retrieve test users for each role
  const testUsers = {
    admin: { email: 'admin_test@luxefashion.com', role: 'admin', firstName: 'Admin', lastName: 'User', password: 'Password123!' },
    manager: { email: 'manager_test@luxefashion.com', role: 'manager', firstName: 'Manager', lastName: 'User', password: 'Password123!' },
    staff: { email: 'staff_test@luxefashion.com', role: 'staff', firstName: 'Staff', lastName: 'User', password: 'Password123!' },
    customer: { email: 'customer_test@luxefashion.com', role: 'customer', firstName: 'Customer', lastName: 'User', password: 'Password123!' }
  };

  const tokens = {};
  const userDocs = {};

  for (const [key, userData] of Object.entries(testUsers)) {
    let u = await User.findOne({ email: userData.email });
    if (!u) {
      u = await User.create(userData);
    } else {
      u.role = userData.role;
      u.isActive = true;
      await u.save();
    }
    userDocs[key] = u;
    tokens[key] = generateToken({ userId: u._id, email: u.email, role: u.role });
  }

  let passed = 0;
  let failed = 0;

  async function testApi(name, fn) {
    try {
      await fn();
      console.log(`\x1b[32m✔ [PASS]\x1b[0m ${name}`);
      passed++;
    } catch (err) {
      console.error(`\x1b[31m✖ [FAIL]\x1b[0m ${name}: ${err.message}`);
      failed++;
    }
  }

  // Helper fetch with auth
  async function request(path, options = {}) {
    const url = `${BASE_URL}${path}`;
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (options.token) {
      headers.Authorization = `Bearer ${options.token}`;
    }
    const res = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    const json = await res.json().catch(() => ({}));
    return { status: res.status, data: json };
  }

  // 1. Admin Authentication
  await testApi('Admin Auth (/api/admin/me)', async () => {
    const res = await request('/api/admin/me', { token: tokens.admin });
    if (res.status !== 200 || !res.data.success || res.data.data.email !== testUsers.admin.email) {
      throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
    }
    if (res.data.data.password) throw new Error('Password should not be exposed in /me');
  });

  // 2. Customer Access Denied (403)
  await testApi('Customer Access Denied on Admin API (403 Forbidden)', async () => {
    const res = await request('/api/admin/dashboard', { token: tokens.customer });
    if (res.status !== 403) {
      throw new Error(`Expected 403 Forbidden for customer, got ${res.status}`);
    }
  });

  // 3. Unauthenticated Access Denied (401)
  await testApi('Unauthenticated Access Denied (401 Unauthorized)', async () => {
    const res = await request('/api/admin/dashboard');
    if (res.status !== 401) {
      throw new Error(`Expected 401 Unauthorized, got ${res.status}`);
    }
  });

  // 4. Admin Dashboard Metrics
  await testApi('Admin Dashboard Analytics (/api/admin/dashboard)', async () => {
    const res = await request('/api/admin/dashboard', { token: tokens.admin });
    if (res.status !== 200 || !res.data.success) throw new Error(`Failed: ${JSON.stringify(res.data)}`);
    const d = res.data.data;
    if (typeof d.totalProducts !== 'number' || typeof d.totalOrders !== 'number') {
      throw new Error('Dashboard stats missing core numerical metrics');
    }
  });

  // 5. Analytics Routes (Sales, Orders, Customers, Products)
  await testApi('Admin Analytics Endpoints', async () => {
    const salesRes = await request('/api/admin/analytics/sales', { token: tokens.manager });
    const ordersRes = await request('/api/admin/analytics/orders', { token: tokens.admin });
    const custRes = await request('/api/admin/analytics/customers', { token: tokens.admin });
    const prodRes = await request('/api/admin/analytics/products', { token: tokens.manager });

    if (salesRes.status !== 200 || ordersRes.status !== 200 || custRes.status !== 200 || prodRes.status !== 200) {
      throw new Error('One or more analytics endpoints failed');
    }
  });

  // 6. Reports Routes (Sales, Orders, Customers, Inventory, Returns)
  await testApi('Admin Reports Endpoints', async () => {
    const sales = await request('/api/admin/reports/sales', { token: tokens.manager });
    const orders = await request('/api/admin/reports/orders', { token: tokens.admin });
    const customers = await request('/api/admin/reports/customers', { token: tokens.manager });
    const inventory = await request('/api/admin/reports/inventory', { token: tokens.admin });
    const returns = await request('/api/admin/reports/returns', { token: tokens.manager });

    if (sales.status !== 200 || orders.status !== 200 || customers.status !== 200 || inventory.status !== 200 || returns.status !== 200) {
      throw new Error('One or more reports endpoints failed');
    }
  });

  // 7. Product Management CRUD
  let createdProductId = null;
  let testCategoryId = null;

  const testCat = await Category.findOne();
  if (testCat) {
    testCategoryId = testCat._id;
  } else {
    const c = await Category.create({ name: 'Admin Test Cat', slug: 'admin-test-cat' });
    testCategoryId = c._id;
  }

  await testApi('Admin Product CRUD', async () => {
    const testProdName = 'Admin Luxury Silk Shirt ' + Date.now();
    // Create product
    const createRes = await request('/api/admin/products', {
      method: 'POST',
      token: tokens.manager,
      body: {
        name: testProdName,
        sku: 'ADM-SLK-' + Date.now(),
        price: 280,
        category: testCategoryId,
        stock: 25,
        brand: 'LUXE TEST',
        gender: 'women',
        description: 'Silk shirt description'
      }
    });

    if (createRes.status !== 201 || !createRes.data.success) {
      throw new Error(`Create product failed: ${JSON.stringify(createRes.data)}`);
    }

    createdProductId = createRes.data.data._id;

    // Get Single Product
    const getRes = await request(`/api/admin/products/${createdProductId}`, { token: tokens.staff });
    if (getRes.status !== 200 || getRes.data.data.name !== testProdName) {
      throw new Error(`Get product failed: ${JSON.stringify(getRes.data)}`);
    }

    // Update Product
    const updateRes = await request(`/api/admin/products/${createdProductId}`, {
      method: 'PUT',
      token: tokens.manager,
      body: { price: 320, isFeatured: true }
    });
    if (updateRes.status !== 200 || updateRes.data.data.price !== 320) {
      throw new Error(`Update product failed: ${JSON.stringify(updateRes.data)}`);
    }

    // Staff cannot delete product (403)
    const staffDelRes = await request(`/api/admin/products/${createdProductId}`, {
      method: 'DELETE',
      token: tokens.staff
    });
    if (staffDelRes.status !== 403) throw new Error('Staff should not be able to delete product');

    // Admin soft-delete Product
    const delRes = await request(`/api/admin/products/${createdProductId}`, {
      method: 'DELETE',
      token: tokens.admin
    });
    if (delRes.status !== 200 || delRes.data.data.isActive !== false) {
      throw new Error(`Delete product failed: ${JSON.stringify(delRes.data)}`);
    }
  });

  // 8. Category CRUD
  let createdCatId = null;
  await testApi('Admin Category CRUD', async () => {
    const slug = 'admin-cat-' + Date.now();
    const createRes = await request('/api/admin/categories', {
      method: 'POST',
      token: tokens.manager,
      body: { name: 'Admin Test Category ' + Date.now(), slug, description: 'Test cat desc' }
    });
    if (createRes.status !== 201) throw new Error(`Category creation failed: ${JSON.stringify(createRes.data)}`);
    createdCatId = createRes.data.data._id;

    const getRes = await request(`/api/admin/categories/${createdCatId}`, { token: tokens.staff });
    if (getRes.status !== 200) throw new Error('Category get failed');

    const updateRes = await request(`/api/admin/categories/${createdCatId}`, {
      method: 'PUT',
      token: tokens.manager,
      body: { description: 'Updated category desc' }
    });
    if (updateRes.status !== 200) throw new Error('Category update failed');
  });

  // 9. Collection CRUD
  let createdColId = null;
  await testApi('Admin Collection CRUD', async () => {
    const slug = 'admin-col-' + Date.now();
    const createRes = await request('/api/admin/collections', {
      method: 'POST',
      token: tokens.manager,
      body: { name: 'Admin Test Col ' + Date.now(), slug, description: 'Test col desc' }
    });
    if (createRes.status !== 201) throw new Error(`Collection creation failed: ${JSON.stringify(createRes.data)}`);
    createdColId = createRes.data.data._id;

    const getRes = await request(`/api/admin/collections/${createdColId}`, { token: tokens.staff });
    if (getRes.status !== 200) throw new Error('Collection get failed');
  });

  // 10. Order Management (Fetch, Status Update, Cancellation)
  await testApi('Admin Order Management', async () => {
    // Create a mock order if none exists
    let testOrder = await Order.findOne();
    if (!testOrder) {
      testOrder = await Order.create({
        orderNumber: 'ORD-TEST-' + Date.now(),
        user: userDocs.customer._id,
        items: [{
          product: createdProductId,
          name: 'Admin Luxury Silk Shirt',
          price: 320,
          quantity: 1,
          image: 'https://example.com/test.jpg'
        }],
        shippingAddress: { fullName: 'Test Buyer', addressLine1: '123 Fashion Ave', city: 'Milan', state: 'Lombardy', postalCode: '20121', country: 'IT', phone: '+39021234567' },
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'pending',
        subtotal: 320,
        tax: 0,
        shippingFee: 0,
        discount: 0,
        total: 320,
        orderStatus: 'pending'
      });
    }

    const listRes = await request('/api/admin/orders', { token: tokens.staff });
    if (listRes.status !== 200 || !Array.isArray(listRes.data.data)) throw new Error('List orders failed');

    const detailRes = await request(`/api/admin/orders/${testOrder._id}`, { token: tokens.staff });
    if (detailRes.status !== 200 || !detailRes.data.data.timeline) throw new Error('Order details with timeline failed');

    const statusRes = await request(`/api/admin/orders/${testOrder._id}/status`, {
      method: 'PATCH',
      token: tokens.staff,
      body: { status: 'confirmed', notes: 'Confirmed by staff' }
    });
    if (statusRes.status !== 200 || statusRes.data.data.orderStatus !== 'confirmed') {
      throw new Error(`Order status update failed: ${JSON.stringify(statusRes.data)}`);
    }
  });

  // 11. Customer Management
  await testApi('Admin Customer Management', async () => {
    const listRes = await request('/api/admin/customers', { token: tokens.staff });
    if (listRes.status !== 200 || !Array.isArray(listRes.data.data)) throw new Error('List customers failed');

    const detailRes = await request(`/api/admin/customers/${userDocs.customer._id}`, { token: tokens.staff });
    if (detailRes.status !== 200 || !detailRes.data.data.customer) throw new Error('Customer detail failed');

    // Update customer status (manager)
    const updateRes = await request(`/api/admin/customers/${userDocs.customer._id}/status`, {
      method: 'PATCH',
      token: tokens.manager,
      body: { isActive: true }
    });
    if (updateRes.status !== 200) throw new Error('Customer status update failed');
  });

  // 12. Inventory Management
  await testApi('Admin Inventory Management', async () => {
    const invRes = await request('/api/admin/inventory', { token: tokens.staff });
    if (invRes.status !== 200) throw new Error('Inventory overview failed');

    const lowStockRes = await request('/api/admin/inventory/low-stock?threshold=10', { token: tokens.staff });
    if (lowStockRes.status !== 200) throw new Error('Low stock inventory failed');

    const patchStock = await request(`/api/admin/inventory/${createdProductId}`, {
      method: 'PATCH',
      token: tokens.staff,
      body: { stock: 50 }
    });
    if (patchStock.status !== 200 || patchStock.data.data.stock !== 50) {
      throw new Error('Update inventory stock failed');
    }

    // Test negative stock prevention
    const negStock = await request(`/api/admin/inventory/${createdProductId}`, {
      method: 'PATCH',
      token: tokens.staff,
      body: { stock: -5 }
    });
    if (negStock.status !== 400) throw new Error('Negative stock should be rejected with 400');
  });

  // 13. Coupon Management
  let couponId = null;
  await testApi('Admin Coupon Management', async () => {
    const code = 'ADMINTEST' + Date.now().toString().slice(-4);
    const createRes = await request('/api/admin/coupons', {
      method: 'POST',
      token: tokens.manager,
      body: {
        code,
        discountType: 'percentage',
        discountValue: 15,
        minPurchaseAmount: 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000 * 30)
      }
    });
    if (createRes.status !== 201) throw new Error(`Coupon create failed: ${JSON.stringify(createRes.data)}`);
    couponId = createRes.data.data._id;

    // Staff cannot view coupons (restricted to manager & admin)
    const staffRes = await request('/api/admin/coupons', { token: tokens.staff });
    if (staffRes.status !== 403) throw new Error('Staff should not access coupons');

    const getRes = await request(`/api/admin/coupons/${couponId}`, { token: tokens.manager });
    if (getRes.status !== 200) throw new Error('Coupon get failed');
  });

  // 14. Review Moderation & Rating Recalculation
  await testApi('Admin Review Moderation', async () => {
    let orderForReview = await Order.findOne({ user: userDocs.customer._id });
    if (!orderForReview) {
      const addr = { fullName: 'Buyer', addressLine1: 'Street', city: 'City', state: 'State', postalCode: '12345', country: 'IT', phone: '123' };
      orderForReview = await Order.create({
        orderNumber: 'ORD-REV-' + Date.now(),
        user: userDocs.customer._id,
        items: [{ product: createdProductId, name: 'Admin Luxury Silk Shirt', price: 320, quantity: 1 }],
        shippingAddress: addr,
        billingAddress: addr,
        subtotal: 320,
        total: 320,
        orderStatus: 'delivered'
      });
    }
    const rev = await Review.create({
      user: userDocs.customer._id,
      product: createdProductId,
      order: orderForReview._id,
      rating: 5,
      title: 'Flawless Silk Shirt',
      comment: 'Absolutely spectacular quality and finish!',
      isApproved: false
    });

    const listRes = await request('/api/admin/reviews', { token: tokens.staff });
    if (listRes.status !== 200) throw new Error('Reviews list failed');

    const approveRes = await request(`/api/admin/reviews/${rev._id}/approve`, {
      method: 'PATCH',
      token: tokens.staff
    });
    if (approveRes.status !== 200 || !approveRes.data.data.isApproved) {
      throw new Error('Review approval failed');
    }

    const rejectRes = await request(`/api/admin/reviews/${rev._id}/reject`, {
      method: 'PATCH',
      token: tokens.staff
    });
    if (rejectRes.status !== 200 || rejectRes.data.data.isApproved !== false) {
      throw new Error('Review rejection failed');
    }
  });

  // 15. Banners Management
  let bannerId = null;
  await testApi('Admin Banners Management', async () => {
    const createRes = await request('/api/admin/banners', {
      method: 'POST',
      token: tokens.manager,
      body: {
        title: 'Spring Haute Couture',
        image: 'https://example.com/banner.jpg',
        position: 'hero'
      }
    });
    if (createRes.status !== 201) throw new Error(`Banner create failed: ${JSON.stringify(createRes.data)}`);
    bannerId = createRes.data.data._id;

    const getRes = await request(`/api/admin/banners/${bannerId}`, { token: tokens.manager });
    if (getRes.status !== 200) throw new Error('Banner getById failed');

    const delRes = await request(`/api/admin/banners/${bannerId}`, {
      method: 'DELETE',
      token: tokens.admin
    });
    if (delRes.status !== 200) throw new Error('Banner delete failed');
  });

  // 16. Website Content Management
  let sectionId = null;
  await testApi('Admin Website Content Management', async () => {
    const sectionName = 'admin_sec_' + Date.now();
    const createRes = await request('/api/admin/website-content', {
      method: 'POST',
      token: tokens.manager,
      body: {
        sectionName,
        title: 'Hero Highlights',
        subtitle: 'Curated by master tailors'
      }
    });
    if (createRes.status !== 201) throw new Error(`Website section create failed: ${JSON.stringify(createRes.data)}`);
    sectionId = createRes.data.data._id;

    const getRes = await request(`/api/admin/website-content/${sectionId}`, { token: tokens.manager });
    if (getRes.status !== 200) throw new Error('Website section getById failed');
  });

  // 17. Notifications Management
  await testApi('Admin Notifications Management', async () => {
    const notif = await Notification.create({
      title: 'Low Stock Alert',
      message: 'Product stock is running low',
      type: 'inventory'
    });

    const listRes = await request('/api/admin/notifications', { token: tokens.staff });
    if (listRes.status !== 200) throw new Error('List notifications failed');

    const readRes = await request(`/api/admin/notifications/${notif._id}/read`, {
      method: 'PATCH',
      token: tokens.staff
    });
    if (readRes.status !== 200 || !readRes.data.data.isRead) throw new Error('Mark notification read failed');
  });

  // 18. Returns & Exchanges Management
  let returnId = null;
  await testApi('Admin Returns & Exchanges Management', async () => {
    const testOrder = await Order.findOne();
    const ret = await Return.create({
      returnNumber: 'RET-' + Date.now(),
      order: testOrder._id,
      user: userDocs.customer._id,
      items: [{
        product: createdProductId,
        name: 'Admin Luxury Silk Shirt',
        quantity: 1,
        price: 320,
        reason: 'Size too large'
      }],
      status: 'requested'
    });
    returnId = ret._id;

    const listRes = await request('/api/admin/returns', { token: tokens.staff });
    if (listRes.status !== 200) throw new Error('Returns list failed');

    const getRes = await request(`/api/admin/returns/${returnId}`, { token: tokens.staff });
    if (getRes.status !== 200) throw new Error('Return detail failed');

    const appRes = await request(`/api/admin/returns/${returnId}/approve`, {
      method: 'PATCH',
      token: tokens.staff
    });
    if (appRes.status !== 200 || appRes.data.data.status !== 'approved') throw new Error('Approve return failed');
  });

  // 19. Brands Management
  let brandId = null;
  await testApi('Admin Brands Management', async () => {
    const brandName = 'Maison Luxe ' + Date.now();
    const createRes = await request('/api/admin/brands', {
      method: 'POST',
      token: tokens.manager,
      body: { name: brandName, description: 'Artisanal atelier' }
    });
    if (createRes.status !== 201) throw new Error(`Brand creation failed: ${JSON.stringify(createRes.data)}`);
    brandId = createRes.data.data._id;

    const getRes = await request(`/api/admin/brands/${brandId}`, { token: tokens.manager });
    if (getRes.status !== 200) throw new Error('Brand getById failed');
  });

  // 20. Size Guides Management
  let sizeGuideId = null;
  await testApi('Admin Size Guides Management', async () => {
    const createRes = await request('/api/admin/size-guides', {
      method: 'POST',
      token: tokens.manager,
      body: {
        name: 'Men Blazers Guide ' + Date.now(),
        gender: 'men',
        measurements: [{ size: '48R', chest: '38-40', waist: '32-34' }]
      }
    });
    if (createRes.status !== 201) throw new Error(`Size guide creation failed: ${JSON.stringify(createRes.data)}`);
    sizeGuideId = createRes.data.data._id;

    const getRes = await request(`/api/admin/size-guides/${sizeGuideId}`, { token: tokens.manager });
    if (getRes.status !== 200) throw new Error('Size guide getById failed');
  });

  // 21. Gift Cards Management
  let giftCardId = null;
  await testApi('Admin Gift Cards Management', async () => {
    const code = 'GIFT' + Date.now().toString().slice(-6);
    const createRes = await request('/api/admin/gift-cards', {
      method: 'POST',
      token: tokens.manager,
      body: {
        code,
        name: 'Luxury Holiday Gift Card',
        amount: 500,
        remainingBalance: 500,
        recipient: { name: 'Sophia Loren', email: 'sophia@luxurydemo.com' }
      }
    });
    if (createRes.status !== 201) throw new Error(`Gift card create failed: ${JSON.stringify(createRes.data)}`);
    giftCardId = createRes.data.data._id;

    const getRes = await request(`/api/admin/gift-cards/${giftCardId}`, { token: tokens.manager });
    if (getRes.status !== 200) throw new Error('Gift card getById failed');
  });

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
