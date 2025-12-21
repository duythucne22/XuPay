# USER SERVICE IMPLEMENTATION ROADMAP
> **Created:** December 17, 2025  
> **Service:** User Service (Java Spring Boot 3.4.1)  
> **Port:** 8081 (HTTP), 9091 (gRPC)  
> **Database:** user_db (PostgreSQL 15+)

---

## 📊 OVERVIEW

The User Service manages user identity, authentication, KYC verification, and transaction limits. It exposes both REST APIs (for client) and gRPC server (for Payment Service).

**Core Responsibilities:**
1. User registration and authentication (JWT)
2. KYC document upload and verification workflow
3. Transaction limit checks (called by Payment Service via gRPC)
4. User profile management
5. Contact list management

---

## 📁 COMPLETE DIRECTORY STRUCTURE

```
user-service/
├── pom.xml                           ✅ EXISTS
├── Dockerfile                        ❌ TO CREATE
├── .dockerignore                     ❌ TO CREATE
├── README.md                         ❌ TO CREATE
│
├── src/
│   ├── main/
│   │   ├── java/com/xupay/user/
│   │   │   ├── UserServiceApplication.java          ❌ TO CREATE (main)
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java              ❌ JWT + BCrypt config
│   │   │   │   ├── JwtConfig.java                   ❌ JWT secret, expiration
│   │   │   │   ├── OpenApiConfig.java               ❌ Swagger docs config
│   │   │   │   └── DatabaseConfig.java              ❌ JPA, Flyway config
│   │   │   │
│   │   │   ├── entity/
│   │   │   │   ├── User.java                        ❌ JPA entity
│   │   │   │   ├── KycDocument.java                 ❌ JPA entity
│   │   │   │   ├── TransactionLimit.java            ❌ JPA entity
│   │   │   │   ├── DailyUsage.java                  ❌ JPA entity
│   │   │   │   ├── UserContact.java                 ❌ JPA entity
│   │   │   │   ├── UserPreference.java              ❌ JPA entity
│   │   │   │   └── enums/
│   │   │   │       ├── KycStatus.java               ❌ Enum
│   │   │   │       ├── KycTier.java                 ❌ Enum
│   │   │   │       └── DocumentType.java            ❌ Enum
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java              ❌ Spring Data JPA
│   │   │   │   ├── KycDocumentRepository.java       ❌ Spring Data JPA
│   │   │   │   ├── TransactionLimitRepository.java  ❌ Spring Data JPA
│   │   │   │   ├── DailyUsageRepository.java        ❌ Spring Data JPA + custom
│   │   │   │   ├── UserContactRepository.java       ❌ Spring Data JPA
│   │   │   │   └── UserPreferenceRepository.java    ❌ Spring Data JPA
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   ├── request/
│   │   │   │   │   ├── RegisterRequest.java         ❌ User registration
│   │   │   │   │   ├── LoginRequest.java            ❌ Login
│   │   │   │   │   ├── UpdateProfileRequest.java    ❌ Profile update
│   │   │   │   │   ├── UploadKycDocumentRequest.java ❌ KYC upload
│   │   │   │   │   └── AddContactRequest.java       ❌ Add contact
│   │   │   │   └── response/
│   │   │   │       ├── AuthResponse.java            ❌ JWT token response
│   │   │   │       ├── UserResponse.java            ❌ User details
│   │   │   │       ├── UserLimitsResponse.java      ❌ Transaction limits
│   │   │   │       ├── KycDocumentResponse.java     ❌ KYC doc status
│   │   │   │       └── ErrorResponse.java           ❌ Standard error format
│   │   │   │
│   │   │   ├── mapper/
│   │   │   │   ├── UserMapper.java                  ❌ MapStruct interface
│   │   │   │   ├── KycDocumentMapper.java           ❌ MapStruct interface
│   │   │   │   └── UserContactMapper.java           ❌ MapStruct interface
│   │   │   │
│   │   │   ├── service/
│   │   │   │   ├── UserService.java                 ❌ Interface
│   │   │   │   ├── impl/
│   │   │   │   │   └── UserServiceImpl.java         ❌ Implementation
│   │   │   │   ├── AuthService.java                 ❌ Interface
│   │   │   │   ├── impl/
│   │   │   │   │   └── AuthServiceImpl.java         ❌ JWT generation/validation
│   │   │   │   ├── KycService.java                  ❌ Interface
│   │   │   │   ├── impl/
│   │   │   │   │   └── KycServiceImpl.java          ❌ KYC workflow
│   │   │   │   ├── LimitService.java                ❌ Interface
│   │   │   │   ├── impl/
│   │   │   │   │   └── LimitServiceImpl.java        ❌ Transaction limits
│   │   │   │   └── JwtService.java                  ❌ JWT utility service
│   │   │   │
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java              ❌ /api/auth/** endpoints
│   │   │   │   ├── UserController.java              ❌ /api/users/** endpoints
│   │   │   │   ├── KycController.java               ❌ /api/kyc/** endpoints
│   │   │   │   ├── ContactController.java           ❌ /api/contacts/** endpoints
│   │   │   │   └── HealthController.java            ❌ /health endpoint
│   │   │   │
│   │   │   ├── grpc/
│   │   │   │   ├── UserServiceGrpcImpl.java         ❌ gRPC server impl
│   │   │   │   └── interceptor/
│   │   │   │       └── GrpcExceptionInterceptor.java ❌ Error handling
│   │   │   │
│   │   │   ├── security/
│   │   │   │   ├── JwtAuthenticationFilter.java     ❌ JWT filter
│   │   │   │   ├── JwtAuthenticationEntryPoint.java ❌ 401 handler
│   │   │   │   └── UserDetailsServiceImpl.java      ❌ Load user by email
│   │   │   │
│   │   │   ├── exception/
│   │   │   │   ├── GlobalExceptionHandler.java      ❌ @ControllerAdvice
│   │   │   │   ├── UserNotFoundException.java       ❌ Custom exception
│   │   │   │   ├── KycNotApprovedException.java     ❌ Custom exception
│   │   │   │   ├── DailyLimitExceededException.java ❌ Custom exception
│   │   │   │   └── InvalidCredentialsException.java ❌ Custom exception
│   │   │   │
│   │   │   └── util/
│   │   │       ├── PasswordEncoder.java             ❌ BCrypt wrapper
│   │   │       └── ValidationUtils.java             ❌ Email, phone validation
│   │   │
│   │   ├── proto/
│   │   │   └── user_service.proto                   ❌ TO CREATE (gRPC contract)
│   │   │
│   │   └── resources/
│   │       ├── application.yml                      ❌ TO CREATE (main config)
│   │       ├── application-dev.yml                  ❌ TO CREATE (dev profile)
│   │       ├── application-prod.yml                 ❌ TO CREATE (prod profile)
│   │       └── db/migration/
│   │           └── V1__complete_user_schema.sql     ✅ EXISTS
│   │
│   └── test/
│       └── java/com/xupay/user/
│           ├── UserServiceApplicationTests.java     ❌ Integration test
│           ├── controller/
│           │   ├── AuthControllerTest.java          ❌ REST API test
│           │   ├── UserControllerTest.java          ❌ REST API test
│           │   └── KycControllerTest.java           ❌ REST API test
│           ├── service/
│           │   ├── UserServiceTest.java             ❌ Unit test
│           │   ├── AuthServiceTest.java             ❌ Unit test
│           │   └── KycServiceTest.java              ❌ Unit test
│           ├── repository/
│           │   └── UserRepositoryTest.java          ❌ JPA test
│           └── grpc/
│               └── UserServiceGrpcTest.java         ❌ gRPC test
│
└── target/                                          (generated by Maven)
```

