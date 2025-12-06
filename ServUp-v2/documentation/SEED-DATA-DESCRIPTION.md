# ServUp v2.0 - Seed Data Description

This document describes the realistic sample data populated in the database for demonstration and testing purposes.

---

## Overview

The seed data represents a **medium-sized restaurant** with:
- **15 employees** across various roles
- **40+ products** covering all menu categories
- **55 orders** spanning the past 3 months
- **6 suppliers** providing various products
- **10 product categories**
- **25 waste records** tracking food loss
- **8 user accounts** linked to employees

---

## Data Breakdown

### Users (8 accounts)

| Username | Role | Linked Employee | Password |
|----------|------|-----------------|----------|
| `admin` | Administrator | Alice Dubois (Manager) | `admin123` |
| `diana.moreau` | Stock Manager | Diana Moreau | `stock123` |
| `sophie.laurent` | HR Manager | Sophie Laurent | `hr123` |
| `charlie.durand` | Employee | Charlie Durand (Server) | `emp123` |
| `bob.martin` | Employee | Bob Martin (Chef) | `chef123` |
| `emma.bernard` | Employee | Emma Bernard (Waitress) | `serveuse123` |
| `camille.lefebvre` | Employee | Camille Lefebvre (Sous-Chef) | `souschef123` |
| `julie.david` | Employee | Julie David (Sommelier) | `sommelier123` |

### Employees (15 staff members)

**Management:**
- Alice Dubois - Manager Général (hired 2020-01-15)
- Sophie Laurent - Responsable RH (hired 2020-08-01)

**Kitchen Staff:**
- Bob Martin - Chef Cuisinier (hired 2021-03-10)
- Camille Lefebvre - Sous-Chef (hired 2022-02-14)
- François Petit - Commis de Cuisine (hired 2023-05-20)
- Nicolas Simon - Commis de Cuisine (hired 2023-09-10)
- Lucas Roux - Plongeur (hired 2023-07-15)

**Service Staff:**
- Charlie Durand - Serveur Principal (hired 2022-06-01)
- Emma Bernard - Serveuse (hired 2023-01-10)
- Thomas Garcia - Serveur (hired 2023-03-22)
- Céline Rousseau - Serveuse (hired 2023-06-12)
- Marine Michel - Hôtesse d'Accueil (hired 2023-04-18)

**Specialized:**
- Diana Moreau - Responsable Stocks (hired 2021-09-15)
- Julie David - Sommelier (hired 2022-11-05)
- Antoine Leroy - Barman (hired 2022-08-30)

**Status Distribution:**
- Active: 14 employees
- On Leave: 1 employee (Charlie Durand - temporarily)

### Products (40+ items)

**Categories and Counts:**
1. **Légumes (7 items):** Tomates, Salade, Oignons, Carottes, Courgettes, Aubergines, Poivrons
2. **Viandes (5 items):** Steaks Hachés, Poulet, Filet de Porc, Escalopes de Veau, Saucisses
3. **Poissons (3 items):** Saumon, Cabillaud, Crevettes
4. **Boissons (6 items):** Coca-Cola, Eau Minérale, Jus d'Orange, Vin Rouge, Vin Blanc, Bière
5. **Produits Laitiers (5 items):** Cheddar, Beurre, Crème Fraîche, Mozzarella, Parmesan
6. **Pains et Pâtisseries (4 items):** Pains Burger, Baguette, Croissants, Pain de Mie
7. **Épices et Condiments (6 items):** Huile d'Olive, Sel, Poivre, Herbes de Provence, Ail, Sauce Tomate
8. **Surgelés (2 items):** Frites, Légumes Surgelés
9. **Céréales et Féculents (3 items):** Riz Basmati, Pâtes Penne, Pommes de Terre
10. **Fruits (3 items):** Citrons, Fruits Rouges, Pommes

**Stock Status:**
- Products with low stock (quantity <= threshold): ~8-10 items
- Products with adequate stock: ~30-32 items
- Products with expiration dates: Perishable items have expiration dates set

### Suppliers (6 suppliers)

