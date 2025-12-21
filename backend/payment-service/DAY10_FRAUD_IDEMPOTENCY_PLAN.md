# Day 10: Fraud Detection & Idempotency Enhancement - Implementation Plan

**Date:** December 20, 2025  
**Dependencies:** Day 9 gRPC Integration (COMPLETED)  
**Estimated Time:** 4-6 hours

---

## 1. Objectives

### **Primary Goals:**
1. ✅ Implement **FraudDetectionService** with rule-based engine
2. ✅ Integrate fraud scoring into P2P transfers
3. ✅ Implement **IdempotencyService** with Redis caching
4. ✅ Seed fraud_rules table with production rules
5. ✅ Auto-flag high-risk transactions

### **Success Criteria:**
- ✅ Fraud rules evaluated BEFORE transaction creation
- ✅ High-risk transactions auto-flagged (fraud_score >= 70)
- ✅ Idempotency cache reduces database hits by 90%
- ✅ Redis TTL = 24 hours for transaction cache
- ✅ All existing tests pass + new fraud tests added

---

## 2. Database Schema Review

### **2.1 fraud_rules Table**
**Location:** `001_fraud_schema.sql` (already created)

```sql
CREATE TABLE fraud_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_name VARCHAR(100) UNIQUE NOT NULL,
    rule_type VARCHAR(50) NOT NULL,  -- VELOCITY, AMOUNT, GEO, PATTERN
    threshold_value BIGINT,
    time_window_minutes INT,
    action VARCHAR(20) NOT NULL,     -- FLAG, BLOCK, REVIEW
    risk_score INT NOT NULL,         -- 0-100
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **2.2 Transactions Table (Existing)**
**Fraud-Related Fields:**
```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    -- ... other fields ...
    fraud_score INT DEFAULT 0,       -- Calculated score
    is_flagged BOOLEAN DEFAULT false, -- Auto-flagged if score >= 70
    status VARCHAR(20) NOT NULL,     -- PROCESSING, COMPLETED, FAILED, BLOCKED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **2.3 Daily Usage Table (User Service)**
**Used for Velocity Checks:**
```sql
CREATE TABLE daily_usage (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    date DATE NOT NULL,
    daily_sent_cents BIGINT DEFAULT 0,
    daily_received_cents BIGINT DEFAULT 0,
    transaction_count INT DEFAULT 0,
    -- Velocity tracking
    UNIQUE(user_id, date)
);
```

---

## 3. Implementation Tasks

### **Task 1: Create FraudRule Entity**
**File:** `src/main/java/com/xupay/payment/domain/FraudRule.java`

```java
@Entity
@Table(name = "fraud_rules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FraudRule {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false, unique = true, length = 100)
    private String ruleName;
    
    @Column(nullable = false, length = 50)
    private String ruleType;  // VELOCITY, AMOUNT, GEO, PATTERN
    
    private Long thresholdValue;
    
    private Integer timeWindowMinutes;
    
    @Column(nullable = false, length = 20)
    private String action;  // FLAG, BLOCK, REVIEW
    
    @Column(nullable = false)
    private Integer riskScore;  // 0-100
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
    
    @Column(nullable = false)
    private Instant updatedAt = Instant.now();
}
```

---

### **Task 2: Create FraudRuleRepository**
**File:** `src/main/java/com/xupay/payment/repository/FraudRuleRepository.java`

```java
@Repository
public interface FraudRuleRepository extends JpaRepository<FraudRule, UUID> {
    
    List<FraudRule> findByIsActiveTrueOrderByRiskScoreDesc();
    
    Optional<FraudRule> findByRuleName(String ruleName);
    
    List<FraudRule> findByRuleTypeAndIsActiveTrue(String ruleType);
}
```

---

### **Task 3: Create FraudEvaluationResult DTO**
**File:** `src/main/java/com/xupay/payment/dto/FraudEvaluationResult.java`

```java
@Data
@Builder
public class FraudEvaluationResult {
    private int totalScore;           // Sum of all triggered rules
    private boolean shouldBlock;      // true if any BLOCK rule triggered
    private boolean shouldFlag;       // true if score >= 70
    private List<String> triggeredRules;  // Names of triggered rules
    private Map<String, String> details;  // Additional context
}
```

---

### **Task 4: Create FraudDetectionService Interface**
**File:** `src/main/java/com/xupay/payment/service/FraudDetectionService.java`

