# ⚡ ServUp V2 - Quick Start Guide

## 🎯 **First Time Setup**

Run these commands **once** when you first clone the project:

```powershell
# Step 1: Navigate to project
cd ServUp-v2

# Step 2: Start database
docker-compose up -d

# Step 3: Install all dependencies
npm run install:all

# Step 4: Create database tables
npm run db:migrate

# Step 5: Add test data
npm run db:seed
```

---

## 🚀 **Daily Development Workflow**

Every time you want to work on the project:

```powershell
# Navigate to project root
cd ServUp-v2

# Start BOTH servers with ONE command!
npm run dev
```

**That's it!** 🎉

You'll see output from both servers:
- **Backend:** Running on `http://localhost:5000`
- **Frontend:** Running on `http://localhost:5173`

---

## 🛑 **Stopping the Servers**

Press `Ctrl + C` in the terminal (it will stop both servers)

---

## 📊 **What's Running?**

When you run `npm run dev`, you get:

| Service | URL | What it does |
|---------|-----|--------------|
| Backend API | http://localhost:5000 | Handles authentication, database operations |
| Frontend | http://localhost:5173 | Vue.js user interface |
| PostgreSQL | localhost:5432 | Database (runs in Docker) |
| pgAdmin | http://localhost:5050 | Database management UI |

---

## 🧪 **Test Accounts**

Login with these accounts:

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Administrator |
| `responsable_stocks` | `stock123` | Stock Manager |
| `responsable_employes` | `hr123` | HR Manager |
| `employe` | `emp123` | Employee |

---

## 🔧 **Useful Commands**

### From Root Directory (ServUp-v2/)

```powershell
# Start both servers
npm run dev

# Start only backend
npm run dev:backend

# Start only frontend
npm run dev:frontend

# Reset database (clear and re-seed)
npm run db:reset
```

### Database Commands

```powershell
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View database logs
docker-compose logs postgres

# Restart database
docker-compose restart
```

---

## 🐛 **Troubleshooting**

### Backend won't start
```powershell
cd backend
npm install
npm run dev
```

### Frontend won't start
```powershell
cd frontend
npm install
npm run dev
```

### Database connection failed
```powershell
# Check if Docker is running
docker ps

# Should see: servup_postgres container

# If not, start it
docker-compose up -d
```

### Reset everything
```powershell
# Stop all servers (Ctrl+C)
# Reset database
npm run db:reset
# Restart
npm run dev
```

---

## ✅ **Success Checklist**

After running `npm run dev`, verify:
- [ ] No errors in terminal
- [ ] Backend shows: "✅ Server is ready to accept requests!"
- [ ] Frontend shows: "Local: http://localhost:5173/"
- [ ] Can access: http://localhost:5173
- [ ] Can login with test accounts

---

## 🎓 **Pro Tips**

1. **Keep Docker running** - The database needs Docker Desktop running
2. **One terminal** - You only need ONE terminal for both servers now!
3. **Auto-restart** - Code changes auto-reload (both backend and frontend)
4. **Check logs** - All output appears in the same terminal

---

**Happy coding! 🚀**

