# ServUp V2 - Complete Setup Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Step 1: Verify Prerequisites](#-step-1-verify-prerequisites)
3. [Step 2: Start the Database](#-step-2-start-the-database)
4. [Step 3: Setup Backend](#-step-3-setup-backend)
5. [Step 4: Setup Frontend](#-step-4-setup-frontend)
6. [Step 5: Test the Application](#-step-5-test-the-application)
7. [Step 6: Access Database (Optional)](#-step-6-access-database-optional)
8. [Development Workflow](#-development-workflow)
9. [Troubleshooting](#-troubleshooting)
10. [Next Steps](#-next-steps)

---

## Overview

This guide provides **detailed step-by-step instructions** for setting up ServUp v2.0 from scratch. It includes:

- ✅ Prerequisites verification
- 🐳 Database setup with Docker
- 🔧 Backend configuration and installation
- 🎨 Frontend setup and configuration
- 🧪 Testing and verification procedures
- 🐛 Comprehensive troubleshooting section

**Estimated Setup Time:** 15-30 minutes (depending on internet speed and system performance)

**Target Audience:** Developers, evaluators, and anyone setting up the application for the first time

---

## ✅ Step 1: Verify Prerequisites

Before starting, ensure you have installed:

### Required Software
- [ ] **Node.js** version 18+ ([Download](https://nodejs.org/))
  ```bash
  node --version  # Should show v18.x.x or higher
  ```

- [ ] **npm** version 9+ (comes with Node.js)
  ```bash
  npm --version   # Should show 9.x.x or higher
  ```

- [ ] **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop/))
  ```bash
  docker --version          # Should work
  docker-compose --version  # Should work
  ```

### Optional Tools (Recommended)
- **Git** - For version control ([Download](https://git-scm.com/))
- **Visual Studio Code** - Recommended code editor ([Download](https://code.visualstudio.com/))
- **Postman** or **Thunder Client** - For API testing ([Download Postman](https://www.postman.com/downloads/))

### Verification Checklist

Before proceeding, ensure you can run these commands successfully:

```bash
# Check Node.js version
node --version
# Expected: v18.0.0 or higher

# Check npm version
npm --version
# Expected: 9.0.0 or higher

# Check Docker
docker --version
# Expected: Docker version 24.x.x or higher

# Check Docker Compose
docker-compose --version
# Expected: docker-compose version 2.x.x or higher
```

**If any command fails:**
- Install the missing software using the download links above
- Restart your terminal/command prompt after installation
- Verify the installation again with the commands above

✅ **Once all prerequisites are verified, proceed to Step 2.**

---

## 🐳 Step 2: Start the Database

Navigate to the project root and start PostgreSQL:

```bash
cd ServUp-v2
docker-compose up -d
```

**What this does:**
- Downloads PostgreSQL 16 (first time only)
- Creates `servup_db` database
- Starts PostgreSQL on port 5432
- Starts pgAdmin on port 5050 (optional database UI)

**Verify it's running:**
```bash
docker ps
```

**Expected output:**
```
CONTAINER ID   IMAGE                    STATUS         PORTS                    NAMES
abc123def456   postgres:16-alpine       Up 2 minutes   0.0.0.0:5432->5432/tcp   servup_postgres
xyz789ghi012   dpage/pgadmin4:latest    Up 2 minutes   0.0.0.0:5050->80/tcp     servup_pgadmin
```

You should see two containers: `servup_postgres` and `servup_pgadmin`

**If containers are not running:**
```bash
# Check Docker Desktop is running
# On Windows/Mac: Look for Docker Desktop icon in system tray/menu bar

# View container logs for errors
docker-compose logs postgres
docker-compose logs pgadmin

# Restart containers
docker-compose restart
```

✅ **Database is ready when containers show STATUS: Up**

**To stop the database:**
```bash
docker-compose down
```

**To view logs:**
```bash
docker-compose logs postgres
```

---

## 🔧 Step 3: Setup Backend

### 3.1 Install Dependencies

```bash
cd backend
npm install
```

This installs:
- Express.js (web server)
- Sequelize (database ORM)
- bcrypt (password hashing)
- jsonwebtoken (JWT authentication)
- PostgreSQL driver
- And more...

### 3.2 Configure Environment Variables

**Important:** The `.env` file contains sensitive configuration. Never commit this file to version control.

**Create your `.env` file:**

```bash
# On Windows PowerShell
copy env.example .env

# On Mac/Linux/Git Bash
cp env.example .env
```

**Verify the file was created:**
```bash
# List files in backend directory
dir .env        # Windows
ls -la .env     # Mac/Linux
```

**Edit `.env` file** with any text editor (VS Code, Notepad++, nano, etc.):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
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

# OpenAI Configuration (optional for now)
OPENAI_API_KEY=your_openai_api_key_here
```

⚠️ **Important Security Notes:**
- Change `JWT_SECRET` to a random string in production (use a password generator)
- Never commit `.env` file to version control (it's already in `.gitignore`)
- For development, the example values are acceptable

**Verify configuration:**
```bash
# On Windows PowerShell
type .env        # View file contents

# On Mac/Linux
cat .env         # View file contents
```

✅ **Environment configured correctly when `.env` file exists with all required variables.**

### 3.3 Run Database Migrations

Create all database tables:

```bash
npm run db:migrate
```

**Expected output:**
```
Loaded configuration file "config/database.js".
Using environment "development".
== 20241121000001-create-users: migrating =======
== 20241121000001-create-users: migrated (0.123s)
== 20241121000002-create-employees: migrating =======
== 20241121000002-create-employees: migrated (0.098s)
...
== Migration completed successfully! ==
```

**Verify tables were created:**
```bash
# Using Docker command line
docker exec -it servup_postgres psql -U postgres -d servup_db -c "\dt"

# Expected output: List of 9 tables
# users, employees, categories, suppliers, products, orders, order_items, waste_records, audit_logs
```

**If migration fails:**
- Check database connection: `docker ps` (ensure postgres container is running)
- Verify `.env` file has correct database credentials
- Check migration logs for specific error messages

✅ **Migrations successful when all 9 tables are created.**

### 3.4 Seed Test Data

Populate database with sample data:

```bash
npm run db:seed
```

This creates:
- **4 test user accounts** (admin, responsable_stocks, responsable_employes, employe)
- **20+ sample products** with various categories
- **8-10 sample employees** with different positions
- **15-20 sample orders** with order items
- **5-10 sample suppliers** with ratings
- **Sample waste records** for analytics

**Expected output:**
```
== Seeding demo users ==
User 'admin' created successfully
User 'responsable_stocks' created successfully
User 'responsable_employes' created successfully
User 'employe' created successfully
== Seeding demo products ==
Product 'Tomatoes' created successfully
...
== Database seeded successfully! ==
```

**Verify data was seeded:**
```bash
# Check users table
docker exec -it servup_postgres psql -U postgres -d servup_db -c "SELECT COUNT(*) FROM users;"
# Expected: 4

# Check products table
docker exec -it servup_postgres psql -U postgres -d servup_db -c "SELECT COUNT(*) FROM products;"
# Expected: 20+
```

✅ **Database seeded successfully when test data counts match expected values.**

### 3.5 Start Backend Server

```bash
npm run dev
```

**You should see:**
```
========================================
🚀 ServUp Backend Server
📍 Running on: http://localhost:5000
🌍 Environment: development
========================================
```

**Test the API:**

**Method 1: Using Browser**
Open your browser and navigate to:
```
http://localhost:5000/api/health
```

**Method 2: Using Command Line (curl)**
```bash
# Windows PowerShell
Invoke-WebRequest -Uri http://localhost:5000/api/health

# Mac/Linux/Git Bash
curl http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "status": "success",
  "message": "ServUp API is running",
  "timestamp": "2024-11-21T..."
}
```

**If backend won't start or health check fails:**
- Check for error messages in the terminal
- Verify database is running: `docker ps`
- Check `.env` file configuration
- Verify port 5000 is not in use by another application
- Review [Troubleshooting](#-troubleshooting) section below

✅ **Backend is ready when health check returns success status!** 

**Keep this terminal window open** - the backend server needs to keep running.

---

## 🎨 Step 4: Setup Frontend

### 4.1 Open a New Terminal Window

Keep the backend running and open a **NEW** terminal.

### 4.2 Navigate to Frontend

```bash
cd ServUp-v2/frontend
```

### 4.3 Install Dependencies

```bash
npm install
```

This installs:
- Vue 3 (UI framework)
- Vue Router (navigation)
- Pinia (state management)
- Axios (HTTP client)
- Chart.js (graphs)
- Vite (build tool)

### 4.4 Configure Environment (Optional)

The frontend already has default settings, but you can customize:

```bash
# Create .env file (optional)
copy .env.example .env   # Windows
cp .env.example .env     # Mac/Linux
```

### 4.5 Start Frontend Development Server

```bash
npm run dev
```

**You should see:**
```
  VITE v6.0.7  ready in 342 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**Open your browser:**
```
http://localhost:5173
```

**You should see the ServUp Login Page!** 🎉

**Verify frontend is working:**
- Login page loads without errors
- No console errors in browser developer tools (F12)
- Page is responsive and styled correctly

**If frontend won't start or shows errors:**
- Check for error messages in the terminal
- Verify backend is running on port 5000
- Check browser console for detailed error messages (F12 → Console tab)
- Verify port 5173 is not in use by another application
- Review [Troubleshooting](#-troubleshooting) section below

✅ **Frontend is ready when login page loads successfully!**

**Keep this terminal window open** - the frontend server needs to keep running.

---

## 🧪 Step 5: Test the Application

### 5.1 Login with Test Account

Use any of these credentials:

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Administrator |
| `responsable_stocks` | `stock123` | Stock Manager |
| `responsable_employes` | `hr123` | HR Manager |
| `employe` | `emp123` | Employee |

### 5.2 Expected Behavior

**After successful login:**
- ✅ You should be redirected to `/dashboard`
- ✅ You should see welcome message: "Bienvenue [username]!"
- ✅ Dashboard shows statistics cards (total products, employees, orders, etc.)
- ✅ Navigation menu appears in the sidebar
- ✅ Your username appears in the header
- ✅ Logout button is visible and functional

**Different roles see different menu options:**

| Role | Visible Menu Items |
|------|-------------------|
| **Admin** | Dashboard, Products, Employees, Orders, Suppliers, Users, Reports, Settings |
| **Stock Manager** | Dashboard, Products, Suppliers, Reports, Settings |
| **HR Manager** | Dashboard, Employees, Reports, Settings |
| **Employee** | Dashboard, Orders, Settings |

### 5.3 Test CRUD Operations

**Test Product Management (Admin or Stock Manager):**
1. Navigate to "Products" in the menu
2. Click "Add Product" or similar button
3. Fill in the form and submit
4. Verify the product appears in the list
5. Try editing and deleting a product

**Test Employee Management (Admin or HR Manager):**
1. Navigate to "Employees" in the menu
2. View the list of employees
3. Try creating, editing, or deleting an employee

**Test Order Creation (All roles):**
1. Navigate to "Orders" in the menu
2. Create a new order
3. Add items to the order
4. Submit the order

✅ **Application is fully functional when all CRUD operations work correctly!**

---

## 🗄️ Step 6: Access Database (Optional)

### Option A: Using pgAdmin (GUI)

1. Open `http://localhost:5050`
2. Login:
   - Email: `admin@servup.com`
   - Password: `admin123`
3. Add Server:
   - **General Tab:**
     - Name: `ServUp Local`
   - **Connection Tab:**
     - Host: `postgres`
     - Port: `5432`
     - Database: `servup_db`
     - Username: `postgres`
     - Password: `servup_password_2024`
4. Click "Save"
5. Explore tables in: `Servers` → `ServUp Local` → `Databases` → `servup_db` → `Schemas` → `public` → `Tables`

### Option B: Using Command Line

```bash
# Enter PostgreSQL container
docker exec -it servup_postgres psql -U postgres -d servup_db

# Run SQL queries
servup_db=# SELECT * FROM users;
servup_db=# \dt     -- List all tables
servup_db=# \q      -- Exit
```

---

## 🔄 Development Workflow

### Starting Everything

1. **Start database** (once per day):
   ```bash
   cd ServUp-v2
   docker-compose up -d
   ```

2. **Start backend** (Terminal 1):
   ```bash
   cd ServUp-v2/backend
   npm run dev
   ```

3. **Start frontend** (Terminal 2):
   ```bash
   cd ServUp-v2/frontend
   npm run dev
   ```

4. **Open browser:** `http://localhost:5173`

### Stopping Everything

- **Frontend/Backend:** Press `Ctrl + C` in each terminal
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

## 🐛 Troubleshooting

This section addresses common issues and their solutions. If you encounter a problem not listed here, check the terminal output and browser console for detailed error messages.

### Quick Diagnosis Checklist

Before troubleshooting, verify these basics:

- [ ] Docker Desktop is running
- [ ] Database containers are up: `docker ps` shows `servup_postgres` and `servup_pgadmin`
- [ ] Backend `.env` file exists and is correctly configured
- [ ] All dependencies installed: `npm run install:all` completed successfully
- [ ] Ports 5000, 5173, 5432, 5050 are not in use by other applications
- [ ] Node.js version is 18+: `node --version`

---

## 🐛 Troubleshooting

### Issue 1: Backend Won't Start

#### Error: `ECONNREFUSED localhost:5432`

**Cause:** Database container is not running or not accessible.

**Solutions:**
```bash
# 1. Check if Docker containers are running
docker ps

# 2. If containers are not running, start them
docker-compose up -d

# 3. Wait 10-15 seconds for PostgreSQL to fully start
# 4. Verify database is ready
docker exec -it servup_postgres psql -U postgres -d servup_db -c "SELECT 1;"

# 5. Try starting backend again
cd backend
npm run dev
```

#### Error: `JWT_SECRET is not defined`

**Cause:** `.env` file is missing or JWT_SECRET variable is not set.

**Solutions:**
```bash
# 1. Navigate to backend directory
cd backend

# 2. Check if .env file exists
dir .env        # Windows
ls -la .env     # Mac/Linux

# 3. If .env doesn't exist, create it from template
copy env.example .env    # Windows
cp env.example .env      # Mac/Linux

# 4. Edit .env file and ensure JWT_SECRET is set:
# JWT_SECRET=your_super_secret_jwt_key_CHANGE_THIS_IN_PRODUCTION_123!@#

# 5. Restart backend server
npm run dev
```

#### Error: `Module not found` or `Cannot find module`

**Cause:** Dependencies not installed or node_modules corrupted.

**Solutions:**
```bash
# 1. Delete node_modules and package-lock.json
cd backend
rm -rf node_modules package-lock.json    # Mac/Linux
rmdir /s node_modules && del package-lock.json    # Windows

# 2. Reinstall dependencies
npm install

# 3. Try starting server again
npm run dev
```

#### Error: Port 5000 Already in Use

**Cause:** Another application is using port 5000.

**Solutions:**

**Windows PowerShell:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace <PID> with actual Process ID from output)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process (replace <PID> with actual PID)
kill -9 <PID>
```

**Alternative:** Change backend port in `.env` file:
```env
PORT=5001  # Use different port
```

Then update frontend API URL accordingly.

---

### Issue 2: Frontend Can't Connect to Backend API

#### Error: `Network Error` or `ERR_CONNECTION_REFUSED` in browser console

**Cause:** Backend server is not running or CORS configuration is incorrect.

**Solutions:**
```bash
# 1. Verify backend is running
# Check terminal where you ran "npm run dev" - should show backend output

# 2. Test backend directly
curl http://localhost:5000/api/health
# Windows PowerShell: Invoke-WebRequest -Uri http://localhost:5000/api/health

# 3. If backend is not running, start it
cd backend
npm run dev

# 4. Check CORS configuration in backend/server.js
# FRONTEND_URL should be: http://localhost:5173

# 5. Verify .env file has correct FRONTEND_URL
# FRONTEND_URL=http://localhost:5173
```

#### Error: `401 Unauthorized` when making API requests

**Cause:** Authentication token expired or missing.

**Solutions:**
- Log out and log back in to get a fresh token
- Check browser localStorage/sessionStorage for token
- Verify JWT_SECRET in backend `.env` matches what was used when token was created

### Issue 3: Database Connection Failed

#### Error: `password authentication failed for user "postgres"`

**Cause:** Database password in `.env` doesn't match docker-compose.yml.

**Solutions:**
```bash
# 1. Check password in docker-compose.yml
# POSTGRES_PASSWORD should be: servup_password_2024

# 2. Check password in backend/.env
# DB_PASSWORD should be: servup_password_2024

# 3. If passwords don't match, update .env to match docker-compose.yml
# Or update docker-compose.yml to match .env (then restart containers)

# 4. Restart database containers after changes
docker-compose down
docker-compose up -d

# 5. Wait for database to start, then try backend again
```

#### Error: `database "servup_db" does not exist`

**Cause:** Database hasn't been created or migrations haven't been run.

**Solutions:**
```bash
# 1. Verify database exists
docker exec -it servup_postgres psql -U postgres -l

# 2. If servup_db doesn't exist, run migrations
cd backend
npm run db:migrate

# 3. If migrations fail, reset database
npm run db:reset
```

---

### Issue 4: Port Already in Use

#### Error: `Port 5000 is already in use` or `Port 5173 is already in use`

**Solutions:** (Already covered in Issue 1, but repeated for completeness)

**Windows PowerShell:**
```powershell
# Find process using the port
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Kill the process (replace <PID> with actual Process ID)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Find process using the port
lsof -i :5000
lsof -i :5173

# Kill the process (replace <PID> with actual PID)
kill -9 <PID>
```

**Alternative:** Change ports in configuration files and restart servers.

### Issue 5: Docker Issues

#### Error: `Cannot connect to Docker daemon`

**Cause:** Docker Desktop is not running.

**Solutions:**
```bash
# 1. Check if Docker Desktop is running
# Windows: Look for Docker Desktop icon in system tray
# Mac: Look for Docker Desktop icon in menu bar

# 2. Start Docker Desktop application

# 3. Wait for Docker to fully start (30-60 seconds)

# 4. Verify Docker is running
docker ps

# 5. If still not working, restart Docker Desktop
```

#### Error: `docker-compose: command not found`

**Cause:** Docker Compose is not installed or not in PATH.

**Solutions:**
```bash
# Option 1: Install Docker Desktop (includes docker-compose)
# Download from: https://www.docker.com/products/docker-desktop

# Option 2: Use newer Docker Compose V2 syntax (no hyphen)
docker compose up -d    # Instead of docker-compose up -d
docker compose ps       # Instead of docker-compose ps
```

#### Error: `Error response from daemon: Conflict`

**Cause:** Containers with same names already exist.

**Solutions:**
```bash
# 1. Stop and remove existing containers
docker-compose down

# 2. If containers still exist, force remove
docker rm -f servup_postgres servup_pgadmin

# 3. Start fresh
docker-compose up -d
```

#### Error: `Permission denied` on Mac/Linux

**Cause:** Docker requires sudo or user not in docker group.

**Solutions:**
```bash
# Option 1: Add user to docker group (recommended)
sudo usermod -aG docker $USER
# Log out and log back in for changes to take effect

# Option 2: Use sudo (not recommended for development)
sudo docker-compose up -d
```

### Issue 6: Database Migrations Failed

#### Error: `Migration failed` or table already exists

**Cause:** Database state is inconsistent or migrations were partially run.

**Solutions:**
```bash
# Option 1: Reset database completely (recommended for development)
cd backend
npm run db:reset

# Option 2: Manual reset
cd backend
npm run db:migrate:undo:all    # Undo all migrations
npm run db:migrate             # Run migrations again
npm run db:seed                # Seed test data
```

#### Error: `relation "SequelizeMeta" already exists`

**Cause:** Migration tracking table exists but migrations are incomplete.

**Solutions:**
```bash
# 1. Check migration status
cd backend
npx sequelize-cli db:migrate:status

# 2. If needed, reset completely
npm run db:reset
```

### Issue 7: Dependencies Installation Failed

#### Error: `npm ERR!` during installation

**Cause:** Network issues, corrupted cache, or package conflicts.

**Solutions:**
```bash
# 1. Clear npm cache
npm cache clean --force

# 2. Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json    # Mac/Linux
rmdir /s node_modules && del package-lock.json    # Windows

# 3. Try installation again
npm install

# 4. If still failing, try with verbose output
npm install --verbose

# 5. Check Node.js and npm versions are compatible
node --version    # Should be v18+
npm --version     # Should be v9+
```

### Issue 8: Frontend Build Errors

#### Error: Module not found or import errors in frontend

**Cause:** Frontend dependencies not installed or outdated.

**Solutions:**
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Clean and reinstall
rm -rf node_modules package-lock.json
npm install

# 3. Clear Vite cache
rm -rf node_modules/.vite    # Mac/Linux
rmdir /s node_modules\.vite    # Windows

# 4. Restart development server
npm run dev
```

---

## ✅ Final Verification Checklist

After completing all setup steps, use this checklist to verify everything is working correctly:

### Infrastructure Verification

- [ ] **Docker Containers Running**
  ```bash
  docker ps
  # Should show: servup_postgres and servup_pgadmin (both STATUS: Up)
  ```

- [ ] **Database Accessible**
  ```bash
  docker exec -it servup_postgres psql -U postgres -d servup_db -c "SELECT 1;"
  # Should return: 1
  ```

- [ ] **Database Tables Created**
  ```bash
  docker exec -it servup_postgres psql -U postgres -d servup_db -c "\dt"
  # Should list 9 tables: users, employees, categories, suppliers, products, orders, order_items, waste_records, audit_logs
  ```

- [ ] **Test Data Seeded**
  ```bash
  docker exec -it servup_postgres psql -U postgres -d servup_db -c "SELECT COUNT(*) FROM users;"
  # Should return: 4 (admin, responsable_stocks, responsable_employes, employe)
  ```

### Backend Verification

- [ ] **Backend Server Running**
  - Terminal shows: "✅ Server is ready to accept requests!"
  - No error messages in terminal

- [ ] **Health Endpoint Responds**
  ```bash
  curl http://localhost:5000/api/health
  # Should return JSON with status: "success"
  ```

- [ ] **Environment Variables Configured**
  - `backend/.env` file exists
  - Contains all required variables (DB_*, JWT_SECRET, PORT, etc.)

### Frontend Verification

- [ ] **Frontend Server Running**
  - Terminal shows: "Local: http://localhost:5173/"
  - No error messages in terminal

- [ ] **Login Page Loads**
  - Browser opens `http://localhost:5173`
  - Login page displays correctly
  - No console errors (F12 → Console)

### Application Functionality Verification

- [ ] **Can Login**
  - Login with test accounts works
  - Redirected to dashboard after login
  - Username displays correctly

- [ ] **Dashboard Displays**
  - Statistics cards show data
  - No errors on dashboard page
  - Navigation menu appears

- [ ] **Role-Based Access Works**
  - Admin sees all menu items
  - Stock Manager sees only products, suppliers, reports
  - HR Manager sees only employees, reports
  - Employee sees only dashboard, orders

- [ ] **CRUD Operations Work**
  - Can create, read, update, delete records (based on role)
  - Forms validate correctly
  - Data persists after page refresh

### API Verification (Optional)

Using Postman or Thunder Client:

- [ ] **Login API Works**
  ```
  POST http://localhost:5000/api/auth/login
  Body: {"username": "admin", "password": "admin123"}
  # Should return token and user data
  ```

- [ ] **Protected Routes Require Auth**
  ```
  GET http://localhost:5000/api/products
  # Without token: Should return 401 Unauthorized
  # With token: Should return products list
  ```

---

## 📚 Next Steps

Now that everything is running and verified:

1. ✅ **Explore the Application**
   - Login with different roles
   - Navigate through all features
   - Test CRUD operations

2. ✅ **Review Documentation**
   - Check [API Documentation](./API.md)
   - Review [Database Schema](./database-schema.md)
   - Read [Limitations](./LIMITATIONS-AND-FUTURE-PLANS.md)

3. ✅ **Access Database Tools**
   - Use pgAdmin at `http://localhost:5050` to explore data
   - Run SQL queries to understand data structure

4. ✅ **Review Code Structure**
   - Explore backend controllers, models, routes
   - Review frontend components, views, services
   - Understand the architecture

5. ✅ **Start Development**
   - Make your first code changes
   - Test new features
   - Follow development best practices

---

## 🎓 Additional Resources

### Documentation Files

- **[README.md](../README.md)** - Project overview and quick start
- **[QUICK-START.md](../QUICK-START.md)** - Fast setup guide
- **[Testing Guide](./TESTING.md)** - Testing procedures and examples
- **[Database Schema](./database-schema.md)** - Complete database structure
- **[ERD Diagram](./ERD.md)** - Entity-relationship diagram
- **[Limitations](./LIMITATIONS-AND-FUTURE-PLANS.md)** - Known issues and future plans

### Useful Commands Reference

```bash
# Development
npm run dev                    # Start both servers
npm run dev:backend           # Start only backend
npm run dev:frontend          # Start only frontend

# Database
npm run db:migrate            # Run migrations
npm run db:seed               # Seed test data
npm run db:reset              # Reset database

# Docker
docker-compose up -d          # Start database
docker-compose down           # Stop database
docker-compose logs postgres  # View database logs
docker ps                     # List running containers
```

---

## 📞 Need Help?

- Check the main README: `/ServUp-v2/README.md`
- Check database schema: `/documentation/database-schema.md`
- Review code comments in source files

---

**Good luck with development! 🚀**

