package com.xupay.user.dto.response;

import com.xupay.user.entity.enums.DocumentType;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * KycDocumentResponse
 * Response DTO for KYC document information.
 */
public record KycDocumentResponse(
    UUID id,
    UUID userId,
    DocumentType documentType,
    String documentNumber,
    String documentCountry,
    String fileUrl,
    String verificationStatus,  // "pending", "approved", "rejected", "expired"
    String verificationNotes,
    UUID verifiedBy,
    OffsetDateTime verifiedAt,
    OffsetDateTime expiresAt,
    OffsetDateTime createdAt
) {}
