package com.xupay.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * DailyUsage Entity
 * Tracks daily transaction volumes for each user to enforce transaction limits.
 * One record per user per day (usage_date).
 * This table can grow large (~365M rows for 1M users over 1 year).
 */
@Entity
@Table(
    name = "daily_usage",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "usage_date"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "usage_date", nullable = false)
    private LocalDate usageDate;

    @Column(name = "total_sent_cents", nullable = false)
    @Builder.Default
    private Long totalSentCents = 0L;

    @Column(name = "total_sent_count", nullable = false)
    @Builder.Default
    private Integer totalSentCount = 0;

    @Column(name = "total_received_cents", nullable = false)
    @Builder.Default
    private Long totalReceivedCents = 0L;

    @Column(name = "total_received_count", nullable = false)
    @Builder.Default
    private Integer totalReceivedCount = 0;

    @Column(name = "hourly_sent_counts", columnDefinition = "JSONB")
    private String hourlySentCounts; // JSON object: {"00": 2, "01": 0, "14": 5}

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    // Business methods

    /**
     * Increment sent amount and count
     */
    public void incrementSent(Long amountCents) {
        this.totalSentCents += amountCents;
        this.totalSentCount++;
    }

    /**
     * Increment received amount and count
     */
    public void incrementReceived(Long amountCents) {
        this.totalReceivedCents += amountCents;
        this.totalReceivedCount++;
    }

    /**
     * Get total transaction count
     */
    public Integer getTotalTransactionCount() {
        return (totalSentCount != null ? totalSentCount : 0) + (totalReceivedCount != null ? totalReceivedCount : 0);
    }

    /**
     * Check if user has reached daily transaction count limit
     */
    public boolean hasReachedCountLimit(Integer maxCount) {
        int totalCount = (totalSentCount != null ? totalSentCount : 0) + (totalReceivedCount != null ? totalReceivedCount : 0);
        return totalCount >= maxCount;
    }

    /**
     * Check if user can send additional amount based on daily limit
     */
    public boolean canSend(Long additionalAmountCents, Long dailyLimit) {
        return (this.totalSentCents + additionalAmountCents) <= dailyLimit;
    }

    /**
     * Check if user can receive additional amount based on daily limit
     */
    public boolean canReceive(Long additionalAmountCents, Long dailyLimit) {
        return (this.totalReceivedCents + additionalAmountCents) <= dailyLimit;
    }

    /**
     * Get total sent in dollars for display
     */
    public double getTotalSentDollars() {
        return totalSentCents / 100.0;
    }

    /**
     * Get total received in dollars for display
     */
    public double getTotalReceivedDollars() {
        return totalReceivedCents / 100.0;
    }

    /**
     * Check if this is today's usage record
     */
    public boolean isToday() {
        return usageDate.equals(LocalDate.now());
    }
}
