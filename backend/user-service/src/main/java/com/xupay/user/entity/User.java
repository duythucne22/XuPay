package com.xupay.user.entity;

import com.xupay.user.entity.enums.KycStatus;
import com.xupay.user.entity.enums.KycTier;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.UUID;

/**
 * User entity - Core user accounts with KYC tiers and fraud tracking
 * Database table: users
 */
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
    
    // Contact Information
    @Column(nullable = false, unique = true, length = 255)
    private String email;
    
    @Column(unique = true, length = 20)
    private String phone;
    
    // Profile Information
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;
    
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;
    
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    
    @Column(length = 3)
    private String nationality;  // ISO 3166-1 alpha-3 (USA, VNM, etc.)
    
    // Authentication
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;
    
    // KYC Status and Tier
    @Enumerated(EnumType.STRING)
    @Column(name = "kyc_status", nullable = false, length = 20)
    @Builder.Default
    private KycStatus kycStatus = KycStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "kyc_tier", nullable = false, length = 20)
    @Builder.Default
    private KycTier kycTier = KycTier.TIER_0;
    
    @Column(name = "kyc_verified_at")
    private ZonedDateTime kycVerifiedAt;
    
    @Column(name = "kyc_verified_by")
    private UUID kycVerifiedBy;  // Admin user ID who verified
    
    // Account State
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
    
    @Column(name = "is_suspended", nullable = false)
    @Builder.Default
    private Boolean isSuspended = false;
    
    @Column(name = "suspension_reason", columnDefinition = "TEXT")
    private String suspensionReason;
    
    // Fraud Tracking
    @Column(name = "fraud_score", nullable = false)
    @Builder.Default
    private Integer fraudScore = 0;  // 0-100
    
    // Metadata
    @Column(name = "ip_address_registration", columnDefinition = "inet")
    private String ipAddressRegistration;
    
    @Column(name = "user_agent_registration", columnDefinition = "TEXT")
    private String userAgentRegistration;
    
    // Timestamps
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private ZonedDateTime updatedAt;
    
    @Column(name = "last_login_at")
    private ZonedDateTime lastLoginAt;
    
    // Business Methods
    
    /**
     * Check if user can transact based on KYC status and account state
     */
    public boolean canTransact() {
        return isActive 
            && !isSuspended 
            && kycStatus == KycStatus.APPROVED;
    }
    
    /**
     * Check if user KYC status is PENDING
     */
    public boolean isPending() {
        return kycStatus == KycStatus.PENDING;
    }
    
    /**
     * Activate user account
     */
    public void activate() {
        this.isActive = true;
        this.isSuspended = false;
        this.suspensionReason = null;
    }
    
    /**
     * Suspend user account
     */
    public void suspend(String reason) {
        this.isSuspended = true;
        this.suspensionReason = reason;
    }
    
    /**
     * Approve KYC and set tier
     */
    public void approveKyc(KycTier tier, UUID approvedBy) {
        this.kycStatus = KycStatus.APPROVED;
        this.kycTier = tier;
        this.kycVerifiedAt = ZonedDateTime.now();
        this.kycVerifiedBy = approvedBy;
    }
    
    /**
     * Reject KYC
     */
    public void rejectKyc() {
        this.kycStatus = KycStatus.REJECTED;
        this.kycVerifiedAt = ZonedDateTime.now();
    }
    
    /**
     * Update fraud score
     */
    public void updateFraudScore(int score) {
        if (score < 0 || score > 100) {
            throw new IllegalArgumentException("Fraud score must be between 0 and 100");
        }
        this.fraudScore = score;
    }
    
    /**
     * Update last login timestamp
     */
    public void updateLastLogin() {
        this.lastLoginAt = ZonedDateTime.now();
    }
    
    /**
     * Get full name
     */
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
