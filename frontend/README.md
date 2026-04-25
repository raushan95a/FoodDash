# FoodDash Frontend

React + Vite frontend for the FoodDash food delivery website.

## Setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The app expects the backend at `http://localhost:5000/api`.

## Customer App

Open:

```text
http://localhost:5173
```

Main customer pages:

- `/`
- `/restaurants`
- `/restaurants/:id`
- `/cart`
- `/checkout`
- `/profile` for profile editing, saved addresses, and order history
- `/orders/:id` for order tracking and delivered-order reviews

Restaurant partner registration:

```text
http://localhost:5173/restaurant/register
```

New restaurant registrations are submitted for admin approval before appearing in customer search.

## Restaurant Owner Dashboard

Open:

```text
http://localhost:5173/restaurant/login
```

Use a restaurant owner account created by the backend. Seeded demo credentials:

```text
Email: spiceroute@example.com
Password: restaurant@123
```

Other seeded restaurant emails also use `restaurant@123` after running `npm run db:restaurant-auth` in `backend/`:

```text
wokexpress@example.com
greenbowl@example.com
```

Restaurant owner pages:

- `/restaurant`
- `/restaurant/menu`
- `/restaurant/orders`
- `/restaurant/profile`

The restaurant dashboard stores a separate restaurant JWT in local storage, so customer and admin logins do not grant access to restaurant-owner pages.

## Admin Panel

Open:

```text
http://localhost:5173/admin/login
```

Use the private admin account created from `backend/.env` with `npm run db:create-admin`.

Admin pages:

- `/admin`
- `/admin/users`
- `/admin/restaurants`
- `/admin/orders` with status updates and delivery-agent assignment
- `/admin/delivery-agents`

The admin panel stores a separate admin JWT in local storage, so normal customer login does not grant access to admin pages.
