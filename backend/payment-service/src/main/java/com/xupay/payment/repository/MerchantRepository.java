package com.xupay.payment.repository;

import com.xupay.payment.entity.Merchant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * MerchantRepository
 * Data access for merchant accounts.
 */
@Repository
public interface MerchantRepository extends JpaRepository<Merchant, UUID> {

    Optional<Merchant> findByUserId(UUID userId);

    Optional<Merchant> findByWalletId(UUID walletId);

    boolean existsByUserId(UUID userId);
}
