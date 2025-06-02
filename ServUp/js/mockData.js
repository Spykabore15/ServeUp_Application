const mockUsers = {
    admin: {
        password: 'admin123',
        role: 'admin'
    },
    responsable_stocks: {
        password: 'stock123',
        role: 'responsable_stocks'
    },
    responsable_employes: {
        password: 'hrpassword',
        role: 'responsable_employes'
    },
    employe: {
        password: 'employeepassword',
        role: 'employe'
    }
};

// Add more mock data for stocks, employees, orders as needed
const mockStock = [
    { id: 1, name: 'Tomates', quantity: 100, threshold: 20 },
    { id: 2, name: 'Pains Burger', quantity: 50, threshold: 10 },
    { id: 3, name: 'Steaks Hachés', quantity: 30, threshold: 15 },
    { id: 4, name: 'Frites (kg)', quantity: 200, threshold: 50 },
    { id: 5, name: 'Fromage Cheddar', quantity: 40, threshold: 10 },
];

const mockEmployees = [
    { id: 1, name: 'Alice Dupont', position: 'Manager', status: 'Actif', role: 'admin', password: 'alicepass' },
    { id: 2, name: 'Bob Martin', position: 'Cuisinier', status: 'Actif', role: 'employe', password: 'bobpass' },
    { id: 3, name: 'Charlie Durand', position: 'Serveur', status: 'En congé', role: 'employe', password: 'charliepass' },
    { id: 4, name: 'Diana Moreau', position: 'Responsable Stocks', status: 'Actif', role: 'responsable_stocks', password: 'dianapass' },
    // Example of a Responsable Employes if one of the mockUsers was intended to be also an employee
    // { id: 5, name: 'Henry Rhodium', position: 'Responsable RH', status: 'Actif', role: 'responsable_employes', password: 'henrypass' }
];

const mockOrders = [
    { id: 'CMD001', client: 'Table 5', date: '2024-07-18', status: 'livré', amount: 30.00, items: [
        { name: 'Pizza Reine', quantity: 1, price: 14.00 }, { name: 'Soda', quantity: 2, price: 3.00 }, { name: 'Salade Verte', quantity: 1, price: 10.00}
    ] }, 
    { id: 'CMD002', client: 'Table 5', date: '2024-07-20', status: 'livré', amount: 25.50, items: [
        { name: 'Burger Classique', quantity: 1, price: 12.00 },
        { name: 'Frites', quantity: 1, price: 4.50 },
        { name: 'Soda', quantity: 1, price: 3.00 }
    ] },
    { id: 'CMD003', client: 'Jean Dupont', date: '2024-07-20', status: 'en cours', amount: 15.00, items: [
        { name: 'Salade César', quantity: 1, price: 15.00 }
    ] },
    { id: 'CMD004', client: 'Table 2', date: '2024-07-21', status: 'annulé', amount: 32.75, items: [
        { name: 'Pizza Reine', quantity: 1, price: 14.00 },
        { name: 'Burger Classique', quantity: 1, price: 12.00 },
        { name: 'Soda', quantity: 2, price: 3.00 }
    ] },
    { id: 'CMD005', client: 'Emporter', date: '2024-07-21', status: 'livré', amount: 18.20, items: [
        { name: 'Wrap Poulet', quantity: 1, price: 10.00 },
        { name: "Jus d'orange", quantity: 1, price: 4.00 },
        { name: 'Cookie', quantity: 1, price: 4.20 }
    ] },
    { id: 'CMD006', client: 'Table 3', date: '2024-07-22', status: 'livré', amount: 45.00, items: [
        { name: 'Pizza Reine', quantity: 2, price: 14.00 }, { name: 'Soda', quantity: 3, price: 3.00 }, { name: 'Frites', quantity: 2, price: 4.00}
    ] },
    { id: 'CMD007', client: 'Alice Martin', date: '2024-07-23', status: 'livré', amount: 12.50, items: [
        { name: 'Café Gourmand', quantity: 1, price: 12.50 }
    ] },
    { id: 'CMD008', client: 'Table 1', date: '2024-07-24', status: 'en cours', amount: 55.00, items: [
        { name: 'Burger Classique', quantity: 2, price: 12.00 }, { name: 'Salade César', quantity: 1, price: 15.00 }, { name: 'Soda', quantity: 4, price: 4.00}
    ] }
];

const mockWasteData = [
    { id: 1, productName: 'Tomates', quantityWasted: 5, unit: 'kg', date: '2024-07-20', reason: 'Périmées' },
    { id: 2, productName: 'Pains Burger', quantityWasted: 10, unit: 'unités', date: '2024-07-21', reason: 'Abîmés' },
    { id: 3, productName: 'Laitue', quantityWasted: 2, unit: 'pièces', date: '2024-07-21', reason: 'Non consommée' },
    { id: 4, productName: 'Poulet', quantityWasted: 3, unit: 'kg', date: '2024-07-22', reason: 'Périmé' },
];

var mockSuppliers = [
    {
        id: 'sup1',
        name: 'Ferme de la Vallée',
        contactPerson: 'Jean Dupont',
        email: 'jean.dupont@fermevallee.com',
        phone: '0123456789',
        address: '1 Rue de la Ferme, 75000 Campagne',
        productsOffered: 'Légumes bio, Fruits de saison, Tomates',
        references: 'Fournisseur principal pour les légumes.'
    },
    {
        id: 'sup2',
        name: 'Boulangerie du Coin',
        contactPerson: 'Marie Claire',
        email: 'contact@boulangerieducoin.fr',
        phone: '0987654321',
        address: '12 Avenue du Pain, 75010 Paris',
        productsOffered: 'Pains artisanaux, Viennoiseries',
        references: 'Commande hebdomadaire de pains burger.'
    },
    {
        id: 'sup3',
        name: 'Grossiste Boissons Express',
        contactPerson: 'Alain Robert',
        email: 'commercial@boissonsexpress.com',
        phone: '0102030405',
        address: 'Zone Industrielle Sud, 93000 Bobigny',
        productsOffered: 'Sodas, Jus de fruits, Bières, Vins',
        references: 'Contrat annuel, livraison bi-hebdomadaire.'
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { mockUsers, mockStock, mockEmployees, mockOrders, mockWasteData, mockSuppliers };
}
