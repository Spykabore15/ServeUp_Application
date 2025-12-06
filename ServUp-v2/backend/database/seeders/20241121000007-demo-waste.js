'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get products and employees for realistic waste records
    const [products] = await queryInterface.sequelize.query('SELECT id, name, price_per_unit FROM products WHERE is_active = true');
    const [employees] = await queryInterface.sequelize.query('SELECT id FROM employees WHERE status = \'active\'');

    const wasteReasons = [
      'Périmé',
      'Date limite dépassée',
      'Flétri',
      'Rassis',
      'Casse',
      'Ouverture accidentelle',
      'Moisissure',
      'Trop cuit',
      'Préparation excédentaire',
      'Erreur de commande'
    ];

    // Products more likely to be wasted (perishables)
    const perishableProducts = products.filter(p => 
      p.name.includes('Tomates') || 
      p.name.includes('Salade') || 
      p.name.includes('Carottes') ||
      p.name.includes('Poulet') ||
      p.name.includes('Saumon') ||
      p.name.includes('Fromage') ||
      p.name.includes('Pain') ||
      p.name.includes('Croissant') ||
      p.name.includes('Jus') ||
      p.name.includes('Crème')
    );

    const wasteRecords = [];
    const today = new Date();

    // Generate 25 waste records over the past 60 days
    for (let i = 0; i < 25; i++) {
      const daysAgo = Math.floor(Math.random() * 60);
      const wasteDate = new Date(today);
      wasteDate.setDate(wasteDate.getDate() - daysAgo);

      // Prefer perishable products (70% chance)
      const productPool = Math.random() < 0.7 ? perishableProducts : products;
      const product = productPool[Math.floor(Math.random() * productPool.length)];
      const employee = employees[Math.floor(Math.random() * employees.length)];

      // Quantity based on product type
      let quantity, unit, estimatedValue;
      const isLiquid = product.name.includes('Jus') || product.name.includes('Eau') || product.name.includes('Vin') || product.name.includes('Huile');
      const isBeverage = product.name.includes('Coca') || product.name.includes('Bière');
      const isSmallItem = product.name.includes('Pain') || product.name.includes('Croissant') || product.name.includes('Citron');

      if (isLiquid) {
        quantity = parseFloat((0.5 + Math.random() * 2).toFixed(2));
        unit = 'litres';
      } else if (isBeverage) {
        quantity = Math.floor(2 + Math.random() * 8);
        unit = 'bouteilles';
      } else if (isSmallItem) {
        quantity = Math.floor(3 + Math.random() * 15);
        unit = 'pièces';
      } else {
        quantity = parseFloat((0.5 + Math.random() * 5).toFixed(2));
        unit = 'kg';
      }

      estimatedValue = parseFloat((quantity * product.price_per_unit).toFixed(2));
      const reason = wasteReasons[Math.floor(Math.random() * wasteReasons.length)];

      wasteRecords.push({
        product_id: product.id,
        product_name: product.name,
        quantity: quantity,
        unit: unit,
        reason: reason,
        reported_by: employee.id,
        waste_date: wasteDate.toISOString().split('T')[0],
        estimated_value: estimatedValue,
        created_at: wasteDate
      });
    }

    await queryInterface.bulkInsert('waste_records', wasteRecords, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('waste_records', null, {});
  }
};
