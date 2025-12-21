package com.xupay.payment.repository;

import com.xupay.payment.entity.ChartOfAccounts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * ChartOfAccountsRepository
 * Data access for GL account master data.
 */
@Repository
public interface ChartOfAccountsRepository extends JpaRepository<ChartOfAccounts, UUID> {

    Optional<ChartOfAccounts> findByAccountCode(String accountCode);

    boolean existsByAccountCode(String accountCode);
}
