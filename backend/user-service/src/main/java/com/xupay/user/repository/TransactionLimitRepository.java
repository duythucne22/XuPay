package com.xupay.user.repository;

import com.xupay.user.entity.TransactionLimit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * TransactionLimitRepository - Spring Data JPA Repository for TransactionLimit entity
 * Manages tier-based transaction limits (4 configuration rows total).
 */
@Repository
public interface TransactionLimitRepository extends JpaRepository<TransactionLimit, UUID> {

    /**
     * Find transaction limits by tier name
     * This is the most common query - called by Payment Service via gRPC
     */
    Optional<TransactionLimit> findByTierName(String tierName);

    /**
     * Check if tier exists
     */
    boolean existsByTierName(String tierName);
}