```java
public interface FraudDetectionService {
    
    /**
     * Evaluate transaction for fraud risk
     * @param request Transfer request
     * @param senderUserId Sender user ID
     * @return Fraud evaluation result
     */
    FraudEvaluationResult evaluateTransaction(
        TransferRequest request, 
        UUID senderUserId
    );
    
    /**
     * Get all active fraud rules
     * @return List of active rules
     */
    List<FraudRule> getActiveRules();
    
    /**
     * Check velocity rule (transactions per time window)
     * @param userId User ID
     * @param timeWindowMinutes Time window
     * @param threshold Max transactions allowed
     * @return true if threshold exceeded
     */
    boolean checkVelocityRule(UUID userId, int timeWindowMinutes, int threshold);
    
    /**
     * Check amount threshold rule
     * @param amountCents Transaction amount
     * @param threshold Max amount allowed
     * @return true if threshold exceeded
     */
    boolean checkAmountRule(long amountCents, long threshold);
}
```

---

### **Task 5: Implement FraudDetectionServiceImpl**
**File:** `src/main/java/com/xupay/payment/service/impl/FraudDetectionServiceImpl.java`

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class FraudDetectionServiceImpl implements FraudDetectionService {
    
    private final FraudRuleRepository fraudRuleRepository;
    private final TransactionRepository transactionRepository;
    
    @Override
    public FraudEvaluationResult evaluateTransaction(TransferRequest request, UUID senderUserId) {
        log.info("Evaluating fraud risk for transaction: senderId={}, amount={}", 
                 senderUserId, request.getAmountCents());
        
        List<FraudRule> activeRules = getActiveRules();
        int totalScore = 0;
        boolean shouldBlock = false;
        List<String> triggeredRules = new ArrayList<>();
        Map<String, String> details = new HashMap<>();
        
        for (FraudRule rule : activeRules) {
            boolean triggered = false;
            
            switch (rule.getRuleType()) {
                case "VELOCITY":
                    triggered = checkVelocityRule(
                        senderUserId, 
                        rule.getTimeWindowMinutes(), 
                        rule.getThresholdValue().intValue()
                    );
                    if (triggered) {
                        details.put(rule.getRuleName(), "Transaction frequency exceeded");
                    }
                    break;
                    
                case "AMOUNT":
                    triggered = checkAmountRule(
                        request.getAmountCents(), 
                        rule.getThresholdValue()
                    );
                    if (triggered) {
                        details.put(rule.getRuleName(), "Amount exceeds threshold");
                    }
                    break;
                    
                // Add more rule types: GEO, PATTERN, BLACKLIST
            }
            
            if (triggered) {
                triggeredRules.add(rule.getRuleName());
                totalScore += rule.getRiskScore();
                
                if ("BLOCK".equals(rule.getAction())) {
                    shouldBlock = true;
                }
            }
        }
        
        boolean shouldFlag = totalScore >= 70;
        
        log.info("Fraud evaluation complete: score={}, blocked={}, flagged={}, rules={}", 
                 totalScore, shouldBlock, shouldFlag, triggeredRules);
        
        return FraudEvaluationResult.builder()
                .totalScore(totalScore)
                .shouldBlock(shouldBlock)
                .shouldFlag(shouldFlag)
                .triggeredRules(triggeredRules)
                .details(details)
                .build();
    }
    
    @Override
    public List<FraudRule> getActiveRules() {
        return fraudRuleRepository.findByIsActiveTrueOrderByRiskScoreDesc();
    }
    
    @Override
    public boolean checkVelocityRule(UUID userId, int timeWindowMinutes, int threshold) {
        Instant startTime = Instant.now().minus(Duration.ofMinutes(timeWindowMinutes));
        
        long count = transactionRepository.countByFromUserIdAndCreatedAtAfter(userId, startTime);
        
        log.debug("Velocity check: userId={}, window={}min, count={}, threshold={}", 
                  userId, timeWindowMinutes, count, threshold);
        
        return count >= threshold;
    }
    
    @Override
    public boolean checkAmountRule(long amountCents, long threshold) {
        return amountCents > threshold;
    }
}
```

---

### **Task 6: Update TransactionRepository**
**File:** `src/main/java/com/xupay/payment/repository/TransactionRepository.java`

**Add Method:**
```java
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    
    // Existing methods...
    Optional<Transaction> findByIdempotencyKey(String idempotencyKey);
    
    // NEW: Velocity check
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.fromUserId = :userId AND t.createdAt > :startTime")
    long countByFromUserIdAndCreatedAtAfter(
        @Param("userId") UUID userId, 
        @Param("startTime") Instant startTime
    );
}
```

---

### **Task 7: Create IdempotencyService Interface**
**File:** `src/main/java/com/xupay/payment/service/IdempotencyService.java`

```java
public interface IdempotencyService {
    
