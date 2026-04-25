# Food Delivery Website Application - Complete Analysis & Architecture Guide

## 📋 REQUIREMENT VALIDATION AGAINST TEACHER'S 11-STEP PROJECT

### ✅ Alignment Check with Teacher Instructions

#### Your Project Requirements:
- **Type**: Website Application (NOT mobile, NOT cloud-based)
- **Backend**: Node.js (Express.js)
- **Frontend**: HTML/CSS/JavaScript or React
- **Database**: MySQL (Local)
- **Hosting**: Local development (NO Docker, NO Cloud Services)

#### 11 Steps Required:
```
✅ Step 1: Problem Definition
✅ Step 2: Requirement Analysis (Entities, Relationships, Functional Requirements)
✅ Step 3: ER Diagram (Using draw.io or Lucidchart)
✅ Step 4: Convert ER to Tables + Description + Normalization (3NF)
✅ Step 5: Database Implementation (DDL/DML/DQL)
✅ Step 6: SELECT/JOIN/Aggregate Queries
✅ Step 7: Views & Triggers (Where Applicable)
✅ Step 8: Backend Integration (Python/Node.js + Database)
✅ Step 9: Frontend (Forms/Display)
✅ Step 10: Testing (All CRUD Operations)
✅ Step 11: Sample Screenshots (Output)
```

#### Report Format Required:
```
✅ Title Page (Group Members, College, Date)
✅ Abstract (100-150 words)
✅ Introduction
✅ Aim & Objectives
✅ Requirement Analysis (with entities & relationships)
✅ ER Diagram (screenshot)
✅ Database Schema (CREATE TABLE statements)
✅ SQL Queries (INSERT, SELECT, JOIN, Aggregates)
✅ Implementation (Frontend + Backend Code)
✅ Screenshots (Output)
✅ Conclusion
✅ Future Work
```

---

## PROJECT ANALYSIS: FOOD DELIVERY WEBSITE

### STEP 1: Problem Definition

#### Problem Statement
The existing food delivery process is inefficient. Customers struggle to:
- Browse multiple restaurants and menus easily
- Place orders without phone calls or complex processes
- Track delivery status in real-time
- Make secure online payments
- Search for dishes by cuisine or dietary preferences

Restaurants struggle to:
- Manage orders manually
- Update menu items and availability
- Organize delivery workforce
- View sales and customer feedback

#### Solution
A **centralized web platform** that connects customers, restaurants, and delivery agents through a digital ecosystem enabling:
- Easy restaurant discovery and menu browsing
- Seamless order placement and payment
- Real-time order tracking
- Customer reviews and ratings
- Admin dashboard for restaurants and delivery management

#### Why It Matters
- **For Customers**: Convenience, variety, transparency
- **For Restaurants**: Increased reach, organized operations
- **For Society**: Supports small restaurants, job creation
- **Business Model**: Commission-based revenue

---

## STEP 2: Requirement Analysis

### 2.1 Functional Requirements

#### Customer Requirements
```
1. User Registration & Authentication
   - Sign up with email, phone, password
   - Email verification
   - Login/logout functionality
   - Password reset option

2. Restaurant Discovery
   - Browse all restaurants
   - Filter by cuisine, rating, delivery time
   - Search restaurants by name
   - View restaurant details (menu, hours, delivery fee)

3. Menu Browsing
   - View all menu items
   - Filter by category (veg, non-veg, sides)
   - View item details (price, description, image)
   - Check item availability

4. Order Management
   - Add items to cart
   - Modify quantities
   - Apply discount coupons
   - View order total with taxes
   - Place order with delivery address

5. Payment Processing
   - Multiple payment methods (card, UPI, cash)
   - Secure payment gateway integration
   - Order confirmation with receipt

6. Order Tracking
   - Real-time order status updates
   - Estimated delivery time
   - Delivery agent location (optional)

7. Reviews & Ratings
   - Rate restaurants (1-5 stars)
   - Write review comments
   - View other customer reviews

8. Profile Management
   - View/edit profile information
   - Save multiple addresses
   - View order history
   - Manage favorite restaurants
```

#### Restaurant Requirements
```
1. Restaurant Registration
   - Create restaurant account
   - Upload restaurant details (name, address, cuisine)

2. Menu Management
   - Add/edit/delete menu items
   - Set prices and availability
   - Upload item images

3. Order Management
   - View incoming orders in real-time
   - Update order status (accepted, preparing, ready)
   - View order details
   - Print order receipt

4. Analytics Dashboard
   - View total orders
   - View revenue
   - View popular items
   - View customer ratings
```

#### Admin/Delivery Agent Requirements
```
1. Admin Panel
   - View all restaurants and users
   - Manage pending restaurant approvals
   - View platform statistics

2. Delivery Agent Management
   - Register delivery agents
   - Assign orders to agents
   - Track agent availability

3. Support System
   - View and resolve complaints
   - Manage refunds
```

### 2.2 Non-Functional Requirements

```
Security Requirements:
- Password hashing (bcryptjs)
- JWT authentication
- HTTPS for data transmission
- Input validation and sanitization
- SQL injection prevention
- Cross-site scripting (XSS) prevention

Performance Requirements:
- Page load time < 2 seconds
- API response time < 500ms
- Support 100+ concurrent users
- Database query optimization

Usability Requirements:
- Responsive design (mobile-friendly)
- Intuitive navigation
- Quick checkout (< 2 minutes)
- Clear status messages

Reliability Requirements:
- 99% uptime during peak hours
- Data backup daily
- Error logging and recovery
- Session management

Scalability Requirements:
- Handle increase in users/orders
- Database indexing for performance
- Horizontal scaling capability
```

### 2.3 Entity Identification

#### Core Entities (8 Tables)
```
1. Users/Customers
2. Restaurants
3. MenuItems
4. Orders
5. OrderItems (Line Items)
6. Delivery Agents
7. Payments
8. Reviews
```

#### Relationships
```
Customer (1) ──→ (M) Order
Restaurant (1) ──→ (M) Order
Restaurant (1) ──→ (M) MenuItem
Order (1) ──→ (M) OrderItem
MenuItem (1) ──→ (M) OrderItem
DeliveryAgent (1) ──→ (M) Order
Order (1) ──→ (1) Payment
Customer (1) ──→ (M) Review
Restaurant (1) ──→ (M) Review
```

---

## STEP 3: ER DIAGRAM

### Entities and Their Attributes

