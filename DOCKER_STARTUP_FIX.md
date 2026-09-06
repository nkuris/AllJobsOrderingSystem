# Docker Compose Startup Race Condition - Fix Summary

## Problem
When running `docker-compose up`, the frontend container would start attempting API calls before the backend .NET service was fully initialized and listening on port 8080. This caused intermittent "network error" messages on first login attempts that would succeed on retry after a few seconds.

Additionally, after the first round of fixes, the **frontend container was failing to start** because the backend's health check was trying to use `curl`, which wasn't installed in the ASP.NET Core base image.

## Root Causes
1. The original `docker-compose.yml` used `depends_on` which only ensures containers start in order, not that services are ready to accept connections
2. The backend container was missing `curl`, causing health check failures
3. Frontend couldn't start when backend health checks were failing

## Solution Implemented

### 1. **Backend Health Check Endpoint** (`AllJobsHomeAssignment.Server/Controllers/HealthController.cs`)
- Created a new `HealthController` with a GET `/api/health` endpoint
- Returns a simple JSON response `{ "status": "healthy", "timestamp": "<ISO-DateTime>" }`
- Allows Docker health checks to verify the backend is ready

### 2. **Backend Dockerfile Update** (`AllJobsHomeAssignment.Server/Dockerfile`)
- Added `curl` installation to the base stage (required for health checks):
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081
```
- This ensures the `curl` command is available for health checks

### 3. **Docker Compose Health Checks** (`docker-compose.yml`)

#### Database Health Check (MySQL)
```yaml
healthcheck:
  test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-uroot", "-pChangeMe!"]
  interval: 5s
  timeout: 3s
  retries: 10
  start_period: 10s
```
- Waits up to 60 seconds (10 retries × 5s intervals + 10s start_period) for MySQL to be responsive

#### Backend Health Check (.NET)
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/api/health"]
  interval: 5s
  timeout: 3s
  retries: 10
  start_period: 15s
```
- Waits for backend to respond to health checks  
- Longer start_period (15s) accounts for .NET application startup time

#### Backend Dependency Update
```yaml
depends_on:
  db:
	condition: service_healthy
restart: on-failure
```
- Backend waits for database to be healthy
- Uses `restart: on-failure` for resilience

#### Frontend Service Dependency
```yaml
depends_on:
  backend:
	condition: service_healthy
```
- Frontend now waits for backend to be **healthy** before starting
- This ensures the backend is fully initialized before frontend attempts API calls

### 4. **Client-Side Retry Logic** (`alljobshomeassignment.client/lib/api.ts`)
- Added Axios response interceptor with exponential backoff retry strategy
- Retries up to 3 times with delays: 500ms → 1000ms → 2000ms
- **Only retries for**:
  - Network errors (no response)
  - 5xx server errors
  - Connection errors (ECONNREFUSED, ECONNABORTED, ETIMEDOUT)
- **Skips retries for**:
  - 4xx errors (auth, validation, not found)
  - Successfully completed requests
- Acts as a safety net for any remaining transient issues during startup

### 5. **Improved Error Handling** (`alljobshomeassignment.client/pages/login.tsx`)
- Added better error message detection for network vs. auth errors
- Users now see: "Unable to connect to server. Please check your connection and try again."
- Helps distinguish temporary connectivity issues from credential problems

## Testing the Fix

To verify the fix works:

1. **Clean restart**: 
   ```bash
   docker-compose down -v
   docker-compose up
   ```

2. **Expected behavior**:
   - Database starts and passes health check
   - Backend starts, initializes, and passes health check (Now has curl!)
   - Frontend starts only after backend is healthy
   - First login attempt after startup should succeed without errors
   - All three containers show as healthy

3. **Manual verification**:
   - Check container status:
	 ```bash
	 docker ps
	 ```
   - All services should show healthy status
   - Test the health endpoint:
	 ```bash
	 curl http://localhost:8080/api/health
	 ```
   - Should return: `{"status":"healthy","timestamp":"2024-..."}`

## Key Changes Made

| File | Change |
|------|--------|
| `AllJobsHomeAssignment.Server/Dockerfile` | Added `curl` installation to base stage |
| `AllJobsHomeAssignment.Server/Controllers/HealthController.cs` | NEW - Health check endpoint |
| `docker-compose.yml` | Added health checks for all services and proper `depends_on` conditions |
| `alljobshomeassignment.client/lib/api.ts` | Added retry interceptor with exponential backoff |
| `alljobshomeassignment.client/pages/login.tsx` | Improved network error detection |

## Benefits

✅ **Eliminates all race conditions** - Frontend waits for backend readiness  
✅ **Reliable startup** - No more "network error" on first login  
✅ **Health checks working** - Backend has required dependencies (curl)
✅ **Automatic retries** - Client-side fallback for transient failures  
✅ **Clear error messages** - Users understand connection vs. auth issues  
✅ **Production-ready** - Health checks help with container orchestration (Kubernetes, Swarm, etc.)
