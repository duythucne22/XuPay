package com.xupay.payment.service;

import com.xupay.payment.dto.TransactionDetailResponse;
import com.xupay.payment.dto.TransferRequest;
import com.xupay.payment.dto.TransferResponse;

import java.util.UUID;

/**
 * TransactionService
 * Business logic for financial transactions.
 * Implements double-entry bookkeeping for all transactions.
 */
public interface TransactionService {

    /**
     * Process P2P transfer between wallets.
     * Creates balanced ledger entries: From wallet CREDIT, To wallet DEBIT.
     * Enforces idempotency using idempotency_key.
     * 
     * @param request Transfer request with idempotency key
     * @return Transfer response with transaction details
     */
    TransferResponse processTransfer(TransferRequest request);

    /**
     * Get transaction details including all ledger entries.
     * 
     * @param transactionId Transaction ID
     * @return Transaction with ledger entries
     */
    TransactionDetailResponse getTransactionDetail(UUID transactionId);

    /**
     * Get transaction by idempotency key (for retry handling).
     * 
     * @param idempotencyKey Client-provided idempotency key
     * @return Transaction response if exists, null otherwise
     */
    TransferResponse getTransactionByIdempotencyKey(UUID idempotencyKey);
}
