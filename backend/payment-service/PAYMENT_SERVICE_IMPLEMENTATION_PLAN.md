# Payment Service - Complete Implementation Plan
> **Date:** December 18, 2025  
> **Status:** 🚀 **READY TO START** (Schema validated & fixed)  
> **Timeline:** 7 days (Day 6-12)

---

## 🔥 LESSONS LEARNED FROM USER SERVICE (CRITICAL)

### ❌ Problems We Had:
1. **Enum case mismatches** → Runtime constraint violations (15+ fixes)
2. **INET type incompatibility** → PostgreSQL rejected Java String
3. **DTO field name mismatches** → 10 compilation errors
4. **gRPC interceptor duplication** → IllegalArgumentException
5. **Build success but runtime failures** → Wasted debugging time

### ✅ How We're Avoiding Them:
1. **Schema validated FIRST** → ALL enums now UPPERCASE (10 constraints fixed)
2. **INET → VARCHAR(50)** → Simple IP storage, no casting issues
3. **Detailed DTO planning** → Map DTOs to schema BEFORE coding
4. **Schema-first approach** → Database is authoritative, Java follows
5. **Test at every phase** → Build + Run + Test after each day

---

## 📊 SCHEMA ANALYSIS (7 Tables)

### ✅ Schema Validation Complete

**Enums Fixed (10 constraints):**
| Table | Column | Values | Status |
|-------|--------|--------|--------|
| chart_of_accounts | account_type | ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE | ✅ UPPERCASE |
| chart_of_accounts | normal_balance | DEBIT, CREDIT | ✅ UPPERCASE |
| wallets | wallet_type | PERSONAL, BUSINESS, MERCHANT | ✅ UPPERCASE (fixed) |
| transactions | type | TRANSFER, TOPUP, WITHDRAW, MERCHANT_PAYMENT, REFUND | ✅ UPPERCASE (fixed) |
| transactions | status | PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED, REVERSED | ✅ UPPERCASE (fixed) |
| ledger_entries | entry_type | DEBIT, CREDIT | ✅ UPPERCASE |
| merchants | settlement_frequency | DAILY, WEEKLY, MONTHLY | ✅ UPPERCASE (fixed) |
| fraud_rules | rule_type | VELOCITY, AMOUNT_THRESHOLD, GEO_ANOMALY, PATTERN_MATCH, BLACKLIST | ✅ UPPERCASE (fixed) |
| fraud_rules | action | FLAG, BLOCK, REVIEW | ✅ UPPERCASE (fixed) |

**Type Safety:**
- ✅ Changed `ip_address INET` → `VARCHAR(50)` (User Service lesson)
- ✅ All money amounts: `BIGINT` (cents) - NO FLOATS
- ✅ All UUIDs: `UUID` type with `gen_random_uuid()`
- ✅ All timestamps: `TIMESTAMPTZ` (timezone-aware)

---

## 🏗️ IMPLEMENTATION PHASES (7 Days)

### **Day 6: Foundation Setup (4-5 hours)**

**Goal:** Spring Boot app compiles and runs with database connection

**Tasks:**
1. **Create Project Structure** (1h)
   ```
   payment-service/
   ├── src/main/java/com/xupay/payment/
   │   ├── PaymentServiceApplication.java (main)
   │   ├── config/
   │   │   ├── DatabaseConfig.java
   │   │   ├── RedisConfig.java
   │   │   └── GrpcClientConfig.java (User Service client)
   │   ├── entity/enums/
   │   │   ├── AccountType.java
   │   │   ├── NormalBalance.java
   │   │   ├── WalletType.java
   │   │   ├── TransactionType.java
   │   │   ├── TransactionStatus.java
   │   │   ├── EntryType.java
   │   │   ├── SettlementFrequency.java
   │   │   ├── RuleType.java
   │   │   └── FraudAction.java
   │   └── entity/
   │       ├── ChartOfAccounts.java
   │       ├── Wallet.java
   │       ├── Transaction.java
   │       ├── LedgerEntry.java
   │       ├── IdempotencyCache.java
   │       ├── Merchant.java
   │       └── FraudRule.java
   ```

