package com.fintech.user.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;
    
    @Column(name = "address_street", length = 255)
    private String addressStreet;
    
    @Column(name = "address_city", length = 100)
    private String addressCity;
    
    @Column(name = "address_state", length = 100)
    private String addressState;
    
    @Column(name = "address_country", length = 100)
    private String addressCountry;
    
    @Column(name = "address_postal_code", length = 20)
    private String addressPostalCode;
    
    @Column(name = "identity_document_type", length = 50)
    private String identityDocumentType;
    
    @Column(name = "identity_document_number", length = 100)
    private String identityDocumentNumber;
    
    @Builder.Default
    @Column(name = "identity_verified")
    private Boolean identityVerified = false;
    
    @Column(name = "identity_verified_at")
    private LocalDateTime identityVerifiedAt;
    
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    
    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;
    
    @Column(name = "biography", columnDefinition = "TEXT")
    private String biography;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}