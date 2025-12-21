package com.xupay.payment.entity.enums;

/**
 * FraudAction
 * Actions to take when fraud rule triggers.
 * 
 * CRITICAL: Values are UPPERCASE to match database CHECK constraint.
 * Database: action IN ('FLAG', 'BLOCK', 'REVIEW')
 */
public enum FraudAction {
    FLAG,    // Flag transaction for review (allow to proceed)
    BLOCK,   // Block transaction immediately
    REVIEW   // Hold transaction pending manual review
}
