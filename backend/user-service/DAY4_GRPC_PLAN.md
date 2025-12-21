# 🔌 DAY 4: gRPC SERVER - Implementation Plan

> **Date:** December 17, 2025  
> **Phase:** Day 4 - gRPC Service Layer  
> **Goal:** Expose User Service APIs via gRPC for Payment Service to consume  
> **Status:** 📋 READY TO EXECUTE

---

## 🎯 WHAT IS gRPC & WHY DO WE NEED IT?

### What is gRPC?
**gRPC** (Google Remote Procedure Call) is a high-performance, open-source RPC framework that uses:
- **Protocol Buffers (protobuf)** for serialization (binary format, faster than JSON)
- **HTTP/2** for transport (multiplexing, bidirectional streaming, header compression)
- **Strongly-typed contracts** via `.proto` files (prevents API drift)

### Why gRPC for Microservices?
```
┌────────────────────────────────────────────────────────┐
│         XuPay Microservices Communication              │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [Client Browser]                                      │
│         │                                              │
│         ▼ REST (JSON)                                  │
│  ┌──────────────┐                                      │
│  │ API Gateway  │                                      │
│  │   (NGINX)    │                                      │
│  └──────┬───────┘                                      │
│         │                                              │
│         ├────────► REST  ──────► User Service          │
│         │                        (Port 8081)           │
│         │                                              │
│         └────────► REST  ──────► Payment Service       │
│                                  (Port 8082)           │
│                                      │                 │
│                                      │                 │
│                        gRPC (Binary, HTTP/2)           │
│                                      │                 │
│                                      ▼                 │
│                          ┌──────────────────┐         │
│                          │  User Service    │         │
│                          │  gRPC Server     │         │
│                          │  (Port 50053)    │         │
│                          └──────────────────┘         │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Key Benefits:**
1. **Performance:** Binary serialization is 3-10x faster than JSON
2. **Type Safety:** Proto contracts prevent version mismatches
3. **Streaming:** Payment Service can stream real-time validation requests
4. **Low Latency:** HTTP/2 multiplexing reduces connection overhead
5. **Language Agnostic:** Java (User Service) ↔ Java (Payment Service) ↔ Go (Audit Service)

### Use Case in XuPay
**Payment Service needs to:**
- ✅ Validate user exists before processing payment
- ✅ Check user's KYC tier and transaction limits
- ✅ Verify user is active and not suspended
- ✅ Get user details for transaction records

**Why not REST?**
- REST is fine for client-facing APIs (browser)
- gRPC is better for service-to-service (Payment → User)
- Lower latency, smaller payload, type-safe contracts

---

## 📋 OBJECTIVES

By end of Day 4, the User Service will have:
- ✅ Protocol Buffer definitions (user_service.proto)
- ✅ Generated gRPC stubs (Java classes)
- ✅ gRPC service implementation (UserGrpcServiceImpl)
- ✅ JWT authentication interceptor (gRPC metadata validation)
- ✅ Error handling for gRPC exceptions
- ✅ gRPC server configuration (port 50053)

---

## 📁 FILES TO IMPLEMENT (10 Files)

### Phase 4.1: Protocol Buffer Definitions (1 file - 1 hour)

**File 1: user_service.proto** ⏱️ 1 hour
- **Path:** `src/main/proto/user_service.proto`
- **Purpose:** Define gRPC service contract
- **Implementation:**

```protobuf
syntax = "proto3";

option java_multiple_files = true;
option java_package = "com.xupay.user.grpc";
option java_outer_classname = "UserServiceProto";

package xupay.user;

// =====================================================
// USER SERVICE - gRPC API
// =====================================================
service UserService {
  // User validation (called by Payment Service before transaction)
  rpc ValidateUser(ValidateUserRequest) returns (ValidateUserResponse);
  
  // Get user details
  rpc GetUser(GetUserRequest) returns (GetUserResponse);
  
  // Check transaction limits
  rpc CheckTransactionLimit(CheckLimitRequest) returns (CheckLimitResponse);
  
  // Get user KYC status
  rpc GetKycStatus(GetKycStatusRequest) returns (GetKycStatusResponse);
  
  // Update daily usage (called after successful transaction)
  rpc RecordTransaction(RecordTransactionRequest) returns (RecordTransactionResponse);
}

