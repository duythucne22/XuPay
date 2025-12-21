package com.xupay.payment.controller;

import com.xupay.payment.dto.TransactionDetailResponse;
import com.xupay.payment.dto.TransferRequest;
import com.xupay.payment.dto.TransferResponse;
import com.xupay.payment.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * TransactionController
 * REST endpoints for financial transactions.
 */
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class TransactionController {

    private final TransactionService transactionService;

    /**
     * Process P2P transfer.
     * POST /api/transactions/transfer
     */
    @PostMapping("/transfer")
    public ResponseEntity<TransferResponse> processTransfer(@Valid @RequestBody TransferRequest request) {
        log.info("REST request to process transfer: from={}, to={}, amount={}",
                request.getFromUserId(), request.getToUserId(), request.getAmountCents());
        
        TransferResponse response = transactionService.processTransfer(request);
        
        // Return 201 for new transaction, 200 for idempotent retry
        HttpStatus status = response.getStatus().name().equals("COMPLETED") 
                ? HttpStatus.CREATED 
                : HttpStatus.OK;
        
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Get transaction details with ledger entries.
     * GET /api/transactions/{transactionId}
     */
    @GetMapping("/{transactionId}")
    public ResponseEntity<TransactionDetailResponse> getTransactionDetail(@PathVariable UUID transactionId) {
        log.info("REST request to get transaction detail: {}", transactionId);
        TransactionDetailResponse response = transactionService.getTransactionDetail(transactionId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get transaction by idempotency key (for retry handling).
     * GET /api/transactions/idempotency/{idempotencyKey}
     */
    @GetMapping("/idempotency/{idempotencyKey}")
    public ResponseEntity<TransferResponse> getTransactionByIdempotencyKey(@PathVariable UUID idempotencyKey) {
        log.info("REST request to get transaction by idempotency key: {}", idempotencyKey);
        TransferResponse response = transactionService.getTransactionByIdempotencyKey(idempotencyKey);
        
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(response);
    }
}
