package com.xupay.user.exception;

/**
 * DuplicateEmailException
 * Thrown when attempting to register with an email that already exists.
 * Maps to HTTP 409 CONFLICT.
 */
public class DuplicateEmailException extends RuntimeException {

    public DuplicateEmailException(String email) {
        super("Email already registered: " + email);
    }
}
