/**
 * Base Controller Class
 * Provides common CRUD operations and error handling
 * Reduces code duplication across controllers
 */

const logger = require('./logger');
const { sendSuccess, sendError, sendNotFound, sendInternalError } = require('./responseHandler');

class BaseController {
  constructor(model, options = {}) {
    this.model = model;
    this.modelName = options.modelName || model.name;
    this.include = options.include || [];
    this.orderBy = options.orderBy || [['created_at', 'DESC']];
  }

  /**
   * Get all records with pagination
   */
  async getAll(req, res) {
    try {
      const { page = 1, limit = 20, offset = 0, ...filters } = req.query;
      const whereClause = this.buildWhereClause(filters);

      const { count, rows } = await this.model.findAndCountAll({
        where: whereClause,
        include: this.include,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: this.orderBy,
        distinct: true
      });

      return sendSuccess(res, {
        data: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      logger.error(`Error fetching ${this.modelName}`, {
        error: error.message,
        stack: error.stack,
        requestId: req.id
      });
      return sendInternalError(res);
    }
  }

  /**
   * Get single record by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;

      const record = await this.model.findByPk(id, {
        include: this.include
      });

      if (!record) {
        return sendNotFound(res, `${this.modelName} not found`);
      }

      return sendSuccess(res, { data: record });
    } catch (error) {
      logger.error(`Error fetching ${this.modelName}`, {
        error: error.message,
        stack: error.stack,
        id: req.params.id,
        requestId: req.id
      });
      return sendInternalError(res);
    }
  }

  /**
   * Create new record
   */
  async create(req, res) {
    const transaction = req.transaction; // Can be passed from route handler
    
    try {
      const record = await this.model.create(req.body, {
        transaction,
        include: this.include
      });

      logger.info(`${this.modelName} created`, {
        id: record.id,
        userId: req.user?.id,
        requestId: req.id
      });

      return sendSuccess(res, { data: record }, `${this.modelName} created successfully`, 201);
    } catch (error) {
      logger.error(`Error creating ${this.modelName}`, {
        error: error.message,
        stack: error.stack,
        requestId: req.id
      });
      return sendInternalError(res);
    }
  }

  /**
   * Update record by ID
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const record = await this.model.findByPk(id);

      if (!record) {
        return sendNotFound(res, `${this.modelName} not found`);
      }

      // Store old values for audit log
      const oldValues = { ...record.toJSON() };

      await record.update(req.body);

      logger.info(`${this.modelName} updated`, {
        id: record.id,
        userId: req.user?.id,
        requestId: req.id
      });

      return sendSuccess(res, { data: record }, `${this.modelName} updated successfully`);
    } catch (error) {
      logger.error(`Error updating ${this.modelName}`, {
        error: error.message,
        stack: error.stack,
        id: req.params.id,
        requestId: req.id
      });
      return sendInternalError(res);
    }
  }

  /**
   * Delete record by ID
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const record = await this.model.findByPk(id);

      if (!record) {
        return sendNotFound(res, `${this.modelName} not found`);
      }

      await record.destroy();

      logger.info(`${this.modelName} deleted`, {
        id,
        userId: req.user?.id,
        requestId: req.id
      });

      return sendSuccess(res, null, `${this.modelName} deleted successfully`);
    } catch (error) {
      logger.error(`Error deleting ${this.modelName}`, {
        error: error.message,
        stack: error.stack,
        id: req.params.id,
        requestId: req.id
      });
      return sendInternalError(res);
    }
  }

  /**
   * Build WHERE clause from query filters
   * Override this method in subclasses for custom filtering
   */
  buildWhereClause(filters) {
    const { Op } = require('sequelize');
    const whereClause = {};

    // Add custom filter logic here
    // Example: if (filters.status) whereClause.status = filters.status;

    return whereClause;
  }
}

module.exports = BaseController;

