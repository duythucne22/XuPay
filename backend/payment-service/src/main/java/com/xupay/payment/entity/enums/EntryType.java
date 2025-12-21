package com.xupay.payment.entity.enums;

/**
 * EntryType
 * Double-entry ledger entry types.
 * 
 * CRITICAL: Values are UPPERCASE to match database CHECK constraint.
 * Database: entry_type IN ('DEBIT', 'CREDIT')
 * 
 * Double-Entry Rule:
 * Every transaction must have balanced DEBIT and CREDIT entries.
 * Sum(DEBIT amounts) = Sum(CREDIT amounts) for each transaction.
 */
public enum EntryType {
    DEBIT,   // Left side of ledger (assets increase, liabilities decrease)
    CREDIT   // Right side of ledger (liabilities increase, assets decrease)
}
