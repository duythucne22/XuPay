package com.xupay.user.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

/**
 * AddContactRequest
 * Request DTO for adding a frequent contact/recipient.
 */
public record AddContactRequest(
    
    @NotNull(message = "Contact user ID is required")
    UUID contactUserId,
    
    @Size(max = 100, message = "Nickname must not exceed 100 characters")
    String nickname
) {}
