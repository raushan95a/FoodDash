# FoodDash Backend

Node.js + Express + MySQL REST API for the FoodDash food delivery project.

## Setup

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Create the database and tables first:

```bash
npm run db:migrate
npm run db:seed
npm run db:admin
npm run db:restaurant-auth
npm run db:addresses
npm run db:create-admin
```

## Main Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/customers/me`
- `PUT /api/customers/me`
- `GET /api/customers/addresses`
- `POST /api/customers/addresses`
- `PUT /api/customers/addresses/:addressId`
- `DELETE /api/customers/addresses/:addressId`
- `GET /api/restaurants`
- `POST /api/restaurants`
- `GET /api/restaurants/:id`
- `GET /api/restaurants/:id/menu`
- `POST /api/orders`
- `GET /api/orders/my-orders`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`
- `POST /api/payments`
- `POST /api/reviews`
- `POST /api/restaurant-owner/auth/login`
- `GET /api/restaurant-owner/me`
- `GET /api/restaurant-owner/dashboard`
- `PUT /api/restaurant-owner/profile`
- `GET /api/restaurant-owner/menu`
- `POST /api/restaurant-owner/menu`
- `PUT /api/restaurant-owner/menu/:itemId`
- `DELETE /api/restaurant-owner/menu/:itemId`
- `GET /api/restaurant-owner/orders`
- `GET /api/restaurant-owner/orders/:orderId`
- `PATCH /api/restaurant-owner/orders/:orderId/status`

Health check: `GET /health`

## Admin System

The backend includes a separate admin system with role-based access control.

Create the admin table and a private local admin account:

```bash
cd backend
npm run db:admin
npm run db:create-admin
```

Before running `db:create-admin`, set these private values in `backend/.env`:

```env
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_private_admin_password
ADMIN_NAME=FoodDash Admin
```

### Admin Routes

- `POST /api/admin/auth/login`
- `GET /api/admin/me`
- `GET /api/admin/dashboard`
- `GET /api/admin/analytics`
- `GET /api/admin/users`
- `GET /api/admin/users/:id`
- `PATCH /api/admin/users/:id/status`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/restaurants`
- `POST /api/admin/restaurants`
- `GET /api/admin/restaurants/:id`
- `PUT /api/admin/restaurants/:id`
- `PATCH /api/admin/restaurants/:id/approval`
- `DELETE /api/admin/restaurants/:id`
- `GET /api/admin/orders`
- `GET /api/admin/orders/:id`
- `PATCH /api/admin/orders/:id/status`
- `GET /api/admin/delivery-agents`
- `POST /api/admin/delivery-agents`
- `PUT /api/admin/delivery-agents/:id`
- `DELETE /api/admin/delivery-agents/:id`

All admin routes except login require:

```text
Authorization: Bearer <admin_jwt_token>
```

Customer tokens cannot access admin APIs because admin routes use JWT role checks.

## Restaurant Owner System

Restaurant owners have a separate dashboard and JWT role from customers and admins.

Create or reset restaurant owner password hashes for existing restaurants:

```bash
cd backend
npm run db:restaurant-auth
```

Seeded restaurant owner demo credentials:

```text
Email: spiceroute@example.com
Password: restaurant@123
```

Other seeded restaurant emails also use the same demo password:

```text
wokexpress@example.com
greenbowl@example.com
```

### Restaurant Owner Routes

- `POST /api/restaurant-owner/auth/login`
- `GET /api/restaurant-owner/me`
- `GET /api/restaurant-owner/dashboard`
- `PUT /api/restaurant-owner/profile`
- `GET /api/restaurant-owner/menu`
- `POST /api/restaurant-owner/menu`
- `PUT /api/restaurant-owner/menu/:itemId`
- `DELETE /api/restaurant-owner/menu/:itemId`
- `GET /api/restaurant-owner/orders`
- `GET /api/restaurant-owner/orders/:orderId`
- `PATCH /api/restaurant-owner/orders/:orderId/status`

All restaurant-owner routes except login require:

```text
Authorization: Bearer <restaurant_jwt_token>
```

Restaurant-owner APIs are scoped to the logged-in restaurant id, so each restaurant can only access its own profile, menu, orders, and analytics.
