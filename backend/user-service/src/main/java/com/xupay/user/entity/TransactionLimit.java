package com.xupay.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * TransactionLimit Entity
 * Defines transaction limits for each KYC tier.
 * This is a configuration table with only 4 rows (tier_0, tier_1, tier_2, tier_3).
 */
@Entity
@Table(name = "transaction_limits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionLimit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "tier_name", nullable = false, unique = true, length = 20)
    private String tierName; // tier_0, tier_1, tier_2, tier_3

    @Column(name = "daily_send_limit_cents", nullable = false)
    private Long dailySendLimitCents;

    @Column(name = "daily_receive_limit_cents", nullable = false)
    private Long dailyReceiveLimitCents;

    @Column(name = "single_transaction_max_cents", nullable = false)
    private Long singleTransactionMaxCents;

    @Column(name = "monthly_volume_limit_cents", nullable = false)
    private Long monthlyVolumeLimitCents;

    @Column(name = "max_transactions_per_day", nullable = false)
    @Builder.Default
    private Integer maxTransactionsPerDay = 100;

    @Column(name = "max_transactions_per_hour", nullable = false)
    @Builder.Default
    private Integer maxTransactionsPerHour = 10;

    @Column(name = "can_send_international", nullable = false)
    @Builder.Default
    private Boolean canSendInternational = false;

    @Column(name = "can_receive_merchant_payments", nullable = false)
    @Builder.Default
    private Boolean canReceiveMerchantPayments = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    // Business methods

    /**
     * Check if amount is within single transaction limit
     */
    public boolean isAmountWithinSingleLimit(Long amountCents) {
        return amountCents <= singleTransactionMaxCents;
    }

    /**
     * Check if daily sent amount is within limit
     */
    public boolean isDailySendWithinLimit(Long dailySentCents, Long newAmountCents) {
        return (dailySentCents + newAmountCents) <= dailySendLimitCents;
    }

    /**
     * Check if daily received amount is within limit
     */
    public boolean isDailyReceiveWithinLimit(Long dailyReceivedCents, Long newAmountCents) {
        return (dailyReceivedCents + newAmountCents) <= dailyReceiveLimitCents;
    }

    /**
     * Get daily send limit in dollars for display
     */
    public double getDailySendLimitDollars() {
        return dailySendLimitCents / 100.0;
    }

    /**
     * Get single transaction max in dollars for display
     */
    public double getSingleTransactionMaxDollars() {
        return singleTransactionMaxCents / 100.0;
    }
}
