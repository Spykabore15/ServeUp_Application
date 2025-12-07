'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if users already exist
    const existingUsers = await queryInterface.sequelize.query(
      `SELECT username FROM users WHERE username IN ('admin', 'responsable_stocks', 'responsable_employes', 'employe')`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const existingUsernames = existingUsers.map(u => u.username);

    // Only create users that don't exist
    const usersToCreate = [];
    const salt = await bcrypt.genSalt(10);

    if (!existingUsernames.includes('admin')) {
      usersToCreate.push({
        username: 'admin',
        email: 'admin@servup.com',
        password_hash: await bcrypt.hash('admin123', salt),
        role: 'admin',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    if (!existingUsernames.includes('responsable_stocks')) {
      usersToCreate.push({
        username: 'responsable_stocks',
        email: 'stocks@servup.com',
        password_hash: await bcrypt.hash('stock123', salt),
        role: 'responsable_stocks',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    if (!existingUsernames.includes('responsable_employes')) {
      usersToCreate.push({
        username: 'responsable_employes',
        email: 'rh@servup.com',
        password_hash: await bcrypt.hash('hr123', salt),
        role: 'responsable_employes',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    if (!existingUsernames.includes('employe')) {
      usersToCreate.push({
        username: 'employe',
        email: 'employe@servup.com',
        password_hash: await bcrypt.hash('emp123', salt),
        role: 'employe',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    if (usersToCreate.length > 0) {
      await queryInterface.bulkInsert('users', usersToCreate, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};

