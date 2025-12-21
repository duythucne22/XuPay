package com.xupay.user.entity.enums;

/**
 * KYC tier levels with transaction limits
 * Maps to database constraint: chk_kyc_tier
 * 
 * Tier Limits:
 * - TIER_0: $100/day (unverified)
 * - TIER_1: $1,000/day (basic KYC)
 * - TIER_2: $10,000/day (enhanced KYC)
 * - TIER_3: $100,000/day (full KYC)
 */
public enum KycTier {
    /**
     * Unverified user - $100/day limit
     */
    TIER_0,
    
    /**
     * Basic KYC - $1,000/day limit
     */
    TIER_1,
    
    /**
     * Enhanced KYC - $10,000/day limit
     */
    TIER_2,
    
    /**
     * Full KYC - $100,000/day limit
     */
    TIER_3;
    
    /**
     * Convert database value to enum
     */
    public static KycTier fromString(String value) {
        if (value == null) {
            return TIER_0;
        }
        return valueOf(value.toUpperCase());
    }
    
    /**
     * Get tier from integer value (0-3)
     */
    public static KycTier fromInt(int value) {
        return switch (value) {
            case 0 -> TIER_0;
            case 1 -> TIER_1;
            case 2 -> TIER_2;
            case 3 -> TIER_3;
            default -> throw new IllegalArgumentException("Invalid tier: " + value);
        };
    }
}
