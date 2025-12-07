const { AccessRequest, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Create a new access request
 */
const createAccessRequest = async (req, res) => {
  try {
    const { full_name, email, username, password, phone, requested_role, reason } = req.body;

    // Validate required fields
    if (!full_name || !email || !username || !password || !requested_role) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, username, password, and requested role are required'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Validate username format (alphanumeric, 3-50 chars)
    if (!/^[a-zA-Z0-9]{3,50}$/.test(username)) {
      return res.status(400).json({
        success: false,
        message: 'Username must be 3-50 characters and contain only letters and numbers'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate requested role
    const validRoles = ['admin', 'responsable_stocks', 'responsable_employes', 'employe'];
    if (!validRoles.includes(requested_role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid requested role'
      });
    }

    // Check if AccessRequest table exists (handle case where migration hasn't run)
    try {
      // Check if there's already a pending request with this email or username
      const existingRequest = await AccessRequest.findOne({
        where: {
          [Op.or]: [
            { email, status: 'pending' },
            { username, status: 'pending' }
          ]
        }
      });

      if (existingRequest) {
        return res.status(400).json({
          success: false,
          message: 'You already have a pending access request'
        });
      }

      // Hash the password
      const bcrypt = require('bcrypt');
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // Check if username or email already exists in users table
      const { User } = require('../models');
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { username },
            { email }
          ]
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: existingUser.username === username 
            ? 'Username already taken' 
            : 'Email already registered'
        });
      }

      // Create the access request
      const requestData = {
        full_name: full_name.trim(),
        email: email.trim().toLowerCase(),
        username: username.trim(),
        password_hash,
        phone: phone ? phone.trim() : null,
        requested_role,
        reason: reason ? reason.trim() : null,
        status: 'pending'
      };
      
      console.log('Creating access request with data:', {
        ...requestData,
        password_hash: '[HIDDEN]'
      });
      
      const accessRequest = await AccessRequest.create(requestData);

      res.status(201).json({
        success: true,
        message: 'Access request submitted successfully',
        data: accessRequest
      });
    } catch (dbError) {
      // Check if it's a table doesn't exist error
      if (dbError.name === 'SequelizeDatabaseError' && dbError.message.includes('doesn\'t exist')) {
        console.error('AccessRequest table does not exist. Please run migrations.');
        return res.status(503).json({
          success: false,
          message: 'Access request feature is not available. Please contact the administrator.',
          error: 'Database table not found. Migration required.'
        });
      }
      
      // Handle Sequelize validation errors from database operations
      if (dbError.name === 'SequelizeValidationError') {
        const errorMessages = dbError.errors 
          ? dbError.errors.map(e => `${e.path}: ${e.message}`).join(', ')
          : dbError.message;
        return res.status(400).json({
          success: false,
          message: 'Validation error: ' + errorMessages,
          error: process.env.NODE_ENV === 'development' ? dbError.message : 'Invalid input data'
        });
      }
      
      // Handle unique constraint errors
      if (dbError.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'A request with this email or username already exists'
        });
      }
      
      throw dbError; // Re-throw if it's a different error
    }
  } catch (error) {
    console.error('Error creating access request:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      errors: error.errors
    });
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeDatabaseError') {
      const errorMessages = error.errors 
        ? error.errors.map(e => e.message).join(', ')
        : error.message;
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + errorMessages,
        error: process.env.NODE_ENV === 'development' ? error.message : 'Invalid input data'
      });
    }
    
    // Handle unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'A request with this email or username already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating access request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get all access requests (with optional filters)
 */
const getAccessRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) {
      where.status = status;
    }

    const { count, rows } = await AccessRequest.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'username', 'email'],
          required: false
        }
      ]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching access requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching access requests',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get pending access requests count
 */
const getPendingRequestsCount = async (req, res) => {
  try {
    const count = await AccessRequest.count({
      where: { status: 'pending' }
    });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error fetching pending requests count:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending requests count',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Approve an access request
 */
const approveAccessRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { assigned_role, review_notes } = req.body;
    const reviewerId = req.user.id;

    const accessRequest = await AccessRequest.findByPk(id);

    if (!accessRequest) {
      return res.status(404).json({
        success: false,
        message: 'Access request not found'
      });
    }

    if (accessRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Access request is already ${accessRequest.status}`
      });
    }

    // Validate assigned role
    const validRoles = ['admin', 'responsable_stocks', 'responsable_employes', 'employe'];
    const finalRole = assigned_role || accessRequest.requested_role;
    
    if (!validRoles.includes(finalRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid assigned role'
      });
    }

    // Check if password_hash exists (for requests created after password feature)
    if (!accessRequest.password_hash) {
      return res.status(400).json({
        success: false,
        message: 'Access request does not have a password. Please ask the user to resubmit with a password.'
      });
    }

    // Check if username exists in the request (for requests created after username feature)
    let username = accessRequest.username;
    if (!username) {
      // Fallback: use email prefix for older requests
      username = accessRequest.email.split('@')[0];
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email: accessRequest.email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this username or email already exists'
      });
    }

    // Create user account with the assigned role (not requested role) and stored password
    const newUser = await User.create({
      username,
      email: accessRequest.email,
      password_hash: accessRequest.password_hash, // Use the stored hashed password
      role: finalRole, // Use assigned_role if provided, otherwise requested_role
      is_active: true
    });

    // Update the access request
    accessRequest.status = 'approved';
    accessRequest.assigned_role = finalRole;
    accessRequest.reviewed_by = reviewerId;
    accessRequest.reviewed_at = new Date();
    accessRequest.review_notes = review_notes || null;
    await accessRequest.save();

    res.json({
      success: true,
      message: 'Access request approved and user account created',
      data: {
        accessRequest,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        }
      }
    });
  } catch (error) {
    console.error('Error approving access request:', error);
    
    // Handle duplicate email/username error
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'A user with this username or email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error approving access request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Deny an access request
 */
const denyAccessRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { review_notes } = req.body;
    const reviewerId = req.user.id;

    const accessRequest = await AccessRequest.findByPk(id);

    if (!accessRequest) {
      return res.status(404).json({
        success: false,
        message: 'Access request not found'
      });
    }

    if (accessRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Access request is already ${accessRequest.status}`
      });
    }

    // Update the access request
    accessRequest.status = 'denied';
    accessRequest.reviewed_by = reviewerId;
    accessRequest.reviewed_at = new Date();
    accessRequest.review_notes = review_notes || null;
    await accessRequest.save();

    res.json({
      success: true,
      message: 'Access request denied',
      data: accessRequest
    });
  } catch (error) {
    console.error('Error denying access request:', error);
    res.status(500).json({
      success: false,
      message: 'Error denying access request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createAccessRequest,
  getAccessRequests,
  getPendingRequestsCount,
  approveAccessRequest,
  denyAccessRequest
};