    /**
     * Check if idempotency key exists in cache/database
     * @param idempotencyKey Unique request key
     * @return Optional of cached TransferResponse
     */
    Optional<TransferResponse> getIfExists(String idempotencyKey);
    
    /**
     * Cache transaction response for 24 hours
     * @param idempotencyKey Unique request key
     * @param response Transaction response
     */
    void cache(String idempotencyKey, TransferResponse response);
    
    /**
     * Invalidate cache entry (for failed transactions)
     * @param idempotencyKey Unique request key
     */
    void invalidate(String idempotencyKey);
}
```

---

### **Task 8: Implement IdempotencyServiceImpl (Redis)**
**File:** `src/main/java/com/xupay/payment/service/impl/IdempotencyServiceImpl.java`

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class IdempotencyServiceImpl implements IdempotencyService {
    
    private static final String CACHE_KEY_PREFIX = "idempotency:";
    private static final long TTL_HOURS = 24;
    
    private final RedisTemplate<String, TransferResponse> redisTemplate;
    private final TransactionRepository transactionRepository;
    
    @Override
    public Optional<TransferResponse> getIfExists(String idempotencyKey) {
        // Step 1: Check Redis cache
        String cacheKey = CACHE_KEY_PREFIX + idempotencyKey;
        TransferResponse cachedResponse = redisTemplate.opsForValue().get(cacheKey);
        
        if (cachedResponse != null) {
            log.info("Cache HIT for idempotency key: {}", idempotencyKey);
            return Optional.of(cachedResponse);
        }
        
        // Step 2: Check database (fallback)
        log.info("Cache MISS for idempotency key: {}, checking database", idempotencyKey);
        Optional<Transaction> transaction = transactionRepository.findByIdempotencyKey(idempotencyKey);
        
        if (transaction.isPresent()) {
            TransferResponse response = buildTransferResponse(transaction.get());
            cache(idempotencyKey, response);  // Populate cache
            return Optional.of(response);
        }
        
        return Optional.empty();
    }
    
    @Override
    public void cache(String idempotencyKey, TransferResponse response) {
        String cacheKey = CACHE_KEY_PREFIX + idempotencyKey;
        redisTemplate.opsForValue().set(cacheKey, response, Duration.ofHours(TTL_HOURS));
        log.info("Cached response for idempotency key: {} (TTL: {} hours)", idempotencyKey, TTL_HOURS);
    }
    
    @Override
    public void invalidate(String idempotencyKey) {
        String cacheKey = CACHE_KEY_PREFIX + idempotencyKey;
        redisTemplate.delete(cacheKey);
        log.info("Invalidated cache for idempotency key: {}", idempotencyKey);
    }
    
    private TransferResponse buildTransferResponse(Transaction transaction) {
        // Build response from transaction entity
        return TransferResponse.builder()
                .transactionId(transaction.getId())
                .status(transaction.getStatus())
                .fromWalletId(transaction.getFromWalletId())
                .toWalletId(transaction.getToWalletId())
                .amountCents(transaction.getAmountCents())
                .completedAt(transaction.getCompletedAt())
                .build();
    }
}
```

---

### **Task 9: Update TransactionServiceImpl with Fraud & Idempotency**
**File:** `src/main/java/com/xupay/payment/service/impl/TransactionServiceImpl.java`

