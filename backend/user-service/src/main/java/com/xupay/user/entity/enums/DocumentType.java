package com.xupay.user.entity.enums;

/**
 * Types of KYC documents accepted
 * Maps to database constraint: chk_document_type
 */
public enum DocumentType {
    /**
     * International passport
     */
    PASSPORT,
    
    /**
     * Driver's license
     */
    DRIVERS_LICENSE,
    
    /**
     * National identity card
     */
    NATIONAL_ID,
    
    /**
     * Utility bill (address verification)
     */
    UTILITY_BILL,
    
    /**
     * Selfie photo (face verification)
     */
    SELFIE;
    
    /**
     * Convert database value to enum
     */
    public static DocumentType fromString(String value) {
        if (value == null) {
            return null;
        }
        return valueOf(value.toUpperCase());
    }
}
