package com.xupay.user.controller;

import com.xupay.user.dto.request.AddContactRequest;
import com.xupay.user.dto.request.CheckLimitRequest;
import com.xupay.user.dto.request.UpdateProfileRequest;
import com.xupay.user.dto.response.*;
import com.xupay.user.entity.User;
import com.xupay.user.entity.UserContact;
import com.xupay.user.exception.UserNotFoundException;
import com.xupay.user.mapper.ContactMapper;
import com.xupay.user.mapper.UserMapper;
import com.xupay.user.repository.UserContactRepository;
import com.xupay.user.repository.UserRepository;
import com.xupay.user.service.LimitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

/**
 * UserController
 * REST API for user profile, limits, and contacts management.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserRepository userRepository;
    private final UserContactRepository userContactRepository;
    private final LimitService limitService;
    private final UserMapper userMapper;
    private final ContactMapper contactMapper;

    /**
     * Get my profile.
     * GET /api/users/me/profile
     */
    @GetMapping("/me/profile")
    public ResponseEntity<ProfileResponse> getMyProfile(Principal principal) {
        UUID userId = UUID.fromString(principal.getName());
        log.debug("User {} fetching their profile", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        
        return ResponseEntity.ok(userMapper.toProfileResponse(user));
    }

    /**
     * Update my profile.
     * PUT /api/users/me/profile
     */
    @PutMapping("/me/profile")
    public ResponseEntity<ProfileResponse> updateMyProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Principal principal) {
        UUID userId = UUID.fromString(principal.getName());
        log.info("User {} updating profile", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        
        // Update fields
        userMapper.updateUserFromRequest(request, user);
        User updated = userRepository.save(user);
        
        return ResponseEntity.ok(userMapper.toProfileResponse(updated));
    }

    /**
     * Get my transaction limits.
     * GET /api/users/me/limits
     */
    @GetMapping("/me/limits")
    public ResponseEntity<UserLimitsResponse> getMyLimits(Principal principal) {
        UUID userId = UUID.fromString(principal.getName());
        log.debug("User {} fetching their transaction limits", userId);
        
        UserLimitsResponse limits = limitService.getUserLimits(userId);
        return ResponseEntity.ok(limits);
    }

    /**
     * Get my daily usage.
     * GET /api/users/me/daily-usage
     */
    @GetMapping("/me/daily-usage")
    public ResponseEntity<DailyUsageResponse> getMyDailyUsage(Principal principal) {
        UUID userId = UUID.fromString(principal.getName());
        log.debug("User {} fetching their daily usage", userId);
        
        DailyUsageResponse usage = limitService.getDailyUsage(userId);
        return ResponseEntity.ok(usage);
    }

    /**
     * Check if transaction is allowed.
     * POST /api/users/me/check-limit
     */
    @PostMapping("/me/check-limit")
    public ResponseEntity<LimitCheckResponse> checkLimit(
            @Valid @RequestBody CheckLimitRequest request,
            Principal principal) {
        UUID userId = UUID.fromString(principal.getName());
        log.debug("User {} checking limit for {} of {} cents", userId, request.type(), request.amountCents());
        
        LimitCheckResponse check = limitService.checkTransactionAllowed(
                userId,
                request.amountCents(),
                request.type()
        );
        return ResponseEntity.ok(check);
    }

    /**
     * Get my contacts (frequent recipients).
     * GET /api/users/me/contacts
     */
    @GetMapping("/me/contacts")
    public ResponseEntity<List<ContactResponse>> getMyContacts(Principal principal) {
        UUID userId = UUID.fromString(principal.getName());
        log.debug("User {} fetching their contacts", userId);
        
        List<UserContact> contacts = userContactRepository.findByUserId(userId);
        return ResponseEntity.ok(contactMapper.toResponseList(contacts));
    }

    /**
     * Add a new contact.
     * POST /api/users/me/contacts
     */
    @PostMapping("/me/contacts")
    public ResponseEntity<ContactResponse> addContact(
            @Valid @RequestBody AddContactRequest request,
            Principal principal) {
        UUID userId = UUID.fromString(principal.getName());
        log.info("User {} adding contact {}", userId, request.contactUserId());
        
        // Fetch both users
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        User contactUser = userRepository.findById(request.contactUserId())
                .orElseThrow(() -> new UserNotFoundException(request.contactUserId()));
        
        // Create contact
        UserContact contact = UserContact.builder()
                .user(user)
                .contactUser(contactUser)
                .nickname(request.nickname())
                .totalTransactions(0)
                .isFavorite(false)
                .build();
        
        UserContact saved = userContactRepository.save(contact);
        return ResponseEntity.status(HttpStatus.CREATED).body(contactMapper.toResponse(saved));
    }

    /**
     * Remove a contact.
     * DELETE /api/users/me/contacts/{contactId}
     */
    @DeleteMapping("/me/contacts/{contactId}")
    public ResponseEntity<Void> removeContact(
            @PathVariable UUID contactId,
            Principal principal) {
        UUID userId = UUID.fromString(principal.getName());
        log.info("User {} removing contact {}", userId, contactId);
        
        UserContact contact = userContactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
        
        // Security check: only owner can delete
        if (!contact.getUser().getId().equals(userId)) {
            log.warn("User {} attempted to delete contact {} owned by {}", userId, contactId, contact.getUser().getId());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        userContactRepository.delete(contact);
        return ResponseEntity.noContent().build();
    }
}
