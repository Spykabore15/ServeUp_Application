# ServUp V2 - Database Schema

## Entity-Relationship Diagram (ERD)

### Tables Overview

1. **users** - System users with authentication
2. **employees** - Restaurant staff members
3. **products** - Inventory items
4. **categories** - Product categories
5. **suppliers** - Product suppliers
6. **orders** - Customer orders
7. **order_items** - Items within each order
8. **waste_records** - Tracking wasted products
9. **audit_logs** - System activity tracking

---

## Table Definitions

### 1. users
Stores system login credentials and user roles.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique user ID |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Login username |
| email | VARCHAR(100) | UNIQUE, NOT NULL | User email |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| role | ENUM | NOT NULL | admin, responsable_stocks, responsable_employes, employe |
| employee_id | INTEGER | FOREIGN KEY → employees(id), NULL | Link to employee record if applicable |
| is_active | BOOLEAN | DEFAULT true | Account status |
| last_login | TIMESTAMP | NULL | Last login timestamp |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation date |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

**Indexes:** username, email, role

---

### 2. employees
Restaurant staff information.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique employee ID |
| first_name | VARCHAR(50) | NOT NULL | Employee first name |
| last_name | VARCHAR(50) | NOT NULL | Employee last name |
| position | VARCHAR(100) | NOT NULL | Job position (Manager, Chef, Waiter, etc.) |
| email | VARCHAR(100) | UNIQUE, NULL | Employee email |
| phone | VARCHAR(20) | NULL | Contact phone number |
| hire_date | DATE | NOT NULL | Date of hire |
| status | ENUM | NOT NULL | active, on_leave, terminated |
| salary | DECIMAL(10,2) | NULL | Monthly salary (optional) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation date |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Indexes:** status, last_name

---

### 3. categories
Product categorization.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique category ID |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Category name (Vegetables, Meats, Beverages, etc.) |
| description | TEXT | NULL | Category description |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |

---

### 4. suppliers
Supplier contact information.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique supplier ID |
| name | VARCHAR(150) | NOT NULL | Supplier company name |
| contact_person | VARCHAR(100) | NULL | Contact person name |
| email | VARCHAR(100) | NULL | Supplier email |
| phone | VARCHAR(20) | NULL | Contact phone |
| address | TEXT | NULL | Supplier address |
| products_offered | TEXT | NULL | Description of products offered |
| rating | INTEGER | NULL, CHECK (1-5) | Supplier rating (1-5 stars) |
| is_active | BOOLEAN | DEFAULT true | Active status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Indexes:** name, is_active

---

### 5. products
Inventory items (stock).

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique product ID |
| name | VARCHAR(150) | NOT NULL | Product name |
| description | TEXT | NULL | Product description |
| category_id | INTEGER | FOREIGN KEY → categories(id), NULL | Product category |
| quantity | DECIMAL(10,2) | NOT NULL, DEFAULT 0 | Current stock quantity |
| unit | VARCHAR(20) | NOT NULL | Unit of measurement (kg, liters, pieces) |
| threshold | DECIMAL(10,2) | DEFAULT 10 | Low stock alert threshold |
| price_per_unit | DECIMAL(10,2) | NULL | Cost per unit |
| supplier_id | INTEGER | FOREIGN KEY → suppliers(id), NULL | Main supplier |
| expiration_date | DATE | NULL | Product expiration date (for perishables) |
| sku | VARCHAR(50) | UNIQUE, NULL | Stock keeping unit |
| is_active | BOOLEAN | DEFAULT true | Active product |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Indexes:** name, category_id, supplier_id, sku
**Computed:** is_low_stock (quantity <= threshold)

---

### 6. orders
Customer orders.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique order ID |
| order_number | VARCHAR(50) | UNIQUE, NOT NULL | Human-readable order ID (CMD001) |
| customer_name | VARCHAR(100) | NOT NULL | Customer or table identifier |
| order_date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Order creation time |
| status | ENUM | NOT NULL | pending, preparing, completed, cancelled |
| total_amount | DECIMAL(10,2) | NOT NULL, DEFAULT 0 | Total order value |
| payment_status | ENUM | NOT NULL | unpaid, paid, refunded |
| notes | TEXT | NULL | Special instructions |
| served_by | INTEGER | FOREIGN KEY → employees(id), NULL | Employee who took the order |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

**Indexes:** order_number, status, order_date

---

