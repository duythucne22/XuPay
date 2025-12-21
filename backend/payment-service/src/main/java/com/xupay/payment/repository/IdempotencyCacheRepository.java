package com.xupay.payment.repository;

import com.xupay.payment.entity.IdempotencyCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * IdempotencyCacheRepository
 * Data access for cached transaction responses.
 */
@Repository
public interface IdempotencyCacheRepository extends JpaRepository<IdempotencyCache, UUID> {

    /**
     * Find cached response by idempotency key
     */
    Optional<IdempotencyCache> findByIdempotencyKey(UUID idempotencyKey);

    /**
     * Find expired cache entries
     */
    List<IdempotencyCache> findByExpiresAtBefore(LocalDateTime expiresAt);

    /**
     * Delete cache entry by idempotency key
     */
    void deleteByIdempotencyKey(UUID idempotencyKey);
}