```
CUSTOMERS
├── customer_id (PK)
├── email (Unique)
├── password_hash
├── phone
├── first_name
├── last_name
├── profile_image_url
├── address
├── city
├── pincode
├── is_active
├── email_verified
├── created_at
├── updated_at
└── deleted_at (soft delete)

RESTAURANTS
├── restaurant_id (PK)
├── name
├── owner_name
├── email
├── phone
├── address
├── city
├── pincode
├── cuisine_type
├── description
├── avg_rating
├── delivery_fee
├── is_open
├── is_approved
├── created_at
├── updated_at
└── deleted_at

MENUITEMS
├── item_id (PK)
├── restaurant_id (FK)
├── item_name
├── description
├── price
├── category (veg/non-veg/sides)
├── image_url
├── is_veg
├── is_available
├── created_at
└── updated_at

ORDERS
├── order_id (PK)
├── customer_id (FK)
├── restaurant_id (FK)
├── delivery_agent_id (FK)
├── order_time
├── status (pending/confirmed/preparing/ready/picked_up/delivered/cancelled)
├── total_amount
├── delivery_address
├── special_instructions
├── estimated_delivery_time
├── actual_delivery_time
├── created_at
└── updated_at

ORDERITEMS (Bridge Table)
├── order_item_id (PK)
├── order_id (FK)
├── item_id (FK)
├── quantity
├── unit_price (price at time of order)
├── subtotal
└── special_instructions

PAYMENTS
├── payment_id (PK)
├── order_id (FK)
├── customer_id (FK)
├── amount
├── payment_method (card/upi/cash)
├── transaction_id
├── status (pending/success/failed)
├── paid_at
├── created_at
└── updated_at

DELIVERYAGENTS
├── agent_id (PK)
├── name
├── email
├── phone
├── vehicle_type
├── license_number
├── is_available
├── current_location
├── total_deliveries
├── avg_rating
├── created_at
└── updated_at

REVIEWS
├── review_id (PK)
├── customer_id (FK)
├── restaurant_id (FK)
├── order_id (FK)
├── rating (1-5 stars)
├── comment
├── is_approved
├── created_at
└── updated_at
```

### ER Diagram Relationships
```
For draw.io/Lucidchart, use these notations:
- One-to-Many: 1 ──→ M
- One-to-One: 1 ──→ 1
- Many-to-Many: M ──→ N
- Cardinality: (0,1) (1,1) (0,M) (1,M)
```

---

## STEP 4: Convert ER to Tables + Normalization

### 4.1 Database Normalization Strategy

#### Normalization Levels

```
Before Normalization (Unnormalized):
Table: ALL_DATA
├── customer_id, customer_name, order_id, item_name, price, 
├── restaurant_name, agent_name, payment_method
└── Issue: Multiple values in single cell, redundant data, update anomalies

After 1NF (First Normal Form):
- Remove repeating groups
- Each cell has single value
- Tables: Customers, Orders, OrderItems, etc.
- Issue: Partial dependencies remain

After 2NF (Second Normal Form):
- Remove partial dependencies
- Non-key attributes depend on entire composite key
- Separate MenuItem from Order
- Issue: Transitive dependencies remain

After 3NF (Third Normal Form):
- Remove transitive dependencies
- Non-key attributes depend only on primary key
- Separate Address details from Customers
- Final structure: 8 normalized tables
```

### 4.2 Table Descriptions

#### Users Table
```
Purpose: Store customer account information
Key Fields:
- customer_id: Unique identifier (auto-increment INT or UUID)
- email: Email address (UNIQUE, indexed for login)
- password_hash: Encrypted password (bcrypt)
- phone: Contact number (for order updates)
- full_name: Customer name
- address: Delivery address (denormalized for convenience)
- is_active: Soft delete flag

Indexes:
- PRIMARY KEY: customer_id
- UNIQUE: email
- INDEX: phone (for duplicate prevention)
```

#### Restaurants Table
```
Purpose: Store restaurant information
Key Fields:
- restaurant_id: Unique identifier
- owner_name: Restaurant owner
- email: Restaurant contact email
- phone: Restaurant contact phone
- address: Physical location
- cuisine_type: Category (Indian, Chinese, etc.)
- avg_rating: Calculated from reviews
- is_approved: Admin approval status

Indexes:
- PRIMARY KEY: restaurant_id
- INDEX: city (for location-based search)
- INDEX: cuisine_type (for filtering)
- INDEX: avg_rating (for sorting)
```

#### MenuItems Table
```
Purpose: Store food items offered by restaurants
Key Fields:
- item_id: Unique identifier
- restaurant_id: Foreign key to restaurants
- item_name: Name of dish
- price: Current price
- category: Classification (veg/non-veg)
- image_url: Menu item image
- is_available: Availability flag

Normalization Note:
- Separate from Orders to avoid price anomalies
- Store price in OrderItems to preserve historical prices
- Updates to price only affect future orders
```

#### Orders Table
```
Purpose: Store customer orders
Key Fields:
- order_id: Unique identifier
- customer_id: Which customer placed order
- restaurant_id: From which restaurant
- delivery_agent_id: Who delivered
- status: Current order status (state machine)
- total_amount: Final amount with taxes
- order_time: When order was placed
- delivery_address: Where to deliver

Critical Design:
- Status uses ENUM for data consistency
- Tracks timeline: order_time → estimated → actual_delivery_time
- Handles cancellations with cancelled status
```

#### OrderItems Table
```
Purpose: Bridge table between Orders and MenuItems
Key Fields:
- order_item_id: Unique identifier
- order_id: Which order
- item_id: Which menu item
- quantity: How many
- unit_price: Price at time of order (IMPORTANT!)
- subtotal: Calculated during insert

Why unit_price is stored:
- Price in MenuItem can change
- Need to preserve exact price customer paid
- Prevents showing wrong price in order history
```

#### Payments Table
```
Purpose: Store payment transactions
Key Fields:
- payment_id: Unique identifier
- order_id: Which order (FOREIGN KEY, UNIQUE - one payment per order)
- customer_id: Denormalized for reporting
- amount: Payment amount
- payment_method: ENUM (card, upi, cash)
- transaction_id: Gateway reference
- status: pending/success/failed

One-to-One Relationship:
- Each Order has exactly one Payment
- Payment status affects Order status
- Triggers update Order status on payment success
```

#### DeliveryAgents Table
```
Purpose: Store delivery agent information
Key Fields:
- agent_id: Unique identifier
- name: Agent name
- email: Agent email
- phone: Agent contact
- vehicle_type: Type of vehicle (bike, scooter)
- license_number: License for validation
- is_available: Available for delivery
- current_location: Last known location
- avg_rating: Calculated from reviews

Note: Location would be updated via separate API calls
```

