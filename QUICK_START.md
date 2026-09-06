# 🚀 QUICK START GUIDE - All Jobs Home Assignment

## 📋 What You Have Now

✅ **Complete Full Stack Application**
- Backend: .NET 10 with ASP.NET Core
- Frontend: React 18 + Next.js 16  
- Database: MySQL 8.0
- Authentication: JWT tokens
- Authorization: ADMIN & VIEWER roles
- Tests: 40+ comprehensive integration tests
- Documentation: Complete README with all instructions

---

## ⚡ Start the Application (2 Options)

### Option 1: Docker (Recommended - Easiest)
```powershell
# Navigate to project root
cd C:\Users\nkuri\source\repos\AllJobsHomeAssignment

# Start all services
docker-compose up --build

# Wait 15-20 seconds for startup
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
# Database: localhost:3306
```

### Option 2: Local Development
```bash
# Terminal 1: Start Database
mysql -u root -p < database-init.sql

# Terminal 2: Start Backend
cd AllJobsHomeAssignment.Server
dotnet run
# Backend runs at: http://localhost:5066

# Terminal 3: Start Frontend
cd alljobshomeassignment.client
npm install
npm run dev
# Frontend runs at: http://localhost:3000
```

---

## 🔐 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| ADMIN | admin@example.com | Admin123! |
| VIEWER | viewer@example.com | Viewer123! |

---

## 🧪 Run Integration Tests

```powershell
# After starting the application, in a new terminal:
cd C:\Users\nkuri\source\repos\AllJobsHomeAssignment

# Run comprehensive test suite (40+ tests)
.\run-integration-tests-comprehensive.ps1

# Or with custom URL if needed
.\run-integration-tests-comprehensive.ps1 -BaseUrl "http://localhost:5066"
```

**Expected Result:**
```
✅ ALL TESTS PASSED!
Total Tests Run: 40
Passed: 40
Failed: 0
```

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| `README.md` | 📖 Complete documentation & run instructions |
| `run-integration-tests-comprehensive.ps1` | 🧪 Full test suite (40+ tests) |
| `docker-compose.yml` | 🐳 Multi-container setup |
| `INTEGRATION_TESTS.md` | 📋 Test case specifications |
| `AllJobsHomeAssignment.sln` | 💻 Visual Studio solution |

---

## ✅ What to Test Manually

### 1. Login Flow
- ✅ Go to http://localhost:3000
- ✅ Login as admin@example.com
- ✅ Verify dashboard shows

### 2. Products (ADMIN)
- ✅ View products list
- ✅ Create new product
- ✅ Edit existing product
- ✅ Toggle product status (ACTIVE ↔ INACTIVE)
- ✅ Search & filter products

### 3. Orders (ADMIN)
- ✅ Create new order
- ✅ Verify stock decreases
- ✅ Change order status (NEW → PAID)
- ✅ Cancel order (NEW → CANCELLED)
- ✅ Verify stock increases

### 4. Stock Management
- ✅ Check product stock before order
- ✅ Create order with 2 items
- ✅ Verify stock decreased
- ✅ Cancel order
- ✅ Verify stock restored correctly

### 5. VIEWER User
- ✅ Logout and login as viewer@example.com
- ✅ Verify NO create/edit buttons visible
- ✅ Verify can only view products & orders
- ✅ Try accessing edit page → should be blocked

### 6. Permissions
- ✅ VIEWER tries to create product → blocked
- ✅ VIEWER tries to create order → blocked
- ✅ ADMIN can access all features

---

## 🐛 Troubleshooting

### "Connection refused" when starting
```powershell
# Wait 15 seconds for MySQL to start
# Check logs:
docker-compose logs db

# Restart everything:
docker-compose down -v
docker-compose up --build
```

### "Port already in use"
```powershell
# Find process using port 3000 or 8080:
netstat -ano | findstr :3000
netstat -ano | findstr :8080

# Kill process (replace PID):
taskkill /PID 12345 /F

# Or change port in docker-compose.yml
```

### Tests failing
```powershell
# Ensure backend is running:
curl http://localhost:8080/api/products

# If backend not responding, check logs:
docker-compose logs server

# Wait longer for startup (databases can be slow):
Start-Sleep -Seconds 30
```

---

## 📝 API Endpoints Summary

### Authentication
```
POST /api/auth/login          → Returns token
POST /api/auth/register       → Create new user (always VIEWER)
```

### Products (All require token)
```
GET /api/products?status=ACTIVE&search=Name    → List products
GET /api/products/{id}                         → Get one product
POST /api/products (ADMIN only)                → Create
PUT /api/products/{id} (ADMIN only)            → Update
PATCH /api/products/{id}/status (ADMIN only)   → Toggle status
```

### Orders (All require token)
```
GET /api/orders?status=NEW                     → List orders
GET /api/orders/{id}                           → Get one order
POST /api/orders (ADMIN only)                  → Create + deduce stock
PATCH /api/orders/{id}/status?status=PAID (ADMIN only)      → Change status
PATCH /api/orders/{id}/status?status=CANCELLED (ADMIN only) → Cancel + restore stock
```

### Users (ADMIN only)
```
GET /api/users                          → List all users
PUT /api/users/{id}/role                → Change role (ADMIN ↔ VIEWER)
DELETE /api/users/{id}                  → Delete user
```

---

## 🎯 Features Checklist

### Core (Required)
- [x] JWT authentication & authorization
- [x] ADMIN & VIEWER roles
- [x] Product CRUD operations
- [x] Product status toggle
- [x] Order creation with stock deduction
- [x] Order cancellation with stock restoration
- [x] Prevent cancellation of PAID orders
- [x] Insufficient stock detection
- [x] Proper error codes (401, 403, 400, 404)
- [x] MySQL database
- [x] Docker Compose setup
- [x] React + Next.js frontend
- [x] Seed data (2 users, 10+ products, 3+ orders)
- [x] Complete README
- [x] Integration tests

### Bonus (Optional)
- [ ] Stock report generation
- [ ] Pagination
- [ ] User management UI

---

## 📞 Support

See **README.md** for detailed documentation on:
- Project structure
- Database schema
- Environment variables
- Troubleshooting guide
- Technical notes

---

## ✨ You're Ready!

Your Full Stack application is **production-ready** and meets all assignment requirements.

**Next Steps:**
1. ✅ Run `docker-compose up --build`
2. ✅ Run `.\run-integration-tests-comprehensive.ps1`
3. ✅ Test manually in browser
4. ✅ Submit with confidence! 🎉

---

**Version**: 1.0 | **Status**: ✅ Complete | **Date**: September 2026
