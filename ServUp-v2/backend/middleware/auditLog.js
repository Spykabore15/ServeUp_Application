/**
 * Audit Logging Middleware
 * Logs critical actions for security and compliance
 */

const { AuditLog } = require('../models');
const logger = require('../utils/logger');

/**
 * Create audit log entry
 * @param {Object} req - Express request object
 * @param {string} action - Action performed (e.g., 'CREATE', 'UPDATE', 'DELETE', 'LOGIN')
 * @param {string} tableName - Database table name
 * @param {number} recordId - Record ID
 * @param {Object} oldValues - Previous values (for updates/deletes)
 * @param {Object} newValues - New values (for creates/updates)
 */
const createAuditLog = async (req, action, tableName = null, recordId = null, oldValues = null, newValues = null) => {
  try {
    // Skip audit logging if no user (shouldn't happen in protected routes)
    if (!req.user) {
      return;
    }

    await AuditLog.create({
      user_id: req.user.id,
      action,
      table_name: tableName,
      record_id: recordId,
      old_values: oldValues,
      new_values: newValues,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('user-agent')
    });
  } catch (error) {
    // Don't fail the request if audit logging fails, but log the error
    logger.error('Failed to create audit log', {
      error: error.message,
      action,
      tableName,
      recordId,
      userId: req.user?.id
    });
  }
};

/**
 * Middleware factory for automatic audit logging
 * @param {string} action - Action type
 * @param {string} tableName - Table name
 */
const auditLogMiddleware = (action, tableName) => {
  return async (req, res, next) => {
    // Store original response methods
    const originalJson = res.json;
    
    res.json = function(data) {
      // After response is sent, create audit log
      const recordId = data?.data?.id || req.params?.id || null;
      const newValues = req.method === 'POST' || req.method === 'PUT' ? req.body : null;
      
      // For updates, we'd need to fetch old values first (can be enhanced)
      createAuditLog(req, action, tableName, recordId, null, newValues);
      
      // Call original json method
      return originalJson.call(this, data);
    };
    
    next();
  };
};

/**
 * Helper to log specific actions
 */
const auditActions = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  VIEW: 'VIEW',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  ROLE_CHANGE: 'ROLE_CHANGE',
  PERMISSION_CHANGE: 'PERMISSION_CHANGE'
};

module.exports = {
  createAuditLog,
  auditLogMiddleware,
  auditActions
};

