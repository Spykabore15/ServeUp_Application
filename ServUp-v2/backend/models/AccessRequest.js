const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AccessRequest = sequelize.define('AccessRequest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    requested_role: {
      type: DataTypes.ENUM('admin', 'responsable_stocks', 'responsable_employes', 'employe'),
      allowNull: false,
      defaultValue: 'employe'
    },
    assigned_role: {
      type: DataTypes.ENUM('admin', 'responsable_stocks', 'responsable_employes', 'employe'),
      allowNull: true
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'denied'),
      allowNull: false,
      defaultValue: 'pending'
    },
    reviewed_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    review_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'access_requests',
    timestamps: true,
    underscored: true
  });

  // Define associations
  AccessRequest.associate = (models) => {
    AccessRequest.belongsTo(models.User, {
      foreignKey: 'reviewed_by',
      as: 'reviewer'
    });
  };

  return AccessRequest;
};