### 7. order_items
Items within each order.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique item ID |
| order_id | INTEGER | FOREIGN KEY → orders(id), NOT NULL, ON DELETE CASCADE | Parent order |
| product_id | INTEGER | FOREIGN KEY → products(id), NULL | Product ordered (can be NULL if deleted) |
| product_name | VARCHAR(150) | NOT NULL | Product name snapshot |
| quantity | DECIMAL(10,2) | NOT NULL | Quantity ordered |
| unit_price | DECIMAL(10,2) | NOT NULL | Price per unit at time of order |
| subtotal | DECIMAL(10,2) | NOT NULL | quantity × unit_price |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation date |

**Indexes:** order_id, product_id

---

### 8. waste_records
Tracking product waste and losses.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique waste record ID |
| product_id | INTEGER | FOREIGN KEY → products(id), NULL | Wasted product |
| product_name | VARCHAR(150) | NOT NULL | Product name snapshot |
| quantity | DECIMAL(10,2) | NOT NULL | Quantity wasted |
| unit | VARCHAR(20) | NOT NULL | Unit of measurement |
| reason | VARCHAR(255) | NULL | Reason for waste (Expired, Damaged, etc.) |
| reported_by | INTEGER | FOREIGN KEY → employees(id), NULL | Employee who reported |
| waste_date | DATE | NOT NULL | Date of waste occurrence |
| estimated_value | DECIMAL(10,2) | NULL | Estimated monetary loss |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation |

**Indexes:** product_id, waste_date, reason

---

### 9. audit_logs
System activity tracking for security and debugging.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique log ID |
| user_id | INTEGER | FOREIGN KEY → users(id), NULL | User who performed action |
| action | VARCHAR(100) | NOT NULL | Action type (CREATE, UPDATE, DELETE, LOGIN) |
| table_name | VARCHAR(50) | NULL | Affected database table |
| record_id | INTEGER | NULL | Affected record ID |
| old_values | JSON | NULL | Previous values (for updates/deletes) |
| new_values | JSON | NULL | New values (for creates/updates) |
| ip_address | VARCHAR(45) | NULL | User's IP address |
| user_agent | TEXT | NULL | Browser/client info |
| timestamp | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Action timestamp |

**Indexes:** user_id, action, table_name, timestamp

---

## Relationships

### One-to-Many
- `categories` → `products` (one category has many products)
- `suppliers` → `products` (one supplier can supply many products)
- `employees` → `orders` (one employee can serve many orders)
- `orders` → `order_items` (one order has many items)
- `products` → `order_items` (one product can appear in many orders)
- `products` → `waste_records` (one product can have many waste records)
- `employees` → `waste_records` (one employee can report many waste records)
- `users` → `audit_logs` (one user generates many log entries)

### One-to-One
- `users` → `employees` (optional: a user account can be linked to an employee record)

---

## Cardinality Notation

```
users (1) ←→ (0..1) employees
categories (1) ←→ (0..*) products
suppliers (1) ←→ (0..*) products
employees (1) ←→ (0..*) orders
orders (1) ←→ (1..*) order_items
products (1) ←→ (0..*) order_items
products (1) ←→ (0..*) waste_records
employees (1) ←→ (0..*) waste_records
users (1) ←→ (0..*) audit_logs
```

---

## Data Integrity Rules

1. **Cascading Deletes:**
   - When an order is deleted, all its order_items are deleted
   - When a user is deleted, their audit logs remain (set user_id to NULL)

2. **Soft Deletes:**
   - Users, products, suppliers use `is_active` flag instead of hard delete
   - Employees use `status = 'terminated'` instead of deletion

3. **Required Foreign Keys:**
   - order_items MUST have a valid order_id
   - products SHOULD have category_id and supplier_id (can be NULL temporarily)

4. **Constraints:**
   - order total_amount = SUM(order_items.subtotal)
   - product quantity must be >= 0
   - supplier rating must be between 1-5
   - All usernames and emails must be unique

---

## Sample Data Requirements

For testing and demonstration, the database should be seeded with:
- 4 users (one for each role)
- 8-10 employees
- 3-5 categories
- 3-5 suppliers
- 20-30 products (varied quantities, some below threshold)
- 15-20 orders (mix of statuses)
- 30-50 order items
- 5-10 waste records
- Sample audit log entries

---

**Version:** 1.0  
**Last Updated:** November 21, 2025  
**Author:** ServUp Development Team

