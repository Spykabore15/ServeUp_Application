# Quick Fix for Connection Error

## Immediate Solution

The error `ERR_CONNECTION_REFUSED` means the backend server is not running. Here's how to fix it:

### Step 1: Install New Dependencies

The security improvements added new packages that need to be installed:

```bash
cd backend
npm install
```

This will install:
- express-rate-limit
- helmet
- winston
- uuid
- xss

### Step 2: Check/Create .env File

```bash
cd backend

# If .env doesn't exist, copy from example
copy env.example .env  # Windows
# or
cp env.example .env    # Mac/Linux
```

### Step 3: Ensure Database is Running

```bash
# From project root
docker-compose up -d

# Verify it's running
docker ps
```

### Step 4: Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
========================================
🚀 ServUp Backend Server
📍 Running on: http://localhost:5000
🌍 Environment: development
========================================
✅ Database connection established successfully.
========================================
✅ Server is ready to accept requests!
========================================
```

### Step 5: Test Connection

Open browser or use curl:
```
http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "success",
  "message": "ServUp API is running",
  "version": "1.0.0",
  "timestamp": "..."
}
```

### If Server Fails to Start

**Common issues:**

1. **Missing environment variables:**
   ```
   ❌ Missing required environment variables:
      - DB_HOST
   ```
   → Create `.env` file from `env.example`

2. **Database connection failed:**
   ```
   ❌ Unable to connect to database
   ```
   → Start database: `docker-compose up -d`

3. **Module not found:**
   ```
   Error: Cannot find module 'express-rate-limit'
   ```
   → Run `npm install` in backend directory

4. **Port already in use:**
   ```
   Error: listen EADDRINUSE: address already in use :::5000
   ```
   → Change PORT in .env or stop the other process

---

## Quick Command Sequence

```bash
# 1. Start database
docker-compose up -d

# 2. Install dependencies (if not done)
cd backend
npm install

# 3. Create .env (if not exists)
copy env.example .env  # Windows
# or
cp env.example .env    # Mac/Linux

# 4. Start backend
npm run dev
```

The server should now be running and the frontend should be able to connect!

