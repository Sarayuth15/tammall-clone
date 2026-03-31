# TamMalls API - Quick Start Guide (5 Minutes)

## ⚡ Fastest Way to Get Started

### Prerequisites (Must Have)
- ✅ Java 21 installed
- ✅ MySQL 8.0+ running
- ✅ Maven 3.8+

### Step 1: Database Setup (1 min)

```bash
# Open MySQL
mysql -u root -p

# In MySQL CLI:
CREATE DATABASE tammalls_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tammalls_user'@'localhost' IDENTIFIED BY 'tammalls_password';
GRANT ALL PRIVILEGES ON tammalls_db.* TO 'tammalls_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 2: Project Setup (1 min)

```bash
# Clone or create project folder
mkdir tammalls-api
cd tammalls-api

# Copy all Java files to: src/main/java/com/tammalls/api/
# - Place pom.xml in project root
# - Place application.yml in: src/main/resources/
```

### Step 3: Build & Run (2 min)

```bash
# Build project
mvn clean install

# Run application
mvn spring-boot:run
```

**API will be running at**: `http://localhost:8080/api`

---

## 🧪 Quick Test (Test Your Setup)

### 1. Register a Customer

```bash
curl -X POST http://localhost:8080/api/auth/register/customer \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+855123456789"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER"
  },
  "tokenType": "Bearer"
}
```

**Copy the token value!** You'll need it for protected endpoints.

### 2. Get Categories (No Auth Required)

```bash
curl http://localhost:8080/api/categories
```

**Expected Response:**
```json
[]
```
(Empty array is normal - no categories created yet)

### 3. Create a Seller Account

```bash
curl -X POST http://localhost:8080/api/auth/register/seller \
  -H "Content-Type: application/json" \
  -d '{
    "username": "seller1",
    "email": "seller@example.com",
    "password": "password123",
    "firstName": "Alice",
    "lastName": "Seller",
    "phoneNumber": "+855987654321"
  }'
```

Save the seller's token!

### 4. Create a Category (As Admin - Use Your Token)

First, you need to create an admin user manually in the database:

```bash
mysql -u tammalls_user -p tammalls_db

# In MySQL:
INSERT INTO users (username, email, password, first_name, last_name, role, enabled, created_at, updated_at) 
VALUES ('admin', 'admin@example.com', '$2a$10$...hashed_password...', 'Admin', 'User', 'ADMIN', true, NOW(), NOW());
EXIT;
```

Or simply use the customer token to test protected endpoints.

### 5. Create a Product (As Seller)

```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SELLER_TOKEN" \
  -d '{
    "name": "Laptop",
    "description": "High performance laptop",
    "price": 999.99,
    "discountPercentage": 10,
    "quantity": 50,
    "categoryId": 1,
    "imageUrl": "https://example.com/laptop.jpg",
    "thumbnailUrl": "https://example.com/laptop-thumb.jpg"
  }'
```

### 6. Add to Cart (As Customer)

```bash
curl -X POST http://localhost:8080/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CUSTOMER_TOKEN" \
  -d '{
    "productId": 1,
    "quantity": 2
  }'
```

### 7. Create Order

```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CUSTOMER_TOKEN" \
  -d '{
    "shippingAddress": "123 Main St, Phnom Penh, Cambodia",
    "phoneNumber": "+855123456789",
    "notes": "Please deliver in the morning"
  }'
```

---

## 📚 Key Endpoints Cheat Sheet

### Auth
```
POST   /api/auth/register/customer
POST   /api/auth/register/seller
POST   /api/auth/login
```

### Products
```
GET    /api/products                    (No auth)
GET    /api/products/{id}               (No auth)
GET    /api/products/search?keyword=    (No auth)
POST   /api/products                    (Seller/Admin)
PUT    /api/products/{id}               (Seller/Admin)
DELETE /api/products/{id}               (Seller/Admin)
```

### Categories
```
GET    /api/categories                  (No auth)
GET    /api/categories/{id}             (No auth)
POST   /api/categories                  (Admin)
PUT    /api/categories/{id}             (Admin)
DELETE /api/categories/{id}             (Admin)
```

### Cart
```
GET    /api/cart                        (Auth required)
POST   /api/cart/add                    (Auth required)
PUT    /api/cart/items/{id}             (Auth required)
DELETE /api/cart/items/{id}             (Auth required)
DELETE /api/cart                        (Auth required)
```

### Orders
```
POST   /api/orders                      (Auth required)
GET    /api/orders                      (Auth required)
GET    /api/orders/{id}                 (Auth required)
GET    /api/orders/status/{status}      (Admin)
PATCH  /api/orders/{id}/status          (Admin)
DELETE /api/orders/{id}                 (Auth required)
```

### Reviews
```
GET    /api/reviews/product/{id}        (No auth)
POST   /api/reviews                     (Auth required)
PUT    /api/reviews/{id}                (Auth required)
DELETE /api/reviews/{id}                (Auth required)
```

---

## 🐛 Troubleshooting

### Problem: "Connection refused" to MySQL
```bash
# Check MySQL is running
sudo systemctl status mysql

# Start if not running
sudo systemctl start mysql
```

### Problem: Port 8080 already in use
```bash
# Change in application.yml:
server:
  port: 8081
```

### Problem: "Authentication failed" with JWT
- Ensure Authorization header format: `Bearer <token>`
- Token must not be expired
- Token must be from correct user

