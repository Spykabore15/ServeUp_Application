const { Product, Category, Supplier } = require('../models');
const { Op } = require('sequelize');

// Get all products with filters, search, and pagination
const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      category_id,
      supplier_id,
      low_stock = false
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = { is_active: true };

    // Search by name
    if (search) {
      whereClause.name = { [Op.iLike]: `%${search}%` };
    }

    // Filter by category
    if (category_id) {
      whereClause.category_id = category_id;
    }

    // Filter by supplier
    if (supplier_id) {
      whereClause.supplier_id = supplier_id;
    }

    // Filter low stock items
    if (low_stock === 'true') {
      whereClause[Op.and] = [
        { quantity: { [Op.lte]: Product.sequelize.col('threshold') } }
      ];
    }

    // Fetch products with associations
    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Supplier, as: 'supplier', attributes: ['id', 'name', 'contact_person'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    res.json({
      status: 'success',
      data: {
        products,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        { model: Supplier, as: 'supplier' }
      ]
    });

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.json({
      status: 'success',
      data: { product }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category_id,
      quantity,
      unit,
      threshold,
      price_per_unit,
      supplier_id,
      expiration_date,
      sku
    } = req.body;

    // Check if SKU already exists
    if (sku) {
      const existingProduct = await Product.findOne({ where: { sku } });
      if (existingProduct) {
        return res.status(400).json({
          status: 'error',
          message: 'Product with this SKU already exists'
        });
      }
    }

    const product = await Product.create({
      name,
      description,
      category_id,
      quantity: quantity || 0,
      unit: unit || 'units',
      threshold: threshold || 10,
      price_per_unit,
      supplier_id,
      expiration_date,
      sku,
      is_active: true
    });

    // Fetch created product with associations
    const createdProduct = await Product.findByPk(product.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Supplier, as: 'supplier' }
      ]
    });

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: { product: createdProduct }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category_id,
      quantity,
      unit,
      threshold,
      price_per_unit,
      supplier_id,
      expiration_date,
      sku,
      is_active
    } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Check if SKU is being changed and already exists
    if (sku && sku !== product.sku) {
      const existingProduct = await Product.findOne({ where: { sku } });
      if (existingProduct) {
        return res.status(400).json({
          status: 'error',
          message: 'Product with this SKU already exists'
        });
      }
    }

    // Update product
    await product.update({
      name: name || product.name,
      description,
      category_id,
      quantity: quantity !== undefined ? quantity : product.quantity,
      unit: unit || product.unit,
      threshold: threshold !== undefined ? threshold : product.threshold,
      price_per_unit,
      supplier_id,
      expiration_date,
      sku,
      is_active: is_active !== undefined ? is_active : product.is_active
    });

    // Fetch updated product with associations
    const updatedProduct = await Product.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        { model: Supplier, as: 'supplier' }
      ]
    });

    res.json({
      status: 'success',
      message: 'Product updated successfully',
      data: { product: updatedProduct }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Delete product (soft delete)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Soft delete by setting is_active to false
    await product.update({ is_active: false });

    res.json({
      status: 'success',
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

// Get low stock products
const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        is_active: true,
        [Op.and]: [
          { quantity: { [Op.lte]: Product.sequelize.col('threshold') } }
        ]
      },
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Supplier, as: 'supplier', attributes: ['id', 'name', 'contact_person', 'phone', 'email'] }
      ],
      order: [['quantity', 'ASC']]
    });

    res.json({
      status: 'success',
      data: {
        products,
        count: products.length
      }
    });
  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch low stock products',
      error: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts
};

