USE fooddash;

CREATE TABLE IF NOT EXISTS customer_addresses (
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

INSERT INTO customer_addresses (customer_id, label, address, city, pincode, is_default)
SELECT customer_id, 'Home', address, city, pincode, TRUE
FROM customers
WHERE address IS NOT NULL
  AND address <> ''
  AND NOT EXISTS (
    SELECT 1
    FROM customer_addresses ca
    WHERE ca.customer_id = customers.customer_id
  );