#### Reviews Table
```
Purpose: Store customer feedback
Key Fields:
- review_id: Unique identifier
- customer_id: Who reviewed
- restaurant_id: What restaurant
- order_id: Which order (for verification)
- rating: 1-5 stars
- comment: Text review
- is_approved: Moderation flag
- created_at: Review date

Validation:
- Only customers who ordered can review
- One review per order
- Triggers update of avg_rating in Restaurants table
```

### 4.3 Normalization Examples

#### Example 1: Customer with Multiple Addresses
```
UNNORMALIZED:
CustomerID | Name    | Addresses
1          | John    | 123 Main St, 456 Oak Ave, 789 Pine Rd

1NF (Remove repeating groups):
Addresses (Separate table)
address_id | customer_id | address_line | is_primary
1          | 1           | 123 Main St  | Yes
2          | 1           | 456 Oak Ave  | No
3          | 1           | 789 Pine Rd  | No

3NF (Add location details):
Addresses:
address_id | customer_id | address_line | city | pincode
1          | 1           | 123 Main St  | NYC  | 10001
2          | 1           | 456 Oak Ave  | LA   | 90001
```

#### Example 2: Menu Item Price Changes
```
PROBLEM (Without storing unit_price in OrderItems):
Orders table has order_amount calculated from current MenuItem prices
When restaurant changes price, order history shows wrong amount

SOLUTION (3NF):
MenuItems: item_id=1, current_price=100
OrderItems: order_id=1, item_id=1, unit_price=100, quantity=2

If restaurant changes MenuItem price to 150:
- Old order still shows 100 (correct)
- New orders use 150 (correct)
- No anomalies!
```

---

## STEP 5: Database Implementation (DDL/DML/DQL)

### 5.1 Database Structure Setup

#### DDL Commands (Data Definition Language)
```
Purpose: Define database structure
Commands:
- CREATE DATABASE: Create new database
- CREATE TABLE: Define table with columns
- ALTER TABLE: Modify table structure
- DROP TABLE: Delete table

Example Pattern:
CREATE TABLE customers (
  customer_id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Constraints Used:
- PRIMARY KEY: Unique identifier
- FOREIGN KEY: Reference another table
- UNIQUE: No duplicate values
- NOT NULL: Required field
- DEFAULT: Default value
- AUTO_INCREMENT: Auto-generate ID
```

#### DML Commands (Data Manipulation Language)
```
Purpose: Manipulate data in tables
Commands:
- INSERT: Add new records
- UPDATE: Modify existing records
- DELETE: Remove records

Example Pattern:
INSERT INTO customers (email, password_hash, first_name)
VALUES ('user@example.com', 'hashed_password', 'John');

UPDATE customers SET first_name = 'Jane' WHERE customer_id = 1;

DELETE FROM customers WHERE customer_id = 1;
```

#### DQL Commands (Data Query Language)
```
Purpose: Retrieve data from tables
Commands:
- SELECT: Query data
- WHERE: Filter data
- ORDER BY: Sort results
- LIMIT: Limit rows
- GROUP BY: Aggregate data
- HAVING: Filter groups

Example Pattern:
SELECT customer_id, email, first_name
FROM customers
WHERE created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY created_at DESC
LIMIT 10;
```

### 5.2 Table Creation Order

```
1. Create CUSTOMERS table first (no dependencies)
2. Create RESTAURANTS table (no dependencies)
3. Create MENUITEMS (depends on RESTAURANTS)
4. Create DELIVERYAGENTS (no dependencies)
5. Create ORDERS (depends on CUSTOMERS, RESTAURANTS, DELIVERYAGENTS)
6. Create ORDERITEMS (depends on ORDERS, MENUITEMS)
7. Create PAYMENTS (depends on ORDERS, CUSTOMERS)
8. Create REVIEWS (depends on CUSTOMERS, RESTAURANTS, ORDERS)

This order ensures:
- Foreign key references exist before being used
- No orphaned records
- Clean data relationships
```

---

## STEP 6: SELECT Queries, JOIN Queries, Aggregate Functions

### 6.1 Basic SELECT Queries

```
Purpose: Retrieve data from single table

Query 1: Get all customers
SELECT customer_id, email, first_name, phone FROM customers WHERE is_active = 1;

Query 2: Get available restaurants in a city
SELECT restaurant_id, name, cuisine_type, avg_rating
FROM restaurants
WHERE city = 'Vijayawada' AND is_open = 1 AND is_approved = 1;

Query 3: Get menu items for a restaurant, sorted by category
SELECT item_id, item_name, price, category
FROM menuitems
WHERE restaurant_id = 1 AND is_available = 1
ORDER BY category, price;

Query 4: Get orders placed in last 30 days
SELECT order_id, customer_id, total_amount, status, order_time
FROM orders
WHERE order_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY order_time DESC;

Query 5: Find pending orders
SELECT order_id, restaurant_id, customer_id, total_amount
FROM orders
WHERE status = 'pending' AND order_time >= DATE_SUB(NOW(), INTERVAL 2 HOUR)
ORDER BY order_time ASC;
```

### 6.2 JOIN Queries

```
Purpose: Combine data from multiple tables

Query 1: Get order details with customer and restaurant names
SELECT 
  o.order_id,
  c.email AS customer_email,
  r.name AS restaurant_name,
  o.total_amount,
  o.status,
  o.order_time
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN restaurants r ON o.restaurant_id = r.restaurant_id
WHERE o.order_id = 100;

Query 2: Get complete order with all items and prices
SELECT 
  o.order_id,
  m.item_name,
  oi.quantity,
  oi.unit_price,
  oi.subtotal,
  r.name AS restaurant_name
FROM orders o
INNER JOIN orderitems oi ON o.order_id = oi.order_id
INNER JOIN menuitems m ON oi.item_id = m.item_id
INNER JOIN restaurants r ON o.restaurant_id = r.restaurant_id
WHERE o.order_id = 100
ORDER BY oi.order_item_id;

Query 3: Get customer order history with restaurant details
SELECT 
  o.order_id,
  r.name AS restaurant_name,
  o.total_amount,
  o.status,
  o.order_time,
  c.email
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN restaurants r ON o.restaurant_id = r.restaurant_id
WHERE c.customer_id = 5
ORDER BY o.order_time DESC;

Query 4: Get delivered orders with payment details
SELECT 
  o.order_id,
  c.email,
  r.name,
  o.total_amount,
  p.payment_method,
  p.status AS payment_status
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN restaurants r ON o.restaurant_id = r.restaurant_id
LEFT JOIN payments p ON o.order_id = p.order_id
WHERE o.status = 'delivered' AND DATE(o.updated_at) = CURDATE();

Query 5: Get reviews with customer and restaurant info
SELECT 
  rv.review_id,
  rv.rating,
  rv.comment,
  c.first_name AS customer_name,
  r.name AS restaurant_name,
  rv.created_at
FROM reviews rv
INNER JOIN customers c ON rv.customer_id = c.customer_id
INNER JOIN restaurants r ON rv.restaurant_id = r.restaurant_id
WHERE r.restaurant_id = 1 AND rv.is_approved = 1
ORDER BY rv.created_at DESC;
```