2. **Create Enums (9 files)** (1h)
   - **CRITICAL:** All enum values UPPERCASE (matching schema)
   - Example:
   ```java
   public enum TransactionType {
       TRANSFER,
       TOPUP,
       WITHDRAW,
       MERCHANT_PAYMENT,
       REFUND
   }
   ```

3. **Create Entities (7 files)** (2h)
   - Map to schema exactly
   - Use `@Enumerated(EnumType.STRING)` for all enums
   - **CRITICAL:** Field names must match database columns
   - Example mapping:
   ```java
   @Entity
   @Table(name = "transactions")
   public class Transaction {
       @Column(name = "amount_cents", nullable = false)
       private Long amountCents;  // matches DB: amount_cents
       
       @Enumerated(EnumType.STRING)
       @Column(name = "type", nullable = false, length = 20)
       private TransactionType type;  // DB stores "TRANSFER", "TOPUP", etc.
   }
   ```

4. **Create Repositories (7 files)** (30m)
   - Extend JpaRepository
   - Add custom query methods

5. **Configure application.yml** (30m)
   ```yaml
   spring:
     application:
       name: payment-service
     datasource:
       url: jdbc:postgresql://localhost:5433/payment_db
       username: payment_service_user
       password: P@ym3ntS3rv1c3P@ss2025!
     jpa:
       hibernate:
         ddl-auto: validate  # Schema exists, just validate
       properties:
         hibernate:
           default_schema: public
   server:
     port: 8082
   ```

**Validation:**
- ✅ `mvn clean compile` succeeds
- ✅ `mvn spring-boot:run` starts successfully
- ✅ Actuator health check: `curl http://localhost:8082/actuator/health`

---

### **Day 7: Wallet CRUD + Balance Calculation (5-6 hours)**

**Goal:** Create wallets, calculate balance from ledger

**Tasks:**
1. **Create Wallet DTOs** (1h)
   ```java
   // Request
   record CreateWalletRequest(UUID userId, WalletType walletType, String currency) {}
   
   // Response
   record WalletResponse(UUID id, UUID userId, String glAccountCode, 
                         WalletType walletType, String currency, 
                         Long balanceCents, Boolean isActive, Boolean isFrozen) {}
   ```

2. **Create WalletService** (2h)
   ```java
   public interface WalletService {
       WalletResponse createWallet(CreateWalletRequest request);
       WalletResponse getWallet(UUID walletId);
       Long getBalance(UUID walletId);  // Calls DB function
       WalletResponse freezeWallet(UUID walletId, String reason);
       WalletResponse unfreezeWallet(UUID walletId);
   }
   ```

   **CRITICAL Implementation:**
   ```java
   @Service
   public class WalletServiceImpl implements WalletService {
       
       @Override
       public Long getBalance(UUID walletId) {
           // Call PostgreSQL function: get_wallet_balance(wallet_id)
           // This calculates from ledger (NEVER stored)
           Query query = entityManager.createNativeQuery(
               "SELECT get_wallet_balance(:walletId)"
           );
           query.setParameter("walletId", walletId);
           return ((BigInteger) query.getSingleResult()).longValue();
       }
   }
   ```

3. **Create WalletController** (1h)
   ```java
   @RestController
   @RequestMapping("/api/wallets")
   public class WalletController {
       @PostMapping
       ResponseEntity<WalletResponse> createWallet(@RequestBody CreateWalletRequest);
       
       @GetMapping("/{id}")
       ResponseEntity<WalletResponse> getWallet(@PathVariable UUID id);
       
       @GetMapping("/{id}/balance")
       ResponseEntity<BalanceResponse> getBalance(@PathVariable UUID id);
   }
   ```

4. **Seed Chart of Accounts** (30m)
   - Already in schema, verify data loads:
   ```sql
   -- Key accounts:
   -- 1110: Company Cash (ASSET, DEBIT)
   -- 2110: User Balances (LIABILITY, CREDIT)
   ```

5. **Write Tests** (1h)
   - WalletServiceTest: Create wallet, get balance
   - Integration test: Create wallet → Check balance = 0

