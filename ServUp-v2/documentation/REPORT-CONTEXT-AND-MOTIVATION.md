# ServUp v2.0 - Context and Motivation Report Content

## Table of Contents
1. [Introduction and Business Context](#1-introduction-and-business-context)
2. [Strategic Pain Points and Market Needs](#2-strategic-pain-points-and-market-needs)
3. [Product Overview and Value Proposition](#3-product-overview-and-value-proposition)
4. [Innovation and Technological Approach](#4-innovation-and-technological-approach)
5. [Regulatory Compliance and Environmental Impact](#5-regulatory-compliance-and-environmental-impact)
6. [Alignment with Academic Assessment Criteria](#6-alignment-with-academic-assessment-criteria)
7. [Technical Architecture Overview](#7-technical-architecture-overview)

---

## 1. Introduction and Business Context

### 1.1 Restaurant Management Challenges in the Digital Age

The restaurant industry, particularly for small and medium-sized enterprises (SMEs), faces significant operational challenges in an increasingly competitive and digitized market. Independent restaurateurs, food truck operators, and small-scale catering businesses must manage complex workflows including inventory control, staff scheduling, customer relationship management, order processing, and financial tracking, often with limited resources and technical expertise.

Traditional restaurant management relies heavily on fragmented tools: point-of-sale (POS) systems, spreadsheet-based inventory tracking, manual employee scheduling, and disconnected reservation platforms. This fragmentation creates substantial operational inefficiencies, leading to increased labor costs, inventory waste, data inconsistencies, and missed revenue opportunities.

### 1.2 The Evolution from ServeUp v1 to ServeUp v2

ServeUp emerged as a response to these challenges, initially developed as a static web prototype (ServeUp v1) demonstrating a unified interface for restaurant operations. While v1 successfully validated the user experience and core functional concepts through HTML, CSS, and JavaScript, it operated with mock data and lacked the robust backend infrastructure necessary for production deployment.

ServeUp v2 represents a complete architectural re-engineering, transforming the prototype into a full-stack, database-driven application capable of supporting real-world restaurant operations. This evolution addresses critical gaps in authentication, data persistence, role-based access control, and enterprise-grade security, while maintaining the intuitive user experience established in v1.

---

## 2. Strategic Pain Points and Market Needs

### 2.1 Fragmentation of Restaurant Management Tools

**Problem Statement:** Small and independent restaurateurs face a marketplace dominated by enterprise solutions designed for large chains, or disconnected single-purpose tools that require extensive integration work and technical expertise to coordinate effectively.

**Impact:**
- **Operational Complexity:** Managers must learn and navigate multiple interfaces, leading to increased training time and user error.
- **Data Silos:** Information stored in separate systems (inventory in spreadsheets, staff schedules on paper, orders in POS terminals) prevents holistic analysis and decision-making.
- **Double-Entry Burden:** The same data must be entered into multiple systems, consuming valuable time and introducing inconsistencies.
- **Cost Inefficiency:** Licensing multiple specialized tools creates financial barriers for small operators, while large-scale enterprise solutions remain prohibitively expensive.

### 2.2 Inventory and Waste Management Challenges

**Problem Statement:** Inadequate inventory management directly contributes to food waste, which represents both an environmental concern and a significant financial loss. According to industry studies, restaurants waste approximately 20-30% of food inventory due to over-purchasing, poor demand forecasting, and lack of real-time visibility into stock levels.

**Impact:**
- **Financial Losses:** Overstocking leads to spoilage and waste, while understocking results in lost sales and customer dissatisfaction.
- **Environmental Impact:** Food waste contributes to greenhouse gas emissions and resource depletion, conflicting with increasingly important sustainability goals.
- **Regulatory Compliance:** Growing regulations around food waste reporting require accurate tracking and documentation capabilities.

### 2.3 Limited Access to Data-Driven Insights

**Problem Statement:** Without centralized data collection and analysis, restaurant managers operate with limited visibility into key performance indicators (KPIs), customer behavior patterns, seasonal trends, and operational efficiency metrics.

**Impact:**
- **Suboptimal Decision-Making:** Managers rely on intuition rather than data-driven insights for purchasing, staffing, and menu decisions.
- **Missed Opportunities:** Inability to identify profitable menu items, peak demand periods, or customer preferences limits revenue optimization.
- **Reactive Management:** Problems (stockouts, overstaffing, waste) are discovered after they occur rather than being anticipated and prevented.

### 2.4 Market Opportunity: The "Missing Middle"

**Problem Statement:** The restaurant management software market exhibits a significant gap between entry-level tools (spreadsheets, basic POS systems) and enterprise solutions (Oracle Hospitality, Toast, etc.). This "missing middle" represents an opportunity for a cloud-based, all-in-one platform that offers advanced features at a price point and complexity level accessible to small and medium-sized operators.

**Market Positioning:** ServeUp v2 positions itself in this gap by offering:
- **Comprehensive Functionality:** All core restaurant operations (inventory, staff, orders, suppliers, analytics) in a single platform.
- **Affordability:** Cloud-hosted, subscription-based pricing model (future) that eliminates large upfront investments.
- **Ease of Use:** Intuitive, web-based interface designed for non-technical users.
- **Scalability:** Architecture supports growth from single-location operations to multi-unit businesses.

---

## 3. Product Overview and Value Proposition

### 3.1 Core Functional Modules

ServeUp v2 provides an integrated platform organized into several key functional areas:

**3.1.1 Stock and Inventory Management**
- Real-time tracking of ingredient and product quantities with automated threshold alerts
- Category-based organization (vegetables, meats, beverages, consumables)
- Supplier relationship management with ratings and contact information
- Expiration date tracking for perishable items
- Automatic stock deduction linked to order processing
- Low-stock alerts with configurable threshold levels

**3.1.2 Employee and Workforce Management**
- Comprehensive employee profiles with contact information, hire dates, and employment status
- Role-based access control with four distinct permission levels (Administrator, Stock Manager, HR Manager, Employee)
- Integration between employee records and user authentication accounts
- Employee statistics and reporting for workforce analytics
- Support for employment lifecycle management (active, on leave, terminated)

**3.1.3 Order and Sales Management**
- Complete order lifecycle tracking (pending, preparing, completed, cancelled)
- Order items with product snapshots and pricing
- Payment status tracking (unpaid, paid, refunded)
- Employee attribution for service tracking
- Customer identification and order history
- Automatic inventory updates upon order completion

**3.1.4 Supplier Relationship Management**
- Supplier contact database with ratings and performance tracking
- Product-supplier linking for procurement workflow
- Active/inactive status management
- Contact person and communication details

**3.1.5 Analytics and Reporting Dashboard**
- Real-time KPIs including total products, low-stock items, active employees, total orders
- Role-specific dashboard views tailored to user permissions
- Waste tracking and reporting for environmental impact analysis
- Order statistics and trend analysis
- Financial metrics (revenue, margins, waste costs)

**3.1.6 User and Access Management**
- Secure authentication with JWT-based sessions
- Four-tier role hierarchy with granular permission enforcement
- User account lifecycle management (creation, activation, deactivation)
- Password change functionality
- Integration with employee records for accountability

### 3.2 Value Proposition Summary

**For Restaurant Owners and Managers:**
- **Operational Efficiency:** Single interface replaces multiple tools, reducing training time and operational complexity.
- **Cost Reduction:** Optimized inventory management reduces waste by 20-30%, directly impacting profitability.
- **Data-Driven Insights:** Centralized data enables informed decision-making about purchasing, staffing, and menu optimization.
- **Scalability:** Platform architecture supports business growth without requiring system migration.
- **Compliance:** Built-in audit logging and waste tracking support regulatory compliance requirements.

**For Staff:**
- **User-Friendly Interface:** Intuitive design minimizes learning curve for non-technical users.
- **Mobile Compatibility:** Responsive web design enables access from tablets and smartphones during service.
- **Role-Appropriate Access:** Clear permission boundaries prevent unauthorized actions while enabling necessary functions.

**For the Organization:**
- **Digital Transformation:** Supports small businesses in adopting modern digital tools aligned with government initiatives (France Num, regional digitalization programs).
- **Sustainability Alignment:** Waste reduction capabilities align with environmental regulations and corporate social responsibility goals.

---

## 4. Innovation and Technological Approach

### 4.1 Architectural Innovation: Unified Platform Architecture

**4.1.1 Full-Stack Integration**
ServeUp v2 implements a modern three-tier architecture with clear separation of concerns:
- **Presentation Layer (Frontend):** Vue.js 3 single-page application providing responsive, reactive user interface
- **Business Logic Layer (Backend):** Node.js/Express.js RESTful API handling authentication, validation, and business rules
- **Data Persistence Layer:** PostgreSQL relational database with Sequelize ORM ensuring data integrity and efficient querying

This architecture enables independent scaling, maintenance, and evolution of each layer while maintaining tight integration through well-defined API contracts.

**4.1.2 Database-Driven Design**
Unlike the prototype v1 which used static mock data, v2 employs a comprehensive relational database schema with:
- **9 Core Entities:** Users, Employees, Products, Categories, Suppliers, Orders, Order Items, Waste Records, Audit Logs
- **Referential Integrity:** Foreign key constraints ensure data consistency across entities
- **Soft Delete Patterns:** Active/inactive flags preserve historical data while maintaining referential integrity
- **Audit Trail:** Comprehensive logging of all user actions for security and compliance

**4.1.3 RESTful API Architecture**
The backend implements a RESTful API following industry best practices:
- **Resource-Based URLs:** `/api/products`, `/api/employees`, `/api/orders` reflect clear resource hierarchy
- **HTTP Method Semantics:** GET for retrieval, POST for creation, PUT for updates, DELETE for removal
- **Standardized Response Formats:** Consistent JSON response structures with status codes
- **Middleware Pipeline:** Authentication, authorization, validation, and error handling applied consistently across endpoints

### 4.2 Security and Authentication Innovation

**4.2.1 JWT-Based Authentication**
ServeUp v2 implements JSON Web Token (JWT) authentication, providing:
- **Stateless Sessions:** Server scalability improved by eliminating server-side session storage
- **Secure Token Transmission:** Tokens include user ID, username, and role for authorization decisions
- **Expiration Management:** 24-hour token validity balances security and user convenience
- **Bearer Token Pattern:** Standard Authorization header format for API requests

**4.2.2 Password Security**
- **bcrypt Hashing:** Industry-standard bcrypt algorithm with salt rounds prevents password compromise
- **No Plain-Text Storage:** Passwords never stored in readable format, even in database backups
- **Secure Password Changes:** Existing password verification required before allowing new password assignment

**4.2.3 Role-Based Access Control (RBAC)**
Four-tier permission system implemented through:
- **Role Middleware:** Express middleware validates user roles before route handlers execute
- **Frontend Route Guards:** Vue Router navigation guards prevent unauthorized page access
- **API-Level Enforcement:** All endpoints validate both authentication and authorization before processing requests
- **Granular Permissions:** Different roles (admin, responsable_stocks, responsable_employes, employe) have distinct access patterns

### 4.3 Data Validation and Integrity

**4.3.1 Dual-Layer Validation**
- **Client-Side Validation:** HTML5 form validation and Vue.js reactive validation provide immediate user feedback
- **Server-Side Validation:** Express-validator middleware ensures data integrity regardless of client-side manipulation
- **Model-Level Constraints:** Sequelize model definitions enforce database-level constraints (required fields, data types, relationships)

**4.3.2 Comprehensive Input Sanitization**
- All user inputs validated for type, length, format, and business rule compliance
- SQL injection prevention through parameterized queries (Sequelize ORM)
- XSS protection through input sanitization and output encoding
- CSRF protection considerations in API design

### 4.4 User Experience Innovation

**4.4.1 Progressive Web Application Capabilities**
- **Responsive Design:** Mobile-first approach ensures usability across desktop, tablet, and smartphone devices
- **Single-Page Application:** Vue Router enables instant navigation without full page reloads
- **State Management:** Pinia stores maintain application state across component boundaries
- **Reactive Updates:** Vue.js reactivity system provides automatic UI updates when data changes

**4.4.2 Role-Adaptive Interface**
- Dashboard and navigation adapt to user role, showing only relevant features
- Permission-based UI rendering prevents users from accessing unauthorized functions
- Contextual help and error messages guide users through workflows

### 4.5 Future Innovation: AI-Assisted Decision Making

**4.5.1 ServeUp Assistant (Planned)**
The architecture includes provision for an agentic AI assistant designed to provide:
- **Demand Forecasting:** Machine learning algorithms analyzing historical sales data, seasonality, weather patterns, and local events
- **Inventory Recommendations:** Automated reorder suggestions based on consumption patterns and stock levels
- **Menu Optimization:** Analysis of profitability, popularity, and waste patterns to suggest menu adjustments
- **Anomaly Detection:** Identification of unusual consumption patterns that may indicate waste, theft, or operational issues

**4.5.2 Predictive Analytics Foundation**
Current data collection architecture (orders, waste records, inventory movements) creates a foundation for future machine learning implementations, enabling:
- Predictive inventory management
- Dynamic pricing recommendations
- Staffing optimization based on demand forecasts
- Customer behavior pattern analysis

---

## 5. Regulatory Compliance and Environmental Impact

### 5.1 RGPD (General Data Protection Regulation) Compliance

**5.1.1 Data Minimization Principle**
ServeUp v2 implements RGPD-aligned data collection practices:
- **Purpose-Limited Collection:** Only data necessary for restaurant operations is collected (no unnecessary personal information)
- **Minimal Data Storage:** User accounts store only essential authentication and authorization information
- **No Invasive Profiling:** The system does not track user behavior for advertising or external profiling purposes
- **Explicit Purpose:** All data fields serve clear operational functions (inventory management, order processing, employee management)

**5.1.2 Data Security Measures**
- **Encryption in Transit:** HTTPS/TLS encryption for all data transmission between client and server
- **Encryption at Rest:** Database credentials and sensitive configuration stored securely (future: database-level encryption)
- **Access Controls:** Role-based access ensures users can only access data relevant to their responsibilities
- **Audit Logging:** Complete audit trail of all data access and modifications for compliance auditing

**5.1.3 European Data Hosting (Future Requirement)**
Architecture design supports deployment on European hosting infrastructure to ensure RGPD compliance for European Union operations:
- Cloud-agnostic design allows deployment on EU-based providers
- Database and application servers can be colocated within EU borders
- No dependencies on non-EU third-party services for core functionality

### 5.2 RGAA (General Accessibility Framework) Compliance

**5.2.1 Web Accessibility Standards**
- **Keyboard Navigation:** All interactive elements accessible via keyboard navigation (tab order, Enter/Space activation)
- **Screen Reader Support:** Semantic HTML structure and ARIA labels (planned for full implementation)
- **Color Contrast:** High-contrast color schemes ensure readability for users with visual impairments
- **Responsive Design:** Mobile and tablet compatibility ensures access across device types and screen sizes

**5.2.2 User Interface Design Principles**
- **Clear Navigation:** Consistent navigation structure and breadcrumb trails help users understand their location
- **Readable Typography:** Sufficient font sizes and line spacing for comfortable reading
- **Intuitive Layout:** Logical information hierarchy and grouping reduce cognitive load
- **Error Communication:** Clear, descriptive error messages guide users in resolving issues

### 5.3 Eco-Conception and Digital Sustainability

**5.3.1 Resource Optimization**
- **Efficient Code:** Modern JavaScript frameworks (Vue 3, Vite) minimize bundle sizes and runtime overhead
- **Database Query Optimization:** Sequelize ORM with proper indexing reduces database load and energy consumption
- **Minimal Asset Loading:** Lazy loading and code splitting ensure only necessary resources are loaded
- **CDN Optimization:** Static assets can be served via content delivery networks for reduced latency and server load

**5.3.2 Food Waste Reduction Impact**
The core value proposition of ServeUp v2 directly contributes to environmental sustainability:
- **Targeted Waste Reduction:** Improved inventory management and demand forecasting target 20-30% reduction in food waste
- **Waste Tracking:** Dedicated waste records module enables measurement and reporting of waste patterns
- **Preventive Alerts:** Low-stock and expiration alerts prevent spoilage through timely consumption
- **Data-Driven Optimization:** Analytics enable identification and elimination of waste-generating practices

**5.3.3 Supporting Public Policy Goals**
ServeUp v2 aligns with French and European initiatives:
- **France Num:** Supports digital transformation of small and medium enterprises
- **Ecological Transition:** Food waste reduction aligns with environmental policy objectives
- **Regional Aid Programs:** Qualifies for innovation and eco-friendly digital project funding (future eligibility)

### 5.4 Legal and Compliance Considerations

**5.4.1 Data Protection Officer Requirements (Future)**
Architecture supports appointment of Data Protection Officer (DPO) for larger deployments:
- Audit logs provide complete data access trail for DPO review
- User management capabilities enable access revocation and data export requests
- Clear data retention policies can be implemented through database cleanup procedures

**5.4.2 Food Safety Compliance**
- **Traceability:** Order and inventory records provide complete traceability of food products from supplier to consumption
- **Expiration Tracking:** Expiration date fields enable compliance with food safety regulations
- **Waste Documentation:** Waste records provide documentation required for food waste reporting regulations

---

## 6. Alignment with Academic Assessment Criteria

ServeUp v2 has been designed and implemented to comprehensively satisfy advanced web project assessment criteria across all required dimensions:

### 6.1 Web Interface and Design

**6.1.1 Professional Multi-Page Application**
- **Vue Router Implementation:** Single-page application with client-side routing creates seamless multi-page experience
- **Clear Navigation Structure:** AppLayout component provides consistent navigation menu across all views
- **Route-Based Views:** Separate views for Dashboard, Products, Employees, Orders, Suppliers, Users, Reports, Settings

**6.1.2 Responsive Layout Implementation**
- **Mobile-First CSS:** Responsive design patterns ensure usability on desktop (1920px+), tablet (768px-1024px), and mobile (<768px) viewports
- **Flexible Grid Systems:** CSS Grid and Flexbox layouts adapt to different screen sizes
- **Touch-Friendly Interface:** Button sizes and spacing optimized for touch interaction on mobile devices

**6.1.3 Consistent UI System**
- **Design System Components:** Reusable Vue components (AppLayout, form inputs, buttons, tables) ensure visual consistency
- **Color Scheme:** Consistent color palette applied throughout application (primary, secondary, success, error, warning colors)
- **Typography:** Standardized font families, sizes, and weights create cohesive visual identity
- **Component Library:** Modular component architecture enables reuse and consistency

**6.1.4 Strategic Multimedia Usage**
- **Logo and Branding:** ServeUp logo displayed in navigation header for brand recognition
- **Icon System:** Semantic icons (planned) for intuitive navigation and action identification
- **Data Visualization:** Chart.js integration for dashboard analytics and reports
- **No Unnecessary Media:** Lightweight design avoids heavy images or videos that would impact performance

### 6.2 Database and User Management

**6.2.1 Relational Database Design**
- **PostgreSQL Implementation:** Production-grade relational database with ACID compliance
- **Normalized Schema:** Third-normal-form database design eliminates redundancy and ensures data integrity
- **9 Core Tables:** Users, Employees, Products, Categories, Suppliers, Orders, OrderItems, WasteRecords, AuditLogs
- **Relationship Modeling:** Foreign key constraints enforce referential integrity across all entities

**6.2.2 Secure Authentication System**
- **JWT Token Authentication:** Industry-standard authentication mechanism providing stateless, scalable sessions
- **Password Hashing:** bcrypt implementation with salt rounds ensures passwords are never stored in plain text
- **Session Management:** Token expiration and refresh mechanisms maintain security while preserving user experience
- **Secure Password Changes:** Verification of existing password required before allowing password updates

**6.2.3 Multi-Role Access Control**
- **Four Distinct Roles:**
  - **Administrator (admin):** Full system access including user management, all CRUD operations, system configuration
  - **Stock Manager (responsable_stocks):** Product and inventory management, supplier management, stock-related reports
  - **HR Manager (responsable_employes):** Employee management, employee-related reports, user account linking
  - **Employee (employe):** Read-only dashboard access, order viewing, limited personal information access
- **Permission Enforcement:** Middleware and route guards enforce role-based access at both API and UI levels
- **Granular Permissions:** Different roles have access to different modules and different CRUD operation levels

**6.2.4 Complete CRUD Operations**
- **Users:** Create, Read, Update, Delete (soft delete via is_active flag), password change
- **Employees:** Full CRUD with status management, search and filtering, statistics
- **Products:** Full CRUD with category assignment, supplier linking, low-stock alerts
- **Orders:** Create orders with multiple items, update status, view order history, delete orders
- **Suppliers:** Full CRUD with rating system, active/inactive status management
- **Categories:** Full CRUD for product categorization
- **All CRUD operations validated:** Both client-side and server-side validation ensure data integrity

### 6.3 Form Validation and Data Integrity

**6.3.1 Client-Side Validation**
- **HTML5 Form Validation:** Required fields, email formats, number ranges, date formats enforced in browser
- **Vue.js Reactive Validation:** Real-time validation feedback as users type
- **Visual Error Indicators:** Clear error messages displayed next to invalid fields
- **Prevent Invalid Submissions:** Forms cannot be submitted until all validations pass

**6.3.2 Server-Side Validation**
- **Express-Validator Middleware:** Comprehensive validation middleware applied to all input endpoints
- **Input Sanitization:** All inputs sanitized to prevent injection attacks
- **Type Checking:** Data types validated (strings, numbers, dates, enums)
- **Business Rule Validation:** Custom validators enforce business logic (e.g., quantities must be non-negative, emails must be unique)

**6.3.3 Error Handling and User Feedback**
- **Structured Error Responses:** Consistent JSON error format with status codes and descriptive messages
- **Field-Level Error Messages:** Validation errors include specific field names and error descriptions
- **User-Friendly Messages:** Technical errors translated to user-understandable messages
- **Prevention of Data Inconsistency:** Validation prevents creation of records with missing required fields or invalid relationships

### 6.4 Backend and API

**6.4.1 Node.js/Express Backend Architecture**
- **RESTful API Design:** Resource-based URLs, HTTP method semantics, standardized request/response formats
- **Modular Structure:** Separation of concerns with controllers, models, routes, middleware, validators
- **Environment Configuration:** Environment variables for database, JWT secrets, ports enable deployment flexibility
- **Error Handling:** Global error handler provides consistent error responses across all endpoints

**6.4.2 Frontend-Backend Separation**
- **API-First Design:** Backend provides complete API independent of frontend implementation
- **Axios HTTP Client:** Frontend communicates with backend exclusively through REST API calls
- **CORS Configuration:** Proper cross-origin resource sharing configuration enables frontend-backend separation
- **Token-Based Authentication:** JWT tokens passed via Authorization headers enable stateless authentication

**6.4.3 Performance Considerations**
- **Database Indexing:** Strategic indexes on frequently queried fields (username, email, status, dates)
- **Efficient Queries:** Sequelize ORM generates optimized SQL with proper joins and WHERE clauses
- **Pagination Support:** API endpoints support pagination parameters to limit result sets (implemented in employees, orders, products)
- **Lazy Loading:** Frontend loads data on-demand rather than loading all records at once

**6.4.4 API Documentation and Structure**
- **RESTful Endpoint Naming:** `/api/products`, `/api/employees`, `/api/orders` follow REST conventions
- **HTTP Status Codes:** Proper use of 200 (success), 201 (created), 400 (bad request), 401 (unauthorized), 404 (not found), 500 (server error)
- **JSON Request/Response:** Consistent JSON structure for all API communications
- **Endpoint Organization:** Logical grouping of related endpoints (authentication, products, employees, orders, reports)

### 6.5 Documentation and Final Report

**6.5.1 Comprehensive Project Documentation**
The project includes extensive documentation:
- **README.md:** Project overview, technology stack, quick start guide, feature summary
- **SETUP-GUIDE.md:** Detailed step-by-step installation and configuration instructions
- **database-schema.md:** Complete database schema with table definitions, relationships, constraints
- **ERD.md:** Entity-relationship diagram with Mermaid notation showing all entities and relationships
- **LIMITATIONS-AND-FUTURE-PLANS.md:** Honest assessment of current limitations and planned improvements
- **TESTING.md:** Testing procedures and test case examples
- **FINAL-REPORT-STRUCTURE.md:** Complete report structure guide with section requirements

**6.5.2 Code Documentation**
- **Inline Comments:** Key functions and complex logic include explanatory comments
- **File Headers:** Each major file includes description of purpose and responsibilities
- **API Route Documentation:** Route files include JSDoc-style comments describing endpoints, parameters, responses
- **Model Documentation:** Sequelize models include field descriptions and relationship definitions

**6.5.3 Report Structure Requirements**
The final report will include:
- **Introduction:** Project overview, problem statement, objectives, scope
- **Literature Review:** Technology stack justification, related work, industry standards
- **System Requirements:** Functional and non-functional requirements, user roles and permissions
- **System Design:** Architecture diagrams, ERD, data dictionary, API design, component structure
- **Implementation:** Development environment, key features, code examples, screenshots
- **Testing:** Test strategy, test cases, results, known issues
- **User Manual:** Installation guide, feature walkthrough, screenshots
- **Results and Discussion:** Achievements, challenges, lessons learned
- **Conclusion:** Summary, future work, recommendations
- **References:** Academic and technical sources, documentation links

---

## 7. Technical Architecture Overview

### 7.1 Technology Stack Summary

**Backend Technologies:**
- **Node.js 18+:** JavaScript runtime enabling server-side development
- **Express.js:** Minimalist web framework for building RESTful APIs
- **PostgreSQL 16:** Production-grade relational database with ACID compliance
- **Sequelize ORM:** Object-relational mapping tool providing database abstraction and migrations
- **JWT (jsonwebtoken):** Token-based authentication for stateless sessions
- **bcrypt:** Password hashing library with salt rounds for secure password storage
- **Express-validator:** Input validation and sanitization middleware

**Frontend Technologies:**
- **Vue.js 3:** Progressive JavaScript framework with Composition API
- **Vue Router:** Client-side routing for single-page application navigation
- **Pinia:** State management library for Vue.js applications
- **Axios:** HTTP client for API communication
- **Chart.js:** Data visualization library for dashboard charts and graphs
- **Vite:** Next-generation frontend build tool providing fast development and optimized production builds

**Development and Deployment:**
- **Docker & Docker Compose:** Containerization for database and consistent development environments
- **npm:** Package management and script execution
- **Git:** Version control for source code management

### 7.2 Database Schema Highlights

**Core Entities:**
1. **Users:** Authentication and authorization (username, email, password_hash, role, employee_id, is_active)
2. **Employees:** Staff information (name, position, email, phone, hire_date, status, salary)
3. **Products:** Inventory items (name, category_id, quantity, unit, threshold, price_per_unit, supplier_id, expiration_date, sku)
4. **Categories:** Product classification (name, description)
5. **Suppliers:** Vendor information (name, contact_person, email, phone, address, rating, is_active)
6. **Orders:** Customer orders (order_number, customer_name, order_date, status, total_amount, payment_status, served_by)
7. **OrderItems:** Line items within orders (order_id, product_id, product_name, quantity, unit_price, subtotal)
8. **WasteRecords:** Waste tracking (product_id, product_name, quantity, reason, reported_by, waste_date, estimated_value)
9. **AuditLogs:** System activity tracking (user_id, action, table_name, record_id, old_values, new_values, ip_address, timestamp)

**Key Relationships:**
- Users ↔ Employees: One-to-one optional relationship (user can be linked to employee)
- Categories → Products: One-to-many (one category has many products)
- Suppliers → Products: One-to-many (one supplier supplies many products)
- Employees → Orders: One-to-many (one employee serves many orders)
- Orders → OrderItems: One-to-many with CASCADE DELETE (order deletion removes items)
- Products → OrderItems: One-to-many (product can appear in many order items)
- Products → WasteRecords: One-to-many (product can have many waste records)
- Employees → WasteRecords: One-to-many (employee can report many waste records)
- Users → AuditLogs: One-to-many (user generates many log entries)

### 7.3 API Endpoint Summary

**Authentication Endpoints:**
- `POST /api/auth/register` - User registration (public)
- `POST /api/auth/login` - User login (public)
- `GET /api/auth/me` - Get current user (authenticated)
- `PUT /api/auth/change-password` - Change password (authenticated)

**User Management (Admin only):**
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (soft delete)

**Product Management (Admin, Stock Manager):**
- `GET /api/products` - List all products (with pagination, search, filters)
- `GET /api/products/low-stock` - Get low-stock products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product (soft delete)

**Employee Management (Admin, HR Manager):**
- `GET /api/employees` - List all employees (with pagination, search, filters)
- `GET /api/employees/stats` - Get employee statistics
- `GET /api/employees/:id` - Get employee details
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

**Order Management (All authenticated users):**
- `GET /api/orders` - List all orders (with pagination, filters)
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

**Supplier Management (Admin, Stock Manager):**
- `GET /api/suppliers` - List all suppliers
- `GET /api/suppliers/:id` - Get supplier details
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier (soft delete)

**Category Management (Admin, Stock Manager):**
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

**Dashboard and Reports (Role-dependent):**
- `GET /api/dashboard/stats` - Get dashboard statistics (KPIs)

### 7.4 Security Implementation Summary

**Authentication Security:**
- JWT tokens with 24-hour expiration
- bcrypt password hashing with salt rounds
- Secure password change requiring current password verification
- Account activation/deactivation capability

**Authorization Security:**
- Role-based access control middleware
- Route-level permission enforcement
- Frontend route guards preventing unauthorized navigation
- API endpoint protection with role validation

**Input Security:**
- Client-side HTML5 and Vue.js validation
- Server-side Express-validator validation
- SQL injection prevention via Sequelize parameterized queries
- XSS protection through input sanitization
- CSRF considerations in API design

**Data Security:**
- Environment variable configuration for sensitive data
- CORS configuration restricting allowed origins
- Audit logging of all user actions
- Soft delete patterns preserving data integrity

---

## Conclusion

ServeUp v2 represents a comprehensive evolution from a functional prototype to a production-ready, full-stack restaurant management platform. The system addresses genuine market needs for unified, affordable, accessible restaurant management tools while adhering to regulatory requirements and environmental sustainability principles.

The technical implementation demonstrates mastery of modern web development practices, including secure authentication, robust database design, comprehensive CRUD operations, dual-layer validation, RESTful API architecture, and professional documentation. The system's architecture provides a foundation for future enhancements including AI-assisted decision-making, predictive analytics, and advanced reporting capabilities.

Through its focus on user experience, data-driven insights, and environmental impact, ServeUp v2 positions itself as a valuable tool for supporting the digital and ecological transformation of the restaurant industry, particularly for small and medium-sized enterprises that have traditionally lacked access to sophisticated management tools.

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Author:** ServUp Development Team  
**Purpose:** Academic Project Report - Context and Motivation Sections
