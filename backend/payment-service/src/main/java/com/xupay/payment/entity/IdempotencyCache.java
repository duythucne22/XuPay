package com.xupay.payment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * IdempotencyCache
 * Caches transaction responses for 24 hours.
 * Maps to: idempotency_cache table
 * 
 * PURPOSE: Prevents duplicate charges when client retries request.
 * - First request: Process normally, cache response
 * - Retry with same key: Return cached response immediately
 */
@Entity
@Table(name = "idempotency_cache")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IdempotencyCache {

    @Id
    @Column(name = "idempotency_key")
    private UUID idempotencyKey;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "response_data", nullable = false, columnDefinition = "jsonb")
    private String responseData;  // JSON string

    @Column(name = "transaction_id")
    private UUID transactionId;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
