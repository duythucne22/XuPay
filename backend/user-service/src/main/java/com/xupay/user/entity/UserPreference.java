package com.xupay.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * UserPreference Entity
 * Stores user settings and preferences (1:1 relationship with User).
 * Each user has exactly one UserPreference record.
 * UNIQUE constraint on user_id enforces this relationship.
 */
@Entity
@Table(name = "user_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "language", length = 10)
    @Builder.Default
    private String language = "en";

    @Column(name = "timezone", length = 50)
    @Builder.Default
    private String timezone = "UTC";

    @Column(name = "currency", length = 3)
    @Builder.Default
    private String currency = "USD";

    @Column(name = "notification_email", nullable = false)
    @Builder.Default
    private Boolean notificationEmail = true;

    @Column(name = "notification_sms", nullable = false)
    @Builder.Default
    private Boolean notificationSms = true;

    @Column(name = "notification_push", nullable = false)
    @Builder.Default
    private Boolean notificationPush = true;

    @Column(name = "two_factor_enabled", nullable = false)
    @Builder.Default
    private Boolean twoFactorEnabled = false;

    @Column(name = "two_factor_method", length = 20)
    private String twoFactorMethod; // sms, totp, email

    @Column(name = "biometric_enabled", nullable = false)
    @Builder.Default
    private Boolean biometricEnabled = false;

    @Column(name = "auto_topup_enabled", nullable = false)
    @Builder.Default
    private Boolean autoTopupEnabled = false;

    @Column(name = "auto_topup_threshold_cents")
    private Long autoTopupThresholdCents;

    @Column(name = "auto_topup_amount_cents")
    private Long autoTopupAmountCents;

    @Column(name = "theme", length = 20)
    @Builder.Default
    private String theme = "light"; // light, dark, auto

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    // Business methods

    /**
     * Enable two-factor authentication
     */
    public void enable2FA(String method) {
        this.twoFactorEnabled = true;
        this.twoFactorMethod = method;
    }

    /**
     * Disable two-factor authentication
     */
    public void disable2FA() {
        this.twoFactorEnabled = false;
        this.twoFactorMethod = null;
    }

    /**
     * Enable all notifications
     */
    public void enableAllNotifications() {
        this.notificationEmail = true;
        this.notificationSms = true;
        this.notificationPush = true;
    }

    /**
     * Disable all notifications
     */
    public void disableAllNotifications() {
        this.notificationEmail = false;
        this.notificationSms = false;
        this.notificationPush = false;
    }

    /**
     * Configure auto top-up
     */
    public void configureAutoTopup(Long thresholdCents, Long topupAmountCents) {
        this.autoTopupEnabled = true;
        this.autoTopupThresholdCents = thresholdCents;
        this.autoTopupAmountCents = topupAmountCents;
    }

    /**
     * Disable auto top-up
     */
    public void disableAutoTopup() {
        this.autoTopupEnabled = false;
        this.autoTopupThresholdCents = null;
        this.autoTopupAmountCents = null;
    }

    /**
     * Update language and timezone together
     */
    public void updateLocalization(String language, String timezone) {
        this.language = language;
        this.timezone = timezone;
    }

    /**
     * Check if user should receive email notifications
     */
    public boolean shouldSendEmail() {
        return notificationEmail;
    }

    /**
     * Check if user should receive SMS notifications
     */
    public boolean shouldSendSms() {
        return notificationSms;
    }

    /**
     * Check if user should receive push notifications
     */
    public boolean shouldSendPush() {
        return notificationPush;
    }
}
