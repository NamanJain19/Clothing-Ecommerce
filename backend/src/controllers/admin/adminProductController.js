const Product = require('../../models/Product');
const Category = require('../../models/Category');
const Collection = require('../../models/Collection');
const slugify = require('../../utils/slugify');
const mongoose = require('mongoose');

/**
 * @desc    Get all products for admin with full filters and status
 * @route   GET /api/admin/products
 * @access  Private (Admin / Manager)
 */
const getAdminProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      collection,
      brand,
      gender,
      isActive,
      isFeatured,
      isNewArrival,
      isSale,
      minStock,
      maxStock,
      minPrice,
      maxPrice,
      sort
    } = req.query;

    const query = {};

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { sku: searchRegex },
        { brand: searchRegex },
        { tags: searchRegex }
      ];
    }

    if (category) {
      query.category = mongoose.Types.ObjectId.isValid(category)
        ? category
        : (await Category.findOne({ slug: category.toLowerCase() }))?._id;
    }

    if (collection) {
      query.collection = mongoose.Types.ObjectId.isValid(collection)
        ? collection
        : (await Collection.findOne({ slug: collection.toLowerCase() }))?._id;
    }

    if (brand) query.brand = new RegExp(`^${brand.trim()}$`, 'i');
    if (gender) query.gender = gender.toLowerCase();
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
    if (isNewArrival !== undefined) query.isNewArrival = isNewArrival === 'true';
    if (isSale !== undefined) query.isSale = isSale === 'true';

    if (minStock !== undefined || maxStock !== undefined) {
      query.stock = {};
      if (minStock !== undefined) query.stock.$gte = Number(minStock);
      if (maxStock !== undefined) query.stock.$lte = Number(maxStock);
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'stock_asc') sortOption = { stock: 1 };
    else if (sort === 'stock_desc') sortOption = { stock: -1 };
    else if (sort === 'name_asc') sortOption = { name: 1 };
    else if (sort === 'rating_desc') sortOption = { rating: -1 };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .populate('collection', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      data: products,
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
 * @desc    Get single product details for admin
 * @route   GET /api/admin/products/:id
 * @access  Private (Admin / Manager)
 */
const getAdminProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const product = await Product.findById(id)
      .populate('category', 'name slug')
      .populate('collection', 'name slug');

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
 * @desc    Create product from admin
 * @route   POST /api/admin/products
 * @access  Private (Admin / Manager)
 */
const createAdminProduct = async (req, res, next) => {
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
      stock: stock !== undefined ? stock : 0,
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

    const populated = await Product.findById(product._id)
      .populate('category', 'name slug')
      .populate('collection', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populated
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `Duplicate key error on field: ${JSON.stringify(error.keyValue)}`
      });
    }
    next(error);
  }
};

/**
 * @desc    Update product from admin
 * @route   PUT /api/admin/products/:id
 * @access  Private (Admin / Manager)
 */
const updateAdminProduct = async (req, res, next) => {
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

    const populated = await Product.findById(product._id)
      .populate('category', 'name slug')
      .populate('collection', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: populated
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate key error on product unique field'
      });
    }
    next(error);
  }
};

/**
 * @desc    Delete (soft delete) product from admin
 * @route   DELETE /api/admin/products/:id
 * @access  Private (Admin)
 */
const deleteAdminProduct = async (req, res, next) => {
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
  getAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct
};
