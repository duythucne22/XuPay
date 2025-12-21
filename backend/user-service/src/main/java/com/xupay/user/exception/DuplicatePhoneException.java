package com.xupay.user.exception;

/**
 * DuplicatePhoneException
 * Thrown when attempting to register with a phone number that already exists.
 * Maps to HTTP 409 CONFLICT.
 */
public class DuplicatePhoneException extends RuntimeException {

    public DuplicatePhoneException(String phone) {
        super("Phone number already registered: " + phone);
    }
}
