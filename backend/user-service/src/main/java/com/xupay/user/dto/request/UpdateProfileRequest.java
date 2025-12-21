package com.xupay.user.dto.request;

import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * UpdateProfileRequest
 * Request DTO for updating user profile information.
 */
public record UpdateProfileRequest(
    
    @Size(min = 1, max = 100, message = "First name must be between 1 and 100 characters")
    String firstName,
    
    @Size(min = 1, max = 100, message = "Last name must be between 1 and 100 characters")
    String lastName,
    
    @Pattern(regexp = "^\\+[1-9]\\d{1,14}$", message = "Phone must be in E.164 format (+1234567890)")
    String phone,
    
    @Past(message = "Date of birth must be in the past")
    LocalDate dateOfBirth
) {}
