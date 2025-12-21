# Day 11: API Testing & Integration Tests - Implementation Plan

**Date:** December 19, 2025  
**Dependencies:** Day 10 Fraud Detection (COMPLETED ✅)  
**Estimated Time:** 5-6 hours  
**Status:** 🚀 READY TO START

---

## 🎯 OBJECTIVES

### Primary Goals:
1. ✅ Create comprehensive unit test suite (6 test files)
2. ✅ Create integration tests with TestContainers (3 test files)
3. ✅ Document all API endpoints with examples
4. ✅ Create PowerShell test script for manual testing
5. ✅ Verify fraud integration works end-to-end

### Success Criteria:
- ✅ All unit tests pass (>80% code coverage)
- ✅ All integration tests pass
- ✅ API documentation complete with curl examples
- ✅ Test script validates full transfer flow
- ✅ Zero compilation errors

---

## 📊 CURRENT STATUS VERIFICATION

### ✅ Confirmed Working (from previous days):
- **Infrastructure:** postgres-payment (5433), redis (6379), rabbitmq (5672)
- **Database:** 7 tables, 8 fraud rules seeded
- **Services:** FraudDetectionService, IdempotencyService, TransactionService
- **Build:** `mvn clean compile` succeeds
- **Redis Config:** RedisTemplate<String, TransferResponse> bean configured

### ⚠️ CRITICAL LESSONS FROM USER SERVICE:
1. **Test isolation:** Use `@DirtiesContext` after tests modifying state
2. **Mock carefully:** Mock external dependencies (gRPC, Redis), use real DB for integration
3. **ArgumentCaptor:** Verify exact values passed to mocked methods
4. **AssertJ:** Use fluent assertions for better error messages
5. **Test data:** Create builder methods for clean test data setup

---

## 🛠️ IMPLEMENTATION TASKS

### **Phase 1: Setup Test Infrastructure (1 hour)**

#### **Task 1.1: Update pom.xml with Test Dependencies**
**File:** `pom.xml`

Add these dependencies (after existing test dependencies):

```xml
<!-- Testing - Additional -->
<dependency>
    <groupId>io.rest-assured</groupId>
    <artifactId>rest-assured</artifactId>
    <version>5.4.0</version>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>io.rest-assured</groupId>
    <artifactId>spring-mock-mvc</artifactId>
    <version>5.4.0</version>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>testcontainers</artifactId>
    <version>1.19.3</version>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>postgresql</artifactId>
    <version>1.19.3</version>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>1.19.3</version>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>com.redis.testcontainers</groupId>
    <artifactId>testcontainers-redis</artifactId>
    <version>1.6.4</version>
    <scope>test</scope>
</dependency>
```

#### **Task 1.2: Create Test Directory Structure**

```
src/test/java/com/xupay/payment/
├── service/
│   ├── FraudDetectionServiceTest.java
│   ├── IdempotencyServiceTest.java
│   └── TransactionServiceTest.java
├── integration/
│   ├── TransferIntegrationTest.java
│   ├── FraudIntegrationTest.java
│   └── IdempotencyIntegrationTest.java
└── util/
    └── TestDataBuilder.java
```

#### **Task 1.3: Create Test Data Builder**
**File:** `src/test/java/com/xupay/payment/util/TestDataBuilder.java`

