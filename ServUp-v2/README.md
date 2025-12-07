# ServUp v2.0 - Restaurant Chain Management System

## 🎯 Project Overview

ServUp v2.0 is a modern, full-stack web application for managing restaurant chain operations. This version is a complete rebuild with professional technologies and real database integration.

**Key Features:**
- 🔐 Secure JWT-based authentication with role-based access control
- 📦 Complete inventory and stock management
- 👥 Employee management system
- 🛒 Order processing and tracking
- 📊 Analytics and reporting dashboard
- 🏭 Supplier management
- 🔔 Access request workflow with admin approval

---

## 📚 Technology Stack

### Backend
- **Node.js** (v18+) + **Express.js** - Server and API
- **PostgreSQL** (v16) - Relational database
- **Sequelize** - ORM (Object-Relational Mapping)
- **JWT** - Secure authentication
- **bcrypt** - Password hashing

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Pinia** - State management
- **Vue Router** - Navigation
- **Axios** - HTTP client
- **Chart.js** - Data visualization

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

---

## 🏗️ Project Structure

```
ServUp-v2/
├── backend/          # Node.js Express API server
│   ├── config/       # Configuration files
│   ├── controllers/  # Business logic
│   ├── database/     # Migrations and seeders
│   ├── middleware/   # Express middleware
│   ├── models/       # Sequelize models
│   ├── routes/       # API routes
│   ├── validators/   # Input validation
│   └── server.js     # Entry point
├── frontend/         # Vue.js single-page application
│   ├── public/       # Static assets
│   └── src/          # Vue source code
│       ├── assets/   # Images, styles
│       ├── components/ # Reusable components
│       ├── router/   # Vue Router config
│       ├── services/ # API clients
│       ├── store/    # Pinia stores
│       ├── views/    # Page components
│       ├── App.vue   # Root component
│       └── main.js   # Entry point
├── documentation/    # Project documentation
└── docker-compose.yml # Docker configuration
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

#### Required Software

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation:
     ```bash
     node --version
     # Should show: v18.x.x or higher
     ```

2. **npm** (v9 or higher - comes with Node.js)
   - Verify installation:
     ```bash
     npm --version
     # Should show: 9.x.x or higher
     ```

3. **Docker Desktop**
   - Download from: https://www.docker.com/products/docker-desktop/
   - Verify installation:
     ```bash
     docker --version
     docker-compose --version
     # Both commands should work
     ```
   - **Important:** Docker Desktop must be running before starting the database

#### Optional Tools
- **Git** - For version control
- **VS Code** - Recommended code editor
- **Postman** - For API testing

---

## 📋 Installation Guide

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd ServUp-v2
```

### Step 2: Start the Database

**Important:** Make sure Docker Desktop is running before proceeding.

```bash
# Start PostgreSQL and pgAdmin containers
docker-compose up -d
```

**What this does:**
- Downloads PostgreSQL 16 image (first time only)
- Creates `servup_db` database
- Starts PostgreSQL on port `5432`
- Starts pgAdmin on port `5050` (optional database UI)

**Verify it's running:**
```bash
docker ps
```

You should see two containers:
- `servup_postgres` (PostgreSQL)
- `servup_pgadmin` (pgAdmin)

**Expected output:**
```
CONTAINER ID   IMAGE                  STATUS
abc123...      postgres:16-alpine     Up 2 minutes
def456...      dpage/pgadmin4:latest  Up 2 minutes
```

**If containers don't start:**
```bash
# Check Docker Desktop is running
# View logs for errors
docker-compose logs postgres
```

### Step 3: Install Dependencies

Install dependencies for root, backend, and frontend:

```bash
npm run install:all
```

**What this does:**
- Installs root dependencies (concurrently)
- Installs backend dependencies (Express, Sequelize, etc.)
- Installs frontend dependencies (Vue, Pinia, etc.)

**Expected time:** 2-5 minutes depending on your internet connection

**If installation fails:**
```bash
# Try installing separately
cd backend
npm install
cd ../frontend
npm install
cd ..
```

### Step 4: Configure Backend Environment Variables

Navigate to the backend directory and create your `.env` file:

```bash
cd backend
```

**On Windows (PowerShell):**
```powershell
copy env.example .env
```

**On Mac/Linux:**
```bash
cp env.example .env
```

**Edit the `.env` file** with your text editor. Here's what you need to configure:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
LOG_LEVEL=info

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=servup_db
DB_USER=postgres
DB_PASSWORD=servup_password_2024

