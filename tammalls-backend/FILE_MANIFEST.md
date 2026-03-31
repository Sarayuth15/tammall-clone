# TamMalls API - Complete File Manifest

## All Files Created (35 Java Files + 4 Configuration Files)

### Configuration & Build Files

1. **pom.xml**
   - Maven project configuration
   - All dependencies for Spring Boot, MySQL, JWT, Lombok
   - Java 21 compilation settings
   - Build plugins

2. **application.yml**
   - Spring Boot application configuration
   - MySQL database connection settings
   - JPA/Hibernate configuration
   - JWT token settings
   - Logging configuration

3. **PROJECT_STRUCTURE.md**
   - Complete project directory structure
   - File organization by feature
   - Database schema SQL
   - API endpoint summary table
   - Coding standards and conventions

4. **SETUP_GUIDE.md**
   - Step-by-step installation instructions
   - Database setup for Windows/Linux/Mac
   - IDE configuration (IntelliJ, VS Code)
   - Development tools setup
   - Troubleshooting guide
   - Docker and production deployment

5. **README.md**
   - Complete project documentation
   - Features overview
   - API endpoint documentation with examples
   - Project structure explanation
   - Performance tips and future enhancements

---

## Java Source Files (35 Total)

### Main Application Class (1)

1. **TammallsApiApplication.java** (`com.tammalls.api`)
   - Spring Boot main application entry point
   - Component scanning configuration

### Configuration Classes (3)

2. **SecurityConfig.java** (`com.tammalls.api.config`)
   - Spring Security configuration with JWT
   - HTTP security rules and CORS settings
   - Authentication provider setup
   - Session management

3. **JwtAuthenticationEntryPoint.java** (`com.tammalls.api.config`)
   - Handles unauthorized (401) responses
   - Returns JSON error response

4. **JwtAccessDeniedHandler.java** (`com.tammalls.api.config`)
   - Handles forbidden (403) responses
   - Returns JSON error response

### Security Classes (3)

5. **JwtTokenProvider.java** (`com.tammalls.api.security`)
   - JWT token generation and validation
   - Username extraction from token
   - Token expiration checking

6. **CustomUserDetailsService.java** (`com.tammalls.api.security`)
   - Custom implementation of UserDetailsService
   - Loads user from database by username or ID
   - Creates UserDetails for Spring Security

7. **JwtAuthenticationFilter.java** (`com.tammalls.api.security`)
   - Validates JWT tokens from HTTP requests
   - Sets authentication in SecurityContext
   - Runs once per request

### Entity Classes (7)

8. **User.java** (`com.tammalls.api.entity`)
   - User entity with roles (CUSTOMER, SELLER, ADMIN)
   - Password, email, phone, profile image
   - Timestamps for created/updated

9. **Category.java** (`com.tammalls.api.entity`)
   - Product category entity
   - Name, description, image URL
   - Active status flag

10. **Product.java** (`com.tammalls.api.entity`)
    - Product entity with pricing and inventory
    - Discount percentage support
    - Rating average and total reviews
    - Relationship to seller and category

11. **CartItem.java** (`com.tammalls.api.entity`)
    - Shopping cart item entity
    - User and product relationship
    - Quantity tracking

12. **Order.java** (`com.tammalls.api.entity`)
    - Customer order entity
    - Order number, status tracking
    - Pricing breakdown (subtotal, shipping, tax)
    - Shipping address and notes

13. **OrderItem.java** (`com.tammalls.api.entity`)
    - Individual items within an order
    - Unit price snapshot at order time
    - Quantity and total price

14. **Review.java** (`com.tammalls.api.entity`)
    - Product review entity
    - Rating (1-5), title, comment
    - Verified purchase flag
    - Relationship to product and reviewer

### Repository Classes (1 file with 6 interfaces)

