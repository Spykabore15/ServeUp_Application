'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10);
    
    // Create initial users, then update with employee_id after employees are created
    const users = [
      {
        username: 'admin',
        email: 'admin@servup.com',
        password_hash: await bcrypt.hash('admin123', salt),
        role: 'admin',
        employee_id: 1, // Alice Dubois - Manager Général
        is_active: true,
        last_login: new Date('2024-11-20T14:30:00'),
        created_at: new Date('2020-01-15'),
        updated_at: new Date()
      },
      {
        username: 'diana.moreau',
        email: 'diana.moreau@servup.com',
        password_hash: await bcrypt.hash('stock123', salt),
        role: 'responsable_stocks',
        employee_id: 4, // Diana Moreau - Responsable Stocks
        is_active: true,
        last_login: new Date('2024-11-21T09:15:00'),
        created_at: new Date('2021-09-15'),
        updated_at: new Date()
      },
      {
        username: 'sophie.laurent',
        email: 'sophie.laurent@servup.com',
        password_hash: await bcrypt.hash('hr123', salt),
        role: 'responsable_employes',
        employee_id: 7, // Sophie Laurent - Responsable RH
        is_active: true,
        last_login: new Date('2024-11-21T10:00:00'),
        created_at: new Date('2020-08-01'),
        updated_at: new Date()
      },
      {
        username: 'charlie.durand',
        email: 'charlie.durand@servup.com',
        password_hash: await bcrypt.hash('emp123', salt),
        role: 'employe',
        employee_id: 3, // Charlie Durand - Serveur Principal
        is_active: true,
        last_login: new Date('2024-11-21T11:30:00'),
        created_at: new Date('2022-06-01'),
        updated_at: new Date()
      },
      {
        username: 'bob.martin',
        email: 'bob.martin@servup.com',
        password_hash: await bcrypt.hash('chef123', salt),
        role: 'employe',
        employee_id: 2, // Bob Martin - Chef Cuisinier
        is_active: true,
        last_login: new Date('2024-11-21T07:00:00'),
        created_at: new Date('2021-03-10'),
        updated_at: new Date()
      },
      {
        username: 'emma.bernard',
        email: 'emma.bernard@servup.com',
        password_hash: await bcrypt.hash('serveuse123', salt),
        role: 'employe',
        employee_id: 5, // Emma Bernard - Serveuse
        is_active: true,
        last_login: new Date('2024-11-21T12:00:00'),
        created_at: new Date('2023-01-10'),
        updated_at: new Date()
      },
      {
        username: 'camille.lefebvre',
        email: 'camille.lefebvre@servup.com',
        password_hash: await bcrypt.hash('souschef123', salt),
        role: 'employe',
        employee_id: 9, // Camille Lefebvre - Sous-Chef
        is_active: true,
        last_login: new Date('2024-11-21T08:00:00'),
        created_at: new Date('2022-02-14'),
        updated_at: new Date()
      },
      {
        username: 'julie.david',
        email: 'julie.david@servup.com',
        password_hash: await bcrypt.hash('sommelier123', salt),
        role: 'employe',
        employee_id: 11, // Julie David - Sommelier
        is_active: true,
        last_login: new Date('2024-11-20T19:00:00'),
        created_at: new Date('2022-11-05'),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
