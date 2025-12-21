package com.xupay.payment.repository;

import com.xupay.payment.entity.LedgerEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * LedgerEntryRepository
 * Data access for ledger entries (IMMUTABLE).
 * 
 * WARNING: Never update or delete ledger entries.
 * To reverse, create new entries with is_reversed=true.
 */
@Repository
public interface LedgerEntryRepository extends JpaRepository<LedgerEntry, UUID> {

    List<LedgerEntry> findByTransactionId(UUID transactionId);

    List<LedgerEntry> findByWalletIdOrderByCreatedAtDesc(UUID walletId);

    List<LedgerEntry> findByGlAccountCodeOrderByCreatedAtDesc(String glAccountCode);
}
