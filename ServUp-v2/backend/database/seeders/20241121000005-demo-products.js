'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const products = [
      // Vegetables (category_id: 1, supplier_id: 1)
      { name: 'Tomates', description: 'Tomates fraîches bio', category_id: 1, quantity: 50.00, unit: 'kg', threshold: 20.00, price_per_unit: 3.50, supplier_id: 1, sku: 'VEG001', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Salade Verte', description: 'Laitue bio', category_id: 1, quantity: 8.00, unit: 'pièces', threshold: 10.00, price_per_unit: 1.20, supplier_id: 1, sku: 'VEG002', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Oignons', description: 'Oignons jaunes', category_id: 1, quantity: 30.00, unit: 'kg', threshold: 15.00, price_per_unit: 2.00, supplier_id: 1, sku: 'VEG003', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Carottes', description: 'Carottes bio', category_id: 1, quantity: 25.00, unit: 'kg', threshold: 10.00, price_per_unit: 2.50, supplier_id: 1, sku: 'VEG004', is_active: true, created_at: new Date(), updated_at: new Date() },
      
      // Meats (category_id: 2, supplier_id: 4)
      { name: 'Steaks Hachés', description: 'Bœuf haché 15% MG', category_id: 2, quantity: 15.00, unit: 'kg', threshold: 20.00, price_per_unit: 12.00, supplier_id: 4, sku: 'MEAT001', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Poulet Entier', description: 'Poulet fermier', category_id: 2, quantity: 20.00, unit: 'pièces', threshold: 10.00, price_per_unit: 8.50, supplier_id: 4, sku: 'MEAT002', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Filet de Porc', description: 'Filet mignon de porc', category_id: 2, quantity: 12.00, unit: 'kg', threshold: 8.00, price_per_unit: 15.00, supplier_id: 4, sku: 'MEAT003', is_active: true, created_at: new Date(), updated_at: new Date() },
      
      // Beverages (category_id: 3, supplier_id: 3)
      { name: 'Coca-Cola', description: 'Soda Coca-Cola 33cl', category_id: 3, quantity: 150.00, unit: 'bouteilles', threshold: 50.00, price_per_unit: 1.50, supplier_id: 3, sku: 'BEV001', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Eau Minérale', description: 'Eau plate 50cl', category_id: 3, quantity: 200.00, unit: 'bouteilles', threshold: 80.00, price_per_unit: 0.80, supplier_id: 3, sku: 'BEV002', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Jus d\'Orange', description: 'Jus d\'orange frais', category_id: 3, quantity: 40.00, unit: 'litres', threshold: 20.00, price_per_unit: 3.00, supplier_id: 3, sku: 'BEV003', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Vin Rouge', description: 'Bordeaux AOC', category_id: 3, quantity: 30.00, unit: 'bouteilles', threshold: 15.00, price_per_unit: 12.00, supplier_id: 3, sku: 'BEV004', is_active: true, created_at: new Date(), updated_at: new Date() },
      
      // Dairy (category_id: 4)
      { name: 'Fromage Cheddar', description: 'Cheddar affiné', category_id: 4, quantity: 5.00, unit: 'kg', threshold: 8.00, price_per_unit: 18.00, supplier_id: 1, sku: 'DAIRY001', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Beurre Doux', description: 'Beurre doux 250g', category_id: 4, quantity: 15.00, unit: 'paquets', threshold: 10.00, price_per_unit: 3.50, supplier_id: 1, sku: 'DAIRY002', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Crème Fraîche', description: 'Crème fraîche épaisse', category_id: 4, quantity: 20.00, unit: 'pots', threshold: 12.00, price_per_unit: 2.50, supplier_id: 1, sku: 'DAIRY003', is_active: true, created_at: new Date(), updated_at: new Date() },
      
      // Breads (category_id: 5, supplier_id: 2)
      { name: 'Pains Burger', description: 'Pains burger artisanaux', category_id: 5, quantity: 100.00, unit: 'pièces', threshold: 50.00, price_per_unit: 0.80, supplier_id: 2, sku: 'BREAD001', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Baguette', description: 'Baguette tradition', category_id: 5, quantity: 60.00, unit: 'pièces', threshold: 30.00, price_per_unit: 1.20, supplier_id: 2, sku: 'BREAD002', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Croissants', description: 'Croissants pur beurre', category_id: 5, quantity: 40.00, unit: 'pièces', threshold: 20.00, price_per_unit: 1.50, supplier_id: 2, sku: 'BREAD003', is_active: true, created_at: new Date(), updated_at: new Date() },
      
      // Other items
      { name: 'Frites Surgelées', description: 'Frites précuites', category_id: 1, quantity: 180.00, unit: 'kg', threshold: 100.00, price_per_unit: 2.50, supplier_id: 1, sku: 'MISC001', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Huile d\'Olive', description: 'Huile d\'olive extra vierge', category_id: 1, quantity: 12.00, unit: 'litres', threshold: 8.00, price_per_unit: 15.00, supplier_id: 1, sku: 'MISC002', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Sel', description: 'Sel fin', category_id: 1, quantity: 5.00, unit: 'kg', threshold: 3.00, price_per_unit: 1.50, supplier_id: 1, sku: 'MISC003', is_active: true, created_at: new Date(), updated_at: new Date() }
    ];

    // Check if products already exist (by SKU)
    const productSkus = products.map(p => p.sku).filter(s => s);
    const existingProducts = await queryInterface.sequelize.query(
      `SELECT sku FROM products WHERE sku IN (${productSkus.map(s => `'${s}'`).join(', ')})`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const existingSkus = existingProducts.map(p => p.sku);

    // Only insert products that don't exist
    const productsToCreate = products.filter(p => !p.sku || !existingSkus.includes(p.sku));

    if (productsToCreate.length > 0) {
      await queryInterface.bulkInsert('products', productsToCreate, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  }
};

