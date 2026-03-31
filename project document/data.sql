-- Seed data for TamMalls API (MySQL).
-- Spring Boot 3 + JPA/Hibernate will create/update schema (ddl-auto: update).
-- This file is written to be re-runnable.

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM cart_items;
DELETE FROM reviews;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM users;

SET FOREIGN_KEY_CHECKS = 1;

-- Users
-- Password hash below is a valid BCrypt hash. For convenience, all users share the same password:
-- Password: Password123!
-- Hash: $2a$10$7EqJtq98hPqEX7fNZaFWoOa7c8zYx5HjG3kP3u3QjJp3pVxF2E1aK
INSERT INTO users (id, username, email, password, first_name, last_name, phone_number, profile_image_url, role, enabled, created_at, updated_at) VALUES
  (1, 'admin', 'admin@tammalls.local', '$2a$10$7EqJtq98hPqEX7fNZaFWoOa7c8zYx5HjG3kP3u3QjJp3pVxF2E1aK', 'Admin', 'User', '+10000000001', NULL, 'ADMIN', TRUE, NOW(), NOW()),
  (2, 'seller_one', 'seller1@tammalls.local', '$2a$10$7EqJtq98hPqEX7fNZaFWoOa7c8zYx5HjG3kP3u3QjJp3pVxF2E1aK', 'Sally', 'Seller', '+10000000002', NULL, 'SELLER', TRUE, NOW(), NOW()),
  (3, 'seller_two', 'seller2@tammalls.local', '$2a$10$7EqJtq98hPqEX7fNZaFWoOa7c8zYx5HjG3kP3u3QjJp3pVxF2E1aK', 'Sam', 'Store', '+10000000003', NULL, 'SELLER', TRUE, NOW(), NOW()),
  (4, 'customer_one', 'customer1@tammalls.local', '$2a$10$7EqJtq98hPqEX7fNZaFWoOa7c8zYx5HjG3kP3u3QjJp3pVxF2E1aK', 'Chris', 'Customer', '+10000000004', NULL, 'CUSTOMER', TRUE, NOW(), NOW()),
  (5, 'customer_two', 'customer2@tammalls.local', '$2a$10$7EqJtq98hPqEX7fNZaFWoOa7c8zYx5HjG3kP3u3QjJp3pVxF2E1aK', 'Casey', 'Buyer', '+10000000005', NULL, 'CUSTOMER', TRUE, NOW(), NOW());

-- Categories
INSERT INTO categories (id, name, description, image_url, active, created_at, updated_at) VALUES
  (1, 'Electronics', 'Phones, laptops, and accessories.', 'https://example.com/images/categories/electronics.jpg', TRUE, NOW(), NOW()),
  (2, 'Fashion', 'Clothing, shoes, and accessories.', 'https://example.com/images/categories/fashion.jpg', TRUE, NOW(), NOW()),
  (3, 'Home & Kitchen', 'Appliances and home essentials.', 'https://example.com/images/categories/home-kitchen.jpg', TRUE, NOW(), NOW()),
  (4, 'Beauty', 'Skincare, cosmetics, and personal care.', 'https://example.com/images/categories/beauty.jpg', TRUE, NOW(), NOW()),
  (5, 'Sports', 'Fitness and outdoor gear.', 'https://example.com/images/categories/sports.jpg', TRUE, NOW(), NOW()),
  (6, 'Books', 'Fiction, non-fiction, and educational books.', 'https://example.com/images/categories/books.jpg', TRUE, NOW(), NOW());

