package com.xupay.user.exception;

/**
 * AccountSuspendedException
 * Thrown when attempting to login with a suspended account.
 * Maps to HTTP 403 FORBIDDEN.
 */
public class AccountSuspendedException extends RuntimeException {

    public AccountSuspendedException() {
        super("Account has been suspended. Please contact support.");
    }

    public AccountSuspendedException(String message) {
        super(message);
    }
}