**Validation:**
- ✅ Create wallet via API
- ✅ Get balance returns 0 (no ledger entries yet)
- ✅ All tests pass

---

### **Day 8: P2P Transfer + Double-Entry Ledger (6-7 hours)**

**Goal:** Transfer money with balanced ledger entries

**Tasks:**
1. **Create Transfer DTOs** (1h)
   ```java
   record TransferRequest(
       UUID fromUserId,
       UUID toUserId,
       Long amountCents,
       String description,
       UUID idempotencyKey  // CRITICAL: Generated by client
   ) {}
   
   record TransferResponse(
       UUID transactionId,
       TransactionStatus status,
       Long amountCents,
       LocalDateTime completedAt,
       Boolean wasCached  // True if idempotency cache hit
   ) {}
   ```

2. **Create IdempotencyService** (1.5h)
   ```java
   public interface IdempotencyService {
       Optional<TransferResponse> checkCache(UUID idempotencyKey);
       void cacheResponse(UUID idempotencyKey, TransferResponse response);
   }
   ```

3. **Create TransactionService (CORE LOGIC)** (3h)
   ```java
   @Service
   public class TransactionServiceImpl implements TransactionService {
       
       @Transactional(isolation = Isolation.SERIALIZABLE)
       public TransferResponse transferP2P(TransferRequest request) {
           // 1. Check idempotency cache
           Optional<TransferResponse> cached = 
               idempotencyService.checkCache(request.idempotencyKey());
           if (cached.isPresent()) {
               return cached.get().withCached(true);  // Return immediately
           }
           
           // 2. Validate wallets exist and not frozen
           Wallet fromWallet = walletRepository.findByUserId(request.fromUserId());
           Wallet toWallet = walletRepository.findByUserId(request.toUserId());
           
           // 3. Check sufficient balance
           Long currentBalance = walletService.getBalance(fromWallet.getId());
           if (currentBalance < request.amountCents()) {
               throw new InsufficientBalanceException();
           }
           
           // 4. Create transaction record
           Transaction txn = new Transaction();
           txn.setIdempotencyKey(request.idempotencyKey());
           txn.setFromWalletId(fromWallet.getId());
           txn.setToWalletId(toWallet.getId());
           txn.setFromUserId(request.fromUserId());
           txn.setToUserId(request.toUserId());
           txn.setAmountCents(request.amountCents());
           txn.setType(TransactionType.TRANSFER);
           txn.setStatus(TransactionStatus.PENDING);
           txn = transactionRepository.save(txn);
           
           // 5. Create DEBIT entry (reduce sender balance)
           LedgerEntry debit = new LedgerEntry();
           debit.setTransactionId(txn.getId());
           debit.setGlAccountCode("2110");  // User Balances
           debit.setWalletId(fromWallet.getId());
           debit.setEntryType(EntryType.DEBIT);
           debit.setAmountCents(request.amountCents());
           debit.setDescription("P2P Transfer to " + request.toUserId());
           ledgerEntryRepository.save(debit);
           
           // 6. Create CREDIT entry (increase receiver balance)
           LedgerEntry credit = new LedgerEntry();
           credit.setTransactionId(txn.getId());
           credit.setGlAccountCode("2110");  // User Balances
           credit.setWalletId(toWallet.getId());
           credit.setEntryType(EntryType.CREDIT);
           credit.setAmountCents(request.amountCents());
           credit.setDescription("P2P Transfer from " + request.fromUserId());
           ledgerEntryRepository.save(credit);
           
           // 7. Constraint trigger validates: debits = credits
           //    (Automatic, no code needed)
           
           // 8. Update transaction status
           txn.setStatus(TransactionStatus.COMPLETED);
           txn.setCompletedAt(LocalDateTime.now());
           transactionRepository.save(txn);
           
           // 9. Cache response
           TransferResponse response = new TransferResponse(
               txn.getId(), txn.getStatus(), txn.getAmountCents(),
               txn.getCompletedAt(), false
           );
           idempotencyService.cacheResponse(request.idempotencyKey(), response);
           
           return response;
       }
   }
   ```