// =====================================================
// REQUEST MESSAGES
// =====================================================

message ValidateUserRequest {
  string user_id = 1;  // UUID as string
  int64 amount_cents = 2;
  string transaction_type = 3;  // "send" or "receive"
}

message GetUserRequest {
  string user_id = 1;
}

message CheckLimitRequest {
  string user_id = 1;
  int64 amount_cents = 2;
  string transaction_type = 3;  // "send" or "receive"
}

message GetKycStatusRequest {
  string user_id = 1;
}

message RecordTransactionRequest {
  string user_id = 1;
  int64 amount_cents = 2;
  string transaction_type = 3;  // "send" or "receive"
  string transaction_id = 4;  // For idempotency
}

// =====================================================
// RESPONSE MESSAGES
// =====================================================

message ValidateUserResponse {
  bool is_valid = 1;
  string reason = 2;  // Empty if valid, error message if not
  UserInfo user = 3;
}

message GetUserResponse {
  UserInfo user = 1;
}

message CheckLimitResponse {
  bool allowed = 1;
  string reason = 2;
  int64 remaining_limit_cents = 3;
  int64 daily_limit_cents = 4;
}

message GetKycStatusResponse {
  string kyc_status = 1;  // PENDING, APPROVED, REJECTED
  string kyc_tier = 2;    // TIER_0, TIER_1, TIER_2, TIER_3
  int64 daily_send_limit_cents = 3;
  int64 daily_receive_limit_cents = 4;
}

message RecordTransactionResponse {
  bool success = 1;
  string message = 2;
}

// =====================================================
// COMMON MESSAGES
// =====================================================

message UserInfo {
  string user_id = 1;
  string email = 2;
  string first_name = 3;
  string last_name = 4;
  string phone = 5;
  string kyc_status = 6;
  string kyc_tier = 7;
  bool is_active = 8;
  bool is_suspended = 9;
  int32 fraud_score = 10;
}

// =====================================================
// ERROR HANDLING
// =====================================================
// gRPC uses standard status codes:
// - OK (0): Success
// - INVALID_ARGUMENT (3): Bad request (e.g., invalid UUID)
// - NOT_FOUND (5): User not found
// - PERMISSION_DENIED (7): User suspended/blocked
// - UNAVAILABLE (14): Service down
// - UNAUTHENTICATED (16): Invalid JWT in metadata
```

**Why these 5 RPCs?**
1. **ValidateUser** - Payment Service checks before initiating transaction
2. **GetUser** - Fetch full user details (for transaction records)
3. **CheckTransactionLimit** - Validate amount against tier limits
4. **GetKycStatus** - Quick KYC status lookup (for UI)
5. **RecordTransaction** - Update daily usage after transaction

---

### Phase 4.2: Maven Proto Plugin Configuration (1 file - 30 min)

**File 2: pom.xml (update)** ⏱️ 30 min
- **Path:** `pom.xml`
- **Purpose:** Add protobuf-maven-plugin to generate Java stubs
- **Add to `<build><plugins>`:**

```xml
<!-- Protocol Buffers Compiler -->
<plugin>
    <groupId>org.xolstice.maven.plugins</groupId>
    <artifactId>protobuf-maven-plugin</artifactId>
    <version>0.6.1</version>
    <configuration>
        <protocArtifact>com.google.protobuf:protoc:3.25.1:exe:${os.detected.classifier}</protocArtifact>
        <pluginId>grpc-java</pluginId>
        <pluginArtifact>io.grpc:protoc-gen-grpc-java:1.60.0:exe:${os.detected.classifier}</pluginArtifact>
        <protoSourceRoot>${project.basedir}/src/main/proto</protoSourceRoot>
    </configuration>
    <executions>
        <execution>
            <goals>
                <goal>compile</goal>
                <goal>compile-custom</goal>
            </goals>
        </execution>
    </executions>
</plugin>

<!-- OS Maven Plugin (required for protobuf-maven-plugin) -->
<plugin>
    <groupId>kr.motd.maven</groupId>
    <artifactId>os-maven-plugin</artifactId>
    <version>1.7.1</version>
    <executions>
        <execution>
            <phase>initialize</phase>
            <goals>
                <goal>detect</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

