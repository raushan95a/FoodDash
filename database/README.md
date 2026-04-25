# FoodDash Database

This folder contains the MySQL database implementation for the FoodDash project.

## Files

- `migrations/001_create_fooddash_schema.sql`: Creates the database, main tables, indexes, views, and triggers.
- `migrations/002_create_admin_system.sql`: Creates the admin authentication table.
- `migrations/003_add_restaurant_owner_auth.sql`: Adds restaurant-owner password support for the restaurant dashboard.
- `migrations/004_create_customer_addresses.sql`: Adds saved customer addresses and backfills existing customer profile addresses.
- `seeds/001_seed_fooddash.sql`: Adds sample customers, restaurants, delivery agents, menu items, an order, payment, and review.

## Run

```bash
mysql -u root -p < database/migrations/001_create_fooddash_schema.sql
mysql -u root -p fooddash < database/seeds/001_seed_fooddash.sql
mysql -u root -p fooddash < database/migrations/002_create_admin_system.sql
mysql -u root -p fooddash < database/migrations/003_add_restaurant_owner_auth.sql
mysql -u root -p fooddash < database/migrations/004_create_customer_addresses.sql
```

Seeded restaurant owners can log in with their restaurant email and the demo password `restaurant@123`.
