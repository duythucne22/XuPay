package com.xupay.payment.repository;

import com.xupay.payment.entity.Transaction;
import com.xupay.payment.entity.enums.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * TransactionRepository
 * Data access for transactions.
 */
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    Optional<Transaction> findByIdempotencyKey(UUID idempotencyKey);

    List<Transaction> findByFromUserIdOrderByCreatedAtDesc(UUID fromUserId);

    List<Transaction> findByToUserIdOrderByCreatedAtDesc(UUID toUserId);

    List<Transaction> findByStatusAndCreatedAtBefore(TransactionStatus status, LocalDateTime createdAt);

    List<Transaction> findByFromUserIdAndCreatedAtBetween(UUID fromUserId, LocalDateTime start, LocalDateTime end);

    /**
     * Count transactions from user after specific time.
     * Used for velocity fraud checks (e.g., max 10 txns/hour).
     * 
     * @param userId User ID (sender)
     * @param startTime Start time for counting (e.g., 1 hour ago)
     * @return Count of transactions from user since startTime
     */
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.fromUserId = :userId AND t.createdAt > :startTime")
    long countByFromUserIdAndCreatedAtAfter(
        @Param("userId") UUID userId, 
        @Param("startTime") Instant startTime
    );
}
