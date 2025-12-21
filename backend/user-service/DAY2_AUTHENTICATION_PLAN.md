# 🔐 DAY 2: AUTHENTICATION LAYER - Implementation Plan

> **Date:** December 17, 2025  
> **Phase:** Day 2 - Security & Authentication  
> **Goal:** Implement JWT-based authentication with Spring Security  
> **Status:** 📋 PLANNING COMPLETE - Ready to Execute

---

## 🎯 OBJECTIVES

By end of Day 2, the User Service will have:
- ✅ JWT token generation and validation
- ✅ User registration with password hashing (BCrypt)
- ✅ User login with JWT response
- ✅ Secure REST endpoints with @PreAuthorize
- ✅ Global exception handling
- ✅ Request/Response DTOs with validation

---

## 📋 TASK BREAKDOWN (12 Files)

### Phase 2.1: Security Configuration (3 files - 2 hours)

**Task 2.1.1: Create SecurityConfig.java** ⏱️ 45 min
- **Goal:** Configure Spring Security with JWT filter
- **File:** `src/main/java/com/xupay/user/config/SecurityConfig.java`
- **Implementation:**
  - Disable CSRF (stateless JWT)
  - Configure CORS (allow frontend origins)
  - Set session management to STATELESS
  - Define public endpoints: `/api/auth/register`, `/api/auth/login`
  - Require authentication for all other endpoints
  - Add JWT filter before UsernamePasswordAuthenticationFilter
  - Configure BCryptPasswordEncoder bean
- **Test:** Application starts without errors

**Task 2.1.2: Create JwtConfig.java** ⏱️ 30 min
- **Goal:** Externalize JWT configuration properties
- **File:** `src/main/java/com/xupay/user/config/JwtConfig.java`
- **Implementation:**
  - @ConfigurationProperties(prefix = "jwt")
  - Properties: secret, expiration (24h), issuer, audience
  - Validation: secret must be at least 256 bits
- **Configuration in application.yml:**
  ```yaml
  jwt:
    secret: ${JWT_SECRET:your-256-bit-secret-key-change-in-production}
    expiration: 86400000 # 24 hours in milliseconds
    issuer: xupay-user-service
    audience: xupay-client
  ```
- **Test:** Properties load correctly on startup

**Task 2.1.3: Create JwtAuthenticationFilter.java** ⏱️ 45 min
- **Goal:** Extract and validate JWT from Authorization header
- **File:** `src/main/java/com/xupay/user/security/JwtAuthenticationFilter.java`
- **Implementation:**
  - Extends OncePerRequestFilter
  - Extract token from "Bearer {token}" header
  - Validate token using JwtService
  - Set SecurityContext with user details
  - Handle expired/invalid tokens gracefully
- **Test:** Protected endpoints reject requests without valid JWT

---

### Phase 2.2: JWT Service (1 file - 1.5 hours)

**Task 2.2.1: Create JwtService.java** ⏱️ 1.5 hours
- **Goal:** Generate, validate, and parse JWT tokens
- **File:** `src/main/java/com/xupay/user/service/JwtService.java`
- **Implementation:**
  - Use io.jsonwebtoken (JJWT library)
  - `generateToken(User user)` → Returns signed JWT
  - `validateToken(String token)` → Returns true/false
  - `getUserIdFromToken(String token)` → Extracts user ID claim
  - `getEmailFromToken(String token)` → Extracts email claim
  - `isTokenExpired(String token)` → Check expiration
  - Token claims: sub (user ID), email, roles, iat, exp, iss, aud
  - Sign with HMAC-SHA256 (HS256)
- **Test Cases:**
  - Generate token for test user
  - Validate valid token → true
  - Validate expired token → false
  - Extract user ID from token
  - Extract email from token

---

### Phase 2.3: Exception Handling (2 files - 1 hour)

**Task 2.3.1: Create Custom Exceptions** ⏱️ 30 min
- **Files:** `src/main/java/com/xupay/user/exception/`
  - `UserNotFoundException.java` - extends RuntimeException
  - `DuplicateEmailException.java` - extends RuntimeException
  - `DuplicatePhoneException.java` - extends RuntimeException
  - `InvalidCredentialsException.java` - extends RuntimeException
  - `AccountSuspendedException.java` - extends RuntimeException
