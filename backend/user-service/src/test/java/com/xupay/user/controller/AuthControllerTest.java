package com.xupay.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xupay.user.controller.AuthController;
import com.xupay.user.dto.request.LoginRequest;
import com.xupay.user.dto.request.RegisterRequest;
import com.xupay.user.dto.response.AuthResponse;
import com.xupay.user.dto.response.UserResponse;
import com.xupay.user.entity.User;
import com.xupay.user.entity.enums.KycStatus;
import com.xupay.user.entity.enums.KycTier;
import com.xupay.user.mapper.UserMapper;
import com.xupay.user.repository.UserRepository;
import com.xupay.user.service.AuthService;
import com.xupay.user.service.JwtService;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Unit tests for AuthController
 * Tests all authentication endpoints: register, login, logout, validate, and me
 */
@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private UserDetailsService userDetailsService; // <--- SecurityConfig needs this!

    @MockBean
    private JwtService jwtService; // <--- SecurityConfig needs this!

    // (Optional) Add this if you use JPA Auditing (CreatedDate, etc.)
    @MockBean
    private JpaMetamodelMappingContext jpaMappingContext;

    @MockBean
    private UserMapper userMapper;

    @Test
    @DisplayName("POST /api/auth/register - Should register new user and return token")
    void register_shouldReturnCreatedWithAuthResponse() throws Exception {
        // Arrange
        RegisterRequest request = new RegisterRequest(
            "test@example.com",
            "P@ssword123",
            "John",
            "Doe",
            "+84901234567",
            null
        );

        UserResponse userResponse = new UserResponse(
            UUID.randomUUID(),
            "test@example.com",
            "John",
            "Doe",
            "+84901234567",
            KycStatus.PENDING,
            KycTier.TIER_0,
            true,
            OffsetDateTime.now()
        );

        AuthResponse authResponse = new AuthResponse(
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            604800L,
            userResponse.id(),
            userResponse.email()
        );

        when(authService.register(any(RegisterRequest.class))).thenReturn(authResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.token").value("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."))
            .andExpect(jsonPath("$.email").value("test@example.com"))
            .andExpect(jsonPath("$.userId").exists());
    }

    @Test
    @DisplayName("POST /api/auth/login - Should authenticate user and return token")
    void login_shouldReturnOkWithAuthResponse() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest(
            "test@example.com",
            "P@ssword123"
        );

        UserResponse userResponse = new UserResponse(
            UUID.randomUUID(),
            "test@example.com",
            "John",
            "Doe",
            "+84901234567",
            KycStatus.APPROVED,
            KycTier.TIER_1,
            true,
            OffsetDateTime.now()
        );

        AuthResponse authResponse = new AuthResponse(
            "login-token-xyz",
            604800L,
            userResponse.id(),
            userResponse.email()
        );

        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("login-token-xyz"))
            .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    @DisplayName("POST /api/auth/logout - Should return no content")
    void logout_shouldReturnNoContent() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/logout")
                .with(csrf()))
            .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("GET /api/auth/validate - Should validate token and return ok")
    @WithMockUser
    void validate_shouldReturnOk() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/auth/validate"))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /api/auth/me - Should return current user profile")
    @WithMockUser(username = "11111111-1111-1111-1111-111111111111")
    void getCurrentUser_shouldReturnUserResponse() throws Exception {
        // Arrange
        UUID userId = UUID.fromString("11111111-1111-1111-1111-111111111111");
        // 2. Setup the Entity (DB representation)
        User user = User.builder()
            .id(userId)
            .email("test@example.com")
            .firstName("John")
            .lastName("Doe")
            .phone("+84901234567")
            .kycStatus(KycStatus.APPROVED)
            .kycTier(KycTier.TIER_2)
            .isActive(true)
            // FIX: Use ZonedDateTime.now() instead of Instant.now()
            .createdAt(java.time.ZonedDateTime.now()) 
            .updatedAt(java.time.ZonedDateTime.now()) 
            .build();

        // 3. Setup the Response DTO
        UserResponse response = new UserResponse(
            userId, 
            "test@example.com", 
            "John", 
            "Doe", 
            "+84901234567",
            KycStatus.APPROVED, 
            KycTier.TIER_2, 
            true, 
            OffsetDateTime.now()
        );

        // 4. Mock the REPOSITORY
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // 5. Mock the MAPPER
        // Use any() to ensure it matches even if the ZonedDateTime objects differ slightly in nanoseconds
        when(userMapper.toUserResponse(any(User.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(get("/api/auth/me"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(userId.toString()))
            .andExpect(jsonPath("$.email").value("test@example.com"))
            .andExpect(jsonPath("$.kycTier").value("TIER_2"));
    }
}