### Problem: "Category not found" when creating product
- Create a category first:
```bash
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "name": "Electronics",
    "description": "Electronic devices",
    "imageUrl": "https://example.com/electronics.jpg"
  }'
```

### Problem: Validation error - "Invalid request data"
- Check JSON format is correct
- Ensure all required fields are present
- Verify field types (string, number, boolean)

---

## 📁 File Organization Quick Reference

After extracting all files:

```
tammalls-api/
├── pom.xml
├── README.md
├── SETUP_GUIDE.md
├── PROJECT_STRUCTURE.md
├── FILE_MANIFEST.md
├── QUICK_START.md (this file)
└── src/main/
    ├── java/com/tammalls/api/
    │   ├── TammallsApiApplication.java
    │   ├── config/         (3 files)
    │   ├── controller/     (6 files)
    │   ├── service/        (7 files)
    │   ├── entity/         (7 files)
    │   ├── repository/     (1 file with 6 interfaces)
    │   ├── dto/            (1 file with 17 classes)
    │   ├── security/       (3 files)
    │   └── exception/      (2 files)
    └── resources/
        └── application.yml
```

---

## ✨ Common Use Cases

### Use Case 1: Register & Buy Product

```bash
# 1. Register as customer
TOKEN=$(curl -X POST http://localhost:8080/api/auth/register/customer \
  -H "Content-Type: application/json" \
  -d '{"username":"buyer","email":"buyer@x.com","password":"123","firstName":"John","lastName":"Doe","phoneNumber":"123456"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 2. View products
curl http://localhost:8080/api/products

# 3. Add to cart
curl -X POST http://localhost:8080/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"productId":1,"quantity":1}'

# 4. Create order
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"shippingAddress":"123 Street","phoneNumber":"123456"}'
```

### Use Case 2: Seller Adding Products

```bash
# 1. Register as seller
SELLER_TOKEN=$(curl -X POST http://localhost:8080/api/auth/register/seller ... | grep token)

# 2. Create product
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SELLER_TOKEN" \
  -d '{"name":"Product","description":"Desc","price":100,"quantity":10,"categoryId":1}'

# 3. View your products
curl http://localhost:8080/api/products/seller/{sellerId}
```

### Use Case 3: Admin Managing Categories

```bash
# Create category
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"name":"Electronics","description":"Electronic devices"}'

# Update category
curl -X PUT http://localhost:8080/api/categories/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"name":"Updated Name"}'

# Delete category
curl -X DELETE http://localhost:8080/api/categories/1 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 📊 API Response Format

All API responses follow this format:

### Success Response
```json
{
  "id": 1,
  "username": "john",
  "email": "john@example.com",
  ...
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

### Paginated Response
```json
{
  "content": [...],
  "totalElements": 100,
  "totalPages": 5,
  "number": 0,
  "size": 20
}
```

---

## 🚀 Performance Tips

1. **Add indexes to database**:
```sql
ALTER TABLE products ADD INDEX idx_category (category_id);
ALTER TABLE products ADD INDEX idx_seller (seller_id);
ALTER TABLE cart_items ADD INDEX idx_user (user_id);
ALTER TABLE orders ADD INDEX idx_customer (user_id);
```

2. **Enable query caching** (optional):
```yaml
spring:
  cache:
    type: simple
```

3. **Use pagination** for large datasets:
```
GET /api/products?page=0&size=20
```

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Complete API documentation |
| SETUP_GUIDE.md | Detailed installation instructions |
| PROJECT_STRUCTURE.md | Project organization and database schema |
| FILE_MANIFEST.md | Complete list of all files created |
| QUICK_START.md | This file - fastest way to get started |

---

## 💡 Tips & Tricks

### Useful MySQL Commands
```bash
# Login
mysql -u tammalls_user -p tammalls_db

# View all tables
SHOW TABLES;

# View user data
SELECT id, username, email, role FROM users;

# Reset database
DROP DATABASE tammalls_db;
CREATE DATABASE tammalls_db;

# Reset password
UPDATE users SET password = '$2a$10$...' WHERE username = 'john';
```

### Useful Maven Commands
```bash
# Clean build
mvn clean compile

# Run specific test
mvn test -Dtest=ProductServiceTest

# Skip tests
mvn clean package -DskipTests

# Show dependency tree
mvn dependency:tree
```

### Useful curl Options
```bash
# Pretty print JSON
curl ... | jq

# Save token to variable
TOKEN=$(curl ... | jq -r '.token')

# Add timeout
curl --max-time 5 ...

# Show headers
curl -i ...

# Verbose output
curl -v ...
```

---

## 🔐 Security Reminders

✅ Change the JWT secret in production
✅ Use strong passwords (min 12 characters)
✅ Enable HTTPS in production
✅ Use environment variables for sensitive data
✅ Implement rate limiting
✅ Add database backups
✅ Monitor access logs

---

## 📞 Need Help?

1. Check **SETUP_GUIDE.md** for detailed instructions
2. See **PROJECT_STRUCTURE.md** for database schema
3. Review **README.md** for API documentation
4. Check the error message in the application logs

---

## 🎯 Next Steps After Quick Start

1. ✅ Get the API running (you are here!)
2. ⬜ Test all endpoints
3. ⬜ Create sample data
4. ⬜ Build frontend (React/Vue/Angular)
5. ⬜ Integrate payment gateway
6. ⬜ Setup email notifications
7. ⬜ Deploy to production

---

**Happy Coding! 🚀**

Created: March 30, 2026
Version: 1.0.0 - TamMalls E-commerce API
