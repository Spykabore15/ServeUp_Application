'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if columns exist and add them if they don't
    const tableInfo = await queryInterface.describeTable('employees');
    
    if (!tableInfo.address) {
      await queryInterface.addColumn('employees', 'address', {
        type: Sequelize.STRING(255),
        allowNull: true
      });
    }
    
    if (!tableInfo.emergency_contact) {
      await queryInterface.addColumn('employees', 'emergency_contact', {
        type: Sequelize.STRING(255),
        allowNull: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove columns if they exist
    const tableInfo = await queryInterface.describeTable('employees');
    
    if (tableInfo.address) {
      await queryInterface.removeColumn('employees', 'address');
    }
    
    if (tableInfo.emergency_contact) {
      await queryInterface.removeColumn('employees', 'emergency_contact');
    }
  }
};

