'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('access_requests', 'username', {
      type: Sequelize.STRING(50),
      allowNull: true,
      after: 'email'
    });
    
    await queryInterface.addColumn('access_requests', 'password_hash', {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'username'
    });
    
    // Check if enum type exists, if not create it
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_access_requests_assigned_role" AS ENUM('admin', 'responsable_stocks', 'responsable_employes', 'employe');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    await queryInterface.addColumn('access_requests', 'assigned_role', {
      type: Sequelize.ENUM('admin', 'responsable_stocks', 'responsable_employes', 'employe'),
      allowNull: true,
      after: 'requested_role'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('access_requests', 'username');
    await queryInterface.removeColumn('access_requests', 'password_hash');
    await queryInterface.removeColumn('access_requests', 'assigned_role');
  }
};

