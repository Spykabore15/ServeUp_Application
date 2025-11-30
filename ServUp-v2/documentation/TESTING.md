# Testing Guide - ServUp V2

## ✅ Testing Authentication

### Test 1: Backend Health Check

Open your browser or use curl:

```
http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "ServUp API is running",
  "timestamp": "2024-11-21T..."
}
```

---

### Test 2: Login API (using curl or Postman)

**Using PowerShell:**
```powershell
$body = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@servup.com",
    "role": "admin",
    "is_active": true,
    "created_at": "2024-11-21T..."
  }
}
```

---

### Test 3: Frontend Login

1. **Start Frontend:**
   ```powershell
   cd frontend
   npm run dev
   ```

2. **Open Browser:**
   ```
   http://localhost:5173
   ```

3. **Login with Test Account:**
   - Username: `responsable_stocks`
   - Password: `stock123`

4. **Expected Result:**
   - Login successful
   - Redirected to `/dashboard`
   - See welcome message with username
   - Can navigate to other pages

---

## 🧪 Test Accounts

| Username | Password | Role | Access |
|----------|----------|------|--------|
| `admin` | `admin123` | Administrator | Full access |
| `responsable_stocks` | `stock123` | Stock Manager | Products, Suppliers, Reports |
| `responsable_employes` | `hr123` | HR Manager | Employees, Reports |
| `employe` | `emp123` | Employee | Read-only Dashboard |

---

## 🔍 Testing Different Scenarios

### Test Invalid Credentials

```json
{
  "username": "admin",
  "password": "wrongpassword"
}
```

**Expected:**
```json
{
  "status": "error",
  "message": "Invalid credentials"
}
```

### Test Missing Fields

```json
{
  "username": "admin"
}
```

**Expected:**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "password",
      "message": "Password is required"
    }
  ]
}
```

### Test Protected Route (without token)

```
GET http://localhost:5000/api/auth/me
```

**Expected:**
```json
{
  "status": "error",
  "message": "No token provided. Please login."
}
```

### Test Protected Route (with token)

First login, then:

```powershell
$token = "YOUR_JWT_TOKEN_HERE"
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method GET -Headers @{Authorization="Bearer $token"}
```

**Expected:**
```json
{
  "status": "success",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@servup.com",
    "role": "admin",
    ...
  }
}
```

---

## 🗄️ Database Verification

### Using pgAdmin

1. Open `http://localhost:5050`
2. Login: `admin@servup.com` / `admin123`
3. Connect to `ServUp Local` server
4. Navigate to: `Databases` → `servup_db` → `Schemas` → `public` → `Tables`

### Check Users Table

```sql
SELECT id, username, email, role, is_active, last_login 
FROM users;
```

**Expected: 4 users**
- admin
- responsable_stocks
- responsable_employes
- employe

### Check Products Table

```sql
SELECT id, name, quantity, threshold, supplier_id 
FROM products 
ORDER BY id;
```

**Expected: 20 products** with various quantities

---

## 🐛 Troubleshooting

### Backend Not Starting

**Check if port 5000 is in use:**
```powershell
netstat -ano | findstr :5000
```

**Check logs:**
```
Check terminal for error messages
```

### Database Connection Failed

**Check if Docker is running:**
```powershell
docker ps
```

**Should see:** `servup_postgres` container

**Restart Docker:**
```powershell
docker compose restart postgres
```

### Frontend Can't Connect

**Check backend is running:**
```
http://localhost:5000/api/health
```

**Check CORS settings in backend server.js**

**Check frontend .env:**
```
VITE_API_URL=http://localhost:5000/api
```

---

## ✅ Success Checklist

- [ ] Backend server runs without errors
- [ ] Database connection successful
- [ ] Health check endpoint works
- [ ] Login API returns JWT token
- [ ] Frontend loads without errors
- [ ] Frontend login redirects to dashboard
- [ ] Username displays after login
- [ ] Logout works
- [ ] Protected routes require authentication

---

## 📊 Next Steps After Testing

Once all tests pass:

1. ✅ Build Products CRUD endpoints
2. ✅ Build Employees CRUD endpoints
3. ✅ Build Orders CRUD endpoints
4. ✅ Build Reports endpoints
5. ✅ Add frontend components for each feature
6. ✅ Integrate AI assistant
7. ✅ Final testing and documentation

---

**Good luck! 🚀**

