package com.xupay.payment.entity.enums;

/**
 * TransactionType
 * Classification of financial transactions.
 * 
 * CRITICAL: Values are UPPERCASE to match database CHECK constraint.
 * Database: type IN ('TRANSFER', 'TOPUP', 'WITHDRAW', 'MERCHANT_PAYMENT', 'REFUND')
 */
public enum TransactionType {
    TRANSFER,          // P2P transfer between users
    TOPUP,             // Add funds to wallet
    WITHDRAW,          // Withdraw funds from wallet
    MERCHANT_PAYMENT,  // Payment to merchant
    REFUND             // Refund of previous transaction
}
