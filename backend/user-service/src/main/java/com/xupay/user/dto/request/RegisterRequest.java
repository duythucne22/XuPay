package com.xupay.user.dto.request;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

/**
 * RegisterRequest DTO
 * Request body for user registration endpoint.
 */
public record RegisterRequest(
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    String email,

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
        message = "Password must contain at least one uppercase letter, one lowercase letter, and one digit"
    )
    String password,

    @NotBlank(message = "First name is required")
    @Size(min = 1, max = 100, message = "First name must be between 1 and 100 characters")
    String firstName,

    @NotBlank(message = "Last name is required")
    @Size(min = 1, max = 100, message = "Last name must be between 1 and 100 characters")
    String lastName,

    @Pattern(
        regexp = "^\\+?[1-9]\\d{1,14}$",
        message = "Phone must be in E.164 format (e.g., +1234567890)"
    )
    String phone,

    @Past(message = "Date of birth must be in the past")
    LocalDate dateOfBirth
) {
}