```java
package com.xupay.payment.util;

import com.xupay.payment.dto.TransferRequest;
import com.xupay.payment.entity.*;
import com.xupay.payment.entity.enums.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Test data builder utility for creating test objects
 */
public class TestDataBuilder {
    
    public static Wallet createTestWallet(UUID userId, String glAccountCode) {
        Wallet wallet = new Wallet();
        wallet.setId(UUID.randomUUID());
        wallet.setUserId(userId);
        wallet.setGlAccountCode(glAccountCode);
        wallet.setWalletType(WalletType.PERSONAL);
        wallet.setIsActive(true);
        wallet.setIsFrozen(false);
        wallet.setCreatedAt(Instant.now());
        wallet.setUpdatedAt(Instant.now());
        return wallet;
    }
    
    public static Transaction createTestTransaction(
        UUID fromWalletId, 
        UUID toWalletId, 
        Long amountCents
    ) {
        Transaction txn = new Transaction();
        txn.setId(UUID.randomUUID());
        txn.setIdempotencyKey(UUID.randomUUID());
        txn.setFromWalletId(fromWalletId);
        txn.setToWalletId(toWalletId);
        txn.setFromUserId(UUID.randomUUID());
        txn.setToUserId(UUID.randomUUID());
        txn.setAmountCents(amountCents);
        txn.setType(TransactionType.TRANSFER);
        txn.setStatus(TransactionStatus.PENDING);
        txn.setCreatedAt(Instant.now());
        return txn;
    }
    
    public static FraudRule createVelocityRule(
        String ruleName, 
        int maxTransactions, 
        int timeWindowMinutes,
        int riskScore,
        FraudAction action
    ) {
        FraudRule rule = new FraudRule();
        rule.setId(UUID.randomUUID());
        rule.setRuleName(ruleName);
        rule.setRuleType(RuleType.VELOCITY);
        rule.setParameters(
            String.format("{\"maxTransactions\": %d, \"timeWindowMinutes\": %d}", 
                maxTransactions, timeWindowMinutes)
        );
        rule.setRiskScorePenalty(riskScore);
        rule.setAction(action);
        rule.setIsActive(true);
        return rule;
    }
    
    public static FraudRule createAmountRule(
        String ruleName,
        long thresholdCents,
        int riskScore,
        FraudAction action
    ) {
        FraudRule rule = new FraudRule();
        rule.setId(UUID.randomUUID());
        rule.setRuleName(ruleName);
        rule.setRuleType(RuleType.AMOUNT_THRESHOLD);
        rule.setParameters(
            String.format("{\"thresholdCents\": %d}", thresholdCents)
        );
        rule.setRiskScorePenalty(riskScore);
        rule.setAction(action);
        rule.setIsActive(true);
        return rule;
    }
    
    public static TransferRequest createTransferRequest(
        UUID fromUserId,
        UUID toUserId,
        Long amountCents
    ) {
        return TransferRequest.builder()
            .idempotencyKey(UUID.randomUUID())
            .fromUserId(fromUserId)
            .toUserId(toUserId)
            .amountCents(amountCents)
            .description("Test transfer")
            .userAgent("TestAgent/1.0")
            .build();
    }
}
```

---

### **Phase 2: Unit Tests (2.5 hours)**

#### **Task 2.1: FraudDetectionServiceTest**
**File:** `src/test/java/com/xupay/payment/service/FraudDetectionServiceTest.java`

**Test Cases:**
1. ✅ Test velocity rule triggers correctly (10+ txns in 1 hour)
2. ✅ Test amount threshold rule (large transaction)
3. ✅ Test round amount pattern detection
4. ✅ Test multiple rules accumulate scores
5. ✅ Test BLOCK action at score >= 80
6. ✅ Test FLAG action at score >= 70
7. ✅ Test inactive rules are ignored
8. ✅ Test empty rules return score 0