15. **Repositories.java** (`com.tammalls.api.repository`)
    - **UserRepository**: CRUD + username/email lookup
    - **CategoryRepository**: CRUD + findByName
    - **ProductRepository**: Search, filter by category/seller, top products
    - **CartItemRepository**: Cart management operations
    - **OrderRepository**: Order lookup and filtering
    - **ReviewRepository**: Review retrieval and rating calculation

### DTO Classes (1 file with 17 classes)

16. **DTOs.java** (`com.tammalls.api.dto`)
    - UserRegistrationDto - User signup
    - UserLoginDto - User login
    - UserResponseDto - User response
    - CategoryDto - Category data transfer
    - ProductCreateDto - New product creation
    - ProductUpdateDto - Product updates
    - ProductResponseDto - Product response with relations
    - CartItemDto - Cart item response
    - AddToCartDto - Add to cart request
    - CartResponseDto - Cart summary response
    - CreateOrderDto - Order creation request
    - OrderItemResponseDto - Order item details
    - OrderResponseDto - Complete order response
    - CreateReviewDto - Review creation request
    - ReviewResponseDto - Review response
    - AuthResponseDto - Login/register response with token
    - ApiResponseDto - Generic API response wrapper

### Service Classes (7)

17. **UserService.java** (`com.tammalls.api.service`)
    - User registration (CUSTOMER, SELLER roles)
    - Profile updates
    - Password change
    - Username/email lookup
    - DTO conversion

18. **AuthService.java** (`com.tammalls.api.service`)
    - Customer registration
    - Seller registration
    - Login with JWT token generation
    - Token-based authentication flow

19. **ProductService.java** (`com.tammalls.api.service`)
    - Product CRUD operations
    - Search functionality
    - Category filtering
    - Seller-specific product management
    - Discount calculation
    - DTO conversion

20. **CategoryService.java** (`com.tammalls.api.service`)
    - Category CRUD operations
    - Category lookup by name
    - Active/inactive status management
    - DTO conversion

21. **CartService.java** (`com.tammalls.api.service`)
    - Add to cart with stock validation
    - Cart item quantity updates
    - Remove from cart
    - Clear entire cart
    - Cart summary calculation
    - Stock checking

22. **OrderService.java** (`com.tammalls.api.service`)
    - Create order from cart
    - Automatic order number generation
    - Price calculation (subtotal, shipping, tax)
    - Order status management
    - Order cancellation with inventory restoration
    - Order item management

23. **ReviewService.java** (`com.tammalls.api.service`)
    - Review creation and updates
    - Review deletion
    - Duplicate review prevention
    - Product rating aggregation
    - Review verification
    - DTO conversion

### Controller Classes (6)

24. **AuthController.java** (`com.tammalls.api.controller`)
    - POST /auth/register/customer - Customer registration
    - POST /auth/register/seller - Seller registration
    - POST /auth/login - User login

25. **ProductController.java** (`com.tammalls.api.controller`)
    - GET /products - List all products (paginated)
    - GET /products/search - Search products by keyword
    - GET /products/category/{id} - Filter by category
    - GET /products/{id} - Get product details
    - POST /products - Create product (SELLER, ADMIN)
    - PUT /products/{id} - Update product (SELLER, ADMIN)
    - DELETE /products/{id} - Delete product (SELLER, ADMIN)
    - GET /products/seller/{id} - List seller's products

26. **CartController.java** (`com.tammalls.api.controller`)
    - GET /cart - Get user's cart
    - POST /cart/add - Add item to cart
    - PUT /cart/items/{id} - Update quantity
    - DELETE /cart/items/{id} - Remove item
    - DELETE /cart/products/{id} - Remove product from cart
    - DELETE /cart - Clear entire cart
    - GET /cart/count - Get item count

27. **OrderController.java** (`com.tammalls.api.controller`)
    - POST /orders - Create order from cart
    - GET /orders/{id} - Get order details
    - GET /orders/number/{orderNumber} - Lookup by order number
    - GET /orders - List user's orders (paginated)
    - GET /orders/status/{status} - Filter by status (ADMIN)
    - PATCH /orders/{id}/status - Update status (ADMIN)
    - DELETE /orders/{id} - Cancel order

