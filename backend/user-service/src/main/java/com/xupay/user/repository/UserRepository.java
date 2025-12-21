package com.xupay.user.repository;

import com.xupay.user.entity.User;
import com.xupay.user.entity.enums.KycStatus;
import com.xupay.user.entity.enums.KycTier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * UserRepository - Spring Data JPA Repository for User entity
 * Provides CRUD operations and custom queries for User management.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Find user by email (unique constraint)
     */
    Optional<User> findByEmail(String email);

    /**
     * Find user by phone number (unique constraint)
     */
    Optional<User> findByPhone(String phone);

    /**
     * Check if email already exists
     */
    boolean existsByEmail(String email);

    /**
     * Check if phone already exists
     */
    boolean existsByPhone(String phone);

    /**
     * Find all users by KYC status
     */
    List<User> findByKycStatus(KycStatus kycStatus);

    /**
     * Find all users by KYC tier
     */
    List<User> findByKycTier(KycTier kycTier);

    /**
     * Find all active users
     */
    List<User> findByIsActiveTrue();

    /**
     * Find all suspended users
     */
    List<User> findByIsSuspendedTrue();

    /**
     * Find users with fraud score above threshold
     */
    List<User> findByFraudScoreGreaterThanEqual(Integer minScore);

    /**
     * Find users who haven't logged in since a given date
     */
    List<User> findByLastLoginAtBeforeOrLastLoginAtIsNull(OffsetDateTime date);

    /**
     * Find users by KYC status and tier
     */
    List<User> findByKycStatusAndKycTier(KycStatus kycStatus, KycTier kycTier);

    /**
     * Search users by name (first or last name contains search term)
     */
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<User> searchByName(@Param("searchTerm") String searchTerm);

    /**
     * Get users created within a date range
     */
    @Query("SELECT u FROM User u WHERE u.createdAt BETWEEN :startDate AND :endDate")
    List<User> findUsersCreatedBetween(
        @Param("startDate") OffsetDateTime startDate,
        @Param("endDate") OffsetDateTime endDate
    );

    /**
     * Count users by KYC tier (for analytics)
     */
    long countByKycTier(KycTier kycTier);

    /**
     * Count active users
     */
    long countByIsActiveTrue();
}
