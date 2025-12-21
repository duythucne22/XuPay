package com.xupay.payment.entity;

import com.xupay.payment.entity.enums.TransactionStatus;
import com.xupay.payment.entity.enums.TransactionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Transaction
 * High-level transaction records.
 * Maps to: transactions table
 * 
 * CRITICAL: idempotency_key must be unique (prevents duplicate charges).
 * Each transaction generates 2+ balanced ledger entries.
 */
@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "idempotency_key", nullable = false, unique = true)
    private UUID idempotencyKey;

    @Column(name = "from_wallet_id")
    private UUID fromWalletId;

    @Column(name = "to_wallet_id")
    private UUID toWalletId;

    @Column(name = "from_user_id") // NULL for TOPUP (external source)
    private UUID fromUserId;

    @Column(name = "to_user_id") // NULL for WITHDRAW
    private UUID toUserId;

    @Column(name = "amount_cents", nullable = false)
    private Long amountCents;  // In cents to avoid floating point

    @Column(name = "currency", nullable = false, length = 3)
    private String currency = "VND";

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TransactionStatus status = TransactionStatus.PENDING;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "reference_number", length = 50)
    private String referenceNumber;

    @Column(name = "is_flagged", nullable = false)
    private Boolean isFlagged = false;

    @Column(name = "fraud_score")
    private Integer fraudScore;

    @Column(name = "fraud_reason", columnDefinition = "TEXT")
    private String fraudReason;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;

    @Column(name = "is_reversed", nullable = false)
    private Boolean isReversed = false;

    @Column(name = "reversed_by_transaction_id")
    private UUID reversedByTransactionId;

    @Column(name = "reversal_reason", columnDefinition = "TEXT")
    private String reversalReason;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
