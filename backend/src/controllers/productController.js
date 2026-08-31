const Product = require('../models/Product');
const Category = require('../models/Category');
const Collection = require('../models/Collection');
const slugify = require('../utils/slugify');
const mongoose = require('mongoose');

/**
 * @desc    Get products with search, filtering, sorting, pagination
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      collection,
      gender,
      brand,
      minPrice,
      maxPrice,
      size,
      color,
      isFeatured,
      isNewArrival,
      isSale,
      isActive,
      sort
    } = req.query;

    const query = {};

    // Active status filter (default: active only)
    if (isActive !== undefined) {
      if (isActive !== 'all') {
        query.isActive = isActive === 'true';
      }
    } else {
      query.isActive = true;
    }

    // Search by name, description, brand, tags, sku (case-insensitive)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { shortDescription: searchRegex },
        { brand: searchRegex },
        { tags: searchRegex },
        { sku: searchRegex }
      ];
    }

    // Category filter (supports ObjectId or slug)
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ slug: category.toLowerCase() });
        if (foundCategory) {
          query.category = foundCategory._id;
        } else {
          // No matching category found, force empty result
          query.category = new mongoose.Types.ObjectId();
        }
      }
    }

    // Collection filter (supports ObjectId or slug)
    if (collection) {
      if (mongoose.Types.ObjectId.isValid(collection)) {
        query.collection = collection;
      } else {
        const foundCollection = await Collection.findOne({ slug: collection.toLowerCase() });
        if (foundCollection) {
          query.collection = foundCollection._id;
        } else {
          query.collection = new mongoose.Types.ObjectId();
        }
      }
    }

    // Gender filter
    if (gender) {
      query.gender = gender.toLowerCase();
    }

    // Brand filter
    if (brand) {
      query.brand = new RegExp(`^${brand.trim()}$`, 'i');
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Size filter (matches sizes array or variants.size)
    if (size) {
      const sizeRegex = new RegExp(`^${size.trim()}$`, 'i');
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { sizes: sizeRegex },
          { 'variants.size': sizeRegex }
        ]
      });
    }

    // Color filter (matches colors array or variants.color)
    if (color) {
      const colorRegex = new RegExp(`^${color.trim()}$`, 'i');
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { colors: colorRegex },
          { 'variants.color': colorRegex }
        ]
      });
    }

    // Boolean flags
    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }
    if (isNewArrival !== undefined) {
      query.isNewArrival = isNewArrival === 'true';
    }
    if (isSale !== undefined) {
      query.isSale = isSale === 'true';
    }

    // Sorting logic
    let sortOption = { createdAt: -1 }; // Default: Newest first

    switch (sort) {
      case 'price_asc':
      case 'price_low':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
      case 'price_high':
        sortOption = { price: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'highest_rated':
      case 'rating':
        sortOption = { rating: -1, reviewCount: -1 };
        break;
      case 'most_popular':
      case 'popular':
        sortOption = { reviewCount: -1, rating: -1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    // Pagination calculations
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    // Execute queries
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .populate('collection', 'name slug isFeatured')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const product = await Product.findById(id)
      .populate('category', 'name slug description image')
      .populate('collection', 'name slug description image bannerImage');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by slug
 * @route   GET /api/products/slug/:slug
 * @access  Public
 */
