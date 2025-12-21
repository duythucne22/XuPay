package com.xupay.user.dto.response;

/**
 * LimitCheckResponse
 * Response DTO for transaction limit check result.
 */
public record LimitCheckResponse(
    Boolean allowed,
    String reason,  // Explanation if not allowed
    Long remainingLimitCents  // How much user can still send/receive today
) {}
