package com.xupay.user.entity.enums;

/**
 * KYC verification status enum
 * Maps to database constraint: chk_kyc_status
 */
public enum KycStatus {
    /**
     * KYC documents submitted, awaiting verification
     */
    PENDING,
    
    /**
     * KYC verified and approved by admin
     */
    APPROVED,
    
    /**
     * KYC rejected by admin
     */
    REJECTED,
    
    /**
     * KYC expired and needs re-verification
     */
    EXPIRED;
    
    /**
     * Convert database value to enum
     */
    public static KycStatus fromString(String value) {
        if (value == null) {
            return PENDING;
        }
        return valueOf(value.toUpperCase());
    }
}
