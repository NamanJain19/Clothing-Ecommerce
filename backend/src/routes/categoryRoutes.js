const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { validateCategory } = require('../validators/catalogValidator');

router.route('/')
  .get(getCategories)
  .post(validateCategory, createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(validateCategory, updateCategory)
  .delete(deleteCategory);

module.exports = router;
