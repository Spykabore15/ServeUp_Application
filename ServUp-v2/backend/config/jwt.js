const jwt = require('jsonwebtoken');

// Validate and get JWT secret
const getJWTSecret = () => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const DEFAULT_SECRET = 'your_super_secret_jwt_key_change_this_in_production';
  
  // In production, JWT_SECRET must be set
  if (process.env.NODE_ENV === 'production') {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET must be set in production environment');
    }
    if (JWT_SECRET === DEFAULT_SECRET) {
      throw new Error('JWT_SECRET cannot use default value in production');
    }
    if (JWT_SECRET.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long for security');
    }
  } else {
    // Development: warn but allow default
    if (!JWT_SECRET || JWT_SECRET === DEFAULT_SECRET) {
      console.warn('⚠️  WARNING: Using default JWT secret. This should only be used in development!');
      return DEFAULT_SECRET;
    }
    if (JWT_SECRET.length < 32) {
      console.warn('⚠️  WARNING: JWT_SECRET is shorter than 32 characters. Consider using a longer secret.');
    }
  }
  
  return JWT_SECRET;
};

const JWT_SECRET = getJWTSecret();
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  generateToken,
  verifyToken
};

