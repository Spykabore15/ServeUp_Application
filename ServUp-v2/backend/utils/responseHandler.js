/**
 * Standardized Response Handler
 * Provides consistent API response formats across the application
 */

const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    status: 'success',
    message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

const sendError = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const response = {
    status: 'error',
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

const sendValidationError = (res, errors) => {
  return sendError(res, 'Validation failed', 400, errors);
};

const sendUnauthorized = (res, message = 'Unauthorized. Please login.') => {
  return sendError(res, message, 401);
};

const sendForbidden = (res, message = 'Access denied. Insufficient permissions.') => {
  return sendError(res, message, 403);
};

const sendNotFound = (res, message = 'Resource not found.') => {
  return sendError(res, message, 404);
};

const sendInternalError = (res, message = 'An internal error occurred. Please try again later.') => {
  return sendError(res, message, 500);
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
  sendInternalError
};