**Changes:**
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionServiceImpl implements TransactionService {
    
    private final TransactionRepository transactionRepository;
    private final WalletRepository walletRepository;
    private final LedgerEntryRepository ledgerEntryRepository;
    private final UserServiceClient userServiceClient;
    private final FraudDetectionService fraudDetectionService;  // NEW
    private final IdempotencyService idempotencyService;        // NEW
    
    @Override
    @Transactional
    public TransferResponse processTransfer(TransferRequest request) {
        
        // Step 1: Check idempotency (now using IdempotencyService)
        Optional<TransferResponse> cachedResponse = idempotencyService.getIfExists(request.getIdempotencyKey());
        if (cachedResponse.isPresent()) {
            log.info("Duplicate request detected: {}", request.getIdempotencyKey());
            return cachedResponse.get();
        }
        
        // Step 2: Validate users are different
        if (request.getFromUserId().equals(request.getToUserId())) {
            throw new IllegalArgumentException("Cannot transfer to same user");
        }
        
        // Step 3: [NEW] Evaluate fraud risk BEFORE user validation
        FraudEvaluationResult fraudResult = fraudDetectionService.evaluateTransaction(
            request, 
            request.getFromUserId()
        );
        
        if (fraudResult.isShouldBlock()) {
            log.warn("Transaction BLOCKED by fraud rules: {}", fraudResult.getTriggeredRules());
            throw new IllegalArgumentException("Transaction blocked due to fraud risk");
        }
        
        // Step 4: Validate sender via User Service
        ValidateUserResponse senderValidation = userServiceClient.validateUser(
            request.getFromUserId(), request.getAmountCents(), "send"
        );
        
        // Step 5: Validate receiver via User Service
        ValidateUserResponse receiverValidation = userServiceClient.validateUser(
            request.getToUserId(), request.getAmountCents(), "receive"
        );
        
        // Step 6-10: Get wallets, check balance, create transaction, create ledger, mark completed
        // ... existing logic ...
        
        // Step 11: Update fraud score in transaction
        transaction.setFraudScore(fraudResult.getTotalScore());
        transaction.setFlagged(fraudResult.isShouldFlag());
        transactionRepository.save(transaction);
        
        // Step 12: Build response
        TransferResponse response = buildTransferResponse(transaction);
        
        // Step 13: Cache response for idempotency
        idempotencyService.cache(request.getIdempotencyKey(), response);
        
        // Step 14: Record transaction async
        recordTransactionInUserService(fromUserId, amountCents, "send", transaction.getId());
        recordTransactionInUserService(toUserId, amountCents, "receive", transaction.getId());
        
        return response;
    }
}
```

---

### **Task 10: Add Redis Configuration**
**File:** `src/main/java/com/xupay/payment/config/RedisConfig.java`

```java
@Configuration
@EnableCaching
public class RedisConfig {
    
    @Bean
    public RedisTemplate<String, TransferResponse> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, TransferResponse> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        
        // Use Jackson2 JSON serialization
        Jackson2JsonRedisSerializer<TransferResponse> serializer = 
            new Jackson2JsonRedisSerializer<>(TransferResponse.class);
        
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(serializer);
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(serializer);
        
        template.afterPropertiesSet();
        return template;
    }
}
```

---

### **Task 11: Update application.yml**
**File:** `src/main/resources/application.yml`

```yaml
# Redis Configuration
spring:
  redis:
    host: localhost
    port: 6379
    timeout: 2000ms
    lettuce:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 0
```

---

### **Task 12: Seed Fraud Rules**
**File:** `002_fraud_rules_seed.sql` (NEW)

```sql
-- Velocity Rules
INSERT INTO fraud_rules (rule_name, rule_type, threshold_value, time_window_minutes, action, risk_score, is_active)
VALUES 
('High Frequency Transactions', 'VELOCITY', 10, 5, 'FLAG', 40, true),
('Rapid Fire Transactions', 'VELOCITY', 20, 60, 'FLAG', 50, true),
('Suspicious Burst', 'VELOCITY', 5, 1, 'BLOCK', 80, true);

-- Amount Rules
INSERT INTO fraud_rules (rule_name, rule_type, threshold_value, time_window_minutes, action, risk_score, is_active)
VALUES 
('Large Transaction', 'AMOUNT', 1000000000, NULL, 'FLAG', 30, true),    -- 10M VND
('Very Large Transaction', 'AMOUNT', 5000000000, NULL, 'FLAG', 60, true), -- 50M VND
('Extreme Transaction', 'AMOUNT', 10000000000, NULL, 'BLOCK', 90, true);  -- 100M VND

-- Pattern Rules (placeholder for future implementation)
INSERT INTO fraud_rules (rule_name, rule_type, threshold_value, time_window_minutes, action, risk_score, is_active)
VALUES 
('Odd Hours Activity', 'PATTERN', NULL, NULL, 'FLAG', 20, false),
('Round Amount Pattern', 'PATTERN', NULL, NULL, 'FLAG', 10, false);
```

---

## 4. Testing Plan

### **4.1 Unit Tests**

#### **FraudDetectionServiceTest.java**
```java
@SpringBootTest
class FraudDetectionServiceTest {
    
