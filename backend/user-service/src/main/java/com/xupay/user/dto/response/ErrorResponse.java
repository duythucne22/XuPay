package com.xupay.user.dto.response;

import java.time.OffsetDateTime;

/**
 * ErrorResponse DTO
 * Standardized error response for all exceptions.
 * Provides consistent error format across all endpoints.
 */
public record ErrorResponse(
    OffsetDateTime timestamp,
    Integer status,
    String error,
    String message,
    String path
) {
}
