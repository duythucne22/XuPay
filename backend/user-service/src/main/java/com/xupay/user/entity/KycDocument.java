package com.xupay.user.entity;

import com.xupay.user.entity.enums.DocumentType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * KycDocument Entity
 * Represents identity verification documents uploaded by users for KYC verification.
 * Each document goes through a verification workflow: pending → approved/rejected/expired.
 */
@Entity
@Table(name = "kyc_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KycDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false, length = 50)
    private DocumentType documentType;

    @Column(name = "document_number", length = 100)
    private String documentNumber; // Document ID/passport number

    @Column(name = "document_country", length = 3)
    private String documentCountry; // ISO 3166-1 alpha-3 (USA, VNM)

    @Column(name = "file_url", nullable = false, columnDefinition = "TEXT")
    private String fileUrl;

    @Column(name = "file_size_bytes", nullable = false)
    private Long fileSizeBytes;

    @Column(name = "mime_type", length = 100)
    private String mimeType;

    @Column(name = "verification_status", nullable = false, length = 20)
    @Builder.Default
    private String verificationStatus = "pending"; // pending, approved, rejected, expired

    @Column(name = "verification_notes", columnDefinition = "TEXT")
    private String verificationNotes;

    @Column(name = "verified_by")
    private UUID verifiedBy;

    @Column(name = "verified_at")
    private OffsetDateTime verifiedAt;

    @Column(name = "expires_at")
    private OffsetDateTime expiresAt;

    @Column(name = "extracted_data", columnDefinition = "JSONB")
    private String extractedData; // OCR/AI extracted data as JSON string

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    // Business methods

    /**
     * Approve this KYC document
     */
    public void approve(UUID verifierId, String verificationNotes) {
        this.verificationStatus = "approved";
        this.verifiedBy = verifierId;
        this.verifiedAt = OffsetDateTime.now();
        this.verificationNotes = verificationNotes;
    }

    /**
     * Reject this KYC document
     */
    public void reject(UUID verifierId, String verificationNotes) {
        this.verificationStatus = "rejected";
        this.verifiedBy = verifierId;
        this.verifiedAt = OffsetDateTime.now();
        this.verificationNotes = verificationNotes;
    }

    /**
     * Check if document is expired
     */
    public boolean isExpired() {
        return expiresAt != null && OffsetDateTime.now().isAfter(expiresAt);
    }

    /**
     * Check if document is pending verification
     */
    public boolean isPending() {
        return "pending".equals(verificationStatus);
    }

    /**
     * Check if document is approved
     */
    public boolean isApproved() {
        return "approved".equals(verificationStatus);
    }
}
