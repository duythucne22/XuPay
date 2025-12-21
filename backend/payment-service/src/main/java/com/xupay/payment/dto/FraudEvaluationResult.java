package com.xupay.payment.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

/**
 * FraudEvaluationResult
 * Result of fraud detection evaluation for a transaction.
 * 
 * Scoring Logic:
 * - totalScore: Sum of all triggered rules' risk scores
 * - shouldFlag: true if totalScore >= 70 (high risk)
 * - shouldBlock: true if any BLOCK action rule triggered
 * 
 * Example Usage:
 * ```
 * FraudEvaluationResult result = fraudService.evaluateTransaction(request, senderId);
 * if (result.isShouldBlock()) {
 *     throw new SecurityException("Transaction blocked: " + result.getTriggeredRules());
 * }
 * if (result.isShouldFlag()) {
 *     transaction.setFlagged(true);
 *     transaction.setFraudScore(result.getTotalScore());
 * }
 * ```
 */
@Data
@Builder
public class FraudEvaluationResult {

    /**
     * Total fraud risk score (sum of all triggered rules).
     * Range: 0-∞ (typically 0-100 per rule)
     * 
     * Risk Levels:
     * - 0-49: Low risk (allow)
     * - 50-69: Medium risk (flag for review)
     * - 70+: High risk (auto-flag, potentially block)
     */
    private int totalScore;

    /**
     * Whether transaction should be blocked immediately.
     * True if any rule with action=BLOCK was triggered.
     */
    private boolean shouldBlock;

    /**
     * Whether transaction should be flagged for review.
     * True if totalScore >= 70.
     */
    private boolean shouldFlag;

    /**
     * Names of fraud rules that were triggered.
     * Example: ["Velocity 10 per Hour", "High Amount Alert"]
     */
    private List<String> triggeredRules;

    /**
     * Additional context for each triggered rule.
     * Key: Rule name
     * Value: Reason (e.g., "Transaction frequency exceeded: 12 > 10")
     */
    private Map<String, String> details;

    /**
     * Recommended action based on evaluation.
     * Values: "ALLOW", "FLAG", "BLOCK", "REVIEW"
     */
    private String recommendedAction;
}
