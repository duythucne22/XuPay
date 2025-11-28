package com.fintech.user.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false, unique = true, length = 255)
    private String email;
    
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;
    
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;
    
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;
    
    @Builder.Default
    @Column(name = "kyc_status", nullable = false, length = 50)
    private String kycStatus = "pending";
    
    @Column(name = "kyc_verified_at")
    private LocalDateTime kycVerifiedAt;
    
    @Column(name = "kyc_document_hash", length = 255)
    private String kycDocumentHash;
    
    @Builder.Default
    @Column(name = "account_status", nullable = false, length = 50)
    private String accountStatus = "active";
    
    @Builder.Default
    @Column(name = "is_email_verified")
    private Boolean isEmailVerified = false;
    
    @Column(name = "email_verified_at")
    private LocalDateTime emailVerifiedAt;
    
    @Column(name = "account_created_at", updatable = false)
    private LocalDateTime accountCreatedAt;
    
    @Column(name = "account_updated_at")
    private LocalDateTime accountUpdatedAt;
    
    @Builder.Default
    @Column(name = "metadata", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String metadata = "{}";
    
    @PrePersist
    protected void onCreate() {
        accountCreatedAt = LocalDateTime.now();
        accountUpdatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        accountUpdatedAt = LocalDateTime.now();
    }
    
    // Helper methods
    public boolean isKycApproved() {
        return "approved".equals(kycStatus);
    }
    
    public boolean isAccountActive() {
        return "active".equals(accountStatus);
    }
}