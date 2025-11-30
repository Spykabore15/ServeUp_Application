const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// GET /api/categories - Get all categories (authentication required)
router.get('/', 
  authMiddleware,
  categoryController.getAllCategories
);

// GET /api/categories/:id - Get single category (authentication required)
router.get('/:id', 
  authMiddleware,
  categoryController.getCategoryById
);

// POST /api/categories - Create new category (stock managers and admins only)
router.post('/', 
  authMiddleware,
  roleMiddleware(['admin', 'responsable_stocks']),
  categoryController.createCategory
);

// PUT /api/categories/:id - Update category (stock managers and admins only)
router.put('/:id',
  authMiddleware,
  roleMiddleware(['admin', 'responsable_stocks']),
  categoryController.updateCategory
);

// DELETE /api/categories/:id - Delete category (admins only)
router.delete('/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  categoryController.deleteCategory
);

module.exports = router;


