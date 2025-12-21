package com.xupay.user.repository;

import com.xupay.user.entity.KycDocument;
import com.xupay.user.entity.User;
import com.xupay.user.entity.enums.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * KycDocumentRepository - Spring Data JPA Repository for KycDocument entity
 * Handles KYC document storage and verification workflow queries.
 */
@Repository
public interface KycDocumentRepository extends JpaRepository<KycDocument, UUID> {

    /**
     * Find all documents for a specific user
     */
    List<KycDocument> findByUser(User user);

    /**
     * Find all documents for a user by user ID
     */
    List<KycDocument> findByUserId(UUID userId);

    /**
     * Find documents by user and document type
     */
    List<KycDocument> findByUserIdAndDocumentType(UUID userId, DocumentType documentType);

    /**
     * Find documents by verification status
     */
    List<KycDocument> findByVerificationStatus(String verificationStatus);

    /**
     * Find pending documents (for admin review queue)
     */
    List<KycDocument> findByVerificationStatusOrderByCreatedAtAsc(String verificationStatus);

    /**
     * Find user's approved documents
     */
    List<KycDocument> findByUserIdAndVerificationStatus(UUID userId, String verificationStatus);

    /**
     * Find documents expiring soon (within next N days)
     */
    @Query("SELECT d FROM KycDocument d WHERE d.expiresAt IS NOT NULL " +
           "AND d.expiresAt BETWEEN :now AND :futureDate " +
           "AND d.verificationStatus = 'approved'")
    List<KycDocument> findDocumentsExpiringSoon(
        @Param("now") OffsetDateTime now,
        @Param("futureDate") OffsetDateTime futureDate
    );

    /**
     * Find expired documents that need status update
     */
    @Query("SELECT d FROM KycDocument d WHERE d.expiresAt IS NOT NULL " +
           "AND d.expiresAt < :now " +
           "AND d.verificationStatus != 'expired'")
    List<KycDocument> findExpiredDocuments(@Param("now") OffsetDateTime now);

    /**
     * Check if user has any approved documents
     */
    boolean existsByUserIdAndVerificationStatus(UUID userId, String verificationStatus);

    /**
     * Count documents by verification status (for analytics)
     */
    long countByVerificationStatus(String verificationStatus);

    /**
     * Find documents verified by a specific admin
     */
    List<KycDocument> findByVerifiedBy(UUID verifierId);

    /**
     * Get latest document for user and document type
     */
    Optional<KycDocument> findFirstByUserIdAndDocumentTypeOrderByCreatedAtDesc(
        UUID userId,
        DocumentType documentType
    );
}
