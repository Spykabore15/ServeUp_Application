'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Helper function to generate random date in the past 90 days
    const randomDate = (daysAgo) => {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      date.setHours(12 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
      return date;
    };

    const customerNames = [
      'Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6', 'Table 7', 'Table 8',
      'Table 9', 'Table 10', 'Table 11', 'Table 12', 'Terrasse 1', 'Terrasse 2', 'Terrasse 3',
      'Jean Dupont', 'Marie Martin', 'Pierre Dubois', 'Sophie Laurent', 'Thomas Bernard',
      'Julie Moreau', 'Nicolas Petit', 'Camille Roux', 'Antoine Simon', 'Claire Michel',
      'Laurent Lefebvre', 'Isabelle Garcia', 'Marc David', 'Céline Rousseau', 'Olivier Leroy',
      'Anne Martin', 'Paul Durand', 'Lucie Bernard', 'François Leroy', 'Émilie Moreau',
      'Livraison - 12 Rue de Rivoli', 'Livraison - 45 Avenue des Champs', 'À emporter - Client 1'
    ];

    const employeeIds = [3, 5, 10, 14, 15]; // Serveurs and Serveuses

    const orders = [];
    let orderNumber = 1;

    // Generate 55 orders over the past 90 days (more recent = more orders)
    for (let i = 0; i < 55; i++) {
      const daysAgo = Math.floor(Math.random() * 90);
      const date = randomDate(daysAgo);
      
      // More orders on weekends (days 0-6, where 0=Sunday, 6=Saturday)
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const statusProb = isWeekend ? 
        [0.05, 0.10, 0.80, 0.05] : // Weekend: more completed
        [0.10, 0.15, 0.70, 0.05];  // Weekday: more variety
      
      const statusRand = Math.random();
      let status = 'completed';
      if (statusRand < statusProb[0]) status = 'pending';
      else if (statusRand < statusProb[0] + statusProb[1]) status = 'preparing';
      else if (statusRand < statusProb[0] + statusProb[1] + statusProb[2]) status = 'completed';
      else status = 'cancelled';

      let payment_status = 'paid';
      if (status === 'pending' || status === 'preparing') {
        payment_status = Math.random() < 0.3 ? 'paid' : 'unpaid';
      } else if (status === 'cancelled') {
        payment_status = Math.random() < 0.5 ? 'refunded' : 'unpaid';
      }

      const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
      const servedBy = employeeIds[Math.floor(Math.random() * employeeIds.length)];
      
      // Order amounts between 15 and 120 euros
      const totalAmount = parseFloat((15 + Math.random() * 105).toFixed(2));

      orders.push({
        order_number: `CMD${String(orderNumber).padStart(4, '0')}`,
        customer_name: customerName,
        order_date: date,
        status: status,
        total_amount: totalAmount,
        payment_status: payment_status,
        served_by: servedBy,
        notes: status === 'cancelled' && Math.random() > 0.7 ? 'Client a annulé' : null,
        created_at: date,
        updated_at: date
      });
      orderNumber++;
    }

    await queryInterface.bulkInsert('orders', orders, {});

    // Query products to get actual IDs and prices
    const [products] = await queryInterface.sequelize.query(
      'SELECT id, name, price_per_unit FROM products WHERE is_active = true ORDER BY id'
    );

    // Create product map by name for easy lookup
    const productMap = {};
    products.forEach(p => {
      const nameLower = p.name.toLowerCase();
      if (nameLower.includes('tomate')) productMap.tomatoes = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('salade')) productMap.salad = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('oignon')) productMap.onions = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('carotte')) productMap.carrots = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('steak') || nameLower.includes('haché')) productMap.steaks = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('poulet')) productMap.chicken = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('porc') || nameLower.includes('filet')) productMap.pork = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('veau')) productMap.veal = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('saucisse')) productMap.sausages = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('saumon')) productMap.salmon = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('cabillaud')) productMap.cod = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('crevette')) productMap.shrimp = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('coca')) productMap.cola = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('eau') && nameLower.includes('minérale')) productMap.water = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('jus') && nameLower.includes('orange')) productMap.orangeJuice = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('vin rouge')) productMap.redWine = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('vin blanc')) productMap.whiteWine = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('bière')) productMap.beer = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('cheddar')) productMap.cheddar = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('beurre')) productMap.butter = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('crème')) productMap.cream = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('mozzarella')) productMap.mozzarella = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('burger') || (nameLower.includes('pain') && nameLower.includes('burger'))) productMap.burgerBuns = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('baguette')) productMap.baguette = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('croissant')) productMap.croissants = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('huile') && nameLower.includes('olive')) productMap.oliveOil = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('frite')) productMap.fries = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('riz')) productMap.rice = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('pâtes') || nameLower.includes('penne')) productMap.pasta = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
      else if (nameLower.includes('pomme') && nameLower.includes('terre')) productMap.potatoes = { id: p.id, name: p.name, price: parseFloat(p.price_per_unit) };
    });

    // Menu patterns for realistic orders (only use products that exist)
    const menuPatterns = [];
    
    // Burger meal
    if (productMap.steaks && productMap.burgerBuns && productMap.fries && productMap.cheddar) {
      menuPatterns.push(() => [
        { product: productMap.steaks, qty: 2 },
        { product: productMap.burgerBuns, qty: 4 },
        { product: productMap.fries, qty: 1 },
        { product: productMap.cheddar, qty: 0.3 }
      ]);
    }
    
    // Steak meal
    if (productMap.pork && productMap.fries && productMap.cream) {
      menuPatterns.push(() => [
        { product: productMap.pork, qty: 2 },
        { product: productMap.fries, qty: 1.5 },
        { product: productMap.cream, qty: 2 }
      ]);
    }
    
    // Fish meal
    if (productMap.salmon && productMap.fries && productMap.salad) {
      menuPatterns.push(() => [
        { product: productMap.salmon, qty: 1.5 },
        { product: productMap.fries, qty: 1 },
        { product: productMap.salad, qty: 2 }
      ]);
    }
    
    // Chicken meal
    if (productMap.chicken && productMap.fries && productMap.salad) {
      menuPatterns.push(() => [
        { product: productMap.chicken, qty: 2 },
        { product: productMap.fries, qty: 1 },
        { product: productMap.salad, qty: 2 }
      ]);
    }
    
    // Pasta dish
    if (productMap.pasta && productMap.tomatoes && productMap.mozzarella && productMap.oliveOil) {
      menuPatterns.push(() => [
        { product: productMap.pasta, qty: 1 },
        { product: productMap.tomatoes, qty: 2 },
        { product: productMap.mozzarella, qty: 2 },
        { product: productMap.oliveOil, qty: 0.2 }
      ]);
    }
    
    // Salad
    if (productMap.salad && productMap.tomatoes && productMap.carrots && productMap.cheddar && productMap.baguette) {
      menuPatterns.push(() => [
        { product: productMap.salad, qty: 3 },
        { product: productMap.tomatoes, qty: 1 },
        { product: productMap.carrots, qty: 1 },
        { product: productMap.cheddar, qty: 0.2 },
        { product: productMap.baguette, qty: 2 }
      ]);
    }
    
    // Simple meal
    if (productMap.steaks && productMap.fries) {
      menuPatterns.push(() => [
        { product: productMap.steaks, qty: 1 },
        { product: productMap.fries, qty: 1 }
      ]);
    }
    
    // Fallback: at least one pattern
    if (menuPatterns.length === 0 && products.length > 0) {
      menuPatterns.push(() => [
        { product: { id: products[0].id, name: products[0].name, price: parseFloat(products[0].price_per_unit) }, qty: 1 }
      ]);
    }

    const orderItems = [];
    const orderTotalUpdates = [];
    
    // Get inserted orders
    const [insertedOrders] = await queryInterface.sequelize.query(
      'SELECT id, order_number, total_amount, order_date FROM orders ORDER BY id'
    );

    insertedOrders.forEach((order, index) => {
      const pattern = menuPatterns[index % menuPatterns.length];
      const items = pattern();
      
      let calculatedTotal = 0;
      const itemsForOrder = [];

      // Add main items (filter out undefined products)
      items.filter(item => item.product && item.product.id).forEach(item => {
        const subtotal = parseFloat((item.qty * item.product.price).toFixed(2));
        calculatedTotal += subtotal;
        itemsForOrder.push({
          order_id: order.id,
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.qty,
          unit_price: item.product.price,
          subtotal: subtotal,
          created_at: order.order_date
        });
      });

      // Add drink to 70% of orders
      if (Math.random() < 0.7) {
        const drinks = [];
        if (productMap.cola) drinks.push(productMap.cola);
        if (productMap.water) drinks.push(productMap.water);
        if (productMap.orangeJuice) drinks.push(productMap.orangeJuice);
        if (productMap.beer) drinks.push(productMap.beer);
        if (Math.random() < 0.3) {
          if (productMap.redWine) drinks.push(productMap.redWine);
          if (productMap.whiteWine) drinks.push(productMap.whiteWine);
        }
        if (drinks.length > 0) {
          const drink = drinks[Math.floor(Math.random() * drinks.length)];
          const drinkQty = 1 + Math.floor(Math.random() * 3);
          const drinkSubtotal = parseFloat((drinkQty * drink.price).toFixed(2));
          calculatedTotal += drinkSubtotal;
          itemsForOrder.push({
            order_id: order.id,
            product_id: drink.id,
            product_name: drink.name,
            quantity: drinkQty,
            unit_price: drink.price,
            subtotal: drinkSubtotal,
            created_at: order.order_date
          });
        }
      }

      orderItems.push(...itemsForOrder);
      orderTotalUpdates.push({ id: order.id, total: calculatedTotal.toFixed(2) });
    });

    await queryInterface.bulkInsert('order_items', orderItems, {});

    // Update order totals
    for (const update of orderTotalUpdates) {
      await queryInterface.sequelize.query(
        `UPDATE orders SET total_amount = ${update.total} WHERE id = ${update.id}`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('order_items', null, {});
    await queryInterface.bulkDelete('orders', null, {});
  }
};