**Generated Files (auto-generated by Maven):**
- `target/generated-sources/protobuf/java/` → Request/Response message classes
- `target/generated-sources/protobuf/grpc-java/` → UserServiceGrpc.java stub

**Test:** Run `mvn clean compile` → Verify generated classes exist

---

### Phase 4.3: gRPC Service Implementation (1 file - 2 hours)

**File 3: UserGrpcServiceImpl.java** ⏱️ 2 hours
- **Path:** `src/main/java/com/xupay/user/grpc/UserGrpcServiceImpl.java`
- **Purpose:** Implement gRPC service methods
- **Dependencies:** UserRepository, LimitService, DailyUsageRepository
- **Key Methods:**

```java
@GrpcService
@RequiredArgsConstructor
@Slf4j
public class UserGrpcServiceImpl extends UserServiceGrpc.UserServiceImplBase {

    private final UserRepository userRepository;
    private final LimitService limitService;
    private final DailyUsageRepository dailyUsageRepository;

    @Override
    public void validateUser(ValidateUserRequest request, StreamObserver<ValidateUserResponse> responseObserver) {
        try {
            UUID userId = UUID.fromString(request.getUserId());
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> Status.NOT_FOUND
                            .withDescription("User not found: " + userId)
                            .asRuntimeException());

            // Check if user can transact
            if (!user.canTransact()) {
                ValidateUserResponse response = ValidateUserResponse.newBuilder()
                        .setIsValid(false)
                        .setReason("User cannot transact (suspended or KYC not approved)")
                        .build();
                responseObserver.onNext(response);
                responseObserver.onCompleted();
                return;
            }

            // Check transaction limits
            LimitCheckResponse limitCheck = limitService.checkTransactionAllowed(
                    userId, 
                    request.getAmountCents(), 
                    request.getTransactionType()
            );

            if (!limitCheck.allowed()) {
                ValidateUserResponse response = ValidateUserResponse.newBuilder()
                        .setIsValid(false)
                        .setReason(limitCheck.reason())
                        .build();
                responseObserver.onNext(response);
                responseObserver.onCompleted();
                return;
            }

            // All checks passed
            ValidateUserResponse response = ValidateUserResponse.newBuilder()
                    .setIsValid(true)
                    .setReason("")
                    .setUser(mapToUserInfo(user))
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
            
        } catch (IllegalArgumentException e) {
            responseObserver.onError(Status.INVALID_ARGUMENT
                    .withDescription("Invalid user ID format")
                    .asRuntimeException());
        } catch (Exception e) {
            log.error("Error validating user", e);
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Internal server error")
                    .asRuntimeException());
        }
    }

    @Override
    public void recordTransaction(RecordTransactionRequest request, StreamObserver<RecordTransactionResponse> responseObserver) {
        try {
            UUID userId = UUID.fromString(request.getUserId());
            
            // Update daily usage (thread-safe UPSERT)
            dailyUsageRepository.incrementUsage(
                    userId,
                    request.getAmountCents(),
                    request.getTransactionType()
            );

            RecordTransactionResponse response = RecordTransactionResponse.newBuilder()
                    .setSuccess(true)
                    .setMessage("Transaction recorded successfully")
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
            
        } catch (Exception e) {
            log.error("Error recording transaction", e);
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Failed to record transaction")
                    .asRuntimeException());
        }
    }

    private UserInfo mapToUserInfo(User user) {
        return UserInfo.newBuilder()
                .setUserId(user.getId().toString())
                .setEmail(user.getEmail())
                .setFirstName(user.getFirstName() != null ? user.getFirstName() : "")
                .setLastName(user.getLastName() != null ? user.getLastName() : "")
                .setPhone(user.getPhone() != null ? user.getPhone() : "")
                .setKycStatus(user.getKycStatus().name())
                .setKycTier(user.getKycTier().name())
                .setIsActive(user.getIsActive())
                .setIsSuspended(user.getIsSuspended())
                .setFraudScore(user.getFraudScore())
                .build();
    }
}
```

**Error Handling:**
- `Status.NOT_FOUND` → User doesn't exist
- `Status.PERMISSION_DENIED` → User suspended/blocked
- `Status.INVALID_ARGUMENT` → Bad request (invalid UUID)
- `Status.INTERNAL` → Unexpected server error

---

### Phase 4.4: gRPC Interceptors (2 files - 1.5 hours)