### 6.3 Aggregate Functions & GROUP BY

```
Purpose: Summarize and analyze data

Query 1: Total revenue per restaurant
SELECT 
  r.restaurant_id,
  r.name,
  COUNT(o.order_id) AS total_orders,
  SUM(o.total_amount) AS total_revenue,
  AVG(o.total_amount) AS avg_order_value
FROM restaurants r
LEFT JOIN orders o ON r.restaurant_id = o.restaurant_id AND o.status = 'delivered'
GROUP BY r.restaurant_id, r.name
ORDER BY total_revenue DESC;

Query 2: Average rating per restaurant
SELECT 
  r.restaurant_id,
  r.name,
  COUNT(rv.review_id) AS total_reviews,
  AVG(rv.rating) AS avg_rating,
  MIN(rv.rating) AS min_rating,
  MAX(rv.rating) AS max_rating
FROM restaurants r
LEFT JOIN reviews rv ON r.restaurant_id = rv.restaurant_id AND rv.is_approved = 1
GROUP BY r.restaurant_id, r.name
ORDER BY avg_rating DESC;

Query 3: Top 10 most ordered items
SELECT 
  m.item_id,
  m.item_name,
  r.name AS restaurant_name,
  COUNT(oi.order_item_id) AS times_ordered,
  SUM(oi.subtotal) AS total_revenue
FROM menuitems m
INNER JOIN restaurants r ON m.restaurant_id = r.restaurant_id
LEFT JOIN orderitems oi ON m.item_id = oi.item_id
GROUP BY m.item_id, m.item_name, r.name
ORDER BY times_ordered DESC
LIMIT 10;

Query 4: Delivery agents with most deliveries
SELECT 
  da.agent_id,
  da.name,
  COUNT(o.order_id) AS total_deliveries,
  AVG(da.avg_rating) AS agent_rating,
  SUM(o.total_amount) AS value_delivered
FROM deliveryagents da
LEFT JOIN orders o ON da.agent_id = o.delivery_agent_id AND o.status = 'delivered'
GROUP BY da.agent_id, da.name
ORDER BY total_deliveries DESC
LIMIT 10;

Query 5: Orders by status with counts
SELECT 
  status,
  COUNT(*) AS order_count,
  AVG(total_amount) AS avg_amount,
  MAX(total_amount) AS max_amount,
  MIN(total_amount) AS min_amount
FROM orders
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY status
ORDER BY order_count DESC;

Query 6: Revenue by date (daily sales)
SELECT 
  DATE(order_time) AS order_date,
  COUNT(*) AS orders_count,
  SUM(total_amount) AS daily_revenue,
  AVG(total_amount) AS avg_order_value,
  COUNT(DISTINCT customer_id) AS unique_customers
FROM orders
WHERE status = 'delivered'
GROUP BY DATE(order_time)
ORDER BY order_date DESC;

Query 7: Customer spending analysis
SELECT 
  c.customer_id,
  c.email,
  COUNT(o.order_id) AS total_orders,
  SUM(o.total_amount) AS total_spent,
  AVG(o.total_amount) AS avg_spent,
  MAX(o.order_time) AS last_order_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.status = 'delivered'
GROUP BY c.customer_id, c.email
HAVING total_orders > 0
ORDER BY total_spent DESC
LIMIT 20;
```

---

## STEP 7: Views & Triggers

### 7.1 Database Views

```
Purpose: Create virtual tables for commonly used queries
Benefits: Simplify complex queries, improve security, improve maintainability

View 1: Order Summary View
Name: vw_order_summary
Columns: order_id, customer_email, restaurant_name, total_amount, status, order_time, agent_name
Use: Dashboard, admin panel, reports
Why: Combines multiple tables into single query

View 2: Restaurant Performance View
Name: vw_restaurant_performance
Columns: restaurant_id, name, total_orders, total_revenue, avg_rating, rating_count
Use: Restaurant admin, analytics
Why: Calculate metrics without complex joins every time

View 3: Active Delivery Orders View
Name: vw_active_deliveries
Columns: order_id, customer_email, restaurant_name, delivery_address, agent_name, order_time
Use: Delivery management, tracking
Why: Filter only in-progress orders, simplifies queries

View 4: Popular Items View
Name: vw_popular_items
Columns: item_id, item_name, restaurant_name, times_ordered, total_revenue, rating
Use: Recommendations, promotions
Why: Identify trending items for marketing

View 5: Customer Analytics View
Name: vw_customer_analytics
Columns: customer_id, email, total_orders, total_spent, avg_spent, last_order, preferred_restaurant
Use: CRM, personalization
Why: Customer behavior analysis for marketing
```

### 7.2 Database Triggers

```
Purpose: Automatically execute code when events occur
Types: BEFORE/AFTER INSERT/UPDATE/DELETE

Trigger 1: Update Restaurant Average Rating
Event: When new review is inserted
Action: Recalculate avg_rating in restaurants table
Purpose: Keep denormalized data consistent
Benefit: Faster queries (no aggregation needed every time)

Trigger 2: Update Order Total Amount
Event: When order_item is inserted
Action: Recalculate total_amount in orders table
Purpose: Automatic calculation, no code logic needed
Benefit: Prevents manual calculation errors

Trigger 3: Update Order Status on Payment Success
Event: When payment.status changes to 'success'
Action: Update orders.status to 'confirmed'
Purpose: Automatic workflow progression
Benefit: Business logic in database, atomic operations

Trigger 4: Create Payment Record After Order
Event: When order is inserted
Action: Create corresponding payment record with pending status
Purpose: Ensure every order has payment
Benefit: Data integrity, no orphaned orders

Trigger 5: Log Order Changes (Audit Trail)
Event: When orders table is updated
Action: Insert record into orders_audit_log table
Purpose: Track order modifications
Benefit: Compliance, troubleshooting

Trigger 6: Prevent Item Deletion if Ordered
Event: When trying to delete from menuitems
Action: Check if item exists in orderitems
Behavior: Deny deletion, raise error
Purpose: Data integrity
Benefit: Prevents referential integrity issues

Note: Triggers are powerful but complex
- In production, consider application-level logic
- Makes debugging harder
- Database-specific syntax
- Use only for critical operations
```

### 7.3 When to Use Views & Triggers

