# All Jobs Home Assignment - Full Stack Application

A responsive Full Stack application for managing products and orders with role-based access control (ADMIN & VIEWER).

**Tech Stack:**
- **Backend**: .NET 10 (C#) with ASP.NET Core
- **Frontend**: React 18 + Next.js 16 (with TypeScript)
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Tokens) with Refresh Token Support
- **State Management**: Redux Toolkit
- **API Client**: Axios with Request Interceptors
- **Containerization**: Docker & Docker Compose

---

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repo-url>
cd AllJobsHomeAssignment

# Build and start all services
docker-compose up --build

# Services will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
# Database: localhost:3306
```

The application will:
1. Initialize MySQL database automatically
2. Seed initial data (users, products, orders)
3. Start the .NET backend API
4. Start the React frontend

### Option 2: Local Development

#### Prerequisites
- .NET 10 SDK
- Node.js 18+
- MySQL 8.0
- PowerShell 7+

#### Backend Setup
```bash
# Navigate to server directory
cd AllJobsHomeAssignment.Server

# Restore packages
dotnet restore

# Set up database (migrations already applied)
dotnet ef database update

# Run the server
dotnet run

# API will be available at: http://localhost:5066 (or configured port)
```

#### Frontend Setup
```bash
# Navigate to client directory
cd alljobshomeassignment.client

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend will be available at: http://localhost:3000
```

---

## 🔐 Default Credentials

### Test Users (Pre-seeded in Database)

**ADMIN User**
- Email: `admin@example.com`
- Password: `Admin123!`
- Access: Full system access (create, edit, delete products & orders, manage users)

**VIEWER User**
- Email: `viewer@example.com`
- Password: `Viewer123!`
- Access: Read-only (view products & orders only)

---

## 📋 Initial Data

The database is automatically seeded with:
- **2 Users**: 1 ADMIN + 1 VIEWER
- **10 Products**: 
  - Mix of active and inactive (every 3rd product is INACTIVE)
  - Varied stock quantities (7-25 units)
  - Price range: ₪10-₪100
- **Sample Orders**: Pre-populated for testing

---

## 🌐 API Endpoints

### Authentication
```
POST /api/auth/login
  Body: { email, password }
  Response: { accessToken, refreshToken, user: { id, email, role } }

POST /api/auth/register
  Body: { email, password, firstName, lastName, phone, address }
  Response: { accessToken, user: { id, email, role: "VIEWER" } }
```

### Products (All require authentication)
```
GET /api/products?status=ACTIVE&search=Product
  Returns: Product list (all roles)

GET /api/products/{id}
  Returns: Product details (all roles)

POST /api/products (ADMIN only)
  Body: { name, sku, description, price, stockQuantity }
  Response: 201 Created

PUT /api/products/{id} (ADMIN only)
  Body: { name, sku, description, price, stockQuantity }
  Response: 200 OK

PATCH /api/products/{id}/status (ADMIN only)
  Response: 200 OK (toggles ACTIVE ↔ INACTIVE)
```

### Orders (All require authentication)
```
GET /api/orders?status=NEW
  Returns: Order list (all roles)

GET /api/orders/{id}
  Returns: Order details with items (all roles)

POST /api/orders (ADMIN only)
  Body: { 
	customerName, 
	customerEmail, 
	items: [{ productId, quantity }, ...]
  }
  Response: 201 Created
  Note: Stock is automatically deducted

PATCH /api/orders/{id}/status?status=PAID (ADMIN only)
  Response: 200 OK
  Note: Cannot cancel PAID orders

PATCH /api/orders/{id}/status?status=CANCELLED (ADMIN only)
  Response: 200 OK
  Note: Stock is restored for cancelled orders
```

### Users (ADMIN only)
```
GET /api/users
  Returns: List of all users (excluding current user)

PUT /api/users/{id}/role
  Body: { role: "ADMIN" | "VIEWER" }
  Response: 204 No Content

