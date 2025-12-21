package com.xupay.user.dto.response;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * ContactResponse
 * Response DTO for user contact information.
 */
public record ContactResponse(
    UUID id,
    UUID contactUserId,
    String contactName,  // Full name of contact user
    String nickname,
    Integer totalTransactions,
    OffsetDateTime lastTransactionAt,
    Boolean isFavorite
) {}
