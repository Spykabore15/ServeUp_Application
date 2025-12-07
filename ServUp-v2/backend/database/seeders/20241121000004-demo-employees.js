'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const employees = [
      {
        first_name: 'Alice',
        last_name: 'Dubois',
        position: 'Manager Général',
        email: 'alice.dubois@servup.com',
        phone: '0612345678',
        hire_date: '2020-01-15',
        status: 'active',
        salary: 3500.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Bob',
        last_name: 'Martin',
        position: 'Chef Cuisinier',
        email: 'bob.martin@servup.com',
        phone: '0623456789',
        hire_date: '2021-03-10',
        status: 'active',
        salary: 2800.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Charlie',
        last_name: 'Durand',
        position: 'Serveur',
        email: 'charlie.durand@servup.com',
        phone: '0634567890',
        hire_date: '2022-06-01',
        status: 'on_leave',
        salary: 1800.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Diana',
        last_name: 'Moreau',
        position: 'Responsable Stocks',
        email: 'diana.moreau@servup.com',
        phone: '0645678901',
        hire_date: '2021-09-15',
        status: 'active',
        salary: 2500.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Emma',
        last_name: 'Bernard',
        position: 'Serveuse',
        email: 'emma.bernard@servup.com',
        phone: '0656789012',
        hire_date: '2023-01-10',
        status: 'active',
        salary: 1800.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'François',
        last_name: 'Petit',
        position: 'Commis de Cuisine',
        email: 'francois.petit@servup.com',
        phone: '0667890123',
        hire_date: '2023-05-20',
        status: 'active',
        salary: 1600.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Sophie',
        last_name: 'Laurent',
        position: 'Responsable RH',
        email: 'sophie.laurent@servup.com',
        phone: '0678901234',
        hire_date: '2020-08-01',
        status: 'active',
        salary: 2800.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Lucas',
        last_name: 'Roux',
        position: 'Plongeur',
        email: 'lucas.roux@servup.com',
        phone: '0689012345',
        hire_date: '2023-07-15',
        status: 'active',
        salary: 1500.00,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Check if employees already exist (by email)
    const employeeEmails = employees.map(e => e.email).filter(e => e);
    const existingEmployees = await queryInterface.sequelize.query(
      `SELECT email FROM employees WHERE email IN (${employeeEmails.map(e => `'${e}'`).join(', ')})`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const existingEmails = existingEmployees.map(e => e.email);

    // Only insert employees that don't exist
    const employeesToCreate = employees.filter(e => !e.email || !existingEmails.includes(e.email));

    if (employeesToCreate.length > 0) {
      await queryInterface.bulkInsert('employees', employeesToCreate, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('employees', null, {});
  }
};