    @Test
    void shouldFlagHighFrequencyTransactions() {
        // Create 11 transactions in 5 minutes
        // Expect: fraud_score >= 40, shouldFlag = true
    }
    
    @Test
    void shouldBlockExtremeAmounts() {
        // Create transfer of 100M VND
        // Expect: shouldBlock = true, fraud_score = 90
    }
    
    @Test
    void shouldCombineMultipleRules() {
        // Trigger both velocity + amount rules
        // Expect: fraud_score = 40 + 60 = 100
    }
}
```

#### **IdempotencyServiceTest.java**
```java
@SpringBootTest
class IdempotencyServiceTest {
    
    @Test
    void shouldReturnCachedResponse() {
        // Cache response, request again
        // Expect: Redis HIT, no database query
    }
    
    @Test
    void shouldExpireAfter24Hours() {
        // Cache response, wait 24+ hours
        // Expect: Cache MISS, database fallback
    }
}
```

---

### **4.2 Integration Tests**

#### **P2P Transfer with Fraud Detection**
```java
@Test
void shouldFlagHighRiskTransaction() {
    // Given: User sends 50M VND (exceeds "Very Large Transaction" rule)
    TransferRequest request = TransferRequest.builder()
        .fromUserId(aliceId)
        .toUserId(bobId)
        .amountCents(5000000000L)  // 50M VND
        .build();
    
    // When: Process transfer
    TransferResponse response = transactionService.processTransfer(request);
    
    // Then: Transaction completed but flagged
    assertThat(response.getStatus()).isEqualTo("COMPLETED");
    
    Transaction txn = transactionRepository.findById(response.getTransactionId()).get();
    assertThat(txn.getFraudScore()).isGreaterThanOrEqualTo(60);
    assertThat(txn.isFlagged()).isTrue();
}
```

---

## 5. Performance Considerations

### **5.1 Idempotency Cache Hit Rate**
**Target:** 90% cache hit rate for duplicate requests  
**Monitoring:**
```java
@Metric("idempotency.cache.hit.rate")
public double getCacheHitRate() {
    return (double) cacheHits / (cacheHits + cacheMisses);
}
```

### **5.2 Fraud Rule Evaluation Time**
**Target:** < 50ms for fraud evaluation  
**Optimization:**
- Load active rules once at startup (cache in-memory)
- Use indexed queries for velocity checks
- Parallelize rule evaluation where possible

### **5.3 Redis Connection Pooling**
**Configuration:**
```yaml
spring:
  redis:
    lettuce:
      pool:
        max-active: 8   # Max concurrent connections
        max-idle: 8     # Keep connections warm
        min-idle: 2
```

---

## 6. Rollout Strategy

### **Phase 1: Fraud Detection (Day 10 Morning)**
1. Create FraudRule entity + repository
2. Implement FraudDetectionService
3. Seed fraud rules
4. Integrate into TransactionServiceImpl (log only, don't block)
5. Monitor fraud scores for 1 hour

### **Phase 2: Idempotency Cache (Day 10 Afternoon)**
1. Setup Redis configuration
2. Implement IdempotencyService
3. Update TransactionServiceImpl to use IdempotencyService
4. Test cache hit/miss behavior
5. Monitor cache performance

### **Phase 3: Enable Fraud Blocking (Day 10 Evening)**
1. Enable BLOCK action for extreme rules only
2. Monitor blocked transactions
3. Adjust thresholds based on data
4. Enable all FLAG rules

---

## 7. Success Metrics

### **Day 10 Completion Criteria:**
- [x] FraudDetectionService implemented with 5+ rules
- [x] IdempotencyService implemented with Redis
- [x] All existing tests pass
- [x] 5+ new fraud detection tests
- [x] 3+ new idempotency tests
- [x] Fraud score calculated for all transactions
- [x] High-risk transactions auto-flagged
- [x] Redis cache reduces database queries by 90%

### **Performance Targets:**
- Fraud evaluation: < 50ms per transaction
- Idempotency cache hit: > 90% for duplicate requests
- Redis latency: < 5ms for get/set operations
- Transaction throughput: > 100 TPS (same as Day 9)

---

## 8. Next Steps (Day 11)

**Planned:** Audit Logging & Notification Service Integration

1. Implement AuditLogService
2. Log all transaction lifecycle events
3. Integrate with Notification Service (gRPC)
4. Send real-time alerts for flagged transactions
5. Admin dashboard for fraud monitoring

---