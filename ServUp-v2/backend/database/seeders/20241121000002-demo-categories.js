'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = [
      {
        name: 'Légumes',
        description: 'Légumes frais, bio et de saison',
        created_at: new Date()
      },
      {
        name: 'Viandes',
        description: 'Viandes et volailles fraîches',
        created_at: new Date()
      },
      {
        name: 'Poissons',
        description: 'Poissons et fruits de mer',
        created_at: new Date()
      },
      {
        name: 'Boissons',
        description: 'Boissons alcoolisées et non-alcoolisées',
        created_at: new Date()
      },
      {
        name: 'Produits Laitiers',
        description: 'Fromages, lait, beurre, crème',
        created_at: new Date()
      },
      {
        name: 'Pains et Pâtisseries',
        description: 'Pains artisanaux, viennoiseries et pâtisseries',
        created_at: new Date()
      },
      {
        name: 'Épices et Condiments',
        description: 'Épices, herbes, sauces et condiments',
        created_at: new Date()
      },
      {
        name: 'Surgelés',
        description: 'Produits surgelés et précuits',
        created_at: new Date()
      },
      {
        name: 'Céréales et Féculents',
        description: 'Riz, pâtes, pommes de terre',
        created_at: new Date()
      },
      {
        name: 'Fruits',
        description: 'Fruits frais et dessert',
        created_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('categories', categories, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
