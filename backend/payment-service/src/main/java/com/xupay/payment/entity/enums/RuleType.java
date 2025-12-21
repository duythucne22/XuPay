package com.xupay.payment.entity.enums;

/**
 * RuleType
 * Fraud detection rule categories.
 * 
 * CRITICAL: Values are UPPERCASE to match database CHECK constraint.
 * Database: rule_type IN ('VELOCITY', 'AMOUNT_THRESHOLD', 'GEO_ANOMALY', 'PATTERN_MATCH', 'BLACKLIST')
 */
public enum RuleType {
    VELOCITY,           // Transaction frequency checks (e.g., > 10 txns/hour)
    AMOUNT_THRESHOLD,   // Large amount detection (e.g., > $5000)
    GEO_ANOMALY,        // Unusual geographic location
    PATTERN_MATCH,      // Suspicious transaction patterns
    BLACKLIST           // Known fraudulent accounts
}
