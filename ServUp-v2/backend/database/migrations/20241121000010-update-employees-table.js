'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // NOTE: address and emergency_contact columns are already created in migration 2
    // This migration only handles enum type migration from old schema if needed
    // On fresh databases, migration 2 already creates the correct structure, so this is a no-op
    
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

      // Check if table already has address column (created by migration 2)
      // If it does, the table was created correctly and we don't need to do anything
      const [columns] = await queryInterface.sequelize.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'employees' 
        AND column_name = 'address';
      `);

      // If address column exists, migration 2 already created the table correctly
      // Check if enum is already correct and skip if so
      if (columns.length > 0) {
        const [enumCheck] = await queryInterface.sequelize.query(`
          SELECT t.typname, e.enumlabel 
          FROM pg_type t 
          JOIN pg_enum e ON t.oid = e.enumtypid 
          WHERE t.typname = 'enum_employees_status'
          ORDER BY e.enumsortorder;
        `);

        const hasInactive = enumCheck.some(e => e.enumlabel === 'inactive');
        const hasTerminated = enumCheck.some(e => e.enumlabel === 'terminated');

        // If enum already has 'inactive' and doesn't have 'terminated', it's correct
        if (hasInactive && !hasTerminated) {
          console.log('Note: employees table already has correct enum type, skipping migration');
          return;
        }
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
    // NOTE: This migration should be a NO-OP on revert because:
    // 1. address and emergency_contact columns were created by migration 2, not this migration
    // 2. On fresh databases, migration 2 already creates the correct enum
    // 3. This migration only modified the enum if it had old values
    // When migration 2 is reverted, it will drop the entire table including all columns
    // 
    // IMPORTANT: We intentionally do NOTHING here to avoid conflicts.
    // If Sequelize tries to auto-revert anything, we catch and ignore it.
    
    try {
      // Check if table exists - if not, nothing to do
      const [tables] = await queryInterface.sequelize.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'employees';
      `);

      if (tables.length === 0) {
        console.log('Note: employees table does not exist, migration 10 down is a no-op');
        return;
      }

      // Since migration 2 creates the table with correct structure,
      // and this migration only modifies enum if needed (and only in up direction),
      // we don't need to revert anything here. Migration 2's down will drop the table.
      
      console.log('Note: Migration 10 down skipped - migration 2 will handle table drop');
      return;
      
    } catch (error) {
      // Silently ignore any errors - migration 2 will handle cleanup
      console.log('Note: Migration 10 down encountered error (expected during undo:all):', error.message);
      return;
    }
  }
};

