package com.xupay.user.controller;

import com.xupay.user.dto.request.LoginRequest;
import com.xupay.user.dto.request.RegisterRequest;
import com.xupay.user.dto.response.AuthResponse;
import com.xupay.user.dto.response.UserResponse;
import com.xupay.user.entity.User;
import com.xupay.user.exception.UserNotFoundException;
import com.xupay.user.repository.UserRepository;
import com.xupay.user.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * AuthController
 * REST API endpoints for authentication operations.
 * Handles user registration, login, and profile retrieval.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    /**
     * Register a new user
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration request received for email: {}", request.email());
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Login with email and password
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request received for email: {}", request.email());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Logout (client-side token removal)
     * POST /api/auth/logout
     * Note: JWT is stateless, actual logout handled on client by removing token
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        log.info("Logout request received");
        // JWT is stateless, no server-side session to invalidate
        // Client should remove token from storage
        return ResponseEntity.noContent().build();
    }

    /**
     * Validate JWT token
     * GET /api/auth/validate
     * Used by API Gateway to validate tokens
     */
    @GetMapping("/validate")
    public ResponseEntity<Void> validate() {
        // If this endpoint is reached, JWT filter already validated the token
        log.debug("Token validation successful");
        return ResponseEntity.ok().build();
    }

    /**
     * Get current authenticated user's profile
     * GET /api/auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            log.warn("Unauthorized access to /api/auth/me");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UUID userId = UUID.fromString(authentication.getName());
        log.debug("Fetching profile for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        UserResponse response = new UserResponse(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getPhone(),
            user.getKycStatus(),
            user.getKycTier(),
            user.getIsActive(),
            user.getCreatedAt().toOffsetDateTime()
        );
        
        return ResponseEntity.ok(response);
    }
}
