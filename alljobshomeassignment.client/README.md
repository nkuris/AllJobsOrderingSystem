# AllJobs Ordering System - Frontend

A full-stack ordering system built with Next.js (frontend) and ASP.NET Core (backend). This project demonstrates a complete web application with product management, user authentication, and order processing.

## Technology Stack

### Frontend
- **Next.js 16.3**: React framework with server-side rendering and static generation
- **React 18.2**: UI library
- **Redux Toolkit 1.9.5**: State management
- **Axios 1.4**: HTTP client for API communication
- **TypeScript 5.2**: Type-safe JavaScript
- **ESLint 10.9.1**: Code quality and linting

### Backend
- **ASP.NET Core 10**: Web API framework
- **Entity Framework Core**: ORM for database operations
- **MySQL**: Relational database
- **JWT Authentication**: Secure token-based authentication
- **OpenAPI/Swagger**: API documentation

## Features

- **User Management**: Registration, login, and authentication with JWT tokens
- **Product Management**: Create, read, update, and delete products
- **Order Management**: Create and manage customer orders with order items
- **Authentication**: JWT-based authentication with refresh token support
- **Database**: MySQL with Entity Framework Core migrations
- **API Documentation**: OpenAPI/Swagger support

## Project Structure

```
AllJobsOrderingSystem3/
├── AllJobsHomeAssignment.Server/          # ASP.NET Core API
│   ├── Controllers/                       # API endpoints
│   ├── Services/                          # Business logic
│   ├── Models/                            # Data models
│   ├── Data/                              # EF Core context
│   └── DTOs/                              # Data transfer objects
└── alljobshomeassignment.client/          # Next.js frontend
    ├── pages/                             # Route pages
    ├── components/                        # Reusable components
    ├── store/                             # Redux slices
    ├── lib/                               # API and utilities
    └── models/                            # TypeScript interfaces
```

## Getting Started

### Prerequisites
- Node.js 16+ (for frontend)
- .NET 10 SDK (for backend)
- MySQL 8.0+ database

### Frontend Setup
```bash
cd alljobshomeassignment.client
npm install
npm run dev
```

### Backend Setup
```bash
cd AllJobsHomeAssignment.Server
dotnet restore
dotnet ef database update
dotnet run
```

## API Endpoints

- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh-token`
- **Products**: `/api/products` (GET, POST, PUT, DELETE)
- **Orders**: `/api/orders` (GET, POST, PUT, DELETE)
- **Users**: `/api/users` (GET, PUT, DELETE)

## Environment Configuration

### Frontend
- API base URL configured in `lib/api.ts`
- Authentication tokens stored in Redux state

### Backend
- Database connection: `appsettings.json`
- JWT configuration with key and expiration
- CORS enabled for frontend communication

## Development

- Frontend development server: `npm run dev` (runs on port 3000)
- Backend API server: `dotnet run` (runs on port 5000)
- Swagger API docs available at: `http://localhost:5000/swagger`

## Docker

Both frontend and backend include Dockerfile configurations for containerized deployment.
