# TamMalls API - Project Structure

## Directory Organization

```
tammalls-api/
│
├── src/main/java/com/tammalls/api/
│   ├── TammallsApiApplication.java           # Main Spring Boot Application
│   │
│   ├── config/
│   │   ├── SecurityConfig.java               # Spring Security Configuration
│   │   ├── JwtAuthenticationEntryPoint.java   # Unauthorized Access Handler
│   │   └── JwtAccessDeniedHandler.java        # Forbidden Access Handler
│   │
│   ├── controller/
│   │   ├── AuthController.java                # Login & Registration
│   │   ├── ProductController.java             # Product Management
│   │   ├── CartController.java                # Shopping Cart
│   │   ├── OrderController.java               # Order Management
│   │   ├── ReviewController.java              # Product Reviews
│   │   └── CategoryController.java            # Category Management
│   │
│   ├── service/
│   │   ├── AuthService.java                   # Authentication Logic
│   │   ├── UserService.java                   # User Management
│   │   ├── ProductService.java                # Product Business Logic
│   │   ├── CartService.java                   # Shopping Cart Logic
│   │   ├── OrderService.java                  # Order Processing
│   │   ├── ReviewService.java                 # Review Management
│   │   └── CategoryService.java               # Category Operations
│   │
│   ├── entity/
│   │   ├── User.java                          # User Entity
│   │   ├── Category.java                      # Category Entity
│   │   ├── Product.java                       # Product Entity
│   │   ├── CartItem.java                      # Cart Item Entity
│   │   ├── Order.java                         # Order Entity
│   │   ├── OrderItem.java                     # Order Item Entity
│   │   └── Review.java                        # Review Entity
│   │
│   ├── repository/
│   │   ├── UserRepository.java                # User Data Access
│   │   ├── CategoryRepository.java            # Category Data Access
│   │   ├── ProductRepository.java             # Product Data Access
│   │   ├── CartItemRepository.java            # Cart Item Data Access
│   │   ├── OrderRepository.java               # Order Data Access
│   │   ├── OrderItemRepository.java           # Order Item Data Access
│   │   └── ReviewRepository.java              # Review Data Access
│   │
│   ├── dto/
│   │   ├── UserRegistrationDto.java           # User Registration DTO
│   │   ├── UserLoginDto.java                  # User Login DTO
│   │   ├── UserResponseDto.java               # User Response DTO
│   │   ├── CategoryDto.java                   # Category DTO
│   │   ├── ProductCreateDto.java              # Product Creation DTO
│   │   ├── ProductUpdateDto.java              # Product Update DTO
│   │   ├── ProductResponseDto.java            # Product Response DTO
│   │   ├── CartItemDto.java                   # Cart Item DTO
│   │   ├── AddToCartDto.java                  # Add to Cart DTO
│   │   ├── CartResponseDto.java               # Cart Response DTO
│   │   ├── CreateOrderDto.java                # Order Creation DTO
│   │   ├── OrderItemResponseDto.java          # Order Item Response DTO
│   │   ├── OrderResponseDto.java              # Order Response DTO
│   │   ├── CreateReviewDto.java               # Review Creation DTO
│   │   ├── ReviewResponseDto.java             # Review Response DTO
│   │   ├── AuthResponseDto.java               # Authentication Response DTO
│   │   └── ApiResponseDto.java                # Generic API Response DTO
│   │
│   ├── security/
│   │   ├── JwtTokenProvider.java              # JWT Token Generation & Validation
│   │   ├── CustomUserDetailsService.java      # Custom User Details Service
│   │   └── JwtAuthenticationFilter.java       # JWT Authentication Filter
│   │
│   └── exception/
│       ├── GlobalExceptionHandler.java        # Global Exception Handler
│       └── ResourceNotFoundException.java     # Custom Exception
│
├── src/main/resources/
│   ├── application.yml                        # Application Configuration
│   └── data.sql                               # Initial Data (Optional)
│
├── src/test/java/com/tammalls/api/
│   ├── controller/                            # Controller Tests
│   ├── service/                               # Service Tests
│   └── repository/                            # Repository Tests
│
├── pom.xml                                    # Maven Configuration
├── README.md                                  # Documentation
└── .gitignore                                 # Git Ignore File
```

## File Organization by Feature

### Authentication Feature
- `AuthController.java` - REST endpoints for login/register
- `AuthService.java` - Authentication business logic
- `JwtTokenProvider.java` - Token generation and validation
- `CustomUserDetailsService.java` - User loading from database
- `JwtAuthenticationFilter.java` - Token validation filter
- `SecurityConfig.java` - Spring Security configuration

### User Management Feature
- `User.java` - User entity with roles
- `UserRepository.java` - User data access
- `UserService.java` - User operations
- `UserRegistrationDto.java` - Registration request
- `UserResponseDto.java` - User response model

### Product Management Feature
- `Product.java` - Product entity
- `Category.java` - Category entity
- `ProductRepository.java` - Product data access
- `CategoryRepository.java` - Category data access
- `ProductService.java` - Product operations
- `CategoryService.java` - Category operations
- `ProductController.java` - Product endpoints
- `CategoryController.java` - Category endpoints
- Various Product DTOs

### Shopping Cart Feature
- `CartItem.java` - Cart item entity
- `CartItemRepository.java` - Cart data access
- `CartService.java` - Shopping cart operations
- `CartController.java` - Cart endpoints
- Cart DTOs

