/**
 * Middleware to check if user has required role(s)
 * Usage: roleMiddleware(['admin', 'responsable_stocks'])
 */
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Ensure user is authenticated (should be called after authMiddleware)
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required'
        });
      }

      // Check if user role is in allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied. Insufficient permissions.',
          requiredRoles: allowedRoles,
          userRole: req.user.role
        });
      }

      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(403).json({
        status: 'error',
        message: 'Permission check failed',
        error: error.message
      });
    }
  };
};

module.exports = roleMiddleware;