28. **ReviewController.java** (`com.tammalls.api.controller`)
    - POST /reviews - Create review
    - PUT /reviews/{id} - Update review
    - DELETE /reviews/{id} - Delete review
    - GET /reviews/{id} - Get review details
    - GET /reviews/product/{id} - List product reviews (paginated)
    - GET /reviews/product/{id}/list - List all reviews (unpaginated)
    - GET /reviews/product/{id}/my-review - Get user's review
    - PATCH /reviews/{id}/verify - Verify review (ADMIN)

29. **CategoryController.java** (`com.tammalls.api.controller`)
    - GET /categories - Get all categories
    - GET /categories/active - Get active categories only
    - GET /categories/{id} - Get category by ID
    - GET /categories/name/{name} - Get category by name
    - POST /categories - Create category (ADMIN)
    - PUT /categories/{id} - Update category (ADMIN)
    - DELETE /categories/{id} - Delete category (ADMIN)

### Exception Handling (2)

30. **GlobalExceptionHandler.java** (`com.tammalls.api.exception`)
    - Centralized exception handling
    - IllegalArgumentException handler
    - ResourceNotFoundException handler
    - BadCredentialsException handler
    - AuthenticationException handler
    - Validation error handling
    - Generic exception fallback

31. **ResourceNotFoundException.java** (`com.tammalls.api.exception`)
    - Custom runtime exception
    - Used for resource not found scenarios
    - Serializable

---

## API Endpoints Summary

### Authentication (3 endpoints)
- POST /api/auth/register/customer
- POST /api/auth/register/seller
- POST /api/auth/login

### Products (8 endpoints)
- GET /api/products
- GET /api/products/search
- GET /api/products/{id}
- GET /api/products/category/{categoryId}
- GET /api/products/seller/{sellerId}
- POST /api/products (SELLER, ADMIN)
- PUT /api/products/{id} (SELLER, ADMIN)
- DELETE /api/products/{id} (SELLER, ADMIN)

### Categories (7 endpoints)
- GET /api/categories
- GET /api/categories/active
- GET /api/categories/{id}
- GET /api/categories/name/{name}
- POST /api/categories (ADMIN)
- PUT /api/categories/{id} (ADMIN)
- DELETE /api/categories/{id} (ADMIN)

### Shopping Cart (7 endpoints)
- GET /api/cart
- GET /api/cart/count
- POST /api/cart/add
- PUT /api/cart/items/{cartItemId}
- DELETE /api/cart/items/{cartItemId}
- DELETE /api/cart/products/{productId}
- DELETE /api/cart

### Orders (7 endpoints)
- POST /api/orders
- GET /api/orders
- GET /api/orders/{id}
- GET /api/orders/number/{orderNumber}
- GET /api/orders/status/{status} (ADMIN)
- PATCH /api/orders/{id}/status (ADMIN)
- DELETE /api/orders/{id}

### Reviews (8 endpoints)
- GET /api/reviews/{id}
- GET /api/reviews/product/{productId}
- GET /api/reviews/product/{productId}/list
- GET /api/reviews/product/{productId}/my-review
- POST /api/reviews
- PUT /api/reviews/{id}
- DELETE /api/reviews/{id}
- PATCH /api/reviews/{id}/verify (ADMIN)

**Total: 40 API Endpoints**

---

## Database Tables

1. **users** - User accounts with roles
2. **categories** - Product categories
3. **products** - Products with pricing and inventory
4. **cart_items** - Shopping cart items
5. **orders** - Customer orders
6. **order_items** - Items within orders
7. **reviews** - Product reviews and ratings

---

## Key Features Implemented

