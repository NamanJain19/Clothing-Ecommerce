const Category = require('../models/Category');
const slugify = require('../utils/slugify');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = async (req, res, next) => {
  try {
    const filter = {};

    // Filter by isActive if provided, otherwise return active by default or all if requested
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }

    if (req.query.parentCategory) {
      filter.parentCategory = req.query.parentCategory === 'null' ? null : req.query.parentCategory;
    }

    const categories = await Category.find(filter)
      .populate('parentCategory', 'name slug')
      .sort({ sortOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single category by ID or slug
 * @route   GET /api/categories/:id
 * @access  Public
 */
const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let category;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(id).populate('parentCategory', 'name slug');
    } else {
      category = await Category.findOne({ slug: id.toLowerCase() }).populate('parentCategory', 'name slug');
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Public (Admin in future)
 */
const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, image, parentCategory, isActive, sortOrder } = req.body;

    const generatedSlug = slug ? slugify(slug) : slugify(name);

    // Check duplicate slug
    const existing = await Category.findOne({ slug: generatedSlug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Category with this slug already exists'
      });
    }

    const category = await Category.create({
      name: name.trim(),
      slug: generatedSlug,
      description: description ? description.trim() : '',
      image: image || '',
      parentCategory: parentCategory || null,
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this slug already exists'
      });
    }
    next(error);
  }
};

/**
 * @desc    Update category by ID
 * @route   PUT /api/categories/:id
 * @access  Public (Admin in future)
 */
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image, parentCategory, isActive, sortOrder } = req.body;

    let category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    if (name) category.name = name.trim();
    if (slug) category.slug = slugify(slug);
    else if (name && !slug) category.slug = slugify(name);

    if (description !== undefined) category.description = description.trim();
    if (image !== undefined) category.image = image;
    if (parentCategory !== undefined) category.parentCategory = parentCategory || null;
    if (isActive !== undefined) category.isActive = isActive;
    if (sortOrder !== undefined) category.sortOrder = sortOrder;

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this slug already exists'
      });
    }
    next(error);
  }
};

/**
 * @desc    Delete (soft delete) category by ID
 * @route   DELETE /api/categories/:id
 * @access  Public (Admin in future)
 */
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    category.isActive = false;
    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category deactivated successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
