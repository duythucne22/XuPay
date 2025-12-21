package com.xupay.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * UserContact Entity
 * Represents frequently used recipient contacts for quick transfers.
 * Self-referencing relationship: user -> contact_user (both are User entities).
 * Constraint: user cannot add themselves as a contact.
 */
@Entity
@Table(
    name = "user_contacts",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "contact_user_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserContact {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_user_id", nullable = false)
    private User contactUser;

    @Column(name = "nickname", length = 100)
    private String nickname;

    @Column(name = "total_transactions", nullable = false)
    @Builder.Default
    private Integer totalTransactions = 0;

    @Column(name = "last_transaction_at")
    private OffsetDateTime lastTransactionAt;

    @Column(name = "is_favorite", nullable = false)
    @Builder.Default
    private Boolean isFavorite = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    // Business methods

    /**
     * Increment transaction count when a transfer is made to this contact
     */
    public void recordTransaction() {
        this.totalTransactions++;
        this.lastTransactionAt = OffsetDateTime.now();
    }

    /**
     * Toggle favorite status
     */
    public void toggleFavorite() {
        this.isFavorite = !this.isFavorite;
    }

    /**
     * Update nickname
     */
    public void updateNickname(String newNickname) {
        this.nickname = newNickname;
    }

    /**
     * Get display name (nickname if set, otherwise contact's full name)
     */
    public String getDisplayName() {
        if (nickname != null && !nickname.isEmpty()) {
            return nickname;
        }
        return contactUser.getFullName();
    }

    /**
     * Check if this contact has been used recently (within last 30 days)
     */
    public boolean isRecentlyUsed() {
        if (lastTransactionAt == null) {
            return false;
        }
        return lastTransactionAt.isAfter(OffsetDateTime.now().minusDays(30));
    }

    /**
     * Validate that user is not adding themselves as a contact
     */
    @PrePersist
    @PreUpdate
    private void validateNotSelfContact() {
        if (user.getId().equals(contactUser.getId())) {
            throw new IllegalStateException("User cannot add themselves as a contact");
        }
    }
}
