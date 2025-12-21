package com.xupay.user.dto.response;

import com.xupay.user.entity.enums.KycStatus;
import com.xupay.user.entity.enums.KycTier;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * UserResponse DTO
 * Response body for user profile endpoints.
 * Contains non-sensitive user information.
 */
public record UserResponse(
    UUID id,
    String email,
    String firstName,
    String lastName,
    String phone,
    KycStatus kycStatus,
    KycTier kycTier,
    Boolean isActive,
    OffsetDateTime createdAt
) {
}