```
USE VIEWS FOR:
✅ Frequently used complex joins
✅ Hiding implementation details
✅ Simplifying application code
✅ Improving query performance (indexed views)
✅ Security (expose only needed columns)

USE TRIGGERS FOR:
✅ Maintaining denormalized data (avg ratings)
✅ Automatic status updates
✅ Audit logging
✅ Complex validation rules
✅ Cross-table consistency

AVOID TRIGGERS FOR:
❌ Simple updates (do in application)
❌ Performance-critical operations
❌ Complex business logic
❌ Operations that need logging/tracking
❌ Situations where you need better error handling
```

---

## STEP 8: Backend Integration (Node.js + Express)

### 8.1 Backend Architecture

```
Backend Folder Structure:
backend/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── authController.js
│   │   ├── customerController.js
│   │   ├── restaurantController.js
│   │   ├── orderController.js
│   │   └── reviewController.js
│   ├── services/            # Business logic
│   │   ├── authService.js
│   │   ├── orderService.js
│   │   └── paymentService.js
│   ├── models/              # Database models
│   │   ├── Customer.js
│   │   ├── Restaurant.js
│   │   ├── Order.js
│   │   └── MenuItem.js
│   ├── routes/              # API endpoints
│   │   ├── authRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── restaurantRoutes.js
│   │   ├── orderRoutes.js
│   │   └── index.js
│   ├── middleware/          # Express middleware
│   │   ├── authMiddleware.js    # JWT verification
│   │   ├── validationMiddleware.js
│   │   ├── errorHandler.js
│   │   └── logger.js
│   ├── utils/               # Helper functions
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── helpers.js
│   ├── config/              # Configuration
│   │   ├── database.js
│   │   ├── constants.js
│   │   └── environment.js
│   ├── database/            # DB connection
│   │   └── connection.js
│   ├── app.js               # Express app setup
│   └── server.js            # Entry point
├── tests/                   # Test files
├── logs/                    # Application logs
├── .env.example
└── package.json
```

### 8.2 Backend Modules & Responsibilities

```
Authentication Module:
├── Controllers: authController (register, login, logout, refresh)
├── Services: authService (password hashing, JWT generation, email verification)
├── Routes: POST /auth/register, POST /auth/login, POST /auth/logout
├── Middleware: JWT verification for protected routes
└── Database: Customers table (email, password_hash)

Customer Module:
├── Controllers: customerController (getProfile, updateProfile, getAddresses)
├── Services: customerService (profile management)
├── Routes: GET /customers/me, PUT /customers/:id, GET /customers/:id/orders
├── Database: Customers, Orders, Reviews tables
└── Features: Profile management, order history, reviews

Restaurant Module:
├── Controllers: restaurantController (getRestaurants, getMenu, getDetails)
├── Services: restaurantService (search, filter, get details)
├── Routes: GET /restaurants, GET /restaurants/:id, GET /restaurants/:id/menu
├── Database: Restaurants, MenuItems tables
└── Features: Browse restaurants, view menus, search, filter

Order Module:
├── Controllers: orderController (createOrder, getOrders, updateStatus, getDetails)
├── Services: orderService (validate order, calculate total, manage status)
├── Routes: POST /orders, GET /orders, GET /orders/:id, PUT /orders/:id
├── Database: Orders, OrderItems, MenuItems, Restaurants tables
└── Features: Order creation, tracking, status updates

Payment Module:
├── Controllers: paymentController (processPayment, getStatus)
├── Services: paymentService (payment gateway integration, refund logic)
├── Routes: POST /payments, GET /payments/:id
├── Database: Payments table
└── Features: Payment processing, status tracking, refunds

Review Module:
├── Controllers: reviewController (createReview, getReviews, updateAvgRating)
├── Services: reviewService (validation, moderation, rating calculation)
├── Routes: POST /reviews, GET /restaurants/:id/reviews
├── Database: Reviews, Restaurants tables
└── Features: Create reviews, moderate, update ratings
```

### 8.3 API Endpoints Overview

```
Authentication Endpoints:
POST /api/auth/register       → Customer registration
POST /api/auth/login          → Customer login
POST /api/auth/logout         → Customer logout
POST /api/auth/refresh        → Refresh JWT token
POST /api/auth/forgot-password → Request password reset
POST /api/auth/reset-password  → Reset password

Customer Endpoints:
GET /api/customers/me         → Get current profile
GET /api/customers/:id        → Get customer details
PUT /api/customers/:id        → Update profile
GET /api/customers/:id/orders → Get customer's orders
GET /api/customers/:id/addresses → Get saved addresses
POST /api/customers/:id/addresses → Add new address

Restaurant Endpoints:
GET /api/restaurants          → List all restaurants
GET /api/restaurants/:id      → Get restaurant details
GET /api/restaurants/:id/menu → Get menu items
GET /api/restaurants/:id/reviews → Get restaurant reviews

MenuItem Endpoints:
GET /api/menuitems/:id        → Get item details
GET /api/restaurants/:id/menu → Get all items for restaurant

Order Endpoints:
POST /api/orders              → Create new order
GET /api/orders               → Get user's orders
GET /api/orders/:id           → Get order details
PUT /api/orders/:id/status    → Update order status
PUT /api/orders/:id/cancel    → Cancel order

Payment Endpoints:
POST /api/payments            → Process payment
GET /api/payments/:id         → Get payment status
POST /api/payments/:id/refund → Request refund

Review Endpoints:
POST /api/reviews             → Create review
GET /api/reviews/:id          → Get review details
GET /api/restaurants/:id/reviews → Get restaurant reviews
```

### 8.4 Database Connection Strategy

```
Connection Management:
- Single connection pool (reused connections)
- Connection pooling: 5-10 connections
- Connection timeout: 10 seconds
- Idle timeout: 30 minutes

Error Handling:
- Retry failed connections
- Log connection errors
- Graceful degradation
- Health check endpoints

Query Execution:
- Use parameterized queries (prevent SQL injection)
- Connection from pool → Execute query → Return connection to pool
- Never use string concatenation for SQL
- Always use prepared statements / ORM methods
```

---

## STEP 9: Frontend (HTML/CSS/JavaScript/React)

### 9.1 Frontend Architecture

