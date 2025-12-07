const { Employee, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all employees with pagination, search, and filters
 */
const getAllEmployees = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      position = '',
      status = ''
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (position) {
      whereClause.position = { [Op.iLike]: `%${position}%` };
    }

    if (status) {
      whereClause.status = status;
    }

    // Fetch employees with pagination
    const { count, rows: employees } = await Employee.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      distinct: true
    });

    res.json({
      success: true,
      data: employees,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error fetching employees',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get a single employee by ID
 */
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching employee',
      error: error.message
    });
  }
};

/**
 * Create a new employee
 */
const createEmployee = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      position,
      hire_date,
      salary,
      status,
      address,
      emergency_contact
    } = req.body;

    // Check if email already exists
    if (email) {
      const existingEmployee = await Employee.findOne({ where: { email } });
      if (existingEmployee) {
        return res.status(400).json({
          success: false,
          message: 'An employee with this email already exists'
        });
      }
    }

    const employee = await Employee.create({
      first_name,
      last_name,
      email,
      phone,
      position,
      hire_date,
      salary,
      status: status || 'active',
      address,
      emergency_contact
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating employee',
      error: error.message
    });
  }
};

/**
 * Update an employee
 */
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email,
      phone,
      position,
      hire_date,
      salary,
      status,
      address,
      emergency_contact
    } = req.body;

    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== employee.email) {
      const existingEmployee = await Employee.findOne({ where: { email } });
      if (existingEmployee) {
        return res.status(400).json({
          success: false,
          message: 'An employee with this email already exists'
        });
      }
    }

    await employee.update({
      first_name,
      last_name,
      email,
      phone,
      position,
      hire_date,
      salary,
      status,
      address,
      emergency_contact
    });

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating employee',
      error: error.message
    });
  }
};

/**
 * Delete an employee
 */
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    await employee.destroy();

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting employee',
      error: error.message
    });
  }
};

/**
 * Get employee statistics
 */
const getEmployeeStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.count();
    const activeEmployees = await Employee.count({ where: { status: 'active' } });
    const inactiveEmployees = await Employee.count({ where: { status: 'inactive' } });
    const onLeaveEmployees = await Employee.count({ where: { status: 'on_leave' } });

    res.json({
      success: true,
      data: {
        total: totalEmployees,
        active: activeEmployees,
        inactive: inactiveEmployees,
        on_leave: onLeaveEmployees
      }
    });
  } catch (error) {
    console.error('Error fetching employee stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching employee statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats
};

