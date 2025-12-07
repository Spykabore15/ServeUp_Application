'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new columns if they don't exist
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

    // Check current enum type to see if update is needed
    const [enumCheck] = await queryInterface.sequelize.query(`
      SELECT 
        t.typname as enum_name,
        string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) as enum_values
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      WHERE t.typname = 'enum_employees_status'
      GROUP BY t.typname;
    `);

    // Only update enum if it doesn't already have the correct values
    if (enumCheck.length === 0 || !enumCheck[0].enum_values.includes('inactive')) {
      // Update enum type for status field
      // First, drop the default
      await queryInterface.sequelize.query(`
        ALTER TABLE employees 
        ALTER COLUMN status DROP DEFAULT;
      `);

      // Change the column to text temporarily
      await queryInterface.sequelize.query(`
        ALTER TABLE employees 
        ALTER COLUMN status TYPE VARCHAR(20);
      `);

      // Drop the old enum type
      await queryInterface.sequelize.query(`
        DROP TYPE IF EXISTS "enum_employees_status";
      `);

      // Create new enum type
      await queryInterface.sequelize.query(`
        CREATE TYPE "enum_employees_status" AS ENUM ('active', 'inactive', 'on_leave');
      `);

      // Update any 'terminated' values to 'inactive'
      await queryInterface.sequelize.query(`
        UPDATE employees SET status = 'inactive' WHERE status = 'terminated';
      `);

      // Convert column back to enum with new type
      await queryInterface.sequelize.query(`
        ALTER TABLE employees 
        ALTER COLUMN status TYPE "enum_employees_status" USING status::"enum_employees_status";
      `);

      // Set default value
      await queryInterface.sequelize.query(`
        ALTER TABLE employees 
        ALTER COLUMN status SET DEFAULT 'active';
      `);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove added columns
    await queryInterface.removeColumn('employees', 'address');
    await queryInterface.removeColumn('employees', 'emergency_contact');

    // Revert enum type
    await queryInterface.sequelize.query(`
      ALTER TABLE employees 
      ALTER COLUMN status TYPE VARCHAR(20);
    `);

    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_employees_status";
    `);

    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_employees_status" AS ENUM ('active', 'on_leave', 'terminated');
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE employees 
      ALTER COLUMN status TYPE "enum_employees_status" USING status::"enum_employees_status";
    `);
  }
};

