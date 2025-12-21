package com.xupay.payment.entity;

import com.xupay.payment.entity.enums.EntryType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * LedgerEntry
 * Double-entry journal entries (IMMUTABLE).
 * Maps to: ledger_entries table
 * 
 * CRITICAL RULES:
 * 1. Entries are IMMUTABLE (never updated, only reversed)
 * 2. For each transaction_id: Sum(DEBIT) = Sum(CREDIT)
 * 3. Database constraint trigger validates balance
 * 4. Balance is calculated from these entries, never stored
 */
@Entity
@Table(name = "ledger_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LedgerEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "transaction_id", nullable = false)
    private UUID transactionId;

    @Column(name = "gl_account_code", nullable = false, length = 20)
    private String glAccountCode;

    @Column(name = "wallet_id")
    private UUID walletId;  // NULL for system accounts

    @Enumerated(EnumType.STRING)
    @Column(name = "entry_type", nullable = false, length = 10)
    private EntryType entryType;

    @Column(name = "amount_cents", nullable = false)
    private Long amountCents;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_reversed", nullable = false)
    private Boolean isReversed = false;

    @Column(name = "reversed_by_entry_id")
    private UUID reversedByEntryId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
