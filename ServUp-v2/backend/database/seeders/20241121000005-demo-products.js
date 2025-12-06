'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const products = [
      // Vegetables (category_id: 1, supplier_id: 1)
      { name: 'Tomates', description: 'Tomates cerises bio', category_id: 1, quantity: 45.00, unit: 'kg', threshold: 20.00, price_per_unit: 3.50, supplier_id: 1, expiration_date: '2024-12-15', sku: 'VEG-TOM-001', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Salade Verte', description: 'Laitue romaine bio', category_id: 1, quantity: 12.00, unit: 'pièces', threshold: 10.00, price_per_unit: 1.20, supplier_id: 1, expiration_date: '2024-12-10', sku: 'VEG-SAL-002', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Oignons Jaunes', description: 'Oignons jaunes de garde', category_id: 1, quantity: 35.00, unit: 'kg', threshold: 15.00, price_per_unit: 2.00, supplier_id: 1, sku: 'VEG-OIG-003', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Carottes', description: 'Carottes bio', category_id: 1, quantity: 28.00, unit: 'kg', threshold: 10.00, price_per_unit: 2.50, supplier_id: 1, expiration_date: '2024-12-12', sku: 'VEG-CAR-004', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Courgettes', description: 'Courgettes bio', category_id: 1, quantity: 18.00, unit: 'kg', threshold: 8.00, price_per_unit: 2.80, supplier_id: 1, expiration_date: '2024-12-08', sku: 'VEG-COU-005', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Aubergines', description: 'Aubergines bio', category_id: 1, quantity: 15.00, unit: 'kg', threshold: 8.00, price_per_unit: 4.50, supplier_id: 1, expiration_date: '2024-12-09', sku: 'VEG-AUB-006', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Poivrons', description: 'Poivrons rouges et verts', category_id: 1, quantity: 12.00, unit: 'kg', threshold: 6.00, price_per_unit: 3.80, supplier_id: 1, expiration_date: '2024-12-07', sku: 'VEG-POI-007', is_active: true, created_at: new Date(), updated_at: new Date() },
      
      // Meats (category_id: 2, supplier_id: 4)
      { name: 'Steaks Hachés', description: 'Bœuf haché 15% MG premium', category_id: 2, quantity: 12.50, unit: 'kg', threshold: 20.00, price_per_unit: 13.50, supplier_id: 4, expiration_date: '2024-12-05', sku: 'MEA-STE-001', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Poulet Entier', description: 'Poulet fermier Label Rouge', category_id: 2, quantity: 18.00, unit: 'pièces', threshold: 10.00, price_per_unit: 9.50, supplier_id: 4, expiration_date: '2024-12-06', sku: 'MEA-POU-002', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Filet de Porc', description: 'Filet mignon de porc', category_id: 2, quantity: 10.00, unit: 'kg', threshold: 8.00, price_per_unit: 16.00, supplier_id: 4, expiration_date: '2024-12-05', sku: 'MEA-POR-003', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Escalopes de Veau', description: 'Escalopes de veau', category_id: 2, quantity: 8.00, unit: 'kg', threshold: 5.00, price_per_unit: 22.00, supplier_id: 4, expiration_date: '2024-12-04', sku: 'MEA-VEA-004', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Saucisses de Toulouse', description: 'Saucisses artisanales', category_id: 2, quantity: 25.00, unit: 'pièces', threshold: 15.00, price_per_unit: 3.20, supplier_id: 4, expiration_date: '2024-12-06', sku: 'MEA-SAU-005', is_active: true, created_at: new Date(), updated_at: new Date() },
      
      // Fish (category_id: 3, supplier_id: 5)
      { name: 'Saumon Frais', description: 'Filets de saumon Atlantique', category_id: 3, quantity: 15.00, unit: 'kg', threshold: 8.00, price_per_unit: 28.00, supplier_id: 5, expiration_date: '2024-12-03', sku: 'POI-SAU-001', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Cabillaud', description: 'Filets de cabillaud frais', category_id: 3, quantity: 12.00, unit: 'kg', threshold: 6.00, price_per_unit: 24.00, supplier_id: 5, expiration_date: '2024-12-03', sku: 'POI-CAB-002', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Crevettes', description: 'Crevettes roses décortiquées', category_id: 3, quantity: 8.00, unit: 'kg', threshold: 4.00, price_per_unit: 32.00, supplier_id: 5, expiration_date: '2024-12-02', sku: 'POI-CRE-003', is_active: true, created_at: new Date(), updated_at: new Date() },
      
      // Beverages (category_id: 4, supplier_id: 3)
      { name: 'Coca-Cola', description: 'Soda Coca-Cola 33cl', category_id: 4, quantity: 180.00, unit: 'bouteilles', threshold: 50.00, price_per_unit: 1.50, supplier_id: 3, sku: 'BEV-COL-001', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Eau Minérale', description: 'Eau plate 50cl', category_id: 4, quantity: 220.00, unit: 'bouteilles', threshold: 80.00, price_per_unit: 0.80, supplier_id: 3, sku: 'BEV-EAU-002', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Jus d\'Orange', description: 'Jus d\'orange frais pressé', category_id: 4, quantity: 35.00, unit: 'litres', threshold: 20.00, price_per_unit: 3.50, supplier_id: 3, expiration_date: '2024-12-05', sku: 'BEV-JUS-003', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Vin Rouge', description: 'Bordeaux AOC 2020', category_id: 4, quantity: 42.00, unit: 'bouteilles', threshold: 15.00, price_per_unit: 15.00, supplier_id: 3, sku: 'BEV-VIN-004', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Vin Blanc', description: 'Sancerre AOC 2021', category_id: 4, quantity: 38.00, unit: 'bouteilles', threshold: 15.00, price_per_unit: 18.00, supplier_id: 3, sku: 'BEV-VIN-005', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Bière Artisanale', description: 'Bière blonde pression 25cl', category_id: 4, quantity: 95.00, unit: 'bouteilles', threshold: 30.00, price_per_unit: 4.50, supplier_id: 3, sku: 'BEV-BIE-006', is_active: true, created_at: new Date(), updated_at: new Date() },
      
      // Dairy (category_id: 5, supplier_id: 6)
      { name: 'Fromage Cheddar', description: 'Cheddar affiné 12 mois', category_id: 5, quantity: 8.50, unit: 'kg', threshold: 8.00, price_per_unit: 19.00, supplier_id: 6, expiration_date: '2024-12-20', sku: 'LAI-CHE-001', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Beurre Doux', description: 'Beurre doux AOP 250g', category_id: 5, quantity: 24.00, unit: 'paquets', threshold: 10.00, price_per_unit: 3.80, supplier_id: 6, expiration_date: '2024-12-25', sku: 'LAI-BEU-002', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Crème Fraîche', description: 'Crème fraîche épaisse 30%', category_id: 5, quantity: 28.00, unit: 'pots', threshold: 12.00, price_per_unit: 2.80, supplier_id: 6, expiration_date: '2024-12-08', sku: 'LAI-CRE-003', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Mozzarella', description: 'Mozzarella di Bufala', category_id: 5, quantity: 15.00, unit: 'boules', threshold: 8.00, price_per_unit: 4.50, supplier_id: 6, expiration_date: '2024-12-06', sku: 'LAI-MOZ-004', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Parmesan', description: 'Parmigiano Reggiano AOP', category_id: 5, quantity: 6.00, unit: 'kg', threshold: 3.00, price_per_unit: 35.00, supplier_id: 6, sku: 'LAI-PAR-005', is_active: true, created_at: new Date(), updated_at: new Date() },
      
      // Breads (category_id: 6, supplier_id: 2)
      { name: 'Pains Burger', description: 'Pains burger artisanaux', category_id: 6, quantity: 125.00, unit: 'pièces', threshold: 50.00, price_per_unit: 0.85, supplier_id: 2, expiration_date: '2024-12-05', sku: 'PAI-BUR-001', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Baguette', description: 'Baguette tradition', category_id: 6, quantity: 85.00, unit: 'pièces', threshold: 30.00, price_per_unit: 1.20, supplier_id: 2, expiration_date: '2024-12-04', sku: 'PAI-BAG-002', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Croissants', description: 'Croissants pur beurre', category_id: 6, quantity: 55.00, unit: 'pièces', threshold: 20.00, price_per_unit: 1.60, supplier_id: 2, expiration_date: '2024-12-05', sku: 'PAI-CRO-003', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Pain de Mie', description: 'Pain de mie complet', category_id: 6, quantity: 30.00, unit: 'paquets', threshold: 12.00, price_per_unit: 2.20, supplier_id: 2, expiration_date: '2024-12-10', sku: 'PAI-MIE-004', is_active: true, created_at: new Date(), updated_at: new Date() },
      
      // Spices & Condiments (category_id: 7, supplier_id: 1)
      { name: 'Huile d\'Olive', description: 'Huile d\'olive extra vierge AOP', category_id: 7, quantity: 18.00, unit: 'litres', threshold: 8.00, price_per_unit: 16.00, supplier_id: 1, sku: 'EPI-HUI-001', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Sel de Guérande', description: 'Sel fin de Guérande', category_id: 7, quantity: 8.00, unit: 'kg', threshold: 3.00, price_per_unit: 2.50, supplier_id: 1, sku: 'EPI-SEL-002', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Poivre Noir', description: 'Poivre noir en grains', category_id: 7, quantity: 3.00, unit: 'kg', threshold: 1.00, price_per_unit: 25.00, supplier_id: 1, sku: 'EPI-POI-003', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Herbes de Provence', description: 'Mélange d\'herbes séchées', category_id: 7, quantity: 2.50, unit: 'kg', threshold: 1.00, price_per_unit: 18.00, supplier_id: 1, sku: 'EPI-HER-004', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Ail', description: 'Têtes d\'ail bio', category_id: 7, quantity: 5.00, unit: 'kg', threshold: 2.00, price_per_unit: 6.00, supplier_id: 1, sku: 'EPI-AIL-005', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Sauce Tomate', description: 'Coulis de tomate bio', category_id: 7, quantity: 20.00, unit: 'bocaux', threshold: 10.00, price_per_unit: 3.50, supplier_id: 1, sku: 'EPI-SAU-006', is_active: true, created_at: new Date(), updated_at: new Date() },
      
      // Frozen (category_id: 8, supplier_id: 3)
      { name: 'Frites Surgelées', description: 'Frites précuites qualité premium', category_id: 8, quantity: 150.00, unit: 'kg', threshold: 100.00, price_per_unit: 2.80, supplier_id: 3, sku: 'SUR-FRI-001', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Légumes Surgelés', description: 'Mélange de légumes surgelés', category_id: 8, quantity: 45.00, unit: 'kg', threshold: 25.00, price_per_unit: 4.20, supplier_id: 3, sku: 'SUR-LEG-002', is_active: true, created_at: new Date(), updated_at: new Date() },
      
      // Cereals & Starches (category_id: 9, supplier_id: 1)
      { name: 'Riz Basmati', description: 'Riz basmati long grain', category_id: 9, quantity: 25.00, unit: 'kg', threshold: 10.00, price_per_unit: 4.50, supplier_id: 1, sku: 'CER-RIZ-001', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Pâtes Penne', description: 'Pâtes penne premium', category_id: 9, quantity: 20.00, unit: 'kg', threshold: 10.00, price_per_unit: 3.20, supplier_id: 1, sku: 'CER-PAT-002', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Pommes de Terre', description: 'Pommes de terre à chair ferme', category_id: 9, quantity: 40.00, unit: 'kg', threshold: 15.00, price_per_unit: 1.80, supplier_id: 1, sku: 'CER-PDT-003', is_active: true, created_at: new Date(), updated_at: new Date() },
      
      // Fruits (category_id: 10, supplier_id: 1)
      { name: 'Citrons', description: 'Citrons jaunes bio', category_id: 10, quantity: 12.00, unit: 'kg', threshold: 5.00, price_per_unit: 4.00, supplier_id: 1, expiration_date: '2024-12-10', sku: 'FRU-CIT-001', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Fruits Rouges', description: 'Mélange de fruits rouges', category_id: 10, quantity: 8.00, unit: 'kg', threshold: 4.00, price_per_unit: 12.00, supplier_id: 1, expiration_date: '2024-12-04', sku: 'FRU-ROU-002', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Pommes', description: 'Pommes Gala bio', category_id: 10, quantity: 20.00, unit: 'kg', threshold: 10.00, price_per_unit: 3.50, supplier_id: 1, expiration_date: '2024-12-15', sku: 'FRU-POM-003', is_active: true, created_at: new Date(), updated_at: new Date() }
    ];

    await queryInterface.bulkInsert('products', products, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  }
};
