package com.xupay.payment.entity.enums;

/**
 * WalletType
 * Classification of wallet accounts.
 * 
 * CRITICAL: Values are UPPERCASE to match database CHECK constraint.
 * Database: wallet_type IN ('PERSONAL', 'BUSINESS', 'MERCHANT')
 */
public enum WalletType {
    PERSONAL,  // Individual user wallet
    BUSINESS,  // Business/corporate wallet
    MERCHANT   // Merchant payment acceptance wallet
}
