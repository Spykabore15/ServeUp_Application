const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50],
        isAlphanumeric: true
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'responsable_stocks', 'responsable_employes', 'employe'),
      allowNull: false,
      defaultValue: 'employe'
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'employees',
        key: 'id'
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
      // Hash password before creating user (only if not already hashed)
      beforeCreate: async (user) => {
        if (user.password_hash) {
          // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
          // Format: $2[ayb]$[cost]$[22 character salt][31 character hash]
          const isAlreadyHashed = /^\$2[ayb]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(user.password_hash);
          if (!isAlreadyHashed) {
            const { BCRYPT } = require('../utils/constants');
            const salt = await bcrypt.genSalt(BCRYPT.SALT_ROUNDS);
            user.password_hash = await bcrypt.hash(user.password_hash, salt);
          }
        }
      },
      // Hash password before updating if it changed (only if not already hashed)
      beforeUpdate: async (user) => {
        if (user.changed('password_hash')) {
          // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
          const isAlreadyHashed = /^\$2[ayb]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(user.password_hash);
          if (!isAlreadyHashed) {
            const { BCRYPT } = require('../utils/constants');
            const salt = await bcrypt.genSalt(BCRYPT.SALT_ROUNDS);
            user.password_hash = await bcrypt.hash(user.password_hash, salt);
          }
        }
      }
    }
  });

  // Instance method to compare password
  User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password_hash);
  };

  // Instance method to get safe user data (without password)
  User.prototype.toSafeObject = function() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      role: this.role,
      is_active: this.is_active,
      last_login: this.last_login,
      created_at: this.created_at
    };
  };

  // Class method to find by username or email
  User.findByLogin = async function(login) {
    return await this.findOne({
      where: {
        [sequelize.Sequelize.Op.or]: [
          { username: login },
          { email: login }
        ]
      }
    });
  };

  return User;
};

