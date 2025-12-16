# Database Schema Overview - ServUp-v2

## a) Core Entities

| Entity | Purpose | Attributes |
|--------|---------|------------|
| **Users** | Authentication and access control | `username`, `email`, `password_hash`, `role`, <u>`employee_id`</u>, `status`, `is_active`, `first_name`, `last_name`, `signup_message`, `last_login` |
| **Employees** | Employee and HR management | `first_name`, `last_name`, `position`, `email`, `phone`, `hire_date`, `status`, `salary`, `address`, `emergency_contact` |
| **Products** | Inventory and stock tracking | `name`, `description`, <u>`category_id`</u>, `quantity`, `unit`, `threshold`, `price_per_unit`, <u>`supplier_id`</u>, `expiration_date`, `sku`, `is_active` |
| **Categories** | Product classification | `name`, `description` |
| **Suppliers** | Vendor and supply chain information | `name`, `contact_person`, `email`, `phone`, `address`, `products_offered`, `rating`, `is_active` |

## b) Operational Entities

| Entity | Purpose | Attributes |
|--------|---------|------------|
| **Orders** | Customer order tracking | <u>`order_number`</u>, `customer_name`, `order_date`, `status`, `total_amount`, `payment_status`, `notes`, <u>`served_by`</u> |
| **OrderItems** | List of products in an order | <u>`order_id`</u>, <u>`product_id`</u>, `product_name`, `quantity`, `unit_price`, `subtotal` |
| **WasteRecords** | Product waste monitoring and reporting | <u>`product_id`</u>, `product_name`, `quantity`, `unit`, `reason`, <u>`reported_by`</u>, `waste_date`, `estimated_value` |
| **AuditLogs** | System activity and change tracking | <u>`user_id`</u>, `action`, `table_name`, `record_id`, `old_values`, `new_values`, `ip_address`, `user_agent`, `timestamp` |
| **TokenBlacklist** | JWT token revocation management | `token`, `expires_at`, <u>`user_id`</u> |

---

## Legend
- <u>Underlined attributes</u> = Foreign Keys (FK)
- **Bold entity names** = Primary entities

## Notes
- All entities include `id` as Primary Key (PK) and timestamps (`created_at`, `updated_at`) unless otherwise specified
- Foreign keys establish relationships between entities
- `order_number` in Orders is a Unique Key (UK)
- `sku` in Products is a Unique Key (UK)
- `username` and `email` in Users are Unique Keys (UK)
- `email` in Employees is a Unique Key (UK)
- `name` in Categories is a Unique Key (UK)
- `token` in TokenBlacklist is a Unique Key (UK)

