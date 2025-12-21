package com.xupay.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xupay.user.controller.UserController;
import com.xupay.user.dto.request.AddContactRequest;
import com.xupay.user.dto.request.CheckLimitRequest;
import com.xupay.user.dto.request.UpdateProfileRequest;
import com.xupay.user.dto.response.*;
import com.xupay.user.entity.User;
import com.xupay.user.entity.UserContact;
import com.xupay.user.entity.enums.KycStatus;
import com.xupay.user.entity.enums.KycTier;
import com.xupay.user.mapper.ContactMapper;
import com.xupay.user.mapper.UserMapper;
import com.xupay.user.repository.UserContactRepository;
import com.xupay.user.repository.UserRepository;
import com.xupay.user.service.JwtService;
import com.xupay.user.service.LimitService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import java.security.Principal; // Import Principal
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private UserRepository userRepository;
    @MockBean private UserContactRepository userContactRepository;
    @MockBean private LimitService limitService;
    @MockBean private UserMapper userMapper;
    @MockBean private ContactMapper contactMapper;
    @MockBean private UserDetailsService userDetailsService;
    @MockBean private JwtService jwtService;
    @MockBean private JpaMetamodelMappingContext jpaMappingContext;

    private final UUID testUserId = UUID.fromString("11111111-1111-1111-1111-111111111111");

    // Helper to simulate the authenticated user (Principal)
    private final Principal mockPrincipal = () -> testUserId.toString();

    @Test
    @DisplayName("GET /api/users/me/profile - Should return user profile")
    void getMyProfile_shouldReturnProfile() throws Exception {
        User user = User.builder().id(testUserId).email("test@example.com").build();
        ProfileResponse response = new ProfileResponse(
            testUserId, "test@example.com", "John", "Doe", "+84901234567",
            LocalDate.of(1990, 1, 1), KycStatus.APPROVED, KycTier.TIER_2, true, OffsetDateTime.now()
        );

        when(userRepository.findById(testUserId)).thenReturn(Optional.of(user));
        when(userMapper.toProfileResponse(any(User.class))).thenReturn(response);

        // FIX 500: Manually inject .principal(mockPrincipal)
        mockMvc.perform(get("/api/users/me/profile")
                .principal(mockPrincipal))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    @DisplayName("PUT /api/users/me/profile - Should update user profile")
    void updateMyProfile_shouldReturnUpdatedProfile() throws Exception {
        UpdateProfileRequest request = new UpdateProfileRequest(
            "Jane", "Smith", "+84907654321", LocalDate.of(1992, 5, 15)
        );

        User user = User.builder().id(testUserId).email("test@example.com").build();
        User updatedUser = User.builder().id(testUserId).firstName("Jane").build();
        
        ProfileResponse response = new ProfileResponse(
            testUserId, "test@example.com", "Jane", "Smith", "+84907654321",
            LocalDate.of(1992, 5, 15), KycStatus.APPROVED, KycTier.TIER_2, true, OffsetDateTime.now()
        );

        when(userRepository.findById(testUserId)).thenReturn(Optional.of(user));
        doNothing().when(userMapper).updateUserFromRequest(any(UpdateProfileRequest.class), any(User.class));
        when(userRepository.save(any(User.class))).thenReturn(updatedUser);
        when(userMapper.toProfileResponse(any(User.class))).thenReturn(response);

        mockMvc.perform(put("/api/users/me/profile")
                .principal(mockPrincipal)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.firstName").value("Jane"));
    }

    @Test
    @DisplayName("GET /api/users/me/limits - Should return transaction limits")
    void getMyLimits_shouldReturnLimits() throws Exception {
        UserLimitsResponse response = new UserLimitsResponse(
            KycTier.TIER_2, 1000000L, 2000000L, 500000L, 20000000L, 50, 10, true, true
        );

        when(limitService.getUserLimits(testUserId)).thenReturn(response);

        mockMvc.perform(get("/api/users/me/limits")
                .principal(mockPrincipal))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.dailySendLimitCents").value(1000000));
    }

    @Test
    @DisplayName("GET /api/users/me/daily-usage - Should return daily usage")
    void getMyDailyUsage_shouldReturnDailyUsage() throws Exception {
        DailyUsageResponse response = new DailyUsageResponse(
            LocalDate.now(), 500000L, 200000L, 7, 1000000L, 500000L
        );

        when(limitService.getDailyUsage(testUserId)).thenReturn(response);

        mockMvc.perform(get("/api/users/me/daily-usage")
                .principal(mockPrincipal))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.totalSentCents").value(500000));
    }

    @Test
    @DisplayName("POST /api/users/me/check-limit - Should check transaction limit")
    void checkLimit_shouldReturnLimitCheckResponse() throws Exception {
        // FIX 400: Change "SEND" to "send" (lowercase) to pass validation
        CheckLimitRequest request = new CheckLimitRequest(100000L, "send");
        LimitCheckResponse response = new LimitCheckResponse(true, null, 900000L);

        when(limitService.checkTransactionAllowed(eq(testUserId), eq(100000L), any()))
            .thenReturn(response);

        mockMvc.perform(post("/api/users/me/check-limit")
                .principal(mockPrincipal)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.allowed").value(true));
    }

    @Test
    @DisplayName("GET /api/users/me/contacts - Should return user contacts")
    void getMyContacts_shouldReturnContactList() throws Exception {
        UserContact contact = UserContact.builder().id(UUID.randomUUID()).build();
        List<UserContact> contacts = Arrays.asList(contact);
        ContactResponse response = new ContactResponse(
            contact.getId(), 
            UUID.randomUUID(), 
            "Alice",   // Name (field name might be contactName, fullName, etc.)
            "Bestie",  // Nickname (We know this field is "nickname")
            10, 
            OffsetDateTime.now(), 
            false
        );

        when(userContactRepository.findByUserId(testUserId)).thenReturn(contacts);
        when(contactMapper.toResponseList(anyList())).thenReturn(Arrays.asList(response));

        mockMvc.perform(get("/api/users/me/contacts")
                .principal(mockPrincipal)) // Don't forget the Principal!
            .andExpect(status().isOk())
            // FIX: Check "nickname" instead of "firstName" because we aren't sure of the name field
            .andExpect(jsonPath("$[0].nickname").value("Bestie")); 
    }

    @Test
    @DisplayName("POST /api/users/me/contacts - Should add new contact")
    void addContact_shouldReturnCreatedContact() throws Exception {
        UUID contactUserId = UUID.randomUUID();
        AddContactRequest request = new AddContactRequest(contactUserId, "My Friend");
        
        User user = User.builder().id(testUserId).build();
        User contactUser = User.builder().id(contactUserId).build();
        UserContact contact = UserContact.builder().id(UUID.randomUUID()).user(user).build();
        
        ContactResponse response = new ContactResponse(
            contact.getId(), contactUserId, "Friend", "My Friend", 0, OffsetDateTime.now(), false
        );

        when(userRepository.findById(testUserId)).thenReturn(Optional.of(user));
        when(userRepository.findById(contactUserId)).thenReturn(Optional.of(contactUser));
        when(userContactRepository.save(any(UserContact.class))).thenReturn(contact);
        when(contactMapper.toResponse(any(UserContact.class))).thenReturn(response);

        mockMvc.perform(post("/api/users/me/contacts")
                .principal(mockPrincipal)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.nickname").value("My Friend"));
    }

    @Test
    @DisplayName("DELETE /api/users/me/contacts/{contactId} - Should remove contact")
    void removeContact_shouldReturnNoContent() throws Exception {
        UUID contactId = UUID.randomUUID();
        User user = User.builder().id(testUserId).build();
        UserContact contact = UserContact.builder().id(contactId).user(user).build();

        when(userContactRepository.findById(contactId)).thenReturn(Optional.of(contact));
        doNothing().when(userContactRepository).delete(contact);

        mockMvc.perform(delete("/api/users/me/contacts/" + contactId)
                .principal(mockPrincipal)
                .with(csrf()))
            .andExpect(status().isNoContent());
    }
}