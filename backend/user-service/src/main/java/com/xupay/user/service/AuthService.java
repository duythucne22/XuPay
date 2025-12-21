package com.xupay.user.service;

import com.xupay.user.dto.request.LoginRequest;
import com.xupay.user.dto.request.RegisterRequest;
import com.xupay.user.dto.response.AuthResponse;
import com.xupay.user.entity.User;

/**
 * AuthService Interface
 * Defines authentication operations: register, login, token validation.
 */
public interface AuthService {

    /**
     * Register a new user
     * @param request Registration details
     * @return AuthResponse with JWT token
     * @throws com.xupay.user.exception.DuplicateEmailException if email exists
     * @throws com.xupay.user.exception.DuplicatePhoneException if phone exists
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Authenticate user and generate JWT token
     * @param request Login credentials
     * @return AuthResponse with JWT token
     * @throws com.xupay.user.exception.InvalidCredentialsException if credentials invalid
     * @throws com.xupay.user.exception.AccountSuspendedException if account suspended
     */
    AuthResponse login(LoginRequest request);

    /**
     * Validate JWT token
     * @param token JWT token string
     * @return true if valid, false otherwise
     */
    boolean validateToken(String token);

    /**
     * Get user from JWT token
     * @param token JWT token string
     * @return User entity
     * @throws com.xupay.user.exception.UserNotFoundException if user not found
     */
    User getUserFromToken(String token);
}