**File 4: JwtGrpcInterceptor.java** ⏱️ 1 hour
- **Path:** `src/main/java/com/xupay/user/grpc/interceptor/JwtGrpcInterceptor.java`
- **Purpose:** Validate JWT from gRPC metadata (Authorization header)
- **Implementation:**

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtGrpcInterceptor implements ServerInterceptor {

    private final JwtService jwtService;
    
    private static final Metadata.Key<String> AUTHORIZATION_METADATA_KEY = 
            Metadata.Key.of("Authorization", Metadata.ASCII_STRING_MARSHALLER);

    @Override
    public <ReqT, RespT> ServerCall.Listener<ReqT> interceptCall(
            ServerCall<ReqT, RespT> call,
            Metadata headers,
            ServerCallHandler<ReqT, RespT> next) {
        
        String authHeader = headers.get(AUTHORIZATION_METADATA_KEY);
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            call.close(Status.UNAUTHENTICATED
                    .withDescription("Missing or invalid Authorization header"), new Metadata());
            return new ServerCall.Listener<>() {};
        }
        
        String token = authHeader.substring(7);
        
        try {
            if (!jwtService.validateToken(token)) {
                call.close(Status.UNAUTHENTICATED
                        .withDescription("Invalid or expired JWT token"), new Metadata());
                return new ServerCall.Listener<>() {};
            }
            
            // Token is valid, proceed
            return next.startCall(call, headers);
            
        } catch (Exception e) {
            log.error("Error validating JWT in gRPC call", e);
            call.close(Status.UNAUTHENTICATED
                    .withDescription("JWT validation failed"), new Metadata());
            return new ServerCall.Listener<>() {};
        }
    }
}
```

**File 5: LoggingGrpcInterceptor.java** ⏱️ 30 min
- **Path:** `src/main/java/com/xupay/user/grpc/interceptor/LoggingGrpcInterceptor.java`
- **Purpose:** Log all gRPC calls (method name, duration, status)

```java
@Component
@Slf4j
public class LoggingGrpcInterceptor implements ServerInterceptor {

    @Override
    public <ReqT, RespT> ServerCall.Listener<ReqT> interceptCall(
            ServerCall<ReqT, RespT> call,
            Metadata headers,
            ServerCallHandler<ReqT, RespT> next) {
        
        String methodName = call.getMethodDescriptor().getFullMethodName();
        long startTime = System.currentTimeMillis();
        
        log.info("gRPC call started: {}", methodName);
        
        ServerCall<ReqT, RespT> wrappedCall = new ForwardingServerCall.SimpleForwardingServerCall<>(call) {
            @Override
            public void close(Status status, Metadata trailers) {
                long duration = System.currentTimeMillis() - startTime;
                log.info("gRPC call completed: {} | Status: {} | Duration: {}ms", 
                        methodName, status.getCode(), duration);
                super.close(status, trailers);
            }
        };
        
        return next.startCall(wrappedCall, headers);
    }
}
```

---

### Phase 4.5: gRPC Configuration (2 files - 1 hour)

**File 6: GrpcServerConfig.java** ⏱️ 45 min
- **Path:** `src/main/java/com/xupay/user/config/GrpcServerConfig.java`
- **Purpose:** Configure gRPC server with interceptors
- **Implementation:**

```java
@Configuration
@RequiredArgsConstructor
public class GrpcServerConfig {

    private final JwtGrpcInterceptor jwtInterceptor;
    private final LoggingGrpcInterceptor loggingInterceptor;

    @Bean
    public GlobalServerInterceptorConfigurer globalInterceptorConfigurer() {
        return registry -> {
            // Order matters: Logging first, then JWT validation
            registry.addServerInterceptors(loggingInterceptor);
            registry.addServerInterceptors(jwtInterceptor);
        };
    }
}
```

**File 7: application.yml (update)** ⏱️ 15 min
- **Path:** `src/main/resources/application.yml`
- **Already exists, verify gRPC config:**

```yaml
grpc:
  server:
    port: 50053
    enable-keep-alive: true
    keep-alive-time: 30m
    keep-alive-timeout: 10s
    max-inbound-message-size: 4194304  # 4MB
