package com.xupay.payment.service.impl;

import com.xupay.payment.dto.FraudEvaluationResult;
import com.xupay.payment.dto.TransactionDetailResponse;
import com.xupay.payment.dto.TransferRequest;
import com.xupay.payment.dto.TransferResponse;
import com.xupay.payment.entity.*;
import com.xupay.payment.entity.enums.EntryType;
import com.xupay.payment.entity.enums.TransactionStatus;
import com.xupay.payment.entity.enums.TransactionType;
import com.xupay.payment.grpc.UserServiceClient;
import com.xupay.payment.repository.*;
import com.xupay.payment.service.FraudDetectionService;
import com.xupay.payment.service.IdempotencyService;
import com.xupay.payment.service.TransactionService;
import com.xupay.user.grpc.ValidateUserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * TransactionServiceImpl
 * Implements double-entry bookkeeping for all financial transactions.
 * 
 * CRITICAL ACCOUNTING RULES:
 * 1. Every transaction creates balanced ledger entries (Debits = Credits)
 * 2. Wallet balances are NEVER stored, only calculated from ledger
 * 3. Ledger entries are IMMUTABLE (never updated, only reversed)
 * 4. Idempotency key prevents duplicate transactions
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final WalletRepository walletRepository;
    private final LedgerEntryRepository ledgerEntryRepository;
    private final IdempotencyCacheRepository idempotencyCacheRepository;
    private final UserServiceClient userServiceClient;
    private final FraudDetectionService fraudDetectionService;
    private final IdempotencyService idempotencyService;

    @Override
    @Transactional
    public TransferResponse processTransfer(TransferRequest request) {
        log.info("Processing transfer: idempotencyKey={}, from={}, to={}, amount={}",
                request.getIdempotencyKey(), request.getFromUserId(), request.getToUserId(), request.getAmountCents());

        // Step 1: Check idempotency using Redis cache + database fallback
        var cachedResponse = idempotencyService.getIfExists(request.getIdempotencyKey());
        if (cachedResponse.isPresent()) {
            log.info("Transaction already processed (idempotent): returning cached response");
            return cachedResponse.get();
        }

        // Step 2: Validate users are different
        if (request.getFromUserId().equals(request.getToUserId())) {
            throw new IllegalArgumentException("Cannot transfer to same user");
        }

        // Step 3: [NEW] Evaluate fraud risk BEFORE user validation
        FraudEvaluationResult fraudResult = fraudDetectionService.evaluateTransaction(
                request,
                request.getFromUserId()
        );
        
        if (fraudResult.isShouldBlock()) {
            log.warn("Transaction BLOCKED by fraud rules: triggeredRules={}, score={}",
                    fraudResult.getTriggeredRules(), fraudResult.getTotalScore());
            throw new SecurityException("Transaction blocked due to fraud risk: " + 
                    String.join(", ", fraudResult.getTriggeredRules()));
        }
        
        if (fraudResult.isShouldFlag()) {
            log.warn("Transaction FLAGGED for review: score={}, triggeredRules={}",
                    fraudResult.getTotalScore(), fraudResult.getTriggeredRules());
        }

        // Step 4: [EXISTING] Validate sender via User Service (KYC + Limits + Account Status)
        try {
            ValidateUserResponse senderValidation = userServiceClient.validateUser(
                    request.getFromUserId(),
                    request.getAmountCents(),
                    "send"
            );
            log.info("Sender validation passed: userId={}, kycStatus={}, kycTier={}",
                    request.getFromUserId(), 
                    senderValidation.getUser().getKycStatus(), 
                    senderValidation.getUser().getKycTier());
        } catch (IllegalArgumentException e) {
            log.warn("Sender validation failed: {}", e.getMessage());
            throw new IllegalArgumentException("Sender validation failed: " + e.getMessage());
        }

        // Step 4: [NEW] Validate receiver via User Service
        try {
            ValidateUserResponse receiverValidation = userServiceClient.validateUser(
                    request.getToUserId(),
                    request.getAmountCents(),
                    "receive"
            );
            log.info("Receiver validation passed: userId={}, kycStatus={}, kycTier={}",
                    request.getToUserId(), 
                    receiverValidation.getUser().getKycStatus(), 
                    receiverValidation.getUser().getKycTier());
        } catch (IllegalArgumentException e) {
            log.warn("Receiver validation failed: {}", e.getMessage());
            throw new IllegalArgumentException("Receiver validation failed: " + e.getMessage());
        }

        // Step 5: Get wallets
        Wallet fromWallet = walletRepository.findByUserId(request.getFromUserId())
                .orElseThrow(() -> new IllegalArgumentException("From wallet not found: " + request.getFromUserId()));
        Wallet toWallet = walletRepository.findByUserId(request.getToUserId())
                .orElseThrow(() -> new IllegalArgumentException("To wallet not found: " + request.getToUserId()));

        // Step 6: Validate wallets are active and not frozen
        validateWallet(fromWallet, "From wallet");
        validateWallet(toWallet, "To wallet");

        // Step 7: Check sufficient balance
        Long fromBalance = walletRepository.getBalance(fromWallet.getId());
        if (fromBalance == null) {
            fromBalance = 0L;
        }
        if (fromBalance < request.getAmountCents()) {
            log.warn("Insufficient balance: wallet={}, balance={}, required={}",
                    fromWallet.getId(), fromBalance, request.getAmountCents());
            
            // Create FAILED transaction for audit trail
            Transaction failedTxn = createTransaction(request, fromWallet, toWallet, TransactionStatus.FAILED);
            transactionRepository.save(failedTxn);
            
            throw new IllegalArgumentException("Insufficient balance");
        }

        // Step 8: Create transaction record with fraud scoring
        Transaction transaction = createTransaction(request, fromWallet, toWallet, TransactionStatus.PROCESSING);
        
        // Apply fraud evaluation results
        transaction.setFraudScore(fraudResult.getTotalScore());
        transaction.setIsFlagged(fraudResult.isShouldFlag());
        if (fraudResult.isShouldFlag()) {
            transaction.setFraudReason("Triggered rules: " + String.join(", ", fraudResult.getTriggeredRules()));
        }
        
        transaction = transactionRepository.save(transaction);
        log.info("Transaction created: id={}, fraudScore={}, isFlagged={}", 
                transaction.getId(), transaction.getFraudScore(), transaction.getIsFlagged());

        // Step 9: Create balanced ledger entries (Double-Entry Bookkeeping)
        try {
            createLedgerEntries(transaction, fromWallet, toWallet, request.getAmountCents());
            
            // Step 10: Mark transaction as COMPLETED
            transaction.setStatus(TransactionStatus.COMPLETED);
            transaction.setCompletedAt(LocalDateTime.now());
            transaction = transactionRepository.save(transaction);
            log.info("Transaction completed: {}", transaction.getId());

            // Step 11: [NEW] Record transaction in User Service asynchronously (non-blocking)
            recordTransactionInUserService(request.getFromUserId(), request.getAmountCents(), "send", transaction.getId());
            recordTransactionInUserService(request.getToUserId(), request.getAmountCents(), "receive", transaction.getId());

        } catch (Exception e) {
            log.error("Error creating ledger entries: ", e);
            transaction.setStatus(TransactionStatus.FAILED);
            transactionRepository.save(transaction);
            throw new RuntimeException("Transaction failed: " + e.getMessage(), e);
        }

        // Step 12: Build response and cache it
        TransferResponse response = buildTransferResponse(transaction);
        
        // Cache response for idempotency (24-hour TTL in Redis)
        idempotencyService.cache(request.getIdempotencyKey(), response);
        log.info("Transaction response cached: idempotencyKey={}", request.getIdempotencyKey());
        
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public TransactionDetailResponse getTransactionDetail(UUID transactionId) {
        log.info("Getting transaction detail: {}", transactionId);

        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found: " + transactionId));

        List<LedgerEntry> ledgerEntries = ledgerEntryRepository.findByTransactionId(transactionId);

        List<TransactionDetailResponse.LedgerEntryDetail> entryDetails = ledgerEntries.stream()
                .map(entry -> TransactionDetailResponse.LedgerEntryDetail.builder()
                        .entryId(entry.getId())
                        .glAccountCode(entry.getGlAccountCode())
                        .walletId(entry.getWalletId())
                        .entryType(entry.getEntryType().name())
                        .amountCents(entry.getAmountCents())
                        .description(entry.getDescription())
                        .createdAt(entry.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return TransactionDetailResponse.builder()
                .transactionId(transaction.getId())
                .type(transaction.getType().name())
                .status(transaction.getStatus().name())
                .amountCents(transaction.getAmountCents())
                .currency(transaction.getCurrency())
                .description(transaction.getDescription())
                .createdAt(transaction.getCreatedAt())
                .completedAt(transaction.getCompletedAt())
                .ledgerEntries(entryDetails)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public TransferResponse getTransactionByIdempotencyKey(UUID idempotencyKey) {
        log.info("Getting transaction by idempotency key: {}", idempotencyKey);
        
        return transactionRepository.findByIdempotencyKey(idempotencyKey)
                .map(this::buildTransferResponse)
                .orElse(null);
    }

    /**
     * Create balanced ledger entries using double-entry bookkeeping.
     * 
     * For P2P Transfer:
     * - From Wallet: CREDIT (decreases asset balance)
     * - To Wallet: DEBIT (increases asset balance)
     * 
     * CRITICAL: Sum(DEBIT) = Sum(CREDIT) always
     */
    private void createLedgerEntries(Transaction transaction, Wallet fromWallet, Wallet toWallet, Long amountCents) {
        log.info("Creating ledger entries: txn={}, amount={}", transaction.getId(), amountCents);

        // Entry 1: CREDIT from wallet (decrease balance)
        LedgerEntry fromEntry = new LedgerEntry();
        fromEntry.setTransactionId(transaction.getId());
        fromEntry.setGlAccountCode(fromWallet.getGlAccountCode());
        fromEntry.setWalletId(fromWallet.getId());
        fromEntry.setEntryType(EntryType.CREDIT);
        fromEntry.setAmountCents(amountCents);
        fromEntry.setDescription("Transfer to user " + toWallet.getUserId());
        fromEntry.setIsReversed(false);
        ledgerEntryRepository.save(fromEntry);

        // Entry 2: DEBIT to wallet (increase balance)
        LedgerEntry toEntry = new LedgerEntry();
        toEntry.setTransactionId(transaction.getId());
        toEntry.setGlAccountCode(toWallet.getGlAccountCode());
        toEntry.setWalletId(toWallet.getId());
        toEntry.setEntryType(EntryType.DEBIT);
        toEntry.setAmountCents(amountCents);
        toEntry.setDescription("Transfer from user " + fromWallet.getUserId());
        toEntry.setIsReversed(false);
        ledgerEntryRepository.save(toEntry);

        log.info("Ledger entries created: from={}, to={}", fromEntry.getId(), toEntry.getId());
    }

    /**
     * Create transaction record.
     */
    private Transaction createTransaction(TransferRequest request, Wallet fromWallet, Wallet toWallet, TransactionStatus status) {
        Transaction transaction = new Transaction();
        transaction.setIdempotencyKey(request.getIdempotencyKey());
        transaction.setFromWalletId(fromWallet.getId());
        transaction.setToWalletId(toWallet.getId());
        transaction.setFromUserId(request.getFromUserId());
        transaction.setToUserId(request.getToUserId());
        transaction.setAmountCents(request.getAmountCents());
        transaction.setCurrency("VND");
        transaction.setType(TransactionType.TRANSFER);
        transaction.setStatus(status);
        transaction.setDescription(request.getDescription());
        transaction.setIpAddress(request.getIpAddress());
        transaction.setUserAgent(request.getUserAgent());
        transaction.setIsFlagged(false);
        transaction.setIsReversed(false);
        return transaction;
    }

    /**
     * Validate wallet is active and not frozen.
     */
    private void validateWallet(Wallet wallet, String label) {
        if (!wallet.getIsActive()) {
            throw new IllegalArgumentException(label + " is not active");
        }
        if (wallet.getIsFrozen()) {
            throw new IllegalArgumentException(label + " is frozen: " + wallet.getFreezeReason());
        }
    }

    /**
     * Record transaction in User Service asynchronously (non-blocking).
     * Payment confirmation does NOT wait for this call.
     */
    private void recordTransactionInUserService(UUID userId, Long amountCents, String transactionType, UUID transactionId) {
        userServiceClient.recordTransactionAsync(userId, amountCents, transactionType, transactionId)
                .thenAccept(response -> {
                    if (response.getSuccess()) {
                        log.info("Transaction {} recorded in User Service for user {}", transactionId, userId);
                    } else {
                        log.warn("Failed to record transaction {} in User Service: {}", transactionId, response.getMessage());
                    }
                })
                .exceptionally(ex -> {
                    log.error("Error recording transaction {} in User Service for user {}: {}", 
                            transactionId, userId, ex.getMessage());
                    return null;
                });
    }

    /**
     * Build transfer response from transaction.
     */
    private TransferResponse buildTransferResponse(Transaction transaction) {
        BigDecimal amount = BigDecimal.valueOf(transaction.getAmountCents())
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        return TransferResponse.builder()
                .transactionId(transaction.getId())
                .idempotencyKey(transaction.getIdempotencyKey())
                .fromWalletId(transaction.getFromWalletId())
                .toWalletId(transaction.getToWalletId())
                .fromUserId(transaction.getFromUserId())
                .toUserId(transaction.getToUserId())
                .amountCents(transaction.getAmountCents())
                .amount(amount)
                .currency(transaction.getCurrency())
                .type(transaction.getType())
                .status(transaction.getStatus())
                .description(transaction.getDescription())
                .isFlagged(transaction.getIsFlagged())
                .fraudScore(transaction.getFraudScore())
                .createdAt(transaction.getCreatedAt())
                .completedAt(transaction.getCompletedAt())
                .build();
    }
}
