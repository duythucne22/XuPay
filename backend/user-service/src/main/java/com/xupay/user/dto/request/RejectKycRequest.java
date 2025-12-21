package com.xupay.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * RejectKycRequest
 * Request DTO for admin rejection of KYC document.
 */
public record RejectKycRequest(
    
    @NotBlank(message = "Rejection reason is required")
    @Size(max = 500, message = "Verification notes must not exceed 500 characters")
    String verificationNotes
) {}
