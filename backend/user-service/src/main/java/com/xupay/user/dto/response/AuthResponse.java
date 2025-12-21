package com.xupay.user.dto.response;

import java.util.UUID;

/**
 * AuthResponse DTO
 * Response body for successful authentication (register/login).
 * Contains JWT token and user information.
 */
public record AuthResponse(
    String token,
    String tokenType,
    Long expiresIn,
    UUID userId,
    String email
) {
    /**
     * Constructor with default token type "Bearer"
     */
    public AuthResponse(String token, Long expiresIn, UUID userId, String email) {
        this(token, "Bearer", expiresIn, userId, email);
    }
}