const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug: slug.toLowerCase() })
      .populate('category', 'name slug description image')
      .populate('collection', 'name slug description image bannerImage');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Public (Admin in future)
 */
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      description,
      shortDescription,
      brand,
      category,
      collection,
      gender,
      price,
      compareAtPrice,
      sku,
      images,
      thumbnail,
      colors,
      sizes,
      variants,
      stock,
      isFeatured,
      isNewArrival,
      isSale,
      isActive,
      tags,
      material,
      careInstructions,
      seoTitle,
      seoDescription
    } = req.body;

    const generatedSlug = slug ? slugify(slug) : slugify(name);
    const normalizedSku = sku.trim().toUpperCase();

    // Check duplicate slug
    const existingSlug = await Product.findOne({ slug: generatedSlug });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: 'Product with this slug already exists'
      });
    }

    // Check duplicate SKU
    const existingSku = await Product.findOne({ sku: normalizedSku });
    if (existingSku) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists'
      });
    }

    const product = await Product.create({
      name: name.trim(),
      slug: generatedSlug,
      description: description ? description.trim() : '',
      shortDescription: shortDescription ? shortDescription.trim() : '',
      brand: brand ? brand.trim() : 'LUXE',
      category,
      collection: collection || null,
      gender: gender || 'unisex',
      price,
      compareAtPrice: compareAtPrice || 0,
      sku: normalizedSku,
      images: images || [],
      thumbnail: thumbnail || '',
      colors: colors || [],
      sizes: sizes || [],
      variants: variants || [],
      stock,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      isNewArrival: isNewArrival !== undefined ? isNewArrival : false,
      isSale: isSale !== undefined ? isSale : false,
      isActive: isActive !== undefined ? isActive : true,
      tags: tags || [],
      material: material ? material.trim() : '',
      careInstructions: careInstructions ? careInstructions.trim() : '',
      seoTitle: seoTitle ? seoTitle.trim() : '',
      seoDescription: seoDescription ? seoDescription.trim() : ''
    });

    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name slug')
      .populate('collection', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populatedProduct
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return res.status(400).json({
        success: false,
        message: `Product with this ${field} already exists`
      });
    }
    next(error);
  }
};

/**
 * @desc    Update product by ID
 * @route   PUT /api/products/:id
 * @access  Public (Admin in future)
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const {
      name,
      slug,
      description,
      shortDescription,
      brand,
      category,
      collection,
      gender,
      price,
      compareAtPrice,
      sku,
      images,
      thumbnail,
      colors,
      sizes,
      variants,
      stock,
      isFeatured,
      isNewArrival,
      isSale,
      isActive,
      tags,
      material,
      careInstructions,
      seoTitle,
      seoDescription
    } = req.body;

    if (name) product.name = name.trim();
    if (slug) product.slug = slugify(slug);
    else if (name && !slug) product.slug = slugify(name);

    if (sku) product.sku = sku.trim().toUpperCase();
    if (description !== undefined) product.description = description.trim();
    if (shortDescription !== undefined) product.shortDescription = shortDescription.trim();
    if (brand !== undefined) product.brand = brand.trim();
    if (category !== undefined) product.category = category;
    if (collection !== undefined) product.collection = collection || null;
    if (gender !== undefined) product.gender = gender;
    if (price !== undefined) product.price = price;
    if (compareAtPrice !== undefined) product.compareAtPrice = compareAtPrice;
    if (images !== undefined) product.images = images;
    if (thumbnail !== undefined) product.thumbnail = thumbnail;
    if (colors !== undefined) product.colors = colors;
    if (sizes !== undefined) product.sizes = sizes;
    if (variants !== undefined) product.variants = variants;
    if (stock !== undefined) product.stock = stock;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (isNewArrival !== undefined) product.isNewArrival = isNewArrival;
    if (isSale !== undefined) product.isSale = isSale;
    if (isActive !== undefined) product.isActive = isActive;
    if (tags !== undefined) product.tags = tags;
    if (material !== undefined) product.material = material.trim();
    if (careInstructions !== undefined) product.careInstructions = careInstructions.trim();
    if (seoTitle !== undefined) product.seoTitle = seoTitle.trim();
    if (seoDescription !== undefined) product.seoDescription = seoDescription.trim();

    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate('category', 'name slug')
      .populate('collection', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return res.status(400).json({
        success: false,
        message: `Product with this ${field} already exists`
      });
    }
    next(error);
  }
};

/**
 * @desc    Delete (soft delete) product by ID
 * @route   DELETE /api/products/:id
 * @access  Public (Admin in future)
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Soft delete
    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product deactivated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
};