**File Count:**
- ✅ Exists: 2 files (pom.xml, V1 schema)
- ❌ To Create: **70+ files**

---

## 🚀 IMPLEMENTATION PHASES (4 Days)

### Phase 1: Foundation (Day 1)
**Goal:** Project boots successfully with database connection

#### Step 1.1: Main Application Class
**File:** `UserServiceApplication.java`
```java
package com.xupay.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
```

#### Step 1.2: Application Configuration
**File:** `application.yml`
```yaml
spring:
  application:
    name: user-service
  
  datasource:
    url: jdbc:postgresql://localhost:5432/user_db
    username: user_service_user
    password: UserS3rv1c3P@ss2025!
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  
  flyway:
    enabled: true
    baseline-on-migrate: true
    locations: classpath:db/migration

server:
  port: 8081

grpc:
  server:
    port: 9091

jwt:
  secret: ${JWT_SECRET:YourSuperSecretJWTKeyForProductionUseAtLeast256BitsChangeThis2025!}
  expiration: 86400000  # 24 hours

logging:
  level:
    root: INFO
    com.xupay: DEBUG
```

#### Step 1.3: JPA Entities (6 files)
**Priority Order:**
1. `User.java` - Core entity
2. `KycDocument.java`
3. `TransactionLimit.java`
4. `DailyUsage.java`
5. `UserContact.java`
6. `UserPreference.java`