### Order Management Feature
- `Order.java` - Order entity
- `OrderItem.java` - Order item entity
- `OrderRepository.java` - Order data access
- `OrderItemRepository.java` - Order item data access
- `OrderService.java` - Order operations
- `OrderController.java` - Order endpoints
- Order DTOs

### Review Management Feature
- `Review.java` - Review entity
- `ReviewRepository.java` - Review data access
- `ReviewService.java` - Review operations
- `ReviewController.java` - Review endpoints
- Review DTOs

## Dependency Hierarchy

```
Spring Boot Application
│
├── Spring Web (REST Controller)
│   └── Spring MVC
│
├── Spring Data JPA
│   ├── Hibernate ORM
│   └── MySQL Driver
│
├── Spring Security
│   ├── JWT Token Provider
│   └── Custom User Details Service
│
├── Lombok
│   └── Code Generation (@Data, @Builder, etc.)
│
└── Exception Handling
    └── Global Exception Handler
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    profile_image_url VARCHAR(500),
    role VARCHAR(20) NOT NULL,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Categories Table
```sql
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2),
    quantity INT NOT NULL,
    category_id BIGINT NOT NULL,
    seller_id BIGINT NOT NULL,
    image_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    active BOOLEAN DEFAULT true,
    rating_average DOUBLE,
    total_reviews BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (seller_id) REFERENCES users(id)
);
```

### Cart Items Table
```sql
CREATE TABLE cart_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Orders Table
```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(255) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2),
    tax_amount DECIMAL(10, 2),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    shipping_address VARCHAR(500),
    phone_number VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2),
    created_at TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    comment TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## API Endpoint Summary

| Method | Endpoint | Auth Required | Role |
|--------|----------|---------------|------|
| POST | /api/auth/register/customer | No | Public |
| POST | /api/auth/register/seller | No | Public |
| POST | /api/auth/login | No | Public |
| GET | /api/products | No | Public |
| GET | /api/products/{id} | No | Public |
| GET | /api/products/search | No | Public |
| POST | /api/products | Yes | SELLER, ADMIN |
| PUT | /api/products/{id} | Yes | SELLER, ADMIN |
| DELETE | /api/products/{id} | Yes | SELLER, ADMIN |
| GET | /api/categories | No | Public |
| POST | /api/categories | Yes | ADMIN |
| GET | /api/cart | Yes | Any |
| POST | /api/cart/add | Yes | Any |
| DELETE | /api/cart | Yes | Any |
| POST | /api/orders | Yes | Any |
| GET | /api/orders | Yes | Any |
| GET | /api/reviews | No | Public |
| POST | /api/reviews | Yes | Any |

## Coding Standards

### Naming Conventions
- Classes: PascalCase (e.g., `ProductService.java`)
- Methods: camelCase (e.g., `getProductById()`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_PRODUCTS_PER_PAGE`)
- Package: lowercase (e.g., `com.tammalls.api.service`)

### Annotations
- `@Service` - Business logic classes
- `@Repository` - Data access layer
- `@RestController` - REST endpoints
- `@Entity` - JPA entities
- `@Transactional` - Transaction management
- `@PreAuthorize` - Method-level security
- `@Data`, `@Builder`, `@RequiredArgsConstructor` - Lombok

### Code Organization
- Each class has single responsibility
- Services contain business logic
- Controllers handle HTTP requests/responses
- Repositories handle data access
- DTOs for request/response models
- Entities for database mapping

## Testing Structure

```
src/test/java/com/tammalls/api/
├── controller/
│   ├── AuthControllerTest.java
│   ├── ProductControllerTest.java
│   └── OrderControllerTest.java
├── service/
│   ├── ProductServiceTest.java
│   ├── OrderServiceTest.java
│   └── CartServiceTest.java
└── repository/
    ├── ProductRepositoryTest.java
    └── UserRepositoryTest.java
```

## Configuration Files

### application.yml Sections
- `spring.datasource` - Database connection
- `spring.jpa` - Hibernate configuration
- `spring.jackson` - JSON serialization
- `server` - Server port and context path
- `logging` - Log levels
- `app.jwt` - JWT configuration

## Build and Deployment

### Development Build
```bash
mvn clean install -DskipTests
```

### Production Build
```bash
mvn clean package -DskipTests
```

### Docker Deployment
```dockerfile
FROM openjdk:21-jdk
COPY target/tammalls-api-1.0.0.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## Performance Optimization Tips

1. **Database Indexing**: Add indexes on frequently searched columns
2. **Caching**: Implement Redis for category caching
3. **Pagination**: Always use paginated endpoints for large datasets
4. **Lazy Loading**: Configure lazy loading for entity relationships
5. **Query Optimization**: Use custom JPQL queries for complex operations
6. **API Rate Limiting**: Implement rate limiting for public endpoints

## Security Checklist

- ✅ Password encryption with BCrypt
- ✅ JWT token-based authentication
- ✅ Role-based access control
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configuration
- ✅ CSRF protection disabled (REST API)
- ✅ XSS protection via Spring Security
- ✅ Method-level security with @PreAuthorize
- ✅ Global exception handler (prevents information leakage)

---

This structure provides a scalable, maintainable, and production-ready Spring Boot REST API.
