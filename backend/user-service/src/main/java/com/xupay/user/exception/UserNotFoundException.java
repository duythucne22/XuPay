package com.xupay.user.exception;

import java.util.UUID;

/**
 * UserNotFoundException
 * Thrown when a user is not found by ID or email.
 * Maps to HTTP 404 NOT_FOUND.
 */
public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(String message) {
        super(message);
    }

    public UserNotFoundException(UUID userId) {
        super("User not found with ID: " + userId);
    }

    public UserNotFoundException(String field, String value) {
        super(String.format("User not found with %s: %s", field, value));
    }
}