4. **Create TransactionController** (1h)
   ```java
   @RestController
   @RequestMapping("/api/payments")
   public class TransactionController {
       @PostMapping("/transfer")
       ResponseEntity<TransferResponse> transfer(@RequestBody TransferRequest);
   }
   ```

5. **Write Tests** (1.5h)
   - TransactionServiceTest: Test transfer logic
   - Integration test: Transfer $100, verify both balances
   - Idempotency test: Retry with same key, verify no duplicate charge

**Validation:**
- ✅ Transfer money between users
- ✅ Verify sender balance decreased
- ✅ Verify receiver balance increased
- ✅ Retry with same idempotency key → Returns cached response
- ✅ Database constraint prevents unbalanced transactions

---

### **Day 9: gRPC Integration with User Service (4-5 hours)**

**Goal:** Payment Service calls User Service to validate limits

**Tasks:**
1. **Add gRPC Client Dependency** (30m)
   ```xml
   <dependency>
       <groupId>net.devh</groupId>
       <artifactId>grpc-client-spring-boot-starter</artifactId>
   </dependency>
   ```

2. **Copy user_service.proto** (15m)
   - From User Service: `proto/user_service.proto`
   - Generate client stubs: `mvn clean compile`

3. **Configure gRPC Client** (30m)
   ```yaml
   grpc:
     client:
       user-service:
         address: 'static://localhost:50053'
         negotiationType: plaintext
   ```

4. **Create UserServiceClient Wrapper** (1h)
   ```java
   @Service
   public class UserServiceClient {
       
       @GrpcClient("user-service")
       private UserServiceGrpc.UserServiceBlockingStub userServiceStub;
       
       public LimitCheckResult checkTransactionLimit(UUID userId, Long amountCents) {
           CheckTransactionLimitRequest request = 
               CheckTransactionLimitRequest.newBuilder()
                   .setUserId(userId.toString())
                   .setAmountCents(amountCents)
                   .build();
           
           CheckTransactionLimitResponse response = 
               userServiceStub.checkTransactionLimit(request);
           
           return new LimitCheckResult(
               response.getAllowed(),
               response.getReason(),
               response.getRemainingDailyLimitCents()
           );
       }
   }
   ```

5. **Update TransactionService** (1.5h)
   - Add limit check BEFORE creating transaction:
   ```java
   // Step 1.5: Check transaction limits via gRPC
   LimitCheckResult limitCheck = 
       userServiceClient.checkTransactionLimit(
           request.fromUserId(), 
           request.amountCents()
       );
   
   if (!limitCheck.allowed()) {
       throw new TransactionLimitExceededException(limitCheck.reason());
   }
   ```

6. **Write Integration Tests** (1h)
   - Start User Service on port 50053
   - Start Payment Service on port 8082
   - Test transfer with exceeded limit → Should fail
   - Test transfer within limit → Should succeed

**Validation:**
- ✅ Payment Service can call User Service gRPC
- ✅ Transfer blocked if user exceeds daily limit
- ✅ Transfer succeeds if within limits

---

### **Day 10: Fraud Detection + Idempotency (4-5 hours)**

**Goal:** Basic fraud rules + Redis caching

