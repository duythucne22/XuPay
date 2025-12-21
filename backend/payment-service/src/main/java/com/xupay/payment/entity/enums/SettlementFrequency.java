package com.xupay.payment.entity.enums;

/**
 * SettlementFrequency
 * Merchant settlement schedule.
 * 
 * CRITICAL: Values are UPPERCASE to match database CHECK constraint.
 * Database: settlement_frequency IN ('DAILY', 'WEEKLY', 'MONTHLY')
 */
public enum SettlementFrequency {
    DAILY,    // Settle merchant payments daily
    WEEKLY,   // Settle merchant payments weekly
    MONTHLY   // Settle merchant payments monthly
}
