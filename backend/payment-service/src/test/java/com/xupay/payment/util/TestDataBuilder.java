package com.xupay.payment.util;

import com.xupay.payment.dto.TransferRequest;
import com.xupay.payment.entity.*;
import com.xupay.payment.entity.enums.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Test data builder utility for creating test objects
 * Simplifies test data setup and makes tests more readable
 */
public class TestDataBuilder {
    
    /**
     * Create a test wallet with default values
     */
    public static Wallet createTestWallet(UUID userId, String glAccountCode) {
        Wallet wallet = new Wallet();
        wallet.setId(UUID.randomUUID());
        wallet.setUserId(userId);
        wallet.setGlAccountCode(glAccountCode);
        wallet.setWalletType(WalletType.PERSONAL);
        wallet.setIsActive(true);
        wallet.setIsFrozen(false);
        wallet.setCreatedAt(java.time.LocalDateTime.now());
        wallet.setUpdatedAt(java.time.LocalDateTime.now());
        return wallet;
    }
    
    /**
     * Create a test transaction
     */
    public static Transaction createTestTransaction(
        UUID fromWalletId, 
        UUID toWalletId, 
        Long amountCents
    ) {
        Transaction txn = new Transaction();
        txn.setId(UUID.randomUUID());
        txn.setIdempotencyKey(UUID.randomUUID());
        txn.setFromWalletId(fromWalletId);
        txn.setToWalletId(toWalletId);
        txn.setFromUserId(UUID.randomUUID());
        txn.setToUserId(UUID.randomUUID());
        txn.setAmountCents(amountCents);
        txn.setType(TransactionType.TRANSFER);
        txn.setStatus(TransactionStatus.PENDING);
        txn.setCreatedAt(java.time.LocalDateTime.now());
        return txn;
    }
    
    /**
     * Create a velocity-based fraud rule
     */
    public static FraudRule createVelocityRule(
        String ruleName, 
        int maxTransactions, 
        int timeWindowMinutes,
        int riskScore,
        FraudAction action
    ) {
        FraudRule rule = new FraudRule();
        rule.setId(UUID.randomUUID());
        rule.setRuleName(ruleName);
        rule.setRuleType(RuleType.VELOCITY);
        rule.setParameters(
            String.format("{\"maxTransactions\": %d, \"timeWindowMinutes\": %d}", 
                maxTransactions, timeWindowMinutes)
        );
        rule.setRiskScorePenalty(riskScore);
        rule.setAction(action);
        rule.setIsActive(true);
        rule.setCreatedAt(java.time.LocalDateTime.now());
        rule.setUpdatedAt(java.time.LocalDateTime.now());
        return rule;
    }
    
    /**
     * Create an amount threshold fraud rule
     */
    public static FraudRule createAmountRule(
        String ruleName,
        long thresholdCents,
        int riskScore,
        FraudAction action
    ) {
        FraudRule rule = new FraudRule();
        rule.setId(UUID.randomUUID());
        rule.setRuleName(ruleName);
        rule.setRuleType(RuleType.AMOUNT_THRESHOLD);
        rule.setParameters(
            String.format("{\"thresholdCents\": %d}", thresholdCents)
        );
        rule.setRiskScorePenalty(riskScore);
        rule.setAction(action);
        rule.setIsActive(true);
        rule.setCreatedAt(java.time.LocalDateTime.now());
        rule.setUpdatedAt(java.time.LocalDateTime.now());
        return rule;
    }
    
    /**
     * Create a pattern match fraud rule
     */
    public static FraudRule createPatternRule(
        String ruleName,
        String pattern,
        long divisor,
        int riskScore,
        FraudAction action
    ) {
        FraudRule rule = new FraudRule();
        rule.setId(UUID.randomUUID());
        rule.setRuleName(ruleName);
        rule.setRuleType(RuleType.PATTERN_MATCH);
        rule.setParameters(
            String.format("{\"pattern\": \"%s\", \"divisor\": %d}", pattern, divisor)
        );
        rule.setRiskScorePenalty(riskScore);
        rule.setAction(action);
        rule.setIsActive(true);
        rule.setCreatedAt(java.time.LocalDateTime.now());
        rule.setUpdatedAt(java.time.LocalDateTime.now());
        return rule;
    }
    
    /**
     * Create a transfer request for testing
     */
    public static TransferRequest createTransferRequest(
        UUID fromUserId,
        UUID toUserId,
        Long amountCents
    ) {
        TransferRequest request = new TransferRequest();
        request.setIdempotencyKey(UUID.randomUUID());
        request.setFromUserId(fromUserId);
        request.setToUserId(toUserId);
        request.setAmountCents(amountCents);
        request.setDescription("Test transfer");
        request.setUserAgent("TestAgent/1.0");
        return request;
    }
    
    /**
     * Create a transfer request with specific idempotency key
     */
    public static TransferRequest createTransferRequestWithKey(
        UUID idempotencyKey,
        UUID fromUserId,
        UUID toUserId,
        Long amountCents
    ) {
        TransferRequest request = new TransferRequest();
        request.setIdempotencyKey(idempotencyKey);
        request.setFromUserId(fromUserId);
        request.setToUserId(toUserId);
        request.setAmountCents(amountCents);
        request.setDescription("Test transfer with key");
        request.setUserAgent("TestAgent/1.0");
        return request;
    }
    
    /**
     * Create a ledger entry
     */
    public static LedgerEntry createLedgerEntry(
        UUID transactionId,
        UUID walletId,
        String glAccountCode,
        EntryType entryType,
        Long amountCents
    ) {
        LedgerEntry entry = new LedgerEntry();
        entry.setId(UUID.randomUUID());
        entry.setTransactionId(transactionId);
        entry.setWalletId(walletId);
        entry.setGlAccountCode(glAccountCode);
        entry.setEntryType(entryType);
        entry.setAmountCents(amountCents);
        entry.setDescription("Test ledger entry");
        entry.setCreatedAt(java.time.LocalDateTime.now());
        return entry;
    }
    
    /**
     * Create a chart of accounts entry
     */
    public static ChartOfAccounts createChartOfAccount(
        String accountCode,
        String accountName,
        AccountType accountType,
        NormalBalance normalBalance
    ) {
        ChartOfAccounts account = new ChartOfAccounts();
        account.setId(UUID.randomUUID());
        account.setAccountCode(accountCode);
        account.setAccountName(accountName);
        account.setAccountType(accountType);
        account.setNormalBalance(normalBalance);
        account.setIsActive(true);
        account.setCreatedAt(LocalDateTime.now());
        account.setUpdatedAt(LocalDateTime.now());
        return account;
    }
}
