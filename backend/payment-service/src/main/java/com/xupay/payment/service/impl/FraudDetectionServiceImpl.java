package com.xupay.payment.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xupay.payment.dto.FraudEvaluationResult;
import com.xupay.payment.dto.TransferRequest;
import com.xupay.payment.entity.FraudRule;
import com.xupay.payment.entity.enums.FraudAction;
import com.xupay.payment.entity.enums.RuleType;
import com.xupay.payment.repository.FraudRuleRepository;
import com.xupay.payment.repository.TransactionRepository;
import com.xupay.payment.service.FraudDetectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * FraudDetectionServiceImpl
 * Implementation of rule-based fraud detection engine.
 * 
 * Rule Evaluation Process:
 * 1. Load all active fraud rules from database
 * 2. For each rule, check based on rule type:
 *    - VELOCITY: Count recent transactions
 *    - AMOUNT_THRESHOLD: Compare transaction amount
 *    - PATTERN_MATCH: Detect suspicious patterns
 *    - GEO_ANOMALY: Check IP location (future)
 *    - BLACKLIST: Check blacklist (future)
 * 3. Calculate cumulative fraud score
 * 4. Determine if should FLAG (score >= 70) or BLOCK (any BLOCK rule)
 * 
 * Example:
 * - Rule 1 (VELOCITY): 10 txns/hour, score=40 → TRIGGERED (user has 12 txns)
 * - Rule 2 (AMOUNT): >$1M, score=50 → NOT TRIGGERED (txn=$500k)
 * - Total Score: 40 → FLAG=false, BLOCK=false
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FraudDetectionServiceImpl implements FraudDetectionService {

    private final FraudRuleRepository fraudRuleRepository;
    private final TransactionRepository transactionRepository;
    private final ObjectMapper objectMapper;

    @Override
    public FraudEvaluationResult evaluateTransaction(TransferRequest request, UUID senderUserId) {
        log.info("Evaluating fraud risk: senderId={}, amount={}, idempotencyKey={}", 
                 senderUserId, request.getAmountCents(), request.getIdempotencyKey());

        List<FraudRule> activeRules = getActiveRules();
        int totalScore = 0;
        boolean shouldBlock = false;
        List<String> triggeredRules = new ArrayList<>();
        Map<String, String> details = new HashMap<>();

        // Evaluate each rule
        for (FraudRule rule : activeRules) {
            boolean triggered = evaluateRule(rule, request, senderUserId, details);
            
            if (triggered) {
                triggeredRules.add(rule.getRuleName());
                totalScore += rule.getRiskScorePenalty();
                
                log.info("Fraud rule TRIGGERED: rule={}, score={}, action={}", 
                         rule.getRuleName(), rule.getRiskScorePenalty(), rule.getAction());
                
                // Check if should block
                if (rule.getAction() == FraudAction.BLOCK) {
                    shouldBlock = true;
                }
            }
        }

        boolean shouldFlag = totalScore >= 70;
        
        String recommendedAction = determineRecommendedAction(shouldBlock, shouldFlag, totalScore);
        
        log.info("Fraud evaluation complete: totalScore={}, shouldBlock={}, shouldFlag={}, triggeredRules={}, action={}", 
                 totalScore, shouldBlock, shouldFlag, triggeredRules, recommendedAction);

        return FraudEvaluationResult.builder()
                .totalScore(totalScore)
                .shouldBlock(shouldBlock)
                .shouldFlag(shouldFlag)
                .triggeredRules(triggeredRules)
                .details(details)
                .recommendedAction(recommendedAction)
                .build();
    }

    /**
     * Evaluate a single fraud rule.
     * 
     * @param rule Fraud rule to evaluate
     * @param request Transfer request
     * @param senderUserId Sender user ID
     * @param details Map to store rule trigger details
     * @return true if rule triggered, false otherwise
     */
    private boolean evaluateRule(FraudRule rule, TransferRequest request, UUID senderUserId, Map<String, String> details) {
        try {
            JsonNode params = objectMapper.readTree(rule.getParameters());
            
            switch (rule.getRuleType()) {
                case VELOCITY:
                    return evaluateVelocityRule(rule, params, senderUserId, details);
                    
                case AMOUNT_THRESHOLD:
                    return evaluateAmountRule(rule, params, request.getAmountCents(), details);
                    
                case PATTERN_MATCH:
                    return evaluatePatternRule(rule, params, request, senderUserId, details);
                    
                case GEO_ANOMALY:
                    log.debug("GEO_ANOMALY rule not yet implemented: {}", rule.getRuleName());
                    return false;
                    
                case BLACKLIST:
                    log.debug("BLACKLIST rule not yet implemented: {}", rule.getRuleName());
                    return false;
                    
                default:
                    log.warn("Unknown rule type: {}", rule.getRuleType());
                    return false;
            }
        } catch (JsonProcessingException e) {
            log.error("Failed to parse rule parameters for rule {}: {}", rule.getRuleName(), e.getMessage());
            return false;
        }
    }

    /**
     * Evaluate VELOCITY rule: Check transaction frequency.
     * 
     * Parameters JSON:
     * {
     *   "maxTransactions": 10,
     *   "timeWindowMinutes": 60
     * }
     */
    private boolean evaluateVelocityRule(FraudRule rule, JsonNode params, UUID userId, Map<String, String> details) {
        int maxTransactions = params.get("maxTransactions").asInt();
        int timeWindowMinutes = params.get("timeWindowMinutes").asInt();
        
        boolean triggered = checkVelocityRule(userId, timeWindowMinutes, maxTransactions);
        
        if (triggered) {
            long actualCount = transactionRepository.countByFromUserIdAndCreatedAtAfter(
                userId, 
                Instant.now().minus(Duration.ofMinutes(timeWindowMinutes))
            );
            details.put(rule.getRuleName(), 
                String.format("Transaction frequency exceeded: %d transactions in %d minutes (max: %d)", 
                              actualCount, timeWindowMinutes, maxTransactions));
        }
        
        return triggered;
    }

    /**
     * Evaluate AMOUNT_THRESHOLD rule: Check if amount exceeds limit.
     * 
     * Parameters JSON:
     * {
     *   "thresholdCents": 100000000
     * }
     */
    private boolean evaluateAmountRule(FraudRule rule, JsonNode params, long amountCents, Map<String, String> details) {
        long thresholdCents = params.get("thresholdCents").asLong();
        
        boolean triggered = checkAmountRule(amountCents, thresholdCents);
        
        if (triggered) {
            details.put(rule.getRuleName(), 
                String.format("Amount exceeds threshold: %d cents (threshold: %d cents)", 
                              amountCents, thresholdCents));
        }
        
        return triggered;
    }

    /**
     * Evaluate PATTERN_MATCH rule: Detect suspicious patterns.
     * 
     * Patterns:
     * - Round amounts (e.g., exactly 1,000,000)
     * - Rapid succession (multiple txns within seconds)
     * 
     * Parameters JSON:
     * {
     *   "pattern": "ROUND_AMOUNT",
     *   "divisor": 1000000
     * }
     */
    private boolean evaluatePatternRule(FraudRule rule, JsonNode params, TransferRequest request, UUID userId, Map<String, String> details) {
        String pattern = params.get("pattern").asText();
        
        if ("ROUND_AMOUNT".equals(pattern)) {
            long divisor = params.get("divisor").asLong();
            boolean triggered = (request.getAmountCents() % divisor == 0) && (request.getAmountCents() >= divisor);
            
            if (triggered) {
                details.put(rule.getRuleName(), 
                    String.format("Round amount detected: %d cents (divisible by %d)", 
                                  request.getAmountCents(), divisor));
            }
            
            return triggered;
        }
        
        return false;
    }

    @Override
    public List<FraudRule> getActiveRules() {
        return fraudRuleRepository.findByIsActiveTrueOrderByRiskScorePenaltyDesc();
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
        boolean triggered = amountCents > threshold;
        
        log.debug("Amount check: amount={}, threshold={}, triggered={}", 
                  amountCents, threshold, triggered);
        
        return triggered;
    }

    @Override
    public boolean checkPatternRule(TransferRequest request, UUID senderUserId) {
        // Check for round amounts (divisible by 1,000,000)
        boolean isRoundAmount = (request.getAmountCents() % 1_000_000 == 0) 
                             && (request.getAmountCents() >= 1_000_000);
        
        log.debug("Pattern check: amount={}, isRoundAmount={}", 
                  request.getAmountCents(), isRoundAmount);
        
        return isRoundAmount;
    }

    /**
     * Determine recommended action based on evaluation.
     * 
     * Priority:
     * 1. BLOCK if any BLOCK rule triggered
     * 2. FLAG if score >= 70
     * 3. REVIEW if score >= 50
     * 4. ALLOW if score < 50
     */
    private String determineRecommendedAction(boolean shouldBlock, boolean shouldFlag, int totalScore) {
        if (shouldBlock) {
            return "BLOCK";
        } else if (shouldFlag) {
            return "FLAG";
        } else if (totalScore >= 50) {
            return "REVIEW";
        } else {
            return "ALLOW";
        }
    }
}
