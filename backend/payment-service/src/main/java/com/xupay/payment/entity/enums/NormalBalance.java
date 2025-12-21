package com.xupay.payment.entity.enums;

/**
 * NormalBalance
 * Indicates which side (debit or credit) increases an account balance.
 * 
 * CRITICAL: Values are UPPERCASE to match database CHECK constraint.
 * Database: normal_balance IN ('DEBIT', 'CREDIT')
 * 
 * Accounting Rules:
 * - ASSET accounts: DEBIT increases, CREDIT decreases
 * - LIABILITY/EQUITY/REVENUE accounts: CREDIT increases, DEBIT decreases
 * - EXPENSE accounts: DEBIT increases, CREDIT decreases
 */
public enum NormalBalance {
    DEBIT,   // Assets, Expenses increase with debits
    CREDIT   // Liabilities, Equity, Revenue increase with credits
}