**Example:** `User.java`
```java
package com.xupay.user.entity;

import com.xupay.user.entity.enums.KycStatus;
import com.xupay.user.entity.enums.KycTier;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false, unique = true, length = 255)
    private String email;
    
    @Column(unique = true, length = 20)
    private String phone;
    
    @Column(nullable = false, length = 100)
    private String firstName;
    
    @Column(nullable = false, length = 100)
    private String lastName;
    
    private LocalDate dateOfBirth;
    
    @Column(length = 3)
    private String nationality;  // ISO 3166-1 alpha-3
    
    @Column(nullable = false, length = 255)
    private String passwordHash;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private KycStatus kycStatus = KycStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private KycTier kycTier = KycTier.TIER_0;
    
    private ZonedDateTime kycVerifiedAt;
    
    private UUID kycVerifiedBy;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(nullable = false)
    private Boolean isSuspended = false;
    
    @Column(columnDefinition = "TEXT")
    private String suspensionReason;
    
    @Column(nullable = false)
    private Integer fraudScore = 0;
    
    @Column(columnDefinition = "inet")
    private String ipAddressRegistration;
    
    @Column(columnDefinition = "TEXT")
    private String userAgentRegistration;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private ZonedDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private ZonedDateTime updatedAt;
    
    private ZonedDateTime lastLoginAt;
}
```

#### Step 1.4: Repositories (6 files)
**Example:** `UserRepository.java`
```java
package com.xupay.user.repository;

import com.xupay.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByPhone(String phone);
    
    boolean existsByEmail(String email);
    
    boolean existsByPhone(String phone);
    
    @Query(value = "SELECT can_user_transact(:userId, :amountCents)", 
           nativeQuery = true)
    Boolean canUserTransact(UUID userId, Long amountCents);
}
```

**Test:** `mvn clean install` → Should pass with green tests

---

### Phase 2: Authentication & Authorization (Day 2)
**Goal:** User can register, login, get JWT token

#### Step 2.1: Security Configuration
**Files:**
1. `SecurityConfig.java` - Spring Security setup
2. `JwtConfig.java` - JWT properties
3. `JwtService.java` - Token generation/validation
4. `JwtAuthenticationFilter.java` - JWT filter
5. `UserDetailsServiceImpl.java` - Load user for auth

#### Step 2.2: Auth Service
**Files:**
1. `AuthService.java` (interface)
2. `AuthServiceImpl.java` (implementation)

**Key Methods:**
```java
public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    void logout(String token);
    AuthResponse refreshToken(String refreshToken);
}
```

#### Step 2.3: Auth Controller
**File:** `AuthController.java`

**Endpoints:**
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
```

**Test:** Use Postman to register and login

---

### Phase 3: KYC & User Management (Day 3)
**Goal:** KYC workflow + user profile management

#### Step 3.1: KYC Service
**Files:**
1. `KycService.java` (interface)
2. `KycServiceImpl.java` (implementation)

**Key Methods:**
```java
public interface KycService {
    KycDocumentResponse uploadDocument(UUID userId, UploadKycDocumentRequest request);
    List<KycDocumentResponse> getUserDocuments(UUID userId);
    KycDocumentResponse verifyDocument(UUID documentId, UUID adminId, boolean approved, String reason);
    void updateUserKycTier(UUID userId, KycTier newTier);
}
```

#### Step 3.2: User Service
**Files:**
1. `UserService.java` (interface)
2. `UserServiceImpl.java` (implementation)

**Key Methods:**
```java
public interface UserService {
    UserResponse getUserById(UUID userId);
    UserResponse updateProfile(UUID userId, UpdateProfileRequest request);
    void suspendUser(UUID userId, String reason);
    void activateUser(UUID userId);
    UserLimitsResponse getUserLimits(UUID userId);
}
```

#### Step 3.3: Controllers
**Files:**
1. `UserController.java` - User CRUD
2. `KycController.java` - KYC workflow
3. `ContactController.java` - Contact management

**Test:** Upload KYC document, verify as admin

---

### Phase 4: gRPC Server (Day 4)
**Goal:** Payment Service can call User Service via gRPC

#### Step 4.1: Proto Definition
**File:** `user_service.proto`
```protobuf
syntax = "proto3";

package com.xupay.user;

option java_multiple_files = true;
option java_package = "com.xupay.user.grpc.proto";

service UserService {
  rpc CheckUserLimits(UserLimitsRequest) returns (UserLimitsResponse);
  rpc GetUserKyc(UserKycRequest) returns (UserKycResponse);
  rpc IncrementDailyUsage(IncrementUsageRequest) returns (IncrementUsageResponse);
}

message UserLimitsRequest {
  string user_id = 1;
  int64 amount_cents = 2;
}

message UserLimitsResponse {
  bool can_transact = 1;
  int64 daily_send_limit_cents = 2;
  int64 daily_sent_so_far_cents = 3;
  int64 remaining_limit_cents = 4;
  string kyc_tier = 5;
  string rejection_reason = 6;
}

message UserKycRequest {
  string user_id = 1;
}

