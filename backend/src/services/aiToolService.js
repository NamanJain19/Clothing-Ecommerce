const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Collection = require('../models/Collection');
const Order = require('../models/Order');

/**
 * AI Tool Service: Real-time Live Database Tool Execution Engine
 * Queries MongoDB directly on demand — NO static cached catalogs, NO retraining required.
 */
const aiToolService = {
  /**
   * Search active products in MongoDB based on query criteria
   */
  searchCatalog: async (params = {}) => {
    try {
      const {
        query,
        category,
        collection,
        gender,
        minPrice,
        maxPrice,
        onSale,
        newArrival,
        size,
        color,
        limit = 6,
      } = params;

      const filter = { isActive: true };

      // Text query on name, description, tags, brand, sku
      if (query && typeof query === 'string' && query.trim()) {
        const cleanQuery = query.trim();
        const searchRegex = new RegExp(cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        filter.$or = [
          { name: searchRegex },
          { brand: searchRegex },
          { description: searchRegex },
          { shortDescription: searchRegex },
          { tags: searchRegex },
          { sku: searchRegex },
          { material: searchRegex },
        ];
      }

      // Gender filter
      if (gender && ['men', 'women', 'unisex', 'kids', 'all'].includes(gender.toLowerCase())) {
        filter.gender = gender.toLowerCase() === 'all' ? { $in: ['men', 'women', 'unisex', 'kids'] } : gender.toLowerCase();
      }

      // Category lookup
      if (category && typeof category === 'string' && category.trim()) {
        const catDoc = await Category.findOne({
          $or: [
            { slug: category.toLowerCase().trim() },
            { name: new RegExp(`^${category.trim()}$`, 'i') },
          ],
        });
        if (catDoc) {
          filter.category = catDoc._id;
        }
      }

      // Collection lookup
      if (collection && typeof collection === 'string' && collection.trim()) {
        const colDoc = await Collection.findOne({
          $or: [
            { slug: collection.toLowerCase().trim() },
            { name: new RegExp(`^${collection.trim()}$`, 'i') },
          ],
        });
        if (colDoc) {
          filter.collection = colDoc._id;
        }
      }

      // Price bounds
      if (minPrice !== undefined || maxPrice !== undefined) {
        filter.price = {};
        if (minPrice !== undefined && !isNaN(Number(minPrice))) filter.price.$gte = Number(minPrice);
        if (maxPrice !== undefined && !isNaN(Number(maxPrice))) filter.price.$lte = Number(maxPrice);
      }

      // Badges
      if (onSale === true) filter.isSale = true;
      if (newArrival === true) filter.isNewArrival = true;

      // Sizes / Colors
      if (size && typeof size === 'string') {
        filter.sizes = new RegExp(size.trim(), 'i');
      }
      if (color && typeof color === 'string') {
        filter.colors = new RegExp(color.trim(), 'i');
      }

      const products = await Product.find(filter)
        .select('_id name slug sku brand price compareAtPrice discountPercentage stock images thumbnail category gender sizes colors material isSale isNewArrival')
        .populate('category', 'name slug')
        .populate('collection', 'name slug')
        .sort({ isFeatured: -1, isNewArrival: -1, createdAt: -1 })
        .limit(Math.min(10, Math.max(1, Number(limit) || 6)))
        .lean();

      return products.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        brand: p.brand || 'MONOLITH Atelier',
        price: p.price,
        compareAtPrice: p.compareAtPrice || 0,
        discountPercentage: p.discountPercentage || 0,
        stock: p.stock,
        inStock: p.stock > 0,
        images: p.images || [],
        thumbnail: p.thumbnail || p.images?.[0] || '',
        category: p.category?.name || 'Luxury Fashion',
        gender: p.gender || 'unisex',
        sizes: p.sizes || [],
        colors: p.colors || [],
        material: p.material || '',
        isSale: p.isSale || false,
        isNewArrival: p.isNewArrival || false,
        productUrl: `/product/${p._id.toString()}`,
      }));
    } catch (err) {
      console.error('[AI Tool] searchCatalog error:', err.message);
      return [];
    }
  },

  /**
   * Fetch full details for a single product by name, slug, SKU, or ID
   */
  getProductDetails: async (identifier) => {
    if (!identifier || typeof identifier !== 'string') return null;

    try {
      const clean = identifier.trim();
      const queries = [{ slug: clean.toLowerCase() }, { sku: clean.toUpperCase() }];

      if (mongoose.Types.ObjectId.isValid(clean)) {
        queries.push({ _id: clean });
      }

      // Also try regex name match
      queries.push({ name: new RegExp(`^${clean}$`, 'i') });
      queries.push({ name: new RegExp(clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') });

      const product = await Product.findOne({
        isActive: true,
        $or: queries,
      })
        .select('_id name slug sku brand description shortDescription price compareAtPrice discountPercentage stock images thumbnail category collection gender sizes colors material careInstructions isSale isNewArrival')
        .populate('category', 'name slug')
        .populate('collection', 'name slug')
        .lean();

      if (!product) return null;

      return {
        id: product._id.toString(),
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        brand: product.brand || 'MONOLITH Atelier',
        description: product.description || product.shortDescription || '',
        price: product.price,
        compareAtPrice: product.compareAtPrice || 0,
        discountPercentage: product.discountPercentage || 0,
        stock: product.stock,
        inStock: product.stock > 0,
        images: product.images || [],
        thumbnail: product.thumbnail || product.images?.[0] || '',
        category: product.category?.name || 'Luxury Collection',
        collection: product.collection?.name || 'Bespoke Atelier',
        gender: product.gender,
        sizes: product.sizes || [],
        colors: product.colors || [],
        material: product.material || '',
        careInstructions: product.careInstructions || '',
        isSale: product.isSale || false,
        isNewArrival: product.isNewArrival || false,
        productUrl: `/product/${product._id.toString()}`,
      };
    } catch (err) {
      console.error('[AI Tool] getProductDetails error:', err.message);
      return null;
    }
  },

  /**
   * Fetch real orders for an authenticated customer
   * Strictly enforces user ownership
   */
  getCustomerOrders: async (userId, specificOrderQuery = null) => {
    if (!userId) {
      return {
        authenticated: false,
        message: 'Please sign in to your MONOLITH account to view your live orders and tracking status.',
        orders: [],
      };
    }

    try {
      const filter = { user: userId };

      if (specificOrderQuery && typeof specificOrderQuery === 'string' && specificOrderQuery.trim()) {
        const cleanOrder = specificOrderQuery.trim().toUpperCase();
        filter.$or = [
          { orderNumber: cleanOrder },
          { orderNumber: new RegExp(cleanOrder, 'i') },
        ];
      }

      const orders = await Order.find(filter)
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      if (!orders || orders.length === 0) {
        return {
          authenticated: true,
          message: specificOrderQuery
            ? `No order found matching ${specificOrderQuery} under your account.`
            : 'You have no active orders in your MONOLITH account ledger.',
          orders: [],
        };
      }

      const formattedOrders = orders.map((o) => ({
        id: o._id.toString(),
        orderNumber: o.orderNumber,
        createdAt: o.createdAt,
        total: o.total,
        orderStatus: o.orderStatus,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        shippingMethod: o.shippingMethod,
        carrier: o.carrier || 'Blue Dart Express (Air Priority)',
        awbNumber: o.awbNumber || 'In Dispatch Queue',
        shipmentStatus: o.shipmentStatus || 'manifested',
        estimatedDeliveryDate: o.estimatedDeliveryDate,
        shippingAddress: {
          city: o.shippingAddress?.city,
          state: o.shippingAddress?.state,
          postalCode: o.shippingAddress?.postalCode,
        },
        itemsCount: o.items?.length || 0,
        items: (o.items || []).map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          image: i.image,
        })),
        trackingUrl: `/track-order?orderNumber=${o.orderNumber}`,
      }));

      return {
        authenticated: true,
        orders: formattedOrders,
      };
    } catch (err) {
      console.error('[AI Tool] getCustomerOrders error:', err.message);
      return {
        authenticated: true,
        message: 'Order status query encountered an error. Please try again.',
        orders: [],
      };
    }
  },

  /**
   * Verified Atelier Store Policies & FAQ Knowledge
   */
  getStorePolicies: (topic = 'all') => {
    const policies = {
      shipping: {
        title: 'Complimentary White-Glove Shipping',
        details:
          'MONOLITH provides complimentary insured white-glove express courier shipping across India via Blue Dart Express and Delhivery Luxury Logistics. Metro deliveries arrive in 2–3 business days; standard domestic orders arrive within 3–5 business days.',
      },
      returns: {
        title: '14-Day Bespoke Returns & Exchanges',
        details:
          'We offer a 14-day hassle-free return and size exchange policy for unworn garments with original security tags and luxury packaging intact. Custom bespoke monogrammed items are final sale.',
      },
      payments: {
        title: 'Encrypted & Flexible Payment Options',
        details:
          'We accept UPI (Google Pay, PhonePe, Paytm), Visa, Mastercard, American Express, Net Banking, and Cash on Delivery (COD). All online transactions are protected with 256-bit bank-grade encryption via Razorpay.',
      },
      sizing: {
        title: 'Architectural European Fit Standards',
        details:
          'Our garments are tailored to European sizing standards:\n• Size S (38 EU) — Chest 38 in | Waist 32 in\n• Size M (40 EU) — Chest 40 in | Waist 34 in\n• Size L (42 EU) — Chest 42 in | Waist 36 in\n• Size XL (44 EU) — Chest 44 in | Waist 38 in\n\nFor tailored suits and overcoats, we advise matching your exact chest measurement.',
      },
      authenticity: {
        title: 'Bespoke Atelier Authenticity Guarantee',
        details:
          'Every MONOLITH piece is handcrafted with certified natural fabrics (Italian Virgin Wool, Cashmere, Mulberry Silk, Egyptian Giza Cotton) and accompanied by an individualized certificate of provenance.',
      },
    };

    const t = topic.toLowerCase().trim();
    if (policies[t]) return policies[t];
    return policies;
  },

  /**
   * Fetch active categories and collections from MongoDB
   */
  getCategoriesAndCollections: async () => {
    try {
      const [categories, collections] = await Promise.all([
        Category.find({ isActive: true }).select('name slug description').lean(),
        Collection.find({ isActive: true }).select('name slug description season year').lean(),
      ]);

      return {
        categories: categories.map((c) => ({ name: c.name, slug: c.slug })),
        collections: collections.map((col) => ({ name: col.name, slug: col.slug, season: col.season })),
      };
    } catch (err) {
      return { categories: [], collections: [] };
    }
  },
};

module.exports = aiToolService;