- **Goal:** Type-safe exception handling

**Task 2.3.2: Create GlobalExceptionHandler.java** ⏱️ 30 min
- **Goal:** Centralized exception handling with proper HTTP status codes
- **File:** `src/main/java/com/xupay/user/exception/GlobalExceptionHandler.java`
- **Implementation:**
  - @RestControllerAdvice annotation
  - Handle custom exceptions:
    - UserNotFoundException → 404 NOT_FOUND
    - DuplicateEmailException → 409 CONFLICT
    - InvalidCredentialsException → 401 UNAUTHORIZED
    - AccountSuspendedException → 403 FORBIDDEN
  - Handle validation errors (@Valid) → 400 BAD_REQUEST
  - Handle generic exceptions → 500 INTERNAL_SERVER_ERROR
  - Return ErrorResponse DTO (timestamp, status, message, path)
- **Test:** Trigger exception and verify proper error response

---

### Phase 2.4: DTOs (Request/Response) (4 files - 1.5 hours)

**Task 2.4.1: Create Request DTOs** ⏱️ 45 min
- **Files:** `src/main/java/com/xupay/user/dto/request/`
  - `RegisterRequest.java`:
    - email (required, @Email)
    - password (required, @Size(min=8))
    - firstName (required)
    - lastName (required)
    - phone (optional, @Pattern for phone format)
    - dateOfBirth (optional)
  - `LoginRequest.java`:
    - email (required, @Email)
    - password (required)
- **Implementation:**
  - Use Jakarta validation annotations
  - @NotNull, @NotBlank, @Email, @Size, @Pattern
  - Record classes for immutability

**Task 2.4.2: Create Response DTOs** ⏱️ 45 min
- **Files:** `src/main/java/com/xupay/user/dto/response/`
  - `AuthResponse.java`:
    - token (JWT string)
    - tokenType ("Bearer")
    - expiresIn (seconds)
    - userId
    - email
  - `UserResponse.java`:
    - id
    - email
    - firstName
    - lastName
    - phone
    - kycStatus
    - kycTier
    - isActive
    - createdAt
  - `ErrorResponse.java`:
    - timestamp
    - status (HTTP status code)
    - error (status text)
    - message (error description)
    - path (request URI)
- **Implementation:**
  - Record classes for immutability
  - No sensitive data (no password, no hashed password)

---

### Phase 2.5: Authentication Service (2 files - 2 hours)

**Task 2.5.1: Create AuthService Interface & Implementation** ⏱️ 2 hours
- **Files:** 
  - `src/main/java/com/xupay/user/service/AuthService.java` (interface)
  - `src/main/java/com/xupay/user/service/impl/AuthServiceImpl.java` (implementation)
- **Goal:** Business logic for registration and login
- **Methods:**
  - `register(RegisterRequest request)` → AuthResponse
    - Validate email not already registered
    - Validate phone not already registered (if provided)
    - Hash password with BCrypt
    - Create User entity with default values:
      - kycStatus = PENDING
      - kycTier = TIER_0
      - isActive = true
      - fraudScore = 0
    - Create UserPreference with defaults
    - Save both entities
    - Generate JWT token
    - Return AuthResponse
  - `login(LoginRequest request)` → AuthResponse
    - Find user by email
    - Verify password with BCrypt
    - Check if account is active
    - Check if account is not suspended
    - Update lastLogin timestamp
    - Update lastLoginIp (from request context)
    - Generate JWT token
    - Return AuthResponse
  - `validateToken(String token)` → Boolean
    - Delegate to JwtService
  - `getUserFromToken(String token)` → User
    - Extract user ID from token
    - Load user from database
- **Error Handling:**
  - Throw DuplicateEmailException if email exists
  - Throw DuplicatePhoneException if phone exists
  - Throw InvalidCredentialsException if login fails
  - Throw AccountSuspendedException if account suspended