message UserKycResponse {
  string kyc_status = 1;
  string kyc_tier = 2;
  bool is_active = 3;
  bool is_suspended = 4;
}

message IncrementUsageRequest {
  string user_id = 1;
  int64 amount_cents = 2;
  bool is_sent = 3;
}

message IncrementUsageResponse {
  bool success = 1;
  int64 new_daily_total_cents = 2;
}
```

#### Step 4.2: gRPC Service Implementation
**File:** `UserServiceGrpcImpl.java`
```java
package com.xupay.user.grpc;

import com.xupay.user.grpc.proto.*;
import com.xupay.user.service.LimitService;
import com.xupay.user.service.UserService;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;

import java.util.UUID;

@GrpcService
@RequiredArgsConstructor
@Slf4j
public class UserServiceGrpcImpl extends UserServiceGrpc.UserServiceImplBase {
    
    private final LimitService limitService;
    private final UserService userService;
    
    @Override
    public void checkUserLimits(UserLimitsRequest request, 
                                StreamObserver<UserLimitsResponse> responseObserver) {
        try {
            UUID userId = UUID.fromString(request.getUserId());
            Long amountCents = request.getAmountCents();
            
            var limits = limitService.checkUserLimits(userId, amountCents);
            
            UserLimitsResponse response = UserLimitsResponse.newBuilder()
                .setCanTransact(limits.isCanTransact())
                .setDailySendLimitCents(limits.getDailySendLimitCents())
                .setDailySentSoFarCents(limits.getDailySentSoFarCents())
                .setRemainingLimitCents(limits.getRemainingLimitCents())
                .setKycTier(limits.getKycTier())
                .setRejectionReason(limits.getRejectionReason() != null ? limits.getRejectionReason() : "")
                .build();
            
            responseObserver.onNext(response);
            responseObserver.onCompleted();
            
        } catch (Exception e) {
            log.error("Error checking user limits", e);
            responseObserver.onError(e);
        }
    }
    
    // Implement other RPC methods...
}
```

**Test:** Use BloomRPC or grpcurl to call gRPC methods

---

## 🔧 CRITICAL IMPLEMENTATION NOTES

### 1. Password Hashing
```java
@Component
public class PasswordEncoderService {
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
    
    public String encode(String rawPassword) {
        return encoder.encode(rawPassword);
    }
    
    public boolean matches(String rawPassword, String encodedPassword) {
        return encoder.matches(rawPassword, encodedPassword);
    }
}
```

### 2. JWT Generation
```java
public String generateToken(User user) {
    return Jwts.builder()
        .setSubject(user.getEmail())
        .claim("userId", user.getId().toString())
        .claim("kycTier", user.getKycTier().name())
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
        .signWith(getSigningKey(), SignatureAlgorithm.HS256)
        .compact();
}
```

### 3. Daily Usage Updates (CRITICAL)
```java
@Transactional
public void incrementDailyUsage(UUID userId, Long amountCents, boolean isSent) {
    // Use UPSERT pattern to avoid race conditions
    dailyUsageRepository.incrementUsage(userId, LocalDate.now(), amountCents, isSent);
}
```

---

## 📋 TESTING CHECKLIST

### Unit Tests (80+ tests)
- [ ] UserServiceTest - All CRUD operations
- [ ] AuthServiceTest - Register, login, JWT validation
- [ ] KycServiceTest - Document upload, verification
- [ ] LimitServiceTest - Can user transact logic

### Integration Tests (20+ tests)
- [ ] UserControllerTest - REST API endpoints
- [ ] AuthControllerTest - Login flow end-to-end
- [ ] UserServiceGrpcTest - gRPC calls
- [ ] UserRepositoryTest - Database queries

### Manual Testing (Postman)
- [ ] Register user → Receive JWT
- [ ] Login → Receive JWT
- [ ] Get user profile (with JWT)
- [ ] Upload KYC document
- [ ] Admin verify KYC → User tier upgraded
- [ ] Check user limits (gRPC call)

---

## ✅ DEFINITION OF DONE

User Service is complete when:
1. ✅ All 70+ files created
2. ✅ `mvn clean install` passes with 0 errors
3. ✅ Code coverage > 80%
4. ✅ Docker image builds successfully
5. ✅ Service starts in docker-compose
6. ✅ Health endpoint returns 200 OK
7. ✅ Swagger UI accessible at http://localhost:8081/swagger-ui.html
8. ✅ gRPC server responds on port 9091
9. ✅ Payment Service can call gRPC methods
10. ✅ All Postman tests pass

---

## 🚀 READY TO START?

**Next Command:**
```bash
cd backend/java-services/user-service
mvn clean install
```

**First File to Create:** `UserServiceApplication.java`

Let me know when you're ready to start implementation! 🎯