```java
package com.xupay.payment.service;

import com.xupay.payment.dto.FraudEvaluationResult;
import com.xupay.payment.dto.TransferRequest;
import com.xupay.payment.entity.FraudRule;
import com.xupay.payment.entity.enums.FraudAction;
import com.xupay.payment.repository.FraudRuleRepository;
import com.xupay.payment.repository.TransactionRepository;
import com.xupay.payment.service.impl.FraudDetectionServiceImpl;
import com.xupay.payment.util.TestDataBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FraudDetectionServiceTest {

    @Mock
    private FraudRuleRepository fraudRuleRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private FraudDetectionServiceImpl fraudDetectionService;

    private UUID testUserId;
    private TransferRequest testRequest;

    @BeforeEach
    void setUp() {
        testUserId = UUID.randomUUID();
        testRequest = TestDataBuilder.createTransferRequest(
            testUserId,
            UUID.randomUUID(),
            100_000L  // 1,000 VND
        );
    }

    @Test
    void evaluateTransaction_NoRules_ReturnsZeroScore() {
        // Given
        when(fraudRuleRepository.findByIsActiveTrueOrderByRiskScorePenaltyDesc())
            .thenReturn(List.of());

        // When
        FraudEvaluationResult result = fraudDetectionService.evaluateTransaction(testRequest);

        // Then
        assertThat(result.getTotalScore()).isEqualTo(0);
        assertThat(result.isFlagged()).isFalse();
        assertThat(result.isBlocked()).isFalse();
        assertThat(result.getRecommendedAction()).isEqualTo("ALLOW");
    }

    @Test
    void evaluateTransaction_VelocityRuleTriggered_AddsScore() {
        // Given: 10 transactions in last hour rule
        FraudRule velocityRule = TestDataBuilder.createVelocityRule(
            "Velocity 10/hour", 10, 60, 40, FraudAction.FLAG
        );
        when(fraudRuleRepository.findByIsActiveTrueOrderByRiskScorePenaltyDesc())
            .thenReturn(List.of(velocityRule));
        
        // Simulate 11 transactions in last hour
        when(transactionRepository.countByFromUserIdAndCreatedAtAfter(
            eq(testUserId), 
            any(Instant.class)
        )).thenReturn(11L);

        // When
        FraudEvaluationResult result = fraudDetectionService.evaluateTransaction(testRequest);

        // Then
        assertThat(result.getTotalScore()).isEqualTo(40);
        assertThat(result.isFlagged()).isFalse(); // Score < 70
        assertThat(result.isBlocked()).isFalse();
        assertThat(result.getTriggeredRules()).contains("Velocity 10/hour");
    }

    @Test
    void evaluateTransaction_HighAmountRule_FlagsTransaction() {
        // Given: Amount > 5M VND = 500M cents
        FraudRule amountRule = TestDataBuilder.createAmountRule(
            "High Amount 5M", 500_000_000L, 80, FraudAction.FLAG
        );
        when(fraudRuleRepository.findByIsActiveTrueOrderByRiskScorePenaltyDesc())
            .thenReturn(List.of(amountRule));

        // Large transfer
        TransferRequest largeTransfer = TestDataBuilder.createTransferRequest(
            testUserId, UUID.randomUUID(), 600_000_000L  // 6M VND
        );

        // When
        FraudEvaluationResult result = fraudDetectionService.evaluateTransaction(largeTransfer);

        // Then
        assertThat(result.getTotalScore()).isEqualTo(80);
        assertThat(result.isFlagged()).isTrue();  // Score >= 70
        assertThat(result.isBlocked()).isTrue();  // Score >= 80
        assertThat(result.getRecommendedAction()).isEqualTo("BLOCK");
    }

    @Test
    void evaluateTransaction_MultipleRules_AccumulatesScore() {
        // Given: 2 rules both triggered
        FraudRule rule1 = TestDataBuilder.createVelocityRule(
            "Velocity", 10, 60, 40, FraudAction.FLAG
        );
        FraudRule rule2 = TestDataBuilder.createAmountRule(
            "Medium Amount", 100_000_000L, 35, FraudAction.FLAG
        );
        when(fraudRuleRepository.findByIsActiveTrueOrderByRiskScorePenaltyDesc())
            .thenReturn(List.of(rule1, rule2));

        when(transactionRepository.countByFromUserIdAndCreatedAtAfter(
            any(), any()
        )).thenReturn(11L);

        TransferRequest mediumTransfer = TestDataBuilder.createTransferRequest(
            testUserId, UUID.randomUUID(), 150_000_000L
        );

        // When
        FraudEvaluationResult result = fraudDetectionService.evaluateTransaction(mediumTransfer);

        // Then
        assertThat(result.getTotalScore()).isEqualTo(75);  // 40 + 35
        assertThat(result.isFlagged()).isTrue();  // >= 70
        assertThat(result.isBlocked()).isFalse(); // < 80
        assertThat(result.getRecommendedAction()).isEqualTo("FLAG");
        assertThat(result.getTriggeredRules()).hasSize(2);
    }

    @Test
    void evaluateTransaction_InactiveRule_Ignored() {
        // Given: Inactive rule
        FraudRule inactiveRule = TestDataBuilder.createAmountRule(
            "Inactive", 100_000_000L, 50, FraudAction.FLAG
        );
        inactiveRule.setIsActive(false);
        
        when(fraudRuleRepository.findByIsActiveTrueOrderByRiskScorePenaltyDesc())
            .thenReturn(List.of());  // Active rules only

        // When
        FraudEvaluationResult result = fraudDetectionService.evaluateTransaction(testRequest);

        // Then
        assertThat(result.getTotalScore()).isEqualTo(0);
    }
}
```

