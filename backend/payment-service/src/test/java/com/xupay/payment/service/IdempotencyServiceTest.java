package com.xupay.payment.service;

import com.xupay.payment.dto.TransferResponse;
import com.xupay.payment.entity.IdempotencyCache;
import com.xupay.payment.entity.enums.TransactionStatus;
import com.xupay.payment.repository.IdempotencyCacheRepository;
import com.xupay.payment.service.impl.IdempotencyServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for IdempotencyServiceImpl
 * Tests Redis caching and database fallback behavior
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Idempotency Service Tests")
class IdempotencyServiceTest {

    @Mock
    private RedisTemplate<String, TransferResponse> redisTemplate;

    @Mock
    private ValueOperations<String, TransferResponse> valueOperations;

    @Mock
    private com.xupay.payment.repository.TransactionRepository transactionRepository;

    @InjectMocks
    private IdempotencyServiceImpl idempotencyService;

    private UUID testIdempotencyKey;
    private UUID testTransactionId;
    private TransferResponse testResponse;

    @BeforeEach
    void setUp() {
        testIdempotencyKey = UUID.randomUUID();
        testTransactionId = UUID.randomUUID();
        testResponse = TransferResponse.builder()
            .transactionId(testTransactionId)
            .status(TransactionStatus.COMPLETED)
            .amountCents(100_000L)
            .completedAt(LocalDateTime.now())
            .build();

        // Setup Redis template mock (lenient because not all tests use it)
        lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    @DisplayName("Should return cached response from Redis on cache hit")
    void getIfExists_CacheHit_ReturnsFromRedis() {
        // Given
        String expectedKey = "idempotency:" + testIdempotencyKey;
        when(valueOperations.get(expectedKey)).thenReturn(testResponse);

        // When
        Optional<TransferResponse> result = idempotencyService.getIfExists(testIdempotencyKey);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getTransactionId()).isEqualTo(testTransactionId);
        assertThat(result.get().getStatus()).isEqualTo(TransactionStatus.COMPLETED);
        
        // Verify database was not queried (Redis hit)
        verify(transactionRepository, never()).findByIdempotencyKey(any());
    }

    @Test
    @DisplayName("Should fall back to database when Redis returns null")
    void getIfExists_CacheMiss_FallsBackToDatabase() {
        // Given: Redis miss
        String redisKey = "idempotency:" + testIdempotencyKey;
        when(valueOperations.get(redisKey)).thenReturn(null);

        // Database has transaction
        com.xupay.payment.entity.Transaction mockTransaction = new com.xupay.payment.entity.Transaction();
        mockTransaction.setId(testTransactionId);
        mockTransaction.setStatus(com.xupay.payment.entity.enums.TransactionStatus.COMPLETED);
        mockTransaction.setAmountCents(100_000L);
        mockTransaction.setFromWalletId(UUID.randomUUID());
        mockTransaction.setToWalletId(UUID.randomUUID());
        mockTransaction.setCurrency("VND");
        mockTransaction.setType(com.xupay.payment.entity.enums.TransactionType.TRANSFER);
        
        when(transactionRepository.findByIdempotencyKey(testIdempotencyKey))
            .thenReturn(Optional.of(mockTransaction));

        // When
        Optional<TransferResponse> result = idempotencyService.getIfExists(testIdempotencyKey);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getTransactionId()).isEqualTo(testTransactionId);
        
        // Verify database was queried
        verify(transactionRepository).findByIdempotencyKey(testIdempotencyKey);
    }

    @Test
    @DisplayName("Should return empty when both Redis and database miss")
    void getIfExists_BothMiss_ReturnsEmpty() {
        // Given: Both miss
        when(valueOperations.get(anyString())).thenReturn(null);
        when(transactionRepository.findByIdempotencyKey(testIdempotencyKey))
            .thenReturn(Optional.empty());

        // When
        Optional<TransferResponse> result = idempotencyService.getIfExists(testIdempotencyKey);

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("Should store response in Redis with 24h TTL")
    void cache_StoresInRedis() {
        // When
        idempotencyService.cache(testIdempotencyKey, testResponse);

        // Then: Verify Redis storage
        ArgumentCaptor<String> keyCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<TransferResponse> responseCaptor = ArgumentCaptor.forClass(TransferResponse.class);
        ArgumentCaptor<Duration> durationCaptor = ArgumentCaptor.forClass(Duration.class);
        
        verify(valueOperations).set(
            keyCaptor.capture(), 
            responseCaptor.capture(), 
            durationCaptor.capture()
        );
        
        assertThat(keyCaptor.getValue()).isEqualTo("idempotency:" + testIdempotencyKey);
        assertThat(responseCaptor.getValue().getTransactionId()).isEqualTo(testTransactionId);
        assertThat(durationCaptor.getValue()).isEqualTo(Duration.ofHours(24));
    }

    @Test
    @DisplayName("Should return true when idempotency key exists in cache")
    void exists_CacheHit_ReturnsTrue() {
        // Given
        String expectedKey = "idempotency:" + testIdempotencyKey;
        when(redisTemplate.hasKey(expectedKey)).thenReturn(true);

        // When
        boolean result = idempotencyService.exists(testIdempotencyKey);

        // Then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("Should return true when idempotency key exists in database")
    void exists_DatabaseHit_ReturnsTrue() {
        // Given: Redis miss, database hit
        String expectedKey = "idempotency:" + testIdempotencyKey;
        when(redisTemplate.hasKey(expectedKey)).thenReturn(false);
        
        com.xupay.payment.entity.Transaction mockTransaction = new com.xupay.payment.entity.Transaction();
        when(transactionRepository.findByIdempotencyKey(testIdempotencyKey))
            .thenReturn(Optional.of(mockTransaction));

        // When
        boolean result = idempotencyService.exists(testIdempotencyKey);

        // Then
        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("Should return false when idempotency key does not exist")
    void exists_BothMiss_ReturnsFalse() {
        // Given
        String expectedKey = "idempotency:" + testIdempotencyKey;
        when(redisTemplate.hasKey(expectedKey)).thenReturn(false);
        when(transactionRepository.findByIdempotencyKey(testIdempotencyKey))
            .thenReturn(Optional.empty());

        // When
        boolean result = idempotencyService.exists(testIdempotencyKey);

        // Then
        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("Should remove idempotency key from Redis cache")
    void invalidate_RemovesFromCache() {
        // When
        idempotencyService.invalidate(testIdempotencyKey);

        // Then
        String expectedKey = "idempotency:" + testIdempotencyKey;
        verify(redisTemplate).delete(expectedKey);
    }

    @Test
    @DisplayName("Should handle null idempotency key gracefully")
    void getIfExists_NullKey_ReturnsEmpty() {
        // When
        Optional<TransferResponse> result = idempotencyService.getIfExists(null);

        // Then
        assertThat(result).isEmpty();
        verify(valueOperations, never()).get(anyString());
    }
}
