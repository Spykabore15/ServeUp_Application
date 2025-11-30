'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10);
    
    const users = [
      {
        username: 'admin',
        email: 'admin@servup.com',
        password_hash: await bcrypt.hash('admin123', salt),
        role: 'admin',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'responsable_stocks',
        email: 'stocks@servup.com',
        password_hash: await bcrypt.hash('stock123', salt),
        role: 'responsable_stocks',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'responsable_employes',
        email: 'rh@servup.com',
        password_hash: await bcrypt.hash('hr123', salt),
        role: 'responsable_employes',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'employe',
        email: 'employe@servup.com',
        password_hash: await bcrypt.hash('emp123', salt),
        role: 'employe',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};