---

#### **Task 2.2: IdempotencyServiceTest**
**File:** `src/test/java/com/xupay/payment/service/IdempotencyServiceTest.java`

**Test Cases:**
1. ✅ Test cache hit returns cached response
2. ✅ Test cache miss queries database
3. ✅ Test cache stores response with 24h TTL
4. ✅ Test invalidate removes from cache and database
5. ✅ Test exists returns true for cached key

```java
package com.xupay.payment.service;

import com.xupay.payment.dto.TransferResponse;
import com.xupay.payment.entity.IdempotencyCache;
import com.xupay.payment.entity.enums.TransactionStatus;
import com.xupay.payment.repository.IdempotencyCacheRepository;
import com.xupay.payment.service.impl.IdempotencyServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IdempotencyServiceTest {

    @Mock
    private RedisTemplate<String, TransferResponse> redisTemplate;

    @Mock
    private ValueOperations<String, TransferResponse> valueOperations;

    @Mock
    private IdempotencyCacheRepository idempotencyCacheRepository;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private IdempotencyServiceImpl idempotencyService;

    private UUID testIdempotencyKey;
    private TransferResponse testResponse;

    @BeforeEach
    void setUp() {
        testIdempotencyKey = UUID.randomUUID();
        testResponse = TransferResponse.builder()
            .transactionId(UUID.randomUUID())
            .status(TransactionStatus.COMPLETED)
            .amountCents(100_000L)
            .completedAt(LocalDateTime.now())
            .build();

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void getIfExists_CacheHit_ReturnsFromRedis() {
        // Given
        String expectedKey = "idempotency:" + testIdempotencyKey;
        when(valueOperations.get(expectedKey)).thenReturn(testResponse);

        // When
        Optional<TransferResponse> result = idempotencyService.getIfExists(testIdempotencyKey);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getTransactionId()).isEqualTo(testResponse.getTransactionId());
        verify(idempotencyCacheRepository, never()).findByIdempotencyKey(any());
    }

    @Test
    void getIfExists_CacheMiss_FallsBackToDatabase() throws Exception {
        // Given: Redis miss
        String redisKey = "idempotency:" + testIdempotencyKey;
        when(valueOperations.get(redisKey)).thenReturn(null);

        // Database has it
        IdempotencyCache dbCache = new IdempotencyCache();
        dbCache.setIdempotencyKey(testIdempotencyKey);
        dbCache.setResponseJson("{\"transactionId\":\"" + testResponse.getTransactionId() + "\"}");
        when(idempotencyCacheRepository.findByIdempotencyKey(testIdempotencyKey))
            .thenReturn(Optional.of(dbCache));
        when(objectMapper.readValue(anyString(), eq(TransferResponse.class)))
            .thenReturn(testResponse);

        // When
        Optional<TransferResponse> result = idempotencyService.getIfExists(testIdempotencyKey);

        // Then
        assertThat(result).isPresent();
        verify(idempotencyCacheRepository).findByIdempotencyKey(testIdempotencyKey);
    }

    @Test
    void cache_StoresInRedisAndDatabase() throws Exception {
        // Given
        when(objectMapper.writeValueAsString(testResponse))
            .thenReturn("{\"transactionId\":\"test\"}");

        // When
        idempotencyService.cache(testIdempotencyKey, testResponse);

        // Then
        // Verify Redis storage
        ArgumentCaptor<String> keyCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<TransferResponse> responseCaptor = ArgumentCaptor.forClass(TransferResponse.class);
        ArgumentCaptor<Duration> durationCaptor = ArgumentCaptor.forClass(Duration.class);
        
        verify(valueOperations).set(
            keyCaptor.capture(), 
            responseCaptor.capture(), 
            durationCaptor.capture()
        );
        
        assertThat(keyCaptor.getValue()).isEqualTo("idempotency:" + testIdempotencyKey);
        assertThat(durationCaptor.getValue()).isEqualTo(Duration.ofHours(24));

        // Verify Database storage
        ArgumentCaptor<IdempotencyCache> dbCaptor = ArgumentCaptor.forClass(IdempotencyCache.class);
        verify(idempotencyCacheRepository).save(dbCaptor.capture());
        
        IdempotencyCache saved = dbCaptor.getValue();
        assertThat(saved.getIdempotencyKey()).isEqualTo(testIdempotencyKey);
        assertThat(saved.getTransactionId()).isEqualTo(testResponse.getTransactionId());
    }

    @Test
    void exists_CacheHit_ReturnsTrue() {
        // Given
        when(valueOperations.get(anyString())).thenReturn(testResponse);

        // When
        boolean result = idempotencyService.exists(testIdempotencyKey);

        // Then
        assertThat(result).isTrue();
    }

    @Test
    void exists_CacheMissAndDbMiss_ReturnsFalse() {
        // Given
        when(valueOperations.get(anyString())).thenReturn(null);
        when(idempotencyCacheRepository.findByIdempotencyKey(testIdempotencyKey))
            .thenReturn(Optional.empty());

        // When
        boolean result = idempotencyService.exists(testIdempotencyKey);

        // Then
        assertThat(result).isFalse();
    }

    @Test
    void invalidate_RemovesFromCacheAndDatabase() {
        // When
        idempotencyService.invalidate(testIdempotencyKey);

        // Then
        verify(redisTemplate).delete("idempotency:" + testIdempotencyKey);
        verify(idempotencyCacheRepository).deleteByIdempotencyKey(testIdempotencyKey);
    }
}
```

