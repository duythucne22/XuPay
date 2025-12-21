package com.xupay.payment.service;

import com.xupay.payment.dto.TransferResponse;

import java.util.Optional;
import java.util.UUID;

/**
 * IdempotencyService
 * Service for caching transaction responses to prevent duplicate charges.
 * 
 * How Idempotency Works:
 * 1. Client generates UUID idempotency key
 * 2. First request: Process normally, cache response for 24 hours
 * 3. Retry with same key: Return cached response immediately (no processing)
 * 4. After 24 hours: Key expires, can retry (treated as new transaction)
 * 
 * Cache Hierarchy:
 * - Level 1: Redis cache (fast, 24h TTL)
 * - Level 2: Database (fallback, permanent)
 * 
 * Example Usage:
 * ```
 * // Check cache first
 * Optional<TransferResponse> cached = idempotencyService.getIfExists(idempotencyKey);
 * if (cached.isPresent()) {
 *     return cached.get();  // Return cached response
 * }
 * 
 * // Process transaction...
 * TransferResponse response = processTransaction(request);
 * 
 * // Cache response for future retries
 * idempotencyService.cache(idempotencyKey, response);
 * ```
 */
public interface IdempotencyService {

    /**
     * Check if idempotency key exists and return cached response.
     * 
     * Lookup Order:
     * 1. Check Redis cache (fast)
     * 2. If miss, check database (fallback)
     * 3. If found in DB, populate Redis
     * 
     * @param idempotencyKey UUID idempotency key from client
     * @return Optional of cached TransferResponse, empty if not found
     */
    Optional<TransferResponse> getIfExists(UUID idempotencyKey);

    /**
     * Cache transaction response for 24 hours.
     * 
     * Caches in Redis with TTL=24 hours.
     * Database insert handled separately by TransactionRepository.
     * 
     * @param idempotencyKey UUID idempotency key
     * @param response TransferResponse to cache
     */
    void cache(UUID idempotencyKey, TransferResponse response);

    /**
     * Invalidate cache entry (for failed/cancelled transactions).
     * 
     * Use case: Transaction failed after initial processing.
     * Client can retry with same key after invalidation.
     * 
     * @param idempotencyKey UUID idempotency key to invalidate
     */
    void invalidate(UUID idempotencyKey);

    /**
     * Check if idempotency key exists (boolean check only).
     * 
     * Lightweight check without fetching full response.
     * Useful for quick validation before expensive operations.
     * 
     * @param idempotencyKey UUID idempotency key
     * @return true if key exists in cache or database
     */
    boolean exists(UUID idempotencyKey);
}
