package com.fintech.user.service;

import com.fintech.user.dto.LoginRequest;
import com.fintech.user.dto.RegisterRequest;
import com.fintech.user.exception.InvalidPasswordException;
import com.fintech.user.exception.UserAlreadyExistsException;
import com.fintech.user.exception.UserNotFoundException;
import com.fintech.user.model.User;
import com.fintech.user.model.UserCredentials;
import com.fintech.user.repository.UserCredentialsRepository;
import com.fintech.user.repository.UserRepository;
import com.fintech.user.repository.UserAuditLogRepository;
import com.fintech.user.model.UserAuditLog;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final UserCredentialsRepository credentialsRepository;
    private final UserAuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;
    
    /**
     * Register a new user
     */
    @Transactional  // Write operation
    public User registerUser(RegisterRequest request, String ipAddress) {
        
        // Step 1: Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            log.warn("Registration attempt with existing email: {}", request.getEmail());
            throw new UserAlreadyExistsException(
                "Email " + request.getEmail() + " is already registered");
        }
        
        // Step 2: Create User entity
        User user = User.builder()
            .email(request.getEmail())
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .phoneNumber(request.getPhoneNumber())
            .kycStatus("pending")
            .accountStatus("active")
            .isEmailVerified(false)
            .build();
        
        // Step 3: Save user (will get UUID from DB)
        User savedUser = userRepository.save(user);
        log.info("User created: {}", savedUser.getId());
        
        // Step 4: Hash password and create credentials
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        String salt = UUID.randomUUID().toString();
        
        UserCredentials credentials = UserCredentials.builder()
            .userId(savedUser.getId())
            .passwordHash(hashedPassword)
            .passwordSalt(salt)
            .lastPasswordChange(LocalDateTime.now())
            .isPasswordExpired(false)
            .mfaEnabled(false)
            .build();
        
        credentialsRepository.save(credentials);
        
        // Step 5: Audit log
        auditLogRepository.save(UserAuditLog.builder()
            .userId(savedUser.getId())
            .action("user.registered")
            .ipAddress(ipAddress)
            .success(true)
            .build());
        
        return savedUser;
    }
    
    /**
     * Find user by ID
     */
    @Transactional(readOnly = true)
    public Optional<User> findById(String userId) {
        try {
            UUID uuid = UUID.fromString(userId);
            return userRepository.findById(uuid);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid UUID format: {}", userId);
            return Optional.empty();
        }
    }
    
    /**
     * Find user by email
     */
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    /**
     * Validate users (for gRPC)
     */
    @Transactional(readOnly = true)  // Read-only operation
    public Map<String, UserValidation> validateUsers(List<String> userIds) {
        // Convert string IDs to UUIDs (pre-filter valid ones)
        List<UUID> uuids = userIds.stream()
            .filter(this::isValidUUID)
            .map(UUID::fromString)
            .toList();
        
        // Query all users at once
        List<User> users = userRepository.findAllByIdIn(uuids);
        
        // Build validation map
        return userIds.stream()
            .collect(Collectors.toMap(
                id -> id,
                id -> {
                    UUID uuid;
                    try {
                        uuid = UUID.fromString(id);
                    } catch (IllegalArgumentException e) {
                        return UserValidation.builder()
                            .isValid(false)
                            .failureReason("Invalid UUID format")
                            .build();
                    }
                    
                    Optional<User> user = users.stream()
                        .filter(u -> u.getId().equals(uuid))
                        .findFirst();
                    
                    if (user.isEmpty()) {
                        return UserValidation.builder()
                            .isValid(false)
                            .failureReason("User not found")
                            .build();
                    }
                    
                    User u = user.get();
                    return UserValidation.builder()
                        .isValid(true)
                        .isAccountActive("active".equals(u.getAccountStatus()))
                        .isKycApproved("approved".equals(u.getKycStatus()))
                        .failureReason("")
                        .build();
                }
            ));
    }
    
    /**
     * Verify password for login
     */
    @Transactional  // Write operation (updates credentials)
    public User login(LoginRequest request, String ipAddress) {
        
        // Step 1: Find user by email
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> {
                log.warn("Login attempt with non-existent email: {}", request.getEmail());
                return new UserNotFoundException("Invalid email or password");
            });
        
        // Step 2: Get credentials
        UserCredentials credentials = credentialsRepository.findByUserId(user.getId())
            .orElseThrow(() -> new UserNotFoundException("Credentials not found"));
        
        // Step 3: Verify password
        if (!passwordEncoder.matches(request.getPassword(), credentials.getPasswordHash())) {
            log.warn("Failed login for user: {}", user.getId());
            
            // Log failure
            auditLogRepository.save(UserAuditLog.builder()
                .userId(user.getId())
                .action("login_failed")
                .ipAddress(ipAddress)
                .success(false)
                .failureReason("Invalid password")
                .build());
            
            throw new InvalidPasswordException("Invalid email or password");
        }
        
        // Step 4: Update last login
        credentials.setLastPasswordChange(LocalDateTime.now());
        credentialsRepository.save(credentials);
        
        // Step 5: Log successful login
        auditLogRepository.save(UserAuditLog.builder()
            .userId(user.getId())
            .action("login")
            .ipAddress(ipAddress)
            .success(true)
            .build());
        
        log.info("User logged in: {}", user.getId());
        return user;
    }
    
    // ========================================
    // HELPER METHODS
    // ========================================
    
    /**
     * Validate UUID format without throwing exception
     */
    private boolean isValidUUID(String uuid) {
        return uuid != null && uuid.matches("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");
    }
    
    /**
     * Data class for validation results
     */
    public static class UserValidation {
        public boolean isValid;
        public boolean isAccountActive;
        public boolean isKycApproved;
        public String failureReason;
        
        public UserValidation(boolean isValid, boolean isAccountActive, 
                             boolean isKycApproved, String failureReason) {
            this.isValid = isValid;
            this.isAccountActive = isAccountActive;
            this.isKycApproved = isKycApproved;
            this.failureReason = failureReason;
        }
        
        public static Builder builder() {
            return new Builder();
        }
        
        public static class Builder {
            private boolean isValid;
            private boolean isAccountActive;
            private boolean isKycApproved;
            private String failureReason = "";
            
            public Builder isValid(boolean isValid) {
                this.isValid = isValid;
                return this;
            }
            
            public Builder isAccountActive(boolean isAccountActive) {
                this.isAccountActive = isAccountActive;
                return this;
            }
            
            public Builder isKycApproved(boolean isKycApproved) {
                this.isKycApproved = isKycApproved;
                return this;
            }
            
            public Builder failureReason(String failureReason) {
                this.failureReason = failureReason;
                return this;
            }
            
            public UserValidation build() {
                return new UserValidation(isValid, isAccountActive, isKycApproved, failureReason);
            }
        }
    }
}