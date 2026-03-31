# TamMalls API - Setup & Installation Guide

## Prerequisites

Ensure you have the following installed on your system:

- **Java 21 JDK** - [Download](https://www.oracle.com/java/technologies/downloads/#java21)
- **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/mysql/)
- **Maven 3.8+** - [Download](https://maven.apache.org/download.cgi)
- **Git** - [Download](https://git-scm.com/)
- **IDE** - IntelliJ IDEA or VS Code with Java extensions

## Step-by-Step Installation

### 1. Database Setup

#### On Windows (Command Prompt as Administrator)

```bash
# Start MySQL Server
net start MySQL80

# Connect to MySQL
mysql -u root -p

# In MySQL CLI:
CREATE DATABASE tammalls_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'tammalls_user'@'localhost' IDENTIFIED BY 'tammalls_password';

GRANT ALL PRIVILEGES ON tammalls_db.* TO 'tammalls_user'@'localhost';

FLUSH PRIVILEGES;

EXIT;
```

#### On Linux/Mac

```bash
# Start MySQL Server
sudo systemctl start mysql

# Or using Homebrew (Mac)
brew services start mysql

# Connect to MySQL
mysql -u root -p

# In MySQL CLI:
CREATE DATABASE tammalls_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tammalls_user'@'localhost' IDENTIFIED BY 'tammalls_password';
GRANT ALL PRIVILEGES ON tammalls_db.* TO 'tammalls_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Project Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/tammalls-api.git
cd tammalls-api

# Create the directory structure
mkdir -p src/main/java/com/tammalls/api/{config,controller,service,entity,repository,dto,security,exception}
mkdir -p src/main/resources
mkdir -p src/test/java/com/tammalls/api
```

### 3. Copy Source Files

Place the Java files in their respective directories:

```
src/main/java/com/tammalls/api/
├── TammallsApiApplication.java
├── config/
│   ├── SecurityConfig.java
│   ├── JwtAuthenticationEntryPoint.java
│   └── JwtAccessDeniedHandler.java
├── controller/
│   ├── AuthController.java
│   ├── ProductController.java
│   ├── CartController.java
│   ├── OrderController.java
│   ├── ReviewController.java
│   └── CategoryController.java
├── service/
│   ├── AuthService.java
│   ├── UserService.java
│   ├── ProductService.java
│   ├── CartService.java
│   ├── OrderService.java
│   ├── ReviewService.java
│   └── CategoryService.java
├── entity/
│   ├── User.java
│   ├── Category.java
│   ├── Product.java
│   ├── CartItem.java
│   ├── Order.java
│   ├── OrderItem.java
│   └── Review.java
├── repository/
│   ├── UserRepository.java
│   ├── CategoryRepository.java
│   ├── ProductRepository.java
│   ├── CartItemRepository.java
│   ├── OrderRepository.java
│   ├── OrderItemRepository.java
│   └── ReviewRepository.java
├── dto/ (All DTO classes)
├── security/
│   ├── JwtTokenProvider.java
│   ├── CustomUserDetailsService.java
│   └── JwtAuthenticationFilter.java
└── exception/
    ├── GlobalExceptionHandler.java
    └── ResourceNotFoundException.java
```

### 4. Configuration File

Create `src/main/resources/application.yml`:

```yaml
spring:
  application:
    name: tammalls-api

  datasource:
    url: jdbc:mysql://localhost:3306/tammalls_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: tammalls_user
    password: tammalls_password
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: create
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
        format_sql: true
    show-sql: false
    open-in-view: false

  jackson:
    default-property-inclusion: non_null
    serialization:
      write-dates-as-timestamps: false
      indent-output: true
    time-zone: UTC

server:
  port: 8080
  servlet:
    context-path: /api

logging:
  level:
    root: INFO
    com.tammalls: DEBUG
    org.springframework.web: DEBUG
    org.hibernate.SQL: DEBUG

app:
  jwt:
    secret: your-256-bit-secret-key-change-this-in-production-must-be-at-least-256-bits-long-please-use-a-secure-random-string
    expiration: 86400000
```

### 5. Maven Build

```bash
# Install dependencies
mvn clean install

# Compile the project
mvn compile

# Run tests
mvn test

# Build the application
mvn clean package
```

### 6. Run the Application

```bash
# Using Maven
mvn spring-boot:run

# Or using JAR file
java -jar target/tammalls-api-1.0.0.jar
```

The application will start on `http://localhost:8080/api`

## Verification

### Check if Application Started Successfully

```
Visit: http://localhost:8080/api/categories

Expected Response:
[]

This means the API is running correctly!
```

### Test API Endpoint

```bash
# Register a customer
curl -X POST http://localhost:8080/api/auth/register/customer \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+855123456789"
  }'

# Expected Response:
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER"
  },
  "tokenType": "Bearer"
}
```

## IntelliJ IDEA Setup

1. **Open Project**
   - File → Open → Select project folder
   - Select "Maven" when prompted

2. **Configure SDK**
   - File → Project Structure → Project
   - Set Project SDK to Java 21
   - Set Language Level to 21

3. **Enable Annotations**
   - File → Settings → Build, Execution, Deployment → Compiler → Annotation Processors
   - Enable annotation processing
   - Check "Obtain processors from project classpath"

4. **Run Configuration**
   - Run → Edit Configurations
   - Add New Configuration → Spring Boot
   - Main class: `com.tammalls.api.TammallsApiApplication`
   - Click Run

## VS Code Setup

1. **Install Extensions**
   - Extension Pack for Java
   - Spring Boot Extension Pack
   - REST Client

2. **Configure Java**
   - Command Palette (Ctrl+Shift+P)
   - Type "Java: Configure Runtime"
   - Select Java 21

3. **Run Application**
   - Click Run button in top-right corner
   - Or press Ctrl+Shift+D

## Development Tools

### Using REST Client Extension in VS Code

Create a file `requests.http`:

```http
### Variables
@baseUrl = http://localhost:8080/api
@token = your-jwt-token-here

### Register Customer
POST {{baseUrl}}/auth/register/customer
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+855123456789"
}

### Login
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}

### Get All Products
GET {{baseUrl}}/products

### Get Categories
GET {{baseUrl}}/categories
```

### Using Postman

1. Import the API collection
2. Create environment variables:
   - `baseUrl`: http://localhost:8080/api
   - `token`: (filled after login)

3. Use pre-request script to update token:
```javascript
pm.environment.set("token", pm.response.json().token);
```

## Troubleshooting

### Issue: "Connection refused" to MySQL

**Solution:**
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Verify connection
mysql -u tammalls_user -p tammalls_db
```

### Issue: "Port 8080 already in use"

**Solution:**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

Or change port in `application.yml`:
```yaml
server:
  port: 8081
```

### Issue: "JWT authentication failed"

**Solution:**
- Ensure JWT secret is at least 256 bits
- Check token is passed in Authorization header
- Format: `Authorization: Bearer <token>`

### Issue: "Hibernate validation errors"

**Solution:**
- Run with `ddl-auto: create` first
- Then change to `ddl-auto: update`
- Ensure all @Column annotations are correct

## Database Maintenance

### Reset Database

```bash
mysql -u tammalls_user -p tammalls_db < /dev/null

# Or using MySQL CLI
DROP DATABASE tammalls_db;
CREATE DATABASE tammalls_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Backup Database

```bash
# Windows
mysqldump -u tammalls_user -p tammalls_db > backup.sql

# Linux/Mac
mysqldump -u tammalls_user -p tammalls_db > backup.sql
```

### Restore Database

```bash
mysql -u tammalls_user -p tammalls_db < backup.sql
```

## Environment Variables (Optional)

Create `.env` file:

```properties
DB_URL=jdbc:mysql://localhost:3306/tammalls_db
DB_USER=tammalls_user
DB_PASSWORD=tammalls_password
JWT_SECRET=your-256-bit-secret-key
JWT_EXPIRATION=86400000
SERVER_PORT=8080
```

## Docker Setup (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: tammalls_mysql
    environment:
      MYSQL_DATABASE: tammalls_db
      MYSQL_USER: tammalls_user
      MYSQL_PASSWORD: tammalls_password
      MYSQL_ROOT_PASSWORD: root_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  api:
    build: .
    container_name: tammalls_api
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/tammalls_db
      SPRING_DATASOURCE_USERNAME: tammalls_user
      SPRING_DATASOURCE_PASSWORD: tammalls_password
    depends_on:
      - mysql

volumes:
  mysql_data:
```

Run with Docker:
```bash
docker-compose up -d
```

## Continuous Integration (GitHub Actions)

Create `.github/workflows/ci.yml`:

```yaml
name: CI Pipeline

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_DATABASE: tammalls_db
          MYSQL_USER: tammalls_user
          MYSQL_PASSWORD: tammalls_password
          MYSQL_ROOT_PASSWORD: root_password
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5
        ports:
          - 3306:3306

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '21'
          distribution: 'temurin'
      
      - name: Build with Maven
        run: mvn clean package
      
      - name: Run Tests
        run: mvn test
```

## Performance Tuning

### JVM Arguments

```bash
java -Xmx512m -Xms256m -jar target/tammalls-api-1.0.0.jar
```

### Database Connection Pool

Add to `application.yml`:
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 20000
```

### Caching (Optional)

Add Redis dependency and configure caching for categories:

```yaml
spring:
  redis:
    host: localhost
    port: 6379
  cache:
    type: redis
```

## Deployment to Production

### Build Docker Image

```bash
mvn clean package -DskipTests
docker build -t tammalls-api:1.0.0 .
```

### Push to Docker Hub

```bash
docker tag tammalls-api:1.0.0 yourusername/tammalls-api:1.0.0
docker push yourusername/tammalls-api:1.0.0
```

### Deploy to Server

```bash
docker pull yourusername/tammalls-api:1.0.0
docker run -d -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://db-host:3306/tammalls_db \
  -e SPRING_DATASOURCE_USERNAME=tammalls_user \
  -e SPRING_DATASOURCE_PASSWORD=tammalls_password \
  yourusername/tammalls-api:1.0.0
```

## Next Steps

1. ✅ Install and run the application
2. Create user accounts (customer, seller, admin)
3. Add sample products and categories
4. Test all API endpoints
5. Implement frontend (React, Vue, or Angular)
6. Set up payment gateway
7. Configure email notifications
8. Implement logging and monitoring
9. Set up CI/CD pipeline
10. Deploy to production

## Support & Documentation

- **API Documentation**: See README.md
- **Project Structure**: See PROJECT_STRUCTURE.md
- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **Spring Data JPA**: https://spring.io/projects/spring-data-jpa
- **Spring Security**: https://spring.io/projects/spring-security

---

Happy coding! 🚀
