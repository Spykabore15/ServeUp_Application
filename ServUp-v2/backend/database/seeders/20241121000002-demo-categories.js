'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = [
      {
        name: 'Légumes',
        description: 'Légumes frais et bio',
        created_at: new Date()
      },
      {
        name: 'Viandes',
        description: 'Viandes et volailles',
        created_at: new Date()
      },
      {
        name: 'Boissons',
        description: 'Boissons alcoolisées et non-alcoolisées',
        created_at: new Date()
      },
      {
        name: 'Produits Laitiers',
        description: 'Fromages, lait, beurre',
        created_at: new Date()
      },
      {
        name: 'Pains et Pâtisseries',
        description: 'Pains, viennoiseries et pâtisseries',
        created_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('categories', categories, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('categories', null, {});
  }
};