DELETE /api/users/{id}
  Response: 204 No Content
```

---

## 🛡️ Authorization & Security

### Role-Based Access Control (RBAC)

**ADMIN Role**
- Full access to all endpoints
- Can create, read, update, delete products
- Can create, read, update order status
- Can manage users (view, change roles, delete)
- Can view all data

**VIEWER Role**
- Read-only access to products
- Read-only access to orders
- Cannot create, edit, delete, or change status
- Cannot access user management

### HTTP Response Codes
- **200 OK**: Successful operation
- **201 Created**: Resource successfully created
- **204 No Content**: Successful deletion/update
- **400 Bad Request**: Invalid input, validation failed
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Authenticated but insufficient permissions
- **404 Not Found**: Resource not found or user not registered
- **409 Conflict**: Duplicate email or business logic violation

---

## 📁 Project Structure

```
AllJobsHomeAssignment/
├── AllJobsHomeAssignment.Server/          # .NET 10 Backend
│   ├── Controllers/                       # API endpoints
│   │   ├── AuthController.cs              # Login, Register
│   │   ├── ProductsController.cs          # Product CRUD
│   │   ├── OrdersController.cs            # Order management
│   │   └── UsersController.cs             # User management
│   ├── Models/                            # Data models
│   │   ├── User.cs
│   │   ├── Product.cs
│   │   ├── Order.cs
│   │   └── Enums.cs
│   ├── Services/                          # Business logic
│   │   ├── ProductService.cs
│   │   ├── OrderService.cs
│   │   ├── UsersService.cs
│   │   └── PasswordHasher.cs
│   ├── Data/                              # Database
│   │   ├── ApplicationDbContext.cs        # EF Core DbContext
│   │   ├── DbInitializer.cs               # Seed data
│   │   └── Migrations/                    # DB migrations
│   ├── Program.cs                         # App configuration
│   └── Dockerfile                         # Container config
│
├── alljobshomeassignment.client/          # React + Next.js Frontend
│   ├── pages/                             # Next.js pages
│   │   ├── login.tsx                      # Login page
│   │   ├── register.tsx                   # Register page
│   │   ├── products.tsx                   # Product list
│   │   ├── products/create.tsx            # Create product
│   │   ├── products/[id]/edit.tsx         # Edit product
│   │   ├── orders.tsx                     # Order list
│   │   └── orders/create.tsx              # Create order
│   ├── components/                        # Reusable components
│   ├── lib/                               # Utilities (API calls)
│   ├── store/                             # Redux state management
│   ├── Dockerfile                         # Container config
│   └── package.json                       # Dependencies
│
├── docker-compose.yml                     # Multi-container setup
├── docker-compose/
│   └── docker-compose.yml                 # Alternative compose file
├── run-integration-tests-v2.ps1           # Test suite
└── README.md                              # This file
```

---

## 🧪 Integration Tests

Run the comprehensive test suite to verify all functionality:

```bash
# Start the backend server first (if not using Docker)
cd AllJobsHomeAssignment.Server
dotnet run

# In another terminal, run tests
.\run-integration-tests-v2.ps1