```
Frontend Folder Structure:
frontend/
├── public/
│   ├── index.html             # Main HTML file
│   ├── favicon.ico
│   └── images/
├── src/
│   ├── components/            # Reusable components
│   │   ├── Header.jsx
│   │   ├── Navigation.jsx
│   │   ├── Footer.jsx
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   ├── RestaurantCard.jsx
│   │   ├── MenuItem.jsx
│   │   ├── Cart.jsx
│   │   ├── OrderForm.jsx
│   │   └── ReviewForm.jsx
│   ├── pages/                 # Page components
│   │   ├── HomePage.jsx
│   │   ├── AuthPage.jsx
│   │   ├── RestaurantListPage.jsx
│   │   ├── RestaurantDetailPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── OrderTrackingPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── NotFoundPage.jsx
│   ├── services/              # API calls
│   │   ├── api.js            # Base API config
│   │   ├── authService.js
│   │   ├── restaurantService.js
│   │   ├── orderService.js
│   │   ├── paymentService.js
│   │   └── reviewService.js
│   ├── context/               # State management
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── AppContext.jsx
│   ├── hooks/                 # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useFetch.js
│   │   └── useForm.js
│   ├── utils/                 # Helper functions
│   │   ├── formatters.js      # Format currency, date
│   │   ├── validators.js      # Email, password validation
│   │   └── helpers.js
│   ├── styles/                # CSS files
│   │   ├── global.css
│   │   ├── components.css
│   │   ├── pages.css
│   │   └── responsive.css
│   ├── config/                # Configuration
│   │   └── constants.js
│   ├── App.jsx                # Root component
│   └── index.jsx              # Entry point
├── .env.example
├── package.json
└── vite.config.js (or webpack.config.js)
```

### 9.2 Key Frontend Pages

```
1. Home Page
├── Display featured restaurants
├── Search bar
├── Filters (cuisine, rating, delivery time)
├── Navigation menu
└── Footer

2. Restaurant List Page
├── Grid of restaurant cards
├── Each card shows: name, cuisine, rating, delivery fee
├── Click to view restaurant details
├── Sidebar filters
└── Search results

3. Restaurant Detail Page
├── Restaurant name, address, phone
├── Menu items grid
├── Item cards with: name, price, category, availability
├── Add to cart button
└── Customer reviews section

4. Cart Page
├── List items in cart
├── Quantity adjustment
├── Item price × quantity = subtotal
├── Total calculation
├── Promo code input
├── Checkout button
└── Continue shopping button

5. Checkout Page
├── Order summary
├── Delivery address selection/input
├── Special instructions textarea
├── Payment method selection
├── Apply coupon
├── Final price breakdown
└── Place order button

6. Order Tracking Page
├── Current order status
├── Estimated delivery time
├── Delivery agent details (when assigned)
├── Order items list
├── Contact restaurant/agent buttons
└── Cancel order option

7. Profile Page
├── Customer information
├── Saved addresses
├── Order history
├── Reviews/ratings written
├── Settings
└── Logout button

8. Login/Register Page
├── Toggle between login and register
├── Email/password fields
├── Remember me checkbox
├── Password reset link
├── Social login (optional)
└── Validation messages

9. Order History Page
├── List of past orders
├── Filter by date, status
├── Click to view order details
├── Reorder button
├── Leave review button
└── Download receipt option
```

### 9.3 Frontend Components Breakdown

```
UI Components (Reusable):
- Header: Logo, search, profile menu
- Navigation: Sidebar or top nav
- Footer: Links, copyright
- Modal: Confirmation dialogs
- Toast: Success/error messages
- Loading: Spinners, skeletons
- Pagination: Navigation between pages
- Button: Standard styled buttons
- Input: Form inputs with validation
- Card: Container for content

Feature Components:
- LoginForm: Email, password inputs, submit
- RestaurantCard: Image, name, rating, cuisine
- MenuItem: Item details, price, add to cart
- CartItem: Item in cart, qty controls, remove
- OrderForm: Address, instructions, payment
- ReviewForm: Rating stars, comment input
- OrderStatus: Status badge, timeline

Page Components:
- HomePage: Featured + search + filter
- AuthPage: Login/register forms
- RestaurantList: Grid of restaurants
- CartPage: Items + total + checkout
- CheckoutPage: Confirm + pay
- Profile: User info + orders + settings
```

### 9.4 State Management Strategy

```
Using Context API (Built-in React):

AuthContext:
- Current user (logged in or null)
- JWT token
- User role (customer/restaurant/admin)
- Login/logout functions

CartContext:
- Items in cart (array)
- Add item to cart
- Remove item from cart
- Update quantity
- Clear cart
- Total calculation

AppContext:
- Current page/route
- Loading state
- Error messages
- Success messages
- Theme (light/dark mode)

Why Context API:
✅ No external library needed
✅ Built-in to React
✅ Sufficient for medium apps
✅ Easy to understand

When to upgrade to Redux/Zustand:
❌ Multiple levels of nested contexts
❌ Complex state logic
❌ Performance issues
❌ Need for time-travel debugging
```

### 9.5 API Integration Pattern

```
Frontend Flow:
1. User action (click button, submit form)
2. Component calls service function
3. Service makes HTTP request to backend
4. Backend processes, queries database
5. Backend returns JSON response
6. Frontend updates state/UI
7. User sees result

Example: Create Order Flow
User clicks "Place Order"
  ↓
OrderForm component calls orderService.createOrder(orderData)
  ↓
API service makes POST /api/orders request with order data
  ↓
Backend controller receives request
  ↓
Backend service validates order, calculates total
  ↓
Backend queries database, inserts order
  ↓
Backend returns order with ID and status
  ↓
Frontend receives response
  ↓
Frontend updates CartContext (clear cart)
  ↓
Frontend redirects to order tracking page
  ↓
User sees order ID and tracking info
```

---

## STEP 10: Testing Strategy

### 10.1 What to Test

```
Backend Testing:

1. Authentication Tests
├─ Register with valid data → User created
├─ Register with duplicate email → Error 409
├─ Register with invalid email → Error 400
├─ Login with correct credentials → Token received
├─ Login with wrong password → Error 401
├─ Login with non-existent email → Error 404
└─ Access protected route without token → Error 401

2. Restaurant Management Tests
├─ Get all restaurants → Returns list
├─ Filter restaurants by city → Returns filtered list
├─ Get restaurant by ID → Returns details
├─ Get restaurant menu → Returns items
└─ Search restaurants by name → Returns matches

3. Order Management Tests
├─ Create order with valid data → Order created
├─ Create order with empty cart → Error
├─ Get customer orders → Returns list
├─ Get order details → Returns items and pricing
├─ Update order status → Status changes
└─ Cancel order → Order marked cancelled

4. Payment Tests
├─ Process payment with valid card → Payment succeeds
├─ Process payment with invalid card → Payment fails
├─ Get payment status → Returns status
└─ Refund payment → Refund succeeds

5. Review Tests
├─ Create review for delivered order → Review created
├─ Create review for non-ordered item → Error
├─ Get restaurant reviews → Returns list
└─ Update restaurant avg_rating → Trigger fires

Frontend Testing:

1. Component Tests
├─ LoginForm renders correctly
├─ LoginForm validates email format
├─ Submit button is disabled during loading
├─ Error message displays on login failure
└─ Token stored in localStorage on success

2. Page Tests
├─ HomePage loads restaurants
├─ RestaurantDetail loads menu
├─ CartPage shows total correctly
├─ CheckoutPage requires address
└─ ProfilePage shows user orders

3. Integration Tests
├─ User registration → login → browse restaurants → order
├─ Restaurant admin → update menu → view orders
└─ Customer → order → pay → track → review

4. UI Tests
├─ Responsive on mobile (320px)
├─ Responsive on tablet (768px)
├─ Responsive on desktop (1024px)
├─ Dark mode toggle works
└─ Navigation links work
```

