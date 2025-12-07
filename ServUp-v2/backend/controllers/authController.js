const { User } = require('../models');
const { generateToken } = require('../config/jwt');
const { sendSuccess, sendError, sendUnauthorized, sendValidationError, sendInternalError } = require('../utils/responseHandler');
const { createAuditLog, auditActions } = require('../middleware/auditLog');
const logger = require('../utils/logger');

// Register new user
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { 
        [require('sequelize').Op.or]: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return sendError(res, 'Username or email already exists', 400);
    }

    // Create new user (password will be hashed by model hook)
    const user = await User.create({
      username,
      email,
      password_hash: password, // Will be hashed by beforeCreate hook
      role: role || 'employe'
    });

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    logger.info('User registered successfully', { userId: user.id, username: user.username });
    
    sendSuccess(res, {
      token,
      user: user.toSafeObject()
    }, 'User registered successfully', 201);
  } catch (error) {
    logger.error('Registration error', { error: error.message, stack: error.stack });
    sendInternalError(res);
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findByLogin(username);

    if (!user) {
      logger.warn('Login attempt failed: User not found', { username });
      return sendUnauthorized(res, 'Invalid credentials');
    }

    // Check if user is active
    if (!user.is_active) {
      logger.warn('Login attempt failed: Account deactivated', { userId: user.id, username });
      return sendError(res, 'Account is deactivated', 403);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      logger.warn('Login attempt failed: Invalid password', { userId: user.id, username });
      return sendUnauthorized(res, 'Invalid credentials');
    }

    // Update last login
    await user.update({ last_login: new Date() });

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    logger.info('User logged in successfully', { userId: user.id, username: user.username });
    
    // Create audit log for login
    await createAuditLog(req, auditActions.LOGIN, 'users', user.id, null, { username: user.username });
    
    sendSuccess(res, {
      token,
      user: user.toSafeObject()
    }, 'Login successful');
  } catch (error) {
    logger.error('Login error', { error: error.message, stack: error.stack });
    sendInternalError(res);
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    // In JWT, logout is handled client-side by removing the token
    // Here we can log the action or perform cleanup if needed
    if (req.user) {
      logger.info('User logged out', { userId: req.user.id, username: req.user.username });
      
      // Create audit log for logout
      await createAuditLog(req, auditActions.LOGOUT, 'users', req.user.id);
    }
    
    sendSuccess(res, null, 'Logout successful');
  } catch (error) {
    logger.error('Logout error', { error: error.message, stack: error.stack });
    sendInternalError(res);
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    sendSuccess(res, { user: user.toSafeObject() });
  } catch (error) {
    logger.error('Get current user error', { error: error.message, stack: error.stack, userId: req.user?.id });
    sendInternalError(res);
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    // Verify old password
    const isPasswordValid = await user.comparePassword(oldPassword);

    if (!isPasswordValid) {
      logger.warn('Password change failed: Incorrect current password', { userId: req.user.id });
      return sendUnauthorized(res, 'Current password is incorrect');
    }

    // Store old values for audit log
    const oldValues = { password_hash: '***' }; // Don't log actual password
    
    // Update password (will be hashed by beforeUpdate hook)
    await user.update({ password_hash: newPassword });

    logger.info('Password changed successfully', { userId: req.user.id });
    
    // Create audit log for password change
    await createAuditLog(req, auditActions.PASSWORD_CHANGE, 'users', req.user.id, oldValues, { password_hash: '***' });
    
    sendSuccess(res, null, 'Password changed successfully');
  } catch (error) {
    logger.error('Change password error', { error: error.message, stack: error.stack, userId: req.user?.id });
    sendInternalError(res);
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  changePassword
};