**Tasks:**
1. **Add Redis Dependency** (15m)
   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-data-redis</artifactId>
   </dependency>
   ```

2. **Configure Redis** (30m)
   ```yaml
   spring:
     redis:
       host: localhost
       port: 6379
       password: R3d1sP@ss2025!
   ```

3. **Implement Redis Idempotency Cache** (1.5h)
   ```java
   @Service
   public class RedisIdempotencyService implements IdempotencyService {
       
       @Autowired
       private RedisTemplate<String, String> redisTemplate;
       
       @Override
       public Optional<TransferResponse> checkCache(UUID idempotencyKey) {
           String key = "idempotency:" + idempotencyKey;
           String cached = redisTemplate.opsForValue().get(key);
           if (cached != null) {
               return Optional.of(objectMapper.readValue(cached, TransferResponse.class));
           }
           return Optional.empty();
       }
       
       @Override
       public void cacheResponse(UUID idempotencyKey, TransferResponse response) {
           String key = "idempotency:" + idempotencyKey;
           String value = objectMapper.writeValueAsString(response);
           redisTemplate.opsForValue().set(key, value, Duration.ofHours(24));
       }
   }
   ```

4. **Create FraudService** (2h)
   ```java
   @Service
   public class FraudServiceImpl implements FraudService {
       
       public FraudCheckResult evaluateTransaction(TransferRequest request) {
           int riskScore = 0;
           List<String> reasons = new ArrayList<>();
           
           // Rule 1: Large amount (> $5000)
           if (request.amountCents() > 500000000) {  // 5M VND = ~$200
               riskScore += 40;
               reasons.add("Large transaction amount");
           }
           
           // Rule 2: Velocity check (> 10 txns in last hour)
           long recentTxnCount = transactionRepository
               .countByFromUserIdAndCreatedAtAfter(
                   request.fromUserId(),
                   LocalDateTime.now().minusHours(1)
               );
           if (recentTxnCount > 10) {
               riskScore += 30;
               reasons.add("High transaction velocity");
           }
           
           // Decision
           if (riskScore > 80) {
               return FraudCheckResult.blocked(riskScore, reasons);
           } else if (riskScore > 50) {
               return FraudCheckResult.flagged(riskScore, reasons);
           } else {
               return FraudCheckResult.approved(riskScore);
           }
       }
   }
   ```

5. **Integrate Fraud Check in Transfer** (30m)
   ```java
   // Step 2.5: Fraud evaluation
   FraudCheckResult fraudCheck = fraudService.evaluateTransaction(request);
   
   if (fraudCheck.isBlocked()) {
       throw new FraudBlockedException(fraudCheck.reasons());
   }
   
   // Continue with transaction, but flag if high risk
   txn.setIsFlagged(fraudCheck.isFlagged());
   txn.setFraudScore(fraudCheck.score());
   ```

6. **Write Tests** (1h)
   - Test Redis caching: First call processes, second call cached
   - Test fraud detection: High amount triggers flag
   - Test velocity: 11 transactions in 1 hour triggers flag

**Validation:**
- ✅ Redis idempotency working
- ✅ Duplicate requests return cached response
- ✅ Fraud rules trigger correctly
- ✅ High-risk transactions flagged

---

### **Day 11: Testing + Documentation (3-4 hours)**

**Goal:** Comprehensive test suite + API docs

**Tasks:**
1. **Unit Tests** (1.5h)
   - WalletServiceTest
   - TransactionServiceTest
   - FraudServiceTest
   - IdempotencyServiceTest

2. **Integration Tests** (1h)
   - End-to-end transfer flow
   - Error scenarios (insufficient balance, frozen wallet)
   - Idempotency retry

3. **Create API Test Script** (30m)
   ```powershell
   # test-payment-api.ps1
   # 1. Create wallet for Alice
   # 2. Create wallet for Bob
   # 3. Topup Alice wallet (simulated)
   # 4. Transfer Alice → Bob
   # 5. Check balances
   # 6. Retry transfer (same idempotency key)
   # 7. Verify no duplicate charge
   ```

4. **Document APIs** (1h)
   - API_REFERENCE.md
   - Document all endpoints with examples

**Validation:**
- ✅ All unit tests pass
- ✅ All integration tests pass
- ✅ Test script runs successfully

---

### **Day 12: Integration Testing (3-4 hours)**

**Goal:** User Service ↔ Payment Service full integration

**Tasks:**
1. **Start Both Services** (30m)
   - User Service on 8081 + gRPC 50053
   - Payment Service on 8082

2. **End-to-End Test Scenarios** (2h)
   ```
   Scenario 1: Successful Transfer
   1. Register user Alice in User Service
   2. Register user Bob in User Service
   3. Create wallet for Alice in Payment Service
   4. Create wallet for Bob in Payment Service
   5. Topup Alice wallet
   6. Transfer Alice → Bob
   7. Verify: Alice balance decreased, Bob balance increased
   8. Verify: User Service recorded daily usage
   
   Scenario 2: Transfer Blocked by Limit
   1. User with TIER_0 (daily limit $100)
   2. Attempt transfer $200
   3. Payment Service calls User Service gRPC
   4. User Service returns "limit exceeded"
   5. Payment Service rejects transfer
   6. Verify: No ledger entries created
   
   Scenario 3: Idempotency
   1. Transfer $50 with key "abc-123"
   2. Verify: Transaction completes
   3. Retry transfer with same key "abc-123"
   4. Verify: Returns cached response
   5. Verify: Only ONE transaction created
   ```

3. **Performance Testing** (1h)
   - 100 concurrent transfers
   - Verify no race conditions
   - Verify constraint triggers work

4. **Update Memory Bank** (30m)
   - Document Payment Service lessons
   - Update project status
   - Prepare for Audit Service

**Validation:**
- ✅ All scenarios pass
- ✅ No duplicate transactions
- ✅ gRPC integration working
- ✅ Constraint triggers enforcing balance

---

## 📁 FILE COUNT ESTIMATE

| Category | Files | Status |
|----------|-------|--------|
| **Day 6: Foundation** | 25 | ⏳ TODO |
| - Main class | 1 | - |
| - Config classes | 3 | - |
| - Enums | 9 | - |
| - Entities | 7 | - |
| - Repositories | 7 | - |
| **Day 7: Wallet** | 8 | ⏳ TODO |
| - DTOs | 3 | - |
| - Service + Impl | 2 | - |
| - Controller | 1 | - |
| - Tests | 2 | - |
| **Day 8: Transfer** | 12 | ⏳ TODO |
| - DTOs | 4 | - |
| - Services + Impl | 4 | - |
| - Controller | 1 | - |
| - Tests | 3 | - |
| **Day 9: gRPC** | 5 | ⏳ TODO |
| - Client wrapper | 1 | - |
| - Proto files | 1 | - |
| - Tests | 3 | - |
| **Day 10: Fraud** | 8 | ⏳ TODO |
| - Redis config | 1 | - |
| - Fraud service + impl | 2 | - |
| - DTOs | 2 | - |
| - Tests | 3 | - |
| **Day 11-12: Tests** | 12 | ⏳ TODO |
| - Unit tests | 6 | - |
| - Integration tests | 4 | - |
| - Scripts | 2 | - |
| **TOTAL** | **70 files** | **0/70** |

---

## 🎯 SUCCESS CRITERIA

### Functional Requirements:
- ✅ Create wallet for user
- ✅ Get wallet balance (calculated from ledger)
- ✅ Transfer money P2P with double-entry
- ✅ Idempotency prevents duplicate charges
- ✅ gRPC calls User Service for limit validation
- ✅ Basic fraud detection (5 rules)
- ✅ All transactions balanced (constraint enforced)

### Non-Functional Requirements:
- ✅ Build succeeds: `mvn clean package`
- ✅ Application starts: `mvn spring-boot:run`
- ✅ All tests pass: `mvn test`
- ✅ API test script passes
- ✅ Integration with User Service works
- ✅ Redis caching works
- ✅ Database constraints enforced

---

## 📚 REFERENCE DOCUMENTS

**Architecture & Design:**
- [developer_handbook.md](c:\Users\duyth\FinTech\plan-guide\developer_handbook.md) - Complete tech stack
- [complete-data-flow-state-machines.md](c:\Users\duyth\FinTech\plan-guide\complete-data-flow-state-machines.md) - Transaction lifecycle
- [CLAUDE.md](c:\Users\duyth\FinTech\CLAUDE.md) - Mermaid diagrams

**Critical Concepts:**
- [README_PRODUCTION.md](c:\Users\duyth\FinTech\README_PRODUCTION.md) - Double-entry accounting
- [claude-ai-developer-kit-xupay.md](c:\Users\duyth\FinTech\memory-bank\claude-ai-developer-kit-xupay.md) - Prompting framework

**Lessons Learned:**
- [memory.md](c:\Users\duyth\FinTech\memory-bank\memory.md) - Critical errors from User Service

---