### 10.2 Testing Tools

```
Backend Testing:
- Jest: Unit testing framework
- Supertest: HTTP assertion library
- SQLite (in-memory): Test database

Frontend Testing:
- Jest: Unit/component testing
- React Testing Library: Component testing
- Cypress: E2E testing (optional)

Running Tests Locally:
Backend:
  npm test                  # Run all tests
  npm test -- --coverage   # With coverage report
  npm test -- --watch      # Watch mode

Frontend:
  npm test                  # Run all tests
  npm test -- --coverage   # With coverage report
  npm test -- --watch      # Watch mode
```

### 10.3 Testing Checklist

```
Before Committing Code:
☐ All unit tests pass
☐ No console errors/warnings
☐ Code coverage > 70%
☐ No hardcoded values (use config)
☐ Error handling tested
☐ Input validation tested
☐ Edge cases tested

Before Pushing to Repository:
☐ Backend server starts without errors
☐ Frontend builds without warnings
☐ All API endpoints tested with Postman
☐ Database migrations run successfully
☐ Sample data loads correctly
☐ No console errors in browser

Before Deployment:
☐ Complete user journey tested
☐ Login → Browse → Order → Pay → Track works
☐ All CRUD operations work
☐ Error messages display correctly
☐ Data persists correctly
☐ Performance acceptable (< 2 sec page load)
```

---

## STEP 11: Sample Screenshots & Output

### Screenshots to Capture

```
1. Authentication Screens
├─ Login form (before/after validation)
├─ Register form (with success message)
├─ Password reset email
└─ Email verification confirmation

2. Restaurant Discovery
├─ Home page with featured restaurants
├─ Restaurant list with filters
├─ Restaurant detail page
└─ Search results

3. Menu & Ordering
├─ Menu items grid
├─ Item detail popup
├─ Cart with items
├─ Order confirmation

4. Checkout & Payment
├─ Address selection/input
├─ Payment method selection
├─ Order summary
└─ Order placed confirmation

5. Order Tracking
├─ Order status timeline
├─ Current status badge
├─ Delivery agent details
└─ Estimated delivery time

6. Customer Features
├─ Profile page
├─ Order history
├─ Leave review form
└─ Review submitted

7. Admin/Restaurant Features
├─ Restaurant dashboard
├─ Menu management
├─ Incoming orders
└─ Revenue statistics

8. Error States
├─ Invalid login error
├─ Network error message
├─ Empty cart warning
└─ Out of stock item

How to Capture:
- Use Chrome DevTools (F12)
- Screenshot individual features
- Include before/after states
- Show success and error cases
- Document each with caption
```

---

## Report Structure Checklist

```
✅ Title Page
   - Project name: Food Delivery Website
   - Group members (5 names + roll numbers)
   - College name, date
   - Subject: Database Management System

✅ Abstract (100-150 words)
   - What: Food delivery web application
   - Why: Simplify order process
   - How: Web platform with database backend
   - Tech: Node.js, React, MySQL
   - Features: 3-4 key features

✅ Introduction
   - Current food delivery problems
   - Digital transformation need
   - Project scope
   - Benefits

✅ Aim & Objectives
   Aim: Build integrated food delivery web platform
   Objectives:
   - Enable customer registration and authentication
   - Allow restaurant browsing and ordering
   - Process online payments securely
   - Provide real-time order tracking
   - Maintain customer reviews and ratings

✅ Requirement Analysis
   - Functional requirements (list)
   - Non-functional requirements
   - User types (customer, restaurant, admin)
   - Entity-relationship model
   - Constraints and assumptions

✅ ER Diagram
   - Screenshot from draw.io/Lucidchart
   - All 8 entities shown
   - All relationships with cardinality
   - Primary/foreign keys marked

✅ Database Schema
   - CREATE TABLE statements for all 8 tables
   - Description of each table's purpose
   - Column definitions with data types
   - Constraints (PK, FK, UNIQUE, NOT NULL)

✅ Normalization
   - Explain 1NF, 2NF, 3NF
   - Show examples of before/after
   - Justify design decisions
   - Describe how each table is normalized

✅ SQL Queries
   - 5-10 SELECT queries with explanations
   - 5-10 JOIN queries with results
   - 3-5 aggregate queries with GROUP BY
   - 2 View definitions
   - 2 Trigger definitions

✅ Implementation
   Backend:
   - Architecture diagram
   - Module descriptions
   - Key API endpoints list
   - Code snippets (controllers, services)
   
   Frontend:
   - Page structure
   - Component hierarchy
   - State management approach
   - API integration pattern

✅ Screenshots
   - 10+ application screenshots
   - Cover all major features
   - Include success and error cases
   - Each with brief caption

✅ Conclusion
   - What was achieved
   - Challenges faced
   - Learning outcomes
   - Project success criteria

✅ Future Work
   - Real-time features (WebSockets)
   - Mobile app (React Native)
   - AI recommendations
   - Analytics dashboard
   - Payment gateway integration
   - SMS notifications
   - Push notifications
   - Loyalty program
```

---

## Summary: Alignment with Teacher Requirements

### ✅ All 11 Steps Covered
- [x] Step 1: Problem definition (food delivery inefficiency)
- [x] Step 2: Requirement analysis (8 entities, 9 relationships, functional requirements)
- [x] Step 3: ER diagram (ready for draw.io/Lucidchart)
- [x] Step 4: Table design with normalization (1NF, 2NF, 3NF)
- [x] Step 5: DDL/DML/DQL implementation details
- [x] Step 6: SELECT, JOIN, aggregate queries
- [x] Step 7: Views and triggers
- [x] Step 8: Backend integration (Node.js + Express)
- [x] Step 9: Frontend (React pages and components)
- [x] Step 10: Testing strategy
- [x] Step 11: Screenshots documentation

### ✅ Report Format Covered
All 13 sections required by teacher included

