'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if categories already exist
    const existingCategories = await queryInterface.sequelize.query(
      `SELECT name FROM categories WHERE name IN ('Légumes', 'Viandes', 'Boissons', 'Produits Laitiers', 'Pains et Pâtisseries')`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const existingNames = existingCategories.map(c => c.name);

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

    // Only insert categories that don't exist
    const categoriesToCreate = categories.filter(c => !existingNames.includes(c.name));

    if (categoriesToCreate.length > 0) {
      await queryInterface.bulkInsert('categories', categoriesToCreate, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('categories', null, {});
  }
};

