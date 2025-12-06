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

    // Check current enum type and update if needed
    const [enumCheck] = await queryInterface.sequelize.query(`
      SELECT t.typname, e.enumlabel 
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid 
      WHERE t.typname = 'enum_employees_status'
      ORDER BY e.enumsortorder;
    `);

    // Only update enum if it doesn't already have the correct values
    const hasInactive = enumCheck.some(e => e.enumlabel === 'inactive');
    const hasTerminated = enumCheck.some(e => e.enumlabel === 'terminated');

    if (hasTerminated || !hasInactive) {
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
    // NOTE: We do NOT remove address and emergency_contact columns here
    // because they were created in migration 20241121000002-create-employees.js
    // This migration only handles the enum type change
    // When migration 2 is reverted, it will drop the entire table including these columns
    
    // Check current enum type
    try {
      const [enumCheck] = await queryInterface.sequelize.query(`
        SELECT t.typname, e.enumlabel 
        FROM pg_type t 
        JOIN pg_enum e ON t.oid = e.enumtypid 
        WHERE t.typname = 'enum_employees_status'
        ORDER BY e.enumsortorder;
      `);

      const hasInactive = enumCheck.some(e => e.enumlabel === 'inactive');
      const hasTerminated = enumCheck.some(e => e.enumlabel === 'terminated');

      // Only revert enum if it was changed by this migration (has inactive, not terminated)
      if (hasInactive && !hasTerminated) {
        // Revert enum type - must drop default first
        await queryInterface.sequelize.query(`
          ALTER TABLE employees 
          ALTER COLUMN status DROP DEFAULT;
        `);

        // Change to text temporarily
        await queryInterface.sequelize.query(`
          ALTER TABLE employees 
          ALTER COLUMN status TYPE VARCHAR(20);
        `);

        // Now we can drop the enum type
        await queryInterface.sequelize.query(`
          DROP TYPE IF EXISTS "enum_employees_status";
        `);

        // Create old enum type
        await queryInterface.sequelize.query(`
          CREATE TYPE "enum_employees_status" AS ENUM ('active', 'on_leave', 'terminated');
        `);

        // Convert back to enum
        await queryInterface.sequelize.query(`
          ALTER TABLE employees 
          ALTER COLUMN status TYPE "enum_employees_status" USING status::"enum_employees_status";
        `);

        // Restore default
        await queryInterface.sequelize.query(`
          ALTER TABLE employees 
          ALTER COLUMN status SET DEFAULT 'active';
        `);
      }
    } catch (error) {
      // If enum doesn't exist or table doesn't exist, that's okay during migration revert
      console.log('Note: Could not revert enum type (table may not exist):', error.message);
    }
  }
};

