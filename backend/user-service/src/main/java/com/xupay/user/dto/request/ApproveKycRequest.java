package com.xupay.user.dto.request;

import com.xupay.user.entity.enums.KycTier;
import jakarta.validation.constraints.Size;

/**
 * ApproveKycRequest
 * Request DTO for admin approval of KYC document.
 */
public record ApproveKycRequest(
    
    @Size(max = 500, message = "Verification notes must not exceed 500 characters")
    String verificationNotes,
    
    KycTier upgradeTier  // Optional: if admin wants to upgrade user tier immediately
) {}
