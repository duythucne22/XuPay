package com.xupay.user.config;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * JwtConfig
 * Externalized JWT configuration properties from application.yml.
 * Properties are bound to the "jwt" prefix.
 */
@Configuration
@ConfigurationProperties(prefix = "jwt")
@Getter
@Setter
public class JwtConfig {

    /**
     * JWT secret key (must be at least 256 bits / 32 characters for HS256)
     */
    private String secret;

    /**
     * Token expiration time in milliseconds
     * Default: 86400000 (24 hours)
     */
    private Long expiration = 86400000L;

    /**
     * JWT issuer (iss claim)
     */
    private String issuer = "xupay-user-service";

    /**
     * JWT audience (aud claim)
     */
    private String audience = "xupay-client";

    /**
     * Validate configuration on startup
     */
    @PostConstruct
    public void validateConfig() {
        if (secret == null || secret.isEmpty()) {
            throw new IllegalStateException(
                "JWT secret must be configured in application.yml (jwt.secret)"
            );
        }
        
        // Ensure secret is at least 256 bits (32 characters) for HS256
        if (secret.length() < 32) {
            throw new IllegalStateException(
                "JWT secret must be at least 256 bits (32 characters) for HMAC-SHA256. " +
                "Current length: " + secret.length()
            );
        }

        if (expiration == null || expiration <= 0) {
            throw new IllegalStateException(
                "JWT expiration must be a positive number in milliseconds"
            );
        }
    }

    /**
     * Get expiration in seconds (for response DTO)
     */
    public Long getExpirationInSeconds() {
        return expiration / 1000;
    }
}