1. **Ferme Bio de la Vallée** ⭐⭐⭐⭐⭐ - Vegetables and fruits
2. **Boulangerie Artisanale Le Pain Doré** ⭐⭐⭐⭐⭐ - Breads and pastries
3. **Distributeur Boissons Premium** ⭐⭐⭐⭐ - Beverages
4. **Boucherie Charcuterie La Viande Noble** ⭐⭐⭐⭐⭐ - Meats
5. **Poissonnerie Maritime** ⭐⭐⭐⭐ - Fish and seafood
6. **Fromagerie Les Saveurs d'Auvergne** ⭐⭐⭐⭐⭐ - Dairy products

### Orders (55 orders)

**Time Distribution:**
- Orders spread over the past **90 days**
- **Higher volume on weekends** (Saturday/Sunday)
- More recent orders (last 30 days): ~25 orders
- Older orders (60-90 days ago): ~15 orders

**Status Distribution:**
- **Completed:** ~70% (38-40 orders)
- **Preparing:** ~12% (6-8 orders)
- **Pending:** ~10% (5-6 orders)
- **Cancelled:** ~5% (2-3 orders)

**Payment Status:**
- **Paid:** Most completed orders
- **Unpaid:** Pending/preparing orders
- **Refunded:** Cancelled orders

**Order Details:**
- **Order amounts:** €15 - €120 (realistic restaurant prices)
- **Items per order:** 2-5 items typically
- **Customer types:** Table numbers, customer names, delivery addresses, takeout
- **Served by:** Various waitstaff (employees 3, 5, 10, 14, 15)

### Order Items

- **Total items:** ~200-250 order items across all orders
- **Menu patterns:** Realistic combinations (burger meals, steak meals, fish meals, pasta, salads)
- **Drinks included:** 70% of orders include beverages
- **Product snapshots:** Product names stored to preserve order history even if products are deleted

### Waste Records (25 records)

**Time Distribution:**
- Records spread over the past **60 days**
- Multiple waste events per week

**Product Types:**
- **Perishables:** 70% of waste records (tomatoes, salads, chicken, fish, dairy, breads)
- **Other items:** 30% of waste records

**Waste Reasons:**
- Expired
- Past expiration date
- Wilted/Spoiled
- Stale
- Damage
- Accidental opening
- Mold
- Overcooked
- Excess preparation
- Order error

**Monetary Impact:**
- Estimated total waste value: €200-300 over 60 days
- Individual waste records: €2-50 per incident

---

## Realistic Characteristics

### 1. **Temporal Distribution**
- More orders on weekends (Friday-Sunday)
- Lunch rush (12:00-14:00) and dinner rush (19:00-21:00)
- Orders distributed realistically across the week

### 2. **Order Patterns**
- Typical restaurant meal combinations
- Drinks commonly included
- Varied order sizes (single meals to group orders)

### 3. **Inventory Realism**
- Some products below threshold (low stock alerts)
- Expiration dates on perishables
- Realistic quantities for restaurant operations
- Price ranges appropriate for French restaurant market

### 4. **Employee Diversity**
- Mix of full-time and part-time staff
- Various hire dates (representing turnover and growth)
- Realistic salary ranges
- Emergency contacts included

### 5. **Customer Variety**
- Mix of table numbers and customer names
- Delivery addresses
- Takeout orders
- Regular customers implied through repeated names

### 6. **Supplier Relationships**
- Multiple suppliers per category
- Quality ratings (1-5 stars)
- Realistic contact information
- French addresses

---

## Usage in Testing

This seed data supports testing of:

✅ **Dashboard Statistics**
- KPIs show realistic numbers
- Charts display meaningful trends
- Role-based views work correctly

✅ **CRUD Operations**
- Products with various quantities and statuses
- Orders in different states for workflow testing
- Employees for management testing

✅ **Business Logic**
- Low stock alerts (products below threshold)
- Order processing with inventory deduction
- Waste tracking and reporting

✅ **Role-Based Access**
- Different users see different data based on roles
- Permissions properly enforced

✅ **Search and Filtering**
- Enough data to test pagination
- Various statuses for filtering
- Multiple categories and suppliers

---

## Resetting Seed Data

To reset the database with fresh seed data:

```bash
cd backend
npm run db:reset
```

This will:
1. Drop all tables
2. Re-run all migrations
3. Re-seed with fresh data

---

**Note:** The seed data is designed to be realistic but not exhaustive. It provides enough variety to demonstrate all system features while remaining manageable for development and testing.

