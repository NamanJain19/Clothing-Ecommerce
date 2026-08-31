const express = require('express');
const router = express.Router();
const {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection
} = require('../controllers/collectionController');
const { validateCollection } = require('../validators/catalogValidator');

router.route('/')
  .get(getCollections)
  .post(validateCollection, createCollection);

router.route('/:id')
  .get(getCollectionById)
  .put(validateCollection, updateCollection)
  .delete(deleteCollection);

module.exports = router;
