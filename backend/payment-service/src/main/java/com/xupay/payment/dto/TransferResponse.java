package com.xupay.payment.dto;

import com.xupay.payment.entity.enums.TransactionStatus;
import com.xupay.payment.entity.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * TransferResponse
 * Response after processing a transfer.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransferResponse {

    private UUID transactionId;
    private UUID idempotencyKey;
    private UUID fromWalletId;
    private UUID toWalletId;
    private UUID fromUserId;
    private UUID toUserId;
    private Long amountCents;
    private BigDecimal amount;  // Amount in currency units
    private String currency;
    private TransactionType type;
    private TransactionStatus status;
    private String description;
    private Boolean isFlagged;
    private Integer fraudScore;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
