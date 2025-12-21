package com.xupay.payment.service;

import com.xupay.payment.dto.FraudEvaluationResult;
import com.xupay.payment.dto.TransferRequest;
import com.xupay.payment.entity.FraudRule;

import java.util.List;
import java.util.UUID;

/**
 * FraudDetectionService
 * Service for evaluating fraud risk in financial transactions.
 * 
 * Implements rule-based fraud detection with 5 check types:
 * 1. VELOCITY: Transaction frequency (e.g., max 10 txns/hour)
 * 2. AMOUNT_THRESHOLD: High-value transactions (e.g., > $1000)
 * 3. GEO_ANOMALY: Unusual geographical patterns (future)
 * 4. PATTERN_MATCH: Suspicious patterns (round amounts, rapid succession)
 * 5. BLACKLIST: Known fraudulent users/IPs (future)
 * 
 * Usage in Transaction Flow:
 * ```
 * FraudEvaluationResult result = fraudService.evaluateTransaction(request, senderId);
 * if (result.isShouldBlock()) {
 *     throw new SecurityException("Blocked by fraud rules");
 * }
 * ```
 */
public interface FraudDetectionService {

    /**
     * Evaluate transaction for fraud risk based on active rules.
     * 
     * Process:
     * 1. Load all active fraud rules
     * 2. Check each rule type (velocity, amount, geo, pattern, blacklist)
     * 3. Calculate cumulative fraud score
     * 4. Determine recommended action (ALLOW/FLAG/BLOCK)
     * 
     * @param request Transfer request with amount, sender, receiver
     * @param senderUserId UUID of sender (for velocity and history checks)
     * @return Fraud evaluation result with score, flags, and triggered rules
     */
    FraudEvaluationResult evaluateTransaction(TransferRequest request, UUID senderUserId);

    /**
     * Get all active fraud rules.
     * Used for evaluation and admin display.
     * 
     * @return List of active rules sorted by risk score (high to low)
     */
    List<FraudRule> getActiveRules();

    /**
     * Check velocity rule: Has user exceeded transaction frequency limit?
     * 
     * Example: Max 10 transactions in last 60 minutes
     * - User has 12 transactions in last hour → TRIGGERED
     * - User has 8 transactions in last hour → PASS
     * 
     * @param userId User ID to check
     * @param timeWindowMinutes Time window to check (e.g., 60 = last hour)
     * @param threshold Maximum transactions allowed in window
     * @return true if threshold exceeded (rule triggered)
     */
    boolean checkVelocityRule(UUID userId, int timeWindowMinutes, int threshold);

    /**
     * Check amount threshold rule: Is transaction amount too high?
     * 
     * Example: Flag amounts > 100,000,000 cents ($1M VND)
     * - Transaction of 150,000,000 cents → TRIGGERED
     * - Transaction of 50,000,000 cents → PASS
     * 
     * @param amountCents Transaction amount in cents
     * @param threshold Maximum allowed amount in cents
     * @return true if amount exceeds threshold (rule triggered)
     */
    boolean checkAmountRule(long amountCents, long threshold);

    /**
     * Check pattern matching rule: Does transaction match suspicious pattern?
     * 
     * Patterns:
     * - Round amounts (e.g., exactly 1,000,000 VND)
     * - Rapid succession (multiple txns within seconds)
     * - Repetitive amounts (same amount multiple times)
     * 
     * @param request Transfer request
     * @param senderUserId Sender user ID (for history analysis)
     * @return true if suspicious pattern detected (rule triggered)
     */
    boolean checkPatternRule(TransferRequest request, UUID senderUserId);
}
