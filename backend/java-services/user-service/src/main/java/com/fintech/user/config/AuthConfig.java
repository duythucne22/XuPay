package com.fintech.user.config;

import org.springframework.context.annotation.Configuration;

/**
 * Authentication configuration.
 * 
 * NOTE: PasswordEncoder is defined in SecurityConfig to avoid circular dependencies.
 * Add JWT configuration here when implementing token-based auth.
 */
@Configuration
public class AuthConfig {
    
    // JWT configuration will be added here
    // For now, authentication uses session-based approach
    
}