package com.xupay.user.exception;

import java.util.UUID;

/**
 * KycDocumentNotFoundException
 * Thrown when a KYC document cannot be found by ID.
 */
public class KycDocumentNotFoundException extends RuntimeException {

    public KycDocumentNotFoundException(UUID documentId) {
        super("KYC document not found with ID: " + documentId);
    }

    public KycDocumentNotFoundException(String message) {
        super(message);
    }
}
