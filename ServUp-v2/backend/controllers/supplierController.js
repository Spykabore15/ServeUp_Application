const { Supplier, Product } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all suppliers with pagination, search, and filters
 */
const getAllSuppliers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = ''
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
        { contact_person: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Fetch suppliers with pagination
    const { count, rows: suppliers } = await Supplier.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name'],
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']],
      distinct: true
    });

    res.json({
      success: true,
      data: suppliers,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching suppliers',
      error: error.message
    });
  }
};

/**
 * Get a single supplier by ID
 */
const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findByPk(id, {
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'quantity', 'unit']
        }
      ]
    });

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    res.json({
      success: true,
      data: supplier
    });
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching supplier',
      error: error.message
    });
  }
};

/**
 * Create a new supplier
 */
const createSupplier = async (req, res) => {
  try {
    const {
      name,
      contact_person,
      email,
      phone,
      address,
      notes
    } = req.body;

    // Check if supplier with same email already exists
    if (email) {
      const existingSupplier = await Supplier.findOne({ where: { email } });
      if (existingSupplier) {
        return res.status(400).json({
          success: false,
          message: 'A supplier with this email already exists'
        });
      }
    }

    const supplier = await Supplier.create({
      name,
      contact_person,
      email,
      phone,
      address,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      data: supplier
    });
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating supplier',
      error: error.message
    });
  }
};

/**
 * Update a supplier
 */
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      contact_person,
      email,
      phone,
      address,
      notes
    } = req.body;

    const supplier = await Supplier.findByPk(id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== supplier.email) {
      const existingSupplier = await Supplier.findOne({ where: { email } });
      if (existingSupplier) {
        return res.status(400).json({
          success: false,
          message: 'A supplier with this email already exists'
        });
      }
    }

    await supplier.update({
      name,
      contact_person,
      email,
      phone,
      address,
      notes
    });

    res.json({
      success: true,
      message: 'Supplier updated successfully',
      data: supplier
    });
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating supplier',
      error: error.message
    });
  }
};

/**
 * Delete a supplier
 */
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findByPk(id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    // Check if supplier has products
    const productsCount = await Product.count({ where: { supplier_id: id } });
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete supplier. ${productsCount} product(s) are linked to this supplier. Please reassign or delete them first.`
      });
    }

    await supplier.destroy();

    res.json({
      success: true,
      message: 'Supplier deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting supplier',
      error: error.message
    });
  }
};

/**
 * Get supplier statistics
 */
const getSupplierStats = async (req, res) => {
  try {
    const totalSuppliers = await Supplier.count();
    
    // Count suppliers with products
    const suppliersWithProducts = await Supplier.count({
      include: [{
        model: Product,
        as: 'products',
        required: true
      }]
    });

    res.json({
      success: true,
      data: {
        total: totalSuppliers,
        active: suppliersWithProducts,
        inactive: totalSuppliers - suppliersWithProducts
      }
    });
  } catch (error) {
    console.error('Error fetching supplier stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching supplier statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierStats
};