```

---

### Phase 4.6: Exception Handling (1 file - 30 min)

**File 8: GrpcExceptionHandler.java** ⏱️ 30 min
- **Path:** `src/main/java/com/xupay/user/grpc/exception/GrpcExceptionHandler.java`
- **Purpose:** Map Java exceptions to gRPC Status codes

```java
@Component
@Slf4j
public class GrpcExceptionHandler {

    public static StatusRuntimeException handleException(Exception e) {
        log.error("gRPC exception occurred", e);
        
        if (e instanceof UserNotFoundException) {
            return Status.NOT_FOUND
                    .withDescription("User not found: " + e.getMessage())
                    .asRuntimeException();
        }
        
        if (e instanceof IllegalArgumentException) {
            return Status.INVALID_ARGUMENT
                    .withDescription("Invalid request: " + e.getMessage())
                    .asRuntimeException();
        }
        
        if (e instanceof AccountSuspendedException) {
            return Status.PERMISSION_DENIED
                    .withDescription("Account suspended: " + e.getMessage())
                    .asRuntimeException();
        }
        
        // Generic fallback
        return Status.INTERNAL
                .withDescription("Internal server error")
                .asRuntimeException();
    }
}
```

---

### Phase 4.7: Integration Testing (2 files - 1.5 hours)

**File 9: UserGrpcServiceTest.java** ⏱️ 1 hour
- **Path:** `src/test/java/com/xupay/user/grpc/UserGrpcServiceTest.java`
- **Purpose:** Unit tests for gRPC service methods
- **Tests:**
  - ✅ ValidateUser with valid user → SUCCESS
  - ✅ ValidateUser with suspended user → PERMISSION_DENIED
  - ✅ ValidateUser with invalid UUID → INVALID_ARGUMENT
  - ✅ CheckTransactionLimit exceeds limit → allowed=false
  - ✅ RecordTransaction updates daily usage

**File 10: GrpcIntegrationTest.java** ⏱️ 30 min
- **Path:** `src/test/java/com/xupay/user/grpc/GrpcIntegrationTest.java`
- **Purpose:** End-to-end gRPC tests with real server
- **Setup:** @SpringBootTest with embedded gRPC server
- **Tests:**
  - ✅ Call ValidateUser from gRPC client
  - ✅ Verify JWT authentication works
  - ✅ Test error handling

---

## 🔄 WORKFLOW

### Step 1: Define Proto Contract
```bash
# Create proto file
mkdir -p src/main/proto
nano src/main/proto/user_service.proto
```

### Step 2: Generate Java Stubs
```bash
# Add Maven plugin to pom.xml
# Run code generation
mvn clean compile

# Verify generated files
ls -la target/generated-sources/protobuf/java/com/xupay/user/grpc/
```

### Step 3: Implement Service
```bash
# Create UserGrpcServiceImpl.java
# Implement 5 RPC methods
# Handle errors with Status codes
```

### Step 4: Add Interceptors
```bash
# JWT validation (check Authorization metadata)
# Logging (method name, duration)
```

### Step 5: Test
```bash
# Unit tests with @Mock
mvn test

# Integration tests with grpcurl
grpcurl -plaintext \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"user_id": "123e4567-e89b-12d3-a456-426614174000", "amount_cents": 100000, "transaction_type": "send"}' \
  localhost:50053 xupay.user.UserService/ValidateUser
```

---

## 🧪 TESTING STRATEGY

### Unit Tests (Mockito)
```java
@ExtendWith(MockitoExtension.class)
class UserGrpcServiceImplTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private LimitService limitService;
    @InjectMocks
    private UserGrpcServiceImpl grpcService;

    @Test
    void validateUser_ValidUser_ReturnsSuccess() {
        // Arrange
        User user = User.builder()
                .id(UUID.randomUUID())
                .email("test@example.com")
                .isActive(true)
                .kycStatus(KycStatus.APPROVED)
                .build();
        
        when(userRepository.findById(any())).thenReturn(Optional.of(user));
        when(limitService.checkTransactionAllowed(any(), anyLong(), anyString()))
                .thenReturn(new LimitCheckResponse(true, "", 100000L));
        
        // Act & Assert
        StreamObserver<ValidateUserResponse> observer = mock(StreamObserver.class);
        grpcService.validateUser(request, observer);
        
        verify(observer).onNext(argThat(response -> response.getIsValid()));
        verify(observer).onCompleted();
    }
}
```

### Integration Tests (grpcurl)
```bash
# 1. Validate user (Payment Service calls this before transfer)
grpcurl -plaintext \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "amount_cents": 250000,
    "transaction_type": "send"
  }' \
  localhost:50053 xupay.user.UserService/ValidateUser

