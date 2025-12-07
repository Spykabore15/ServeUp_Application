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

    // Check if waste records already exist (by product_id, waste_date, and reported_by)
    // Since waste records can have duplicates, we'll check for exact matches
    const wasteKeys = wasteRecords.map(w => {
      const dateStr = w.waste_date instanceof Date ? w.waste_date.toISOString().split('T')[0] : w.waste_date;
      return { product_id: w.product_id, waste_date: dateStr, reported_by: w.reported_by };
    });

    // Check each waste record individually to see if it exists
    const existingWaste = [];
    for (const key of wasteKeys) {
      const [results] = await queryInterface.sequelize.query(
        `SELECT product_id, waste_date, reported_by FROM waste_records 
         WHERE product_id = ${key.product_id} 
         AND waste_date = '${key.waste_date}' 
         AND reported_by = ${key.reported_by}`,
        { type: Sequelize.QueryTypes.SELECT }
      );
      if (results && results.length > 0) {
        existingWaste.push(key);
      }
    }

    // Create a set of existing waste record keys
    const existingKeys = new Set(
      existingWaste.map(w => `${w.product_id}-${w.waste_date}-${w.reported_by}`)
    );

    // Only insert waste records that don't exist
    const wasteToCreate = wasteRecords.filter(w => {
      const dateStr = w.waste_date instanceof Date ? w.waste_date.toISOString().split('T')[0] : w.waste_date;
      const key = `${w.product_id}-${dateStr}-${w.reported_by}`;
      return !existingKeys.has(key);
    });

    if (wasteToCreate.length > 0) {
      await queryInterface.bulkInsert('waste_records', wasteToCreate, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('waste_records', null, {});
  }
};

