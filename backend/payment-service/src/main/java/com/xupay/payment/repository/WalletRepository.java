package com.xupay.payment.repository;

import com.xupay.payment.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * WalletRepository
 * Data access for user wallets.
 * 
 * IMPORTANT: Balance is NOT stored in wallet table.
 * Use get_wallet_balance() function for balance queries.
 */
@Repository
public interface WalletRepository extends JpaRepository<Wallet, UUID> {

    Optional<Wallet> findByUserId(UUID userId);

    boolean existsByUserId(UUID userId);

    /**
     * Get wallet balance using PostgreSQL function.
     * Returns amount in cents.
     */
    @Query(value = "SELECT get_wallet_balance(:walletId)", nativeQuery = true)
    Long getBalance(@Param("walletId") UUID walletId);
}