- **Test Cases:**
  - Register new user successfully
  - Register duplicate email → DuplicateEmailException
  - Login with correct credentials → JWT token
  - Login with wrong password → InvalidCredentialsException
  - Login with non-existent email → InvalidCredentialsException

---

### Phase 2.6: Authentication Controller (1 file - 1 hour)

**Task 2.6.1: Create AuthController.java** ⏱️ 1 hour
- **Goal:** REST API endpoints for authentication
- **File:** `src/main/java/com/xupay/user/controller/AuthController.java`
- **Implementation:**
  - @RestController
  - @RequestMapping("/api/auth")
  - @Validated for DTO validation
  
  **Endpoints:**
  - `POST /api/auth/register` (public)
    - Request body: RegisterRequest
    - Response: AuthResponse (201 CREATED)
    - Validation: @Valid on request body
  
  - `POST /api/auth/login` (public)
    - Request body: LoginRequest
    - Response: AuthResponse (200 OK)
    - Validation: @Valid on request body
  
  - `POST /api/auth/logout` (protected)
    - Response: 204 NO_CONTENT
    - Note: JWT is stateless, actual logout handled client-side
  
  - `GET /api/auth/validate` (protected)
    - Response: 200 OK if token valid
    - Used by API Gateway to validate JWT
  
  - `GET /api/auth/me` (protected)
    - Response: UserResponse
    - Returns current authenticated user's profile
- **Test with Postman/cURL:**
  ```bash
  # Register
  curl -X POST http://localhost:8081/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password123","firstName":"John","lastName":"Doe"}'
  
  # Login
  curl -X POST http://localhost:8081/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password123"}'
  
  # Get current user
  curl -X GET http://localhost:8081/api/auth/me \
    -H "Authorization: Bearer {token}"
  ```

---

## 🧪 TESTING CHECKLIST

### Unit Tests
- [ ] JwtService token generation
- [ ] JwtService token validation
- [ ] JwtService expired token detection
- [ ] AuthService user registration
- [ ] AuthService login with valid credentials
- [ ] AuthService login with invalid credentials

### Integration Tests
- [ ] POST /api/auth/register → 201 CREATED
- [ ] POST /api/auth/register with duplicate email → 409 CONFLICT
- [ ] POST /api/auth/login → 200 OK with JWT token
- [ ] POST /api/auth/login with wrong password → 401 UNAUTHORIZED
- [ ] GET /api/auth/me without token → 401 UNAUTHORIZED
- [ ] GET /api/auth/me with valid token → 200 OK

### Manual Tests
- [ ] Register new user via Postman
- [ ] Login and receive JWT token
- [ ] Access protected endpoint with token
- [ ] Access protected endpoint without token → 401
- [ ] Access protected endpoint with expired token → 401

---

## 📊 SUCCESS CRITERIA (Definition of Done)

✅ **Day 2 is complete when:**
1. User can register with email/password
2. User can login and receive JWT token
3. JWT token is validated on protected endpoints
4. Password is hashed with BCrypt (never stored plain text)
5. All endpoints return proper HTTP status codes
6. Exception handling works globally
7. All 12 files compile without errors
8. Basic Postman/cURL tests pass
9. Security configuration allows public access to `/api/auth/register` and `/api/auth/login`
10. All other endpoints require valid JWT token

---

## 🔄 EXECUTION WORKFLOW

```
Step 1: Create Security Config (SecurityConfig, JwtConfig, JwtAuthenticationFilter)
  └─> Test: Application starts, endpoints are protected

Step 2: Create JWT Service
  └─> Test: Generate token, validate token

Step 3: Create Exception Handling
  └─> Test: Trigger custom exception, verify error response

Step 4: Create DTOs (Request/Response)
  └─> Test: Validation annotations work

Step 5: Create Auth Service
  └─> Test: Register user, login user

Step 6: Create Auth Controller
  └─> Test: All endpoints via Postman
```

---

## 📝 DEPENDENCIES ALREADY IN pom.xml

✅ Already configured:
- Spring Security (spring-boot-starter-security)
- JWT (io.jsonwebtoken:jjwt-api, jjwt-impl, jjwt-jackson)
- Validation (spring-boot-starter-validation)
- Lombok (code generation)

---
