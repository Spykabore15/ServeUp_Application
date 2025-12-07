/**
 * Environment Variable Validator
 * Validates required environment variables at application startup
 */

const requiredEnvVars = {
  development: [
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD'
  ],
  production: [
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'JWT_SECRET',
    'FRONTEND_URL'
  ],
  test: [
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD'
  ]
};

const validateEnv = () => {
  const env = process.env.NODE_ENV || 'development';
  const required = requiredEnvVars[env] || requiredEnvVars.development;
  
  const missing = required.filter(key => {
    const value = process.env[key];
    return !value || value.trim() === '';
  });
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error(`\nPlease check your .env file or environment configuration.`);
    console.error(`Required for ${env} environment: ${required.join(', ')}`);
    process.exit(1);
  }
  
  // Additional validations
  const warnings = [];
  
  // Validate JWT_SECRET length if set
  if (process.env.JWT_SECRET) {
    if (process.env.JWT_SECRET.length < 32) {
      warnings.push('JWT_SECRET should be at least 32 characters long');
    }
  }
  
  // Validate database port
  if (process.env.DB_PORT) {
    const port = parseInt(process.env.DB_PORT);
    if (isNaN(port) || port < 1 || port > 65535) {
      warnings.push('DB_PORT must be a valid port number (1-65535)');
    }
  }
  
  // Validate server port
  if (process.env.PORT) {
    const port = parseInt(process.env.PORT);
    if (isNaN(port) || port < 1 || port > 65535) {
      warnings.push('PORT must be a valid port number (1-65535)');
    }
  }
  
  if (warnings.length > 0) {
    console.warn('⚠️  Environment variable warnings:');
    warnings.forEach(warning => console.warn(`   - ${warning}`));
  }
  
  console.log('✅ Environment variables validated');
  return true;
};

module.exports = { validateEnv };

