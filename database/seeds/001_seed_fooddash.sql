USE fooddash;

INSERT INTO customers
  (email, password_hash, phone, first_name, last_name, address, city, pincode, email_verified)
VALUES
  ('aarav@example.com', '$2a$10$8fFz3RvxK7ZrI2IXc9.Ube1UFpuO6jKXYv4H7N8V0UQyVimHoGq6y', '9876543210', 'Aarav', 'Sharma', '221 MG Road', 'Vijayawada', '400001', TRUE),
  ('meera@example.com', '$2a$10$8fFz3RvxK7ZrI2IXc9.Ube1UFpuO6jKXYv4H7N8V0UQyVimHoGq6y', '9876543211', 'Meera', 'Patel', '15 Lake View', 'Vijayawada', '400002', TRUE);

INSERT INTO restaurants
  (name, owner_name, email, password_hash, phone, address, city, pincode, cuisine_type, description, avg_rating, delivery_fee, is_open, is_approved)
VALUES
  ('Spice Route', 'Rohan Mehta', 'spiceroute@example.com', '$2a$10$4uGADf5ku7AnKDxBk3Z2sOC2xjxngAlsDiBhCb.3iuCC7gMfaFbJu', '9000000001', '10 Fort Street', 'Vijayawada', '400001', 'Indian', 'North Indian meals, biryani, and street-food favorites.', 4.50, 35.00, TRUE, TRUE),
  ('Wok Express', 'Nisha Rao', 'wokexpress@example.com', '$2a$10$4uGADf5ku7AnKDxBk3Z2sOC2xjxngAlsDiBhCb.3iuCC7gMfaFbJu', '9000000002', '8 Carter Road', 'Vijayawada', '400050', 'Chinese', 'Fast wok bowls, noodles, and Indo-Chinese snacks.', 4.20, 30.00, TRUE, TRUE),
  ('Green Bowl', 'Ishaan Kapoor', 'greenbowl@example.com', '$2a$10$4uGADf5ku7AnKDxBk3Z2sOC2xjxngAlsDiBhCb.3iuCC7gMfaFbJu', '9000000003', '44 Bandra West', 'Vijayawada', '400050', 'Healthy', 'Salads, smoothie bowls, and vegetarian meals.', 4.70, 25.00, TRUE, TRUE);

INSERT INTO deliveryagents
  (name, email, phone, vehicle_type, license_number, is_available, current_location, avg_rating)
VALUES
  ('Kabir Khan', 'kabir.agent@example.com', '8888888801', 'bike', 'MH01AB1234', TRUE, 'Fort, Vijayawada', 4.60),
  ('Ananya Das', 'ananya.agent@example.com', '8888888802', 'scooter', 'MH02CD5678', TRUE, 'Bandra, Vijayawada', 4.80);

INSERT INTO menuitems
  (restaurant_id, item_name, description, price, category, is_veg, is_available)
VALUES
  (1, 'Paneer Butter Masala', 'Creamy tomato gravy with paneer cubes.', 240.00, 'veg', TRUE, TRUE),
  (1, 'Chicken Biryani', 'Aromatic basmati rice with spiced chicken.', 280.00, 'non-veg', FALSE, TRUE),
  (1, 'Garlic Naan', 'Tandoor naan topped with garlic butter.', 55.00, 'sides', TRUE, TRUE),
  (2, 'Veg Hakka Noodles', 'Stir fried noodles with fresh vegetables.', 180.00, 'veg', TRUE, TRUE),
  (2, 'Chicken Manchurian', 'Chicken dumplings in tangy Manchurian sauce.', 230.00, 'non-veg', FALSE, TRUE),
  (3, 'Quinoa Power Bowl', 'Quinoa, vegetables, chickpeas, and herb dressing.', 260.00, 'veg', TRUE, TRUE),
  (3, 'Mango Smoothie', 'Fresh mango smoothie with yogurt.', 140.00, 'beverage', TRUE, TRUE);

INSERT INTO orders
  (customer_id, restaurant_id, delivery_agent_id, status, total_amount, delivery_address, estimated_delivery_time)
VALUES
  (1, 1, 1, 'delivered', 365.00, '221 MG Road, Vijayawada', DATE_SUB(NOW(), INTERVAL 1 DAY));

INSERT INTO orderitems
  (order_id, item_id, quantity, unit_price, subtotal)
VALUES
  (1, 1, 1, 240.00, 240.00),
  (1, 3, 2, 55.00, 110.00);

INSERT INTO payments
  (order_id, customer_id, amount, payment_method, transaction_id, status, paid_at)
VALUES
  (1, 1, 365.00, 'upi', 'UPI-DEMO-001', 'success', DATE_SUB(NOW(), INTERVAL 1 DAY));

INSERT INTO reviews
  (customer_id, restaurant_id, order_id, rating, comment)
VALUES
  (1, 1, 1, 5, 'Food was hot and delivery was quick.');
