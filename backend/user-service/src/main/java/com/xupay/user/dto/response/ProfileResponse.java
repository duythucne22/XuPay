package com.xupay.user.dto.response;

import com.xupay.user.entity.enums.KycStatus;
import com.xupay.user.entity.enums.KycTier;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * ProfileResponse
 * Response DTO for user profile information.
 */
public record ProfileResponse(
    UUID id,
    String email,
    String firstName,
    String lastName,
    String phone,
    LocalDate dateOfBirth,
    KycStatus kycStatus,
    KycTier kycTier,
    Boolean isActive,
    OffsetDateTime createdAt
) {}