---

#### **Task 2.3: TransactionServiceTest**
**File:** `src/test/java/com/xupay/payment/service/TransactionServiceTest.java`

**Test Cases:**
1. ✅ Test idempotency cache hit returns immediately
2. ✅ Test sender validation via gRPC
3. ✅ Test receiver validation via gRPC
4. ✅ Test fraud evaluation blocks high-risk
5. ✅ Test wallet not found throws exception
6. ✅ Test frozen wallet throws exception
7. ✅ Test insufficient balance throws exception
8. ✅ Test successful transfer creates ledger entries
9. ✅ Test response cached after success

---

### **Phase 3: Integration Tests (1.5 hours)**

#### **Task 3.1: TransferIntegrationTest**
**File:** `src/test/java/com/xupay/payment/integration/TransferIntegrationTest.java`

Use TestContainers for PostgreSQL and Redis.

---

### **Phase 4: API Documentation & Test Script (1 hour)**

#### **Task 4.1: Create API Test Script**
**File:** `test-payment-api.ps1`

#### **Task 4.2: Create API Documentation**
**File:** `API_TESTING_GUIDE.md`

---

## 📊 EXPECTED OUTCOMES

### Test Coverage:
- **Service Layer:** >85% coverage
- **Controller Layer:** >70% coverage
- **Integration:** 100% critical paths

### Test Execution Time:
- Unit tests: <10 seconds
- Integration tests: <30 seconds
- Total: <1 minute

---

## ⚠️ POTENTIAL ISSUES & SOLUTIONS

### Issue 1: gRPC Client Mock Complexity
**Solution:** Use `@MockBean` instead of `@Mock` for Spring-managed clients

### Issue 2: Redis Connection in Tests
**Solution:** Use embedded Redis or TestContainers Redis

### Issue 3: Transaction Isolation
**Solution:** Use `@Transactional` with `@DirtiesContext` after state-modifying tests

---

## ✅ VALIDATION CHECKLIST

Before marking Day 11 complete:

- [ ] All unit tests pass: `mvn test`
- [ ] All integration tests pass: `mvn verify`
- [ ] Test coverage report generated: `mvn jacoco:report`
- [ ] API test script runs successfully
- [ ] API documentation complete with examples
- [ ] No compilation warnings
- [ ] Memory bank updated with test results

---

**END OF PLAN**