# JWT Configuration
# IMPORTANT: In production, JWT_SECRET must be at least 32 characters long!
# Generate a secure random string, e.g., using: openssl rand -base64 32
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_EXPIRES_IN=24h

# CORS Configuration
# For production, set ALLOWED_ORIGINS as comma-separated list:
# ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174

# OpenAI Configuration (optional, for AI assistant)
OPENAI_API_KEY=your_openai_api_key_here

# Email Configuration (optional, for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
```

**⚠️ Important Notes:**
- The database password (`servup_password_2024`) must match the one in `docker-compose.yml`
- For development, you can use the default `JWT_SECRET`, but **change it in production**
- OpenAI and Email configurations are optional - leave as-is if not using these features

**Verify `.env` file exists:**
```bash
# On Windows PowerShell
Test-Path .env
# Should return: True

# On Mac/Linux
ls -la .env
# Should show the file
```

### Step 5: Run Database Migrations

Create all database tables:

```bash
# From backend directory
npm run db:migrate
```

**Expected output:**
```
Loaded configuration file "config/database.js".
Using environment "development".
== 20241121000001-create-users: migrating =======
== 20241121000001-create-users: migrated (0.123s)
== 20241121000002-create-employees: migrating =======
== 20241121000002-create-employees: migrated (0.089s)
...
```

**If migration fails:**
- Check that Docker containers are running: `docker ps`
- Verify database connection in `.env` file
- Check database logs: `docker-compose logs postgres`

### Step 6: Seed Database with Test Data

Populate the database with sample data (users, products, employees, etc.):

```bash
# From backend directory
npm run db:seed
```

**Expected output:**
```
Loaded configuration file "config/database.js".
Using environment "development".
== 20241121000001-demo-users: migrating =======
== 20241121000001-demo-users: migrated (0.045s)
...
```

**What gets created:**
- 4 test user accounts (admin, stock manager, HR manager, employee)
- Sample products
- Sample employees
- Sample orders
- Sample suppliers
- Sample categories

### Step 7: Start the Application

**Option A: Start Both Servers Together (Recommended)**

From the project root directory:

```bash
cd ..  # Go back to ServUp-v2 root
npm run dev
```

This starts both backend and frontend servers simultaneously.

**Expected output:**
```
[0] 🚀 ServUp Backend Server
[0] 📍 Running on: http://localhost:5000
[1] VITE v6.0.7  ready in 342 ms
[1] ➜  Local:   http://localhost:5173/
```

**Option B: Start Servers Separately**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## ✅ Verification

After starting the application, verify everything is working:

### 1. Check Backend API

Open your browser and visit:
```
http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "status": "success",
  "message": "ServUp API is running",
  "version": "1.0.0",
  "timestamp": "2024-11-21T..."
}
```

### 2. Check Frontend

Open your browser and visit:
```
http://localhost:5173
```

You should see the **ServUp Login Page**.

### 3. Test Login

Use one of the test accounts (see below) to log in.

---

## 👥 User Roles & Test Accounts

The system supports 4 user roles with different permission levels:

| Role | Username | Password | Access Level |
|------|----------|----------|-------------|
| **Administrateur** | `admin` | `admin123` | Full system access |
| **Responsable Stocks** | `responsable_stocks` | `stock123` | Products, suppliers, reports |
| **Responsable Employés** | `responsable_employes` | `hr123` | Employees, reports |
| **Employé** | `employe` | `emp123` | Read-only dashboard and orders |

**After login:**
- You should be redirected to `/dashboard`
- You should see "Bienvenue [username]!"
- Navigation should work based on your role
- Logout button should work

---

## 🔧 Database Management

### Using pgAdmin (GUI)

1. Open `http://localhost:5050` in your browser
2. Login with:
   - **Email:** `admin@servup.com`
   - **Password:** `admin123`
3. Add a new server:
   - Right-click "Servers" → "Register" → "Server"
   - **General Tab:**
     - Name: `ServUp Local`
   - **Connection Tab:**
     - Host: `postgres` (Docker network name)
     - Port: `5432`
     - Database: `servup_db`
     - Username: `postgres`
     - Password: `servup_password_2024`
   - Click "Save"
4. Explore tables:
   - `Servers` → `ServUp Local` → `Databases` → `servup_db` → `Schemas` → `public` → `Tables`

### Using Command Line

```bash
# Access PostgreSQL container
docker exec -it servup_postgres psql -U postgres -d servup_db

# Run SQL commands
SELECT * FROM users;
\dt     # List all tables
\q      # Exit
```

---

## 📦 Available Scripts

### Root Directory (ServUp-v2/)

