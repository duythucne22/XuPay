package com.xupay.user.service.impl;

import com.xupay.user.config.JwtConfig;
import com.xupay.user.dto.request.LoginRequest;
import com.xupay.user.dto.request.RegisterRequest;
import com.xupay.user.dto.response.AuthResponse;
import com.xupay.user.entity.User;
import com.xupay.user.entity.UserPreference;
import com.xupay.user.entity.enums.KycStatus;
import com.xupay.user.entity.enums.KycTier;
import com.xupay.user.exception.*;
import com.xupay.user.repository.UserPreferenceRepository;
import com.xupay.user.repository.UserRepository;
import com.xupay.user.service.AuthService;
import com.xupay.user.service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * AuthServiceImpl
 * Implementation of authentication operations.
 * Handles user registration, login, and JWT token management.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JwtConfig jwtConfig;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.email());

        // Check if email already exists
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateEmailException(request.email());
        }

        // Check if phone already exists (if provided)
        if (request.phone() != null && userRepository.existsByPhone(request.phone())) {
            throw new DuplicatePhoneException(request.phone());
        }

        // Create user entity
        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .firstName(request.firstName())
                .lastName(request.lastName())
                .phone(request.phone())
                .dateOfBirth(request.dateOfBirth())
                .kycStatus(KycStatus.PENDING)
                .kycTier(KycTier.TIER_0)
                .isActive(true)
                .isSuspended(false)
                .fraudScore(0)
                .build();

        // Save user
        user = userRepository.save(user);
        log.info("User registered successfully with ID: {}", user.getId());

        // Create default user preferences
        UserPreference preferences = UserPreference.builder()
                .user(user)
                .language("en")
                .timezone("UTC")
                .currency("USD")
                .notificationEmail(true)
                .notificationSms(true)
                .notificationPush(true)
                .twoFactorEnabled(false)
                .biometricEnabled(false)
                .autoTopupEnabled(false)
                .theme("light")
                .build();

        userPreferenceRepository.save(preferences);
        log.debug("Default preferences created for user: {}", user.getId());

        // Generate JWT token
        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                jwtConfig.getExpirationInSeconds(),
                user.getId(),
                user.getEmail()
        );
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.email());

        // Find user by email
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new InvalidCredentialsException());

        // Verify password
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            log.warn("Invalid password attempt for email: {}", request.email());
            throw new InvalidCredentialsException();
        }

        // Check if account is active
        if (!user.getIsActive()) {
            log.warn("Login attempt for inactive account: {}", request.email());
            throw new InvalidCredentialsException("Account is not active");
        }

        // Check if account is suspended
        if (user.getIsSuspended()) {
            log.warn("Login attempt for suspended account: {}", request.email());
            throw new AccountSuspendedException();
        }

        // Update last login timestamp
        user.updateLastLogin();
        userRepository.save(user);

        log.info("User logged in successfully: {}", user.getId());

        // Generate JWT token
        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                jwtConfig.getExpirationInSeconds(),
                user.getId(),
                user.getEmail()
        );
    }

    @Override
    public boolean validateToken(String token) {
        return jwtService.validateToken(token);
    }

    @Override
    public User getUserFromToken(String token) {
        UUID userId = jwtService.getUserIdFromToken(token);
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    }
}
