'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const suppliers = [
      {
        name: 'Ferme Bio de la Vallée',
        contact_person: 'Jean Dupont',
        email: 'contact@fermebiovallee.fr',
        phone: '01.23.45.67.89',
        address: 'Chemin des Vignes, 78230 Le Pecq',
        products_offered: 'Légumes bio, Fruits de saison, Salades, Tomates, Carottes',
        rating: 5,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Boulangerie Artisanale Le Pain Doré',
        contact_person: 'Marie-Louise Bernard',
        email: 'commande@paindore.fr',
        phone: '01.34.56.78.90',
        address: '45 Avenue des Champs, 75008 Paris',
        products_offered: 'Pains artisanaux, Baguettes tradition, Viennoiseries, Pains burger',
        rating: 5,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Distributeur Boissons Premium',
        contact_person: 'Alain Robert',
        email: 'commercial@boissonspremium.fr',
        phone: '01.45.67.89.01',
        address: 'Zone Industrielle Nord, 93290 Tremblay-en-France',
        products_offered: 'Sodas, Jus de fruits, Eaux minérales, Bières artisanales, Vins',
        rating: 4,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Boucherie Charcuterie La Viande Noble',
        contact_person: 'Pierre Martin',
        email: 'commande@viandenoble.fr',
        phone: '01.56.78.90.12',
        address: '28 Rue des Bouchers, 75015 Paris',
        products_offered: 'Bœuf premium, Poulet fermier, Porc, Veau, Charcuterie',
        rating: 5,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Poissonnerie Maritime',
        contact_person: 'Sophie Leclerc',
        email: 'achats@poissonnerie-maritime.fr',
        phone: '01.67.89.01.23',
        address: 'Port de Boulogne-sur-Mer, 62200 Boulogne-sur-Mer',
        products_offered: 'Poissons frais, Fruits de mer, Crustacés, Saumon',
        rating: 4,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Fromagerie Les Saveurs d\'Auvergne',
        contact_person: 'Claire Dubois',
        email: 'vente@saveurs-auvergne.fr',
        phone: '01.78.90.12.34',
        address: '15 Rue du Fromage, 63000 Clermont-Ferrand',
        products_offered: 'Fromages AOC, Beurre, Crème fraîche, Yaourts',
        rating: 5,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('suppliers', suppliers, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('suppliers', null, {});
  }
};