### ✅ Technology Stack
- Frontend: React (modern, component-based)
- Backend: Node.js + Express
- Database:MySQL
- Local Development: No Docker, No Cloud

### ✅ Key Features Implemented
1. User authentication and authorization
2. Restaurant discovery and browsing
3. Menu management and ordering
4. Secure payment processing
5. Order tracking and status updates
6. Customer reviews and ratings
7. Admin dashboard for analytics

---

## Next Steps for Development

### Phase 1: Setup (Week 1)
- [ ] Create project folder structure
- [ ] Initialize Git repository
- [ ] Set up backend with Express
- [ ] Set up frontend with React
- [ ] Configure database
- [ ] Create .env files

### Phase 2: Database (Week 2)
- [ ] Create all 8 tables
- [ ] Create indexes
- [ ] Add constraints and relationships
- [ ] Create views
- [ ] Create triggers
- [ ] Seed sample data

### Phase 3: Backend (Week 3-4)
- [ ] Authentication module
- [ ] Customer management
- [ ] Restaurant management
- [ ] Order management
- [ ] Payment processing
- [ ] Review system

### Phase 4: Frontend (Week 5-6)
- [ ] Home page with search/filter
- [ ] Restaurant listing and details
- [ ] Cart and checkout
- [ ] Order tracking
- [ ] User profile
- [ ] Review submission

### Phase 5: Integration & Testing (Week 7)
- [ ] Connect frontend to backend APIs
- [ ] Test all CRUD operations
- [ ] Test user workflows
- [ ] Fix bugs
- [ ] Performance optimization

### Phase 6: Report & Presentation (Week 8)
- [ ] Write report
- [ ] Capture screenshots
- [ ] Create ER diagram
- [ ] Prepare presentation
- [ ] Final testing

---

## Key Takeaways

1. **Database Design is Critical**: Proper normalization prevents data anomalies
2. **Architecture Matters**: Clear separation enables team collaboration
3. **Testing Throughout**: Catch bugs early, not at the end
4. **Documentation**: Make code understandable to future developers
5. **Security First**: Validate inputs, hash passwords, use JWT
6. **User Experience**: Responsive design, clear feedback, intuitive flow

This analysis provides everything needed to build a production-quality food delivery web application following your teacher's requirements.

---

## ADMIN SYSTEM IMPLEMENTATION UPDATE

### Overview
The FoodDash project now includes a complete admin panel with full platform control. This extends the existing customer food delivery system without rebuilding the project.

### Admin Login Details

```
Admin UI:
http://localhost:5173/admin/login

Create a private local admin from backend environment variables:
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_private_admin_password
ADMIN_NAME=FoodDash Admin
```

### Admin Functional Requirements Added

```
1. Admin Authentication
   - Separate admin login page
   - Separate admin token
   - Admin-only protected routes

2. User Management
   - View all customers
   - Search users by name, email, or phone
   - Filter active/blocked users
   - Block or unblock users
   - Soft-delete users
   - View user order activity through admin API

3. Restaurant Management
   - Add new restaurants
   - Edit restaurant information
   - Approve or reject restaurant listings
   - Delete restaurant listings using soft delete

4. Order Management
   - View all orders
   - Search by order ID, customer, or restaurant
   - Filter by order status
   - Update status: pending, confirmed, preparing, ready, picked_up, delivered, cancelled
   - Cancel orders

5. Dashboard and Analytics
   - Total users
   - Total restaurants
   - Total orders
   - Total revenue
   - Recent orders
   - Daily order and revenue analytics
```

### Admin Database Addition

New migration:

```
database/migrations/002_create_admin_system.sql
```

New table:

```
admins
├── admin_id (PK)
├── email (Unique)
├── password_hash
├── full_name
├── role
├── is_active
├── created_at
└── updated_at
```

Run command:

```
cd backend
npm run db:admin
npm run db:create-admin
```

### Backend Files Added

```
backend/src/controllers/adminController.js
backend/src/services/adminService.js
backend/src/routes/adminRoutes.js
backend/src/middleware/authorize.js
backend/src/validators/adminValidators.js
```

### Backend Admin Routes

```
POST   /api/admin/auth/login
GET    /api/admin/me
GET    /api/admin/dashboard
GET    /api/admin/analytics

GET    /api/admin/users
GET    /api/admin/users/:id
PATCH  /api/admin/users/:id/status
DELETE /api/admin/users/:id

GET    /api/admin/restaurants
POST   /api/admin/restaurants
GET    /api/admin/restaurants/:id
PUT    /api/admin/restaurants/:id
PATCH  /api/admin/restaurants/:id/approval
DELETE /api/admin/restaurants/:id

GET    /api/admin/orders
GET    /api/admin/orders/:id
PATCH  /api/admin/orders/:id/status
```

### Frontend Files Added

```
frontend/src/components/AdminLayout.jsx
frontend/src/context/AdminAuthContext.jsx
frontend/src/services/adminService.js
frontend/src/pages/admin/AdminLoginPage.jsx
frontend/src/pages/admin/AdminDashboardPage.jsx
frontend/src/pages/admin/AdminUsersPage.jsx
frontend/src/pages/admin/AdminRestaurantsPage.jsx
frontend/src/pages/admin/AdminOrdersPage.jsx
```

### Frontend Admin Routes

```
/admin/login
/admin
/admin/users
/admin/restaurants
/admin/orders
```

### Security Design

```
Customer JWT:
- role: customer
- Cannot access admin APIs

Admin JWT:
- role: admin
- Required for all admin routes except login

Middleware:
1. authenticate verifies JWT token
2. authorize('admin') checks admin role
3. Validation middleware checks request body
```

### Updated Project Feature List

```
1. Customer authentication and authorization
2. Restaurant discovery and menu browsing
3. Cart, checkout, and order placement
4. Payment record management
5. Order tracking
6. Customer reviews and ratings
7. Admin dashboard
8. Full user management
9. Full restaurant management
10. Full order management
11. Analytics for revenue and daily orders
```

### Testing Checklist for Admin System

```
Backend:
- Admin login returns token
- Admin dashboard works with admin token
- Admin route fails without token
- Admin route fails with customer token
- User block/unblock works
- Restaurant approve/reject works
- Order status update works

Frontend:
- /admin/login opens correctly
- Correct admin credentials redirect to /admin
- Sidebar navigation works
- Users table loads
- Restaurants table loads
- Orders table loads
- Logout clears admin token
```

### Local Run Steps

```
Backend:
cd backend
npm install
copy .env.example .env
npm run db:migrate
npm run db:seed
npm run db:admin
npm run db:create-admin
npm run dev

Frontend:
cd frontend
npm install
copy .env.example .env
npm run dev
```

