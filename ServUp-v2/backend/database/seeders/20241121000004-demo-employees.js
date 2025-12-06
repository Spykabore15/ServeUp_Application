'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const employees = [
      {
        first_name: 'Alice',
        last_name: 'Dubois',
        position: 'Manager Général',
        email: 'alice.dubois@servup.com',
        phone: '06.12.34.56.78',
        address: '12 Rue de la République, 75001 Paris',
        emergency_contact: 'Jean Dubois - 06.98.76.54.32',
        hire_date: '2020-01-15',
        status: 'active',
        salary: 4200.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Bob',
        last_name: 'Martin',
        position: 'Chef Cuisinier',
        email: 'bob.martin@servup.com',
        phone: '06.23.45.67.89',
        address: '45 Avenue Montaigne, 75008 Paris',
        emergency_contact: 'Sophie Martin - 06.87.65.43.21',
        hire_date: '2021-03-10',
        status: 'active',
        salary: 3200.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Charlie',
        last_name: 'Durand',
        position: 'Serveur Principal',
        email: 'charlie.durand@servup.com',
        phone: '06.34.56.78.90',
        address: '78 Boulevard Saint-Germain, 75006 Paris',
        emergency_contact: 'Marie Durand - 06.76.54.32.10',
        hire_date: '2022-06-01',
        status: 'active',
        salary: 2200.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Diana',
        last_name: 'Moreau',
        position: 'Responsable Stocks',
        email: 'diana.moreau@servup.com',
        phone: '06.45.67.89.01',
        address: '23 Rue de Rivoli, 75004 Paris',
        emergency_contact: 'Thomas Moreau - 06.65.43.21.09',
        hire_date: '2021-09-15',
        status: 'active',
        salary: 2800.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Emma',
        last_name: 'Bernard',
        position: 'Serveuse',
        email: 'emma.bernard@servup.com',
        phone: '06.56.78.90.12',
        address: '56 Rue de Vaugirard, 75015 Paris',
        emergency_contact: 'Pierre Bernard - 06.54.32.10.98',
        hire_date: '2023-01-10',
        status: 'active',
        salary: 1900.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'François',
        last_name: 'Petit',
        position: 'Commis de Cuisine',
        email: 'francois.petit@servup.com',
        phone: '06.67.89.01.23',
        address: '89 Rue du Faubourg Saint-Antoine, 75011 Paris',
        emergency_contact: 'Claire Petit - 06.43.21.09.87',
        hire_date: '2023-05-20',
        status: 'active',
        salary: 1800.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Sophie',
        last_name: 'Laurent',
        position: 'Responsable RH',
        email: 'sophie.laurent@servup.com',
        phone: '06.78.90.12.34',
        address: '34 Avenue des Ternes, 75017 Paris',
        emergency_contact: 'Marc Laurent - 06.32.10.98.76',
        hire_date: '2020-08-01',
        status: 'active',
        salary: 3000.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Lucas',
        last_name: 'Roux',
        position: 'Plongeur',
        email: 'lucas.roux@servup.com',
        phone: '06.89.01.23.45',
        address: '67 Rue de Charonne, 75011 Paris',
        emergency_contact: 'Lucie Roux - 06.21.09.87.65',
        hire_date: '2023-07-15',
        status: 'active',
        salary: 1650.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Camille',
        last_name: 'Lefebvre',
        position: 'Sous-Chef',
        email: 'camille.lefebvre@servup.com',
        phone: '06.90.12.34.56',
        address: '91 Rue de Tolbiac, 75013 Paris',
        emergency_contact: 'Antoine Lefebvre - 06.10.98.76.54',
        hire_date: '2022-02-14',
        status: 'active',
        salary: 2600.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Thomas',
        last_name: 'Garcia',
        position: 'Serveur',
        email: 'thomas.garcia@servup.com',
        phone: '06.01.23.45.67',
        address: '14 Rue de Belleville, 75020 Paris',
        emergency_contact: 'Isabelle Garcia - 06.09.87.65.43',
        hire_date: '2023-03-22',
        status: 'active',
        salary: 1900.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Julie',
        last_name: 'David',
        position: 'Sommelier',
        email: 'julie.david@servup.com',
        phone: '06.12.34.56.78',
        address: '28 Rue des Rosiers, 75004 Paris',
        emergency_contact: 'Paul David - 06.98.76.54.32',
        hire_date: '2022-11-05',
        status: 'active',
        salary: 2400.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Nicolas',
        last_name: 'Simon',
        position: 'Commis de Cuisine',
        email: 'nicolas.simon@servup.com',
        phone: '06.23.45.67.89',
        address: '52 Rue de la Paix, 75002 Paris',
        emergency_contact: 'Anne Simon - 06.87.65.43.21',
        hire_date: '2023-09-10',
        status: 'active',
        salary: 1800.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Marine',
        last_name: 'Michel',
        position: 'Hôtesse d\'Accueil',
        email: 'marine.michel@servup.com',
        phone: '06.34.56.78.90',
        address: '73 Boulevard Haussmann, 75008 Paris',
        emergency_contact: 'Olivier Michel - 06.76.54.32.10',
        hire_date: '2023-04-18',
        status: 'active',
        salary: 1850.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Antoine',
        last_name: 'Leroy',
        position: 'Barman',
        email: 'antoine.leroy@servup.com',
        phone: '06.45.67.89.01',
        address: '19 Rue de la Soif, 75006 Paris',
        emergency_contact: 'Céline Leroy - 06.65.43.21.09',
        hire_date: '2022-08-30',
        status: 'active',
        salary: 2100.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Céline',
        last_name: 'Rousseau',
        position: 'Serveuse',
        email: 'celine.rousseau@servup.com',
        phone: '06.56.78.90.12',
        address: '41 Rue Monge, 75005 Paris',
        emergency_contact: 'Laurent Rousseau - 06.54.32.10.98',
        hire_date: '2023-06-12',
        status: 'active',
        salary: 1900.00,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('employees', employees, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('employees', null, {});
  }
};
