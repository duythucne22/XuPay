package com.xupay.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

/**
 * CheckLimitRequest
 * Request DTO for checking if a transaction is within limits.
 */
public record CheckLimitRequest(
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    Long amountCents,
    
    @NotBlank(message = "Transaction type is required")
    @Pattern(regexp = "^(send|receive)$", message = "Type must be 'send' or 'receive'")
    String type
) {}
