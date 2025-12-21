package com.xupay.payment.service.impl;

import com.xupay.payment.dto.TransferResponse;
import com.xupay.payment.entity.Transaction;
import com.xupay.payment.repository.TransactionRepository;
import com.xupay.payment.service.IdempotencyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

/**
 * IdempotencyServiceImpl
 * Redis-based idempotency service with database fallback.
 * 
 * Architecture:
 * - Primary: Redis cache (fast, 24h TTL)
 * - Secondary: PostgreSQL (permanent, fallback)
 * 
 * Performance:
 * - Cache HIT: ~1ms (Redis lookup only)
 * - Cache MISS: ~50ms (DB query + Redis write)
 * - Expected hit rate: 90%+ (duplicate retries common in mobile apps)
 * 
 * Example Flow:
 * 1. Client sends request with idempotency_key = "abc-123"
 * 2. Check Redis: MISS
 * 3. Check DB: MISS
 * 4. Process transaction
 * 5. Cache response in Redis (TTL=24h)
 * 6. Client retries (network error)
 * 7. Check Redis: HIT → Return cached response (no processing)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class IdempotencyServiceImpl implements IdempotencyService {

    private static final String CACHE_KEY_PREFIX = "idempotency:";
    private static final long TTL_HOURS = 24;

    private final RedisTemplate<String, TransferResponse> redisTemplate;
    private final TransactionRepository transactionRepository;

    @Override
    public Optional<TransferResponse> getIfExists(UUID idempotencyKey) {
        // Guard clause: handle null key
        if (idempotencyKey == null) {
            log.warn("Idempotency key is null, returning empty");
            return Optional.empty();
        }

        // Step 1: Check Redis cache (fast path)
        String cacheKey = buildCacheKey(idempotencyKey);
        TransferResponse cachedResponse = redisTemplate.opsForValue().get(cacheKey);

        if (cachedResponse != null) {
            log.info("Idempotency cache HIT (Redis): key={}", idempotencyKey);
            return Optional.of(cachedResponse);
        }

        // Step 2: Check database (fallback path)
        log.info("Idempotency cache MISS (Redis), checking database: key={}", idempotencyKey);
        Optional<Transaction> transaction = transactionRepository.findByIdempotencyKey(idempotencyKey);

        if (transaction.isPresent()) {
            log.info("Idempotency found in database: key={}, transactionId={}", 
                     idempotencyKey, transaction.get().getId());
            
            // Build response from transaction
            TransferResponse response = buildTransferResponse(transaction.get());
            
            // Populate Redis cache for next time
            cache(idempotencyKey, response);
            
            return Optional.of(response);
        }

        log.info("Idempotency key not found: key={}", idempotencyKey);
        return Optional.empty();
    }

    @Override
    public void cache(UUID idempotencyKey, TransferResponse response) {
        String cacheKey = buildCacheKey(idempotencyKey);
        
        try {
            redisTemplate.opsForValue().set(cacheKey, response, Duration.ofHours(TTL_HOURS));
            log.info("Cached transaction response: key={}, transactionId={}, TTL={}h", 
                     idempotencyKey, response.getTransactionId(), TTL_HOURS);
        } catch (Exception e) {
            // Don't fail if Redis is down, just log error
            log.error("Failed to cache idempotency key {}: {}", idempotencyKey, e.getMessage());
        }
    }

    @Override
    public void invalidate(UUID idempotencyKey) {
        String cacheKey = buildCacheKey(idempotencyKey);
        
        try {
            Boolean deleted = redisTemplate.delete(cacheKey);
            log.info("Invalidated idempotency cache: key={}, wasPresent={}", idempotencyKey, deleted);
        } catch (Exception e) {
            log.error("Failed to invalidate idempotency key {}: {}", idempotencyKey, e.getMessage());
        }
    }

    @Override
    public boolean exists(UUID idempotencyKey) {
        // Check Redis first
        String cacheKey = buildCacheKey(idempotencyKey);
        Boolean hasKey = redisTemplate.hasKey(cacheKey);
        
        if (Boolean.TRUE.equals(hasKey)) {
            return true;
        }
        
        // Check database as fallback
        return transactionRepository.findByIdempotencyKey(idempotencyKey).isPresent();
    }

    /**
     * Build Redis cache key from idempotency key.
     * 
     * Format: "idempotency:{uuid}"
     * Example: "idempotency:550e8400-e29b-41d4-a716-446655440000"
     */
    private String buildCacheKey(UUID idempotencyKey) {
        return CACHE_KEY_PREFIX + idempotencyKey.toString();
    }

    /**
     * Build TransferResponse from Transaction entity.
     * 
     * Used when loading from database to populate Redis cache.
     */
    private TransferResponse buildTransferResponse(Transaction transaction) {
        return TransferResponse.builder()
                .transactionId(transaction.getId())
                .idempotencyKey(transaction.getIdempotencyKey())
                .fromWalletId(transaction.getFromWalletId())
                .toWalletId(transaction.getToWalletId())
                .fromUserId(transaction.getFromUserId())
                .toUserId(transaction.getToUserId())
                .amountCents(transaction.getAmountCents())
                .amount(BigDecimal.valueOf(transaction.getAmountCents())
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP))
                .currency(transaction.getCurrency())
                .type(transaction.getType())
                .status(transaction.getStatus())
                .description(transaction.getDescription())
                .isFlagged(transaction.getIsFlagged())
                .fraudScore(transaction.getFraudScore())
                .createdAt(transaction.getCreatedAt())
                .completedAt(transaction.getCompletedAt())
                .build();
    }
}
