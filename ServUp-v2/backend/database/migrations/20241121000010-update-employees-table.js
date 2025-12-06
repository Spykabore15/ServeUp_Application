'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // NOTE: address and emergency_contact columns are already created in migration 2
    // This migration only handles enum type migration from old schema if needed
    
    try {
      // First check if employees table exists
      const [tables] = await queryInterface.sequelize.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'employees';
      `);

      if (tables.length === 0) {
        // Table doesn't exist yet, migration 2 will create it with correct enum
        console.log('Note: employees table does not exist yet, skipping enum migration');
        return;
      }

      // Check current enum type and update if needed
      const [enumCheck] = await queryInterface.sequelize.query(`
        SELECT t.typname, e.enumlabel 
        FROM pg_type t 
        JOIN pg_enum e ON t.oid = e.enumtypid 
        WHERE t.typname = 'enum_employees_status'
        ORDER BY e.enumsortorder;
      `);

      // Only update enum if it has the old 'terminated' value or doesn't have 'inactive'
      const hasInactive = enumCheck.some(e => e.enumlabel === 'inactive');
      const hasTerminated = enumCheck.some(e => e.enumlabel === 'terminated');

      if (hasTerminated || (!hasInactive && enumCheck.length > 0)) {
        // Update enum type for status field
        // Step 1: Drop the default constraint FIRST
        await queryInterface.sequelize.query(`
          ALTER TABLE employees 
          ALTER COLUMN status DROP DEFAULT;
        `);

        // Step 2: Change the column to text temporarily (this removes the enum dependency)
        await queryInterface.sequelize.query(`
          ALTER TABLE employees 
          ALTER COLUMN status TYPE VARCHAR(20) USING status::text;
        `);

        // Step 3: Update any 'terminated' values to 'inactive' while it's text
        await queryInterface.sequelize.query(`
          UPDATE employees SET status = 'inactive' WHERE status = 'terminated';
        `);

        // Step 4: Update any NULL or empty string values to 'active' (default)
        await queryInterface.sequelize.query(`
          UPDATE employees SET status = 'active' WHERE status IS NULL OR status = '';
        `);

        // Step 5: NOW we can safely drop the old enum type (no dependencies left)
        await queryInterface.sequelize.query(`
          DROP TYPE IF EXISTS "enum_employees_status" CASCADE;
        `);

        // Step 6: Create new enum type
        await queryInterface.sequelize.query(`
          CREATE TYPE "enum_employees_status" AS ENUM ('active', 'inactive', 'on_leave');
        `);

        // Step 7: Convert column back to enum with new type
        // Handle any remaining invalid values by defaulting to 'active'
        await queryInterface.sequelize.query(`
          ALTER TABLE employees 
          ALTER COLUMN status TYPE "enum_employees_status" 
          USING CASE 
            WHEN status IN ('active', 'inactive', 'on_leave') THEN status::"enum_employees_status"
            ELSE 'active'::"enum_employees_status"
          END;
        `);

        // Step 8: Set default value (this creates a new dependency)
        await queryInterface.sequelize.query(`
          ALTER TABLE employees 
          ALTER COLUMN status SET DEFAULT 'active';
        `);
      }
    } catch (error) {
      // If enum check fails (table might not exist yet), that's okay
      // Migration 2 will create the table with correct enum anyway
      console.log('Note: Enum migration skipped:', error.message);
    }
  },

  down: async (queryInterface, Sequelize) => {
    // NOTE: We do NOT remove address and emergency_contact columns here
    // because they were created in migration 20241121000002-create-employees.js
    // This migration only handles the enum type change
    // When migration 2 is reverted, it will drop the entire table including these columns
    
    try {
      // First check if employees table exists
      const [tables] = await queryInterface.sequelize.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'employees';
      `);

      if (tables.length === 0) {
        // Table doesn't exist, nothing to revert
        console.log('Note: employees table does not exist, skipping enum revert');
        return;
      }

      // Check current enum type
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

