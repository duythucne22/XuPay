package com.xupay.payment.entity;

import com.xupay.payment.entity.enums.WalletType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Wallet
 * User wallet accounts linked to Chart of Accounts.
 * Maps to: wallets table
 * 
 * IMPORTANT: Balance is NEVER stored here.
 * Balance is calculated from ledger_entries using get_wallet_balance() function.
 */
@Entity
@Table(name = "wallets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;  // Links to User Service (no FK)

    @Column(name = "gl_account_code", nullable = false, length = 20)
    private String glAccountCode;  // Links to chart_of_accounts

    @Enumerated(EnumType.STRING)
    @Column(name = "wallet_type", nullable = false, length = 20)
    private WalletType walletType;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency = "VND";

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "is_frozen", nullable = false)
    private Boolean isFrozen = false;

    @Column(name = "freeze_reason", columnDefinition = "TEXT")
    private String freezeReason;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