```bash
npm run dev            # 🚀 Start both backend and frontend together
npm run dev:backend    # Start only backend
npm run dev:frontend   # Start only frontend
npm run install:all    # Install dependencies for root, backend, and frontend
npm run db:migrate     # Run database migrations
npm run db:seed        # Seed database with test data
npm run db:reset       # Reset database (drop, migrate, seed)
```

### Backend (backend/)

```bash
npm start           # Start production server
npm run dev         # Start development server with nodemon
npm test            # Run tests
npm run db:migrate  # Run database migrations
npm run db:seed     # Seed database with test data
npm run db:reset    # Reset database (drop, migrate, seed)
```

### Frontend (frontend/)

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🐛 Troubleshooting

### Backend won't start

**Error:** `ECONNREFUSED localhost:5432`

**Solution:** Database not running
```bash
docker-compose up -d
docker ps  # Verify containers are running
```

**Error:** `JWT_SECRET is not defined`

**Solution:** Create or fix `.env` file in `backend/` folder
```bash
cd backend
copy env.example .env  # Windows
# or
cp env.example .env    # Mac/Linux
# Then edit .env and set JWT_SECRET
```

**Error:** `Port 5000 is already in use`

**Solution:** Kill process using that port

**Windows PowerShell:**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

### Frontend can't connect to API

**Error:** `Network Error` in browser console

**Solution:** 
1. Make sure backend is running on port 5000
2. Check `http://localhost:5000/api/health` in browser
3. Verify CORS settings in `backend/.env`:
   ```
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
   ```

### Database Connection Failed

**Error:** `password authentication failed for user "postgres"`

**Solution:** Check `.env` file - password should match docker-compose.yml
```env
DB_PASSWORD=servup_password_2024
```

**Error:** `database "servup_db" does not exist`

**Solution:** Run migrations
```bash
cd backend
npm run db:migrate
```

### Docker Issues

**Error:** `Cannot connect to Docker daemon`

**Solution:** Make sure Docker Desktop is running

**Error:** `docker-compose: command not found`

**Solution:** 
- Install Docker Desktop (includes docker-compose)
- Or use `docker compose` (no hyphen) on newer versions

### Migration Errors

**Error:** `Migration failed`

**Solution:**
1. Check database is running: `docker ps`
2. Verify database connection in `.env`
3. Check migration files exist in `backend/database/migrations/`
4. Try resetting database:
   ```bash
   cd backend
   npm run db:reset
   ```

### Frontend Build Errors

**Error:** `Module not found` or dependency errors

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json  # Mac/Linux
# or
Remove-Item -Recurse -Force node_modules, package-lock.json  # Windows
npm install
```

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (public, rate-limited)
- `POST /api/auth/login` - User login (public, rate-limited)
- `POST /api/auth/logout` - User logout (protected)
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Products (Stock Management)
- `GET /api/products` - List all products with pagination and filters (protected)
- `GET /api/products/low-stock` - Get products below threshold (protected)
- `GET /api/products/:id` - Get product details (protected)
- `POST /api/products` - Create new product (admin, stock manager)
- `PUT /api/products/:id` - Update product (admin, stock manager)
- `DELETE /api/products/:id` - Delete product (admin, stock manager)

### Categories
- `GET /api/categories` - List all categories (protected)
- `GET /api/categories/:id` - Get category details (protected)
- `POST /api/categories` - Create new category (admin, stock manager)
- `PUT /api/categories/:id` - Update category (admin, stock manager)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Suppliers
- `GET /api/suppliers/stats` - Get supplier statistics (admin, stock manager)
- `GET /api/suppliers` - List all suppliers with pagination (admin, stock manager)
- `GET /api/suppliers/:id` - Get supplier details (admin, stock manager)
- `POST /api/suppliers` - Create new supplier (admin, stock manager)
- `PUT /api/suppliers/:id` - Update supplier (admin, stock manager)
- `DELETE /api/suppliers/:id` - Delete supplier (admin only)

### Employees
- `GET /api/employees/stats` - Get employee statistics (admin, HR manager)
- `GET /api/employees` - List all employees with pagination (admin, HR manager)
- `GET /api/employees/:id` - Get employee details (admin, HR manager)
- `POST /api/employees` - Create new employee (admin, HR manager)
- `PUT /api/employees/:id` - Update employee (admin, HR manager)
- `DELETE /api/employees/:id` - Delete employee (admin, HR manager)

### Orders
- `GET /api/orders/stats` - Get order statistics (protected)
- `GET /api/orders` - List all orders with pagination (protected)
- `GET /api/orders/:id` - Get order details (protected)
- `POST /api/orders` - Create new order (protected)
- `PUT /api/orders/:id` - Update order (protected)
- `DELETE /api/orders/:id` - Delete order (admin only)

### Users
- `GET /api/users/stats` - Get user statistics (admin only)
- `GET /api/users` - List all users with pagination (admin only)
- `GET /api/users/:id` - Get user details (admin only)
- `POST /api/users` - Create new user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `PATCH /api/users/:id/toggle-status` - Toggle user active status (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Reports & Analytics
- `GET /api/reports/sales` - Sales analytics (admin, stock manager)
- `GET /api/reports/inventory` - Inventory analytics (admin, stock manager)
- `GET /api/reports/employees` - Employee analytics (admin, HR manager)
- `GET /api/reports/suppliers` - Supplier analytics (admin, stock manager)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (protected)
- `GET /api/dashboard/activity` - Get recent activity (protected)

### Access Requests
- `POST /api/access-requests` - Create access request (public)
- `GET /api/access-requests` - List all access requests (admin only)
- `GET /api/access-requests/pending/count` - Get pending requests count (admin only)
- `PUT /api/access-requests/:id/approve` - Approve access request (admin only)
- `PUT /api/access-requests/:id/deny` - Deny access request (admin only)

### Health Check
- `GET /api/health` - API health check (public)

---

## 🔄 Development Workflow

### Starting Everything

1. **Start database** (once per day or after restart):
   ```bash
   docker-compose up -d
   ```

2. **Start backend and frontend** (Terminal 1):
   ```bash
   npm run dev
   ```

3. **Open browser:** `http://localhost:5173`

