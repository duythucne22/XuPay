package com.fintech.user.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String id;
    private String email;
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private String kycStatus;
    private String accountStatus;
    private Boolean isEmailVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime kycVerifiedAt;
}