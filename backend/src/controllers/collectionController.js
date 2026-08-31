const Collection = require('../models/Collection');
const slugify = require('../utils/slugify');

/**
 * @desc    Get all collections
 * @route   GET /api/collections
 * @access  Public
 */
const getCollections = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }

    if (req.query.isFeatured !== undefined) {
      filter.isFeatured = req.query.isFeatured === 'true';
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const collections = await Collection.find(filter)
      .populate('category', 'name slug')
      .sort({ sortOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: collections.length,
      data: collections
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single collection by ID or slug
 * @route   GET /api/collections/:id
 * @access  Public
 */
const getCollectionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let collection;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      collection = await Collection.findById(id).populate('category', 'name slug');
    } else {
      collection = await Collection.findOne({ slug: id.toLowerCase() }).populate('category', 'name slug');
    }

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    res.status(200).json({
      success: true,
      data: collection
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new collection
 * @route   POST /api/collections
 * @access  Public (Admin in future)
 */
const createCollection = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      description,
      image,
      bannerImage,
      category,
      isFeatured,
      isActive,
      sortOrder
    } = req.body;

    const generatedSlug = slug ? slugify(slug) : slugify(name);

    const existing = await Collection.findOne({ slug: generatedSlug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Collection with this slug already exists'
      });
    }

    const collection = await Collection.create({
      name: name.trim(),
      slug: generatedSlug,
      description: description ? description.trim() : '',
      image: image || '',
      bannerImage: bannerImage || '',
      category: category || null,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0
    });

    res.status(201).json({
      success: true,
      message: 'Collection created successfully',
      data: collection
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Collection with this slug already exists'
      });
    }
    next(error);
  }
};

/**
 * @desc    Update collection by ID
 * @route   PUT /api/collections/:id
 * @access  Public (Admin in future)
 */
const updateCollection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      image,
      bannerImage,
      category,
      isFeatured,
      isActive,
      sortOrder
    } = req.body;

    let collection = await Collection.findById(id);
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    if (name) collection.name = name.trim();
    if (slug) collection.slug = slugify(slug);
    else if (name && !slug) collection.slug = slugify(name);

    if (description !== undefined) collection.description = description.trim();
    if (image !== undefined) collection.image = image;
    if (bannerImage !== undefined) collection.bannerImage = bannerImage;
    if (category !== undefined) collection.category = category || null;
    if (isFeatured !== undefined) collection.isFeatured = isFeatured;
    if (isActive !== undefined) collection.isActive = isActive;
    if (sortOrder !== undefined) collection.sortOrder = sortOrder;

    await collection.save();

    res.status(200).json({
      success: true,
      message: 'Collection updated successfully',
      data: collection
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Collection with this slug already exists'
      });
    }
    next(error);
  }
};

/**
 * @desc    Delete (soft delete) collection by ID
 * @route   DELETE /api/collections/:id
 * @access  Public (Admin in future)
 */
const deleteCollection = async (req, res, next) => {
  try {
    const { id } = req.params;

    const collection = await Collection.findById(id);
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    collection.isActive = false;
    await collection.save();

    res.status(200).json({
      success: true,
      message: 'Collection deactivated successfully',
      data: collection
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection
};
