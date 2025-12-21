package com.xupay.user.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;

/**
 * gRPC Server Configuration
 * Registers global interceptors for all gRPC services
 * 
 * Interceptor Order:
 * 1. LoggingGrpcInterceptor - Logs request/response
 * 2. JwtGrpcInterceptor - Validates JWT authentication
 */
@Configuration
@RequiredArgsConstructor
public class GrpcServerConfig {
}
