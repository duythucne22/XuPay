package com.xupay.user.exception;

/**
 * InvalidCredentialsException
 * Thrown when login fails due to incorrect email or password.
 * Maps to HTTP 401 UNAUTHORIZED.
 */
public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException() {
        super("Invalid email or password");
    }

    public InvalidCredentialsException(String message) {
        super(message);
    }
}
