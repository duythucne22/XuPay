package com.xupay.user.repository;

import com.xupay.user.entity.UserPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * UserPreferenceRepository - Spring Data JPA Repository for UserPreference entity
 * Manages user settings and preferences (1:1 relationship with User).
 */
@Repository
public interface UserPreferenceRepository extends JpaRepository<UserPreference, UUID> {

    /**
     * Find preferences by user ID
     * Due to 1:1 relationship, this will return at most one record
     */
    Optional<UserPreference> findByUserId(UUID userId);

    /**
     * Check if preferences exist for a user
     */
    boolean existsByUserId(UUID userId);

    /**
     * Delete preferences for a user
     */
    void deleteByUserId(UUID userId);
}
