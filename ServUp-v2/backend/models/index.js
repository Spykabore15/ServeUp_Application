const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialize Sequelize
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    define: dbConfig.define
  }
);

// Import all models
const User = require('./User')(sequelize);
const Employee = require('./Employee')(sequelize);
const Category = require('./Category')(sequelize);
const Supplier = require('./Supplier')(sequelize);
const Product = require('./Product')(sequelize);
const Order = require('./Order')(sequelize);
const OrderItem = require('./OrderItem')(sequelize);
const WasteRecord = require('./WasteRecord')(sequelize);
const AuditLog = require('./AuditLog')(sequelize);
const AccessRequest = require('./AccessRequest')(sequelize);

// Define relationships
// User <-> Employee (One-to-One optional)
User.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
Employee.hasOne(User, { foreignKey: 'employee_id', as: 'user' });

// Category <-> Products (One-to-Many)
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Supplier <-> Products (One-to-Many)
Supplier.hasMany(Product, { foreignKey: 'supplier_id', as: 'products' });
Product.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'supplier' });

// Employee <-> Orders (One-to-Many)
Employee.hasMany(Order, { foreignKey: 'served_by', as: 'orders' });
Order.belongsTo(Employee, { foreignKey: 'served_by', as: 'server' });

// Order <-> OrderItems (One-to-Many)
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Product <-> OrderItems (One-to-Many)
Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'order_items' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Product <-> WasteRecords (One-to-Many)
Product.hasMany(WasteRecord, { foreignKey: 'product_id', as: 'waste_records' });
WasteRecord.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Employee <-> WasteRecords (One-to-Many)
Employee.hasMany(WasteRecord, { foreignKey: 'reported_by', as: 'reported_waste' });
WasteRecord.belongsTo(Employee, { foreignKey: 'reported_by', as: 'reporter' });

// User <-> AuditLogs (One-to-Many)
User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'audit_logs' });
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User <-> AccessRequests (One-to-Many - reviewer)
User.hasMany(AccessRequest, { foreignKey: 'reviewed_by', as: 'reviewed_requests' });
AccessRequest.belongsTo(User, { foreignKey: 'reviewed_by', as: 'reviewer' });

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to database:', error.message);
    return false;
  }
};

// Export everything
module.exports = {
  sequelize,
  Sequelize,
  User,
  Employee,
  Category,
  Supplier,
  Product,
  Order,
  OrderItem,
  WasteRecord,
  AuditLog,
  AccessRequest,
  testConnection
};

