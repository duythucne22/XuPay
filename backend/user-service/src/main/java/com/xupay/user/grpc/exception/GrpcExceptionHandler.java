package com.xupay.user.grpc.exception;

import com.xupay.user.exception.AccountSuspendedException;
import com.xupay.user.exception.UserNotFoundException;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * gRPC Exception Handler
 * Maps Java exceptions to gRPC Status codes
 * 
 * Status Code Mapping:
 * - INVALID_ARGUMENT (3): Bad request (invalid UUID, negative amount)
 * - NOT_FOUND (5): User not found
 * - PERMISSION_DENIED (7): User suspended/blocked/KYC not approved
 * - UNAUTHENTICATED (16): Invalid JWT
 * - INTERNAL (13): Unexpected server error
 */
@Component
@Slf4j
public class GrpcExceptionHandler {

    /**
     * Convert Java exception to gRPC StatusRuntimeException
     * @param e The exception to convert
     * @return StatusRuntimeException with appropriate Status code
     */
    public static StatusRuntimeException handleException(Exception e) {
        log.error("gRPC exception occurred: {}", e.getClass().getSimpleName(), e);
        
        // User not found
        if (e instanceof UserNotFoundException) {
            return Status.NOT_FOUND
                    .withDescription("User not found: " + e.getMessage())
                    .asRuntimeException();
        }
        
        // Invalid argument (bad UUID, negative amount, etc.)
        if (e instanceof IllegalArgumentException) {
            return Status.INVALID_ARGUMENT
                    .withDescription("Invalid request: " + e.getMessage())
                    .asRuntimeException();
        }
        
        // Account suspended/blocked
        if (e instanceof AccountSuspendedException) {
            return Status.PERMISSION_DENIED
                    .withDescription("Account suspended: " + e.getMessage())
                    .asRuntimeException();
        }
        
        // Security exception (should not happen, JWT interceptor handles this)
        if (e instanceof SecurityException) {
            return Status.UNAUTHENTICATED
                    .withDescription("Authentication required: " + e.getMessage())
                    .asRuntimeException();
        }
        
        // Generic fallback for unexpected errors
        return Status.INTERNAL
                .withDescription("Internal server error: " + e.getMessage())
                .asRuntimeException();
    }
    
    /**
     * Create INVALID_ARGUMENT status for bad requests
     */
    public static StatusRuntimeException invalidArgument(String message) {
        return Status.INVALID_ARGUMENT
                .withDescription(message)
                .asRuntimeException();
    }
    
    /**
     * Create NOT_FOUND status for missing resources
     */
    public static StatusRuntimeException notFound(String message) {
        return Status.NOT_FOUND
                .withDescription(message)
                .asRuntimeException();
    }
    
    /**
     * Create PERMISSION_DENIED status for unauthorized actions
     */
    public static StatusRuntimeException permissionDenied(String message) {
        return Status.PERMISSION_DENIED
                .withDescription(message)
                .asRuntimeException();
    }
    
    /**
     * Create INTERNAL status for server errors
     */
    public static StatusRuntimeException internal(String message) {
        return Status.INTERNAL
                .withDescription(message)
                .asRuntimeException();
    }
}
