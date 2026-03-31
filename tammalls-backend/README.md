# TamMalls API - Backend

Spring Boot REST API for the TamMalls e-commerce platform.

## Quick Start

### Prerequisites
- Java 21
- MySQL 8.0+
- Maven 3.8+

### Setup (5 minutes)

1. **Create database**
```bash
mysql -u root -p
CREATE DATABASE tammalls_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tammalls_user'@'localhost' IDENTIFIED BY 'tammalls_password';
GRANT ALL PRIVILEGES ON tammalls_db.* TO 'tammalls_user'@'localhost';
FLUSH PRIVILEGES;
```

2. **Build & Run**
```bash
mvn clean install
mvn spring-boot:run
```

API running at: `http://localhost:8080/api`

## Project Structure

```
src/main/java/com/tammalls/api/
├── config/          # Security configuration
├── controller/      # REST endpoints
├── service/         # Business logic
├── entity/          # Database models
├── repository/      # Data access
├── dto/             # Data transfer objects
├── security/        # JWT authentication
└── exception/       # Error handling
```

## Documentation

- `README.md` - Complete API documentation
- `QUICK_START.md` - 5-minute setup guide
- `SETUP_GUIDE.md` - Detailed installation
- `PROJECT_STRUCTURE.md` - Architecture details

## API Endpoints

### Authentication (3)
- POST /api/auth/login
- POST /api/auth/register/customer
- POST /api/auth/register/seller

### Products (8)
- GET /api/products
- GET /api/products/{id}
- POST /api/products (Seller)
- PUT /api/products/{id} (Seller)

### Orders (7)
- POST /api/orders
- GET /api/orders
- GET /api/orders/{id}

### Cart (7)
- GET /api/cart
- POST /api/cart/add
- DELETE /api/cart

And more...

## Tech Stack

- Spring Boot 3.2.2
- Spring Security + JWT
- Spring Data JPA
- MySQL 8.0+
- Lombok
- Java 21

## Features

✅ JWT Authentication
✅ Role-Based Access Control
✅ Product Management
✅ Shopping Cart
✅ Order Processing
✅ Product Reviews
✅ Error Handling
✅ CORS Support

## Testing

```bash
# Test API
curl http://localhost:8080/api/categories

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'
```

See documentation files for complete API reference.
