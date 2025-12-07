'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const suppliers = [
      {
        name: 'Ferme de la Vallée',
        contact_person: 'Jean Dupont',
        email: 'jean.dupont@fermevallee.com',
        phone: '0123456789',
        address: '1 Rue de la Ferme, 75000 Campagne',
        products_offered: 'Légumes bio, Fruits de saison, Tomates, Salades',
        rating: 5,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Boulangerie du Coin',
        contact_person: 'Marie Claire',
        email: 'contact@boulangerieducoin.fr',
        phone: '0987654321',
        address: '12 Avenue du Pain, 75010 Paris',
        products_offered: 'Pains artisanaux, Viennoiseries, Pains burger',
        rating: 4,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Grossiste Boissons Express',
        contact_person: 'Alain Robert',
        email: 'commercial@boissonsexpress.com',
        phone: '0102030405',
        address: 'Zone Industrielle Sud, 93000 Bobigny',
        products_offered: 'Sodas, Jus de fruits, Bières, Vins',
        rating: 4,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Viandes Premium',
        contact_person: 'Pierre Martin',
        email: 'contact@viandespremium.fr',
        phone: '0145678901',
        address: '5 Rue des Bouchers, 75015 Paris',
        products_offered: 'Bœuf, Poulet, Porc, Steaks hachés',
        rating: 5,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Check if suppliers already exist
    const existingSuppliers = await queryInterface.sequelize.query(
      `SELECT name FROM suppliers WHERE name IN ('Ferme de la Vallée', 'Boulangerie du Coin', 'Grossiste Boissons Express', 'Viandes Premium')`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const existingNames = existingSuppliers.map(s => s.name);

    // Only insert suppliers that don't exist
    const suppliersToCreate = suppliers.filter(s => !existingNames.includes(s.name));

    if (suppliersToCreate.length > 0) {
      await queryInterface.bulkInsert('suppliers', suppliersToCreate, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('suppliers', null, {});
  }
};