# Or with custom base URL
.\run-integration-tests-v2.ps1 -BaseUrl "http://localhost:5066"
```

### Test Coverage
The test suite verifies:
- ✅ Authentication (login, token generation)
- ✅ Authorization (role-based access, 401/403)
- ✅ Product operations (create, update, filter, search)
- ✅ Order operations (create, status changes, stock management)
- ✅ Data validation (negative values, duplicates, empty fields)
- ✅ Business logic (stock deduction, restoration, status transitions)
- ✅ Error handling (proper HTTP codes and messages)
- ✅ User management (list, change roles, delete)

**Total Tests**: 25+
**Run Time**: ~30 seconds
**Success Rate**: Should be 100%

---

## 🗄️ Database Setup

### Connection String
The application automatically connects to MySQL using:
```
Server=db;Port=3306;Database=alljobs_db;User=alljobs_user;Password=alljobs_password;
```

For local development, update `appsettings.json`:
```json
{
  "ConnectionStrings": {
	"DefaultConnection": "server=localhost;port=3306;database=AllJobsDb;user=root;password=your-password;"
  }
}
```

### Database Schema
Automatically created on first run with:
- **Users** table (with roles & password hashing)
- **Products** table (with status, pricing, inventory)
- **Orders** table (header information)
- **OrderItems** table (line items with pricing snapshot)
- **RefreshTokens** table (token management)

---

## 🔍 Environment Variables

### Backend (Docker)
```env
ASPNETCORE_ENVIRONMENT=Development
ConnectionStrings__DefaultConnection=Server=db;Port=3306;Database=alljobs_db;User=alljobs_user;Password=alljobs_password;
```

### Frontend (Docker)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_TIMEOUT=30000
```

---

## 🐛 Troubleshooting

### Docker Issues

**Container won't start:**
```bash
# Check logs
docker-compose logs server
docker-compose logs db
docker-compose logs client

# Clean and rebuild
docker-compose down -v
docker-compose up --build
```

**Database connection timeout:**
- Wait 10-15 seconds for MySQL to be healthy
- Check `docker-compose logs db`
- Verify connection string in `appsettings.json`

**Port already in use:**
```bash
# Change ports in docker-compose.yml
# Or kill the process using the port:
# Windows: netstat -ano | findstr :3000
# Linux: lsof -i :3000
```

### API Issues

**401 Unauthorized (all requests):**
- Token is missing or expired
- Login again to get a new token
- Check `Authorization: Bearer <token>` header

**403 Forbidden (create/edit operations):**
- Logged in as VIEWER user
- Only ADMIN can perform this operation
- Login with admin@example.com

**404 Not Found (Product/Order):**
- Resource doesn't exist in database
- Check if ID is correct
- Verify using GET list endpoint first

---

## 📝 Features Implemented

### Core Requirements
- ✅ JWT-based authentication & authorization
- ✅ Product management (CRUD with status toggle)
- ✅ Order management (create, status changes, stock handling)
- ✅ Role-based access control (ADMIN & VIEWER)
- ✅ Data validation & error handling
- ✅ Password hashing & security
- ✅ Stock deduction on order creation
- ✅ Stock restoration on order cancellation
- ✅ Prevent cancellation of paid orders
- ✅ Insufficient stock detection
- ✅ Docker containerization
- ✅ MySQL database integration
- ✅ React + Next.js frontend
- ✅ Responsive UI

### Bonus Features
- 🔜 Stock report generation (CSV/PDF)
- 🔜 Pagination support
- 🔜 Advanced user management UI

---

## 📚 Technical Notes

### Storage of Product Prices in Orders
When an order is created, the current product price is stored in the `OrderItem.unitPrice` field. This preserves historical pricing information even if product prices change later.

### Race Condition Prevention
Order creation uses database transactions to prevent race conditions when deducting stock across multiple items.

### Token Expiration
- **Access Token**: Expires in 60 minutes (configurable in `appsettings.json`)
- **Refresh Token**: Can be implemented for session extension

### Password Security
- Passwords hashed using SHA-256 with salt
- Minimum requirements: 8 characters, uppercase, lowercase, digit, special character
- Regular expressions validated on frontend and backend

---

## 🤝 Contributing

To modify the codebase:

1. Backend changes → rebuild `AllJobsHomeAssignment.Server` project
2. Frontend changes → changes auto-reload in development mode
3. Database schema changes → create new migration (`dotnet ef migrations add <name>`)
4. Run integration tests after changes to verify functionality

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review integration test results
3. Check application logs in terminal or Docker
4. Review `INTEGRATION_TESTS.md` for test cases

---

## 📄 License

Internal project for assignment purposes.

---

**Last Updated**: September 2026
**Version**: 1.0
**Status**: ✅ Production Ready