✅ User authentication with JWT tokens
✅ Role-based access control (CUSTOMER, SELLER, ADMIN)
✅ Product catalog management
✅ Multi-vendor support (sellers)
✅ Shopping cart with stock validation
✅ Order creation and tracking
✅ Order status management
✅ Product reviews with rating aggregation
✅ Category management
✅ Search functionality
✅ Pagination support
✅ Price calculations (discounts, shipping, tax)
✅ Error handling with global exception handler
✅ CORS configuration
✅ Security with BCrypt password encryption
✅ MySQL database with JPA/Hibernate
✅ Lombok for clean code
✅ Java 21 support

---

## Dependencies Included

### Spring Boot Starters
- spring-boot-starter-web (REST API)
- spring-boot-starter-data-jpa (Database ORM)
- spring-boot-starter-security (Authentication/Authorization)
- spring-boot-starter-validation (Input validation)

### Database
- mysql-connector-java (MySQL driver)

### Security
- jjwt-api, jjwt-impl, jjwt-jackson (JWT)
- Spring Security

### Code Generation
- Lombok

### Additional
- MapStruct (Optional, for DTO mapping)

---

## How to Use These Files

### Option 1: Manual File Organization

1. Create Maven project structure:
   ```
   tammalls-api/
   ├── pom.xml
   ├── README.md
   ├── SETUP_GUIDE.md
   ├── PROJECT_STRUCTURE.md
   └── src/main/
       ├── java/com/tammalls/api/
       │   ├── config/
       │   ├── controller/
       │   ├── service/
       │   ├── entity/
       │   ├── repository/
       │   ├── dto/
       │   ├── security/
       │   └── exception/
       └── resources/
           └── application.yml
   ```

2. Copy Java files to appropriate directories
3. Copy pom.xml and application.yml
4. Follow SETUP_GUIDE.md for database setup
5. Run: `mvn clean install && mvn spring-boot:run`

### Option 2: Use IDE Generation

1. Create new Spring Boot project in IntelliJ/VS Code
2. Copy pom.xml content into project's pom.xml
3. Create package structure matching the files
4. Copy Java classes to correct packages
5. Copy application.yml to resources folder
6. Build and run

---

## Testing Checklist

- [ ] Database creation and connection
- [ ] Application startup (port 8080)
- [ ] Register as customer
- [ ] Register as seller
- [ ] Login and get JWT token
- [ ] Create product (as seller)
- [ ] Browse products
- [ ] Search products
- [ ] Add to cart
- [ ] Create order from cart
- [ ] View order details
- [ ] Leave review
- [ ] Update review
- [ ] Check product rating update
- [ ] Admin functions
- [ ] Error handling (invalid data)
- [ ] Authentication (missing token)
- [ ] Authorization (wrong role)

---

## Next Steps After Setup

1. **Test all endpoints** using Postman or REST Client
2. **Create sample data** (categories, products, users)
3. **Implement frontend** (React, Vue, or Angular)
4. **Add payment integration** (Stripe, PayPal)
5. **Setup email notifications** (SendGrid, Mailgun)
6. **Implement logging** (ELK Stack, Splunk)
7. **Setup monitoring** (Prometheus, Grafana)
8. **Configure CI/CD** (GitHub Actions, Jenkins)
9. **Deploy to production** (AWS, Azure, GCP)
10. **Setup domain and SSL** (Let's Encrypt)

---

## Support Resources

- **Spring Boot Documentation**: https://spring.io/projects/spring-boot
- **Spring Data JPA**: https://spring.io/projects/spring-data-jpa
- **Spring Security**: https://spring.io/projects/spring-security
- **MySQL Documentation**: https://dev.mysql.com/doc/
- **Lombok Documentation**: https://projectlombok.org/
- **JWT.io**: https://jwt.io/

---

## File Sizes Reference

- Total Java files: ~35 files (100-300 lines each)
- Total configuration: ~400 lines
- Total documentation: ~2000 lines
- Estimated total lines of code: ~8000+

---

Generated: March 30, 2026
Version: 1.0.0
Language: Java 21
Framework: Spring Boot 3.2.2
Database: MySQL 8.0
