# Troubleshooting Guide

## Common Issues and Solutions

### ❌ Error: `ERR_CONNECTION_REFUSED` or `Network Error`

**Symptom:** Frontend cannot connect to backend at `http://localhost:5000`

**Possible Causes:**
1. Backend server is not running
2. Backend server failed to start
3. Missing dependencies
4. Environment validation failing

**Solutions:**

#### 1. Check if Backend Server is Running

```bash
# Check if port 5000 is in use
# Windows:
netstat -ano | findstr :5000

# Mac/Linux:
lsof -i :5000
```

If nothing is running, start the backend:

```bash
cd backend
npm run dev
```

#### 2. Install Missing Dependencies

The new security improvements require additional packages:

```bash
cd backend
npm install
```

This will install:
- `express-rate-limit` - Rate limiting
- `helmet` - Security headers
- `winston` - Logging
- `uuid` - Request IDs
- `xss` - XSS protection

#### 3. Check Environment Variables

The server now validates environment variables at startup. Make sure your `.env` file exists:

```bash
cd backend
# Copy example file if you don't have .env
copy env.example .env  # Windows
# or
cp env.example .env    # Mac/Linux
```

**Required for Development:**
```env
DB_HOST=localhost
DB_NAME=servup_db
DB_USER=postgres
DB_PASSWORD=servup_password_2024
```

**Required for Production:**
```env
DB_HOST=localhost
DB_NAME=servup_db
DB_USER=postgres
DB_PASSWORD=servup_password_2024
JWT_SECRET=your_super_secret_key_at_least_32_characters_long
FRONTEND_URL=https://yourdomain.com
```

#### 4. Check Server Logs

When starting the server, check for error messages:

```bash
cd backend
npm run dev
```

Common errors:
- **Missing environment variables:** Server will exit with error message
- **Database connection failed:** Check if PostgreSQL is running
- **Module not found:** Run `npm install` again

#### 5. Verify Database is Running

```bash
# Check if Docker containers are running
docker ps

# Should see:
# servup_postgres
# servup_pgadmin

# If not running, start them:
docker-compose up -d
```

#### 6. Check for Port Conflicts

If port 5000 is already in use:

```bash
# Option 1: Change port in .env
PORT=5001

# Option 2: Find and stop the process using port 5000
```

---

### ❌ Error: `Module not found` or `Cannot find module`

**Symptom:** Server crashes with module not found errors

**Solution:**

```bash
cd backend
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json  # Mac/Linux
# or
rmdir /s /q node_modules & del package-lock.json  # Windows

npm install
```

---

### ❌ Error: Environment Variable Validation Failed

**Symptom:** Server exits immediately with environment variable errors

**Solution:**

1. Ensure `.env` file exists in `backend/` directory
2. Check that required variables are set (see env.example)
3. In development, you can use defaults, but in production all must be set

**Development Minimum:**
```env
DB_HOST=localhost
DB_NAME=servup_db
DB_USER=postgres
DB_PASSWORD=servup_password_2024
```

---

### ❌ Error: Database Connection Failed

**Symptom:** Server starts but cannot connect to database

**Solutions:**

1. **Check Docker containers:**
   ```bash
   docker ps
   docker-compose up -d
   ```

2. **Verify database credentials in .env:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=servup_db
   DB_USER=postgres
   DB_PASSWORD=servup_password_2024
   ```

3. **Test database connection:**
   ```bash
   docker exec -it servup_postgres psql -U postgres -d servup_db
   ```

4. **Check database logs:**
   ```bash
   docker-compose logs postgres
   ```

---

### ❌ Error: JWT_SECRET validation failed

**Symptom:** Server fails to start with JWT_SECRET error

**Solution:**

1. **Development:** Default is allowed (with warning)
2. **Production:** Must set JWT_SECRET with at least 32 characters

```env
# Generate a secure secret (32+ characters)
JWT_SECRET=your_super_secret_key_at_least_32_characters_long_change_this
```

---

### ❌ Error: Rate Limiting Issues

**Symptom:** "Too many requests" error after a few attempts

**Solution:**

This is by design for security. Rate limits:
- **Auth endpoints:** 5 requests per 15 minutes
- **General API:** 100 requests per 15 minutes

Wait 15 minutes or restart the server (development only).

---

### ✅ Quick Start Checklist

Before starting the server, ensure:

- [ ] Database is running (`docker-compose up -d`)
- [ ] Dependencies are installed (`npm install` in backend/)
- [ ] `.env` file exists in `backend/` directory
- [ ] Required environment variables are set
- [ ] No port conflicts (5000 is available)

**Start Backend:**
```bash
cd backend
npm run dev
```

**Start Frontend (in another terminal):**
```bash
cd frontend
npm run dev
```

---

### 🔍 Debugging Steps

1. **Check backend server is running:**
   - Open `http://localhost:5000/api/health`
   - Should return JSON response

2. **Check backend logs:**
   - Look for error messages in console
   - Check `backend/logs/error.log` if using Winston

3. **Check network tab:**
   - Open browser DevTools → Network
   - See if request is being sent
   - Check response status

4. **Check CORS:**
   - If seeing CORS errors, verify `ALLOWED_ORIGINS` in .env
   - Development: `ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174`

5. **Verify routes:**
   - Check `backend/routes/v1/index.js`
   - Ensure routes are properly mounted

---

### 📞 Still Having Issues?

1. Check the server logs for specific error messages
2. Verify all files from the improvements are in place
3. Ensure no syntax errors in modified files
4. Try starting with minimal configuration

---

**Last Updated:** 2024

