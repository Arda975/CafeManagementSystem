# Amedim Cafe – Cafe Management System

A cafe ordering and management app. Customers order from a QR menu, waiters
see the tables and take payments, and admins manage the menu, stock and staff
accounts.

- **Backend:** ASP.NET Core 8 Web API, Entity Framework Core 9 (code-first, migrations), PostgreSQL
- **Auth:** JWT bearer tokens, role-based authorization (`Admin`, `Waiter`), PBKDF2 password hashing
- **Frontend:** React 18 + Vite, React Router, Axios

## Architecture

```
React (Vite)  ──HTTP/JSON + Bearer token──►  ASP.NET Core API  ──EF Core──►  PostgreSQL

api/AmedimCafeApi/AmedimCafeApi
├── Controllers/   thin HTTP layer: routing, [Authorize], status codes
├── Services/      business rules (orders, stock, payments, users, auth)
├── Dtos/          request/response contracts + validation attributes
├── Entities/      domain model
├── Data/          DbContext, Fluent API configurations, seed data, startup initializer
├── Auth/          JWT options, token creation, role names
└── Common/        app exceptions + global exception handler (ProblemDetails)
```

Data model: `Category 1─* Product`, `CafeTable 1─* Order 1─* OrderItem *─1 Product`, `User (Role)`.

## Endpoints

| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/login` | public |
| GET | `/api/categories`, `/api/products?categoryId=`, `/api/products/{id}` | public |
| POST | `/api/orders` | public (customers order from the QR menu) |
| GET | `/api/tables`, `/api/tables/{id}` | Admin, Waiter |
| POST | `/api/tables/{id}/payment` | Admin, Waiter |
| POST / PUT / DELETE | `/api/products`, `/api/products/{id}` | Admin |
| GET / POST / PUT / DELETE | `/api/users`, `/api/users/{id}` | Admin |

Without a token the API returns **401**; with a valid token but the wrong role it returns **403**.
Every endpoint requires a token unless it is explicitly marked `[AllowAnonymous]` (fallback authorization policy).

## Design decisions

- **Server-side pricing.** An order only contains product ids and quantities. Prices and the total
  are read from the database, so a modified request cannot change the bill.
- **Stock without overselling.** Stock is decreased with one conditional `UPDATE ... WHERE StockQuantity >= @qty`
  per product inside a transaction. Concurrent orders for the last item cannot both succeed, and if any
  item is out of stock the whole order is rolled back. Rows are updated in product-id order to avoid deadlocks.
- **Price snapshot.** `OrderItem.UnitPrice` stores the price at order time; later price changes don't alter old bills.
- **Derived table state.** A table is occupied while it has open orders; its bill is the sum of those orders.
  Nothing is stored twice, so it can't get out of sync.
- **Soft delete for products.** Deleted products leave the menu but old orders still reference them.
- **Errors.** Business errors become `ProblemDetails` responses (400/404/409); unexpected errors are logged
  and the client only sees a generic message.
- **Secrets stay out of git.** Connection string password, JWT signing key and the first admin password
  come from user secrets or environment variables.
- **Rate limiting.** Login is limited to 5 attempts per minute per IP (brute force), public ordering to 20 per minute (spam).

## Running locally

Requirements: .NET 8 SDK, PostgreSQL, Node.js 18+.

### 1. API secrets (once)

```bash
cd api/AmedimCafeApi/AmedimCafeApi
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=AmedimCafe;Username=postgres;Password=YOUR_DB_PASSWORD"
dotnet user-secrets set "Jwt:Key" "AT_LEAST_32_RANDOM_CHARACTERS_HERE_______"
dotnet user-secrets set "SeedAdmin:Password" "YOUR_ADMIN_PASSWORD"
```

The first admin user (`admin`) is created at startup when the Users table is empty.

**Forgot the admin password?** There is deliberately no web endpoint for this; recovery requires
access to the machine running the API:

```bash
dotnet user-secrets set "SeedAdmin:Password" "NEW_PASSWORD"   # min. 6 characters
dotnet user-secrets set "SeedAdmin:ResetPassword" "true"
dotnet run --launch-profile http       # log: "Password for admin user 'admin' was reset ..."
dotnet user-secrets remove "SeedAdmin:ResetPassword"          # turn it off again
```

This also re-creates the `admin` user (with the Admin role) if it was deleted.

### 2. Database

```bash
dotnet tool install --global dotnet-ef --version 9.0.1
dotnet ef migrations add InitialCreate     # only the first time, then commit the Migrations folder
dotnet run --launch-profile http           # applies migrations automatically in Development
```

The database, tables, the menu, categories and tables 1–10 are created by the migration.
Swagger: http://localhost:5000/swagger (use **Authorize** with the token from `/api/auth/login`).

### 3. Frontend

```bash
cd react-app/cafe_management_system
npm install
npm run dev      # http://localhost:5173
```

To use the QR menu from a phone on the same network, set `VITE_API_URL` in a `.env` file
(see `.env.example`) to the computer's LAN address and add that origin to `Cors:AllowedOrigins`.

## Possible next steps

- Unit/integration tests for the order and payment services (xUnit + Testcontainers)
- Refresh tokens and token revocation
- Real-time table updates with SignalR
