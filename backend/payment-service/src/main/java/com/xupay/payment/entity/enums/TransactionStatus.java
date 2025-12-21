package com.xupay.payment.entity.enums;

/**
 * TransactionStatus
 * Transaction lifecycle states.
 * 
 * CRITICAL: Values are UPPERCASE to match database CHECK constraint.
 * Database: status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REVERSED')
 */
public enum TransactionStatus {
    PENDING,      // Transaction initiated, not yet processed
    PROCESSING,   // Transaction being processed
    COMPLETED,    // Transaction successfully completed
    FAILED,       // Transaction failed (insufficient balance, fraud block)
    CANCELLED,    // Transaction cancelled by user
    REVERSED      // Transaction reversed (refund/chargeback)
}