# Expected response:
{
  "isValid": true,
  "reason": "",
  "user": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "alice@example.com",
    "firstName": "Alice",
    "kycStatus": "APPROVED",
    "kycTier": "TIER_1"
  }
}

# 2. Check transaction limit
grpcurl -plaintext \
  -H "Authorization: Bearer <JWT>" \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "amount_cents": 600000,
    "transaction_type": "send"
  }' \
  localhost:50053 xupay.user.UserService/CheckTransactionLimit

# Expected response (exceeds TIER_1 daily limit):
{
  "allowed": false,
  "reason": "Would exceed daily send limit of $5000",
  "remainingLimitCents": 250000,
  "dailyLimitCents": 500000
}
```

---

## ✅ SUCCESS CRITERIA

- [ ] Proto file compiled successfully
- [ ] 5 gRPC service methods implemented
- [ ] JWT authentication works (validated from metadata)
- [ ] Error handling returns proper Status codes
- [ ] Logging interceptor logs all calls
- [ ] Unit tests pass (90%+ coverage)
- [ ] Integration tests with grpcurl succeed
- [ ] Payment Service can call ValidateUser (future)
- [ ] Documentation updated

---

## 🚀 NEXT STEPS (After Day 4)

### Day 5: Testing & Documentation
1. Complete unit tests (all service layers)
2. REST API integration tests (@SpringBootTest)
3. Performance testing (load test 1000 concurrent requests)
4. API documentation (OpenAPI/Swagger + gRPC reflection)
5. Deployment guide (Docker + Kubernetes)

### Week 2: Payment Service
1. Implement Payment Service (Java Spring Boot)
2. Create gRPC client to call User Service
3. Implement double-entry ledger
4. Transaction idempotency
5. Fraud detection integration

---

## 📝 NOTES

### Why Port 50053?
- Standard gRPC port is 50051
- We use 50053 to avoid conflicts with other services
- Payment Service will use 50054
- Audit Service will use 50055

### Why HTTP/2?
- Binary framing (faster than HTTP/1.1 text)
- Multiplexing (multiple streams over 1 connection)
- Server push (not used here, but available)
- Header compression (HPACK)

### Why Protobuf?
- Smaller payload (30-50% smaller than JSON)
- Faster serialization (3-10x faster)
- Strongly typed (compile-time errors)
- Backward/forward compatible (field numbers)

### gRPC vs REST Comparison

| Feature | gRPC | REST |
|---------|------|------|
| **Protocol** | HTTP/2 | HTTP/1.1 |
| **Serialization** | Protobuf (binary) | JSON (text) |
| **Performance** | 3-10x faster | Baseline |
| **Streaming** | Bidirectional | No (SSE workaround) |
| **Browser Support** | Requires proxy | Native |
| **Readability** | Binary (not human-readable) | JSON (human-readable) |
| **Type Safety** | Strong (proto contracts) | Weak (OpenAPI optional) |
| **Use Case** | Service-to-service | Client-to-service |

**Decision:** 
- REST for client-facing (browser → API Gateway → services)
- gRPC for service-to-service (Payment ↔ User ↔ Audit)

---

## 🎯 IMPLEMENTATION SCHEDULE

| Phase | Duration | Files | Status |
|-------|----------|-------|--------|
| 4.1: Proto Definition | 1 hour | 1 file | ⏳ Pending |
| 4.2: Maven Config | 30 min | 1 file (pom.xml update) | ⏳ Pending |
| 4.3: Service Implementation | 2 hours | 1 file | ⏳ Pending |
| 4.4: Interceptors | 1.5 hours | 2 files | ⏳ Pending |
| 4.5: Configuration | 1 hour | 2 files | ⏳ Pending |
| 4.6: Exception Handling | 30 min | 1 file | ⏳ Pending |
| 4.7: Testing | 1.5 hours | 2 files | ⏳ Pending |
| **TOTAL** | **8 hours** | **10 files** | **0% Complete** |

---
