package com.xupay.user.grpc.interceptor;

import com.xupay.user.service.JwtService;
import io.grpc.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.interceptor.GrpcGlobalServerInterceptor;
import org.springframework.stereotype.Component;

/**
 * gRPC Interceptor for JWT Authentication
 * Validates JWT token from gRPC metadata (Authorization header)
 * 
 * Usage: Payment Service must include JWT in metadata:
 * Metadata.Key<String> AUTH_KEY = Metadata.Key.of("Authorization", Metadata.ASCII_STRING_MARSHALLER);
 * metadata.put(AUTH_KEY, "Bearer <JWT_TOKEN>");
 */
@Component
@GrpcGlobalServerInterceptor
@RequiredArgsConstructor
@Slf4j
public class JwtGrpcInterceptor implements ServerInterceptor {

    private final JwtService jwtService;
    
    private static final Metadata.Key<String> AUTHORIZATION_METADATA_KEY = 
            Metadata.Key.of("Authorization", Metadata.ASCII_STRING_MARSHALLER);

    @Override
    public <ReqT, RespT> ServerCall.Listener<ReqT> interceptCall(
            ServerCall<ReqT, RespT> call,
            Metadata headers,
            ServerCallHandler<ReqT, RespT> next) {
        
        String methodName = call.getMethodDescriptor().getFullMethodName();
        log.debug("gRPC call intercepted: {}", methodName);

        // Extract Authorization header
        String authHeader = headers.get(AUTHORIZATION_METADATA_KEY);
        
        if (authHeader == null || authHeader.isEmpty()) {
            log.warn("Missing Authorization header in gRPC call: {}", methodName);
            call.close(Status.UNAUTHENTICATED
                    .withDescription("Missing Authorization header"), new Metadata());
            return new ServerCall.Listener<>() {};
        }
        
        // Check Bearer prefix
        if (!authHeader.startsWith("Bearer ")) {
            log.warn("Invalid Authorization header format (missing Bearer prefix): {}", methodName);
            call.close(Status.UNAUTHENTICATED
                    .withDescription("Invalid Authorization header format. Expected: Bearer <token>"), 
                    new Metadata());
            return new ServerCall.Listener<>() {};
        }
        
        // Extract token
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        
        try {
            // Validate JWT token
            if (!jwtService.validateToken(token)) {
                log.warn("Invalid or expired JWT token in gRPC call: {}", methodName);
                call.close(Status.UNAUTHENTICATED
                        .withDescription("Invalid or expired JWT token"), new Metadata());
                return new ServerCall.Listener<>() {};
            }
            
            // Extract user email from token for logging
            String userEmail = jwtService.getEmailFromToken(token);
            log.debug("JWT validation successful for user: {} in gRPC call: {}", userEmail, methodName);
            
            // Token is valid, proceed with the call
            return next.startCall(call, headers);
            
        } catch (Exception e) {
            log.error("Error validating JWT in gRPC call: {}", methodName, e);
            call.close(Status.UNAUTHENTICATED
                    .withDescription("JWT validation failed: " + e.getMessage()), new Metadata());
            return new ServerCall.Listener<>() {};
        }
    }
}
