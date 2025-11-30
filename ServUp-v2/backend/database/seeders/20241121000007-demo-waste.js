'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const wasteRecords = [
      {
        product_id: 1,
        product_name: 'Tomates',
        quantity: 3.50,
        unit: 'kg',
        reason: 'Périmées',
        reported_by: 4,
        waste_date: new Date('2024-11-15'),
        estimated_value: 12.25,
        created_at: new Date('2024-11-15')
      },
      {
        product_id: 2,
        product_name: 'Salade Verte',
        quantity: 5.00,
        unit: 'pièces',
        reason: 'Flétries',
        reported_by: 4,
        waste_date: new Date('2024-11-17'),
        estimated_value: 6.00,
        created_at: new Date('2024-11-17')
      },
      {
        product_id: 15,
        product_name: 'Pains Burger',
        quantity: 15.00,
        unit: 'pièces',
        reason: 'Rassissement',
        reported_by: 4,
        waste_date: new Date('2024-11-18'),
        estimated_value: 12.00,
        created_at: new Date('2024-11-18')
      },
      {
        product_id: 6,
        product_name: 'Poulet Entier',
        quantity: 2.00,
        unit: 'pièces',
        reason: 'Date limite dépassée',
        reported_by: 2,
        waste_date: new Date('2024-11-19'),
        estimated_value: 17.00,
        created_at: new Date('2024-11-19')
      },
      {
        product_id: 12,
        product_name: 'Fromage Cheddar',
        quantity: 1.50,
        unit: 'kg',
        reason: 'Moisissure',
        reported_by: 4,
        waste_date: new Date('2024-11-20'),
        estimated_value: 27.00,
        created_at: new Date('2024-11-20')
      }
    ];

    await queryInterface.bulkInsert('waste_records', wasteRecords, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('waste_records', null, {});
  }
};

