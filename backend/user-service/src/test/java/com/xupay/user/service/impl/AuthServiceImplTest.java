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
import com.xupay.user.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AuthServiceImpl
 * Tests registration, login, and JWT validation logic
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserPreferenceRepository userPreferenceRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private JwtConfig jwtConfig;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest validRegisterRequest;
    private LoginRequest validLoginRequest;
    private User testUser;

    @BeforeEach
    void setUp() {
        validRegisterRequest = new RegisterRequest(
                "john.doe@example.com",
                "SecurePassword123!",
                "John",
                "Doe",
                "+1234567890",
                LocalDate.of(1990, 1, 15)
        );

        validLoginRequest = new LoginRequest(
                "john.doe@example.com",
                "SecurePassword123!"
        );

        testUser = User.builder()
                .id(UUID.randomUUID())
                .email("john.doe@example.com")
                .passwordHash("$2a$10$encodedPasswordHash")
                .firstName("John")
                .lastName("Doe")
                .phone("+1234567890")
                .dateOfBirth(LocalDate.of(1990, 1, 15))
                .kycStatus(KycStatus.PENDING)
                .kycTier(KycTier.TIER_0)
                .isActive(true)
                .isSuspended(false)
                .fraudScore(0)
                .build();
    }

    // ==================== REGISTRATION TESTS ====================

    @Test
    void register_ValidRequest_CreatesUserSuccessfully() {
        // Arrange
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByPhone(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$encodedPasswordHash");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(userPreferenceRepository.save(any(UserPreference.class))).thenReturn(new UserPreference());
        when(jwtService.generateToken(any(User.class))).thenReturn("mock.jwt.token");
        when(jwtConfig.getExpirationInSeconds()).thenReturn(86400L);

        // Act
        AuthResponse response = authService.register(validRegisterRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.token()).isEqualTo("mock.jwt.token");
        assertThat(response.expiresIn()).isEqualTo(86400L);
        assertThat(response.userId()).isEqualTo(testUser.getId());
        assertThat(response.email()).isEqualTo(testUser.getEmail());

        // Verify user was saved with correct properties
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        
        assertThat(savedUser.getEmail()).isEqualTo("john.doe@example.com");
        assertThat(savedUser.getKycStatus()).isEqualTo(KycStatus.PENDING);
        assertThat(savedUser.getKycTier()).isEqualTo(KycTier.TIER_0);
        assertThat(savedUser.getIsActive()).isTrue();
        assertThat(savedUser.getIsSuspended()).isFalse();
        assertThat(savedUser.getFraudScore()).isEqualTo(0);

        // Verify preferences were created
        verify(userPreferenceRepository).save(any(UserPreference.class));
    }

    @Test
    void register_DuplicateEmail_ThrowsDuplicateEmailException() {
        // Arrange
        when(userRepository.existsByEmail("john.doe@example.com")).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authService.register(validRegisterRequest))
                .isInstanceOf(DuplicateEmailException.class);

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_DuplicatePhone_ThrowsDuplicatePhoneException() {
        // Arrange
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByPhone("+1234567890")).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authService.register(validRegisterRequest))
                .isInstanceOf(DuplicatePhoneException.class);

        verify(userRepository, never()).save(any(User.class));
    }

    // ==================== LOGIN TESTS ====================

    @Test
    void login_ValidCredentials_ReturnsAuthResponse() {
        // Arrange
        when(userRepository.findByEmail("john.doe@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("SecurePassword123!", testUser.getPasswordHash())).thenReturn(true);
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtService.generateToken(any(User.class))).thenReturn("mock.jwt.token");
        when(jwtConfig.getExpirationInSeconds()).thenReturn(86400L);

        // Act
        AuthResponse response = authService.login(validLoginRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.token()).isEqualTo("mock.jwt.token");
        assertThat(response.userId()).isEqualTo(testUser.getId());
        assertThat(response.email()).isEqualTo(testUser.getEmail());

        // Verify last login was updated
        verify(userRepository).save(testUser);
    }

    @Test
    void login_InvalidEmail_ThrowsInvalidCredentialsException() {
        // Arrange
        when(userRepository.findByEmail("wrong@example.com")).thenReturn(Optional.empty());

        LoginRequest invalidRequest = new LoginRequest("wrong@example.com", "password");

        // Act & Assert
        assertThatThrownBy(() -> authService.login(invalidRequest))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void login_InvalidPassword_ThrowsInvalidCredentialsException() {
        // Arrange
        when(userRepository.findByEmail("john.doe@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("WrongPassword", testUser.getPasswordHash())).thenReturn(false);

        LoginRequest invalidRequest = new LoginRequest("john.doe@example.com", "WrongPassword");

        // Act & Assert
        assertThatThrownBy(() -> authService.login(invalidRequest))
                .isInstanceOf(InvalidCredentialsException.class);

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_InactiveAccount_ThrowsInvalidCredentialsException() {
        // Arrange
        testUser.setIsActive(false);
        when(userRepository.findByEmail("john.doe@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("SecurePassword123!", testUser.getPasswordHash())).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authService.login(validLoginRequest))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessageContaining("Account is not active");
    }

    @Test
    void login_SuspendedAccount_ThrowsAccountSuspendedException() {
        // Arrange
        testUser.setIsSuspended(true);
        when(userRepository.findByEmail("john.doe@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("SecurePassword123!", testUser.getPasswordHash())).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authService.login(validLoginRequest))
                .isInstanceOf(AccountSuspendedException.class);
    }

    // ==================== TOKEN VALIDATION TESTS ====================

    @Test
    void validateToken_ValidToken_ReturnsTrue() {
        // Arrange
        when(jwtService.validateToken("valid.jwt.token")).thenReturn(true);

        // Act
        boolean isValid = authService.validateToken("valid.jwt.token");

        // Assert
        assertThat(isValid).isTrue();
    }

    @Test
    void validateToken_InvalidToken_ReturnsFalse() {
        // Arrange
        when(jwtService.validateToken("invalid.token")).thenReturn(false);

        // Act
        boolean isValid = authService.validateToken("invalid.token");

        // Assert
        assertThat(isValid).isFalse();
    }

    @Test
    void getUserFromToken_ValidToken_ReturnsUser() {
        // Arrange
        UUID userId = testUser.getId();
        when(jwtService.getUserIdFromToken("valid.jwt.token")).thenReturn(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        // Act
        User user = authService.getUserFromToken("valid.jwt.token");

        // Assert
        assertThat(user).isNotNull();
        assertThat(user.getId()).isEqualTo(userId);
        assertThat(user.getEmail()).isEqualTo("john.doe@example.com");
    }

    @Test
    void getUserFromToken_UserNotFound_ThrowsUserNotFoundException() {
        // Arrange
        UUID userId = UUID.randomUUID();
        when(jwtService.getUserIdFromToken("valid.jwt.token")).thenReturn(userId);
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> authService.getUserFromToken("valid.jwt.token"))
                .isInstanceOf(UserNotFoundException.class);
    }
}
