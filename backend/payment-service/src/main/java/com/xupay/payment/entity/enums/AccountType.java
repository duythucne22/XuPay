package com.xupay.payment.entity.enums;

/**
 * AccountType
 * Chart of Accounts classification.
 * 
 * CRITICAL: Values are UPPERCASE to match database CHECK constraint.
 * Database: account_type IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE')
 */
public enum AccountType {
    ASSET,      // Resources owned (cash, receivables)
    LIABILITY,  // Obligations owed (user balances, payables)
    EQUITY,     // Owner's stake
    REVENUE,    // Income from operations
    EXPENSE     // Costs of operations
}
