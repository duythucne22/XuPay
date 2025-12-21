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
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for FraudDetectionServiceImpl
 * Tests fraud rule evaluation logic with mocked dependencies
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Fraud Detection Service Tests")
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
        // Use real ObjectMapper - don't mock JSON parsing
        com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
        fraudDetectionService = new FraudDetectionServiceImpl(fraudRuleRepository, transactionRepository, objectMapper);
        
        testUserId = UUID.randomUUID();
        testRequest = TestDataBuilder.createTransferRequest(
            testUserId,
            UUID.randomUUID(),
            100_000L  // 1,000 VND
        );
    }

    @Test
    @DisplayName("Should return zero score when no rules are active")
    void evaluateTransaction_NoRules_ReturnsZeroScore() {
        // Given
        when(fraudRuleRepository.findByIsActiveTrueOrderByRiskScorePenaltyDesc())
            .thenReturn(List.of());

        // When
        FraudEvaluationResult result = fraudDetectionService.evaluateTransaction(testRequest, testUserId);

        // Then
        assertThat(result.getTotalScore()).isEqualTo(0);
        assertThat(result.isShouldFlag()).isFalse();
        assertThat(result.isShouldBlock()).isFalse();
        assertThat(result.getRecommendedAction()).isEqualTo("ALLOW");
        assertThat(result.getTriggeredRules()).isEmpty();
    }

    @Test
    @DisplayName("Should add score when velocity rule is triggered")
    void evaluateTransaction_VelocityRuleTriggered_AddsScore() {
        // Given: Rule triggers at 10 transactions in 1 hour
        FraudRule velocityRule = TestDataBuilder.createVelocityRule(
            "Velocity 10/hour", 10, 60, 40, FraudAction.FLAG
        );
        when(fraudRuleRepository.findByIsActiveTrueOrderByRiskScorePenaltyDesc())
            .thenReturn(List.of(velocityRule));
        
        // Simulate 11 transactions in last hour (triggers rule)
        when(transactionRepository.countByFromUserIdAndCreatedAtAfter(
            eq(testUserId), 
            any(Instant.class)
        )).thenReturn(11L);

        // When
        FraudEvaluationResult result = fraudDetectionService.evaluateTransaction(testRequest, testUserId);

        // Then
        assertThat(result.getTotalScore()).isEqualTo(40);
        assertThat(result.isShouldFlag()).isFalse(); // Score < 70
        assertThat(result.isShouldBlock()).isFalse();
        assertThat(result.getTriggeredRules()).contains("Velocity 10/hour");
        assertThat(result.getRecommendedAction()).isEqualTo("ALLOW");
    }

    @Test
    @DisplayName("Should not trigger velocity rule when below threshold")
    void evaluateTransaction_VelocityBelowThreshold_NoTrigger() {
        // Given: Rule triggers at 10 transactions
        FraudRule velocityRule = TestDataBuilder.createVelocityRule(
            "Velocity 10/hour", 10, 60, 40, FraudAction.FLAG
        );
        when(fraudRuleRepository.findByIsActiveTrueOrderByRiskScorePenaltyDesc())
            .thenReturn(List.of(velocityRule));
        
        // Simulate only 5 transactions (below threshold)
        when(transactionRepository.countByFromUserIdAndCreatedAtAfter(
            any(), any()
        )).thenReturn(5L);

        // When
        FraudEvaluationResult result = fraudDetectionService.evaluateTransaction(testRequest, testUserId);

        // Then
        assertThat(result.getTotalScore()).isEqualTo(0);
        assertThat(result.getTriggeredRules()).isEmpty();
    }

    @Test
    @DisplayName("Should flag transaction when amount exceeds threshold")
    void evaluateTransaction_HighAmountRule_FlagsTransaction() {
        // Given: Amount rule for > 5M VND (500M cents) with BLOCK action
        FraudRule amountRule = TestDataBuilder.createAmountRule(
            "High Amount 5M", 500_000_000L, 80, FraudAction.BLOCK
        );
        when(fraudRuleRepository.findByIsActiveTrueOrderByRiskScorePenaltyDesc())
            .thenReturn(List.of(amountRule));

        // Large transfer: 6M VND (clearly above 5M threshold)
        TransferRequest largeTransfer = TestDataBuilder.createTransferRequest(
            testUserId, UUID.randomUUID(), 600_000_000L
        );

        // When
        FraudEvaluationResult result = fraudDetectionService.evaluateTransaction(largeTransfer, testUserId);

        // Then
        assertThat(result.getTotalScore()).isEqualTo(80);
        assertThat(result.isShouldFlag()).isTrue();  // Score >= 70
        assertThat(result.isShouldBlock()).isTrue();  // Action = BLOCK
        assertThat(result.getRecommendedAction()).isEqualTo("BLOCK");
        assertThat(result.getTriggeredRules()).contains("High Amount 5M");
    }

    @Test
    @DisplayName("Should not trigger amount rule when below threshold")
    void evaluateTransaction_AmountBelowThreshold_NoTrigger() {
        // Given: Amount rule for > 5M VND
        FraudRule amountRule = TestDataBuilder.createAmountRule(
            "High Amount 5M", 500_000_000L, 80, FraudAction.FLAG
        );
        when(fraudRuleRepository.findByIsActiveTrueOrderByRiskScorePenaltyDesc())
            .thenReturn(List.of(amountRule));

        // Small transfer: 1M VND (below threshold)
        TransferRequest smallTransfer = TestDataBuilder.createTransferRequest(
            testUserId, UUID.randomUUID(), 100_000_000L
        );

        // When
        FraudEvaluationResult result = fraudDetectionService.evaluateTransaction(smallTransfer, testUserId);

        // Then
        assertThat(result.getTotalScore()).isEqualTo(0);
        assertThat(result.getTriggeredRules()).isEmpty();
    }

    @Test
    @DisplayName("Should accumulate scores from multiple triggered rules")
    void evaluateTransaction_MultipleRules_AccumulatesScore() {
        // Given: 2 rules both will be triggered
        FraudRule rule1 = TestDataBuilder.createVelocityRule(
            "Velocity", 10, 60, 40, FraudAction.FLAG
        );
        FraudRule rule2 = TestDataBuilder.createAmountRule(
            "Medium Amount", 100_000_000L, 35, FraudAction.FLAG
        );
        when(fraudRuleRepository.findByIsActiveTrueOrderByRiskScorePenaltyDesc())
            .thenReturn(List.of(rule1, rule2));

        // Velocity triggered (11 transactions)
        when(transactionRepository.countByFromUserIdAndCreatedAtAfter(
            any(), any()
        )).thenReturn(11L);

        // Amount triggered (150M cents = 1.5M VND > threshold)
        TransferRequest mediumTransfer = TestDataBuilder.createTransferRequest(
            testUserId, UUID.randomUUID(), 150_000_000L
        );

        // When
        FraudEvaluationResult result = fraudDetectionService.evaluateTransaction(mediumTransfer, testUserId);

        // Then
        assertThat(result.getTotalScore()).isEqualTo(75);  // 40 + 35
        assertThat(result.isShouldFlag()).isTrue();  // >= 70
        assertThat(result.isShouldBlock()).isFalse(); // < 80
        assertThat(result.getRecommendedAction()).isEqualTo("FLAG");
        assertThat(result.getTriggeredRules()).hasSize(2);
        assertThat(result.getTriggeredRules()).containsExactlyInAnyOrder("Velocity", "Medium Amount");
    }

    @Test
    @DisplayName("Should detect round amount pattern")
    void evaluateTransaction_RoundAmountPattern_DetectsPattern() {
        // Given: Pattern rule for amounts divisible by 1M
        FraudRule patternRule = TestDataBuilder.createPatternRule(
            "Round Amount", "ROUND_AMOUNT", 1_000_000L, 20, FraudAction.FLAG
        );
        when(fraudRuleRepository.findByIsActiveTrueOrderByRiskScorePenaltyDesc())
            .thenReturn(List.of(patternRule));

        // Transfer exactly 5M VND (500M cents, divisible by 1M)
        TransferRequest roundTransfer = TestDataBuilder.createTransferRequest(
            testUserId, UUID.randomUUID(), 500_000_000L
        );

        // When
        FraudEvaluationResult result = fraudDetectionService.evaluateTransaction(roundTransfer, testUserId);

        // Then
        assertThat(result.getTotalScore()).isEqualTo(20);
        assertThat(result.getTriggeredRules()).contains("Round Amount");
    }

    @Test
    @DisplayName("Should ignore inactive rules")
    void evaluateTransaction_InactiveRule_Ignored() {
        // Given: Inactive rule
        FraudRule inactiveRule = TestDataBuilder.createAmountRule(
            "Inactive", 100_000_000L, 50, FraudAction.FLAG
        );
        inactiveRule.setIsActive(false);
        
        // Repository returns only active rules
        when(fraudRuleRepository.findByIsActiveTrueOrderByRiskScorePenaltyDesc())
            .thenReturn(List.of());

        // When
        FraudEvaluationResult result = fraudDetectionService.evaluateTransaction(testRequest, testUserId);

        // Then
        assertThat(result.getTotalScore()).isEqualTo(0);
    }

    @Test
    @DisplayName("Should recommend BLOCK when score >= 80")
    void evaluateTransaction_ScoreAbove80_RecommendsBlock() {
        // Given: Rule with 90 score penalty
        FraudRule blockRule = TestDataBuilder.createAmountRule(
            "Very High Amount", 500_000_000L, 90, FraudAction.BLOCK
        );
        when(fraudRuleRepository.findByIsActiveTrueOrderByRiskScorePenaltyDesc())
            .thenReturn(List.of(blockRule));

        TransferRequest veryLargeTransfer = TestDataBuilder.createTransferRequest(
            testUserId, UUID.randomUUID(), 600_000_000L
        );

        // When
        FraudEvaluationResult result = fraudDetectionService.evaluateTransaction(veryLargeTransfer, testUserId);

        // Then
        assertThat(result.getTotalScore()).isEqualTo(90);
        assertThat(result.isShouldBlock()).isTrue();
        assertThat(result.getRecommendedAction()).isEqualTo("BLOCK");
    }

    @Test
    @DisplayName("Should recommend FLAG when score >= 70 and < 80")
    void evaluateTransaction_ScoreBetween70And80_RecommendsFlag() {
        // Given: Rule with 75 score penalty
        FraudRule flagRule = TestDataBuilder.createAmountRule(
            "High Amount", 200_000_000L, 75, FraudAction.FLAG
        );
        when(fraudRuleRepository.findByIsActiveTrueOrderByRiskScorePenaltyDesc())
            .thenReturn(List.of(flagRule));

        TransferRequest highTransfer = TestDataBuilder.createTransferRequest(
            testUserId, UUID.randomUUID(), 250_000_000L
        );

        // When
        FraudEvaluationResult result = fraudDetectionService.evaluateTransaction(highTransfer, testUserId);

        // Then
        assertThat(result.getTotalScore()).isEqualTo(75);
        assertThat(result.isShouldFlag()).isTrue();
        assertThat(result.isShouldBlock()).isFalse();
        assertThat(result.getRecommendedAction()).isEqualTo("FLAG");
    }

    @Test
    @DisplayName("Should recommend ALLOW when score < 70")
    void evaluateTransaction_ScoreBelow70_RecommendsAllow() {
        // Given: Rule with 40 score penalty
        FraudRule lowRule = TestDataBuilder.createAmountRule(
            "Medium Amount", 100_000_000L, 40, FraudAction.FLAG
        );
        when(fraudRuleRepository.findByIsActiveTrueOrderByRiskScorePenaltyDesc())
            .thenReturn(List.of(lowRule));

        TransferRequest mediumTransfer = TestDataBuilder.createTransferRequest(
            testUserId, UUID.randomUUID(), 150_000_000L
        );

        // When
        FraudEvaluationResult result = fraudDetectionService.evaluateTransaction(mediumTransfer, testUserId);

        // Then
        assertThat(result.getTotalScore()).isEqualTo(40);
        assertThat(result.isShouldFlag()).isFalse();
        assertThat(result.isShouldBlock()).isFalse();
        assertThat(result.getRecommendedAction()).isEqualTo("ALLOW");
    }

    @Test
    @DisplayName("Should handle rapid succession velocity check")
    void evaluateTransaction_RapidSuccession_TriggersRule() {
        // Given: Rapid succession rule (5 txns in 5 minutes)
        FraudRule rapidRule = TestDataBuilder.createVelocityRule(
            "Rapid 5/5min", 5, 5, 50, FraudAction.FLAG
        );
        when(fraudRuleRepository.findByIsActiveTrueOrderByRiskScorePenaltyDesc())
            .thenReturn(List.of(rapidRule));
        
        // Simulate 6 transactions in last 5 minutes
        when(transactionRepository.countByFromUserIdAndCreatedAtAfter(
            any(), any()
        )).thenReturn(6L);

        // When
        FraudEvaluationResult result = fraudDetectionService.evaluateTransaction(testRequest, testUserId);

        // Then
        assertThat(result.getTotalScore()).isEqualTo(50);
        assertThat(result.getTriggeredRules()).contains("Rapid 5/5min");
    }
}