-- Products (requires category_id + seller_id)
INSERT INTO products (
  id, name, description, price, discount_percentage, quantity,
  category_id, seller_id, image_url, thumbnail_url, active,
  rating_average, total_reviews, created_at, updated_at
) VALUES
  (1, 'Wireless Headphones', 'Over-ear wireless headphones with noise isolation.', 79.99, 10.00, 50, 1, 2, 'https://example.com/images/products/headphones.jpg', 'https://example.com/images/products/headphones-thumb.jpg', TRUE, 4.5, 2, NOW(), NOW()),
  (2, 'USB-C Charger 65W', 'Fast charger for laptops and phones.', 29.99, 0.00, 120, 1, 2, 'https://example.com/images/products/charger.jpg', 'https://example.com/images/products/charger-thumb.jpg', TRUE, 4.0, 1, NOW(), NOW()),
  (3, 'Smartwatch Series S', 'Fitness-focused smartwatch with GPS.', 119.00, 15.00, 35, 1, 3, 'https://example.com/images/products/smartwatch.jpg', 'https://example.com/images/products/smartwatch-thumb.jpg', TRUE, 5.0, 1, NOW(), NOW()),
  (4, 'Running Shoes', 'Lightweight running shoes for daily training.', 59.90, 5.00, 80, 5, 3, 'https://example.com/images/products/shoes.jpg', 'https://example.com/images/products/shoes-thumb.jpg', TRUE, 0.0, 0, NOW(), NOW()),
  (5, 'Yoga Mat', 'Non-slip yoga mat (6mm) with carry strap.', 24.50, 0.00, 200, 5, 2, 'https://example.com/images/products/yogamat.jpg', 'https://example.com/images/products/yogamat-thumb.jpg', TRUE, 0.0, 0, NOW(), NOW()),
  (6, 'Kitchen Knife Set', 'Stainless steel knife set with block.', 89.00, 20.00, 25, 3, 2, 'https://example.com/images/products/knives.jpg', 'https://example.com/images/products/knives-thumb.jpg', TRUE, 0.0, 0, NOW(), NOW()),
  (7, 'Air Fryer 4L', 'Compact air fryer with presets.', 69.99, 0.00, 40, 3, 3, 'https://example.com/images/products/airfryer.jpg', 'https://example.com/images/products/airfryer-thumb.jpg', TRUE, 0.0, 0, NOW(), NOW()),
  (8, 'Moisturizer', 'Daily facial moisturizer for all skin types.', 14.99, 0.00, 150, 4, 2, 'https://example.com/images/products/moisturizer.jpg', 'https://example.com/images/products/moisturizer-thumb.jpg', TRUE, 0.0, 0, NOW(), NOW()),
  (9, 'Lip Balm Pack', 'Hydrating lip balm (3-pack).', 7.49, 0.00, 300, 4, 3, 'https://example.com/images/products/lipbalm.jpg', 'https://example.com/images/products/lipbalm-thumb.jpg', TRUE, 0.0, 0, NOW(), NOW()),
  (10, 'Denim Jacket', 'Classic denim jacket.', 49.99, 10.00, 60, 2, 2, 'https://example.com/images/products/jacket.jpg', 'https://example.com/images/products/jacket-thumb.jpg', TRUE, 0.0, 0, NOW(), NOW()),
  (11, 'Sneakers', 'Everyday sneakers.', 39.99, 0.00, 90, 2, 3, 'https://example.com/images/products/sneakers.jpg', 'https://example.com/images/products/sneakers-thumb.jpg', TRUE, 0.0, 0, NOW(), NOW()),
  (12, 'Learning Spring Boot', 'A practical guide to Spring Boot fundamentals.', 19.99, 0.00, 110, 6, 2, 'https://example.com/images/products/springbook.jpg', 'https://example.com/images/products/springbook-thumb.jpg', TRUE, 0.0, 0, NOW(), NOW());

-- Reviews (requires product_id + user_id)
INSERT INTO reviews (id, product_id, user_id, rating, title, comment, verified, created_at, updated_at) VALUES
  (1, 1, 4, 5, 'Great sound', 'Comfortable and good battery life.', TRUE, NOW(), NOW()),
  (2, 1, 5, 4, 'Solid for the price', 'Bass is decent; mic is ok.', TRUE, NOW(), NOW()),
  (3, 2, 4, 4, 'Fast charger', 'Charges my laptop and phone quickly.', TRUE, NOW(), NOW()),
  (4, 3, 5, 5, 'Love it', 'Accurate tracking and easy setup.', TRUE, NOW(), NOW());

-- Cart items (unique per user_id + product_id)
INSERT INTO cart_items (id, user_id, product_id, quantity, created_at, updated_at) VALUES
  (1, 4, 4, 1, NOW(), NOW()),
  (2, 4, 5, 2, NOW(), NOW()),
  (3, 5, 10, 1, NOW(), NOW());

-- Orders
INSERT INTO orders (
  id, order_number, user_id, total_amount, subtotal, shipping_cost, tax_amount,
  status, shipping_address, phone_number, notes, created_at, updated_at
) VALUES
  (1, 'TM-2026-000001', 4, 91.88, 84.40, 5.00, 2.48, 'CONFIRMED', '123 Market St, Tam City', '+10000000004', 'Leave at door.', NOW(), NOW());

-- Order items
INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, total_price, created_at) VALUES
  (1, 1, 4, 1, 59.90, 59.90, NOW()),
  (2, 1, 5, 1, 24.50, 24.50, NOW());


