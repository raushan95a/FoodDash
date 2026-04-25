CREATE DATABASE IF NOT EXISTS fooddash;
USE fooddash;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS orderitems;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS menuitems;
DROP TABLE IF EXISTS customer_addresses;
DROP TABLE IF EXISTS deliveryagents;
DROP TABLE IF EXISTS restaurants;
DROP TABLE IF EXISTS customers;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE customers (
  customer_id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50),
  profile_image_url TEXT,
  address VARCHAR(255),
  city VARCHAR(80),
  pincode VARCHAR(12),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  INDEX idx_customers_phone (phone),
  INDEX idx_customers_city (city)
);

CREATE TABLE restaurants (
  restaurant_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  owner_name VARCHAR(120) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(80) NOT NULL,
  pincode VARCHAR(12) NOT NULL,
  cuisine_type VARCHAR(80) NOT NULL,
  description TEXT,
  avg_rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  is_open BOOLEAN NOT NULL DEFAULT TRUE,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  INDEX idx_restaurants_city (city),
  INDEX idx_restaurants_cuisine (cuisine_type),
  INDEX idx_restaurants_rating (avg_rating)
);

CREATE TABLE deliveryagents (
  agent_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  vehicle_type ENUM('bike', 'scooter', 'cycle', 'car') NOT NULL DEFAULT 'bike',
  license_number VARCHAR(60) NOT NULL UNIQUE,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  current_location VARCHAR(255),
  total_deliveries INT NOT NULL DEFAULT 0,
  avg_rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE customer_addresses (
  address_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  label VARCHAR(60) NOT NULL DEFAULT 'Home',
  address VARCHAR(255) NOT NULL,
  city VARCHAR(80),
  pincode VARCHAR(12),
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_customer_addresses_customer
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    ON DELETE CASCADE,
  INDEX idx_customer_addresses_customer (customer_id)
);

CREATE TABLE menuitems (
  item_id INT PRIMARY KEY AUTO_INCREMENT,
  restaurant_id INT NOT NULL,
  item_name VARCHAR(120) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category ENUM('veg', 'non-veg', 'sides', 'dessert', 'beverage') NOT NULL,
  image_url TEXT,
  is_veg BOOLEAN NOT NULL DEFAULT TRUE,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_menuitems_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id)
    ON DELETE CASCADE,
  INDEX idx_menuitems_restaurant (restaurant_id),
  INDEX idx_menuitems_category (category)
);

CREATE TABLE orders (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  restaurant_id INT NOT NULL,
  delivery_agent_id INT NULL,
  order_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_address VARCHAR(255) NOT NULL,
  special_instructions TEXT,
  estimated_delivery_time DATETIME,
  actual_delivery_time DATETIME,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  CONSTRAINT fk_orders_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id),
  CONSTRAINT fk_orders_agent
    FOREIGN KEY (delivery_agent_id) REFERENCES deliveryagents(agent_id)
    ON DELETE SET NULL,
  INDEX idx_orders_customer (customer_id),
  INDEX idx_orders_restaurant (restaurant_id),
  INDEX idx_orders_status (status),
  INDEX idx_orders_order_time (order_time)
);

CREATE TABLE orderitems (
  order_item_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  item_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  special_instructions TEXT,
  CONSTRAINT fk_orderitems_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_orderitems_item
    FOREIGN KEY (item_id) REFERENCES menuitems(item_id),
  INDEX idx_orderitems_order (order_id),
  INDEX idx_orderitems_item (item_id)
);

CREATE TABLE payments (
  payment_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL UNIQUE,
  customer_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM('card', 'upi', 'cash') NOT NULL,
  transaction_id VARCHAR(120),
  status ENUM('pending', 'success', 'failed') NOT NULL DEFAULT 'pending',
  paid_at DATETIME,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_payments_customer
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  INDEX idx_payments_status (status)
);

CREATE TABLE reviews (
  review_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  restaurant_id INT NOT NULL,
  order_id INT NOT NULL UNIQUE,
  rating INT NOT NULL,
  comment TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_customer
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  CONSTRAINT fk_reviews_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_reviews_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON DELETE CASCADE,
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
  INDEX idx_reviews_restaurant (restaurant_id),
  INDEX idx_reviews_customer (customer_id)
);

CREATE OR REPLACE VIEW v_restaurant_sales AS
SELECT
  r.restaurant_id,
  r.name AS restaurant_name,
  COUNT(o.order_id) AS total_orders,
  COALESCE(SUM(CASE WHEN o.status <> 'cancelled' THEN o.total_amount ELSE 0 END), 0) AS total_revenue,
  COALESCE(AVG(CASE WHEN o.status <> 'cancelled' THEN o.total_amount END), 0) AS average_order_value
FROM restaurants r
LEFT JOIN orders o ON o.restaurant_id = r.restaurant_id
GROUP BY r.restaurant_id, r.name;

CREATE OR REPLACE VIEW v_order_details AS
SELECT
  o.order_id,
  o.status,
  o.order_time,
  c.customer_id,
  CONCAT(c.first_name, ' ', COALESCE(c.last_name, '')) AS customer_name,
  r.restaurant_id,
  r.name AS restaurant_name,
  o.total_amount,
  p.payment_method,
  p.status AS payment_status
FROM orders o
JOIN customers c ON c.customer_id = o.customer_id
JOIN restaurants r ON r.restaurant_id = o.restaurant_id
LEFT JOIN payments p ON p.order_id = o.order_id;

DELIMITER //

CREATE TRIGGER trg_orderitems_before_insert
BEFORE INSERT ON orderitems
FOR EACH ROW
BEGIN
  SET NEW.subtotal = NEW.quantity * NEW.unit_price;
END//

CREATE TRIGGER trg_reviews_after_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
  UPDATE restaurants
  SET avg_rating = (
    SELECT ROUND(AVG(rating), 2)
    FROM reviews
    WHERE restaurant_id = NEW.restaurant_id AND is_approved = TRUE
  )
  WHERE restaurant_id = NEW.restaurant_id;
END//

CREATE TRIGGER trg_orders_after_update
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
  IF NEW.status = 'delivered' AND OLD.status <> 'delivered' AND NEW.delivery_agent_id IS NOT NULL THEN
    UPDATE deliveryagents
    SET total_deliveries = total_deliveries + 1,
        is_available = TRUE
    WHERE agent_id = NEW.delivery_agent_id;
  END IF;
END//

DELIMITER ;
