'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const orders = [
      {
        order_number: 'CMD001',
        customer_name: 'Table 5',
        order_date: new Date('2024-11-18'),
        status: 'completed',
        total_amount: 45.50,
        payment_status: 'paid',
        served_by: 3,
        created_at: new Date('2024-11-18'),
        updated_at: new Date('2024-11-18')
      },
      {
        order_number: 'CMD002',
        customer_name: 'Jean Dupont',
        order_date: new Date('2024-11-19'),
        status: 'completed',
        total_amount: 32.00,
        payment_status: 'paid',
        served_by: 5,
        created_at: new Date('2024-11-19'),
        updated_at: new Date('2024-11-19')
      },
      {
        order_number: 'CMD003',
        customer_name: 'Table 2',
        order_date: new Date('2024-11-20'),
        status: 'preparing',
        total_amount: 28.50,
        payment_status: 'unpaid',
        served_by: 3,
        created_at: new Date('2024-11-20'),
        updated_at: new Date('2024-11-20')
      },
      {
        order_number: 'CMD004',
        customer_name: 'Marie Claire',
        order_date: new Date('2024-11-20'),
        status: 'pending',
        total_amount: 15.00,
        payment_status: 'unpaid',
        served_by: 5,
        created_at: new Date('2024-11-20'),
        updated_at: new Date('2024-11-20')
      },
      {
        order_number: 'CMD005',
        customer_name: 'Table 8',
        order_date: new Date('2024-11-21'),
        status: 'completed',
        total_amount: 67.00,
        payment_status: 'paid',
        served_by: 3,
        created_at: new Date('2024-11-21'),
        updated_at: new Date('2024-11-21')
      },
      {
        order_number: 'CMD006',
        customer_name: 'Pierre Martin',
        order_date: new Date('2024-11-21'),
        status: 'cancelled',
        total_amount: 42.00,
        payment_status: 'refunded',
        served_by: 5,
        notes: 'Client a annulé la commande',
        created_at: new Date('2024-11-21'),
        updated_at: new Date('2024-11-21')
      }
    ];

    await queryInterface.bulkInsert('orders', orders, {});

    // Insert order items
    const orderItems = [
      // CMD001 items
      { order_id: 1, product_id: 1, product_name: 'Tomates', quantity: 2.00, unit_price: 3.50, subtotal: 7.00, created_at: new Date('2024-11-18') },
      { order_id: 1, product_id: 5, product_name: 'Steaks Hachés', quantity: 3.00, unit_price: 12.00, subtotal: 36.00, created_at: new Date('2024-11-18') },
      { order_id: 1, product_id: 9, product_name: 'Coca-Cola', quantity: 2.00, unit_price: 1.50, subtotal: 3.00, created_at: new Date('2024-11-18') },
      
      // CMD002 items
      { order_id: 2, product_id: 15, product_name: 'Pains Burger', quantity: 4.00, unit_price: 0.80, subtotal: 3.20, created_at: new Date('2024-11-19') },
      { order_id: 2, product_id: 5, product_name: 'Steaks Hachés', quantity: 2.00, unit_price: 12.00, subtotal: 24.00, created_at: new Date('2024-11-19') },
      { order_id: 2, product_id: 10, product_name: 'Eau Minérale', quantity: 2.00, unit_price: 0.80, subtotal: 1.60, created_at: new Date('2024-11-19') },
      { order_id: 2, product_id: 18, product_name: 'Frites Surgelées', quantity: 1.00, unit_price: 2.50, subtotal: 2.50, created_at: new Date('2024-11-19') },
      
      // CMD003 items
      { order_id: 3, product_id: 6, product_name: 'Poulet Entier', quantity: 2.00, unit_price: 8.50, subtotal: 17.00, created_at: new Date('2024-11-20') },
      { order_id: 3, product_id: 11, product_name: 'Jus d\'Orange', quantity: 3.00, unit_price: 3.00, subtotal: 9.00, created_at: new Date('2024-11-20') },
      { order_id: 3, product_id: 2, product_name: 'Salade Verte', quantity: 2.00, unit_price: 1.20, subtotal: 2.40, created_at: new Date('2024-11-20') },
      
      // CMD004 items
      { order_id: 4, product_id: 16, product_name: 'Baguette', quantity: 2.00, unit_price: 1.20, subtotal: 2.40, created_at: new Date('2024-11-20') },
      { order_id: 4, product_id: 12, product_name: 'Fromage Cheddar', quantity: 0.50, unit_price: 18.00, subtotal: 9.00, created_at: new Date('2024-11-20') },
      { order_id: 4, product_id: 10, product_name: 'Eau Minérale', quantity: 3.00, unit_price: 0.80, subtotal: 2.40, created_at: new Date('2024-11-20') },
      
      // CMD005 items
      { order_id: 5, product_id: 7, product_name: 'Filet de Porc', quantity: 3.00, unit_price: 15.00, subtotal: 45.00, created_at: new Date('2024-11-21') },
      { order_id: 5, product_id: 12, product_name: 'Vin Rouge', quantity: 2.00, unit_price: 12.00, subtotal: 24.00, created_at: new Date('2024-11-21') },
      { order_id: 5, product_id: 17, product_name: 'Croissants', quantity: 4.00, unit_price: 1.50, subtotal: 6.00, created_at: new Date('2024-11-21') },
      
      // CMD006 items (cancelled)
      { order_id: 6, product_id: 5, product_name: 'Steaks Hachés', quantity: 3.00, unit_price: 12.00, subtotal: 36.00, created_at: new Date('2024-11-21') },
      { order_id: 6, product_id: 18, product_name: 'Frites Surgelées', quantity: 2.00, unit_price: 2.50, subtotal: 5.00, created_at: new Date('2024-11-21') }
    ];

    await queryInterface.bulkInsert('order_items', orderItems, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('order_items', null, {});
    await queryInterface.bulkDelete('orders', null, {});
  }
};

