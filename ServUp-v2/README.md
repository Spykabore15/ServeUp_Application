# ServUp v2.0 - Restaurant Chain Management System

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Technology Stack](#-technology-stack)
3. [Prerequisites](#-prerequisites)
4. [Quick Start Guide](#-quick-start-guide-recommended)
5. [Detailed Setup Instructions](#-detailed-setup-instructions)
6. [User Roles & Test Accounts](#-user-roles--test-accounts)
7. [Available Scripts](#-available-scripts)
8. [Database Management](#-database-management)
9. [Testing the Application](#-testing-the-application)
10. [Troubleshooting](#-troubleshooting)
11. [Project Structure](#-project-structure)
12. [Additional Documentation](#-additional-documentation)

---

## 🎯 Project Overview

ServUp v2.0 is a modern, full-stack web application for managing restaurant chain operations. This version is a complete rebuild with professional technologies and real database integration, transforming the static prototype (v1) into a production-ready, database-driven platform.

**Key Features:**
- 🔐 Secure JWT-based authentication with role-based access control
- 📊 Real-time inventory management with low-stock alerts
- 👥 Comprehensive employee and workforce management
- 📦 Complete order processing and sales tracking
- 📈 Analytics dashboard with KPIs and reporting
- 🗄️ PostgreSQL database with Sequelize ORM
- 🎨 Modern Vue.js 3 frontend with responsive design
- 🐳 Docker-based database setup for easy deployment

## 📚 Technology Stack

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web framework for RESTful API
- **PostgreSQL 16** - Relational database
- **Sequelize** - ORM (Object-Relational Mapping)
- **JWT** - Secure token-based authentication
- **bcrypt** - Password hashing and encryption
- **Express-validator** - Input validation middleware

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Pinia** - State management library
- **Vue Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **Chart.js** - Data visualization and charts
- **Vite** - Build tool and development server

### DevOps & Tools
- **Docker & Docker Compose** - Containerization for database
- **pgAdmin** - Database management UI
- **Git** - Version control
- **npm** - Package management

### Future Enhancements
- **OpenAI API** / **LangChain** - AI assistant integration (planned)

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
│   ├── services/     # External services
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

## ✅ Prerequisites

Before starting, ensure you have the following software installed on your system:

### Required Software

| Software | Minimum Version | Download Link | Verification Command |
|----------|----------------|---------------|---------------------|
| **Node.js** | v18.0.0 | [Download](https://nodejs.org/) | `node --version` |
| **npm** | v9.0.0 | (comes with Node.js) | `npm --version` |
| **Docker Desktop** | Latest | [Download](https://www.docker.com/products/docker-desktop/) | `docker --version` |
| **Git** (optional) | Latest | [Download](https://git-scm.com/) | `git --version` |

### Why Docker Desktop is Required

**Docker Desktop is mandatory** for this project. Here's why:

**What Docker Does:**
- **Runs PostgreSQL Database:** ServUp v2.0 requires a PostgreSQL database to store all application data. Docker runs this database in an isolated container, eliminating the need to install PostgreSQL directly on your system.

**Benefits of Using Docker:**
- ✅ **No Manual Database Installation:** You don't need to install and configure PostgreSQL manually
- ✅ **Consistent Environment:** Database runs the same way on Windows, Mac, and Linux
- ✅ **Easy Setup:** Database starts with a single command (`docker-compose up -d`)
- ✅ **Isolated:** Database runs in a container, separate from your system
- ✅ **Includes pgAdmin:** Database management UI is automatically included

**What Happens Without Docker:**
- ❌ **Application Won't Work:** The backend cannot connect to the database
- ❌ **Database Errors:** You'll see connection errors when starting the server
- ❌ **Missing Dependency:** The application requires a PostgreSQL database to function

**Alternative (Not Recommended):**
If you cannot use Docker, you would need to:
1. Install PostgreSQL 16+ manually on your system
2. Create the database `servup_db` manually
3. Configure database credentials
4. Update the `.env` file with your database connection details
5. This process is more complex and error-prone

**We strongly recommend using Docker Desktop** for the easiest setup experience.

### Verify Installation

Run these commands in your terminal to verify installations:

```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
docker --version  # Should show Docker version (e.g., "Docker version 24.x.x")
docker-compose --version  # Should show docker-compose version (e.g., "docker-compose version 2.x.x")
```

**If Docker commands don't work:**
- Make sure Docker Desktop is installed and running
- On Windows/Mac: Look for the Docker Desktop icon in your system tray/menu bar
- Restart Docker Desktop if the commands fail
- See [Troubleshooting](#-troubleshooting) section for more help

### Optional Tools (Recommended)

- **Visual Studio Code** - Recommended code editor
- **Postman** or **Thunder Client** - For API testing
- **pgAdmin** - Database GUI (included in Docker setup)

---

## 🚀 Quick Start Guide (Recommended)

This is the fastest way to get ServUp v2.0 running. Follow these steps in order:

### Step 1: Clone and Navigate to Project

```bash
# If cloning from repository
git clone <repository-url>
cd ServUp-v2

# Or navigate to existing project directory
cd ServUp-v2
```

### Step 2: Start Database with Docker ⚠️ **REQUIRED**

**Important:** This step **requires Docker Desktop to be running**. Make sure Docker Desktop is installed and started before proceeding.

```bash
docker-compose up -d
```

**What this does:**
- **Downloads PostgreSQL 16** (first time only, ~100MB download)
- **Creates `servup_db` database** automatically
- **Starts PostgreSQL** database server on port `5432`
- **Starts pgAdmin** (database management UI) on port `5050`

**Why Docker is needed here:**
The `docker-compose.yml` file defines how to run the PostgreSQL database in a container. Without Docker Desktop running, this command will fail and you won't be able to proceed with the setup.

**Verify database is running:**
```bash
docker ps
# You should see: servup_postgres and servup_pgadmin containers
# Both should show STATUS: Up
```

**If you see an error:**
- Make sure Docker Desktop is running (check system tray/menu bar)
- Wait 30-60 seconds after starting Docker Desktop before running the command
- See [Troubleshooting](#-troubleshooting) section for Docker issues

**Expected output:**
```
Creating network "servup-v2_servup_network" ... done
Creating servup_postgres ... done
Creating servup_pgadmin ... done
```

### Step 3: Install All Dependencies (First Time Only)

```bash
npm run install:all
```

**What this does:**
- Installs root-level dependencies
- Installs backend dependencies (Node.js packages)
- Installs frontend dependencies (Vue.js packages)

**Time required:** 2-5 minutes (depending on internet speed)

**Expected output:**
```
> servup-v2@2.0.0 install:all
> npm install && cd backend && npm install && cd ../frontend && npm install && cd ..
...
added 150 packages in 30s
added 200 packages in 45s
added 300 packages in 60s
```

### Step 4: Configure Backend Environment

```bash
# Navigate to backend directory
cd backend

# Copy environment template (Windows PowerShell)
copy env.example .env

# OR (Mac/Linux/Git Bash)
cp env.example .env
```

**Edit `.env` file** and ensure these values are set:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (should match docker-compose.yml)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=servup_db
DB_USER=postgres
DB_PASSWORD=servup_password_2024

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_CHANGE_THIS_IN_PRODUCTION_123!@#
JWT_EXPIRES_IN=24h

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

**Important:** The `JWT_SECRET` should be changed in production. For development, the example value is acceptable.

**Return to root directory:**
```bash
cd ..
```

### Step 5: Run Database Migrations (First Time Only)

```bash
npm run db:migrate
```

**What this does:**
- Creates all database tables (users, employees, products, orders, etc.)
- Sets up relationships and constraints
- Creates indexes for performance

**Expected output:**
```
Loaded configuration file "config/database.js".
Using environment "development".
== 20241121000001-create-users: migrating =======
== 20241121000001-create-users: migrated (0.123s)
== 20241121000002-create-employees: migrating =======
...
Migration completed successfully!
```

**Verify tables were created:**
```bash
# Using Docker command line
docker exec -it servup_postgres psql -U postgres -d servup_db -c "\dt"

# You should see 9 tables listed
```

### Step 6: Seed Database with Test Data (First Time Only)

```bash
npm run db:seed
```

**What this does:**
- Creates 4 test user accounts (admin, responsable_stocks, responsable_employes, employe)
- Adds sample products, employees, suppliers, categories
- Creates sample orders and order items
- Adds sample waste records

**Expected output:**
```
== Seeding demo users ==
User 'admin' created successfully
User 'responsable_stocks' created successfully
...
Database seeded successfully!
```

### Step 7: Start Development Servers

```bash
npm run dev
```

**What this does:**
- Starts backend server on `http://localhost:5000`
- Starts frontend server on `http://localhost:5173`
- Both servers run in the same terminal window

**Expected output:**
```
[0] > servup-v2@2.0.0 dev:backend
[0] > cd backend && npm run dev
[1] > servup-v2@2.0.0 dev:frontend
[1] > cd frontend && npm run dev
[0] ========================================
[0] 🚀 ServUp Backend Server
[0] 📍 Running on: http://localhost:5000
[1]   VITE v6.0.7  ready in 342 ms
[1]   ➜  Local:   http://localhost:5173/
```

### Step 8: Access the Application

1. **Open your browser** and navigate to: `http://localhost:5173`
2. **You should see** the ServUp login page
3. **Use test credentials** (see [User Roles & Test Accounts](#-user-roles--test-accounts) section below)

🎉 **Success!** Your application is now running.

---

## 📖 Detailed Setup Instructions

For step-by-step instructions with troubleshooting tips, screenshots, and detailed explanations, please refer to the [Complete Setup Guide](./documentation/SETUP-GUIDE.md).

The setup guide includes:
- Detailed prerequisites verification
- Step-by-step installation with explanations
- Configuration instructions for all components
- Database management using pgAdmin (GUI)
- Troubleshooting common issues
- Development workflow best practices

### Manual Setup (Alternative)

If you prefer to run servers separately:

#### 1. Setup Database with Docker

Start PostgreSQL and pgAdmin:

```bash
docker-compose up -d
```

This will start:
- **PostgreSQL** on `localhost:5432`
- **pgAdmin** on `http://localhost:5050`

pgAdmin credentials:
- Email: `admin@servup.com`
- Password: `admin123`

#### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
copy env.example .env
# Edit .env with your settings

# Run database migrations
npm run db:migrate

# Seed database with test data
npm run db:seed

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

Test the API: `http://localhost:5000/api/health`

#### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 👥 User Roles & Test Accounts

The system supports 4 user roles with different permission levels:

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| **Administrateur** | `admin` | `admin123` | Full system access |
| **Responsable Stocks** | `responsable_stocks` | `stock123` | Products, suppliers, reports |
| **Responsable Employés** | `responsable_employes` | `hr123` | Employees, reports |
| **Employé** | `employe` | `emp123` | Read-only dashboard and orders |

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

## 🔧 Database Management

### Using Docker & pgAdmin

1. Open `http://localhost:5050` in your browser
2. Login with credentials above
3. Add a new server:
   - Name: `ServUp Local`
   - Host: `postgres` (Docker network name)
   - Port: `5432`
   - Username: `postgres`
   - Password: `servup_password_2024`
   - Database: `servup_db`

### Using Command Line

```bash
# Access PostgreSQL container
docker exec -it servup_postgres psql -U postgres -d servup_db

# Run SQL commands
SELECT * FROM users;
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password

### Products (Stock Management)
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Employees
- `GET /api/employees` - List all employees
- `GET /api/employees/:id` - Get employee details
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

*(More endpoints will be documented as they are implemented)*

## 🧪 Testing the Application

### Quick Health Check

**1. Test Backend API:**
Open your browser and navigate to:
```
http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "status": "success",
  "message": "ServUp API is running",
  "timestamp": "2024-11-21T..."
}
```

**2. Test Frontend:**
- Navigate to `http://localhost:5173`
- You should see the login page
- Try logging in with test accounts (see below)

### Manual Testing Checklist

After setup, verify these features work:

- [ ] **Login** - Can log in with test accounts
- [ ] **Dashboard** - Dashboard loads and shows statistics
- [ ] **Navigation** - Can navigate between different pages
- [ ] **Role-Based Access** - Different roles see different menu options
- [ ] **Products** - Can view, create, edit, delete products (if role allows)
- [ ] **Employees** - Can view, create, edit, delete employees (if role allows)
- [ ] **Orders** - Can view and create orders
- [ ] **Logout** - Can successfully log out

### API Testing

Use Postman or Thunder Client to test API endpoints:

**Example: Login API Test**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Expected response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@servup.com",
    "role": "admin"
  }
}
```

For detailed testing instructions, see [Testing Guide](./documentation/TESTING.md).

### Automated Tests (Future)

Automated testing framework will be implemented in future versions:

```bash
# Run all tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.js
```

## ⚠️ Current Limitations

**Important Notice for Reviewers and Stakeholders:**

The current MVP implementation has **known limitations** in the User and Employee Management system. These limitations are documented in detail in the [Limitations and Future Plans](./documentation/LIMITATIONS-AND-FUTURE-PLANS.md) document.

### Key Limitations:

1. **No Access Request Workflow:** The system lacks an access request → approval → account creation workflow. Users can be created directly without an approval process.

2. **Separate User/Employee Creation:** Users and employees are created independently, which can lead to data inconsistencies and operational inefficiencies.

3. **Optional User-Employee Relationship:** The database allows users to exist without employee records, which doesn't align with the intended business logic.

4. **Manual Onboarding Process:** There is no automated workflow for granting system access to new employees.

5. **No Email Notifications:** The system does not send automated emails for access approvals, credential delivery, or request status updates.

### Impact on MVP:

- ✅ **Core functionality works:** Authentication, CRUD operations, role-based access control all function correctly
- ⚠️ **Workflow gaps:** Manual processes required for user/employee onboarding
- ⚠️ **Data integrity:** Optional relationships allow inconsistent data states
- ⚠️ **User experience:** No self-service access request mechanism

**For detailed information, please review:** [Limitations and Future Plans](./documentation/LIMITATIONS-AND-FUTURE-PLANS.md)

## 📝 Development Progress

**Core Infrastructure:**
- [x] Project structure created
- [x] Backend initialization
- [x] Frontend initialization (Vue 3 + Vite)
- [x] Database schema design
- [x] Docker setup
- [x] Database models and migrations (10 models, 10 migrations)
- [x] Authentication system (JWT-based)
- [x] CRUD operations (Products, Employees, Orders, Suppliers, Users, Categories)
- [x] Dashboard with statistics
- [x] Reports & Analytics
- [x] Role-based access control

**Known Limitations:**
- [ ] Access request workflow (planned for future iteration)
- [ ] Automated user-employee onboarding (planned for future iteration)
- [ ] Email notification system (planned for future iteration)

**Future Enhancements:**
- [ ] AI assistant integration
- [ ] Real-time notifications
- [ ] Advanced reporting features

## 🤝 Contributing

This is an academic project. For any questions or suggestions, please contact the development team.

## 📄 License

This project is for educational purposes only.

## 📚 Additional Documentation

- [📖 Complete API Documentation](./documentation/API.md)
- [⚠️ **Limitations and Future Plans**](./documentation/LIMITATIONS-AND-FUTURE-PLANS.md) - **Important: Current system limitations**
- [🔧 Setup Guide](./documentation/SETUP-GUIDE.md)
- [📊 Database Schema](./documentation/database-schema.md)
- [🧪 Testing Guide](./documentation/TESTING.md)
- [⚡ Quick Start Guide](./QUICK-START.md)

## 📞 Support

For technical issues or questions:
- Check the documentation in `/documentation`
- Review the database schema: `/documentation/database-schema.md`
- Review limitations: `/documentation/LIMITATIONS-AND-FUTURE-PLANS.md`
- Contact: servup.support@example.com

---

**Built with ❤️ for learning and professional development**

Last Updated: November 21, 2025