### Stopping Everything

- **Frontend/Backend:** Press `Ctrl + C` in the terminal
- **Database:**
  ```bash
  docker-compose down
  ```

### Resetting Database

If you need to start fresh:

```bash
cd backend
npm run db:reset
```

This will:
1. Undo all migrations
2. Run all migrations again
3. Re-seed with fresh test data

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.js
```

---

## 📝 Development Progress

- [x] Project structure created
- [x] Backend initialization
- [x] Frontend initialization (Vue 3 + Vite)
- [x] Database schema design
- [x] Docker setup
- [x] Database models and migrations
- [x] Authentication system (JWT-based)
- [x] CRUD operations (Products, Categories, Suppliers, Employees, Orders, Users)
- [x] Role-based access control (RBAC)
- [x] API validation and error handling
- [x] Security middleware (rate limiting, input sanitization, security headers)
- [x] Audit logging system
- [x] Reports and analytics endpoints
- [x] Dashboard statistics
- [x] Access request system
- [ ] AI assistant integration (OpenAI API ready, not yet implemented)
- [x] Core documentation

---

## 📚 Additional Documentation

For more detailed information, see:

- **Setup Guide:** `/documentation/SETUP-GUIDE.md` - Detailed step-by-step setup
- **Database Schema:** `/documentation/database-schema.md` - Database structure
- **API Documentation:** See API Endpoints section above
- **Limitations:** `/documentation/LIMITATIONS-AND-FUTURE-PLANS.md` - Current limitations and future plans
- **Troubleshooting:** `/TROUBLESHOOTING.md` - Common issues and solutions

---

## 🔒 Security Features

- ✅ JWT-based authentication with secure token management
- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ Rate limiting on authentication endpoints
- ✅ Input sanitization (XSS protection)
- ✅ SQL injection prevention (Sequelize ORM)
- ✅ Security headers (Helmet middleware)
- ✅ CORS configuration
- ✅ Role-based access control (RBAC)

---

## 🤝 Contributing

This is an academic project. For any questions or suggestions, please contact the development team.

---

## 📄 License

This project is for educational purposes only.

---

## 📞 Support

For technical issues or questions:
- Check the documentation in `/documentation`
- Review the database schema: `/documentation/database-schema.md`
- Check troubleshooting section above
- Contact: servup.support@example.com

---

## 🎯 Quick Reference

**Ports:**
- Backend API: `http://localhost:5000`
- Frontend: `http://localhost:5173`
- PostgreSQL: `localhost:5432`
- pgAdmin: `http://localhost:5050`

**Default Credentials:**
- Database: `postgres` / `servup_password_2024`
- pgAdmin: `admin@servup.com` / `admin123`
- Test User: `admin` / `admin123`

**Important Files:**
- Backend config: `backend/.env`
- Docker config: `docker-compose.yml`
- Database migrations: `backend/database/migrations/`

---

**Built with ❤️ for learning and professional development**

**Last Updated:** November 2024
