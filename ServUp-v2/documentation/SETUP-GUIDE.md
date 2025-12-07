# ServUp V2 - Complete Setup Guide

## 📋 Step-by-Step Installation Guide

Follow these steps carefully to get ServUp V2 running on your machine.

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

### Optional Tools
- **Git** - For version control
- **VS Code** - Recommended code editor
- **Postman** - For API testing

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

You should see two containers: `servup_postgres` and `servup_pgadmin`

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

Create your `.env` file:

```bash
# On Windows PowerShell
copy env.example .env

# On Mac/Linux
cp env.example .env
```

**Edit `.env` file** with your text editor:

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

⚠️ **Important:** Change `JWT_SECRET` to a random string in production!

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
...
```

### 3.4 Seed Test Data

Populate database with sample data:

```bash
npm run db:seed
```

This creates:
- 4 test user accounts
- Sample products
- Sample employees
- Sample orders
- Etc.

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

Open your browser and go to:
```
http://localhost:5000/api/health
```

You should see:
```json
{
  "status": "success",
  "message": "ServUp API is running",
  "timestamp": "2024-11-21T..."
}
```

✅ **Backend is ready!** Leave this terminal window open.

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

You should see the **ServUp Login Page**! 🎉

✅ **Frontend is ready!**

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

After login:
- You should be redirected to `/dashboard`
- You should see "Bienvenue [username]!"
- The navigation should work
- Logout button should work

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

### Backend won't start

**Error:** `ECONNREFUSED localhost:5432`

**Solution:** Database not running
```bash
docker-compose up -d
```

---

**Error:** `JWT_SECRET is not defined`

**Solution:** Create or fix `.env` file in `backend/` folder

---

### Frontend can't connect to API

**Error:** `Network Error` in browser console

**Solution:** Make sure backend is running on port 5000

---

### Database Connection Failed

**Error:** `password authentication failed for user "postgres"`

**Solution:** Check `.env` file - password should match docker-compose.yml

---

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:** Kill process using that port or change port in `.env`

Windows:
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Mac/Linux:
```bash
lsof -i :5000
kill -9 <PID>
```

---

### Docker Issues

**Error:** `Cannot connect to Docker daemon`

**Solution:** Make sure Docker Desktop is running

---

**Error:** `docker-compose: command not found`

**Solution:** Install Docker Desktop or use `docker compose` (no hyphen) on newer versions

---

## 📚 Next Steps

Now that everything is running:

1. ✅ Explore the application
2. ✅ Test different user roles
3. ✅ Check the database in pgAdmin
4. ✅ Review the code structure
5. ✅ Start building features!

---

## 📞 Need Help?

- Check the main README: `/ServUp-v2/README.md`
- Check database schema: `/documentation/database-schema.md`
- Review code comments in source files

---

**Good luck with development! 🚀**

