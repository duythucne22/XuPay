package com.xupay.payment.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.xupay.payment.dto.TransferResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * RedisConfig
 * Configuration for Redis caching with custom serialization.
 * 
 * Purpose:
 * - Define RedisTemplate<String, TransferResponse> bean for idempotency caching
 * - Configure Jackson JSON serialization for TransferResponse objects
 * - Enable Java 8 time (LocalDateTime) support
 * 
 * Why This Is Needed:
 * Spring Boot auto-configures RedisTemplate<Object, Object> by default,
 * but we need RedisTemplate<String, TransferResponse> for type safety.
 */
@Configuration
public class RedisConfig {

    /**
     * Create RedisTemplate bean for caching TransferResponse objects.
     * 
     * Serialization Strategy:
     * - Key: String (idempotency key as string)
     * - Value: JSON (TransferResponse serialized as JSON using Jackson)
     * 
     * @param connectionFactory Redis connection factory (auto-configured by Spring Boot)
     * @return RedisTemplate<String, TransferResponse> for idempotency caching
     */
    @Bean
    public RedisTemplate<String, TransferResponse> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, TransferResponse> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // Configure ObjectMapper for JSON serialization
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule()); // Support LocalDateTime, Instant, etc.
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS); // ISO-8601 format

        // Create JSON serializer for TransferResponse
        Jackson2JsonRedisSerializer<TransferResponse> serializer = 
            new Jackson2JsonRedisSerializer<>(TransferResponse.class);
        serializer.setObjectMapper(objectMapper);

        // Set serializers
        template.setKeySerializer(new StringRedisSerializer());         // Keys as plain strings
        template.setValueSerializer(serializer);                        // Values as JSON
        template.setHashKeySerializer(new StringRedisSerializer());     // Hash keys as strings
        template.setHashValueSerializer(serializer);                    // Hash values as JSON

        template.afterPropertiesSet();
        return template;
    }
}
